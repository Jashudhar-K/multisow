"""
FastAPI router for strata optimization endpoints.

Provides multi-objective optimization for the Multi-Sow Multi-Tier
Cropping System using NSGA-II genetic algorithm.
"""

from __future__ import annotations

import logging
import time
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query

from multisow.ml.models.strata_optimizer import (
    CROP_DATABASE,
    StrataConfiguration,
    StrataFitnessEvaluator,
    StrataOptimizer,
    quick_optimize,
)
from multisow.ml.schemas.optimization import (
    CropRecommendation,
    OptimizationMetrics,
    OptimizationRequest,
    OptimizationResponse,
    QuickOptimizeRequest,
    QuickOptimizeResponse,
    StrataRecommendation,
)
from multisow.ml.schemas.strata import StrataLayer

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ml/optimize", tags=["optimization"])


# ---------------------------------------------------------------------------
# Main Optimization Endpoint
# ---------------------------------------------------------------------------


@router.post("/strata", response_model=OptimizationResponse)
async def optimize_strata(body: OptimizationRequest) -> OptimizationResponse:
    """
    Run multi-objective strata optimization.

    This endpoint uses NSGA-II (Non-dominated Sorting Genetic Algorithm II)
    to find Pareto-optimal crop configurations across all 4 strata layers.

    Objectives optimized:
      1. Maximize total system yield (t/ha)
      2. Maximize Land Equivalent Ratio (LER > 1.0 = synergy)
      3. Minimize resource competition index
      4. Maximize net economic profit (INR/ha)

    The algorithm considers:
      - Light transmission (Beer-Lambert law cascade)
      - Root competition (cylinder overlap model)
      - Crop synergies and antagonisms
      - Spacing and geometry constraints
    """
    start_time = time.time()
    optimization_id = str(uuid.uuid4())

    # Parse fixed crops
    fixed_crops: Optional[Dict[StrataLayer, str]] = None
    if body.fixed_crops:
        fixed_crops = {}
        layer_map = {
            "canopy": StrataLayer.CANOPY,
            "middle": StrataLayer.MIDDLE,
            "understory": StrataLayer.UNDERSTORY,
            "belowground": StrataLayer.BELOWGROUND,
        }
        for layer_str, crop_name in body.fixed_crops.items():
            layer = layer_map.get(layer_str.lower())
            if layer and crop_name in CROP_DATABASE:
                fixed_crops[layer] = crop_name

    # Create evaluator with environment params
    evaluator = StrataFitnessEvaluator(
        incident_par=body.environment.incident_par,
        solar_elevation=body.environment.solar_elevation_deg,
        soil_n=body.environment.soil_n,
        soil_p=body.environment.soil_p,
        soil_k=body.environment.soil_k,
        vwc=body.environment.vwc,
        gdd_available=body.environment.gdd_available,
    )

    # Create optimizer
    optimizer = StrataOptimizer(
        population_size=body.population_size,
        n_generations=body.n_generations,
        evaluator=evaluator,
    )

    # Run optimization
    try:
        pareto_front = optimizer.optimize(
            fixed_crops=fixed_crops,
            min_ler=body.constraints.min_ler,
            budget_limit_inr=body.constraints.budget_limit_inr,
        )
    except Exception as exc:
        logger.error("Optimization failed: %s", exc)
        raise HTTPException(status_code=500, detail=f"Optimization failed: {exc}")

    # Sort by optimization goal
    if body.optimization_goal == "maximize_yield":
        pareto_front.sort(key=lambda x: x.total_yield, reverse=True)
    elif body.optimization_goal == "maximize_profit":
        pareto_front.sort(key=lambda x: x.net_profit_inr_ha, reverse=True)
    elif body.optimization_goal == "maximize_ler":
        pareto_front.sort(key=lambda x: x.ler, reverse=True)
    else:  # balanced
        # Score = normalized yield + LER + profit - competition
        def balanced_score(c: StrataConfiguration) -> float:
            return c.total_yield / 50 + c.ler + c.net_profit_inr_ha / 500000 - c.competition_index
        pareto_front.sort(key=balanced_score, reverse=True)

    # Build recommendations
    recommendations = []
    for i, config in enumerate(pareto_front[: body.n_recommendations]):
        rec = _build_recommendation(config, i + 1)
        recommendations.append(rec)

    # Calculate stats
    elapsed_ms = (time.time() - start_time) * 1000
    stats = {
        "elapsed_time_ms": round(elapsed_ms, 2),
        "population_size": body.population_size,
        "generations": body.n_generations,
        "pareto_front_size": len(pareto_front),
        "optimization_goal": body.optimization_goal,
    }

    # Generate summary
    summary = _generate_summary(recommendations, body.acres, body.environment.soil_type)

    return OptimizationResponse(
        optimization_id=optimization_id,
        farm_id=body.farm_id,
        timestamp=datetime.now(tz=timezone.utc),
        acres=body.acres,
        soil_type=body.environment.soil_type,
        recommendations=recommendations,
        pareto_front_size=len(pareto_front),
        optimization_stats=stats,
        natural_language_summary=summary,
    )


# ---------------------------------------------------------------------------
# Quick Optimization Endpoint
# ---------------------------------------------------------------------------


@router.post("/quick", response_model=QuickOptimizeResponse)
async def quick_optimize_endpoint(body: QuickOptimizeRequest) -> QuickOptimizeResponse:
    """
    Run quick optimization with simplified parameters.

    This is a faster version suitable for interactive use cases.
    Uses smaller population and fewer generations.
    """
    start_time = time.time()

    results = quick_optimize(
        soil_type=body.soil_type,
        acres=body.acres,
        budget_inr=body.budget_inr,
        preferred_canopy=body.preferred_canopy,
        n_recommendations=body.n_recommendations,
    )

    elapsed_ms = (time.time() - start_time) * 1000

    return QuickOptimizeResponse(
        recommendations=results,
        execution_time_ms=round(elapsed_ms, 2),
    )


# ---------------------------------------------------------------------------
# Crop Database Endpoint
# ---------------------------------------------------------------------------


@router.get("/crops")
async def list_available_crops(
    layer: Optional[str] = Query(
        default=None,
        description="Filter by layer: canopy, middle, understory",
    ),
) -> Dict[str, Any]:
    """
    List all available crops in the optimization database.

    Returns crop characteristics including yields, spacing requirements,
    light parameters, and economic data.
    """
    crops = []
    for name, crop in CROP_DATABASE.items():
        if layer and crop.layer.value.lower() != layer.lower():
            continue

        crops.append({
            "name": name,
            "layer": crop.layer.value,
            "typical_yield_t_ha": crop.typical_yield_t_ha,
            "price_per_tonne_inr": crop.price_per_tonne_inr,
            "min_spacing_m": crop.min_spacing_m,
            "max_spacing_m": crop.max_spacing_m,
            "shade_tolerance": crop.shade_tolerance,
            "synergistic_with": crop.synergistic_with,
            "establishment_cost_inr_ha": crop.establishment_cost_inr_ha,
        })

    return {
        "total_crops": len(crops),
        "crops": crops,
    }


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _build_recommendation(
    config: StrataConfiguration, rank: int
) -> StrataRecommendation:
    """Build a StrataRecommendation from a configuration."""

    def make_crop_rec(crop_name: Optional[str], spacing: float) -> CropRecommendation:
        if not crop_name or crop_name not in CROP_DATABASE:
            return CropRecommendation()

        crop = CROP_DATABASE[crop_name]
        # Estimate plants per hectare
        plants_per_ha = int(10000 / (spacing * spacing)) if spacing > 0 else 0
        # Rough yield estimate
        yield_est = config.total_yield / 3 if config.total_yield > 0 else 0

        return CropRecommendation(
            crop=crop_name,
            spacing_m=round(spacing, 2),
            plants_per_hectare=plants_per_ha,
            expected_yield_t_ha=round(yield_est, 2),
        )

    # Calculate costs
    establishment_cost = 0.0
    annual_revenue = 0.0
    for crop_name in [config.canopy_crop, config.middle_crop, config.understory_crop]:
        if crop_name and crop_name in CROP_DATABASE:
            crop = CROP_DATABASE[crop_name]
            establishment_cost += crop.establishment_cost_inr_ha

    # Revenue from yield
    annual_revenue = config.net_profit_inr_ha + establishment_cost

    metrics = OptimizationMetrics(
        total_yield_t_ha=round(config.total_yield, 2),
        ler=round(config.ler, 3),
        competition_index=round(config.competition_index, 3),
        light_efficiency=round(config.light_efficiency, 3),
        net_profit_inr_ha=round(config.net_profit_inr_ha, 0),
        establishment_cost_inr_ha=round(establishment_cost, 0),
        annual_revenue_inr_ha=round(annual_revenue, 0),
    )

    # Generate synergy notes
    synergy_notes = _get_synergy_notes(config)
    warnings = _get_warnings(config)

    return StrataRecommendation(
        rank=rank,
        canopy=make_crop_rec(config.canopy_crop, config.canopy_spacing),
        middle=make_crop_rec(config.middle_crop, config.middle_spacing),
        understory=make_crop_rec(config.understory_crop, config.understory_spacing),
        metrics=metrics,
        synergy_notes=synergy_notes,
        warnings=warnings,
    )


def _get_synergy_notes(config: StrataConfiguration) -> List[str]:
    """Generate synergy notes for a configuration."""
    notes = []
    crops = [config.canopy_crop, config.middle_crop, config.understory_crop]
    crops = [c for c in crops if c and c in CROP_DATABASE]

    for crop_name in crops:
        crop = CROP_DATABASE[crop_name]
        for syn in crop.synergistic_with:
            if syn in crops:
                notes.append(f"{crop_name.title()} and {syn.title()} have beneficial interactions")

    # Remove duplicates
    return list(set(notes))


def _get_warnings(config: StrataConfiguration) -> List[str]:
    """Generate warnings for a configuration."""
    warnings = []

    if config.competition_index > 0.5:
        warnings.append("High root competition - consider wider spacing")

    if config.ler < 1.0:
        warnings.append("LER < 1.0: Monocropping may be more efficient")

    if config.light_efficiency < 0.3:
        warnings.append("Low light utilization - understory may struggle")

    return warnings


def _generate_summary(
    recommendations: List[StrataRecommendation],
    acres: float,
    soil_type: str,
) -> str:
    """Generate natural language summary of recommendations."""
    if not recommendations:
        return "No viable configurations found with the given constraints."

    best = recommendations[0]
    crops = []
    if best.canopy.crop:
        crops.append(best.canopy.crop.title())
    if best.middle.crop:
        crops.append(best.middle.crop.title())
    if best.understory.crop:
        crops.append(best.understory.crop.title())

    crop_str = ", ".join(crops) if crops else "no crops"

    summary = (
        f"For your {acres} acre farm with {soil_type} soil, the top recommendation "
        f"features {crop_str}. This configuration achieves an LER of {best.metrics.ler:.2f} "
        f"(values above 1.0 indicate intercropping is more land-efficient than monocropping). "
        f"Expected total yield is {best.metrics.total_yield_t_ha:.1f} t/ha with an estimated "
        f"net profit of ₹{best.metrics.net_profit_inr_ha:,.0f} per hectare annually."
    )

    return summary
