"""
backend/data/preset_generator.py

Programmatically generates intercropping preset models from the crop
dataset (multisow/ml/data/crop_library.py).

Presets are built by:
  1. Selecting representative crops from each intercropping layer
     (canopy / midstory / understory / groundcover).
  2. Ranking combinations by total pairwise compatibility distance
     (lower is better) and picking the 6 most harmonious combos.
  3. Materialising each combo into the standard preset schema used by
     backend/ai_advisor.py and the frontend.

Public API
----------
  generate_presets() -> list[dict]
  get_preset_by_id(preset_id: str) -> dict | None
"""

from __future__ import annotations

import itertools
from functools import lru_cache
from typing import Optional


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _pairwise_score(crops: list[str]) -> float:
    """Sum of all pairwise compatibility distances for a crop combination."""
    from multisow.ml.data.crop_library import _compatibility_distance, get_crop_stats

    total = 0.0
    for a, b in itertools.combinations(crops, 2):
        total += _compatibility_distance(get_crop_stats(a), get_crop_stats(b))
    return round(total, 4)


def _soil_hint(stats: dict) -> list[str]:
    """Infer likely soil types from mean feature values."""
    soils = []
    ph = stats.get("ph", 7.0)
    humidity = stats.get("humidity", 70.0)
    rainfall = stats.get("rainfall", 150.0)

    if ph < 6.0:
        soils.append("laterite")
    if ph >= 6.5:
        soils.append("alluvial")
    if humidity > 80 and rainfall > 200:
        soils.append("loamy")
    if not soils:
        soils.append("red loam")
    return soils


def _region_hint(temp: float, rainfall: float) -> list[str]:
    """Infer suitable Indian regions from temperature and rainfall."""
    if temp > 28 and rainfall > 200:
        return ["Kerala", "Tamil Nadu", "Karnataka Coast"]
    if temp > 26 and rainfall > 150:
        return ["Andhra Pradesh", "Telangana", "Maharashtra"]
    if temp > 24:
        return ["Maharashtra", "Gujarat", "Madhya Pradesh"]
    return ["Punjab", "Haryana", "Uttar Pradesh"]


_LAYER_TIER_NAMES = {
    "canopy": "Overstory",
    "midstory": "Midstory",
    "understory": "Understory",
    "groundcover": "Groundcover",
}

_LAYER_SPACING = {
    "canopy": (8.0, 50),
    "midstory": (3.0, 900),
    "understory": (1.0, 3000),
    "groundcover": (0.5, 8000),
}

# ---------------------------------------------------------------------------
# Named preset overrides
# ---------------------------------------------------------------------------
# Each entry fully specifies which crop occupies each layer.  These presets
# are built first in generate_presets() and take priority over the
# distance-scoring algorithm.  IDs match those used by ai_advisor.py and
# data/planting-guides.ts so that guide look-ups always succeed.
_PRESET_OVERRIDES: list[dict] = [
    {
        "id": "wayanad-classic",
        "name": "Wayanad Classic",
        "canopy": "coconut",
        "midstory": "banana",
        "understory": "turmeric",
        "groundcover": "blackpepper",
        "description": (
            "Traditional Kerala homestead system. Coconut palms provide the "
            "upper canopy, banana fills the middle tier, turmeric thrives in "
            "dappled shade, and black pepper climbs the coconut trunks."
        ),
        "soil_types": ["laterite", "red loam"],
        "regions": ["Kerala", "Karnataka Coast"],
        "difficulty": "Beginner",
        "ler": 1.65,
        "revenue": 800_000,
    },
    {
        "id": "karnataka-spice",
        "name": "Karnataka Spice Garden",
        "canopy": "silveroak",
        "midstory": "papaya",
        "understory": "cardamom",
        "groundcover": "vanilla",
        "description": (
            "High-value spice combination from the Karnataka Western Ghats. "
            "Silver oak provides shade for cardamom and vanilla, with papaya "
            "filling the mid-tier for quick early revenue."
        ),
        "soil_types": ["laterite", "loamy"],
        "regions": ["Karnataka", "Kerala"],
        "difficulty": "Advanced",
        "ler": 1.80,
        "revenue": 1_200_000,
    },
    {
        "id": "tamil-nadu-tropical",
        "name": "Tamil Nadu Tropical Mix",
        "canopy": "mango",
        "midstory": "guava",
        "understory": "ginger",
        "groundcover": "betelleaf",
        "description": (
            "Tropical fruit and spice system suited to Tamil Nadu's warm climate. "
            "Mango canopy shelters guava and ginger, while betel leaf provides "
            "a high-value groundcover crop."
        ),
        "soil_types": ["alluvial", "red loam"],
        "regions": ["Tamil Nadu", "Andhra Pradesh"],
        "difficulty": "Intermediate",
        "ler": 1.55,
        "revenue": 1_000_000,
    },
    {
        "id": "andhra-commercial",
        "name": "Andhra Commercial System",
        "canopy": "arecanut",
        "midstory": "jackfruit",
        "understory": "pineapple",
        "groundcover": "passionfruit",
        "description": (
            "Commercial intercropping system from Andhra Pradesh. Arecanut "
            "forms a tall canopy, jackfruit provides a productive midstory, "
            "while pineapple and passion fruit occupy lower tiers."
        ),
        "soil_types": ["laterite", "alluvial"],
        "regions": ["Andhra Pradesh", "Telangana"],
        "difficulty": "Intermediate",
        "ler": 1.70,
        "revenue": 1_400_000,
    },
    {
        "id": "maharashtra-balanced",
        "name": "Maharashtra Balanced System",
        "canopy": "coconut",
        "midstory": "mango",
        "understory": "turmeric",
        "groundcover": "blackpepper",
        "description": (
            "Balanced four-tier system suitable for Maharashtra's Konkan coast. "
            "Coconut and mango anchor the upper tiers while turmeric and "
            "black pepper maximize use of the lower canopy space."
        ),
        "soil_types": ["laterite", "alluvial"],
        "regions": ["Maharashtra", "Goa"],
        "difficulty": "Intermediate",
        "ler": 1.60,
        "revenue": 1_100_000,
    },
    {
        "id": "coconut-cocoa-premium",
        "name": "Coconut–Cocoa Premium",
        "canopy": "coconut",
        "midstory": "cocoa",
        "understory": "cardamom",
        "groundcover": "blackpepper",
        "description": (
            "Premium export-oriented system combining coconut and cocoa — a "
            "proven combination in Kerala and Karnataka. Cardamom and black "
            "pepper add high-value understory and vertical components."
        ),
        "soil_types": ["laterite", "loamy"],
        "regions": ["Kerala", "Karnataka"],
        "difficulty": "Advanced",
        "ler": 1.85,
        "revenue": 1_600_000,
    },
]


# ---------------------------------------------------------------------------
# Core generator
# ---------------------------------------------------------------------------

@lru_cache(maxsize=1)
def generate_presets() -> list[dict]:
    """Build and return intercropping presets.

    Presets defined in ``_PRESET_OVERRIDES`` are materialised first using
    live crop stats from the CSV library, guaranteeing that the six named
    presets (wayanad-classic, karnataka-spice, etc.) are always present and
    correctly described.  Any remaining slots (up to 6 total) are filled by
    the distance-scoring algorithm selecting the best combos from the full
    expanded crop library.

    Returns:
        List of preset dicts matching the schema used by
        ``AIStratificationAdvisor._preset_candidates()``.
    """
    from multisow.ml.data.crop_library import (
        get_crop_stats,
        get_crops_by_layer,
    )

    presets: list[dict] = []

    # ------------------------------------------------------------------
    # 1. Named preset overrides
    # ------------------------------------------------------------------
    for override in _PRESET_OVERRIDES:
        oid = override["id"]
        can, mid, und, gnd = (
            override["canopy"],
            override["midstory"],
            override["understory"],
            override["groundcover"],
        )
        layers = ["canopy", "midstory", "understory", "groundcover"]
        quartet = (can, mid, und, gnd)

        all_stats = [get_crop_stats(c) for c in quartet]
        avg_stats = {
            feat: round(sum(s[feat] for s in all_stats) / len(all_stats), 2)
            for feat in ("N", "P", "K", "temperature", "humidity", "ph", "rainfall")
        }

        soil_types = override.get("soil_types") or _soil_hint(avg_stats)
        regions = override.get("regions") or _region_hint(
            avg_stats["temperature"], avg_stats["rainfall"]
        )
        score = _pairwise_score(list(quartet))

        tiers = []
        for crop, lyr in zip(quartet, layers):
            spacing, count = _LAYER_SPACING[lyr]
            tiers.append({
                "tier": _LAYER_TIER_NAMES[lyr],
                "crop": crop,
                "spacing": spacing,
                "spacing_unit": "m",
                "count_per_acre": count,
            })

        ler = override.get("ler", round(1.3 + max(0.0, (3.0 - score) * 0.05), 2))
        revenue = override.get("revenue", 800_000)

        presets.append({
            "id": oid,
            "name": override["name"],
            "description": override["description"],
            "tiers": tiers,
            "suitable_soil_types": soil_types,
            "suitable_regions": regions,
            "expected_LER": ler,
            "base_revenue_per_acre_inr": revenue,
            # Legacy keys for ai_advisor.py scoring:
            "soilType": soil_types[0],
            "difficulty": override.get("difficulty", "Intermediate"),
            "acres": 2,
            "estimatedYield": "300 Quintals",
            "estimatedRevenue": f"₹{revenue // 100_000:.1f}L/year",
            "cropSchedule": {
                "overstory":  {"crop": can, "spacing": _LAYER_SPACING["canopy"][0],      "plants": _LAYER_SPACING["canopy"][1]},
                "middle":     {"crop": mid, "spacing": _LAYER_SPACING["midstory"][0],    "plants": _LAYER_SPACING["midstory"][1]},
                "understory": {"crop": und, "spacing": _LAYER_SPACING["understory"][0],  "plants": _LAYER_SPACING["understory"][1]},
                "vertical":   {"crop": gnd, "spacing": _LAYER_SPACING["groundcover"][0], "plants": _LAYER_SPACING["groundcover"][1]},
            },
        })

    # ------------------------------------------------------------------
    # 2. Auto-generated fill-up (distance scoring)
    # ------------------------------------------------------------------
    # Build from the expanded crop library, skipping crop combos already
    # covered by the named overrides above.
    already_used: set[frozenset] = {
        frozenset({p["cropSchedule"]["overstory"]["crop"],
                   p["cropSchedule"]["middle"]["crop"],
                   p["cropSchedule"]["understory"]["crop"],
                   p["cropSchedule"]["vertical"]["crop"]})
        for p in presets
    }

    from multisow.ml.data.crop_library import get_all_crops
    all_crops = get_all_crops()
    all_layers = ["canopy", "midstory", "understory", "groundcover"]
    layer_crops: dict[str, list[str]] = {}
    for lyr in all_layers:
        crops = get_crops_by_layer(lyr)
        layer_crops[lyr] = crops[:5] if crops else all_crops[:3]

    combos: list[tuple[float, tuple]] = []
    for can in layer_crops["canopy"]:
        for mid in layer_crops["midstory"]:
            for und in layer_crops["understory"]:
                for gnd in layer_crops["groundcover"]:
                    quartet = (can, mid, und, gnd)
                    if len(set(quartet)) < 4:
                        continue
                    if frozenset(quartet) in already_used:
                        continue
                    combos.append((_pairwise_score(list(quartet)), quartet))

    combos.sort(key=lambda x: x[0])
    remaining_slots = max(0, 6 - len(presets))

    for idx, (score, (can, mid, und, gnd)) in enumerate(
        combos[:remaining_slots], start=len(presets) + 1
    ):
        all_stats = [get_crop_stats(c) for c in (can, mid, und, gnd)]
        avg_stats = {
            feat: round(sum(s[feat] for s in all_stats) / len(all_stats), 2)
            for feat in ("N", "P", "K", "temperature", "humidity", "ph", "rainfall")
        }
        soil_types = _soil_hint(avg_stats)
        regions = _region_hint(avg_stats["temperature"], avg_stats["rainfall"])
        name = f"{can.title()}–{mid.title()} Intercrop #{idx}"
        description = (
            f"Dataset-derived intercropping system combining {can} (canopy), "
            f"{mid} (midstory), {und} (understory), and {gnd} (groundcover). "
            f"Pairwise compatibility index: {score:.2f}."
        )
        ler = round(1.3 + max(0.0, (3.0 - score) * 0.05), 2)
        revenue = int(800_000 + (idx - 1) * 200_000)
        tiers = []
        for crop, lyr in zip((can, mid, und, gnd), all_layers):
            spacing, count = _LAYER_SPACING[lyr]
            tiers.append({
                "tier": _LAYER_TIER_NAMES[lyr],
                "crop": crop,
                "spacing": spacing,
                "spacing_unit": "m",
                "count_per_acre": count,
            })
        presets.append({
            "id": f"dataset-preset-{idx}",
            "name": name,
            "description": description,
            "tiers": tiers,
            "suitable_soil_types": soil_types,
            "suitable_regions": regions,
            "expected_LER": ler,
            "base_revenue_per_acre_inr": revenue,
            "soilType": soil_types[0],
            "difficulty": "Intermediate",
            "acres": 2,
            "estimatedYield": "300 Quintals",
            "estimatedRevenue": f"₹{revenue // 100_000:.1f}L/year",
            "cropSchedule": {
                "overstory":  {"crop": can, "spacing": _LAYER_SPACING["canopy"][0],      "plants": _LAYER_SPACING["canopy"][1]},
                "middle":     {"crop": mid, "spacing": _LAYER_SPACING["midstory"][0],    "plants": _LAYER_SPACING["midstory"][1]},
                "understory": {"crop": und, "spacing": _LAYER_SPACING["understory"][0],  "plants": _LAYER_SPACING["understory"][1]},
                "vertical":   {"crop": gnd, "spacing": _LAYER_SPACING["groundcover"][0], "plants": _LAYER_SPACING["groundcover"][1]},
            },
        })

    return presets


def get_preset_by_id(preset_id: str) -> Optional[dict]:
    """Return a single preset by its ``id`` field, or ``None`` if not found."""
    for preset in generate_presets():
        if preset["id"] == preset_id:
            return preset
    return None
