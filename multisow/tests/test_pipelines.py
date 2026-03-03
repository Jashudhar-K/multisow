"""
Tests for data pipelines: ingest, preprocess, feature store.
"""

from __future__ import annotations

from pathlib import Path
import tempfile

import numpy as np
import pandas as pd
import pytest

FIXTURES_DIR = Path(__file__).parent / "fixtures"


@pytest.fixture
def sample_sensor_df() -> pd.DataFrame:
    """Sample sensor DataFrame."""
    rng = np.random.default_rng(99)
    n = 20
    return pd.DataFrame({
        "timestamp": pd.date_range("2024-01-01", periods=n, freq="h"),
        "sensor_type": ["temperature"] * 10 + ["humidity"] * 10,
        "value": rng.uniform(20, 40, n),
    })


@pytest.fixture
def sample_manual_df() -> pd.DataFrame:
    """Sample manual CSV-like DataFrame."""
    return pd.DataFrame({
        "date": ["2024-01-01", "2024-01-02", "2024-01-03"],
        "crop_species": ["Coconut", "Banana", "Turmeric"],
        "yield_t_ha": [10.5, 15.2, 6.8],
        "soil_N": [120, 100, 80],
        "soil_P": [22, 18, 14],
        "soil_K": [2.5, 2.0, 1.5],
    })


# -----------------------------------------------------------------------
# IoT Sensor Ingester
# -----------------------------------------------------------------------


class TestSensorIngester:
    def test_in_memory_write_and_fetch(self, sample_sensor_df):
        from multisow.ml.pipelines.ingest import IoTSensorIngester

        ingester = IoTSensorIngester()  # In-memory fallback
        # Write individual sensor readings
        for _, row in sample_sensor_df.iterrows():
            ingester.write_sensor_reading({
                "farm_id": "farm_test",
                "sensor_type": row["sensor_type"],
                "value": row["value"],
                "layer_depth": 0.0,
                "unit": "C" if row["sensor_type"] == "temperature" else "%",
                "quality_flag": 1,
            })

        data = ingester.fetch_sensor_readings("farm_test", start="-7d", stop="now()")
        assert len(data) > 0


# -----------------------------------------------------------------------
# Manual Record Ingester
# -----------------------------------------------------------------------


class TestManualIngester:
    def test_ingest_csv(self, sample_manual_df):
        from multisow.ml.pipelines.ingest import ManualRecordIngester

        ingester = ManualRecordIngester()
        # Write the sample data to a temp CSV and ingest
        with tempfile.NamedTemporaryFile(suffix=".csv", delete=False, mode="w") as f:
            sample_manual_df.to_csv(f.name, index=False)
            result = ingester.ingest_csv(f.name, farm_id="farm_test")
        assert len(result) == 3
        assert "crop_species" in result.columns
        assert "farm_id" in result.columns


# -----------------------------------------------------------------------
# Climate Ingester
# -----------------------------------------------------------------------


class TestClimateIngester:
    def test_fetch_mock_climate(self):
        from multisow.ml.pipelines.ingest import ClimateDataIngester

        ingester = ClimateDataIngester()
        df = ingester.fetch_nasa_power(
            lat=11.6,
            lon=76.0,
            start_date="2024-01-01",
            end_date="2024-01-10",
        )
        assert len(df) > 0
        assert len(df.columns) > 0


# -----------------------------------------------------------------------
# Preprocessor
# -----------------------------------------------------------------------


class TestPreprocessor:
    def test_normalize(self):
        from multisow.ml.pipelines.preprocess import StratifiedIntercroppingPreprocessor

        pp = StratifiedIntercroppingPreprocessor()
        df = pd.DataFrame({
            "soil_N": [50, 100, 150, 200],
            "VWC": [0.1, 0.2, 0.3, 0.4],
        })
        result = pp.normalize(df)
        assert result["soil_N"].max() <= 1.0
        assert result["VWC"].min() >= 0.0

    def test_impute(self):
        from multisow.ml.pipelines.preprocess import StratifiedIntercroppingPreprocessor

        pp = StratifiedIntercroppingPreprocessor()
        df = pd.DataFrame({
            "soil_N": [50.0, np.nan, 150.0, np.nan, 250.0],
            "VWC": [0.1, 0.2, np.nan, 0.4, 0.5],
        })
        result = pp.impute(df)
        assert result.isna().sum().sum() == 0


# -----------------------------------------------------------------------
# Feature Store
# -----------------------------------------------------------------------


class TestFeatureStore:
    def test_save_and_load(self):
        from multisow.ml.pipelines.feature_store import FeatureStore

        with tempfile.TemporaryDirectory() as tmpdir:
            store = FeatureStore(storage_dir=tmpdir)
            df = pd.DataFrame({
                "LAI": [3.0, 5.0],
                "soil_N": [100, 150],
                "yield_t_ha": [8.0, 12.0],
            })
            store.save_feature_matrix("farm_test", df, version="v1")
            versions = store.list_versions("farm_test")
            assert "v1" in versions

            loaded = store.load_feature_matrix("farm_test", "v1")
            assert len(loaded) == 2
            assert list(loaded.columns) == list(df.columns)

    def test_global_training_set(self):
        from multisow.ml.pipelines.feature_store import FeatureStore

        with tempfile.TemporaryDirectory() as tmpdir:
            store = FeatureStore(storage_dir=tmpdir)
            for farm_id in ["farm_a", "farm_b", "farm_c"]:
                df = pd.DataFrame({
                    "LAI": np.random.uniform(2, 6, 10),
                    "soil_N": np.random.uniform(50, 200, 10),
                })
                store.save_feature_matrix(farm_id, df, version="v1")

            global_df = store.get_global_training_set(min_farms=2)
            assert global_df is not None
            assert len(global_df) >= 20
