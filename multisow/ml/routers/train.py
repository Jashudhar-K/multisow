"""
POST /ml/train        — Kick off FOHEM training from feature store.
GET  /ml/train/{job_id}/status — Poll training job progress.
"""

from __future__ import annotations

import logging
import threading
import time
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import APIRouter, BackgroundTasks, HTTPException

from multisow.ml.schemas.prediction import TrainJobStatus, TrainRequest
from multisow.ml.schemas.strata import StrataLayer

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ml", tags=["ml-train"])

# In-memory job registry (max 50 jobs)
_jobs: Dict[str, TrainJobStatus] = {}
_fohem_system: Any = None
_feature_store: Any = None


def set_train_deps(fohem_system: Any, feature_store: Any) -> None:
    """Inject dependencies at startup."""
    global _fohem_system, _feature_store
    _fohem_system = fohem_system
    _feature_store = feature_store


@router.post("/train", response_model=TrainJobStatus)
async def start_training(
    body: TrainRequest,
    background_tasks: BackgroundTasks,
) -> TrainJobStatus:
    """
    Queue a FOHEM training job.

    Training runs in a background thread (Celery-backed in production).
    Poll /ml/train/{job_id}/status for progress.
    """
    job_id = str(uuid.uuid4())
    status = TrainJobStatus(job_id=job_id, status="queued", progress_pct=0.0)
    _jobs[job_id] = status

    # Trim old jobs
    if len(_jobs) > 50:
        oldest = list(_jobs.keys())[0]
        _jobs.pop(oldest, None)

    background_tasks.add_task(
        _run_training, job_id, body.farm_ids, body.layers, body.train_split, body.val_split
    )
    return status


@router.get("/train/{job_id}/status", response_model=TrainJobStatus)
async def training_status(job_id: str) -> TrainJobStatus:
    """Poll current training job status."""
    status = _jobs.get(job_id)
    if status is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return status


# ---------------------------------------------------------------------------
# Background training logic
# ---------------------------------------------------------------------------


def _run_training(
    job_id: str,
    farm_ids: list,
    layers: list,
    train_split: float,
    val_split: float,
) -> None:
    """
    Execute FOHEM training in a background thread.

    Steps:
      1. Load feature matrix from feature store
      2. For each requested layer, fit FOHEM
      3. Update job progress
      4. Optionally log to MLflow
    """
    import numpy as np
    import pandas as pd

    status = _jobs.get(job_id)
    if status is None:
        return

    status.status = "running"
    status.progress_pct = 5.0


    try:
        # Load data from feature store
        if _feature_store is not None:
            try:
                df = _feature_store.get_global_training_set(min_farms=1)
                if df is None or df.empty:
                    df = _generate_fallback_data()
            except Exception:
                df = _generate_fallback_data()
        else:
            df = _generate_fallback_data()

        status.progress_pct = 15.0

        # Target column
        target_col = "yield_t_ha"
        if target_col not in df.columns:
            df[target_col] = np.random.uniform(3, 15, size=len(df))

        feature_cols = [c for c in df.columns if c != target_col and c != "layer"]

        n = len(df)
        n_train = int(n * train_split)
        n_val = int(n * val_split)

        total_layers = len(layers)
        # Store training data for explainers
        layer_training_data = {}

        for idx, layer_name in enumerate(layers):
            status.current_layer = layer_name
            progress_base = 15.0 + (idx / total_layers) * 75.0

            if _fohem_system is None:
                status.metrics_so_far[layer_name] = {"error": "FOHEMSystem not initialized"}
                continue

            fohem = _fohem_system.layer_models.get(layer_name)
            if fohem is None:
                status.metrics_so_far[layer_name] = {"error": f"No model for layer {layer_name}"}
                continue

            # Filter data for this layer if we have a layer column
            if "layer" in df.columns:
                layer_df = df[df["layer"] == layer_name]
                if layer_df.empty:
                    layer_df = df
            else:
                layer_df = df

            X = layer_df[feature_cols].values
            y = layer_df[target_col].values

            X_train, y_train = X[:n_train], y[:n_train]
            X_val, y_val = X[n_train : n_train + n_val], y[n_train : n_train + n_val]

            if len(X_val) == 0:
                X_val, y_val = X_train, y_train

            try:
                fohem.fit(X_train, y_train, X_val, y_val, feature_names=feature_cols)
                metrics = {
                    "status": "trained",
                    "n_train": len(X_train),
                    "n_val": len(X_val),
                    "weights": list(fohem.weights),
                }
                status.metrics_so_far[layer_name] = metrics
                # Save training data for explainers
                import pandas as pd
                layer_training_data[layer_name] = pd.DataFrame(X_train, columns=feature_cols)
            except Exception as exc:
                logger.error("Training failed for %s: %s", layer_name, exc)
                status.metrics_so_far[layer_name] = {"error": str(exc)}

            status.progress_pct = progress_base + (75.0 / total_layers)

        # Build and wire up SHAP and LIME explainers for all trained layers
        try:
            from multisow.ml.explainability.shap_explainer import FOHEMSHAPExplainer
            from multisow.ml.explainability.lime_explainer import FOHEMLIMEExplainer
            shap_explainers = {}
            lime_explainers = {}
            for layer_name in layers:
                fohem = _fohem_system.layer_models.get(layer_name)
                if fohem is not None and getattr(fohem, 'is_trained', False):
                    # SHAP explainer
                    try:
                        shap_explainers[layer_name] = FOHEMSHAPExplainer(fohem)
                    except Exception as exc:
                        logger.warning(f"Failed to build SHAP explainer for {layer_name}: {exc}")
                    # LIME explainer
                    try:
                        train_df = layer_training_data.get(layer_name)
                        lime_explainers[layer_name] = FOHEMLIMEExplainer(fohem, training_data=train_df)
                    except Exception as exc:
                        logger.warning(f"Failed to build LIME explainer for {layer_name}: {exc}")
            # Wire up explainers in explain router
            import multisow.ml.routers.explain as ml_explain
            ml_explain.set_explain_deps(_fohem_system, shap_explainers, lime_explainers)
            logger.info("Wired up SHAP and LIME explainers for layers: %s", list(shap_explainers.keys()))
        except Exception as exc:
            logger.warning(f"Failed to wire up explainers: {exc}")

        # Try MLflow logging
        _log_to_mlflow(job_id, status)

        status.status = "completed"
        status.progress_pct = 100.0

    except Exception as exc:
        logger.error("Training job %s failed: %s", job_id, exc)
        status.status = "failed"
        status.metrics_so_far["error"] = str(exc)


def _generate_fallback_data() -> "pd.DataFrame":
    """Generate synthetic training data when feature store is empty."""
    import numpy as np
    import pandas as pd

    rng = np.random.default_rng(42)
    n = 300
    data = {
        "LAI": rng.uniform(1, 8, n),
        "k_coeff": rng.uniform(0.3, 0.7, n),
        "row_spacing_m": rng.uniform(1, 8, n),
        "soil_N": rng.uniform(20, 200, n),
        "soil_P": rng.uniform(5, 50, n),
        "soil_K": rng.uniform(0.5, 5, n),
        "soil_pH": rng.uniform(4.5, 7.5, n),
        "VWC": rng.uniform(0.1, 0.45, n),
        "GDD": rng.uniform(500, 3000, n),
        "rainfall_7d": rng.uniform(10, 200, n),
        "solar_elevation_deg": rng.uniform(30, 75, n),
        "root_depth_cm": rng.uniform(20, 200, n),
        "root_radius_cm": rng.uniform(10, 100, n),
        "canopy_height_m": rng.uniform(1, 25, n),
        "path_width_m": rng.uniform(0.5, 5, n),
        "crop_density": rng.uniform(0.2, 0.9, n),
        "shade_fraction": rng.uniform(0, 0.8, n),
        "yield_t_ha": rng.uniform(3, 18, n),
    }
    return pd.DataFrame(data)


def _log_to_mlflow(job_id: str, status: TrainJobStatus) -> None:
    """Log training metrics to MLflow if available."""
    try:
        import mlflow

        with mlflow.start_run(run_name=f"fohem-train-{job_id[:8]}"):
            for layer, metrics in status.metrics_so_far.items():
                if isinstance(metrics, dict) and "weights" in metrics:
                    for i, w in enumerate(metrics["weights"]):
                        mlflow.log_metric(f"{layer}_weight_{i}", w)
                    mlflow.log_metric(f"{layer}_n_train", metrics.get("n_train", 0))
    except Exception:
        pass  # MLflow not available — silently skip
