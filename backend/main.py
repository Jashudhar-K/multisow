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

# ML imports (graceful fallback)
try:
    from multisow.ml.routers import predict as ml_predict
    from multisow.ml.routers import explain as ml_explain
    from multisow.ml.routers import train as ml_train
    from multisow.ml.routers import data as ml_data
    from multisow.ml.routers import optimize as ml_optimize
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
            ml_predict.set_fohem_system(fohem_system)
            ml_train.set_train_deps(fohem_system, feature_store)
            ml_data.set_data_deps(
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
            ml_explain.set_explain_deps(
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Simplified for the integrated environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------
# Mount ML routers (graceful skip if imports failed)
# -----------------------------------------------------------------------
if HAS_ML:
    app.include_router(ml_predict.router)
    app.include_router(ml_explain.router)
    app.include_router(ml_train.router)
    app.include_router(ml_data.router)
    app.include_router(ml_optimize.router)
    logger.info("ML routers mounted at /ml/*")


# Mount NLP router
app.include_router(nlp_router.router)

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
    Returns all 6 regional preset models (for /presets, not /api/presets).
    Mirrors the advisor._preset_candidates() output.
    """
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
    return [
        {
            "id": "wayanad-classic",
            "name": "Wayanad Classic",
            "description": "Traditional Kerala multi-tier system optimized for tropical climate.",
            "region": "Wayanad, Kerala",
            "soilType": "laterite",
            "difficulty": "Beginner",
            "acres": 2,
            "estimatedYield": "390 Quintals",
            "estimatedRevenue": "₹13.5L/year",
            "color": "#10b981",
            "cropSchedule": {
                "overstory": {"crop": "Coconut Palm", "spacing": 8, "plants": 146},
                "middle": {"crop": "Banana", "spacing": 3, "plants": 900},
                "understory": {"crop": "Turmeric", "spacing": 50, "plants": 45000},
                "vertical": {"crop": "Black Pepper", "perTree": 2, "total": 292}
            }
        },
        {
            "id": "karnataka-spice",
            "name": "Karnataka Spice Garden",
            "description": "High-value spice-focused model ideal for coffee-growing regions.",
            "region": "Coorg, Karnataka",
            "soilType": "laterite",
            "difficulty": "Intermediate",
            "acres": 3,
            "estimatedYield": "510 Quintals",
            "estimatedRevenue": "₹7.8L/year",
            "color": "#f59e0b",
            "cropSchedule": {
                "overstory": {"crop": "Silver Oak", "spacing": 10, "plants": 140},
                "middle": {"crop": "Papaya", "spacing": 2.5, "plants": 1940},
                "understory": {"crop": "Cardamom", "spacing": 40, "plants": 55000},
                "vertical": {"crop": "Vanilla", "perTree": 3, "total": 420}
            }
        },
        {
            "id": "maharashtra-balanced",
            "name": "Maharashtra Coconut-Mango",
            "description": "Balanced system with coconut palms and premium fruits.",
            "region": "Konkan, Maharashtra",
            "soilType": "black",
            "difficulty": "Intermediate",
            "acres": 2.5,
            "estimatedYield": "520 Quintals",
            "estimatedRevenue": "₹26.2L/year",
            "color": "#06b6d4",
            "cropSchedule": {
                "overstory": {"crop": "Coconut Palm", "spacing": 8, "plants": 182},
                "middle": {"crop": "Mango", "spacing": 3, "plants": 1000},
                "understory": {"crop": "Turmeric", "spacing": 50, "plants": 55000},
                "vertical": {"crop": "Black Pepper", "perTree": 2, "total": 364}
            }
        }
    ]

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
