"""
Integration tests for ML API endpoints.

Uses FastAPI TestClient to verify all ML router endpoints return
correct HTTP status codes and response shapes.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

FIXTURES_DIR = Path(__file__).parent / "fixtures"


@pytest.fixture
def client():
    """Create a FastAPI TestClient with ML routers mounted."""
    from fastapi.testclient import TestClient

    # Import the real app and mount ML routers if not already done
    from backend.main import app
    from multisow.ml.routers import predict, explain, train, data

    # Ensure routers are included (idempotent)
    _included = getattr(app, "_ml_routers_included", False)
    if not _included:
        app.include_router(predict.router)
        app.include_router(explain.router)
        app.include_router(train.router)
        app.include_router(data.router)
        app._ml_routers_included = True  # type: ignore[attr-defined]

    return TestClient(app)


@pytest.fixture
def sample_predict_body() -> dict:
    """Valid prediction request body."""
    return {
        "farm_id": "FARM_TEST_001",
        "layers": [
            {
                "layer": "canopy",
                "LAI": 5.0,
                "k_coeff": 0.5,
                "row_spacing_m": 8.0,
                "soil_N": 120,
                "soil_P": 20,
                "soil_K": 2.5,
                "soil_pH": 5.8,
                "VWC": 0.30,
                "GDD": 2500,
                "rainfall_7d": 80,
                "solar_elevation_deg": 55,
                "crop_species": "Coconut",
                "root_depth_cm": 180,
                "root_radius_cm": 150,
            },
            {
                "layer": "middle",
                "LAI": 3.5,
                "k_coeff": 0.45,
                "row_spacing_m": 3.0,
                "soil_N": 100,
                "soil_P": 18,
                "soil_K": 2.0,
                "soil_pH": 5.6,
                "VWC": 0.35,
                "GDD": 2000,
                "rainfall_7d": 80,
                "solar_elevation_deg": 50,
                "crop_species": "Banana",
                "root_depth_cm": 80,
                "root_radius_cm": 60,
            },
        ],
        "use_sensor_data": False,
    }


# -----------------------------------------------------------------------
# Health / existing endpoints
# -----------------------------------------------------------------------


class TestExistingEndpoints:
    def test_health(self, client):
        resp = client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"

    def test_presets(self, client):
        resp = client.get("/presets")
        assert resp.status_code == 200
        presets = resp.json()
        assert len(presets) >= 3


# -----------------------------------------------------------------------
# POST /ml/predict
# -----------------------------------------------------------------------


class TestPredictEndpoint:
    def test_predict_returns_200(self, client, sample_predict_body):
        resp = client.post("/ml/predict", json=sample_predict_body)
        assert resp.status_code == 200
        data = resp.json()
        assert "prediction_id" in data
        assert "layers" in data
        assert "system_LER" in data

    def test_predict_layers_present(self, client, sample_predict_body):
        resp = client.post("/ml/predict", json=sample_predict_body)
        data = resp.json()
        layers = data["layers"]
        assert "canopy" in layers
        assert "middle" in layers

    def test_predict_validation_error(self, client):
        resp = client.post("/ml/predict", json={"farm_id": "x"})
        assert resp.status_code == 422  # Validation error


# -----------------------------------------------------------------------
# GET /ml/explain
# -----------------------------------------------------------------------


class TestExplainEndpoint:
    def test_explain_no_cache(self, client):
        resp = client.get("/ml/explain/nonexistent-id?layer=canopy")
        assert resp.status_code == 200
        data = resp.json()
        assert data["prediction_id"] == "nonexistent-id"
        # Should still return a valid response with a message
        assert "natural_language_summary" in data

    def test_beeswarm_no_cache(self, client):
        resp = client.get("/ml/explain/nonexistent-id/shap_beeswarm")
        assert resp.status_code == 200
        data = resp.json()
        assert "feature_importances" in data


# -----------------------------------------------------------------------
# POST /ml/train
# -----------------------------------------------------------------------


class TestTrainEndpoint:
    def test_train_returns_job(self, client):
        body = {
            "farm_ids": ["FARM_001"],
            "layers": ["canopy"],
            "train_split": 0.7,
            "val_split": 0.15,
        }
        resp = client.post("/ml/train", json=body)
        assert resp.status_code == 200
        data = resp.json()
        assert "job_id" in data
        assert data["status"] in ("queued", "running", "completed")

    def test_train_status_404(self, client):
        resp = client.get("/ml/train/nonexistent-job/status")
        assert resp.status_code == 404


# -----------------------------------------------------------------------
# Data ingestion endpoints
# -----------------------------------------------------------------------


class TestDataEndpoints:
    def test_ingest_sensor(self, client):
        body = {
            "farm_id": "FARM_TEST",
            "readings": [
                {"sensor_type": "temperature", "value": 28.5},
                {"sensor_type": "humidity", "value": 75.0},
            ],
        }
        resp = client.post("/ml/ingest/sensor", json=body)
        assert resp.status_code == 200

    def test_feature_list(self, client):
        resp = client.get("/ml/data/features")
        assert resp.status_code == 200
        data = resp.json()
        assert "versions" in data

    def test_data_health(self, client):
        resp = client.get("/ml/data/health?farm_id=test_farm")
        assert resp.status_code == 200
        data = resp.json()
        assert "farm_id" in data
        assert "quality_score" in data
