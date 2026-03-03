"""
Root architecture modelling for stratified intercropping.

Calculates Root Overlap Index (ROI) and nutrient competition scores
between species in adjacent strata layers.

Root zones are modelled as cylinders:
  V = π × r² × d

Intersection volume uses analytical cylinder-cylinder overlap.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Dict

from multisow.ml.schemas.strata import StrataLayer


@dataclass
class RootParams:
    """Root architecture parameters for a single species."""

    species_name: str
    rooting_depth_cm: float  # Max depth of active roots (15–120)
    lateral_radius_cm: float  # Influence radius (20–150)
    root_length_density: float  # RLD (cm/cm³, 0.1–8.5)
    layer: StrataLayer


def _cylinder_volume(radius_cm: float, depth_cm: float) -> float:
    """Calculate the volume of a cylindrical root zone in cm³.

    Args:
        radius_cm: Lateral radius.
        depth_cm: Rooting depth.

    Returns:
        Volume in cm³.
    """
    return math.pi * radius_cm ** 2 * depth_cm


def _cylinder_intersection_volume(
    r_a: float,
    d_a: float,
    r_b: float,
    d_b: float,
    horizontal_distance_cm: float,
) -> float:
    """
    Analytical approximation of the intersection volume between two
    coaxially-offset vertical cylinders.

    The horizontal overlap area between two circles separated by distance *h*
    is computed using the circle-circle intersection formula.  The vertical
    overlap depth is ``min(d_a, d_b)`` (both start at the surface).

    Args:
        r_a: Radius of cylinder A.
        d_a: Depth of cylinder A.
        r_b: Radius of cylinder B.
        d_b: Depth of cylinder B.
        horizontal_distance_cm: Centre-to-centre horizontal separation.

    Returns:
        Intersection volume in cm³ (≥ 0).
    """
    h = horizontal_distance_cm
    # No horizontal overlap if separated by more than sum of radii
    if h >= r_a + r_b:
        return 0.0

    # Complete containment
    if h + min(r_a, r_b) <= max(r_a, r_b):
        overlap_area = math.pi * min(r_a, r_b) ** 2
    else:
        # Standard circle-circle intersection area
        # A = r_a² × arccos((h² + r_a² - r_b²)/(2hr_a))
        #   + r_b² × arccos((h² + r_b² - r_a²)/(2hr_b))
        #   - 0.5 × sqrt((-h+r_a+r_b)(h+r_a-r_b)(h-r_a+r_b)(h+r_a+r_b))
        cos_arg_a = (h ** 2 + r_a ** 2 - r_b ** 2) / (2 * h * r_a)
        cos_arg_b = (h ** 2 + r_b ** 2 - r_a ** 2) / (2 * h * r_b)
        # Clamp for numerical safety
        cos_arg_a = max(-1.0, min(1.0, cos_arg_a))
        cos_arg_b = max(-1.0, min(1.0, cos_arg_b))

        part1 = r_a ** 2 * math.acos(cos_arg_a)
        part2 = r_b ** 2 * math.acos(cos_arg_b)
        discriminant = (
            (-h + r_a + r_b)
            * (h + r_a - r_b)
            * (h - r_a + r_b)
            * (h + r_a + r_b)
        )
        part3 = 0.5 * math.sqrt(max(0.0, discriminant))
        overlap_area = part1 + part2 - part3

    # Vertical overlap depth — assume both root zones start at ground surface
    vertical_overlap = min(d_a, d_b)
    return overlap_area * vertical_overlap


def calculate_root_overlap_index(
    species_a: RootParams,
    species_b: RootParams,
    horizontal_distance_cm: float,
) -> float:
    """
    Calculate the Root Overlap Index (ROI) between two species.

    ROI = volume_of_intersection / min(volume_a, volume_b)

    Values:
      0.0 → no overlap (roots are spatially separated)
      1.0 → full overlap (smaller root zone entirely inside the larger)

    Args:
        species_a: Root parameters for species A.
        species_b: Root parameters for species B.
        horizontal_distance_cm: Centre-to-centre horizontal distance (cm).

    Returns:
        ROI float in [0, 1].
    """
    vol_a = _cylinder_volume(species_a.lateral_radius_cm, species_a.rooting_depth_cm)
    vol_b = _cylinder_volume(species_b.lateral_radius_cm, species_b.rooting_depth_cm)

    if min(vol_a, vol_b) == 0:
        return 0.0

    vol_intersection = _cylinder_intersection_volume(
        species_a.lateral_radius_cm,
        species_a.rooting_depth_cm,
        species_b.lateral_radius_cm,
        species_b.rooting_depth_cm,
        horizontal_distance_cm,
    )

    roi = vol_intersection / min(vol_a, vol_b)
    return max(0.0, min(1.0, roi))


def calculate_nutrient_competition_score(
    roi: float,
    soil_N: float,
    soil_P: float,
    soil_K: float,
) -> Dict[str, float]:
    """
    Calculate nutrient competition scores given root overlap and soil nutrients.

    Higher ROI combined with lower soil nutrient levels produces higher
    competition scores.  Each nutrient score is in [0, 1].

    Args:
        roi: Root Overlap Index (0–1).
        soil_N: Available nitrogen (mg/kg), typical range 50–200.
        soil_P: Available phosphorus (mg/kg), typical range 5–80.
        soil_K: Available potassium (cmol/kg), typical range 0.1–5.

    Returns:
        Dict with keys ``N_competition``, ``P_competition``,
        ``K_competition``, and ``overall_score``.
    """
    # Normalize soil nutrients to deficiency factors (0 = abundant, 1 = depleted)
    N_deficiency = max(0.0, min(1.0, 1.0 - soil_N / 200.0))
    P_deficiency = max(0.0, min(1.0, 1.0 - soil_P / 80.0))
    K_deficiency = max(0.0, min(1.0, 1.0 - soil_K / 5.0))

    # Competition = ROI × deficiency (high overlap + low nutrients = high comp.)
    N_comp = roi * N_deficiency
    P_comp = roi * P_deficiency
    K_comp = roi * K_deficiency

    # Overall weighted average (N most important for intercrop competition)
    overall = 0.5 * N_comp + 0.3 * P_comp + 0.2 * K_comp

    return {
        "N_competition": round(N_comp, 4),
        "P_competition": round(P_comp, 4),
        "K_competition": round(K_comp, 4),
        "overall_score": round(overall, 4),
    }
