"""
Unified Crop Library — multisow/ml/data/crop_library.py

Loads both crop CSVs at import time, deduplicates them, and exposes
pure-Python helper functions used by the inference engine, the preset
generator, and the FastAPI router.

No joblib / trained model is required; this module works from the raw
CSV data alone.
"""

from __future__ import annotations

import math
from functools import lru_cache
from pathlib import Path
from typing import Optional

import pandas as pd

# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------
_DATA_DIR = Path(__file__).resolve().parent / "crop_recommendation"
_FEATURE_COLS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
_TARGET_COL = "label"


def _load_df() -> pd.DataFrame:
    """Read, concatenate, and deduplicate the two source CSVs.

    Returns:
        A de-duplicated DataFrame with columns N, P, K, temperature,
        humidity, ph, rainfall, label.
    """
    dfs = []
    for fname in ("crop_data1.csv", "crop_data2.csv"):
        path = _DATA_DIR / fname
        if not path.exists():
            raise FileNotFoundError(
                f"Crop dataset file not found: {path}. "
                "Ensure crop_data1.csv and crop_data2.csv are in "
                "multisow/ml/data/crop_recommendation/"
            )
        dfs.append(pd.read_csv(path))

    combined = pd.concat(dfs, ignore_index=True)
    combined = combined.drop_duplicates(subset=_FEATURE_COLS)
    return combined


# Load once at module import; cache for the lifetime of the process.
_DF: pd.DataFrame = _load_df()

# Per-feature standard deviations across all rows (used for normalisation).
_FEATURE_STDS: dict[str, float] = {
    col: float(_DF[col].std()) or 1.0 for col in _FEATURE_COLS
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def get_all_crops() -> list[str]:
    """Return a sorted list of unique crop label strings in the library."""
    return sorted(_DF[_TARGET_COL].unique().tolist())


@lru_cache(maxsize=None)
def get_crop_stats(crop_name: str) -> dict:
    """Return mean feature values for *crop_name*.

    Args:
        crop_name: Exact crop label string (case-sensitive).

    Returns:
        Dict with keys N, P, K, temperature, humidity, ph, rainfall.

    Raises:
        ValueError: If the crop is not present in the library.
    """
    subset = _DF[_DF[_TARGET_COL] == crop_name]
    if subset.empty:
        raise ValueError(f"Crop '{crop_name}' not found in the crop library.")
    return {col: round(float(subset[col].mean()), 4) for col in _FEATURE_COLS}


def get_all_crop_stats() -> dict[str, dict]:
    """Return ``get_crop_stats()`` results for every crop in the library."""
    return {crop: get_crop_stats(crop) for crop in get_all_crops()}


def _compatibility_distance(stats_a: dict, stats_b: dict) -> float:
    """Compute the normalised feature distance between two crop stat dicts.

    Lower value → more similar soil/climate requirements → more compatible.
    """
    total = 0.0
    for col in _FEATURE_COLS:
        diff = abs(stats_a[col] - stats_b[col])
        total += diff / _FEATURE_STDS[col]
    return round(total, 4)


def find_compatible_crops(crop_name: str, top_n: int = 5) -> list[dict]:
    """Return the *top_n* most compatible crops for intercropping with *crop_name*.

    Compatibility is measured by the sum of normalised absolute differences
    of mean feature values.  A lower score means more similar requirements
    and therefore higher intercropping compatibility.

    Args:
        crop_name: Exact crop label string.
        top_n: Number of results to return (default 5).

    Returns:
        List of dicts, each with keys:
            - ``crop`` (str)
            - ``compatibility_score`` (float)
            - ``stats`` (dict)
        Sorted by ascending compatibility_score.
    """
    target_stats = get_crop_stats(crop_name)
    results = []
    for other in get_all_crops():
        if other == crop_name:
            continue
        other_stats = get_crop_stats(other)
        score = _compatibility_distance(target_stats, other_stats)
        results.append({"crop": other, "compatibility_score": score, "stats": other_stats})

    results.sort(key=lambda x: x["compatibility_score"])
    return results[:top_n]


# ---------------------------------------------------------------------------
# Explicit layer assignments
# ---------------------------------------------------------------------------
# These take priority over the heuristic rules in get_crops_by_layer().
# Crops listed here are always returned for their designated layer(s),
# regardless of whether they satisfy the numeric thresholds.  Crops NOT
# listed here fall through to the heuristic rules as before.
_EXPLICIT_LAYERS: dict[str, set[str]] = {
    # Large trees / palms that form the top canopy
    "canopy": {"coconut", "arecanut", "teak", "mahogany", "silveroak"},
    # Fruit trees and medium-height plants used as the middle tier
    # (jackfruit is a large tree but acts as midstory in preset combos)
    "midstory": {"banana", "papaya", "guava", "cocoa", "jackfruit", "mango"},
    # Short-statured crops grown beneath the midstory
    "understory": {"turmeric", "ginger", "cardamom", "pineapple", "galangal", "coffee"},
    # Climbers / creepers used as vertical groundcover
    "groundcover": {"blackpepper", "vanilla", "betelleaf", "passionfruit"},
}

# Reverse lookup: crop → set of layers it is explicitly assigned to.
_CROP_EXPLICIT_LAYER: dict[str, set[str]] = {}
for _lyr, _crops in _EXPLICIT_LAYERS.items():
    for _c in _crops:
        _CROP_EXPLICIT_LAYER.setdefault(_c, set()).add(_lyr)


def get_crops_by_layer(layer: str) -> list[str]:
    """Map dataset crops to intercropping layers based on feature profiles.

    Resolution order:
      1. If a crop appears in ``_EXPLICIT_LAYERS[layer]`` it is always
         included, regardless of numeric thresholds.
      2. For crops not listed in *any* explicit layer the original
         heuristic rules apply:
         ``canopy``      — temp mean > 27 AND N mean > 60
         ``midstory``    — temp mean 20–27 AND N mean 30–60
         ``understory``  — temp mean < 20 OR N mean < 30
         ``groundcover`` — N mean < 20 AND humidity mean > 70

    Args:
        layer: One of ``"canopy"``, ``"midstory"``, ``"understory"``,
               ``"groundcover"``.

    Returns:
        Sorted list of crop names for that layer.

    Raises:
        ValueError: If *layer* is not a recognised value.
    """
    valid = {"canopy", "midstory", "understory", "groundcover"}
    if layer not in valid:
        raise ValueError(f"Unknown layer '{layer}'. Must be one of {sorted(valid)}.")

    # All crops present in the loaded dataset
    all_crops = get_all_crops()

    matches: set[str] = set()

    # 1. Explicit overrides
    for crop in all_crops:
        if crop in _EXPLICIT_LAYERS.get(layer, set()):
            matches.add(crop)

    # 2. Heuristic fallback for crops without any explicit assignment
    for crop in all_crops:
        if crop in _CROP_EXPLICIT_LAYER:
            continue  # already handled by explicit rules
        stats = get_crop_stats(crop)
        temp = stats["temperature"]
        N = stats["N"]
        humidity = stats["humidity"]

        if layer == "canopy" and temp > 27 and N > 60:
            matches.add(crop)
        elif layer == "midstory" and 20 <= temp <= 27 and 30 <= N <= 60:
            matches.add(crop)
        elif layer == "understory" and (temp < 20 or N < 30):
            matches.add(crop)
        elif layer == "groundcover" and N < 20 and humidity > 70:
            matches.add(crop)

    return sorted(matches)
