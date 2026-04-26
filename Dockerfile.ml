# MultiSow ML Service
FROM python:3.12-slim

LABEL maintainer="multisow-team" \
      description="FOHEM ML microservice for stratified intercropping"

WORKDIR /app

# System deps for scipy, scikit-learn, potential C extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ libffi-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies (all core deps are in requirements.txt)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir \
        "scikit-fuzzy>=0.4.2" \
        "catboost>=1.2.3" \
        "deap>=1.4.1" \
        "shap>=0.44.0" \
        "lime>=0.2.0.1" \
        "influxdb-client>=1.40.0" \
        "mlflow>=2.11.0" \
        "alembic>=1.13.0" \
        "redis>=5.0.3"

# Copy application code
COPY backend/ /app/backend/
COPY multisow/ /app/multisow/
COPY main.py /app/main.py

# Create directories for data persistence
RUN mkdir -p /app/data/feature_store /app/data/models /app/data/mlflow

# Environment defaults
ENV MULTISOW_ENVIRONMENT=production \
    MULTISOW_DATABASE_URL=postgresql+asyncpg://multisow:multisow-pass@postgres:5432/multisow_db \
    MULTISOW_ML_MODEL_PATH=/app/data/models \
    MULTISOW_FEATURE_STORE_PATH=/app/data/feature_store \
    MULTISOW_FOHEM_BOOTSTRAP_ON_STARTUP=true

EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health')" || exit 1

CMD ["granian", "--interface", "asgi", "backend.main:app", "--host", "0.0.0.0", "--port", "8001"]
