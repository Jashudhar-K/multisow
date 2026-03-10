"""
Training pipeline for the Crop Recommender model.

Reads crop_data1.csv and crop_data2.csv, trains a GaussianNB (primary) and
SVC (secondary) classifier, evaluates both on an 80/20 split, then saves
the best model (GaussianNB), the fitted StandardScaler, and the sorted list
of unique crop labels using joblib.

Saved artefacts
---------------
  multisow/ml/models/saved/crop_recommender_model.joblib
  multisow/ml/models/saved/crop_recommender_scaler.joblib
  multisow/ml/models/saved/crop_labels.joblib

Usage:
    python -m multisow.ml.pipelines.train_crop_recommender
"""

from __future__ import annotations

import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

# ---------------------------------------------------------------------------
# Paths (relative to repo root)
# ---------------------------------------------------------------------------
_REPO_ROOT = Path(__file__).resolve().parents[3]
_DATA_DIR = _REPO_ROOT / "multisow" / "ml" / "data" / "crop_recommendation"
_SAVE_DIR = _REPO_ROOT / "multisow" / "ml" / "models" / "saved"

MODEL_PATH = _SAVE_DIR / "crop_recommender_model.joblib"
SCALER_PATH = _SAVE_DIR / "crop_recommender_scaler.joblib"
LABELS_PATH = _SAVE_DIR / "crop_labels.joblib"

FEATURE_COLS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
TARGET_COL = "label"


def load_data() -> pd.DataFrame:
    """Load and concatenate the two source CSVs, then de-duplicate."""
    dfs = []
    for fname in ("crop_data1.csv", "crop_data2.csv"):
        path = _DATA_DIR / fname
        if not path.exists():
            raise FileNotFoundError(f"Dataset file not found: {path}")
        dfs.append(pd.read_csv(path))

    combined = pd.concat(dfs, ignore_index=True)
    before = len(combined)
    combined = combined.drop_duplicates(subset=FEATURE_COLS)
    after = len(combined)
    print(f"[data] Loaded {before} rows; {before - after} duplicates removed → {after} rows retained.")
    return combined


def train() -> None:
    """Full training + evaluation + artefact-save pipeline."""
    # -----------------------------------------------------------------------
    # 1. Load data
    # -----------------------------------------------------------------------
    df = load_data()

    X = df[FEATURE_COLS].values
    y = df[TARGET_COL].values

    unique_labels = sorted(df[TARGET_COL].unique().tolist())
    print(f"[data] Unique crop labels ({len(unique_labels)}): {unique_labels}")

    # -----------------------------------------------------------------------
    # 2. Train / test split
    # -----------------------------------------------------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # -----------------------------------------------------------------------
    # 3. Scale features
    # -----------------------------------------------------------------------
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # -----------------------------------------------------------------------
    # 4. Train GaussianNB (primary)
    # -----------------------------------------------------------------------
    gnb = GaussianNB()
    gnb.fit(X_train_scaled, y_train)

    gnb_train_acc = accuracy_score(y_train, gnb.predict(X_train_scaled))
    gnb_test_acc = accuracy_score(y_test, gnb.predict(X_test_scaled))
    print(f"[GaussianNB]  train accuracy: {gnb_train_acc:.4f}  |  test accuracy: {gnb_test_acc:.4f}")

    # -----------------------------------------------------------------------
    # 5. Train SVC (secondary, for comparison)
    # -----------------------------------------------------------------------
    svc = SVC(kernel="linear", random_state=42, probability=True)
    svc.fit(X_train_scaled, y_train)

    svc_train_acc = accuracy_score(y_train, svc.predict(X_train_scaled))
    svc_test_acc = accuracy_score(y_test, svc.predict(X_test_scaled))
    print(f"[SVC linear]  train accuracy: {svc_train_acc:.4f}  |  test accuracy: {svc_test_acc:.4f}")

    # -----------------------------------------------------------------------
    # 6. Save best model (GaussianNB) + scaler + labels
    # -----------------------------------------------------------------------
    _SAVE_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(gnb, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(unique_labels, LABELS_PATH)
    print(f"[save] Model  → {MODEL_PATH}")
    print(f"[save] Scaler → {SCALER_PATH}")
    print(f"[save] Labels → {LABELS_PATH}")
    print("[done] Training complete.")


if __name__ == "__main__":
    train()
    sys.exit(0)
