# MultiSow v2 - Multi-Tier Crop Management + FOHEM ML Platform

[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/DB-PostgreSQL%20%2B%20SQLite-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

MultiSow is an AI-enhanced platform for designing and optimizing stratified intercropping systems. It combines a Next.js frontend, a FastAPI backend, and a FOHEM-style ML pipeline for prediction, explainability, training, and data ingestion.

## What is included

- Interactive multi-tier farm design workflows (dashboard, designer, optimizer, presets).
- FastAPI backend APIs for crop planning, presets, compatibility analysis, and health checks.
- FOHEM ML subsystem under `multisow/ml` with graceful fallback when optional dependencies are missing.
- Optional data stack support for InfluxDB, Redis/arq worker, PostgreSQL, and MLflow.

## Architecture overview

- Frontend: Next.js App Router in `app` and reusable UI in `components`.
- Backend: FastAPI service in `backend` with CRUD, AI advisor, crop recommender, and NLP routes.
- ML: FOHEM models, explainability, training, and ingest pipelines in `multisow/ml`.


### 1) Farm design and planning

- Multi-tier stratified design (canopy, middle, understory, belowground): Helps farmers plan vertical space use, improving yield per acre.
- Interactive 3D designer: Makes layout decisions visual and intuitive before planting, reducing costly field trial errors.
- Species library with layer filtering: Speeds up crop selection by showing what belongs in each layer.
- Row and area drawing tools (select, paint, rectangle, rows, erase): Enables fast, precise farm layout editing for real-world plot shapes.
- Undo/redo workflow: Encourages experimentation without losing prior designs.
- Preset farm models (regional templates): Gives farmers a proven baseline they can adapt to local conditions.

### 2) Decision support and optimization

- AI advisor planning (`/api/ai/plan`): Generates recommendations from acreage, soil, budget, and goal.
- AI advisor analysis (`/api/ai/analyze`): Evaluates current crop configuration and points out risks or improvements.
- Crop compatibility checks: Detects harmful combinations early (allelopathy, shade, root conflict), improving survivability.
- Economic metrics (ROI, revenue, input efficiency): Helps choose plans that are not only agronomically sound but financially viable.
- Strata optimization workflow (`/optimize` + ML optimization endpoints): Searches better arrangements for productivity-resource balance.

### 3) ML and explainability

- FOHEM hybrid prediction pipeline: Blends physics-informed and data-driven modeling for robust yield estimates.
- Multi-layer stress scoring (light, water, nutrient, competition): Shows *why* a layer underperforms, not only the output number.
- Yield prediction endpoint (`/ml/predict`): Produces actionable per-layer and system predictions for planning and comparison.
- Explainability endpoints (SHAP/LIME routes): Makes model outputs auditable and understandable to agronomists and operators.
- Training endpoints and training script (`npm run train`): Supports iterative model improvement as farm data grows.
- Graceful ML fallback behavior: Keeps the app operational even when optional ML dependencies are unavailable.

### 4) Data ingestion and monitoring

- Sensor/manual/climate/drone ingestion routes (`/ml/ingest/*`): Supports multiple data sources for better model context.
- Feature store and data health routes (`/ml/data/*`): Improves reproducibility and monitoring of ML inputs.
- Health endpoints (`/health`, frontend `/api/health`): Enables quick uptime checks for local and deployed environments.
- Dashboard metrics and charts: Turns raw model/data output into operational insight for daily decision-making.

### 5) Frontend experience

- Next.js App Router structure: Enables scalable page-level organization and reliable route handling.
- Domain pages (`/dashboard`, `/designer`, `/predict`, `/optimize`, `/crops`, `/calc`, `/strata`): Separates workflow stages so users can move from planning to analysis to execution.
- Loading and skeleton states across key pages: Improves perceived performance and UX clarity while data loads.
- Auth-protected areas (with NextAuth middleware): Protects farm plans, profile data, and operational dashboards.

### 6) Backend and API platform

- FastAPI + SQLAlchemy CRUD layer: Provides typed, maintainable API services for crops, plots, and presets.
- Router-based architecture (NLP, recommender, crop library, ML): Keeps responsibilities modular and easier to evolve.
- CORS and environment-driven config: Simplifies local dev and multi-environment deployment.
- OpenAPI docs (`/docs`): Speeds up integration for frontend developers, testers, and external consumers.

### 7) Infrastructure and operations

- Docker Compose stack (`web`, `frontend`, `postgres`, `influxdb`, `redis`, `mlflow`, `arq_worker`): Provides a reproducible full-stack environment.
- Separate backend/frontend ports (8001/3001): Avoids conflicts and makes service boundaries explicit.
- Background worker (`arq_worker`): Supports async or long-running jobs without blocking API response paths.
- Optional tooling profile (`train` service): Allows one-off model training in controlled containerized runs.

### 8) Developer productivity and quality

- Scripted workflows (`dev`, `backend`, `dev:all`, `test`, `test:e2e`, `type-check`, `lint`): Reduces setup friction and enforces consistency.
- Frontend testing stack (Vitest + Playwright): Covers both component logic and end-to-end behavior.
- Python test suite (`multisow/tests`): Validates FOHEM, pipelines, and ML API integration.
- One-click launch scripts (`run.bat`, `run.sh`): Makes onboarding easier for non-expert contributors.

## Local development

### Prerequisites

- Python 3.10+
- Node.js 20+
- npm
- Optional: Docker + Docker Compose

### 1) Install dependencies

Python:

```bash
pip install -r requirements.txt
```

Node.js:

```bash
npm install
```

### 2) Start frontend + backend

Windows (single-click launcher):

```bat
run.bat
```

macOS/Linux:

```bash
chmod +x run.sh && ./run.sh
```

Or run manually in separate terminals:

```bash
npm run dev
```

```bash
npm run backend
```

### 3) Open the app

- Frontend: `http://localhost:3001`
- Designer: `http://localhost:3001/designer`
- Backend docs: `http://localhost:8001/docs`
- Backend health: `http://localhost:8001/health`
- Frontend health proxy: `http://localhost:3001/api/health`

## Environment

Copy the template and update values for your environment:

```bash
cp .env.example .env
```

Important variables include:

- `BACKEND_URL`
- `NEXT_PUBLIC_API_URL`
- `MULTISOW_DATABASE_URL`
- `MULTISOW_INFLUXDB_URL`
- `MULTISOW_REDIS_URL`
- `MULTISOW_MLFLOW_TRACKING_URI`
- `ANTHROPIC_API_KEY`

## Testing

Frontend unit/integration:

```bash
npm test
```

Frontend coverage:

```bash
npm run test:coverage
```

End-to-end:

```bash
npm run test:e2e
```

Python ML/backend tests:

```bash
pytest multisow/tests -v
```

## Docker

Start core stack:

```bash
docker-compose up -d
```

Default services:

- `web` (FastAPI on `8001`)
- `frontend` (Next.js on `3001`)
- `postgres` (`5432`)
- `influxdb` (`8086`)
- `redis` (`6379`)
- `mlflow` (`5000`)
- `arq_worker` (background jobs)

Run training job profile when needed:

```bash
docker compose --profile tools run --rm train
```

## Useful scripts

- `npm run dev` - Next.js dev server on port 3001
- `npm run backend` - FastAPI via Granian on port 8001
- `npm run dev:all` - run frontend + backend concurrently
- `npm run lint` - lint frontend
- `npm run type-check` - TypeScript checks
- `npm run test:all` - unit + e2e
- `npm run train` - ML training pipeline entrypoint

## High-level project structure

```text
multi_tier_crop_system/
|- app/               # Next.js App Router pages and API routes
|- backend/           # FastAPI app, routers, DB models, advisor logic
|- components/        # Reusable React UI components
|- multisow/          # ML pipelines, models, schemas, tests
|- tests/             # Frontend test suites (unit, integration, e2e)
|- docker-compose.yml
|- Dockerfile
|- Dockerfile.ml
|- package.json
|- requirements.txt
```

## License

MIT
