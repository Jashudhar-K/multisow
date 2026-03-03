# 🌿 MultiSow v2 — Multi-Tier Crop Management + FOHEM ML Platform

[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Database](https://img.shields.io/badge/DB-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

MultiSow is an AI-enhanced platform for designing and optimizing stratified intercropping systems. Version 2 adds a full FOHEM-based ML stack (prediction, explainability, training, and data ingestion) while keeping the original planner and CRUD workflows intact.

---

## ✨ What’s in v2

- **FOHEM ML pipeline**: FIS + ensemble models + genetic optimization.
- **Explainability**: SHAP and LIME routers with graceful fallback behavior.
- **ML APIs**: `/ml/predict`, `/ml/explain/*`, `/ml/train/*`, `/ml/ingest/*`, `/ml/data/*`.
- **Data pipelines**: Sensor/manual/climate/drone ingestion and feature store versioning.
- **Frontend integration**: ML prediction panel on dashboard + FOHEM optimizer panel in strata designer.
- **Graceful degradation**: If optional dependencies (InfluxDB, DEAP, skfuzzy, etc.) are unavailable, service continues with fallback logic.

---

## 🧱 Core Modules

- **Legacy advisor layer** (`backend/ai_advisor.py`)
  - Rule-based planning and compatibility logic.
   	- Exposed via `/ai/plan` and `/ai/analyze`.

- **FOHEM ML layer** (`multisow/ml/`)
	- Schemas: strata and prediction payloads.
	- Physics utils: Beer-Lambert, root architecture, climate feature engineering.
	- Models: fuzzy inference, ensemble learners, GA optimizers, FOHEM system coordinator.
	- Routers: prediction, explainability, training, and data ingestion.

- **App wiring** (`backend/main.py`)
	- FastAPI lifespan startup initializes FOHEM system + feature store.
	- ML routers mount conditionally when ML modules are available.

---

## 🚀 Quick Start

### Prerequisites

- Python **3.10+**
- pip
- (Optional) Docker + Docker Compose

### 1) Install dependencies

```bash
pip install -r requirements.txt
```

For local ML development and tests, install extras:

```bash
pip install numpy pandas scikit-learn scipy pytest "httpx<0.28"
```

### 2) Run the app

Windows:

```bash
run.bat
```

Mac/Linux:

```bash
chmod +x run.sh && ./run.sh
```

Or directly:

```bash
uvicorn backend.main:app --reload
```

App URLs:

- Frontend: `http://localhost:3000`
- Designer: `http://localhost:3000/designer`
- API docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`

---

## 🧪 Testing

Run all tests:

```bash
pytest multisow/tests/ -v
```

Current suite includes:

- `test_fohem.py` (physics, FIS, ensemble, GA, FOHEM system)
- `test_pipelines.py` (ingestion, preprocessing, feature store)
- `test_api_ml.py` (ML + legacy endpoint integration)

---

## 🐳 Docker Stack

```bash
docker-compose up -d
```

The compose stack includes:

- `web` (FastAPI backend + Next.js frontend)
- `influxdb` (time-series ingestion)
- `redis` (queue/broker support)
- `mlflow` (experiment tracking)

Environment template: `.env.example`

---

## 🧾 Preset Models

The current API preset catalog (`GET /presets`) provides 3 ready-to-use models:

1. **Wayanad Classic**
2. **Karnataka Spice Garden**
3. **Maharashtra Coconut-Mango**

---

## 📁 High-Level Structure

```text
multi_tier_crop_system/
├── backend/
├── app/
├── components/
├── multisow/
│   ├── db/
│   ├── ml/
│   │   ├── explainability/
│   │   ├── models/
│   │   ├── pipelines/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── utils/
│   └── tests/
├── docker-compose.yml
├── Dockerfile.ml
└── requirements.txt
```

---

## 📄 License

This project is licensed under MIT.
