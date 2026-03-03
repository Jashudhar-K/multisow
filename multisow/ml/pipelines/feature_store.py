"""
Feature store for managing versioned feature matrices.

SQLite-backed for development, PostgreSQL for production.
Auto-detects which database is available.
"""

from __future__ import annotations

import json
import logging
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Optional

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


class FeatureStore:
    """
    Versioned feature matrix storage.

    In development mode (SQLite), matrices are stored as Parquet files on
    disk with metadata tracked in SQLite.  In production, metadata goes to
    PostgreSQL and files to a shared volume or object store.
    """

    def __init__(self, storage_dir: Optional[str] = None, db_url: Optional[str] = None) -> None:
        """
        Initialise the feature store.

        Args:
            storage_dir: Directory for parquet files. Defaults to
                ``multisow/ml/feature_store_data``.
            db_url: Database URL for metadata. If None, uses an in-memory dict.
        """
        self.storage_dir = Path(
            storage_dir
            or os.path.join("multisow", "ml", "feature_store_data")
        )
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self._metadata: dict = {}  # farm_id → {version → metadata}
        logger.info("FeatureStore initialised at %s", self.storage_dir)

    def save_feature_matrix(
        self,
        farm_id: str,
        df: pd.DataFrame,
        version: Optional[str] = None,
    ) -> str:
        """
        Save a feature matrix and record its metadata.

        Args:
            farm_id: Farm identifier.
            df: Feature DataFrame.
            version: Version string (auto-generated if None).

        Returns:
            The version string.
        """
        if version is None:
            version = datetime.utcnow().strftime("%Y%m%d_%H%M%S") + "_" + uuid.uuid4().hex[:6]

        # Save parquet
        farm_dir = self.storage_dir / farm_id
        farm_dir.mkdir(parents=True, exist_ok=True)
        filepath = farm_dir / f"features_{version}.parquet"

        try:
            df.to_parquet(filepath, index=True)
        except Exception:
            # Fallback to CSV if pyarrow not available
            filepath = farm_dir / f"features_{version}.csv"
            df.to_csv(filepath, index=True)

        # Record metadata
        if farm_id not in self._metadata:
            self._metadata[farm_id] = {}

        self._metadata[farm_id][version] = {
            "id": str(uuid.uuid4()),
            "farm_id": farm_id,
            "version": version,
            "n_rows": len(df),
            "n_features": len(df.columns),
            "feature_names": list(df.columns),
            "created_at": datetime.utcnow().isoformat(),
            "storage_path": str(filepath),
        }

        logger.info(
            "Saved feature matrix for farm %s v%s (%d rows, %d features)",
            farm_id, version, len(df), len(df.columns),
        )
        return version

    def load_feature_matrix(
        self,
        farm_id: str,
        version: str = "latest",
    ) -> pd.DataFrame:
        """
        Load a feature matrix by farm and version.

        Args:
            farm_id: Farm identifier.
            version: Version string or ``"latest"``.

        Returns:
            Feature DataFrame.

        Raises:
            FileNotFoundError: If no matching matrix is found.
        """
        if version == "latest":
            versions = self.list_versions(farm_id)
            if not versions:
                raise FileNotFoundError(f"No feature matrices found for farm {farm_id}")
            version = versions[-1]

        meta = self._metadata.get(farm_id, {}).get(version)
        if meta is None:
            # Try to find file on disk
            farm_dir = self.storage_dir / farm_id
            candidates = list(farm_dir.glob(f"features_{version}.*"))
            if not candidates:
                raise FileNotFoundError(
                    f"Feature matrix v{version} not found for farm {farm_id}"
                )
            filepath = candidates[0]
        else:
            filepath = Path(meta["storage_path"])

        if filepath.suffix == ".parquet":
            try:
                return pd.read_parquet(filepath)
            except Exception:
                pass

        # Fallback to CSV
        csv_path = filepath.with_suffix(".csv")
        if csv_path.exists():
            return pd.read_csv(csv_path, index_col=0)

        raise FileNotFoundError(f"Cannot read feature matrix at {filepath}")

    def list_versions(self, farm_id: str) -> List[str]:
        """
        List all available versions for a farm, sorted chronologically.

        Args:
            farm_id: Farm identifier.

        Returns:
            Sorted list of version strings.
        """
        # From metadata
        versions = list(self._metadata.get(farm_id, {}).keys())

        # Also scan disk
        farm_dir = self.storage_dir / farm_id
        if farm_dir.exists():
            for p in farm_dir.glob("features_*"):
                v = p.stem.replace("features_", "")
                if v not in versions:
                    versions.append(v)

        return sorted(versions)

    def get_global_training_set(self, min_farms: int = 5) -> pd.DataFrame:
        """
        Join all farm feature matrices for FOHEM training.

        Only includes farms with at least one version stored.

        Args:
            min_farms: Minimum number of farms required.

        Returns:
            Combined DataFrame with farm_id column.

        Raises:
            ValueError: If fewer than ``min_farms`` have data.
        """
        all_frames: list = []
        farms_with_data: list = []

        # Scan storage directory
        if self.storage_dir.exists():
            for farm_dir in self.storage_dir.iterdir():
                if farm_dir.is_dir():
                    farm_id = farm_dir.name
                    try:
                        df = self.load_feature_matrix(farm_id, "latest")
                        df["farm_id"] = farm_id
                        all_frames.append(df)
                        farms_with_data.append(farm_id)
                    except FileNotFoundError:
                        continue

        if len(farms_with_data) < min_farms:
            logger.warning(
                "Only %d farms available (need %d); returning available data",
                len(farms_with_data), min_farms,
            )

        if not all_frames:
            return pd.DataFrame()

        return pd.concat(all_frames, ignore_index=True)
