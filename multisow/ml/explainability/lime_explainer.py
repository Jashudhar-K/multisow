"""
LIME explainability for FOHEM sub-models (FIS + ELM).

Uses LIME tabular to approximate local decision boundaries
for opaque sub-models (Fuzzy Inference System and Extreme Learning Machine).
"""

from __future__ import annotations

import logging
from typing import Any, Callable, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

from multisow.ml.schemas.prediction import LIMEOutput
from multisow.ml.schemas.strata import StrataLayer

logger = logging.getLogger(__name__)

# Try to import LIME; set flag for fallback
try:
    from lime.lime_tabular import LimeTabularExplainer

    HAS_LIME = True
except ImportError:
    HAS_LIME = False
    logger.warning("LIME library not installed; using perturbation fallback")


class FOHEMLIMEExplainer:
    """
    LIME explanations for FOHEM's opaque sub-models (FIS, ELM).

    When LIME is unavailable, uses a simple finite-difference perturbation
    method to approximate local feature importance.
    """

    def __init__(
        self,
        fohem: Any,
        training_data: Optional[pd.DataFrame] = None,
    ) -> None:
        """
        Initialise LIME explainer.

        Args:
            fohem: Trained FOHEM instance.
            training_data: Background training set for LIME kernel width.
                           If None, explainer uses sensible defaults.
        """
        self.fohem = fohem
        self.training_data = training_data
        self.feature_names: List[str] = (
            list(training_data.columns) if training_data is not None else []
        )
        self.lime_explainer: Any = None

        if training_data is not None:
            self._build_lime_explainer(training_data)

    def _build_lime_explainer(self, X: pd.DataFrame) -> None:
        """
        Build LIME tabular explainer from background data.

        Args:
            X: Background DataFrame used to compute feature statistics.
        """
        self.feature_names = list(X.columns)

        if not HAS_LIME:
            logger.info("LIME unavailable; perturbation fallback will be used")
            return

        try:
            self.lime_explainer = LimeTabularExplainer(
                training_data=X.values,
                feature_names=self.feature_names,
                mode="regression",
                discretize_continuous=True,
                random_state=42,
            )
        except Exception as exc:
            logger.warning("LIME explainer construction failed: %s", exc)

    def _fis_predict_fn(self, X_arr: np.ndarray) -> np.ndarray:
        """
        Wrapper around the FIS for LIME's predict function interface.

        Args:
            X_arr: 2D numpy array (n_samples, n_features).

        Returns:
            1D numpy array of FIS stress scores.
        """
        df = pd.DataFrame(X_arr, columns=self.feature_names)
        batch_results = self.fohem.fis.infer_batch(df)
        return batch_results["aggregate_stress_score"].values

    def _elm_predict_fn(self, X_arr: np.ndarray) -> np.ndarray:
        """
        Wrapper around the ELM for LIME's predict function interface.

        Args:
            X_arr: 2D numpy array (n_samples, n_features).

        Returns:
            1D numpy array of ELM predictions.
        """
        return self.fohem.elm.predict(X_arr)

    def _perturbation_importance(
        self,
        predict_fn: Callable[[np.ndarray], np.ndarray],
        x_single: np.ndarray,
        n_samples: int = 200,
        noise_scale: float = 0.1,
    ) -> List[Tuple[str, float]]:
        """
        Finite-difference perturbation fallback for feature importance.

        For each feature, perturb it ± noise_scale * std and measure
        the change in prediction. Provides a rough local sensitivity.

        Args:
            predict_fn: Model prediction callable.
            x_single: Single sample (1D array).
            n_samples: Number of perturbation samples.
            noise_scale: Perturbation scale (fraction of std dev).

        Returns:
            Sorted list of (feature_name, importance) tuples.
        """
        base_pred = predict_fn(x_single.reshape(1, -1))[0]

        if self.training_data is not None:
            stds = self.training_data.std().values
        else:
            stds = np.abs(x_single) * 0.1 + 1e-6

        importances: Dict[str, float] = {}
        for i, name in enumerate(self.feature_names):
            perturbed = x_single.copy()
            delta = noise_scale * stds[i] if i < len(stds) else 0.1
            perturbed[i] += delta
            pred_up = predict_fn(perturbed.reshape(1, -1))[0]

            perturbed = x_single.copy()
            perturbed[i] -= delta
            pred_down = predict_fn(perturbed.reshape(1, -1))[0]

            importances[name] = abs(pred_up - pred_down) / (2 * delta + 1e-10)

        # Normalise
        total = sum(importances.values()) or 1.0
        normed = {k: v / total for k, v in importances.items()}

        return sorted(normed.items(), key=lambda x: abs(x[1]), reverse=True)

    def explain_prediction(
        self,
        X_single: pd.DataFrame,
        sub_model: str = "fis",
        num_features: int = 5,
        layer: Optional[StrataLayer] = None,
    ) -> LIMEOutput:
        """
        Explain a single prediction using LIME (or perturbation fallback).

        Args:
            X_single: Single-row DataFrame.
            sub_model: Which sub-model to explain — 'fis' or 'elm'.
            num_features: Number of top features to report.
            layer: Stratum layer for context.

        Returns:
            LIMEOutput with feature weights and explanation.
        """
        if layer is None:
            layer = self.fohem.layer

        predict_fn = self._fis_predict_fn if sub_model == "fis" else self._elm_predict_fn
        x_single = X_single.iloc[0].values.astype(float)

        feature_weights: List[Tuple[str, float]] = []

        if self.lime_explainer is not None:
            try:
                explanation = self.lime_explainer.explain_instance(
                    x_single,
                    predict_fn,
                    num_features=num_features,
                    num_samples=500,
                )
                feature_weights = explanation.as_list()
            except Exception as exc:
                logger.warning("LIME explain_instance failed: %s", exc)

        # Fallback
        if not feature_weights:
            feature_weights = self._perturbation_importance(
                predict_fn, x_single
            )[:num_features]

        # Feature weights dict
        weights_dict: Dict[str, float] = {
            name: float(weight) for name, weight in feature_weights
        }

        # Natural language summary
        nl_parts: List[str] = []
        model_label = "Fuzzy Inference System" if sub_model == "fis" else "Extreme Learning Machine"
        nl_parts.append(
            f"{model_label} explanation for {layer.value} layer:"
        )
        for feat_name, weight in feature_weights[:3]:
            direction = "increases" if weight > 0 else "decreases"
            nl_parts.append(
                f"  • {feat_name} {direction} prediction (weight={weight:.4f})"
            )

        return LIMEOutput(
            sub_model=sub_model,
            feature_weights=weights_dict,
            top_features=feature_weights[:num_features],
            natural_language_explanation="\n".join(nl_parts),
            layer=layer.value,
        )

    def explain_batch(
        self,
        X: pd.DataFrame,
        sub_model: str = "fis",
        num_features: int = 5,
        layer: Optional[StrataLayer] = None,
    ) -> List[LIMEOutput]:
        """
        Explain each row in a DataFrame.

        Args:
            X: Multi-row feature matrix.
            sub_model: 'fis' or 'elm'.
            num_features: Top-k features per explanation.
            layer: Stratum layer.

        Returns:
            List of LIMEOutput, one per row.
        """
        return [
            self.explain_prediction(X.iloc[[i]], sub_model, num_features, layer)
            for i in range(len(X))
        ]
