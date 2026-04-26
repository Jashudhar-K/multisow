"""
arq background worker settings for async ML task processing.

Tasks defined here run in a separate process, keeping the
FastAPI web server strictly focused on HTTP request routing.

Usage (dev):
    arq backend.worker.WorkerSettings

Usage (docker):
    See arq_worker service in docker-compose.yml
"""

import os
import logging
from arq import cron
from arq.connections import RedisSettings

logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("MULTISOW_REDIS_URL", "redis://localhost:6379/0")


# ---------------------------------------------------------------------------
# Task definitions
# ---------------------------------------------------------------------------


async def run_fohem_training(ctx: dict, farm_ids: list | None = None) -> dict:
    """
    Run FOHEM model training in the background.
    Called via: await arq_pool.enqueue_job('run_fohem_training', farm_ids=[...])
    """
    logger.info("arq: Starting FOHEM training job (farms=%s)", farm_ids)
    try:
        from multisow.ml.models.fohem import FOHEMSystem
        from multisow.ml.pipelines.feature_store import FeatureStore

        system = FOHEMSystem()
        store = FeatureStore()
        df = store.get_global_training_set(min_farms=1)

        if df is not None and not df.empty:
            # Placeholder — actual training logic would go here
            logger.info("arq: Training on %d rows", len(df))
            return {"status": "completed", "rows": len(df)}
        else:
            return {"status": "skipped", "reason": "no training data"}
    except Exception as exc:
        logger.error("arq: FOHEM training failed: %s", exc)
        return {"status": "failed", "error": str(exc)}


async def run_strata_optimization(
    ctx: dict,
    farm_id: str,
    environment: dict,
    constraints: dict | None = None,
) -> dict:
    """
    Run the NSGA-II strata optimizer in the background for large pop sizes.
    """
    logger.info("arq: Starting strata optimization for farm %s", farm_id)
    try:
        from multisow.ml.models.strata_optimizer import (
            StrataFitnessEvaluator,
            StrataOptimizer,
        )

        evaluator = StrataFitnessEvaluator(
            incident_par=environment.get("incident_par", 1800),
            solar_elevation=environment.get("solar_elevation_deg", 45),
            soil_n=environment.get("soil_n", 200),
            soil_p=environment.get("soil_p", 25),
            soil_k=environment.get("soil_k", 150),
            vwc=environment.get("vwc", 0.3),
            gdd_available=environment.get("gdd_available", 3000),
        )

        optimizer = StrataOptimizer(
            population_size=200,
            n_generations=100,
            evaluator=evaluator,
        )

        pareto_front = optimizer.optimize()
        results = [cfg.to_dict() for cfg in pareto_front[:10]]
        return {"status": "completed", "results": results}
    except Exception as exc:
        logger.error("arq: Optimization failed: %s", exc)
        return {"status": "failed", "error": str(exc)}


# ---------------------------------------------------------------------------
# Worker settings
# ---------------------------------------------------------------------------


def _parse_redis_url(url: str) -> RedisSettings:
    """Parse a redis:// URL into arq RedisSettings."""
    from urllib.parse import urlparse

    parsed = urlparse(url)
    return RedisSettings(
        host=parsed.hostname or "localhost",
        port=parsed.port or 6379,
        database=int(parsed.path.lstrip("/") or "0"),
        password=parsed.password,
    )


class WorkerSettings:
    """arq worker configuration."""

    functions = [
        run_fohem_training,
        run_strata_optimization,
    ]

    redis_settings = _parse_redis_url(REDIS_URL)

    # Maximum concurrent jobs per worker
    max_jobs = 4

    # Job timeout: 10 minutes for ML training
    job_timeout = 600

    # Health check key
    health_check_key = "multisow:arq:health"
