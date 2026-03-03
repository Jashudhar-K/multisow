"""
Strata layer schemas and enumerations for the MultiSow 4-layer intercropping model.

Layer definitions:
  CANOPY       – 15–25 m (Coconut, Teak, Silver Oak)
  MIDDLE       – 5–10 m  (Banana, Cocoa, Coffee, Pepper)
  UNDERSTORY   – 0.5–2 m (Ginger, Turmeric, Yams)
  BELOWGROUND  – 0–120 cm depth (root competition layer)
"""

from __future__ import annotations

from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class StrataLayer(str, Enum):
    """4-layer stratified intercropping model."""

    CANOPY = "canopy"
    MIDDLE = "middle"
    UNDERSTORY = "understory"
    BELOWGROUND = "belowground"


class LayerInput(BaseModel):
    """Input parameters for a single stratum layer."""

    layer: StrataLayer
    LAI: float = Field(..., ge=0, le=10, description="Leaf Area Index (m²/m²)")
    k_coeff: float = Field(
        ..., ge=0.2, le=0.8, description="Species-specific extinction coefficient"
    )
    row_spacing_m: float = Field(
        ..., ge=0.3, le=10.0, description="Row spacing in metres"
    )
    soil_N: float = Field(..., ge=0, description="Soil nitrogen (mg/kg)")
    soil_P: float = Field(..., ge=0, description="Soil phosphorus (mg/kg)")
    soil_K: float = Field(..., ge=0, description="Soil potassium (cmol/kg)")
    soil_pH: float = Field(..., ge=3.0, le=11.0, description="Soil pH")
    VWC: float = Field(
        ..., ge=0.0, le=0.6, description="Volumetric water content (cm³/cm³)"
    )
    GDD: float = Field(..., ge=0, description="Growing degree-days")
    rainfall_7d: float = Field(
        ..., ge=0, description="Cumulative rainfall in last 7 days (mm)"
    )
    solar_elevation_deg: float = Field(
        ..., ge=0, le=90, description="Solar elevation angle (degrees)"
    )
    crop_species: str = Field(..., description="Primary crop species name")
    root_depth_cm: float = Field(
        ..., ge=1, le=300, description="Maximum rooting depth (cm)"
    )
    root_radius_cm: float = Field(
        ..., ge=1, le=300, description="Lateral root influence radius (cm)"
    )
    canopy_height_m: float = Field(
        default=10.0, ge=0.1, le=30.0, description="Canopy height (m)"
    )
    path_width_m: float = Field(
        default=1.0, ge=0.1, le=10.0, description="Strip width (m)"
    )
    crop_density: float = Field(
        default=0.5, ge=0.0, le=1.0, description="Normalised crop density"
    )
    shade_fraction: float = Field(
        default=0.0, ge=0.0, le=1.0, description="Shade fraction from upper layers"
    )
    root_length_density: float = Field(
        default=1.0, ge=0.0, le=10.0, description="Root length density (cm/cm³)"
    )


class StrataInput(BaseModel):
    """Full strata system input for a prediction request."""

    farm_id: str = Field(..., description="Unique farm identifier")
    layers: List[LayerInput] = Field(
        ..., min_length=1, max_length=4, description="Layer parameters"
    )
    use_sensor_data: bool = Field(
        default=True, description="Auto-fetch latest IoT data from InfluxDB"
    )
    monocrop_baselines: Optional[Dict[str, float]] = Field(
        default=None, description="Monocrop yield baselines per layer for LER"
    )
    I_0: float = Field(
        default=1800.0,
        ge=0,
        description="Incident PAR at canopy top (μmol/m²/s)",
    )
