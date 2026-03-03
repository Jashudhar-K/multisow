"""
Beer-Lambert law calculations for heterogeneous strip intercropping.

Implements the core light interception model:
  I(z) = I₀ × exp(−k × LAI_cumulative(z))

For strip geometry:
  f_intercepted = 1 − exp(−k × LAI_strip / w_strip)
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import List


@dataclass
class BeersLawParams:
    """Parameters for a single canopy layer's light interception calculation."""

    I_0: float  # Incident PAR at canopy top (μmol/m²/s)
    k: float  # Species-specific extinction coefficient (0.39–0.65)
    LAI: float  # Leaf Area Index (m²/m²)
    canopy_height: float  # Layer height (m)
    row_spacing: float  # Distance between rows (m)
    path_width: float  # Strip width (m)
    solar_elevation_deg: float  # Solar angle (degrees)
    leaf_angle_distribution: float = 0.5  # G-function (0.3–0.9)


@dataclass
class BeersLawResult:
    """Result of Beer-Lambert light interception for one layer."""

    I_z: float  # PAR at bottom of layer (μmol/m²/s)
    f_intercepted: float  # Fraction intercepted (0–1)
    f_transmitted: float  # Fraction reaching next layer (0–1)
    sunlit_fraction: float  # Fraction of sunlit leaves
    shade_fraction: float  # Fraction in shade


def calculate_light_interception(params: BeersLawParams) -> BeersLawResult:
    """
    Calculate light interception for a single canopy layer using Beer-Lambert law.

    The core equation for heterogeneous strip intercropping:
      I(z) = I₀ × exp(−k × LAI_cumulative(z))

    Fraction intercepted per strip:
      f_intercepted = 1 − exp(−k × LAI_strip / w_strip)

    The effective extinction is adjusted by solar angle and leaf angle
    distribution (G-function).

    Args:
        params: BeersLawParams containing all layer parameters.

    Returns:
        BeersLawResult with transmitted PAR, interception fractions, and
        sunlit/shade leaf fractions.
    """
    # Validate inputs
    if params.I_0 < 0:
        raise ValueError("Incident PAR (I_0) cannot be negative")
    if params.LAI < 0:
        raise ValueError("LAI cannot be negative")

    # Handle edge case of zero PAR or zero LAI
    if params.I_0 == 0 or params.LAI == 0:
        return BeersLawResult(
            I_z=params.I_0,
            f_intercepted=0.0,
            f_transmitted=1.0,
            sunlit_fraction=1.0,
            shade_fraction=0.0,
        )

    # Convert solar elevation to radians; clamp to avoid div-by-zero
    solar_elev_rad = math.radians(max(params.solar_elevation_deg, 1.0))

    # Effective extinction coefficient adjusted by solar geometry
    # k_eff = k × G(θ) / sin(β)  where β = solar elevation
    G = params.leaf_angle_distribution
    k_eff = params.k * G / math.sin(solar_elev_rad)
    # Clamp to physically reasonable range
    k_eff = min(k_eff, 5.0)

    # Strip-geometry correction: effective LAI per unit strip width
    strip_width = max(params.path_width, 0.01)  # avoid division by zero
    LAI_strip = params.LAI * params.row_spacing / strip_width

    # Core Beer-Lambert: fraction intercepted by the strip
    f_intercepted = 1.0 - math.exp(-k_eff * LAI_strip / strip_width)
    f_intercepted = max(0.0, min(1.0, f_intercepted))

    # Standard Beer-Lambert through the full canopy
    f_transmitted_full = math.exp(-k_eff * params.LAI)
    f_transmitted_full = max(0.0, min(1.0, f_transmitted_full))

    # PAR at bottom
    I_z = params.I_0 * f_transmitted_full

    # Sunlit vs shade fractions (de Pury & Farquhar 1997 approximation)
    if k_eff * params.LAI > 0:
        sunlit_fraction = (1.0 - math.exp(-k_eff * params.LAI)) / (
            k_eff * params.LAI
        )
    else:
        sunlit_fraction = 1.0
    sunlit_fraction = max(0.0, min(1.0, sunlit_fraction))
    shade_fraction = 1.0 - sunlit_fraction

    return BeersLawResult(
        I_z=I_z,
        f_intercepted=f_intercepted,
        f_transmitted=f_transmitted_full,
        sunlit_fraction=sunlit_fraction,
        shade_fraction=shade_fraction,
    )


def calculate_multi_layer_PAR(layers: List[BeersLawParams]) -> List[BeersLawResult]:
    """
    Cascade transmitted PAR from Layer 1 (canopy) through to the lowest layer.

    Each layer receives the transmitted PAR from the layer above it.
    The first layer receives the original I₀, and subsequent layers receive
    I_z from the preceding layer.

    Args:
        layers: Ordered list from top (canopy) to bottom (understory/ground).

    Returns:
        List of BeersLawResult, one per layer, in the same order.
    """
    if not layers:
        return []

    results: List[BeersLawResult] = []
    current_I = layers[0].I_0

    for layer in layers:
        # Override I_0 with cascaded PAR from above
        cascaded_params = BeersLawParams(
            I_0=current_I,
            k=layer.k,
            LAI=layer.LAI,
            canopy_height=layer.canopy_height,
            row_spacing=layer.row_spacing,
            path_width=layer.path_width,
            solar_elevation_deg=layer.solar_elevation_deg,
            leaf_angle_distribution=layer.leaf_angle_distribution,
        )
        result = calculate_light_interception(cascaded_params)
        results.append(result)
        # Next layer receives the transmitted PAR
        current_I = result.I_z

    return results
