"""
FastAPI router for the Crop Library v2 feature.

Prefix : /api/crops-v2
Tag    : Crop Library

Endpoints
---------
GET  /api/crops-v2/all
GET  /api/crops-v2/stats
GET  /api/crops-v2/{crop_name}/compatible
GET  /api/crops-v2/layer/{layer_name}
POST /api/crops-v2/recommend
POST /api/crops-v2/recommend-for-layer
POST /api/crops-v2/ai-extend
GET  /api/crops-v2/health
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Artefact paths for health check
# ---------------------------------------------------------------------------
_REPO_ROOT = Path(__file__).resolve().parents[2]
_SAVE_DIR = _REPO_ROOT / "multisow" / "ml" / "models" / "saved"
_MODEL_FILE = _SAVE_DIR / "crop_recommender_model.joblib"
_SCALER_FILE = _SAVE_DIR / "crop_recommender_scaler.joblib"

# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------
router = APIRouter(prefix="/api/crops-v2", tags=["Crop Library"])


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class CropInputRequest(BaseModel):
    """Soil and climate inputs for crop recommendation."""

    n: float = Field(..., ge=0, description="Nitrogen (kg/ha)")
    p: float = Field(..., ge=0, description="Phosphorous (kg/ha)")
    k: float = Field(..., ge=0, description="Potassium (kg/ha)")
    temperature: float = Field(..., ge=-10, le=60, description="Mean temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity (%)")
    ph: float = Field(..., ge=0, le=14, description="Soil pH (0–14)")
    rainfall: float = Field(..., ge=0, description="Annual rainfall (mm)")


class LayerRecommendRequest(CropInputRequest):
    """Layer-specific recommendation request."""

    layer: str = Field(..., description="Intercropping layer: canopy / midstory / understory / groundcover")


class AIExtendRequest(BaseModel):
    """AI extension request."""

    crops: list[str] = Field(..., min_length=1, description="Crop list to extend")
    context: str = Field(default="", description="Optional agronomic context")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/all", summary="List all crops in the library")
def get_all_crops_endpoint():
    """Return sorted list of unique crop labels from the dataset."""
    from multisow.ml.data.crop_library import get_all_crops
    crops = get_all_crops()
    return {"crops": crops, "count": len(crops)}


@router.get("/stats", summary="Mean feature stats for every crop")
def get_all_stats():
    """Return mean N/P/K/temperature/humidity/ph/rainfall for all crops."""
    from multisow.ml.data.crop_library import get_all_crop_stats
    return get_all_crop_stats()


@router.get("/layer/{layer_name}", summary="Crops mapped to an intercropping layer")
def get_layer_crops(layer_name: str):
    """Return crops that match the specified intercropping layer profile.

    Valid layer names: ``canopy``, ``midstory``, ``understory``, ``groundcover``.
    """
    valid = {"canopy", "midstory", "understory", "groundcover"}
    if layer_name not in valid:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid layer '{layer_name}'. Choose from: {sorted(valid)}.",
        )
    from multisow.ml.data.crop_library import get_crops_by_layer
    crops = get_crops_by_layer(layer_name)
    return {"layer": layer_name, "crops": crops}


@router.get("/{crop_name}/compatible", summary="Top compatible crops for intercropping")
def get_compatible_crops(
    crop_name: str,
    top_n: int = Query(default=5, ge=1, le=20, description="Number of results"),
):
    """Return the *top_n* most compatible crops for intercropping with *crop_name*."""
    from multisow.ml.data.crop_library import find_compatible_crops, get_all_crops
    if crop_name not in get_all_crops():
        raise HTTPException(status_code=404, detail=f"Crop '{crop_name}' not found in library.")
    compatible = find_compatible_crops(crop_name, top_n=top_n)
    return {"crop": crop_name, "compatible": compatible}


@router.post("/recommend", summary="AI crop recommendation from soil/climate inputs")
def recommend_crop_endpoint(body: CropInputRequest):
    """Predict the most suitable crop and return compatible library crops.

    - **503** if the model has not been trained yet.
    - **500** for unexpected errors.
    """
    try:
        from multisow.ml.inference.crop_recommender import recommend_crop
        return recommend_crop(
            N=body.n, P=body.p, K=body.k,
            temperature=body.temperature, humidity=body.humidity,
            ph=body.ph, rainfall=body.rainfall,
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Model not trained. Run train_crop_recommender.py first. {exc}",
        ) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/recommend-for-layer", summary="Layer-specific crop recommendations")
def recommend_for_layer_endpoint(body: LayerRecommendRequest):
    """Return the top compatible crops for a specific intercropping layer."""
    valid = {"canopy", "midstory", "understory", "groundcover"}
    if body.layer not in valid:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid layer '{body.layer}'. Choose from: {sorted(valid)}.",
        )
    try:
        from multisow.ml.inference.crop_recommender import recommend_for_layer
        return recommend_for_layer(
            layer=body.layer,
            N=body.n, P=body.p, K=body.k,
            temperature=body.temperature, humidity=body.humidity,
            ph=body.ph, rainfall=body.rainfall,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/ai-extend", summary="AI-suggested crops beyond the dataset")
def ai_extend_endpoint(body: AIExtendRequest):
    """Ask the Anthropic API to suggest additional compatible crops.

    Gracefully returns a fallback response (never HTTP error) if Anthropic
    is unavailable.
    """
    try:
        from multisow.ml.inference.crop_recommender import extend_with_ai
        return extend_with_ai(crop_list=body.crops, context=body.context)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        # Return degraded fallback, don't propagate
        return {
            "ai_suggested_crops": [],
            "source": "fallback",
            "based_on_crops": body.crops,
            "error": str(exc),
        }


@router.get("/health", summary="Health check for the Crop Library service")
def health():
    """Return service status and model/library availability."""
    from multisow.ml.data.crop_library import get_all_crops
    try:
        crop_count = len(get_all_crops())
        library_loaded = True
    except Exception:
        crop_count = 0
        library_loaded = False

    model_loaded = _MODEL_FILE.exists() and _SCALER_FILE.exists()
    return {
        "status": "ok",
        "model_loaded": model_loaded,
        "crop_count": crop_count,
        "library_loaded": library_loaded,
    }
