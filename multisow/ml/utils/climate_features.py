"""
Climate feature engineering utilities for intercropping ML models.

Provides:
  - Growing Degree-Days (GDD)
  - Rolling PAR statistics
  - Penman-Monteith reference evapotranspiration (ETo)
  - Climate instability index (CV of GHI)
"""

from __future__ import annotations

import math
from typing import List, Optional

import numpy as np
import pandas as pd


def compute_GDD(
    tmax_series: pd.Series,
    tmin_series: pd.Series,
    t_base: float = 10.0,
) -> pd.Series:
    """
    Compute cumulative Growing Degree-Days (GDD).

    GDD_daily = max(0, (Tmax + Tmin) / 2 − T_base)
    Returned series is the cumulative sum.

    Args:
        tmax_series: Daily maximum temperature (°C).
        tmin_series: Daily minimum temperature (°C).
        t_base: Base temperature (°C), default 10.

    Returns:
        pd.Series of cumulative GDD values.
    """
    t_avg = (tmax_series + tmin_series) / 2.0
    daily_gdd = (t_avg - t_base).clip(lower=0.0)
    return daily_gdd.cumsum()


def compute_rolling_PAR_stats(
    par_series: pd.Series,
    windows: Optional[List[int]] = None,
) -> pd.DataFrame:
    """
    Compute rolling mean and coefficient of variation for PAR.

    Args:
        par_series: Daily PAR values (μmol/m²/s or MJ/m²/day).
        windows: Rolling window sizes in days. Defaults to [7, 30].

    Returns:
        DataFrame with columns par_{w}d_avg and par_{w}d_cv for each window.
    """
    if windows is None:
        windows = [7, 30]

    result = pd.DataFrame(index=par_series.index)
    for w in windows:
        rolling = par_series.rolling(window=w, min_periods=1)
        result[f"par_{w}d_avg"] = rolling.mean()
        roll_std = rolling.std().fillna(0)
        roll_mean = rolling.mean().replace(0, np.nan)
        result[f"par_{w}d_cv"] = (roll_std / roll_mean).fillna(0)
    return result


def compute_ETo_penman_monteith(
    tmax: float,
    tmin: float,
    rh: float,
    wind_speed: float,
    ghi: float,
    elevation: float,
) -> float:
    """
    Compute reference evapotranspiration (ETo) using the FAO-56 Penman-Monteith
    simplified equation.

    ETo = (0.408 Δ (Rn − G) + γ (900/(T+273)) u₂ (es − ea)) /
          (Δ + γ (1 + 0.34 u₂))

    This uses the simplified daily form where G ≈ 0 for daily steps.

    Args:
        tmax: Maximum daily temperature (°C).
        tmin: Minimum daily temperature (°C).
        rh: Mean relative humidity (%).
        wind_speed: Wind speed at 2 m height (m/s).
        ghi: Global horizontal irradiance (MJ/m²/day).
        elevation: Site elevation (m above sea level).

    Returns:
        ETo in mm/day.
    """
    T_mean = (tmax + tmin) / 2.0

    # Saturation vapour pressure (kPa)
    es_max = 0.6108 * math.exp(17.27 * tmax / (tmax + 237.3))
    es_min = 0.6108 * math.exp(17.27 * tmin / (tmin + 237.3))
    es = (es_max + es_min) / 2.0

    # Actual vapour pressure
    ea = es * (rh / 100.0)

    # Slope of saturation vapour pressure curve (kPa/°C)
    delta = (4098 * 0.6108 * math.exp(17.27 * T_mean / (T_mean + 237.3))) / (
        (T_mean + 237.3) ** 2
    )

    # Atmospheric pressure (kPa) at elevation
    P = 101.3 * ((293 - 0.0065 * elevation) / 293) ** 5.26

    # Psychrometric constant (kPa/°C)
    gamma = 0.000665 * P

    # Net radiation approximation: Rn ≈ 0.77 × GHI (for grass reference)
    Rn = 0.77 * ghi  # MJ/m²/day
    G = 0.0  # negligible for daily time-step

    # FAO-56 Penman-Monteith
    u2 = wind_speed
    numerator = 0.408 * delta * (Rn - G) + gamma * (900 / (T_mean + 273)) * u2 * (
        es - ea
    )
    denominator = delta + gamma * (1 + 0.34 * u2)

    ETo = numerator / denominator if denominator != 0 else 0.0
    return max(0.0, ETo)


def compute_climate_instability_index(
    climate_df: pd.DataFrame,
    window: int = 30,
    ghi_column: str = "GHI",
) -> float:
    """
    Compute climate instability index as the coefficient of variation
    of daily GHI over a rolling window.

    Higher values indicate more variable solar conditions — a risk
    factor for light-sensitive middle-tier crops.

    Args:
        climate_df: DataFrame with at least a GHI column (MJ/m²/day or W/m²).
        window: Rolling window size in days (default 30).
        ghi_column: Column name for global horizontal irradiance.

    Returns:
        Mean CV of GHI over the rolling window (0 = perfectly stable).
    """
    if ghi_column not in climate_df.columns:
        return 0.0

    ghi = climate_df[ghi_column].dropna()
    if len(ghi) < window:
        if ghi.mean() == 0:
            return 0.0
        return float(ghi.std() / ghi.mean()) if ghi.mean() != 0 else 0.0

    rolling_std = ghi.rolling(window=window, min_periods=1).std()
    rolling_mean = ghi.rolling(window=window, min_periods=1).mean().replace(0, np.nan)
    cv_series = (rolling_std / rolling_mean).dropna()
    return float(cv_series.mean()) if len(cv_series) > 0 else 0.0
