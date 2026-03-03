"""
Data ingestion and feature store endpoints.

POST /ml/ingest/sensor   — Ingest IoT sensor batch
POST /ml/ingest/manual   — Upload manual CSV records
POST /ml/ingest/climate  — Trigger NASA POWER climate fetch
POST /ml/ingest/drone    — Ingest drone NDVI imagery (mock)
GET  /ml/data/features   — List stored feature matrix versions
GET  /ml/data/health     — Data completeness report
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, UploadFile, File, Query

from multisow.ml.schemas.prediction import (
    ClimateFetchRequest,
    DataHealthReport,
    SensorBatch,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ml", tags=["ml-data"])

# Dependencies injected at startup
_sensor_ingester: Any = None
_manual_ingester: Any = None
_climate_ingester: Any = None
_drone_ingester: Any = None
_feature_store: Any = None


def set_data_deps(
    sensor_ingester: Any = None,
    manual_ingester: Any = None,
    climate_ingester: Any = None,
    drone_ingester: Any = None,
    feature_store: Any = None,
) -> None:
    """Inject pipeline dependencies at startup."""
    global _sensor_ingester, _manual_ingester, _climate_ingester
    global _drone_ingester, _feature_store
    _sensor_ingester = sensor_ingester
    _manual_ingester = manual_ingester
    _climate_ingester = climate_ingester
    _drone_ingester = drone_ingester
    _feature_store = feature_store


# ---------------------------------------------------------------------------
# Sensor ingestion
# ---------------------------------------------------------------------------

@router.post("/ingest/sensor")
async def ingest_sensor(body: SensorBatch) -> Dict[str, Any]:
    """
    Ingest a batch of IoT sensor readings.

    Data is stored in InfluxDB (or in-memory fallback) and
    can be fused into the feature store later.
    """
    if _sensor_ingester is None:
        return {"status": "warning", "message": "Sensor ingester not configured", "records": 0}

    import pandas as pd

    try:
        df = pd.DataFrame(body.readings)
        _sensor_ingester.write_batch(body.farm_id, df)
        return {"status": "ok", "farm_id": body.farm_id, "records": len(body.readings)}
    except Exception as exc:
        logger.error("Sensor ingest failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


# ---------------------------------------------------------------------------
# Manual CSV ingestion
# ---------------------------------------------------------------------------

@router.post("/ingest/manual")
async def ingest_manual(
    farm_id: str = Query(..., description="Farm identifier"),
    file: UploadFile = File(..., description="CSV file with field records"),
) -> Dict[str, Any]:
    """
    Upload a manual CSV of field observations.

    Expected columns: date, crop_species, yield_t_ha, soil_N, soil_P, soil_K, ...
    """
    if _manual_ingester is None:
        return {"status": "warning", "message": "Manual ingester not configured"}

    import pandas as pd
    import io

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        result_df = _manual_ingester.ingest(farm_id, df)
        return {
            "status": "ok",
            "farm_id": farm_id,
            "records": len(result_df),
            "columns": list(result_df.columns),
        }
    except Exception as exc:
        logger.error("Manual ingest failed: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc))


# ---------------------------------------------------------------------------
# Climate data fetch
# ---------------------------------------------------------------------------

@router.post("/ingest/climate")
async def ingest_climate(body: ClimateFetchRequest) -> Dict[str, Any]:
    """
    Trigger NASA POWER / IMD climate data fetch for a location/date range.
    """
    if _climate_ingester is None:
        return {"status": "warning", "message": "Climate ingester not configured"}

    try:
        df = _climate_ingester.fetch(
            lat=body.lat,
            lon=body.lon,
            start_date=body.start_date,
            end_date=body.end_date,
        )
        return {
            "status": "ok",
            "farm_id": body.farm_id,
            "records": len(df) if df is not None else 0,
            "date_range": f"{body.start_date} → {body.end_date}",
        }
    except Exception as exc:
        logger.error("Climate ingest failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


# ---------------------------------------------------------------------------
# Drone imagery (mock)
# ---------------------------------------------------------------------------

@router.post("/ingest/drone")
async def ingest_drone(
    farm_id: str = Query(..., description="Farm identifier"),
    file: UploadFile = File(..., description="GeoTIFF NDVI mosaic"),
) -> Dict[str, Any]:
    """
    Ingest drone NDVI imagery (GeoTIFF).

    Converts NDVI to LAI estimates; stores in PostGIS (or mock).
    """
    if _drone_ingester is None:
        return {"status": "warning", "message": "Drone ingester not configured"}

    try:
        contents = await file.read()
        # Real pipeline would save file, then process
        result = _drone_ingester.ingest_from_bytes(farm_id, contents)
        return {
            "status": "ok",
            "farm_id": farm_id,
            "pixels_processed": result.get("pixels_processed", 0),
            "mean_LAI": round(result.get("mean_LAI", 0.0), 3),
        }
    except Exception as exc:
        logger.error("Drone ingest failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


# ---------------------------------------------------------------------------
# Feature store queries
# ---------------------------------------------------------------------------

@router.get("/data/features")
async def list_features(
    farm_id: Optional[str] = Query(None, description="Filter by farm"),
) -> Dict[str, Any]:
    """
    List available feature matrix versions in the feature store.
    """
    if _feature_store is None:
        return {"versions": [], "message": "Feature store not configured"}

    try:
        versions = _feature_store.list_versions(farm_id)
        return {"versions": versions}
    except Exception as exc:
        logger.error("Feature store query failed: %s", exc)
        return {"versions": [], "error": str(exc)}


@router.get("/data/health", response_model=DataHealthReport)
async def data_health(
    farm_id: str = Query(..., description="Farm to check"),
) -> DataHealthReport:
    """
    Return a data health / completeness report for a farm.
    """
    import pandas as pd

    if _feature_store is None:
        return DataHealthReport(farm_id=farm_id, quality_score=0.0)

    try:
        versions = _feature_store.list_versions(farm_id)
        if not versions:
            return DataHealthReport(farm_id=farm_id, quality_score=0.0)

        latest = versions[-1]
        df = _feature_store.load_feature_matrix(farm_id, latest)
        if df is None or df.empty:
            return DataHealthReport(farm_id=farm_id, quality_score=0.0)

        total = len(df)
        missing_pct = {
            col: round(float(df[col].isna().mean()) * 100, 2)
            for col in df.columns
        }

        quality = max(0.0, 1.0 - sum(missing_pct.values()) / (len(missing_pct) * 100))

        temporal: Dict[str, str] = {}
        if "date" in df.columns:
            temporal["start"] = str(df["date"].min())
            temporal["end"] = str(df["date"].max())

        return DataHealthReport(
            farm_id=farm_id,
            total_records=total,
            missing_pct=missing_pct,
            temporal_coverage=temporal,
            quality_score=round(quality, 3),
        )
    except Exception as exc:
        logger.error("Data health check failed: %s", exc)
        return DataHealthReport(farm_id=farm_id, quality_score=0.0)
