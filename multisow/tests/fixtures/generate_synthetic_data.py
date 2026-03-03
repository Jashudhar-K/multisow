"""
Generate synthetic intercropping dataset for FOHEM training and testing.

Produces:
  - multisow/tests/fixtures/synthetic_intercrop_data.csv
  - multisow/tests/fixtures/sample_farm_data.json

All values are based on realistic ranges from Indian multi-tier
intercropping systems (coconut + banana + ginger/turmeric).
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd


# -------------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------------

NUM_FARMS = 10
RECORDS_PER_FARM = 50  # daily records per farm
TOTAL_RECORDS = NUM_FARMS * RECORDS_PER_FARM

LAYERS = ["canopy", "middle", "understory", "belowground"]

# Realistic ranges per layer  (min, max)
LAYER_PARAMS: Dict[str, Dict[str, Tuple[float, float]]] = {
    "canopy": {
        "LAI": (3.0, 7.0),
        "k_coeff": (0.4, 0.65),
        "row_spacing_m": (6.0, 10.0),
        "soil_N": (80, 200),
        "soil_P": (10, 40),
        "soil_K": (1.0, 4.0),
        "soil_pH": (5.0, 7.0),
        "VWC": (0.15, 0.40),
        "GDD": (1500, 3500),
        "rainfall_7d": (20, 180),
        "solar_elevation_deg": (40, 75),
        "root_depth_cm": (100, 250),
        "root_radius_cm": (80, 200),
        "canopy_height_m": (12, 25),
        "path_width_m": (1.5, 4.0),
        "crop_density": (0.3, 0.7),
        "shade_fraction": (0.0, 0.2),
        "yield_t_ha": (6.0, 14.0),
    },
    "middle": {
        "LAI": (2.0, 5.5),
        "k_coeff": (0.35, 0.55),
        "row_spacing_m": (2.0, 5.0),
        "soil_N": (60, 180),
        "soil_P": (8, 35),
        "soil_K": (0.8, 3.5),
        "soil_pH": (5.0, 6.8),
        "VWC": (0.20, 0.42),
        "GDD": (1200, 3000),
        "rainfall_7d": (25, 200),
        "solar_elevation_deg": (35, 70),
        "root_depth_cm": (40, 120),
        "root_radius_cm": (30, 100),
        "canopy_height_m": (3, 10),
        "path_width_m": (1.0, 3.0),
        "crop_density": (0.4, 0.85),
        "shade_fraction": (0.2, 0.55),
        "yield_t_ha": (8.0, 20.0),
    },
    "understory": {
        "LAI": (1.0, 3.5),
        "k_coeff": (0.3, 0.5),
        "row_spacing_m": (0.3, 1.5),
        "soil_N": (40, 150),
        "soil_P": (5, 30),
        "soil_K": (0.5, 3.0),
        "soil_pH": (4.8, 6.5),
        "VWC": (0.25, 0.50),
        "GDD": (800, 2500),
        "rainfall_7d": (30, 220),
        "solar_elevation_deg": (30, 65),
        "root_depth_cm": (10, 60),
        "root_radius_cm": (5, 40),
        "canopy_height_m": (0.3, 1.5),
        "path_width_m": (0.3, 1.0),
        "crop_density": (0.5, 0.95),
        "shade_fraction": (0.4, 0.75),
        "yield_t_ha": (3.0, 12.0),
    },
    "belowground": {
        "LAI": (0.0, 0.5),
        "k_coeff": (0.2, 0.3),
        "row_spacing_m": (1.0, 4.0),
        "soil_N": (30, 120),
        "soil_P": (3, 25),
        "soil_K": (0.3, 2.5),
        "soil_pH": (4.5, 6.5),
        "VWC": (0.20, 0.45),
        "GDD": (600, 2000),
        "rainfall_7d": (20, 200),
        "solar_elevation_deg": (30, 60),
        "root_depth_cm": (5, 40),
        "root_radius_cm": (3, 30),
        "canopy_height_m": (0.0, 0.3),
        "path_width_m": (0.5, 2.0),
        "crop_density": (0.3, 0.8),
        "shade_fraction": (0.5, 0.85),
        "yield_t_ha": (0.5, 5.0),
    },
}

CROP_SPECIES = {
    "canopy": ["Coconut", "Arecanut", "Silver Oak", "Teak"],
    "middle": ["Banana", "Cocoa", "Coffee", "Papaya"],
    "understory": ["Ginger", "Turmeric", "Yam", "Cardamom"],
    "belowground": ["Sweet Potato", "Cassava", "Groundnut", "Radish"],
}


def _generate_yield(row: Dict[str, float], layer: str, rng: np.random.Generator) -> float:
    """
    Generate a realistic yield based on features with known correlations.

    yield ≈ base * LAI_factor * VWC_factor * soil_factor * (1 - shade_penalty) + noise
    """
    base = {"canopy": 10.0, "middle": 14.0, "understory": 7.0, "belowground": 2.5}[layer]

    lai_factor = min(row["LAI"] / 4.0, 1.5)
    vwc_factor = min(row["VWC"] / 0.3, 1.3)
    soil_factor = 0.6 + 0.4 * min(row["soil_N"] / 150, 1.0)
    shade_penalty = row["shade_fraction"] * 0.3
    gdd_factor = min(row["GDD"] / 2000, 1.2)

    y = base * lai_factor * vwc_factor * soil_factor * (1 - shade_penalty) * gdd_factor
    y += rng.normal(0, y * 0.08)  # 8% noise
    return max(0.5, round(y, 3))


def generate_synthetic_csv(output_dir: str | Path) -> Path:
    """
    Generate the main synthetic dataset CSV.

    Returns:
        Path to the generated CSV file.
    """
    rng = np.random.default_rng(42)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    all_rows: List[Dict] = []

    for farm_idx in range(NUM_FARMS):
        farm_id = f"FARM_{farm_idx + 1:03d}"

        for day in range(RECORDS_PER_FARM):
            for layer in LAYERS:
                params = LAYER_PARAMS[layer]
                row: Dict = {"farm_id": farm_id, "day": day + 1, "layer": layer}

                for feat, (lo, hi) in params.items():
                    if feat == "yield_t_ha":
                        continue
                    row[feat] = round(float(rng.uniform(lo, hi)), 4)

                row["crop_species"] = rng.choice(CROP_SPECIES[layer])
                row["yield_t_ha"] = _generate_yield(row, layer, rng)
                all_rows.append(row)

    df = pd.DataFrame(all_rows)
    csv_path = output_dir / "synthetic_intercrop_data.csv"
    df.to_csv(csv_path, index=False)
    print(f"[✓] Generated {len(df)} rows → {csv_path}")
    return csv_path


def generate_sample_farm_json(output_dir: str | Path) -> Path:
    """
    Generate a sample_farm_data.json with 3 example farm configurations.

    Returns:
        Path to the generated JSON file.
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    sample = [
        {
            "farm_id": "FARM_WAYANAD_001",
            "region": "Wayanad, Kerala",
            "soil_type": "laterite",
            "total_area_acres": 2.0,
            "layers": [
                {
                    "layer": "canopy",
                    "crop_species": "Coconut",
                    "LAI": 5.2,
                    "k_coeff": 0.52,
                    "row_spacing_m": 8.0,
                    "soil_N": 145,
                    "soil_P": 22,
                    "soil_K": 2.8,
                    "soil_pH": 5.8,
                    "VWC": 0.32,
                    "GDD": 2800,
                    "rainfall_7d": 85,
                    "solar_elevation_deg": 62,
                    "root_depth_cm": 180,
                    "root_radius_cm": 150,
                    "canopy_height_m": 20,
                    "path_width_m": 2.5,
                    "crop_density": 0.5,
                    "shade_fraction": 0.05,
                },
                {
                    "layer": "middle",
                    "crop_species": "Banana",
                    "LAI": 3.8,
                    "k_coeff": 0.45,
                    "row_spacing_m": 3.0,
                    "soil_N": 120,
                    "soil_P": 18,
                    "soil_K": 2.2,
                    "soil_pH": 5.6,
                    "VWC": 0.35,
                    "GDD": 2500,
                    "rainfall_7d": 85,
                    "solar_elevation_deg": 55,
                    "root_depth_cm": 80,
                    "root_radius_cm": 60,
                    "canopy_height_m": 6,
                    "path_width_m": 1.5,
                    "crop_density": 0.7,
                    "shade_fraction": 0.35,
                },
                {
                    "layer": "understory",
                    "crop_species": "Turmeric",
                    "LAI": 2.1,
                    "k_coeff": 0.38,
                    "row_spacing_m": 0.5,
                    "soil_N": 95,
                    "soil_P": 15,
                    "soil_K": 1.8,
                    "soil_pH": 5.5,
                    "VWC": 0.38,
                    "GDD": 2000,
                    "rainfall_7d": 85,
                    "solar_elevation_deg": 45,
                    "root_depth_cm": 30,
                    "root_radius_cm": 15,
                    "canopy_height_m": 0.8,
                    "path_width_m": 0.4,
                    "crop_density": 0.85,
                    "shade_fraction": 0.55,
                },
            ],
            "monocrop_baselines": {
                "canopy": 10.5,
                "middle": 16.0,
                "understory": 8.0,
            },
        },
        {
            "farm_id": "FARM_COORG_002",
            "region": "Coorg, Karnataka",
            "soil_type": "laterite",
            "total_area_acres": 3.0,
            "layers": [
                {
                    "layer": "canopy",
                    "crop_species": "Silver Oak",
                    "LAI": 4.5,
                    "k_coeff": 0.48,
                    "row_spacing_m": 10.0,
                    "soil_N": 130,
                    "soil_P": 20,
                    "soil_K": 2.5,
                    "soil_pH": 5.5,
                    "VWC": 0.30,
                    "GDD": 2600,
                    "rainfall_7d": 120,
                    "solar_elevation_deg": 58,
                    "root_depth_cm": 200,
                    "root_radius_cm": 160,
                    "canopy_height_m": 18,
                    "path_width_m": 3.0,
                    "crop_density": 0.4,
                    "shade_fraction": 0.08,
                },
                {
                    "layer": "middle",
                    "crop_species": "Coffee",
                    "LAI": 3.2,
                    "k_coeff": 0.42,
                    "row_spacing_m": 2.5,
                    "soil_N": 110,
                    "soil_P": 16,
                    "soil_K": 2.0,
                    "soil_pH": 5.4,
                    "VWC": 0.33,
                    "GDD": 2200,
                    "rainfall_7d": 120,
                    "solar_elevation_deg": 50,
                    "root_depth_cm": 70,
                    "root_radius_cm": 50,
                    "canopy_height_m": 4,
                    "path_width_m": 1.2,
                    "crop_density": 0.75,
                    "shade_fraction": 0.40,
                },
                {
                    "layer": "understory",
                    "crop_species": "Cardamom",
                    "LAI": 1.8,
                    "k_coeff": 0.35,
                    "row_spacing_m": 0.4,
                    "soil_N": 80,
                    "soil_P": 12,
                    "soil_K": 1.5,
                    "soil_pH": 5.3,
                    "VWC": 0.36,
                    "GDD": 1800,
                    "rainfall_7d": 120,
                    "solar_elevation_deg": 42,
                    "root_depth_cm": 25,
                    "root_radius_cm": 12,
                    "canopy_height_m": 0.6,
                    "path_width_m": 0.3,
                    "crop_density": 0.80,
                    "shade_fraction": 0.60,
                },
            ],
            "monocrop_baselines": {
                "canopy": 9.0,
                "middle": 14.0,
                "understory": 7.5,
            },
        },
        {
            "farm_id": "FARM_KONKAN_003",
            "region": "Konkan, Maharashtra",
            "soil_type": "black",
            "total_area_acres": 2.5,
            "layers": [
                {
                    "layer": "canopy",
                    "crop_species": "Coconut",
                    "LAI": 5.8,
                    "k_coeff": 0.55,
                    "row_spacing_m": 8.0,
                    "soil_N": 160,
                    "soil_P": 25,
                    "soil_K": 3.2,
                    "soil_pH": 6.2,
                    "VWC": 0.28,
                    "GDD": 3000,
                    "rainfall_7d": 65,
                    "solar_elevation_deg": 65,
                    "root_depth_cm": 190,
                    "root_radius_cm": 140,
                    "canopy_height_m": 22,
                    "path_width_m": 2.0,
                    "crop_density": 0.55,
                    "shade_fraction": 0.03,
                },
                {
                    "layer": "middle",
                    "crop_species": "Papaya",
                    "LAI": 4.2,
                    "k_coeff": 0.50,
                    "row_spacing_m": 3.5,
                    "soil_N": 140,
                    "soil_P": 20,
                    "soil_K": 2.6,
                    "soil_pH": 6.0,
                    "VWC": 0.30,
                    "GDD": 2700,
                    "rainfall_7d": 65,
                    "solar_elevation_deg": 58,
                    "root_depth_cm": 90,
                    "root_radius_cm": 55,
                    "canopy_height_m": 5,
                    "path_width_m": 1.8,
                    "crop_density": 0.65,
                    "shade_fraction": 0.30,
                },
                {
                    "layer": "understory",
                    "crop_species": "Ginger",
                    "LAI": 2.5,
                    "k_coeff": 0.40,
                    "row_spacing_m": 0.5,
                    "soil_N": 100,
                    "soil_P": 14,
                    "soil_K": 2.0,
                    "soil_pH": 5.8,
                    "VWC": 0.35,
                    "GDD": 2200,
                    "rainfall_7d": 65,
                    "solar_elevation_deg": 48,
                    "root_depth_cm": 35,
                    "root_radius_cm": 18,
                    "canopy_height_m": 1.0,
                    "path_width_m": 0.5,
                    "crop_density": 0.90,
                    "shade_fraction": 0.50,
                },
            ],
            "monocrop_baselines": {
                "canopy": 11.0,
                "middle": 18.0,
                "understory": 9.0,
            },
        },
    ]

    json_path = output_dir / "sample_farm_data.json"
    with open(json_path, "w") as f:
        json.dump(sample, f, indent=2)
    print(f"[✓] Generated {len(sample)} farm configs → {json_path}")
    return json_path


if __name__ == "__main__":
    fixtures_dir = Path(__file__).parent
    generate_synthetic_csv(fixtures_dir)
    generate_sample_farm_json(fixtures_dir)
