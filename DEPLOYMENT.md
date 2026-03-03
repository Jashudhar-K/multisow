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
| web      | 8000 | FastAPI + frontend           |
| influxdb | 8086 | IoT sensor time-series       |
| redis    | 6379 | Task queue broker            |
| mlflow   | 5000 | ML experiment tracking       |

Access:
- App: `http://localhost:3000`
- API docs: `http://localhost:8000/docs`
- MLflow: `http://localhost:5000`

### 2. Local — core only

No optional services (InfluxDB, Redis, MLflow). All ML endpoints degrade gracefully.

```bash
pip install -r requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Local — full ML support

```bash
pip install -r requirements.txt
pip install scikit-fuzzy catboost deap shap lime influxdb-client mlflow alembic celery redis
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
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
curl http://localhost:8000/health
# {"status":"ok","message":"Backend is running","version":"2.0.0"}
```

## Production Build

```bash
docker build -f Dockerfile.ml -t multisow:v2 .
docker run -d -p 8000:8000 \
  --env-file .env \
  multisow:v2
```
