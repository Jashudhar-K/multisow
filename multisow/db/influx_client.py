"""
InfluxDB 2.x client wrapper with graceful fallback to SQLite.

When InfluxDB is not available, all writes go to the ``sensor_readings``
SQLAlchemy table, and queries are transformed into ORM calls.
"""

from __future__ import annotations

import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

import pandas as pd

logger = logging.getLogger(__name__)

# Try to import InfluxDB client
try:
    from influxdb_client import InfluxDBClient, Point
    from influxdb_client.client.write_api import SYNCHRONOUS

    HAS_INFLUX = True
except ImportError:
    HAS_INFLUX = False
    logger.info("influxdb-client not installed; using SQLite fallback for sensor data")


class InfluxClientWrapper:
    """
    Thin wrapper around InfluxDB 2.x with SQLite fallback.

    Args:
        url: InfluxDB URL (e.g. ``http://localhost:8086``).
        token: Authentication token.
        org: InfluxDB organisation.
        bucket: Target bucket name.
        db_session_factory: SQLAlchemy ``SessionLocal`` for fallback.
    """

    def __init__(
        self,
        url: str = "http://localhost:8086",
        token: str = "",
        org: str = "multisow",
        bucket: str = "sensor_data",
        db_session_factory: Any = None,
    ) -> None:
        self.url = url
        self.token = token
        self.org = org
        self.bucket = bucket
        self._db_session_factory = db_session_factory
        self._client: Any = None
        self._write_api: Any = None
        self._query_api: Any = None
        self._connected = False

        if HAS_INFLUX and url and token:
            try:
                self._client = InfluxDBClient(url=url, token=token, org=org)
                self._write_api = self._client.write_api(write_options=SYNCHRONOUS)
                self._query_api = self._client.query_api()
                # Quick health check
                health = self._client.health()
                if health.status == "pass":
                    self._connected = True
                    logger.info("Connected to InfluxDB at %s", url)
            except Exception as exc:
                logger.warning("InfluxDB connection failed: %s — using SQLite", exc)

    @property
    def is_connected(self) -> bool:
        """Whether InfluxDB is available."""
        return self._connected

    def write_sensor_batch(
        self,
        farm_id: str,
        records: List[Dict[str, Any]],
        measurement: str = "sensor",
    ) -> int:
        """
        Write a batch of sensor readings.

        Each record should contain: ``sensor_type``, ``value``,
        and optionally ``unit``, ``timestamp``.

        Args:
            farm_id: Farm identifier (used as InfluxDB tag).
            records: List of sensor reading dicts.
            measurement: InfluxDB measurement name.

        Returns:
            Number of records written.
        """
        if self._connected and self._write_api is not None:
            return self._write_influx(farm_id, records, measurement)
        return self._write_sqlite(farm_id, records)

    def _write_influx(
        self, farm_id: str, records: List[Dict[str, Any]], measurement: str
    ) -> int:
        points = []
        for rec in records:
            p = (
                Point(measurement)
                .tag("farm_id", farm_id)
                .tag("sensor_type", rec.get("sensor_type", "unknown"))
                .field("value", float(rec.get("value", 0.0)))
            )
            ts = rec.get("timestamp")
            if ts:
                p = p.time(ts)
            points.append(p)

        try:
            self._write_api.write(bucket=self.bucket, record=points)
            return len(points)
        except Exception as exc:
            logger.warning("InfluxDB write failed: %s — falling back", exc)
            return self._write_sqlite(farm_id, records)

    def _write_sqlite(self, farm_id: str, records: List[Dict[str, Any]]) -> int:
        if self._db_session_factory is None:
            logger.warning("No DB session factory; sensor data dropped")
            return 0

        # Late import to avoid circular deps
        from backend.models import SensorReading

        db = self._db_session_factory()
        count = 0
        try:
            for rec in records:
                sr = SensorReading(
                    farm_id=farm_id,
                    sensor_type=rec.get("sensor_type", "unknown"),
                    value=float(rec.get("value", 0.0)),
                    unit=rec.get("unit"),
                    timestamp=rec.get("timestamp", datetime.utcnow()),
                    metadata_json=str(rec.get("metadata", "")),
                )
                db.add(sr)
                count += 1
            db.commit()
        except Exception as exc:
            db.rollback()
            logger.error("SQLite sensor write failed: %s", exc)
        finally:
            db.close()

        return count

    def query_sensor_data(
        self,
        farm_id: str,
        start: str = "-7d",
        stop: str = "now()",
        sensor_type: Optional[str] = None,
    ) -> pd.DataFrame:
        """
        Query sensor data for a farm.

        Args:
            farm_id: Farm identifier.
            start: InfluxDB time range start (e.g. ``-7d``).
            stop: InfluxDB time range stop.
            sensor_type: Optional filter by sensor type.

        Returns:
            DataFrame with columns: timestamp, sensor_type, value.
        """
        if self._connected and self._query_api is not None:
            return self._query_influx(farm_id, start, stop, sensor_type)
        return self._query_sqlite(farm_id, sensor_type)

    def _query_influx(
        self, farm_id: str, start: str, stop: str, sensor_type: Optional[str]
    ) -> pd.DataFrame:
        flux = f"""
from(bucket: "{self.bucket}")
  |> range(start: {start}, stop: {stop})
  |> filter(fn: (r) => r["farm_id"] == "{farm_id}")
"""
        if sensor_type:
            flux += f'  |> filter(fn: (r) => r["sensor_type"] == "{sensor_type}")\n'

        try:
            tables = self._query_api.query(flux, org=self.org)
            rows = []
            for table in tables:
                for record in table.records:
                    rows.append({
                        "timestamp": record.get_time(),
                        "sensor_type": record.values.get("sensor_type", ""),
                        "value": record.get_value(),
                    })
            return pd.DataFrame(rows) if rows else pd.DataFrame(columns=["timestamp", "sensor_type", "value"])
        except Exception as exc:
            logger.warning("InfluxDB query failed: %s", exc)
            return self._query_sqlite(farm_id, sensor_type)

    def _query_sqlite(
        self, farm_id: str, sensor_type: Optional[str]
    ) -> pd.DataFrame:
        if self._db_session_factory is None:
            return pd.DataFrame(columns=["timestamp", "sensor_type", "value"])

        from backend.models import SensorReading

        db = self._db_session_factory()
        try:
            q = db.query(SensorReading).filter(SensorReading.farm_id == farm_id)
            if sensor_type:
                q = q.filter(SensorReading.sensor_type == sensor_type)
            records = q.order_by(SensorReading.timestamp.desc()).limit(5000).all()
            rows = [
                {
                    "timestamp": r.timestamp,
                    "sensor_type": r.sensor_type,
                    "value": r.value,
                }
                for r in records
            ]
            return pd.DataFrame(rows) if rows else pd.DataFrame(columns=["timestamp", "sensor_type", "value"])
        finally:
            db.close()

    def close(self) -> None:
        """Close InfluxDB connection."""
        if self._client is not None:
            try:
                self._client.close()
            except Exception:
                pass
