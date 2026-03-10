from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


# =====================================================================
# Original models (unchanged)
# =====================================================================


class Stratum(Base):
    """
    Represents a vertical layer in the crop system (e.g., Overstory, Understory).
    """
    __tablename__ = "strata"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)

    crops = relationship("Crop", back_populates="stratum")


class Crop(Base):
    """
    Represents a crop type compatible with the system.
    """
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    stratum_id = Column(Integer, ForeignKey("strata.id"))
    light_requirement = Column(String)  # e.g., "High", "Medium", "Low"
    soil_type_compatibility = Column(JSON, nullable=True)   # e.g. ["laterite", "loamy"]
    intercrop_layer = Column(String, nullable=True)         # canopy / midstory / understory / groundcover
    spacing_m = Column(Float, nullable=True)                # recommended row/plant spacing in metres
    yield_t_ha = Column(Float, nullable=True)               # typical yield in tonnes per hectare
    created_at = Column(DateTime, default=datetime.utcnow)

    stratum = relationship("Stratum", back_populates="crops")
    plot_crops = relationship("PlotCrop", back_populates="crop")


class Plot(Base):
    """
    Represents a user-defined garden plot.
    """
    __tablename__ = "plots"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    plot_crops = relationship("PlotCrop", back_populates="plot")


class PlotCrop(Base):
    """
    Represents a specific instance of a crop placed in a plot.
    """
    __tablename__ = "plot_crops"

    id = Column(Integer, primary_key=True, index=True)
    plot_id = Column(Integer, ForeignKey("plots.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"))
    x_position = Column(Float)
    y_position = Column(Float)

    plot = relationship("Plot", back_populates="plot_crops")
    crop = relationship("Crop", back_populates="plot_crops")


# =====================================================================
# Phase 6 — ML-related tables
# =====================================================================


class StrataLayerRecord(Base):
    """
    Stores submitted strata layer parameters for audit / replay.
    """
    __tablename__ = "strata_layer_records"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(String, index=True, nullable=False)
    layer = Column(String, nullable=False)  # canopy / middle / understory / belowground
    crop_species = Column(String, nullable=True)
    LAI = Column(Float, nullable=True)
    k_coeff = Column(Float, nullable=True)
    row_spacing_m = Column(Float, nullable=True)
    soil_N = Column(Float, nullable=True)
    soil_P = Column(Float, nullable=True)
    soil_K = Column(Float, nullable=True)
    soil_pH = Column(Float, nullable=True)
    VWC = Column(Float, nullable=True)
    GDD = Column(Float, nullable=True)
    rainfall_7d = Column(Float, nullable=True)
    solar_elevation_deg = Column(Float, nullable=True)
    root_depth_cm = Column(Float, nullable=True)
    root_radius_cm = Column(Float, nullable=True)
    canopy_height_m = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class SensorReading(Base):
    """
    Fallback sensor storage when InfluxDB is not available.
    """
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(String, index=True, nullable=False)
    sensor_type = Column(String, nullable=False)  # temperature, humidity, soil_moisture, ...
    value = Column(Float, nullable=False)
    unit = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    metadata_json = Column(Text, nullable=True)


class MLPrediction(Base):
    """
    Stores every FOHEM prediction for audit, explanation lookup, and retraining.
    """
    __tablename__ = "ml_predictions"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(String, unique=True, index=True, nullable=False)
    farm_id = Column(String, index=True, nullable=False)
    layer = Column(String, nullable=False)
    predicted_yield = Column(Float, nullable=False)
    ci_low = Column(Float, nullable=True)
    ci_high = Column(Float, nullable=True)
    system_LER = Column(Float, nullable=True)
    model_version = Column(String, nullable=True)
    input_features_json = Column(Text, nullable=True)
    shap_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class FeatureMatrixVersion(Base):
    """
    Registry of feature matrix versions stored in the feature store.
    """
    __tablename__ = "feature_matrix_versions"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(String, index=True, nullable=False)
    version = Column(String, nullable=False)
    n_rows = Column(Integer, nullable=True)
    n_cols = Column(Integer, nullable=True)
    file_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
