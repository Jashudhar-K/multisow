"""
Stratified intercropping data preprocessing pipeline.

Handles:
  - Normalisation (MinMax / Z-score per feature)
  - Imputation (KNN for sparse, cubic spline for IoT time gaps)
  - Feature engineering (canopy opacity, GDD, PAR stats, ROI, Beer-Lambert)
  - Multi-source fusion (sensor + climate + manual + drone → daily matrix)
"""

from __future__ import annotations

import hashlib
import logging
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


class StratifiedIntercroppingPreprocessor:
    """End-to-end preprocessor for stratified intercropping feature matrices."""

    # ------------------------------------------------------------------
    # Normalisation
    # ------------------------------------------------------------------

    def normalize(
        self,
        df: pd.DataFrame,
        strategy: Optional[Dict[str, str]] = None,
    ) -> pd.DataFrame:
        """
        Apply column-wise normalisation.

        Args:
            df: Input DataFrame (numeric columns only are normalised).
            strategy: Mapping of column name → normalisation method.
                Supported methods: ``"minmax"`` (default), ``"zscore"``.
                Unmentioned numeric columns use ``"minmax"``.

        Returns:
            Normalised DataFrame (copy).
        """
        if strategy is None:
            strategy = {}

        result = df.copy()
        numeric_cols = result.select_dtypes(include=[np.number]).columns

        for col in numeric_cols:
            method = strategy.get(col, "minmax")
            series = result[col]

            if method == "zscore":
                mean = series.mean()
                std = series.std()
                if std > 0:
                    result[col] = (series - mean) / std
                else:
                    result[col] = 0.0
            else:  # minmax
                vmin = series.min()
                vmax = series.max()
                if vmax > vmin:
                    result[col] = (series - vmin) / (vmax - vmin)
                else:
                    result[col] = 0.0

        return result

    # ------------------------------------------------------------------
    # Imputation
    # ------------------------------------------------------------------

    def impute(
        self,
        df: pd.DataFrame,
        threshold: float = 0.20,
    ) -> pd.DataFrame:
        """
        Impute missing values using a multi-strategy approach.

        1. Columns with > ``threshold`` fraction missing → flagged and excluded.
        2. Remaining numeric columns → KNN imputation (k=5).
        3. Time-indexed columns with gaps < 2 hours → cubic spline interpolation.

        Args:
            df: Input DataFrame.
            threshold: Maximum fraction of missing values before exclusion.

        Returns:
            Imputed DataFrame (copy).
        """
        result = df.copy()

        # Step 1: flag & exclude columns with too many missing values
        missing_frac = result.isnull().mean()
        excluded_cols = missing_frac[missing_frac > threshold].index.tolist()
        if excluded_cols:
            logger.info(
                "Excluding %d columns with >%.0f%% missing: %s",
                len(excluded_cols), threshold * 100, excluded_cols,
            )
            # Keep them but fill with median (soft exclude)
            for col in excluded_cols:
                if result[col].dtype in [np.float64, np.float32, np.int64, np.int32, float, int]:
                    result[col] = result[col].fillna(result[col].median())

        # Step 2: KNN imputation for remaining numeric columns
        numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
        numeric_missing = [
            c for c in numeric_cols
            if c not in excluded_cols and result[c].isnull().any()
        ]

        if numeric_missing:
            try:
                from sklearn.impute import KNNImputer

                imputer = KNNImputer(n_neighbors=5, weights="distance")
                result[numeric_cols] = imputer.fit_transform(result[numeric_cols])
            except ImportError:
                logger.warning(
                    "scikit-learn KNNImputer unavailable; falling back to median"
                )
                for col in numeric_missing:
                    result[col] = result[col].fillna(result[col].median())

        # Step 3: cubic spline for time-series gaps (if index is datetime)
        if isinstance(result.index, pd.DatetimeIndex):
            for col in numeric_cols:
                if result[col].isnull().any():
                    result[col] = result[col].interpolate(
                        method="cubicspline", limit=8  # ~2h at 15-min intervals
                    )

        # Final fill: any remaining NaNs → column median or 0
        for col in result.columns:
            if result[col].isnull().any():
                if result[col].dtype in [np.float64, np.float32, np.int64, np.int32, float, int]:
                    result[col] = result[col].fillna(result[col].median())
                else:
                    result[col] = result[col].fillna(method="ffill").fillna(method="bfill")

        return result

    # ------------------------------------------------------------------
    # Feature engineering
    # ------------------------------------------------------------------

    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Add derived features to the feature matrix.

        New columns:
          - ``canopy_opacity_index`` = LAI × k
          - ``GDD`` from Tmax/Tmin (if present)
          - ``par_7d_avg``, ``par_30d_avg``, ``par_cv_30d``
          - ``root_overlap_index`` per layer pair
          - ``crop_combination_hash`` (integer-encoded species tuple)
          - ``f_intercepted`` per layer via Beer-Lambert utility

        Args:
            df: Input feature matrix.

        Returns:
            Feature matrix with additional columns.
        """
        result = df.copy()

        # Canopy opacity
        if "LAI" in result.columns and "k_coeff" in result.columns:
            result["canopy_opacity_index"] = result["LAI"] * result["k_coeff"]

        # GDD from temperature
        if "tmax" in result.columns and "tmin" in result.columns:
            from multisow.ml.utils.climate_features import compute_GDD

            result["GDD_cumulative"] = compute_GDD(result["tmax"], result["tmin"])

        # Rolling PAR stats
        if "GHI" in result.columns:
            from multisow.ml.utils.climate_features import compute_rolling_PAR_stats

            par_stats = compute_rolling_PAR_stats(result["GHI"])
            for col in par_stats.columns:
                result[col] = par_stats[col]

        # Beer-Lambert f_intercepted
        if all(c in result.columns for c in ["LAI", "k_coeff", "row_spacing_m"]):
            from multisow.ml.utils.beers_law import BeersLawParams, calculate_light_interception

            f_vals = []
            for _, row in result.iterrows():
                try:
                    params = BeersLawParams(
                        I_0=row.get("I_0", 1800),
                        k=row["k_coeff"],
                        LAI=row["LAI"],
                        canopy_height=row.get("canopy_height_m", 10.0),
                        row_spacing=row["row_spacing_m"],
                        path_width=row.get("path_width_m", 1.0),
                        solar_elevation_deg=row.get("solar_elevation_deg", 45.0),
                    )
                    res = calculate_light_interception(params)
                    f_vals.append(res.f_intercepted)
                except Exception:
                    f_vals.append(np.nan)
            result["f_intercepted"] = f_vals

        # Crop combination hash
        if "crop_species" in result.columns:
            result["crop_combination_hash"] = result["crop_species"].apply(
                lambda x: int(hashlib.md5(str(x).encode()).hexdigest()[:8], 16)
            )

        # Root overlap index (if paired columns exist)
        if "root_depth_cm" in result.columns and "root_radius_cm" in result.columns:
            result["root_overlap_index"] = self._compute_roi_column(result)

        return result

    @staticmethod
    def _compute_roi_column(df: pd.DataFrame) -> pd.Series:
        """
        Compute a simplified per-row root overlap index.

        Uses root depth and radius relative to row spacing as proxy.
        """
        from multisow.ml.utils.root_architecture import (
            RootParams,
            calculate_root_overlap_index,
        )
        from multisow.ml.schemas.strata import StrataLayer

        roi_values = []
        for _, row in df.iterrows():
            try:
                # Self-overlap proxy: compare with a hypothetical neighbor
                sp = RootParams(
                    species_name=str(row.get("crop_species", "unknown")),
                    rooting_depth_cm=float(row.get("root_depth_cm", 30)),
                    lateral_radius_cm=float(row.get("root_radius_cm", 50)),
                    root_length_density=float(row.get("root_length_density", 1.0)),
                    layer=StrataLayer.UNDERSTORY,
                )
                horizontal = float(row.get("row_spacing_m", 2.0)) * 100  # m → cm
                roi = calculate_root_overlap_index(sp, sp, horizontal)
                roi_values.append(roi)
            except Exception:
                roi_values.append(0.0)
        return pd.Series(roi_values, index=df.index)

    # ------------------------------------------------------------------
    # Multi-source fusion
    # ------------------------------------------------------------------

    def fuse_sources(
        self,
        sensor_df: pd.DataFrame,
        climate_df: pd.DataFrame,
        manual_df: pd.DataFrame,
        drone_df: Optional[pd.DataFrame] = None,
    ) -> pd.DataFrame:
        """
        Merge sensor, climate, manual, and drone data into a unified daily
        feature matrix indexed by ``(farm_id, layer, date)``.

        Steps:
          1. Resample all streams to daily frequency.
          2. Merge on ``(farm_id, date)`` with outer join.
          3. Forward-fill then median-fill remaining gaps.

        Args:
            sensor_df: IoT sensor readings.
            climate_df: Daily climate data.
            manual_df: Manual records.
            drone_df: Optional drone imagery stats.

        Returns:
            Unified feature matrix.
        """
        frames: List[pd.DataFrame] = []

        # --- Sensor data: pivot by sensor_type, resample daily ---
        if sensor_df is not None and not sensor_df.empty:
            sdf = sensor_df.copy()
            if "timestamp" in sdf.columns:
                sdf["date"] = pd.to_datetime(sdf["timestamp"]).dt.date
            if "sensor_type" in sdf.columns and "value" in sdf.columns:
                pivoted = sdf.pivot_table(
                    index=["farm_id", "date"],
                    columns="sensor_type",
                    values="value",
                    aggfunc="mean",
                )
                pivoted = pivoted.reset_index()
                frames.append(pivoted)

        # --- Climate data ---
        if climate_df is not None and not climate_df.empty:
            cdf = climate_df.copy()
            if isinstance(cdf.index, pd.DatetimeIndex):
                cdf["date"] = cdf.index.date
                cdf = cdf.reset_index(drop=True)
            elif "date" not in cdf.columns:
                cdf["date"] = pd.to_datetime(cdf.index).date
                cdf = cdf.reset_index(drop=True)
            frames.append(cdf)

        # --- Manual records ---
        if manual_df is not None and not manual_df.empty:
            mdf = manual_df.copy()
            if "planting_date" in mdf.columns:
                mdf["date"] = pd.to_datetime(mdf["planting_date"]).dt.date
            frames.append(mdf)

        # --- Drone data ---
        if drone_df is not None and not drone_df.empty:
            frames.append(drone_df.copy())

        # Merge all frames
        if not frames:
            return pd.DataFrame()

        merged = frames[0]
        for frame in frames[1:]:
            merge_cols = list(set(merged.columns) & set(frame.columns) & {"farm_id", "date"})
            if merge_cols:
                merged = pd.merge(merged, frame, on=merge_cols, how="outer", suffixes=("", "_dup"))
            else:
                merged = pd.concat([merged, frame], axis=1)

        # Forward-fill then median for remaining gaps
        numeric_cols = merged.select_dtypes(include=[np.number]).columns
        merged[numeric_cols] = merged[numeric_cols].ffill().fillna(
            merged[numeric_cols].median()
        )

        return merged
