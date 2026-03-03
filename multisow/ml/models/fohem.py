"""
FOHEM — Fuzzy-Optimized Hybrid Ensemble Model for stratified intercropping.

Architecture:
  Stage 1A: FIS  → stress scores per layer
  Stage 1B: RF, CatBoost, ELM  → base yield predictions
  Stage 2:  GA   → optimize [w_fis, w_rf, w_cb, w_elm]
  Output:   Ŷ = w_fis×FIS_yield + w_rf×RF + w_cb×CB + w_elm×ELM

Provides per-layer models and a system-wide coordinator (FOHEMSystem).
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

from multisow.ml.models.ensemble_models import (
    CatBoostSubModel,
    ELMSubModel,
    RandomForestSubModel,
)
from multisow.ml.models.fuzzy_inference import StratifiedFuzzyInferenceSystem
from multisow.ml.models.genetic_optimizer import GAFeatureSelector, GAWeightOptimizer
from multisow.ml.schemas.strata import StrataLayer

logger = logging.getLogger(__name__)


class FOHEM:
    """
    Fuzzy-Optimized Hybrid Ensemble Model for a single stratum layer.

    Combines FIS stress scores with RF, CatBoost, and ELM base learners,
    using genetically-optimised weights and feature selection.
    """

    def __init__(self, layer: StrataLayer) -> None:
        """
        Initialise a FOHEM instance for one layer.

        Args:
            layer: The stratum layer this model targets.
        """
        self.layer = layer
        self.fis = StratifiedFuzzyInferenceSystem()
        self.rf = RandomForestSubModel()
        self.catboost = CatBoostSubModel()
        self.elm = ELMSubModel()
        self.ga_weights = GAWeightOptimizer()
        self.ga_features = GAFeatureSelector()
        self.weights: np.ndarray = np.array([0.25, 0.25, 0.25, 0.25])
        self.selected_features: List[str] = []
        self.is_trained: bool = False
        self.metadata: Dict[str, Any] = {}
        self._y_train_mean: float = 1.0  # for FIS yield proxy scaling

    def fit(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        X_val: pd.DataFrame,
        y_val: pd.Series,
    ) -> None:
        """
        Full two-stage training procedure.

        Stage 1:
          - FIS inference (no training needed)
          - GA feature selection using RF as base model
          - Train RF, CatBoost, ELM on selected features + FIS stress

        Stage 2:
          - GA weight optimisation on validation predictions

        Args:
            X: Training feature matrix.
            y: Training target (yield_t_ha).
            X_val: Validation feature matrix.
            y_val: Validation target.
        """
        self._y_train_mean = float(y.mean()) if len(y) > 0 else 1.0

        # Step 1: FIS inference (no training required)
        logger.info("FOHEM[%s] Step 1: FIS inference on training set", self.layer.value)
        fis_scores = self.fis.infer_batch(X)

        # Step 2: GA feature selection using RF as base model
        logger.info("FOHEM[%s] Step 2: GA feature selection", self.layer.value)
        numeric_X = X.select_dtypes(include=[np.number])
        if len(numeric_X.columns) == 0:
            self.selected_features = list(X.columns)
        else:
            self.selected_features, best_r2 = self.ga_features.evolve(
                numeric_X, y, self.rf
            )
            if not self.selected_features:
                self.selected_features = list(numeric_X.columns)

        # Prepare augmented feature matrices
        X_sel = X[self.selected_features].copy()
        X_val_sel = X_val[self.selected_features].copy() if len(self.selected_features) > 0 else X_val.copy()

        # Augment with FIS stress scores
        X_aug = pd.concat(
            [X_sel.reset_index(drop=True),
             fis_scores[["aggregate_stress_score"]].reset_index(drop=True)],
            axis=1,
        )

        # Step 3: Train base models on selected + augmented features
        logger.info("FOHEM[%s] Step 3: Training base models", self.layer.value)
        self.rf.fit(X_aug, y)
        self.catboost.fit(X_aug, y)
        self.elm.fit(X_aug.values, y.values)

        # Step 4: Generate validation predictions
        logger.info("FOHEM[%s] Step 4: Validation predictions", self.layer.value)
        fis_val_scores = self.fis.infer_batch(X_val)
        X_val_aug = pd.concat(
            [X_val_sel.reset_index(drop=True),
             fis_val_scores[["aggregate_stress_score"]].reset_index(drop=True)],
            axis=1,
        )

        # FIS yield proxy: inverse stress → yield
        fis_yield_proxy = 1.0 - (fis_val_scores["aggregate_stress_score"].values / 10.0)
        fis_yield_scaled = fis_yield_proxy * self._y_train_mean

        rf_preds = self.rf.predict(X_val_aug)
        cb_preds = self.catboost.predict(X_val_aug)
        elm_preds = self.elm.predict(X_val_aug.values)

        # Step 5: GA weight optimisation
        logger.info("FOHEM[%s] Step 5: GA weight optimisation", self.layer.value)
        self.weights, best_mae = self.ga_weights.optimize(
            fis_yield_scaled, rf_preds, cb_preds, elm_preds, y_val,
        )

        self.is_trained = True
        self.metadata = {
            "best_r2": best_r2 if 'best_r2' in dir() else 0.0,
            "best_mae": best_mae,
            "n_features_selected": len(self.selected_features),
            "weights": self.weights.tolist(),
            "layer": self.layer.value,
            "y_train_mean": self._y_train_mean,
        }
        logger.info(
            "FOHEM[%s] trained — weights=%s, MAE=%.4f, features=%d",
            self.layer.value, self.weights.round(3).tolist(),
            best_mae, len(self.selected_features),
        )

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """
        Weighted ensemble prediction.

        Args:
            X: Feature matrix (must contain selected_features columns).

        Returns:
            1-D numpy array of predicted yields (t/ha).
        """
        if not self.is_trained:
            raise RuntimeError(f"FOHEM[{self.layer.value}] not trained — call fit() first")

        X_sel = X[self.selected_features].copy()
        fis_scores = self.fis.infer_batch(X)
        X_aug = pd.concat(
            [X_sel.reset_index(drop=True),
             fis_scores[["aggregate_stress_score"]].reset_index(drop=True)],
            axis=1,
        )

        # FIS yield proxy
        fis_proxy = (1.0 - fis_scores["aggregate_stress_score"].values / 10.0) * self._y_train_mean

        rf_p = self.rf.predict(X_aug)
        cb_p = self.catboost.predict(X_aug)
        elm_p = self.elm.predict(X_aug.values)

        w = self.weights
        result = w[0] * fis_proxy + w[1] * rf_p + w[2] * cb_p + w[3] * elm_p
        # Ensure non-negative
        return np.maximum(0, result)

    def predict_with_confidence(
        self, X: pd.DataFrame, n_bootstrap: int = 100
    ) -> Dict[str, np.ndarray]:
        """
        Return prediction with 80% confidence interval via bootstrap.

        Args:
            X: Feature matrix.
            n_bootstrap: Number of bootstrap iterations.

        Returns:
            Dict with ``prediction``, ``ci_80_low``, ``ci_80_high``.
        """
        base_pred = self.predict(X)

        if len(X) <= 1:
            # Can't bootstrap a single row meaningfully
            return {
                "prediction": base_pred,
                "ci_80_low": base_pred * 0.85,
                "ci_80_high": base_pred * 1.15,
            }

        bootstrap_preds = []
        for _ in range(n_bootstrap):
            idx = np.random.choice(len(X), len(X), replace=True)
            try:
                bp = self.predict(X.iloc[idx])
                bootstrap_preds.append(bp)
            except Exception:
                continue

        if not bootstrap_preds:
            return {
                "prediction": base_pred,
                "ci_80_low": base_pred * 0.85,
                "ci_80_high": base_pred * 1.15,
            }

        stacked = np.array(bootstrap_preds)
        ci_low = np.percentile(stacked, 10, axis=0)
        ci_high = np.percentile(stacked, 90, axis=0)

        return {
            "prediction": base_pred,
            "ci_80_low": ci_low,
            "ci_80_high": ci_high,
        }

    def get_fis_scores(self, X: pd.DataFrame) -> pd.DataFrame:
        """
        Get FIS stress scores for a feature matrix.

        Args:
            X: Feature matrix.

        Returns:
            DataFrame with FIS output columns.
        """
        return self.fis.infer_batch(X)


# ---------------------------------------------------------------------------
# System-wide coordinator
# ---------------------------------------------------------------------------

class FOHEMSystem:
    """
    Manages 4 layer-specific FOHEM instances (one per StrataLayer).
    """

    def __init__(self) -> None:
        """Create one FOHEM model per stratum layer."""
        self.models: Dict[StrataLayer, FOHEM] = {
            layer: FOHEM(layer) for layer in StrataLayer
        }

    def train_all_layers(
        self,
        layer_datasets: Dict[StrataLayer, Tuple[pd.DataFrame, pd.Series, pd.DataFrame, pd.Series]],
    ) -> Dict[str, Dict[str, Any]]:
        """
        Train FOHEM models for all layers that have data.

        Args:
            layer_datasets: Mapping from StrataLayer to
                (X_train, y_train, X_val, y_val) tuples.

        Returns:
            Dict of layer → training metadata.
        """
        results: Dict[str, Dict[str, Any]] = {}
        for layer, (X_tr, y_tr, X_val, y_val) in layer_datasets.items():
            logger.info("Training FOHEM for %s ...", layer.value)
            self.models[layer].fit(X_tr, y_tr, X_val, y_val)
            results[layer.value] = self.models[layer].metadata
        return results

    def predict_system_yield(
        self, X: pd.DataFrame
    ) -> Dict[str, Dict[str, np.ndarray]]:
        """
        Predict yield with confidence intervals for all trained layers.

        Args:
            X: Feature matrix.

        Returns:
            Dict of layer_name → prediction dict.
        """
        results: Dict[str, Dict[str, np.ndarray]] = {}
        for layer in StrataLayer:
            if self.models[layer].is_trained:
                results[layer.value] = self.models[layer].predict_with_confidence(X)
        return results

    def compute_LER(
        self,
        intercrop_preds: Dict[str, Dict[str, np.ndarray]],
        monocrop_baselines: Dict[str, float],
    ) -> float:
        """
        Compute Land Equivalent Ratio.

        LER = Σ(yield_IC / yield_mono) per layer.

        Args:
            intercrop_preds: Prediction dict from predict_system_yield().
            monocrop_baselines: Mono-crop yield baseline per layer name.

        Returns:
            LER value (>1.0 means intercropping is more efficient).
        """
        ler = 0.0
        for layer_name, pred_dict in intercrop_preds.items():
            pred_mean = float(pred_dict["prediction"].mean())
            mono_yield = monocrop_baselines.get(layer_name, 1.0)
            if mono_yield > 0:
                ler += pred_mean / mono_yield
        return ler

    def is_any_trained(self) -> bool:
        """Check if at least one layer model is trained."""
        return any(m.is_trained for m in self.models.values())
