# Deployment Guide — MultiSow v2

## Options

### 1. Docker (recommended for full stack)

Requires Docker and Docker Compose.

```bash
cp .env.example .env        # configure tokens/secrets
docker-compose up -d
```

Services started:

| Service  | Port | Purpose                     |
|----------|------|-----------------------------|
| web      | 8001 | FastAPI backend              |
| frontend | 3001 | Next.js frontend             |
| postgres | 5432 | Primary relational database  |
| influxdb | 8086 | IoT sensor time-series       |
| redis    | 6379 | Task queue broker            |
| mlflow   | 5000 | ML experiment tracking       |

Access:
- App: `http://localhost:3001`
- API docs: `http://localhost:8001/docs`
- MLflow: `http://localhost:5000`

### 2. Local — core only

No optional services (InfluxDB, Redis, MLflow). All ML endpoints degrade gracefully.

```bash
pip install -r requirements.txt
npm install
npm run dev
npm run backend
```

Open:
- Frontend: `http://localhost:3001`
- Backend docs: `http://localhost:8001/docs`

### 3. Local — full ML support

```bash
pip install -r requirements.txt
pip install scikit-fuzzy catboost deap shap lime influxdb-client mlflow alembic celery redis
npm install
npm run dev
npm run backend
```

### 4. Windows one-click

```bat
run.bat
```

### 5. macOS / Linux one-click

```bash
chmod +x run.sh && ./run.sh
```

---

## Environment Variables

Copy `.env.example` to `.env` and edit as needed. Key variables:

| Variable                          | Default                       | Description                        |
|-----------------------------------|-------------------------------|------------------------------------|
| `MULTISOW_DATABASE_URL`           | `sqlite:///./sql_app.db`      | SQLAlchemy DB URL                  |
| `MULTISOW_INFLUXDB_URL`           | `http://localhost:8086`       | InfluxDB endpoint                  |
| `MULTISOW_INFLUXDB_TOKEN`         | `multisow-dev-token`          | InfluxDB auth token                |
| `MULTISOW_REDIS_URL`              | `redis://localhost:6379/0`    | Redis connection                   |
| `MULTISOW_MLFLOW_TRACKING_URI`    | `http://localhost:5000`       | MLflow tracking server             |
| `MULTISOW_FOHEM_BOOTSTRAP_ON_STARTUP` | `false`                | Auto-train FOHEM on startup        |

---

## Health Check

```bash
curl http://localhost:8001/health
# {"status":"ok","message":"Backend is running","version":"2.0.0"}
```

## Production Build

```bash
docker build -f Dockerfile.ml -t multisow:v2 .
docker run -d -p 8001:8001 \
  --env-file .env \
  multisow:v2
```

For full production stack (frontend + backend + data services), use:

```bash
docker compose up -d
```
