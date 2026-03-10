"""
Inference engine for the Crop Recommender feature.

Exposes three public functions:

  recommend_crop(...)            — GaussianNB prediction + library compatible crops
  recommend_for_layer(...)       — Layer-filtered recommendation
  extend_with_ai(crop_list, ...) — Anthropic API extension with graceful fallback

Model artefacts are loaded lazily and cached; run
``python -m multisow.ml.pipelines.train_crop_recommender`` once to
create them.
"""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path
from typing import Optional

import joblib
import numpy as np

from multisow.ml.data.crop_library import (
    _FEATURE_STDS,
    _compatibility_distance,
    find_compatible_crops,
    get_crop_stats,
    get_crops_by_layer,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Artefact paths
# ---------------------------------------------------------------------------
_REPO_ROOT = Path(__file__).resolve().parents[3]
_SAVE_DIR = _REPO_ROOT / "multisow" / "ml" / "models" / "saved"

MODEL_PATH = _SAVE_DIR / "crop_recommender_model.joblib"
SCALER_PATH = _SAVE_DIR / "crop_recommender_scaler.joblib"
LABELS_PATH = _SAVE_DIR / "crop_labels.joblib"

_FEATURE_COLS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

# Module-level artefact cache
_model = None
_scaler = None


def _load_artefacts() -> tuple:
    """Load (and cache) the model and scaler from disk.

    Raises:
        RuntimeError: If either artefact file is missing.
    """
    global _model, _scaler
    if _model is None or _scaler is None:
        missing = [p for p in (MODEL_PATH, SCALER_PATH) if not p.exists()]
        if missing:
            raise RuntimeError(
                "Crop recommender model artefacts not found: "
                + ", ".join(str(p) for p in missing)
                + ".  Please run "
                "`python -m multisow.ml.pipelines.train_crop_recommender` first."
            )
        _model = joblib.load(MODEL_PATH)
        _scaler = joblib.load(SCALER_PATH)
    return _model, _scaler


# ---------------------------------------------------------------------------
# Public: recommend_crop
# ---------------------------------------------------------------------------

def recommend_crop(
    N: float,
    P: float,
    K: float,
    temperature: float,
    humidity: float,
    ph: float,
    rainfall: float,
) -> dict:
    """Predict the best-fit crop and return compatible library crops.

    Args:
        N: Nitrogen (kg/ha).
        P: Phosphorous (kg/ha).
        K: Potassium (kg/ha).
        temperature: Mean temperature (°C).
        humidity: Relative humidity (%).
        ph: Soil pH.
        rainfall: Annual rainfall (mm).

    Returns:
        Dict with keys:
            ``recommended_crop``, ``confidence``,
            ``compatible_crops_from_library``, ``input_features``.

    Raises:
        RuntimeError: If model artefacts are missing.
    """
    model, scaler = _load_artefacts()

    features = np.array([[N, P, K, temperature, humidity, ph, rainfall]], dtype=float)
    features_scaled = scaler.transform(features)

    prediction: str = model.predict(features_scaled)[0]

    confidence: Optional[float] = None
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(features_scaled)[0]
        confidence = float(np.max(proba))

    try:
        compatible = find_compatible_crops(prediction, top_n=5)
    except Exception:
        compatible = []

    return {
        "recommended_crop": str(prediction),
        "confidence": confidence,
        "compatible_crops_from_library": compatible,
        "input_features": {
            "N": N, "P": P, "K": K,
            "temperature": temperature, "humidity": humidity,
            "ph": ph, "rainfall": rainfall,
        },
    }


# ---------------------------------------------------------------------------
# Public: recommend_for_layer
# ---------------------------------------------------------------------------

def recommend_for_layer(
    layer: str,
    N: float,
    P: float,
    K: float,
    temperature: float,
    humidity: float,
    ph: float,
    rainfall: float,
) -> dict:
    """Return the most compatible crops for a specific intercropping layer.

    Filters the library to crops mapped to *layer*, then ranks them by
    compatibility distance to the supplied soil/climate profile.

    Args:
        layer: One of ``canopy``, ``midstory``, ``understory``, ``groundcover``.

    Returns:
        Dict with keys ``layer``, ``recommended_crops``, ``input_features``.
    """
    layer_crops = get_crops_by_layer(layer)

    input_stats = {
        col: val
        for col, val in zip(_FEATURE_COLS, [N, P, K, temperature, humidity, ph, rainfall])
    }

    scored = []
    for crop in layer_crops:
        crop_stats = get_crop_stats(crop)
        score = _compatibility_distance(input_stats, crop_stats)
        scored.append({"crop": crop, "compatibility_score": score, "stats": crop_stats})

    scored.sort(key=lambda x: x["compatibility_score"])
    top = scored[:5]

    return {
        "layer": layer,
        "recommended_crops": top,
        "input_features": {
            "N": N, "P": P, "K": K,
            "temperature": temperature, "humidity": humidity,
            "ph": ph, "rainfall": rainfall,
        },
    }


# ---------------------------------------------------------------------------
# Public: extend_with_ai
# ---------------------------------------------------------------------------

def extend_with_ai(crop_list: list[str], context: str = "") -> dict:
    """Ask the Anthropic API to suggest compatible crops beyond the dataset.

    Requires the ``ANTHROPIC_API_KEY`` environment variable to be set.
    Gracefully degrades to an empty fallback if the key is absent, the
    API is unreachable, or the response cannot be parsed as JSON.

    Args:
        crop_list: Crops from the ML prediction / library to base suggestions on.
        context: Optional extra context string forwarded to the prompt.

    Returns:
        Dict with keys:
            ``ai_suggested_crops`` (list[dict]),
            ``source`` (``"anthropic"`` or ``"fallback"``),
            ``based_on_crops`` (list[str]).
    """
    _FALLBACK: dict = {
        "ai_suggested_crops": [],
        "source": "fallback",
        "based_on_crops": crop_list,
    }

    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        logger.warning("ANTHROPIC_API_KEY not set — AI extension returning fallback.")
        return _FALLBACK

    try:
        import anthropic  # lazy import — avoids hard dependency at load time
    except ImportError:
        logger.warning("anthropic package not installed — AI extension fallback.")
        return _FALLBACK

    prompt = (
        f"Given these crops that grow well together based on soil and climate data: "
        f"{crop_list}. "
        f"Suggest 5 additional crops not in this list that would be agronomically "
        f"compatible for intercropping with them. "
        f"{'Context: ' + context if context else ''} "
        f"For each suggested crop provide: name, reason for compatibility, "
        f"ideal layer (canopy/midstory/understory/groundcover), and estimated "
        f"N, P, K, temperature, humidity, ph, rainfall values. "
        f"Return as JSON array only, no other text."
    )

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = message.content[0].text.strip()

        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        suggestions = json.loads(raw)
        if not isinstance(suggestions, list):
            suggestions = []

        return {
            "ai_suggested_crops": suggestions,
            "source": "anthropic",
            "based_on_crops": crop_list,
        }

    except Exception as exc:  # noqa: BLE001
        logger.warning("Anthropic AI extension failed (%s) — returning fallback.", exc)
        return _FALLBACK
