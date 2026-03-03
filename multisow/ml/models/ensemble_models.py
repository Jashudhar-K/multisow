"""
Ensemble sub-models for FOHEM: Random Forest, CatBoost, and Extreme Learning Machine.

Each model follows a common interface: fit(X, y), predict(X).
CatBoost handles categorical features natively.
ELM implements the single-hidden-layer random-projection approach.
"""

from __future__ import annotations

import logging
from typing import List, Optional

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Random Forest
# ---------------------------------------------------------------------------

class RandomForestSubModel:
    """Scikit-learn Random Forest regressor for per-layer yield prediction."""

    def __init__(
        self,
        n_estimators: int = 500,
        max_depth: int = 12,
        min_samples_leaf: int = 5,
        n_jobs: int = -1,
        random_state: int = 42,
    ) -> None:
        """
        Initialise RF hyper-parameters.

        Args:
            n_estimators: Number of trees.
            max_depth: Maximum tree depth.
            min_samples_leaf: Minimum samples per leaf.
            n_jobs: Parallel jobs (-1 = all cores).
            random_state: RNG seed.
        """
        self.params = {
            "n_estimators": n_estimators,
            "max_depth": max_depth,
            "min_samples_leaf": min_samples_leaf,
            "n_jobs": n_jobs,
            "random_state": random_state,
        }
        self.model = None
        self._feature_names: Optional[List[str]] = None

    def fit(self, X: pd.DataFrame | np.ndarray, y: pd.Series | np.ndarray) -> None:
        """
        Train the Random Forest.

        Args:
            X: Feature matrix.
            y: Target vector (yield_t_ha).
        """
        from sklearn.ensemble import RandomForestRegressor

        self.model = RandomForestRegressor(**self.params)
        if isinstance(X, pd.DataFrame):
            self._feature_names = list(X.columns)
        self.model.fit(X, y)
        logger.info("RF trained on %d samples, %d features", len(y), X.shape[1])

    def predict(self, X: pd.DataFrame | np.ndarray) -> np.ndarray:
        """
        Generate predictions.

        Args:
            X: Feature matrix.

        Returns:
            1-D numpy array of predictions.
        """
        if self.model is None:
            raise RuntimeError("RandomForestSubModel not trained — call fit() first")
        return self.model.predict(X)

    def get_feature_importance(self) -> pd.Series:
        """
        Return feature importances as a named Series.

        Returns:
            pd.Series indexed by feature name.
        """
        if self.model is None:
            return pd.Series(dtype=float)
        importances = self.model.feature_importances_
        names = self._feature_names or [f"f{i}" for i in range(len(importances))]
        return pd.Series(importances, index=names).sort_values(ascending=False)


# ---------------------------------------------------------------------------
# CatBoost
# ---------------------------------------------------------------------------

class CatBoostSubModel:
    """CatBoost gradient-boosted regressor with native categorical support."""

    def __init__(
        self,
        iterations: int = 1000,
        depth: int = 8,
        learning_rate: float = 0.05,
        l2_leaf_reg: float = 3.0,
        random_seed: int = 42,
        verbose: int = 0,
    ) -> None:
        """
        Initialise CatBoost hyper-parameters.

        Args:
            iterations: Boosting rounds.
            depth: Tree depth.
            learning_rate: Step size.
            l2_leaf_reg: L2 regularisation.
            random_seed: RNG seed.
            verbose: Logging verbosity.
        """
        self.params = {
            "iterations": iterations,
            "depth": depth,
            "learning_rate": learning_rate,
            "l2_leaf_reg": l2_leaf_reg,
            "random_seed": random_seed,
            "verbose": verbose,
        }
        self.model = None
        self._has_catboost = True

    def fit(
        self,
        X: pd.DataFrame | np.ndarray,
        y: pd.Series | np.ndarray,
        cat_features: Optional[List[int]] = None,
    ) -> None:
        """
        Train the CatBoost model.

        Falls back to GradientBoosting from scikit-learn if CatBoost is
        not installed.

        Args:
            X: Feature matrix.
            y: Target vector.
            cat_features: Indices of categorical columns.
        """
        try:
            from catboost import CatBoostRegressor, Pool

            pool = Pool(X, y, cat_features=cat_features)
            self.model = CatBoostRegressor(**self.params)
            self.model.fit(pool)
            logger.info("CatBoost trained on %d samples", len(y))
        except ImportError:
            logger.warning("catboost not installed; using sklearn GradientBoosting")
            self._has_catboost = False
            from sklearn.ensemble import GradientBoostingRegressor

            self.model = GradientBoostingRegressor(
                n_estimators=self.params["iterations"],
                max_depth=self.params["depth"],
                learning_rate=self.params["learning_rate"],
                random_state=self.params["random_seed"],
            )
            X_numeric = np.asarray(X, dtype=float) if not isinstance(X, np.ndarray) else X
            self.model.fit(X_numeric, y)

    def predict(self, X: pd.DataFrame | np.ndarray) -> np.ndarray:
        """
        Generate predictions.

        Args:
            X: Feature matrix.

        Returns:
            1-D numpy array of predictions.
        """
        if self.model is None:
            raise RuntimeError("CatBoostSubModel not trained — call fit() first")
        pred = self.model.predict(X)
        return np.asarray(pred).flatten()


# ---------------------------------------------------------------------------
# Extreme Learning Machine
# ---------------------------------------------------------------------------

class ELMSubModel:
    """
    Extreme Learning Machine (single hidden layer, random projections).

    Architecture:
      - Random input weights W (n_features × n_hidden), frozen.
      - Random biases b (n_hidden,), frozen.
      - H = relu(X @ W + b)
      - Output weights β = pinv(H) @ y   (Moore-Penrose pseudo-inverse)
    """

    def __init__(
        self,
        n_hidden: int = 1024,
        activation: str = "relu",
        random_state: int = 42,
    ) -> None:
        """
        Initialise ELM parameters.

        Args:
            n_hidden: Number of hidden neurons.
            activation: Activation function (``"relu"`` or ``"sigmoid"``).
            random_state: RNG seed.
        """
        self.n_hidden = n_hidden
        self.activation = activation
        self.random_state = random_state
        self.W: Optional[np.ndarray] = None
        self.b: Optional[np.ndarray] = None
        self.beta: Optional[np.ndarray] = None

    def _activate(self, Z: np.ndarray) -> np.ndarray:
        """Apply activation function element-wise."""
        if self.activation == "sigmoid":
            return 1.0 / (1.0 + np.exp(-np.clip(Z, -500, 500)))
        # Default: ReLU
        return np.maximum(0, Z)

    def fit(self, X: np.ndarray, y: np.ndarray) -> None:
        """
        Train the ELM.

        Generates random input weights and biases, computes the hidden
        layer matrix H, then solves for output weights β using
        least-squares pseudo-inverse.

        Args:
            X: Feature matrix (n_samples × n_features) as numpy array.
            y: Target vector (n_samples,) as numpy array.
        """
        X = np.asarray(X, dtype=np.float64)
        y = np.asarray(y, dtype=np.float64).ravel()

        rng = np.random.RandomState(self.random_state)
        n_features = X.shape[1]

        # Random input weights and biases (frozen)
        self.W = rng.randn(n_features, self.n_hidden) * np.sqrt(2.0 / n_features)
        self.b = rng.randn(self.n_hidden) * 0.1

        # Hidden layer
        H = self._activate(X @ self.W + self.b)

        # Output weights via least-squares (more stable than pinv)
        self.beta, _, _, _ = np.linalg.lstsq(H, y, rcond=None)

        logger.info(
            "ELM trained: %d hidden neurons, %d features, %d samples",
            self.n_hidden, n_features, len(y),
        )

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict with the trained ELM.

        Args:
            X: Feature matrix (n_samples × n_features).

        Returns:
            1-D numpy array of predictions.
        """
        if self.W is None or self.beta is None:
            raise RuntimeError("ELMSubModel not trained — call fit() first")

        X = np.asarray(X, dtype=np.float64)
        H = self._activate(X @ self.W + self.b)
        return (H @ self.beta).ravel()
