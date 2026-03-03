"""
GET /ml/explain/{prediction_id} — SHAP + LIME explanations.
GET /ml/explain/{prediction_id}/shap_beeswarm — Global SHAP beeswarm data.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query


from multisow.ml.schemas.prediction import BeeswarmData, ExplainResponse
from multisow.ml.schemas.strata import StrataLayer
from multisow.ml.routers.cache import cache_prediction, get_cached_prediction

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ml", tags=["ml-explain"])

# In-memory prediction cache is now shared via cache.py
_fohem_system: Any = None
_shap_explainers: Dict[str, Any] = {}
_lime_explainers: Dict[str, Any] = {}


def set_explain_deps(
    fohem_system: Any,
    shap_explainers: Dict[str, Any],
    lime_explainers: Dict[str, Any],
) -> None:
    """Inject dependencies at startup."""
    global _fohem_system, _shap_explainers, _lime_explainers
    _fohem_system = fohem_system
    _shap_explainers = shap_explainers
    _lime_explainers = lime_explainers





@router.get("/explain/{prediction_id}", response_model=ExplainResponse)
async def explain_prediction(
    prediction_id: str,
    layer: str = Query(
        default="canopy",
        description="Layer to explain: canopy, middle, understory, belowground",
    ),
) -> ExplainResponse:
    """
    Return SHAP waterfall + LIME contributions for a single prediction.
    """
    import pandas as pd

    cached = get_cached_prediction(prediction_id)

    # If not cached, return a generic explanation
    if cached is None:
        return ExplainResponse(
            prediction_id=prediction_id,
            farm_id="unknown",
            layer=layer,
            natural_language_summary="No cached prediction found for this ID. Run /ml/predict first.",
            recommendation_actions=["Re-run prediction to enable explanations."],
        )

    farm_id = cached.get("farm_id", "unknown")
    features = cached.get("features", {}).get(layer)

    if features is None:
        return ExplainResponse(
            prediction_id=prediction_id,
            farm_id=farm_id,
            layer=layer,
            natural_language_summary=f"No features available for layer '{layer}'.",
            recommendation_actions=[],
        )

    df = pd.DataFrame([features])

    # SHAP
    shap_waterfall: List[Dict[str, Any]] = []
    shap_nl = ""
    shap_exp = _shap_explainers.get(layer)
    if shap_exp is not None:
        try:
            layer_enum = StrataLayer(layer)
            shap_out = shap_exp.explain_prediction(df, layer_enum)
            shap_waterfall = [
                {"feature": f, "shap_value": round(v, 4)}
                for f, v in shap_out.top_5_features
            ]
            shap_nl = shap_out.natural_language_explanation
        except Exception as exc:
            logger.warning("SHAP explain failed: %s", exc)

    # LIME
    lime_contributions: List[Dict[str, Any]] = []
    lime_nl = ""
    lime_exp = _lime_explainers.get(layer)
    if lime_exp is not None:
        try:
            layer_enum = StrataLayer(layer)
            lime_out = lime_exp.explain_prediction(df, sub_model="fis", layer=layer_enum)
            lime_contributions = [
                {"feature": f, "weight": round(w, 4)}
                for f, w in lime_out.top_features[:5]
            ]
            lime_nl = lime_out.natural_language_explanation
        except Exception as exc:
            logger.warning("LIME explain failed: %s", exc)

    # Combine
    nl_summary = shap_nl or lime_nl or "Explanation unavailable; model may not be trained."
    actions = _generate_actions(shap_waterfall, layer)

    return ExplainResponse(
        prediction_id=prediction_id,
        farm_id=farm_id,
        layer=layer,
        shap_waterfall=shap_waterfall,
        lime_contributions=lime_contributions,
        natural_language_summary=nl_summary,
        regional_summary=f"Analysis for {layer} layer on farm {farm_id}.",
        recommendation_actions=actions,
    )


@router.get("/explain/{prediction_id}/shap_beeswarm", response_model=BeeswarmData)
async def shap_beeswarm(prediction_id: str) -> BeeswarmData:
    """
    Return global SHAP feature importance data for beeswarm chart rendering.
    """
    import pandas as pd

    cached = get_cached_prediction(prediction_id)
    if cached is None:
        return BeeswarmData(feature_importances={})

    # Aggregate importance across layers
    combined: Dict[str, float] = {}
    for layer_name, features in cached.get("features", {}).items():
        shap_exp = _shap_explainers.get(layer_name)
        if shap_exp is not None and features:
            try:
                df = pd.DataFrame([features])
                beeswarm = shap_exp.generate_beeswarm_data(df)
                for feat, imp in beeswarm.items():
                    combined[feat] = combined.get(feat, 0.0) + imp
            except Exception:
                pass

    return BeeswarmData(feature_importances=combined)


def _generate_actions(
    shap_waterfall: List[Dict[str, Any]], layer: str
) -> List[str]:
    """Make actionable recommendations from SHAP waterfall."""
    actions: List[str] = []
    for item in shap_waterfall[:3]:
        feat = item.get("feature", "")
        val = item.get("shap_value", 0.0)
        if "LAI" in feat and val < 0:
            actions.append("Increase canopy density to improve light capture.")
        elif "soil_N" in feat and val < 0:
            actions.append("Apply nitrogen fertiliser to address nutrient deficit.")
        elif "VWC" in feat and val < 0:
            actions.append("Improve irrigation scheduling; soil moisture is limiting yield.")
        elif "root_overlap" in feat and val > 0.3:
            actions.append("Root competition is high; consider adjusting row spacing.")
        elif "shade" in feat.lower() and val < 0:
            actions.append(f"Thinning upper canopy would benefit the {layer} layer.")
    if not actions:
        actions.append("No urgent interventions required.")
    return actions
