from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import List
from contextlib import asynccontextmanager
import logging
import os
from pathlib import Path
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env.local")
load_dotenv(PROJECT_ROOT / ".env")


from . import models, schemas, crud, database, ai_advisor
from .routers import nlp as nlp_router
from .routers import crop_recommender_router
from .routers import crop_library_router
from .data.preset_generator import generate_presets

# ML imports (graceful fallback)
try:
    from multisow.ml.routers.ml_routes import (
        all_ml_routers,
        set_fohem_system,
        set_train_deps,
        set_data_deps,
        set_explain_deps,
    )
    from multisow.ml.models.fohem import FOHEMSystem
    from multisow.ml.pipelines.feature_store import FeatureStore
    from multisow.ml.pipelines.ingest import (
        IoTSensorIngester,
        ManualRecordIngester,
        ClimateDataIngester,
    )
    HAS_ML = True
except ImportError as _ml_err:
    HAS_ML = False
    logging.getLogger(__name__).warning("ML modules unavailable: %s", _ml_err)

logger = logging.getLogger(__name__)

# Create tables (includes new ML tables)
models.Base.metadata.create_all(bind=database.engine)


# ---------------------------------------------------------------------------
# Lifespan: bootstrap FOHEM + inject deps into routers
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: seed strata, initialise FOHEM system, wire router deps."""
    # Seed strata
    db = database.SessionLocal()
    try:
        for name in ["Overstory", "Middle", "Understory", "Vertical"]:
            if not crud.get_stratum_by_name(db, name):
                crud.create_stratum(db, schemas.StratumBase(name=name, description=f"{name} layer"))
    finally:
        db.close()

    # Bootstrap ML (non-blocking, all try/except)
    if HAS_ML:
        try:
            fohem_system = FOHEMSystem()
            feature_store = FeatureStore()

            # Wire router dependencies
            set_fohem_system(fohem_system)
            set_train_deps(fohem_system, feature_store)
            set_data_deps(
                sensor_ingester=IoTSensorIngester(
                    url=os.getenv("MULTISOW_INFLUXDB_URL", "http://localhost:8086"),
                    token=os.getenv("MULTISOW_INFLUXDB_TOKEN", ""),
                    org=os.getenv("MULTISOW_INFLUXDB_ORG", "multisow"),
                    bucket=os.getenv("MULTISOW_INFLUXDB_BUCKET", "sensor_data"),
                ),
                manual_ingester=ManualRecordIngester(),
                climate_ingester=ClimateDataIngester(),
                feature_store=feature_store,
            )
            set_explain_deps(
                fohem_system=fohem_system,
                shap_explainers={},
                lime_explainers={},
            )

            bootstrap = os.getenv("MULTISOW_FOHEM_BOOTSTRAP_ON_STARTUP", "false").lower() == "true"
            if bootstrap:
                logger.info("FOHEM bootstrap requested — will train on synthetic data if available")
                # Deferred: actual training happens via /ml/train endpoint

            logger.info("ML subsystem initialised (FOHEM layers: %d)", len(fohem_system.models))
        except Exception as exc:
            logger.warning("ML bootstrap failed (app continues without ML): %s", exc)

    # NLP startup check
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    if not anthropic_key:
        logger.warning("ANTHROPIC_API_KEY not set — NLP endpoints will run in fallback mode.")

    yield  # App runs here

    logger.info("Shutting down MultiSow")


app = FastAPI(
    title="Multi-Tier Crop Management System",
    description="AI-enhanced platform for multi-tier intercropping optimization",
    version="2.0.0",
    lifespan=lifespan,
)

_raw_origins = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:3001,http://localhost:3000",
)
_allow_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------
# Mount ML routers (graceful skip if imports failed)
# -----------------------------------------------------------------------
if HAS_ML:
    for ml_router in all_ml_routers:
        app.include_router(ml_router)
    logger.info("ML routers mounted at /ml/*")


# Mount NLP router
app.include_router(nlp_router.router)

# Mount Crop Recommender router (standalone, independent of FOHEM/ML subsystem)
app.include_router(crop_recommender_router.router)

# Mount Crop Library router (dataset-driven crop knowledge API)
app.include_router(crop_library_router.router)

# Root redirect to frontend
@app.get("/")
def root():
    return RedirectResponse(url="/docs")

# Health check endpoint
@app.get("/health")
@app.head("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running", "version": "2.0.0"}

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# AI Advisor Instance
advisor = ai_advisor.AIStratificationAdvisor()
# --- /presets endpoint for frontend/test compatibility ---
@app.get("/presets")
def get_presets_root():
    """
    Returns preset intercropping models derived from the crop dataset.
    Mirrors the advisor._preset_candidates() output.
    """
    try:
        return generate_presets()
    except Exception:
        return advisor._preset_candidates()

@app.post("/api/crops/", response_model=schemas.Crop)
def create_crop(crop: schemas.CropCreate, db: Session = Depends(get_db)):
    return crud.create_crop(db=db, crop=crop)

@app.get("/api/crops/", response_model=List[schemas.Crop])
def read_crops(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_crops(db, skip=skip, limit=limit)

@app.post("/api/plots/", response_model=schemas.Plot)
def create_plot(plot: schemas.PlotCreate, db: Session = Depends(get_db)):
    return crud.create_plot(db=db, plot=plot)

@app.get("/api/plots/{plot_id}", response_model=schemas.Plot)
def read_plot(plot_id: int, db: Session = Depends(get_db)):
    db_plot = crud.get_plot(db, plot_id=plot_id)
    if db_plot is None:
        raise HTTPException(status_code=404, detail="Plot not found")
    return db_plot

@app.post("/api/plots/{plot_id}/crops", response_model=schemas.PlotCrop)
def add_crop_to_plot(plot_id: int, plot_crop: schemas.PlotCropCreate, db: Session = Depends(get_db)):
    return crud.add_crop_to_plot(db=db, plot_crop=plot_crop, plot_id=plot_id)

@app.get("/api/plots/{plot_id}/analyze")
def analyze_plot(plot_id: int, db: Session = Depends(get_db)):
    return advisor.analyze_plot(plot_id, db)

@app.get("/api/presets", response_model=List[dict])
def get_presets():
    """Return dataset-derived intercropping presets (falls back to hardcoded on error)."""
    try:
        return generate_presets()
    except Exception:
        return advisor._preset_candidates()

@app.post("/api/ai/plan", response_model=schemas.AIPlanResponse)
def ai_plan(req: schemas.AIPlanRequest):
    try:
        plan = advisor.generate_full_plan(
            acres=req.acres,
            soil_type=req.soil_type,
            budget_inr=req.budget_inr,
            goal=req.goal or "maximize_profit",
        )
        return plan
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/ai/analyze")
def ai_analyze(config: dict):
    return advisor.analyze_configuration(config)
