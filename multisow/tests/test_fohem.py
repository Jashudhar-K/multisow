"""
Tests for the FOHEM model pipeline: FIS, ensemble sub-models,
GA optimizers, and the unified FOHEM/FOHEMSystem wrapper.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

FIXTURES_DIR = Path(__file__).parent / "fixtures"


@pytest.fixture
def synthetic_data() -> pd.DataFrame:
    """Load the synthetic intercropping dataset."""
    csv_path = FIXTURES_DIR / "synthetic_intercrop_data.csv"
    assert csv_path.exists(), f"Run generate_synthetic_data.py first: {csv_path}"
    return pd.read_csv(csv_path)


@pytest.fixture
def canopy_data(synthetic_data: pd.DataFrame):
    """Canopy-layer subset with features + target."""
    df = synthetic_data[synthetic_data["layer"] == "canopy"].copy()
    feature_cols = [
        "LAI", "k_coeff", "row_spacing_m", "soil_N", "soil_P", "soil_K",
        "soil_pH", "VWC", "GDD", "rainfall_7d", "solar_elevation_deg",
        "root_depth_cm", "root_radius_cm", "canopy_height_m", "path_width_m",
        "crop_density", "shade_fraction",
    ]
    X = df[feature_cols].values
    y = df["yield_t_ha"].values
    return X, y, feature_cols


# -----------------------------------------------------------------------
# Beer-Lambert physics
# -----------------------------------------------------------------------


class TestBeersLaw:
    def test_single_layer(self):
        from multisow.ml.utils.beers_law import (
            BeersLawParams,
            calculate_light_interception,
        )

        params = BeersLawParams(
            I_0=1800.0, k=0.5, LAI=4.0, canopy_height=15.0,
            row_spacing=8.0, path_width=3.0, solar_elevation_deg=55.0,
        )
        result = calculate_light_interception(params)
        assert 0.0 < result.I_z < 1800.0
        assert 0.0 < result.f_intercepted < 1.0
        assert 0.0 < result.f_transmitted < 1.0

    def test_multi_layer_cascade(self):
        from multisow.ml.utils.beers_law import (
            BeersLawParams,
            calculate_multi_layer_PAR,
        )

        layers = [
            BeersLawParams(I_0=1800, k=0.5, LAI=5.0, canopy_height=20, row_spacing=8.0, path_width=3.0, solar_elevation_deg=55.0),
            BeersLawParams(I_0=1800, k=0.45, LAI=3.0, canopy_height=6, row_spacing=4.0, path_width=2.0, solar_elevation_deg=55.0),
            BeersLawParams(I_0=1800, k=0.35, LAI=2.0, canopy_height=0.8, row_spacing=2.0, path_width=1.5, solar_elevation_deg=55.0),
        ]
        results = calculate_multi_layer_PAR(layers)
        assert len(results) == 3
        # PAR decreases down through layers
        assert results[0].I_z >= results[1].I_z >= results[2].I_z


# -----------------------------------------------------------------------
# Root architecture
# -----------------------------------------------------------------------


class TestRootArchitecture:
    def test_overlap_index(self):
        from multisow.ml.utils.root_architecture import (
            RootParams,
            calculate_root_overlap_index,
        )

        from multisow.ml.schemas.strata import StrataLayer

        a = RootParams("Coconut", rooting_depth_cm=200, lateral_radius_cm=150, root_length_density=2.0, layer=StrataLayer.CANOPY)
        b = RootParams("Banana", rooting_depth_cm=80, lateral_radius_cm=60, root_length_density=4.0, layer=StrataLayer.MIDDLE)
        roi = calculate_root_overlap_index(a, b, horizontal_distance_cm=100)
        assert 0.0 <= roi <= 1.0

    def test_nutrient_competition(self):
        from multisow.ml.utils.root_architecture import (
            calculate_nutrient_competition_score,
        )

        score = calculate_nutrient_competition_score(
            roi=0.5, soil_N=100, soil_P=20, soil_K=2.0
        )
        assert "overall_score" in score
        assert 0.0 <= score["overall_score"] <= 1.0


# -----------------------------------------------------------------------
# Climate features
# -----------------------------------------------------------------------


class TestClimateFeatures:
    def test_GDD(self):
        from multisow.ml.utils.climate_features import compute_GDD

        t_max = pd.Series([32.0, 34.0, 30.0, 35.0, 33.0])
        t_min = pd.Series([22.0, 24.0, 20.0, 25.0, 23.0])
        gdd = compute_GDD(t_max, t_min, t_base=10.0)
        assert len(gdd) == 5
        assert all(g >= 0 for g in gdd)
        assert gdd.iloc[-1] >= gdd.iloc[0]  # cumulative

    def test_ETo(self):
        from multisow.ml.utils.climate_features import compute_ETo_penman_monteith

        eto = compute_ETo_penman_monteith(
            tmax=33.0, tmin=23.0, rh=75.0, wind_speed=1.5, ghi=18.0, elevation=100.0
        )
        assert 2.0 < eto < 10.0  # typical tropical range


# -----------------------------------------------------------------------
# Fuzzy Inference System
# -----------------------------------------------------------------------


class TestFIS:
    def test_infer_single(self):
        from multisow.ml.models.fuzzy_inference import StratifiedFuzzyInferenceSystem

        fis = StratifiedFuzzyInferenceSystem()
        result = fis.infer({
            "LAI": 5.0,
            "soil_N": 120.0,
            "VWC": 0.30,
            "root_overlap_index": 0.4,
            "shade_fraction": 0.3,
            "soil_pH": 5.8,
            "k_coeff": 0.5,
            "row_spacing_m": 3.0,
            "GDD": 2000,
            "rainfall_7d": 80,
            "solar_elevation_deg": 55,
            "crop_density": 0.6,
        })
        assert "canopy_light_competition" in result
        assert "nutrient_competition" in result
        assert "water_stress" in result
        assert "aggregate_stress_score" in result
        assert 0.0 <= result["aggregate_stress_score"] <= 1.0

    def test_infer_batch(self):
        from multisow.ml.models.fuzzy_inference import StratifiedFuzzyInferenceSystem

        fis = StratifiedFuzzyInferenceSystem()
        df = pd.DataFrame({
            "LAI": [3.0, 6.0],
            "soil_N": [80, 180],
            "VWC": [0.20, 0.40],
            "root_overlap_index": [0.2, 0.7],
            "shade_fraction": [0.1, 0.6],
            "soil_pH": [5.5, 6.5],
            "k_coeff": [0.4, 0.6],
            "row_spacing_m": [2.0, 8.0],
            "GDD": [1000, 3000],
            "rainfall_7d": [30, 150],
            "solar_elevation_deg": [35, 70],
            "crop_density": [0.4, 0.8],
        })
        result = fis.infer_batch(df)
        assert len(result) == 2
        assert "aggregate_stress_score" in result.columns


# -----------------------------------------------------------------------
# Ensemble sub-models
# -----------------------------------------------------------------------


class TestEnsembleModels:
    def test_random_forest(self, canopy_data):
        from multisow.ml.models.ensemble_models import RandomForestSubModel

        X, y, feat_names = canopy_data
        rf = RandomForestSubModel()
        rf.fit(X, y)
        preds = rf.predict(X[:5])
        assert len(preds) == 5
        assert all(p > 0 for p in preds)

        imp = rf.get_feature_importance()
        assert len(imp) > 0

    def test_catboost_or_fallback(self, canopy_data):
        from multisow.ml.models.ensemble_models import CatBoostSubModel

        X, y, _ = canopy_data
        cb = CatBoostSubModel()
        cb.fit(X, y)
        preds = cb.predict(X[:5])
        assert len(preds) == 5

    def test_elm(self, canopy_data):
        from multisow.ml.models.ensemble_models import ELMSubModel

        X, y, _ = canopy_data
        elm = ELMSubModel()
        elm.fit(X, y)
        preds = elm.predict(X[:5])
        assert len(preds) == 5


# -----------------------------------------------------------------------
# GA optimizers
# -----------------------------------------------------------------------


class TestGAOptimizers:
    def test_feature_selector(self, canopy_data):
        from multisow.ml.models.genetic_optimizer import GAFeatureSelector
        from multisow.ml.models.ensemble_models import RandomForestSubModel

        X, y, feat_names = canopy_data
        df = pd.DataFrame(X, columns=feat_names)
        selector = GAFeatureSelector(population_size=10, n_generations=5)
        base_model = RandomForestSubModel()
        selected_features, best_r2 = selector.evolve(df, pd.Series(y), base_model)
        assert isinstance(selected_features, list)
        assert len(selected_features) <= len(feat_names)

    def test_weight_optimizer(self):
        from multisow.ml.models.genetic_optimizer import GAWeightOptimizer

        rng = np.random.default_rng(0)
        y_true = rng.uniform(3, 15, 100)
        fis_preds = y_true + rng.normal(0, 1, 100)
        rf_preds = y_true + rng.normal(0, 1.5, 100)
        cb_preds = y_true + rng.normal(0, 2, 100)
        elm_preds = y_true + rng.normal(0, 0.8, 100)

        opt = GAWeightOptimizer(population_size=10, n_generations=5)
        weights, best_mae = opt.optimize(fis_preds, rf_preds, cb_preds, elm_preds, y_true)
        assert len(weights) == 4
        assert abs(sum(weights) - 1.0) < 0.01


# -----------------------------------------------------------------------
# FOHEM end-to-end
# -----------------------------------------------------------------------


class TestFOHEM:
    def test_fit_predict(self, canopy_data):
        from multisow.ml.models.fohem import FOHEM
        from multisow.ml.schemas.strata import StrataLayer

        X, y, feat_names = canopy_data
        n = len(X)
        split = int(n * 0.7)
        X_train_df = pd.DataFrame(X[:split], columns=feat_names)
        y_train_s = pd.Series(y[:split])
        X_val_df = pd.DataFrame(X[split:], columns=feat_names)
        y_val_s = pd.Series(y[split:])

        model = FOHEM(layer=StrataLayer.CANOPY)
        model.fit(X_train_df, y_train_s, X_val_df, y_val_s)
        assert model.is_trained

        preds = model.predict(X_val_df.iloc[:5])
        assert len(preds) == 5
        assert all(p >= 0 for p in preds)

    def test_predict_with_confidence(self, canopy_data):
        from multisow.ml.models.fohem import FOHEM
        from multisow.ml.schemas.strata import StrataLayer

        X, y, feat_names = canopy_data
        n = len(X)
        split = int(n * 0.7)
        X_train_df = pd.DataFrame(X[:split], columns=feat_names)
        y_train_s = pd.Series(y[:split])
        X_val_df = pd.DataFrame(X[split:], columns=feat_names)
        y_val_s = pd.Series(y[split:])

        model = FOHEM(layer=StrataLayer.CANOPY)
        model.fit(X_train_df, y_train_s, X_val_df, y_val_s)

        result = model.predict_with_confidence(X_val_df.iloc[:3])
        pred = result["prediction"]
        ci_low = result["ci_80_low"]
        ci_high = result["ci_80_high"]
        assert len(pred) == 3
        assert all(ci_low[i] <= ci_high[i] for i in range(3))

    def test_fohem_system(self, synthetic_data):
        from multisow.ml.models.fohem import FOHEMSystem
        from multisow.ml.schemas.strata import StrataLayer

        system = FOHEMSystem()
        feature_cols = [
            "LAI", "k_coeff", "row_spacing_m", "soil_N", "soil_P", "soil_K",
            "soil_pH", "VWC", "GDD", "rainfall_7d", "solar_elevation_deg",
            "root_depth_cm", "root_radius_cm", "canopy_height_m", "path_width_m",
            "crop_density", "shade_fraction",
        ]
        target_col = "yield_t_ha"

        layer_map = {"canopy": StrataLayer.CANOPY, "middle": StrataLayer.MIDDLE, "understory": StrataLayer.UNDERSTORY}
        datasets = {}
        for layer_name, layer_enum in layer_map.items():
            df = synthetic_data[synthetic_data["layer"] == layer_name]
            X = pd.DataFrame(df[feature_cols].values, columns=feature_cols)
            y = pd.Series(df[target_col].values)
            n = len(X)
            split = int(n * 0.7)
            datasets[layer_enum] = (X.iloc[:split], y.iloc[:split], X.iloc[split:], y.iloc[split:])

        system.train_all_layers(datasets)
        assert system.is_any_trained()


# -----------------------------------------------------------------------
# Schemas validation
# -----------------------------------------------------------------------


class TestSchemas:
    def test_strata_input_validation(self):
        from multisow.ml.schemas.strata import StrataInput, LayerInput, StrataLayer

        layer = LayerInput(
            layer=StrataLayer.CANOPY,
            LAI=5.0,
            k_coeff=0.5,
            row_spacing_m=8.0,
            soil_N=120,
            soil_P=20,
            soil_K=2.5,
            soil_pH=5.8,
            VWC=0.3,
            GDD=2500,
            rainfall_7d=80,
            solar_elevation_deg=55,
            crop_species="Coconut",
            root_depth_cm=180,
            root_radius_cm=150,
        )
        inp = StrataInput(farm_id="test_001", layers=[layer])
        assert inp.farm_id == "test_001"
        assert len(inp.layers) == 1

    def test_sample_farm_json(self):
        json_path = FIXTURES_DIR / "sample_farm_data.json"
        assert json_path.exists()
        with open(json_path) as f:
            data = json.load(f)
        assert len(data) == 3
        for farm in data:
            assert "farm_id" in farm
            assert "layers" in farm
            assert len(farm["layers"]) >= 2
