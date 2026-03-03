"""
Pydantic schemas for strata optimization requests and responses.

These schemas define the API contract for the multi-objective
strata optimization endpoint.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from multisow.ml.schemas.strata import StrataLayer


# ---------------------------------------------------------------------------
# Optimization Request Schemas
# ---------------------------------------------------------------------------


class OptimizationConstraints(BaseModel):
    """Constraints for the optimization problem."""

    min_ler: float = Field(
        default=0.0,
        ge=0.0,
        le=3.0,
        description="Minimum acceptable Land Equivalent Ratio",
    )
    budget_limit_inr: Optional[float] = Field(
        default=None,
        ge=0,
        description="Maximum establishment budget in INR per hectare",
    )
    required_layers: Optional[List[StrataLayer]] = Field(
        default=None,
        description="Layers that must have a crop assigned",
    )
    excluded_crops: Optional[List[str]] = Field(
        default=None,
        description="Crop names to exclude from consideration",
    )


class EnvironmentParams(BaseModel):
    """Environmental parameters for the optimization."""

    incident_par: float = Field(
        default=1800.0,
        ge=0,
        description="Incident PAR at canopy top (μmol/m²/s)",
    )
    solar_elevation_deg: float = Field(
        default=45.0,
        ge=0,
        le=90,
        description="Solar elevation angle in degrees",
    )
    soil_n: float = Field(
        default=200.0,
        ge=0,
        description="Soil nitrogen content (mg/kg)",
    )
    soil_p: float = Field(
        default=25.0,
        ge=0,
        description="Soil phosphorus content (mg/kg)",
    )
    soil_k: float = Field(
        default=150.0,
        ge=0,
        description="Soil potassium content (mg/kg)",
    )
    vwc: float = Field(
        default=0.3,
        ge=0.0,
        le=0.6,
        description="Volumetric water content (cm³/cm³)",
    )
    gdd_available: float = Field(
        default=3000.0,
        ge=0,
        description="Growing degree days available",
    )
    soil_type: str = Field(
        default="laterite",
        description="Soil type: laterite, alluvial, red, or black",
    )


class OptimizationRequest(BaseModel):
    """Request body for strata optimization endpoint."""

    farm_id: str = Field(
        ...,
        description="Unique farm identifier",
    )
    acres: float = Field(
        default=2.0,
        ge=0.1,
        le=1000,
        description="Farm size in acres",
    )
    environment: EnvironmentParams = Field(
        default_factory=EnvironmentParams,
        description="Environmental parameters",
    )
    constraints: OptimizationConstraints = Field(
        default_factory=OptimizationConstraints,
        description="Optimization constraints",
    )
    fixed_crops: Optional[Dict[str, str]] = Field(
        default=None,
        description="Pre-selected crops for specific layers (e.g., {'canopy': 'coconut'})",
    )
    optimization_goal: str = Field(
        default="balanced",
        description="Optimization goal: 'maximize_yield', 'maximize_profit', 'maximize_ler', or 'balanced'",
    )
    n_recommendations: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Number of recommendations to return",
    )
    population_size: int = Field(
        default=100,
        ge=20,
        le=500,
        description="GA population size (higher = better but slower)",
    )
    n_generations: int = Field(
        default=50,
        ge=10,
        le=200,
        description="Number of GA generations (higher = better but slower)",
    )


# ---------------------------------------------------------------------------
# Optimization Response Schemas
# ---------------------------------------------------------------------------


class CropRecommendation(BaseModel):
    """Recommendation for a single layer."""

    crop: Optional[str] = Field(
        default=None,
        description="Recommended crop species name",
    )
    spacing_m: float = Field(
        default=0.0,
        description="Recommended row spacing in meters",
    )
    plants_per_hectare: int = Field(
        default=0,
        description="Estimated plant count per hectare",
    )
    expected_yield_t_ha: float = Field(
        default=0.0,
        description="Expected yield in tonnes per hectare",
    )


class OptimizationMetrics(BaseModel):
    """Performance metrics for a strata configuration."""

    total_yield_t_ha: float = Field(
        description="Total system yield in tonnes per hectare",
    )
    ler: float = Field(
        description="Land Equivalent Ratio (>1.0 = intercropping advantage)",
    )
    competition_index: float = Field(
        description="Root competition index (lower is better)",
    )
    light_efficiency: float = Field(
        description="Average light interception efficiency",
    )
    net_profit_inr_ha: float = Field(
        description="Net profit in INR per hectare",
    )
    establishment_cost_inr_ha: float = Field(
        description="Total establishment cost in INR per hectare",
    )
    annual_revenue_inr_ha: float = Field(
        description="Estimated annual revenue in INR per hectare",
    )


class StrataRecommendation(BaseModel):
    """A single strata configuration recommendation."""

    rank: int = Field(
        description="Ranking position (1 = best)",
    )
    canopy: CropRecommendation = Field(
        description="Canopy layer recommendation",
    )
    middle: CropRecommendation = Field(
        description="Middle layer recommendation",
    )
    understory: CropRecommendation = Field(
        description="Understory layer recommendation",
    )
    metrics: OptimizationMetrics = Field(
        description="Performance metrics for this configuration",
    )
    synergy_notes: List[str] = Field(
        default_factory=list,
        description="Notes about synergistic crop interactions",
    )
    warnings: List[str] = Field(
        default_factory=list,
        description="Potential issues or constraints",
    )


class OptimizationResponse(BaseModel):
    """Response from the strata optimization endpoint."""

    optimization_id: str = Field(
        description="Unique identifier for this optimization run",
    )
    farm_id: str = Field(
        description="Farm identifier from request",
    )
    timestamp: datetime = Field(
        description="Optimization completion timestamp",
    )
    acres: float = Field(
        description="Farm size used for optimization",
    )
    soil_type: str = Field(
        description="Soil type used for optimization",
    )
    recommendations: List[StrataRecommendation] = Field(
        description="Ranked list of strata recommendations",
    )
    pareto_front_size: int = Field(
        description="Total number of Pareto-optimal solutions found",
    )
    optimization_stats: Dict[str, Any] = Field(
        default_factory=dict,
        description="Statistics about the optimization run",
    )
    natural_language_summary: str = Field(
        default="",
        description="Human-readable summary of recommendations",
    )


# ---------------------------------------------------------------------------
# Quick Optimization Schemas
# ---------------------------------------------------------------------------


class QuickOptimizeRequest(BaseModel):
    """Simplified request for quick optimization."""

    soil_type: str = Field(
        default="laterite",
        description="Soil type: laterite, alluvial, red, or black",
    )
    acres: float = Field(
        default=2.0,
        ge=0.1,
        le=100,
        description="Farm size in acres",
    )
    budget_inr: Optional[float] = Field(
        default=None,
        ge=0,
        description="Optional budget constraint in INR",
    )
    preferred_canopy: Optional[str] = Field(
        default=None,
        description="Preferred canopy crop (e.g., 'coconut')",
    )
    n_recommendations: int = Field(
        default=3,
        ge=1,
        le=10,
        description="Number of recommendations",
    )


class QuickOptimizeResponse(BaseModel):
    """Response from quick optimization endpoint."""

    recommendations: List[Dict[str, Any]] = Field(
        description="List of quick recommendations",
    )
    execution_time_ms: float = Field(
        description="Time taken for optimization in milliseconds",
    )
