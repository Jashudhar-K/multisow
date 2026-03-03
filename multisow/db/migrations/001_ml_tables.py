"""add ML tables

Revision ID: 001_ml_tables
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = "001_ml_tables"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "strata_layer_records",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("farm_id", sa.String(), index=True, nullable=False),
        sa.Column("layer", sa.String(), nullable=False),
        sa.Column("crop_species", sa.String(), nullable=True),
        sa.Column("LAI", sa.Float(), nullable=True),
        sa.Column("k_coeff", sa.Float(), nullable=True),
        sa.Column("row_spacing_m", sa.Float(), nullable=True),
        sa.Column("soil_N", sa.Float(), nullable=True),
        sa.Column("soil_P", sa.Float(), nullable=True),
        sa.Column("soil_K", sa.Float(), nullable=True),
        sa.Column("soil_pH", sa.Float(), nullable=True),
        sa.Column("VWC", sa.Float(), nullable=True),
        sa.Column("GDD", sa.Float(), nullable=True),
        sa.Column("rainfall_7d", sa.Float(), nullable=True),
        sa.Column("solar_elevation_deg", sa.Float(), nullable=True),
        sa.Column("root_depth_cm", sa.Float(), nullable=True),
        sa.Column("root_radius_cm", sa.Float(), nullable=True),
        sa.Column("canopy_height_m", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "sensor_readings",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("farm_id", sa.String(), index=True, nullable=False),
        sa.Column("sensor_type", sa.String(), nullable=False),
        sa.Column("value", sa.Float(), nullable=False),
        sa.Column("unit", sa.String(), nullable=True),
        sa.Column("timestamp", sa.DateTime(), index=True, nullable=True),
        sa.Column("metadata_json", sa.Text(), nullable=True),
    )

    op.create_table(
        "ml_predictions",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("prediction_id", sa.String(), unique=True, index=True, nullable=False),
        sa.Column("farm_id", sa.String(), index=True, nullable=False),
        sa.Column("layer", sa.String(), nullable=False),
        sa.Column("predicted_yield", sa.Float(), nullable=False),
        sa.Column("ci_low", sa.Float(), nullable=True),
        sa.Column("ci_high", sa.Float(), nullable=True),
        sa.Column("system_LER", sa.Float(), nullable=True),
        sa.Column("model_version", sa.String(), nullable=True),
        sa.Column("input_features_json", sa.Text(), nullable=True),
        sa.Column("shap_json", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), index=True, nullable=True),
    )

    op.create_table(
        "feature_matrix_versions",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("farm_id", sa.String(), index=True, nullable=False),
        sa.Column("version", sa.String(), nullable=False),
        sa.Column("n_rows", sa.Integer(), nullable=True),
        sa.Column("n_cols", sa.Integer(), nullable=True),
        sa.Column("file_path", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("feature_matrix_versions")
    op.drop_table("ml_predictions")
    op.drop_table("sensor_readings")
    op.drop_table("strata_layer_records")
