"""
Pydantic response schemas for FOHEM predictions and SHAP/LIME explanations.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# SHAP / LIME output schemas
# ---------------------------------------------------------------------------

class SHAPFeatureContribution(BaseModel):
    """Single feature contribution from SHAP."""

    feature: str
    shap_value: float
    feature_value: float


class SHAPOutput(BaseModel):
    """Full SHAP explanation for one prediction."""

    rf_shap_values: Dict[str, float] = Field(
        default_factory=dict, description="Random-Forest SHAP values"
    )
    cb_shap_values: Dict[str, float] = Field(
        default_factory=dict, description="CatBoost SHAP values"
    )
    weighted_shap: Dict[str, float] = Field(
        default_factory=dict, description="GA-weight-averaged SHAP values"
    )
    top_5_features: List[Tuple[str, float]] = Field(
        default_factory=list, description="Top-5 most influential features"
    )
    natural_language_explanation: str = ""


class LIMEOutput(BaseModel):
    """LIME explanation for one prediction."""

    sub_model: str = "fis"
    feature_weights: Dict[str, float] = Field(
        default_factory=dict, description="Surrogate model coefficients"
    )
    top_features: List[Tuple[str, float]] = Field(default_factory=list)
    natural_language_explanation: str = ""
    layer: str = ""
    intercept: float = 0.0
    local_r2: float = 0.0


# ---------------------------------------------------------------------------
# Prediction response schemas
# ---------------------------------------------------------------------------

class LayerPrediction(BaseModel):
    """Prediction result for a single stratum layer."""

    predicted_yield_t_ha: float
    ci_80_low: float
    ci_80_high: float
    top_shap_features: List[Dict[str, Any]] = Field(default_factory=list)
    fis_stress_scores: Dict[str, float] = Field(default_factory=dict)
    weights_used: List[float] = Field(default_factory=list)


class YieldPredictionResponse(BaseModel):
    """Full system prediction response."""

    model_config = {"protected_namespaces": ()}

    prediction_id: str
    farm_id: str
    timestamp: datetime
    layers: Dict[str, LayerPrediction]
    system_LER: float = 0.0
    optimal_geometry_recommendation: str = ""
    model_version: str = "fohem-v2.0"


# ---------------------------------------------------------------------------
# Explanation response schemas
# ---------------------------------------------------------------------------

class ExplainResponse(BaseModel):
    """Response to GET /ml/explain/{prediction_id}."""

    prediction_id: str
    farm_id: str
    layer: str
    shap_waterfall: List[Dict[str, Any]] = Field(default_factory=list)
    lime_contributions: List[Dict[str, Any]] = Field(default_factory=list)
    natural_language_summary: str = ""
    regional_summary: str = ""
    recommendation_actions: List[str] = Field(default_factory=list)


class BeeswarmData(BaseModel):
    """Global SHAP importance for beeswarm chart."""

    feature_importances: Dict[str, float] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Training schemas
# ---------------------------------------------------------------------------

class TrainRequest(BaseModel):
    """Request body for POST /ml/train."""

    farm_ids: List[str]
    layers: List[str] = Field(
        default_factory=lambda: ["canopy", "middle", "understory", "belowground"]
    )
    train_split: float = 0.7
    val_split: float = 0.15


class TrainJobStatus(BaseModel):
    """Status of an async training job."""

    job_id: str
    status: str = "queued"
    progress_pct: float = 0.0
    current_layer: Optional[str] = None
    metrics_so_far: Dict[str, Any] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Data ingestion schemas
# ---------------------------------------------------------------------------

class SensorBatch(BaseModel):
    """Batch of IoT sensor readings."""

    farm_id: str
    readings: List[Dict[str, Any]]


class ClimateFetchRequest(BaseModel):
    """Request to fetch climate data from NASA POWER."""

    farm_id: str
    lat: float
    lon: float
    start_date: str
    end_date: str


class DataHealthReport(BaseModel):
    """Data completeness report for a farm."""

    farm_id: str
    total_records: int = 0
    missing_pct: Dict[str, float] = Field(default_factory=dict)
    temporal_coverage: Dict[str, str] = Field(default_factory=dict)
    quality_score: float = 0.0
