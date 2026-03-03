"""
Stratified Fuzzy Inference System (FIS) for intercropping stress assessment.

Implements a Mamdani FIS with 12 input universes, 3 output universes,
and 28 expert rules covering canopy light competition, nutrient
competition, and water stress.

Uses scikit-fuzzy for membership functions and rule evaluation.
Falls back to a simplified parametric model if skfuzzy is unavailable.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

# Try to import skfuzzy; set flag for fallback
try:
    import skfuzzy as fuzz
    from skfuzzy import control as ctrl

    HAS_SKFUZZY = True
except ImportError:
    HAS_SKFUZZY = False
    logger.warning("scikit-fuzzy not installed; FIS will use parametric fallback")


class StratifiedFuzzyInferenceSystem:
    """
    Mamdani Fuzzy Inference System for multi-tier intercropping stress scoring.

    Input universes (12):
      LAI, soil_N, VWC, root_overlap, shade_fraction, soil_pH,
      k_coeff, row_spacing, GDD, rainfall_7d, solar_elevation, crop_density

    Output universes (3):
      canopy_light_competition, nutrient_competition, water_stress

    28 expert rules encode agronomic domain knowledge.
    """

    def __init__(self) -> None:
        """Build the FIS, or prepare the parametric fallback."""
        self._built = False
        self._simulation: Any = None

        if HAS_SKFUZZY:
            try:
                self._build_fis()
                self._built = True
            except Exception as exc:
                logger.warning("FIS build failed (%s); using parametric fallback", exc)

    # ------------------------------------------------------------------
    # FIS construction
    # ------------------------------------------------------------------

    def _build_fis(self) -> None:
        """Construct antecedents, consequents, membership functions, and rules."""
        # --- Antecedents (inputs) ---
        self.LAI = ctrl.Antecedent(np.linspace(0, 8, 200), "LAI")
        self.soil_N = ctrl.Antecedent(np.linspace(0, 200, 200), "soil_N")
        self.VWC = ctrl.Antecedent(np.linspace(0.05, 0.45, 200), "VWC")
        self.root_overlap = ctrl.Antecedent(np.linspace(0, 1, 200), "root_overlap")
        self.shade_fraction = ctrl.Antecedent(np.linspace(0, 1, 200), "shade_fraction")
        self.soil_pH = ctrl.Antecedent(np.linspace(4, 9, 200), "soil_pH")
        self.k_coeff = ctrl.Antecedent(np.linspace(0.3, 0.7, 200), "k_coeff")
        self.row_spacing = ctrl.Antecedent(np.linspace(0.5, 6, 200), "row_spacing")
        self.GDD = ctrl.Antecedent(np.linspace(0, 3000, 200), "GDD")
        self.rainfall_7d = ctrl.Antecedent(np.linspace(0, 200, 200), "rainfall_7d")
        self.solar_elevation = ctrl.Antecedent(np.linspace(10, 80, 200), "solar_elevation")
        self.crop_density = ctrl.Antecedent(np.linspace(0, 1, 200), "crop_density")

        # --- Consequents (outputs) ---
        self.canopy_light_comp = ctrl.Consequent(
            np.linspace(0, 10, 200), "canopy_light_competition"
        )
        self.nutrient_comp = ctrl.Consequent(
            np.linspace(0, 10, 200), "nutrient_competition"
        )
        self.water_stress = ctrl.Consequent(
            np.linspace(0, 10, 200), "water_stress"
        )

        # --- Membership functions ---
        self._define_memberships()

        # --- Rules ---
        rules = self._define_rules()

        # --- Control system ---
        self._ctrl = ctrl.ControlSystem(rules)
        self._simulation = ctrl.ControlSystemSimulation(self._ctrl)

    def _define_memberships(self) -> None:
        """Define all membership functions for inputs and outputs."""
        # LAI: LOW, MED, HIGH
        self.LAI["LOW"] = fuzz.trimf(self.LAI.universe, [0, 0, 2.5])
        self.LAI["MED"] = fuzz.trimf(self.LAI.universe, [1.5, 4, 6.5])
        self.LAI["HIGH"] = fuzz.trimf(self.LAI.universe, [5, 8, 8])

        # soil_N: LOW, MED, HIGH (trapezoidal)
        self.soil_N["LOW"] = fuzz.trapmf(self.soil_N.universe, [0, 0, 40, 80])
        self.soil_N["MED"] = fuzz.trapmf(self.soil_N.universe, [50, 80, 120, 150])
        self.soil_N["HIGH"] = fuzz.trapmf(self.soil_N.universe, [120, 160, 200, 200])

        # VWC: DRY, MOIST, WET
        self.VWC["DRY"] = fuzz.trimf(self.VWC.universe, [0.05, 0.05, 0.15])
        self.VWC["MOIST"] = fuzz.trimf(self.VWC.universe, [0.10, 0.25, 0.35])
        self.VWC["WET"] = fuzz.trimf(self.VWC.universe, [0.30, 0.45, 0.45])

        # root_overlap: LOW, MED, HIGH
        self.root_overlap["LOW"] = fuzz.trimf(self.root_overlap.universe, [0, 0, 0.35])
        self.root_overlap["MED"] = fuzz.trimf(self.root_overlap.universe, [0.2, 0.5, 0.8])
        self.root_overlap["HIGH"] = fuzz.trimf(self.root_overlap.universe, [0.65, 1, 1])

        # shade_fraction: LOW, MED, HIGH
        self.shade_fraction["LOW"] = fuzz.trimf(self.shade_fraction.universe, [0, 0, 0.35])
        self.shade_fraction["MED"] = fuzz.trimf(self.shade_fraction.universe, [0.2, 0.5, 0.8])
        self.shade_fraction["HIGH"] = fuzz.trimf(self.shade_fraction.universe, [0.65, 1, 1])

        # soil_pH: ACIDIC, OPTIMAL, ALKALINE
        self.soil_pH["ACIDIC"] = fuzz.trimf(self.soil_pH.universe, [4, 4, 5.5])
        self.soil_pH["OPTIMAL"] = fuzz.trimf(self.soil_pH.universe, [5.0, 6.5, 7.5])
        self.soil_pH["ALKALINE"] = fuzz.trimf(self.soil_pH.universe, [7.0, 9, 9])

        # k_coeff: LOW, MED, HIGH
        self.k_coeff["LOW"] = fuzz.trimf(self.k_coeff.universe, [0.3, 0.3, 0.45])
        self.k_coeff["MED"] = fuzz.trimf(self.k_coeff.universe, [0.38, 0.5, 0.62])
        self.k_coeff["HIGH"] = fuzz.trimf(self.k_coeff.universe, [0.55, 0.7, 0.7])

        # row_spacing: NARROW, WIDE
        self.row_spacing["NARROW"] = fuzz.trimf(self.row_spacing.universe, [0.5, 0.5, 3])
        self.row_spacing["WIDE"] = fuzz.trimf(self.row_spacing.universe, [2.5, 6, 6])

        # GDD: LOW, MED, HIGH
        self.GDD["LOW"] = fuzz.trimf(self.GDD.universe, [0, 0, 1000])
        self.GDD["MED"] = fuzz.trimf(self.GDD.universe, [600, 1500, 2400])
        self.GDD["HIGH"] = fuzz.trimf(self.GDD.universe, [2000, 3000, 3000])

        # rainfall_7d: LOW, MED, HIGH
        self.rainfall_7d["LOW"] = fuzz.trimf(self.rainfall_7d.universe, [0, 0, 50])
        self.rainfall_7d["MED"] = fuzz.trimf(self.rainfall_7d.universe, [30, 100, 150])
        self.rainfall_7d["HIGH"] = fuzz.trimf(self.rainfall_7d.universe, [120, 200, 200])

        # solar_elevation: LOW, MED, HIGH
        self.solar_elevation["LOW"] = fuzz.trimf(self.solar_elevation.universe, [10, 10, 35])
        self.solar_elevation["MED"] = fuzz.trimf(self.solar_elevation.universe, [25, 45, 65])
        self.solar_elevation["HIGH"] = fuzz.trimf(self.solar_elevation.universe, [55, 80, 80])

        # crop_density: SPARSE, OPTIMAL, DENSE
        self.crop_density["SPARSE"] = fuzz.trimf(self.crop_density.universe, [0, 0, 0.35])
        self.crop_density["OPTIMAL"] = fuzz.trimf(self.crop_density.universe, [0.25, 0.5, 0.75])
        self.crop_density["DENSE"] = fuzz.trimf(self.crop_density.universe, [0.65, 1, 1])

        # --- Output membership functions ---
        for output in [self.canopy_light_comp, self.nutrient_comp, self.water_stress]:
            output["LOW"] = fuzz.trimf(output.universe, [0, 0, 4])
            output["MODERATE"] = fuzz.trimf(output.universe, [2.5, 5, 7.5])
            if output.label == "water_stress":
                output["HIGH"] = fuzz.trimf(output.universe, [6, 10, 10])
            else:
                output["SEVERE"] = fuzz.trimf(output.universe, [6, 10, 10])

    def _define_rules(self) -> List:
        """Define all 28 fuzzy rules."""
        rules = []

        # --- Canopy light competition rules ---
        # R1: IF LAI is HIGH AND k_coeff is HIGH THEN canopy_light_competition is SEVERE
        rules.append(ctrl.Rule(
            self.LAI["HIGH"] & self.k_coeff["HIGH"],
            self.canopy_light_comp["SEVERE"],
        ))
        # R2: IF LAI is MEDIUM AND solar_elevation is LOW THEN canopy_light_competition is MODERATE
        rules.append(ctrl.Rule(
            self.LAI["MED"] & self.solar_elevation["LOW"],
            self.canopy_light_comp["MODERATE"],
        ))
        # R3: IF row_spacing is WIDE AND LAI is LOW THEN canopy_light_competition is LOW
        rules.append(ctrl.Rule(
            self.row_spacing["WIDE"] & self.LAI["LOW"],
            self.canopy_light_comp["LOW"],
        ))
        # R4: IF shade_fraction is HIGH AND k_coeff is HIGH THEN canopy_light_competition is SEVERE
        rules.append(ctrl.Rule(
            self.shade_fraction["HIGH"] & self.k_coeff["HIGH"],
            self.canopy_light_comp["SEVERE"],
        ))
        # R5: IF LAI is LOW AND solar_elevation is HIGH THEN canopy_light_competition is LOW
        rules.append(ctrl.Rule(
            self.LAI["LOW"] & self.solar_elevation["HIGH"],
            self.canopy_light_comp["LOW"],
        ))
        # R6: IF LAI is HIGH AND row_spacing is NARROW THEN canopy_light_competition is SEVERE
        rules.append(ctrl.Rule(
            self.LAI["HIGH"] & self.row_spacing["NARROW"],
            self.canopy_light_comp["SEVERE"],
        ))
        # R7: IF LAI is MEDIUM AND row_spacing is WIDE THEN canopy_light_competition is LOW
        rules.append(ctrl.Rule(
            self.LAI["MED"] & self.row_spacing["WIDE"],
            self.canopy_light_comp["LOW"],
        ))
        # R8: IF shade_fraction is MED AND LAI is MED THEN canopy_light_competition is MODERATE
        rules.append(ctrl.Rule(
            self.shade_fraction["MED"] & self.LAI["MED"],
            self.canopy_light_comp["MODERATE"],
        ))

        # --- Nutrient competition rules ---
        # R9: IF root_overlap is HIGH AND soil_N is LOW THEN nutrient_competition is SEVERE
        rules.append(ctrl.Rule(
            self.root_overlap["HIGH"] & self.soil_N["LOW"],
            self.nutrient_comp["SEVERE"],
        ))
        # R10: IF root_overlap is LOW AND soil_N is HIGH THEN nutrient_competition is LOW
        rules.append(ctrl.Rule(
            self.root_overlap["LOW"] & self.soil_N["HIGH"],
            self.nutrient_comp["LOW"],
        ))
        # R11: IF soil_pH is OPTIMAL AND soil_N is MED THEN nutrient_competition is MODERATE
        rules.append(ctrl.Rule(
            self.soil_pH["OPTIMAL"] & self.soil_N["MED"],
            self.nutrient_comp["MODERATE"],
        ))
        # R12: IF root_overlap is HIGH AND soil_pH is ACIDIC THEN nutrient_competition is SEVERE
        rules.append(ctrl.Rule(
            self.root_overlap["HIGH"] & self.soil_pH["ACIDIC"],
            self.nutrient_comp["SEVERE"],
        ))
        # R13: IF root_overlap is MED AND soil_N is MED THEN nutrient_competition is MODERATE
        rules.append(ctrl.Rule(
            self.root_overlap["MED"] & self.soil_N["MED"],
            self.nutrient_comp["MODERATE"],
        ))
        # R14: IF root_overlap is LOW AND soil_N is LOW THEN nutrient_competition is MODERATE
        rules.append(ctrl.Rule(
            self.root_overlap["LOW"] & self.soil_N["LOW"],
            self.nutrient_comp["MODERATE"],
        ))
        # R15: IF soil_pH is ALKALINE AND soil_N is LOW THEN nutrient_competition is SEVERE
        rules.append(ctrl.Rule(
            self.soil_pH["ALKALINE"] & self.soil_N["LOW"],
            self.nutrient_comp["SEVERE"],
        ))
        # R16: IF root_overlap is HIGH AND soil_N is HIGH THEN nutrient_competition is MODERATE
        rules.append(ctrl.Rule(
            self.root_overlap["HIGH"] & self.soil_N["HIGH"],
            self.nutrient_comp["MODERATE"],
        ))

        # --- Water stress rules ---
        # R17: IF VWC is DRY AND GDD is HIGH THEN water_stress is HIGH
        rules.append(ctrl.Rule(
            self.VWC["DRY"] & self.GDD["HIGH"],
            self.water_stress["HIGH"],
        ))
        # R18: IF VWC is WET AND rainfall_7d is HIGH THEN water_stress is LOW
        rules.append(ctrl.Rule(
            self.VWC["WET"] & self.rainfall_7d["HIGH"],
            self.water_stress["LOW"],
        ))
        # R19: IF VWC is MOIST AND GDD is MED THEN water_stress is LOW
        rules.append(ctrl.Rule(
            self.VWC["MOIST"] & self.GDD["MED"],
            self.water_stress["LOW"],
        ))
        # R20: IF VWC is DRY AND solar_elevation is HIGH THEN water_stress is HIGH
        rules.append(ctrl.Rule(
            self.VWC["DRY"] & self.solar_elevation["HIGH"],
            self.water_stress["HIGH"],
        ))
        # R21: IF VWC is DRY AND root_overlap is HIGH THEN water_stress is HIGH
        rules.append(ctrl.Rule(
            self.VWC["DRY"] & self.root_overlap["HIGH"],
            self.water_stress["HIGH"],
        ))
        # R22: IF VWC is MOIST AND root_overlap is MED THEN water_stress is LOW
        rules.append(ctrl.Rule(
            self.VWC["MOIST"] & self.root_overlap["MED"],
            self.water_stress["LOW"],
        ))
        # R23: IF rainfall_7d is HIGH AND VWC is MOIST THEN water_stress is LOW
        rules.append(ctrl.Rule(
            self.rainfall_7d["HIGH"] & self.VWC["MOIST"],
            self.water_stress["LOW"],
        ))
        # R24: IF VWC is DRY AND rainfall_7d is LOW THEN water_stress is HIGH
        rules.append(ctrl.Rule(
            self.VWC["DRY"] & self.rainfall_7d["LOW"],
            self.water_stress["HIGH"],
        ))

        # --- Cross-factor rules ---
        # R25: IF LAI is HIGH AND VWC is DRY THEN water_stress is HIGH
        # (proxy for canopy_light_competition is SEVERE)
        rules.append(ctrl.Rule(
            self.LAI["HIGH"] & self.VWC["DRY"],
            self.water_stress["HIGH"],
        ))
        # R26: IF LAI is HIGH AND root_overlap is HIGH AND soil_N is LOW THEN nutrient_competition is SEVERE
        rules.append(ctrl.Rule(
            self.LAI["HIGH"] & self.root_overlap["HIGH"] & self.soil_N["LOW"],
            self.nutrient_comp["SEVERE"],
        ))
        # R27: IF shade_fraction is HIGH AND VWC is MOIST THEN water_stress is LOW
        rules.append(ctrl.Rule(
            self.shade_fraction["HIGH"] & self.VWC["MOIST"],
            self.water_stress["LOW"],
        ))
        # R28: IF crop_density is DENSE AND soil_N is LOW THEN nutrient_competition is SEVERE
        rules.append(ctrl.Rule(
            self.crop_density["DENSE"] & self.soil_N["LOW"],
            self.nutrient_comp["SEVERE"],
        ))

        return rules

    # ------------------------------------------------------------------
    # Inference
    # ------------------------------------------------------------------

    def _clamp_input(self, name: str, value: float, antecedent) -> float:
        """Clamp value to the antecedent's universe range."""
        lo, hi = antecedent.universe[0], antecedent.universe[-1]
        return max(lo, min(hi, value))

    def infer(self, inputs: Dict[str, float]) -> Dict[str, float]:
        """
        Perform fuzzy inference for a single observation.

        Args:
            inputs: Dictionary mapping input variable names to values.
                Required keys: LAI, soil_N, VWC, root_overlap, shade_fraction,
                soil_pH, k_coeff, row_spacing, GDD, rainfall_7d,
                solar_elevation, crop_density.

        Returns:
            Dict with ``canopy_light_competition``, ``nutrient_competition``,
            ``water_stress``, and ``aggregate_stress_score`` (weighted mean).
        """
        if self._built and self._simulation is not None:
            return self._infer_skfuzzy(inputs)
        return self._infer_parametric(inputs)

    def _infer_skfuzzy(self, inputs: Dict[str, float]) -> Dict[str, float]:
        """Run inference through scikit-fuzzy control system."""
        sim = self._simulation

        # Map input names to their antecedent objects
        antecedent_map = {
            "LAI": self.LAI,
            "soil_N": self.soil_N,
            "VWC": self.VWC,
            "root_overlap": self.root_overlap,
            "shade_fraction": self.shade_fraction,
            "soil_pH": self.soil_pH,
            "k_coeff": self.k_coeff,
            "row_spacing": self.row_spacing,
            "GDD": self.GDD,
            "rainfall_7d": self.rainfall_7d,
            "solar_elevation": self.solar_elevation,
            "crop_density": self.crop_density,
        }

        try:
            for key, ant in antecedent_map.items():
                val = inputs.get(key, 0.0)
                sim.input[key] = self._clamp_input(key, float(val), ant)

            sim.compute()

            clc = float(sim.output.get("canopy_light_competition", 5.0))
            nc = float(sim.output.get("nutrient_competition", 5.0))
            ws = float(sim.output.get("water_stress", 5.0))
        except Exception as exc:
            logger.debug("FIS compute error (%s); using parametric fallback", exc)
            return self._infer_parametric(inputs)

        agg = 0.4 * clc + 0.35 * nc + 0.25 * ws

        # Normalize to 0–1 range (FIS output domain is 0–10)
        return {
            "canopy_light_competition": round(clc / 10.0, 3),
            "nutrient_competition": round(nc / 10.0, 3),
            "water_stress": round(ws / 10.0, 3),
            "aggregate_stress_score": round(agg / 10.0, 3),
        }

    def _infer_parametric(self, inputs: Dict[str, float]) -> Dict[str, float]:
        """
        Simplified parametric fallback when scikit-fuzzy is unavailable.

        Uses linear scaling of input variables to approximate the FIS output.
        """
        LAI = float(inputs.get("LAI", 4.0))
        k = float(inputs.get("k_coeff", 0.5))
        soil_N = float(inputs.get("soil_N", 100.0))
        VWC = float(inputs.get("VWC", 0.25))
        root_overlap = float(inputs.get("root_overlap", 0.3))
        shade_fraction = float(inputs.get("shade_fraction", 0.3))
        GDD = float(inputs.get("GDD", 1500))
        rainfall_7d = float(inputs.get("rainfall_7d", 50))

        # Canopy light competition: scales with LAI and k
        clc = (LAI / 8.0) * 5 + (k / 0.7) * 3 + shade_fraction * 2
        clc = max(0, min(10, clc))

        # Nutrient competition: scales with root overlap and inversely with N
        nc = root_overlap * 5 + (1 - soil_N / 200) * 5
        nc = max(0, min(10, nc))

        # Water stress: scales inversely with VWC and positively with GDD
        ws = (1 - VWC / 0.45) * 5 + (GDD / 3000) * 3 - (rainfall_7d / 200) * 2
        ws = max(0, min(10, ws))

        agg = 0.4 * clc + 0.35 * nc + 0.25 * ws

        # Normalize to 0–1 range (individual scores are 0–10)
        return {
            "canopy_light_competition": round(clc / 10.0, 3),
            "nutrient_competition": round(nc / 10.0, 3),
            "water_stress": round(ws / 10.0, 3),
            "aggregate_stress_score": round(agg / 10.0, 3),
        }

    def infer_batch(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Apply fuzzy inference to every row in a DataFrame.

        The input DataFrame must have columns matching the FIS input names.
        Missing columns are filled with mid-range defaults.

        Args:
            df: Feature DataFrame.

        Returns:
            DataFrame with appended FIS output columns.
        """
        defaults = {
            "LAI": 4.0, "soil_N": 100.0, "VWC": 0.25,
            "root_overlap": 0.3, "shade_fraction": 0.3, "soil_pH": 6.5,
            "k_coeff": 0.5, "row_spacing": 3.0, "GDD": 1500,
            "rainfall_7d": 50, "solar_elevation": 45, "crop_density": 0.5,
        }

        # Map DataFrame columns to FIS input names
        col_map = {
            "root_overlap_index": "root_overlap",
            "row_spacing_m": "row_spacing",
            "solar_elevation_deg": "solar_elevation",
        }

        results = []
        for _, row in df.iterrows():
            inputs: Dict[str, float] = {}
            for key, default in defaults.items():
                # Try mapped name first, then direct
                mapped_col = None
                for df_col, fis_key in col_map.items():
                    if fis_key == key and df_col in row.index:
                        mapped_col = df_col
                        break
                if mapped_col and not pd.isna(row.get(mapped_col)):
                    inputs[key] = float(row[mapped_col])
                elif key in row.index and not pd.isna(row.get(key)):
                    inputs[key] = float(row[key])
                else:
                    inputs[key] = default
            results.append(self.infer(inputs))

        fis_df = pd.DataFrame(results, index=df.index)
        return fis_df
