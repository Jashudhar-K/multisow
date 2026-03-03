"""
Centralized configuration for the MultiSow ML subsystem.

Uses pydantic BaseSettings to load from environment variables / .env file.
All external services (InfluxDB, PostgreSQL, Redis, MLflow) are optional
and the system degrades gracefully when they are unavailable.
"""

from __future__ import annotations

import os
from typing import Optional

from pydantic_settings import BaseSettings


class MLSettings(BaseSettings):
    """ML subsystem configuration, populated from environment or .env."""

    # ---------- Core database ----------
    DATABASE_URL: str = "sqlite:///./sql_app.db"

    # ---------- InfluxDB 2.x (optional) ----------
    INFLUXDB_URL: str = "http://localhost:8086"
    INFLUXDB_TOKEN: str = ""
    INFLUXDB_ORG: str = "multisow"
    INFLUXDB_BUCKET: str = "sensors"

    # ---------- PostgreSQL / PostGIS (optional) ----------
    POSTGRES_URL: Optional[str] = None  # e.g. postgresql://multisow:pass@localhost/multisow

    # ---------- Redis (optional, for Celery) ----------
    REDIS_URL: str = "redis://localhost:6379/0"

    # ---------- MLflow (optional) ----------
    MLFLOW_TRACKING_URI: str = "http://localhost:5000"

    # ---------- Model paths ----------
    ML_MODEL_PATH: str = os.path.join("multisow", "ml", "saved_models")

    # ---------- Runtime ----------
    ENVIRONMENT: str = "dev"  # dev | staging | prod
    FOHEM_AUTO_RETRAIN_THRESHOLD: int = 50  # new records before auto-retrain
    FOHEM_BOOTSTRAP_ON_STARTUP: bool = True  # train from synthetic if no model

    # ---------- Feature store ----------
    FEATURE_STORE_PATH: str = os.path.join("multisow", "ml", "feature_store_data")

    model_config = {"env_prefix": "MULTISOW_", "env_file": ".env", "extra": "ignore"}


# Singleton instance
settings = MLSettings()
