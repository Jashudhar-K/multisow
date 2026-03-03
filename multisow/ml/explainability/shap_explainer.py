"""
SHAP explainability for FOHEM RF and CatBoost sub-models.

Computes TreeExplainer-based SHAP values and generates natural-language
explanations using domain-specific templates.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

from multisow.ml.schemas.prediction import SHAPOutput
from multisow.ml.schemas.strata import StrataLayer

logger = logging.getLogger(__name__)

# Try to import SHAP; set flag for fallback
try:
    import shap

    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False
    logger.warning("SHAP library not installed; using feature-importance fallback")


# ---------------------------------------------------------------------------
# Explanation templates
# ---------------------------------------------------------------------------

EXPLANATION_TEMPLATES: Dict[StrataLayer, Dict[str, str]] = {
    StrataLayer.CANOPY: {
        "LAI_high": "Coconut/overstory yield was boosted by dense canopy coverage (LAI={:.2f}), maximising solar capture.",
        "LAI_low": "Overstory yield was limited by sparse canopy (LAI={:.2f}); consider increasing planting density.",
        "k_high": "High light extinction (k={:.2f}) reduced light penetration to lower tiers.",
        "par_30d_low": "30-day average solar radiation was {:.0f} μmol/m²/s, below optimal range.",
        "row_spacing": "Current row spacing of {:.1f}m is {} for this stratum.",
        "shade_severe": "Severe shading from overstory is suppressing Layer 2 yields; thinning recommended.",
        "GDD_low": "Accumulated heat units (GDD={:.0f}) suggest delayed phenological development.",
    },
    StrataLayer.MIDDLE: {
        "shade_fraction": "Middle tier received {:.0f}% of incident light; banana/cocoa prefer 30–60% shade.",
        "soil_K_low": "Low potassium (K={:.1f} cmol/kg) is limiting banana bunch development.",
        "VWC_optimal": "Soil moisture at {:.2f} cm³/cm³ is within optimal range for middle-tier crops.",
    },
    StrataLayer.UNDERSTORY: {
        "diffuse_PAR": "Ginger/turmeric received {:.1f}% diffuse light fraction, within tolerance.",
        "pH_optimal": "Soil pH of {:.1f} is optimal for rhizome crop nutrient uptake.",
        "ROI_high": "Root overlap with Layer 2 crops (ROI={:.2f}) is creating nitrogen competition.",
    },
    StrataLayer.BELOWGROUND: {
        "ROI_severe": "High root competition between overstory and understory (ROI={:.2f}); deep-band fertiliser placement recommended.",
        "soil_N_low": "Nitrogen depletion detected ({:.0f} mg/kg); intercrop is nitrogen-limited.",
        "BD_high": "Soil compaction (BD={:.2f} g/cm³) is restricting root penetration depth.",
    },
}


def _generate_natural_language(
    layer: StrataLayer,
    feature_values: Dict[str, float],
    top_features: List[Tuple[str, float]],
) -> str:
    """
    Generate natural-language explanation from templates and top features.

    Args:
        layer: Stratum layer.
        feature_values: Feature name → value mapping.
        top_features: Top-5 (feature, shap_value) tuples.

    Returns:
        Human-readable explanation string.
    """
    templates = EXPLANATION_TEMPLATES.get(layer, {})
    sentences: List[str] = []

    for feat, shap_val in top_features[:5]:
        val = feature_values.get(feat, 0.0)

        if "LAI" in feat:
            if val > 5.0:
                tpl = templates.get("LAI_high")
                if tpl:
                    sentences.append(tpl.format(val))
            elif val < 2.5:
                tpl = templates.get("LAI_low")
                if tpl:
                    sentences.append(tpl.format(val))

        elif "k_coeff" in feat and val > 0.55:
            tpl = templates.get("k_high")
            if tpl:
                sentences.append(tpl.format(val))

        elif "GDD" in feat and val < 1000:
            tpl = templates.get("GDD_low")
            if tpl:
                sentences.append(tpl.format(val))

        elif "shade" in feat.lower() and val > 0.6:
            tpl = templates.get("shade_severe") or templates.get("shade_fraction")
            if tpl:
                try:
                    sentences.append(tpl.format(val * 100))
                except (IndexError, ValueError):
                    sentences.append(tpl)

        elif "root_overlap" in feat.lower() and val > 0.5:
            tpl = templates.get("ROI_high") or templates.get("ROI_severe")
            if tpl:
                sentences.append(tpl.format(val))

        elif "soil_N" in feat and val < 60:
            tpl = templates.get("soil_N_low")
            if tpl:
                sentences.append(tpl.format(val))

        elif "VWC" in feat:
            tpl = templates.get("VWC_optimal")
            if tpl:
                sentences.append(tpl.format(val))

        elif "soil_pH" in feat:
            tpl = templates.get("pH_optimal")
            if tpl:
                sentences.append(tpl.format(val))

        elif "row_spacing" in feat:
            optimal_str = "optimal" if 3 <= val <= 5 else "suboptimal"
            tpl = templates.get("row_spacing")
            if tpl:
                sentences.append(tpl.format(val, optimal_str))

    if not sentences:
        sentences.append(
            f"Key factors for {layer.value} layer: "
            + ", ".join(f"{f} (SHAP={s:.3f})" for f, s in top_features[:3])
            + "."
        )

    return " ".join(sentences)


class FOHEMSHAPExplainer:
    """
    Computes SHAP values for RF and CatBoost sub-models in a FOHEM instance.
    """

    def __init__(self, fohem: Any) -> None:
        """
        Wrap a trained FOHEM model for SHAP explanations.

        Args:
            fohem: A trained FOHEM instance.
        """
        self.fohem = fohem
        self.rf_explainer: Any = None
        self.cb_explainer: Any = None

    def build_explainers(self, X_background: pd.DataFrame) -> None:
        """
        Build SHAP TreeExplainers for RF and CatBoost.

        Falls back to feature-importance approximation if SHAP
        is not available or explainer construction fails.

        Args:
            X_background: Background dataset (100-500 rows recommended).
        """
        if not HAS_SHAP:
            logger.info("SHAP unavailable; explainers will use importance fallback")
            return

        # RF explainer
        if self.fohem.rf.model is not None:
            try:
                self.rf_explainer = shap.TreeExplainer(
                    self.fohem.rf.model, X_background
                )
            except Exception as exc:
                logger.warning("RF SHAP explainer failed: %s", exc)

        # CatBoost explainer
        if self.fohem.catboost.model is not None:
            try:
                self.cb_explainer = shap.TreeExplainer(
                    self.fohem.catboost.model, X_background
                )
            except Exception as exc:
                logger.warning("CatBoost SHAP explainer failed: %s", exc)

    def explain_prediction(
        self,
        X_single: pd.DataFrame,
        layer: Optional[StrataLayer] = None,
    ) -> SHAPOutput:
        """
        Explain a single prediction using SHAP (or importance fallback).

        Args:
            X_single: Single-row DataFrame (or first row is used).
            layer: Stratum layer for template selection.

        Returns:
            SHAPOutput with SHAP values and natural-language explanation.
        """
        if layer is None:
            layer = self.fohem.layer

        feature_names = list(X_single.columns)
        feature_values = {col: float(X_single.iloc[0][col]) for col in feature_names if isinstance(X_single.iloc[0][col], (int, float, np.integer, np.floating))}

        rf_shap: Dict[str, float] = {}
        cb_shap: Dict[str, float] = {}

        # SHAP-based explanation
        if self.rf_explainer is not None:
            try:
                sv = self.rf_explainer.shap_values(X_single.iloc[:1])
                if isinstance(sv, np.ndarray):
                    for i, name in enumerate(feature_names):
                        rf_shap[name] = float(sv[0][i]) if i < len(sv[0]) else 0.0
            except Exception as exc:
                logger.debug("RF SHAP failed: %s", exc)

        if self.cb_explainer is not None:
            try:
                sv = self.cb_explainer.shap_values(X_single.iloc[:1])
                if isinstance(sv, np.ndarray):
                    for i, name in enumerate(feature_names):
                        cb_shap[name] = float(sv[0][i]) if i < len(sv[0]) else 0.0
            except Exception as exc:
                logger.debug("CatBoost SHAP failed: %s", exc)

        # Feature-importance fallback if SHAP is empty
        if not rf_shap and self.fohem.rf.model is not None:
            importance = self.fohem.rf.get_feature_importance()
            for name in feature_names:
                rf_shap[name] = float(importance.get(name, 0.0))

        if not cb_shap:
            cb_shap = rf_shap.copy()  # Use RF as proxy

        # Weighted SHAP (by GA weights)
        w_rf = self.fohem.weights[1]
        w_cb = self.fohem.weights[2]
        w_sum = w_rf + w_cb
        if w_sum == 0:
            w_sum = 1.0

        weighted: Dict[str, float] = {}
        all_features = set(rf_shap.keys()) | set(cb_shap.keys())
        for feat in all_features:
            weighted[feat] = (
                w_rf * rf_shap.get(feat, 0.0) + w_cb * cb_shap.get(feat, 0.0)
            ) / w_sum

        # Top 5
        sorted_features = sorted(weighted.items(), key=lambda x: abs(x[1]), reverse=True)
        top_5 = sorted_features[:5]

        # Natural language
        nl = _generate_natural_language(layer, feature_values, top_5)

        return SHAPOutput(
            rf_shap_values=rf_shap,
            cb_shap_values=cb_shap,
            weighted_shap=weighted,
            top_5_features=top_5,
            natural_language_explanation=nl,
        )

    def explain_batch(
        self, X: pd.DataFrame, layer: Optional[StrataLayer] = None
    ) -> List[SHAPOutput]:
        """
        Explain each row in a DataFrame.

        Args:
            X: Multi-row feature matrix.
            layer: Stratum layer for templates.

        Returns:
            List of SHAPOutput, one per row.
        """
        return [
            self.explain_prediction(X.iloc[[i]], layer)
            for i in range(len(X))
        ]

    def generate_beeswarm_data(self, X: pd.DataFrame) -> Dict[str, float]:
        """
        Compute global SHAP importance: mean(|shap_values|) per feature.

        Args:
            X: Dataset to compute global importance over.

        Returns:
            Dict of feature → mean absolute SHAP value.
        """
        feature_names = list(X.columns)
        importance: Dict[str, float] = {}

        if self.rf_explainer is not None:
            try:
                sv = self.rf_explainer.shap_values(X)
                for i, name in enumerate(feature_names):
                    importance[name] = float(np.mean(np.abs(sv[:, i])))
                return importance
            except Exception:
                pass

        # Fallback to RF feature importance
        if self.fohem.rf.model is not None:
            fi = self.fohem.rf.get_feature_importance()
            for name in feature_names:
                importance[name] = float(fi.get(name, 0.0))

        return importance
