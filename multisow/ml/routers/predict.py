"""
POST /ml/predict — Multi-layer yield prediction via FOHEM.
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict


from fastapi import APIRouter, HTTPException
from ml.nlp.llm_advisor import explain_prediction_naturally

from multisow.ml.schemas.strata import StrataInput, StrataLayer
from multisow.ml.schemas.prediction import (
    LayerPrediction,
    YieldPredictionResponse,
)
from multisow.ml.routers.cache import cache_prediction

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ml", tags=["ml-predict"])

# This will be populated at startup by the lifespan manager
_fohem_system: Any = None
_shap_explainer_cache: Dict[str, Any] = {}


def set_fohem_system(system: Any) -> None:
    """Inject the trained FOHEMSystem at startup."""
    global _fohem_system
    _fohem_system = system


def get_fohem_system() -> Any:
    """Return the current FOHEMSystem or None."""
    return _fohem_system


@router.post("/predict", response_model=YieldPredictionResponse)
async def predict(body: StrataInput) -> YieldPredictionResponse:
    """
    Run FOHEM prediction for all layers in the strata input.

    Returns per-layer yield, 80% confidence interval, top SHAP features,
    FIS stress scores, model weights, and system-level LER.
    """
    import pandas as pd
    import numpy as np

    prediction_id = str(uuid.uuid4())
    ts = datetime.now(tz=timezone.utc)

    layers_result: Dict[str, LayerPrediction] = {}

    if _fohem_system is not None and _fohem_system.is_any_trained():
        # Build feature rows from input layers
        for layer_input in body.layers:
            layer_name = layer_input.layer.value
            row = _build_feature_row(layer_input)
            df = pd.DataFrame([row])

            fohem = _fohem_system.layer_models.get(layer_name)
            if fohem is None or not fohem.is_trained:
                layers_result[layer_name] = _fallback_prediction(layer_input)
                continue

            try:
                pred, ci_low, ci_high = fohem.predict_with_confidence(
                    df.values, n_bootstrap=100
                )
                yield_val = float(pred[0])
                low = float(ci_low[0])
                high = float(ci_high[0])
            except Exception as exc:
                logger.warning("FOHEM predict failed for %s: %s", layer_name, exc)
                layers_result[layer_name] = _fallback_prediction(layer_input)
                continue

            # FIS stress scores
            fis_scores: Dict[str, float] = {}
            try:
                fis_scores = fohem.get_fis_scores(df)
            except Exception:
                pass

            # Top SHAP features (quick)
            top_shap = []
            try:
                explainer = _shap_explainer_cache.get(layer_name)
                if explainer is not None:
                    shap_out = explainer.explain_prediction(df, layer_input.layer)
                    top_shap = [
                        {"feature": f, "shap_value": round(v, 4)}
                        for f, v in shap_out.top_5_features
                    ]
            except Exception:
                pass

            layers_result[layer_name] = LayerPrediction(
                predicted_yield_t_ha=round(yield_val, 3),
                ci_80_low=round(low, 3),
                ci_80_high=round(high, 3),
                top_shap_features=top_shap,
                fis_stress_scores=fis_scores,
                weights_used=list(fohem.weights),
            )

        # System LER
        try:
            ler = _fohem_system.compute_LER(
                {ln: pd.DataFrame([_build_feature_row(li)]).values for ln, li in
                 ((li.layer.value, li) for li in body.layers)},
                body.monocrop_baselines or {},
            )
        except Exception:
            ler = 0.0
    else:
        # No model — use rule-based fallback for all layers
        for layer_input in body.layers:
            layers_result[layer_input.layer.value] = _fallback_prediction(layer_input)
        ler = 1.0

    # Cache prediction for explain endpoint
    cache_prediction(prediction_id, {
        "farm_id": body.farm_id,
        "features": {li.layer.value: _build_feature_row(li) for li in body.layers},
        "layers_result": {k: v.model_dump() if hasattr(v, 'model_dump') else v.__dict__ for k, v in layers_result.items()},
    })


    # NLP natural language explanation (whole-system)
    # Compose a summary prediction dict for the LLM
    summary_prediction = {
        "yield_canopy_t_ha": layers_result.get("canopy", {}).predicted_yield_t_ha if "canopy" in layers_result else None,
        "yield_middle_t_ha": layers_result.get("middle", {}).predicted_yield_t_ha if "middle" in layers_result else None,
        "yield_understory_t_ha": layers_result.get("understory", {}).predicted_yield_t_ha if "understory" in layers_result else None,
        "LER": ler,
        "revenue_estimate_inr": None,  # Placeholder, can be computed if available
        "shap_features": [
            f["feature"] for l in layers_result.values() for f in getattr(l, "top_shap_features", [])
        ]
    }
    # Try to get farm context from input (if present)
    farm_context = getattr(body, "farm_context", None) or {}
    nlp_explanation = explain_prediction_naturally(summary_prediction, farm_context)

    # Return with extra field (if schema allows, else add to dict)
    response = YieldPredictionResponse(
        prediction_id=prediction_id,
        farm_id=body.farm_id,
        timestamp=ts,
        layers=layers_result,
        system_LER=round(ler, 3),
        optimal_geometry_recommendation=_geometry_recommendation(layers_result),
        model_version="fohem-v2.0",
    )
    # Attach NLP explanation as attribute (for serialization)
    response_dict = response.dict()
    response_dict["nlp_explanation"] = nlp_explanation
    return response_dict


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _build_feature_row(layer_input: Any) -> Dict[str, float]:
    """Convert a LayerInput to a flat dict of numeric features."""
    return {
        "LAI": layer_input.LAI,
        "k_coeff": layer_input.k_coeff,
        "row_spacing_m": layer_input.row_spacing_m,
        "soil_N": layer_input.soil_N,
        "soil_P": layer_input.soil_P,
        "soil_K": layer_input.soil_K,
        "soil_pH": layer_input.soil_pH,
        "VWC": layer_input.VWC,
        "GDD": layer_input.GDD,
        "rainfall_7d": layer_input.rainfall_7d,
        "solar_elevation_deg": layer_input.solar_elevation_deg,
        "root_depth_cm": layer_input.root_depth_cm,
        "root_radius_cm": layer_input.root_radius_cm,
        "canopy_height_m": layer_input.canopy_height_m,
        "path_width_m": layer_input.path_width_m,
        "crop_density": layer_input.crop_density,
        "shade_fraction": layer_input.shade_fraction,
    }


def _fallback_prediction(layer_input: Any) -> LayerPrediction:
    """Rule-based fallback when FOHEM is not available."""
    base_yield = {
        StrataLayer.CANOPY: 8.0,
        StrataLayer.MIDDLE: 12.0,
        StrataLayer.UNDERSTORY: 6.0,
        StrataLayer.BELOWGROUND: 0.0,
    }
    y = base_yield.get(layer_input.layer, 5.0)
    # Simple multiplier based on LAI and VWC
    mult = min(layer_input.LAI / 4.0, 1.5) * min(layer_input.VWC / 0.25, 1.3)
    y *= mult
    return LayerPrediction(
        predicted_yield_t_ha=round(y, 3),
        ci_80_low=round(y * 0.7, 3),
        ci_80_high=round(y * 1.3, 3),
        fis_stress_scores={},
        weights_used=[0.25, 0.25, 0.25, 0.25],
    )


def _geometry_recommendation(layers: Dict[str, LayerPrediction]) -> str:
    """Generate a simple geometry recommendation."""
    stress = {
        k: v.fis_stress_scores.get("aggregate_stress_score", 0.0)
        for k, v in layers.items()
    }
    worst = max(stress, key=stress.get, default="")  # type: ignore[arg-type]
    if stress.get(worst, 0) > 0.6:
        return f"High stress detected in {worst} layer; increase row spacing or reduce density."
    return "Geometry is within acceptable range."
