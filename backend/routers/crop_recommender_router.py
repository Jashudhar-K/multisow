"""
FastAPI router for the Crop Recommender feature.

Prefix  : /api/crop-recommender
Tag     : Crop Recommender

Endpoints
---------
POST /api/crop-recommender/predict
    Accept seven soil/climate features and return the recommended crop with
    an optional confidence score.

GET  /api/crop-recommender/health
    Lightweight liveness probe that also reports whether the model artefacts
    are present on disk.
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Artefact paths (mirrored from inference module so health check is fast)
# ---------------------------------------------------------------------------
_REPO_ROOT = Path(__file__).resolve().parents[2]
_SAVE_DIR = _REPO_ROOT / "multisow" / "ml" / "models" / "saved"
_MODEL_FILE = _SAVE_DIR / "crop_recommender_model.joblib"
_SCALER_FILE = _SAVE_DIR / "crop_recommender_scaler.joblib"

# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------
router = APIRouter(prefix="/api/crop-recommender", tags=["Crop Recommender"])


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class CropRecommendRequest(BaseModel):
    """Input features for crop recommendation."""

    n: float = Field(..., ge=0, description="Nitrogen content of the soil (kg/ha)")
    p: float = Field(..., ge=0, description="Phosphorous content of the soil (kg/ha)")
    k: float = Field(..., ge=0, description="Potassium content of the soil (kg/ha)")
    temperature: float = Field(
        ..., ge=-10, le=60, description="Mean air temperature in °C (range: -10 to 60)"
    )
    humidity: float = Field(
        ..., ge=0, le=100, description="Relative humidity in % (range: 0 to 100)"
    )
    ph: float = Field(..., ge=0, le=14, description="Soil pH value (range: 0 to 14)")
    rainfall: float = Field(..., ge=0, description="Annual rainfall in mm")


class CropRecommendResponse(BaseModel):
    """Prediction output returned to the caller."""

    recommended_crop: str = Field(..., description="Predicted crop label")
    confidence: Optional[float] = Field(
        None, description="Probability of the predicted class (null if unavailable)"
    )
    input_features: dict = Field(..., description="Echo of the seven input feature values")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/predict", response_model=CropRecommendResponse, summary="Recommend a crop")
def predict_crop(body: CropRecommendRequest) -> CropRecommendResponse:
    """Accept soil and climate features and return the recommended crop.

    - **503** if the model has not been trained yet (artefacts missing).
    - **500** for any unexpected runtime error.
    """
    try:
        # Import deferred to allow the app to start even before training
        from multisow.ml.inference.crop_recommender import recommend_crop

        result = recommend_crop(
            N=body.n,
            P=body.p,
            K=body.k,
            temperature=body.temperature,
            humidity=body.humidity,
            ph=body.ph,
            rainfall=body.rainfall,
        )
        return CropRecommendResponse(**result)

    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=(
                "Crop recommender model is not available. "
                "Please run `python -m multisow.ml.pipelines.train_crop_recommender` "
                f"to train and save the model first. Details: {exc}"
            ),
        ) from exc

    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during prediction: {exc}",
        ) from exc


@router.get("/health", summary="Health check for the Crop Recommender")
def health() -> dict:
    """Return service health and whether the model artefacts are present."""
    model_loaded = _MODEL_FILE.exists() and _SCALER_FILE.exists()
    return {"status": "ok", "model_loaded": model_loaded}
