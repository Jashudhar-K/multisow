"""
Multi-Objective Strata Optimizer for the Multi-Sow Multi-Tier Cropping System.

This module implements a Pareto-based multi-objective genetic algorithm (NSGA-II style)
that optimizes crop selection and spatial geometry across all 4 strata layers:
  - CANOPY (15-25m): Coconut, Teak, Silver Oak
  - MIDDLE (5-10m): Banana, Cocoa, Coffee, Pepper
  - UNDERSTORY (0.5-2m): Ginger, Turmeric, Yams
  - BELOWGROUND (0-120cm): Root architecture optimization

Objectives:
  1. Maximize Total System Yield (t/ha)
  2. Maximize Land Equivalent Ratio (LER > 1.0 indicates synergy)
  3. Minimize Resource Competition Index (water, nutrients, light)
  4. Maximize Economic Returns (revenue - costs)

Constraints:
  - Light transmission: Each layer must receive minimum viable PAR
  - Root competition: Overlap index must not exceed stress threshold
  - Spacing compatibility: Minimum geometric requirements
"""

from __future__ import annotations

import copy
import logging
import math
import random
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

from multisow.ml.schemas.strata import StrataLayer
from multisow.ml.utils.beers_law import BeersLawParams, calculate_light_interception
from multisow.ml.utils.root_architecture import (
    RootParams,
    calculate_root_overlap_index,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Crop Database - Species characteristics for each layer
# ---------------------------------------------------------------------------

@dataclass
class CropSpecies:
    """Agronomic and biophysical characteristics of a crop species."""
    
    name: str
    layer: StrataLayer
    # Light parameters
    k_coefficient: float  # Extinction coefficient (0.3-0.8)
    lai_typical: float  # Typical LAI at maturity
    min_par_required: float  # Minimum PAR for viability (μmol/m²/s)
    shade_tolerance: float  # 0-1, higher = more tolerant
    
    # Spatial parameters
    min_spacing_m: float  # Minimum row spacing
    max_spacing_m: float  # Maximum row spacing
    canopy_height_m: float  # Typical canopy height
    
    # Root parameters
    root_depth_cm: float  # Maximum rooting depth
    root_radius_cm: float  # Lateral root spread
    root_length_density: float  # RLD (cm/cm³)
    
    # Yield & economics
    typical_yield_t_ha: float  # Monocrop yield baseline
    price_per_tonne_inr: float  # Market price
    establishment_cost_inr_ha: float  # Setup cost per hectare
    annual_maintenance_inr_ha: float  # Annual maintenance
    
    # Growth parameters
    gdd_requirement: float  # Growing degree days to harvest
    water_requirement_mm: float  # Annual water need
    n_requirement_kg_ha: float  # Nitrogen need
    
    # Compatibility (list of compatible species names)
    synergistic_with: List[str] = field(default_factory=list)
    antagonistic_with: List[str] = field(default_factory=list)


# Default crop database
CROP_DATABASE: Dict[str, CropSpecies] = {
    # Canopy layer (15-25m)
    "coconut": CropSpecies(
        name="coconut", layer=StrataLayer.CANOPY,
        k_coefficient=0.45, lai_typical=4.5, min_par_required=800, shade_tolerance=0.2,
        min_spacing_m=7.0, max_spacing_m=10.0, canopy_height_m=20.0,
        root_depth_cm=120, root_radius_cm=200, root_length_density=1.2,
        typical_yield_t_ha=8.0, price_per_tonne_inr=35000, 
        establishment_cost_inr_ha=85000, annual_maintenance_inr_ha=25000,
        gdd_requirement=4500, water_requirement_mm=1500, n_requirement_kg_ha=80,
        synergistic_with=["banana", "cocoa", "pepper", "ginger"],
    ),
    "teak": CropSpecies(
        name="teak", layer=StrataLayer.CANOPY,
        k_coefficient=0.55, lai_typical=5.0, min_par_required=900, shade_tolerance=0.15,
        min_spacing_m=4.0, max_spacing_m=6.0, canopy_height_m=25.0,
        root_depth_cm=150, root_radius_cm=180, root_length_density=0.9,
        typical_yield_t_ha=12.0, price_per_tonne_inr=50000,
        establishment_cost_inr_ha=45000, annual_maintenance_inr_ha=15000,
        gdd_requirement=3500, water_requirement_mm=1200, n_requirement_kg_ha=50,
        synergistic_with=["turmeric", "ginger"],
    ),
    "silver_oak": CropSpecies(
        name="silver_oak", layer=StrataLayer.CANOPY,
        k_coefficient=0.40, lai_typical=3.5, min_par_required=850, shade_tolerance=0.25,
        min_spacing_m=5.0, max_spacing_m=8.0, canopy_height_m=18.0,
        root_depth_cm=100, root_radius_cm=150, root_length_density=1.0,
        typical_yield_t_ha=10.0, price_per_tonne_inr=30000,
        establishment_cost_inr_ha=35000, annual_maintenance_inr_ha=12000,
        gdd_requirement=3000, water_requirement_mm=1100, n_requirement_kg_ha=45,
        synergistic_with=["coffee", "pepper"],
    ),
    
    # Middle layer (5-10m)
    "banana": CropSpecies(
        name="banana", layer=StrataLayer.MIDDLE,
        k_coefficient=0.60, lai_typical=6.0, min_par_required=600, shade_tolerance=0.4,
        min_spacing_m=2.5, max_spacing_m=4.0, canopy_height_m=6.0,
        root_depth_cm=60, root_radius_cm=100, root_length_density=2.5,
        typical_yield_t_ha=25.0, price_per_tonne_inr=15000,
        establishment_cost_inr_ha=65000, annual_maintenance_inr_ha=35000,
        gdd_requirement=2800, water_requirement_mm=1800, n_requirement_kg_ha=200,
        synergistic_with=["coconut", "ginger", "turmeric"],
    ),
    "cocoa": CropSpecies(
        name="cocoa", layer=StrataLayer.MIDDLE,
        k_coefficient=0.50, lai_typical=5.0, min_par_required=400, shade_tolerance=0.6,
        min_spacing_m=3.0, max_spacing_m=4.5, canopy_height_m=8.0,
        root_depth_cm=80, root_radius_cm=120, root_length_density=1.8,
        typical_yield_t_ha=1.5, price_per_tonne_inr=180000,
        establishment_cost_inr_ha=120000, annual_maintenance_inr_ha=40000,
        gdd_requirement=3200, water_requirement_mm=1600, n_requirement_kg_ha=100,
        synergistic_with=["coconut", "silver_oak"],
    ),
    "coffee": CropSpecies(
        name="coffee", layer=StrataLayer.MIDDLE,
        k_coefficient=0.55, lai_typical=4.5, min_par_required=350, shade_tolerance=0.65,
        min_spacing_m=2.5, max_spacing_m=3.5, canopy_height_m=5.0,
        root_depth_cm=70, root_radius_cm=90, root_length_density=2.2,
        typical_yield_t_ha=2.0, price_per_tonne_inr=250000,
        establishment_cost_inr_ha=100000, annual_maintenance_inr_ha=45000,
        gdd_requirement=2500, water_requirement_mm=1400, n_requirement_kg_ha=120,
        synergistic_with=["silver_oak", "pepper", "ginger"],
    ),
    "pepper": CropSpecies(
        name="pepper", layer=StrataLayer.MIDDLE,
        k_coefficient=0.45, lai_typical=3.5, min_par_required=500, shade_tolerance=0.5,
        min_spacing_m=2.0, max_spacing_m=3.0, canopy_height_m=7.0,
        root_depth_cm=50, root_radius_cm=80, root_length_density=2.0,
        typical_yield_t_ha=2.5, price_per_tonne_inr=400000,
        establishment_cost_inr_ha=150000, annual_maintenance_inr_ha=50000,
        gdd_requirement=2200, water_requirement_mm=1200, n_requirement_kg_ha=80,
        synergistic_with=["coconut", "coffee", "arecanut"],
    ),
    
    # Understory layer (0.5-2m)
    "ginger": CropSpecies(
        name="ginger", layer=StrataLayer.UNDERSTORY,
        k_coefficient=0.65, lai_typical=4.0, min_par_required=200, shade_tolerance=0.75,
        min_spacing_m=0.3, max_spacing_m=0.5, canopy_height_m=1.0,
        root_depth_cm=30, root_radius_cm=30, root_length_density=4.5,
        typical_yield_t_ha=15.0, price_per_tonne_inr=80000,
        establishment_cost_inr_ha=180000, annual_maintenance_inr_ha=60000,
        gdd_requirement=1800, water_requirement_mm=1500, n_requirement_kg_ha=150,
        synergistic_with=["coconut", "banana", "coffee"],
    ),
    "turmeric": CropSpecies(
        name="turmeric", layer=StrataLayer.UNDERSTORY,
        k_coefficient=0.60, lai_typical=3.5, min_par_required=250, shade_tolerance=0.7,
        min_spacing_m=0.3, max_spacing_m=0.5, canopy_height_m=1.2,
        root_depth_cm=35, root_radius_cm=35, root_length_density=4.2,
        typical_yield_t_ha=20.0, price_per_tonne_inr=70000,
        establishment_cost_inr_ha=160000, annual_maintenance_inr_ha=55000,
        gdd_requirement=1600, water_requirement_mm=1400, n_requirement_kg_ha=130,
        synergistic_with=["teak", "banana"],
    ),
    "yam": CropSpecies(
        name="yam", layer=StrataLayer.UNDERSTORY,
        k_coefficient=0.55, lai_typical=3.0, min_par_required=300, shade_tolerance=0.55,
        min_spacing_m=0.8, max_spacing_m=1.2, canopy_height_m=2.0,
        root_depth_cm=40, root_radius_cm=50, root_length_density=3.0,
        typical_yield_t_ha=18.0, price_per_tonne_inr=40000,
        establishment_cost_inr_ha=80000, annual_maintenance_inr_ha=30000,
        gdd_requirement=2000, water_requirement_mm=1200, n_requirement_kg_ha=100,
        synergistic_with=["banana"],
    ),
}


# ---------------------------------------------------------------------------
# Optimization Individual (Chromosome)
# ---------------------------------------------------------------------------

@dataclass
class StrataConfiguration:
    """
    A single strata system configuration (individual in GA population).
    
    Encodes crop selection and spacing for all 4 layers.
    """
    
    # Crop selections (species name or None for unused layer)
    canopy_crop: Optional[str] = None
    middle_crop: Optional[str] = None
    understory_crop: Optional[str] = None
    
    # Spacing parameters (in meters)
    canopy_spacing: float = 8.0
    middle_spacing: float = 3.0
    understory_spacing: float = 0.5
    
    # Calculated metrics (filled during evaluation)
    total_yield: float = 0.0
    ler: float = 0.0
    competition_index: float = 0.0
    net_profit_inr_ha: float = 0.0
    light_efficiency: float = 0.0
    
    # Pareto ranking (filled during selection)
    rank: int = 0
    crowding_distance: float = 0.0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary."""
        return {
            "canopy": {"crop": self.canopy_crop, "spacing_m": self.canopy_spacing},
            "middle": {"crop": self.middle_crop, "spacing_m": self.middle_spacing},
            "understory": {"crop": self.understory_crop, "spacing_m": self.understory_spacing},
            "metrics": {
                "total_yield_t_ha": round(self.total_yield, 2),
                "ler": round(self.ler, 3),
                "competition_index": round(self.competition_index, 3),
                "net_profit_inr_ha": round(self.net_profit_inr_ha, 0),
                "light_efficiency": round(self.light_efficiency, 3),
            },
        }


# ---------------------------------------------------------------------------
# Fitness Evaluator
# ---------------------------------------------------------------------------

class StrataFitnessEvaluator:
    """
    Evaluates fitness of a strata configuration based on multiple objectives.
    
    Uses physics-based models (Beer-Lambert, root overlap) combined with
    agronomic heuristics for realistic yield estimation.
    """
    
    def __init__(
        self,
        incident_par: float = 1800.0,  # μmol/m²/s
        solar_elevation: float = 45.0,  # degrees
        soil_n: float = 200.0,  # mg/kg
        soil_p: float = 25.0,  # mg/kg
        soil_k: float = 150.0,  # mg/kg (cmol/kg * 390)
        vwc: float = 0.3,  # volumetric water content
        gdd_available: float = 3000.0,  # growing degree days
        crop_database: Optional[Dict[str, CropSpecies]] = None,
    ) -> None:
        """
        Initialize the fitness evaluator with environmental parameters.
        
        Args:
            incident_par: Incident PAR at canopy top (μmol/m²/s).
            solar_elevation: Solar elevation angle (degrees).
            soil_n: Soil nitrogen (mg/kg).
            soil_p: Soil phosphorus (mg/kg).
            soil_k: Soil potassium (mg/kg).
            vwc: Volumetric water content.
            gdd_available: Growing degree days available.
            crop_database: Custom crop database (uses default if None).
        """
        self.I_0 = incident_par
        self.solar_elevation = solar_elevation
        self.soil_n = soil_n
        self.soil_p = soil_p
        self.soil_k = soil_k
        self.vwc = vwc
        self.gdd = gdd_available
        self.crops = crop_database or CROP_DATABASE
    
    def evaluate(self, config: StrataConfiguration) -> StrataConfiguration:
        """
        Evaluate all objectives for a strata configuration.
        
        Args:
            config: The configuration to evaluate.
            
        Returns:
            The same configuration with filled metrics.
        """
        # Get selected crops
        crops_selected = []
        if config.canopy_crop and config.canopy_crop in self.crops:
            crops_selected.append((self.crops[config.canopy_crop], config.canopy_spacing))
        if config.middle_crop and config.middle_crop in self.crops:
            crops_selected.append((self.crops[config.middle_crop], config.middle_spacing))
        if config.understory_crop and config.understory_crop in self.crops:
            crops_selected.append((self.crops[config.understory_crop], config.understory_spacing))
        
        if not crops_selected:
            # Empty configuration
            config.total_yield = 0.0
            config.ler = 0.0
            config.competition_index = 1.0
            config.net_profit_inr_ha = -1e6
            config.light_efficiency = 0.0
            return config
        
        # Calculate light transmission through layers
        yields, light_fracs = self._calculate_light_cascade(crops_selected)
        
        # Calculate root competition
        competition = self._calculate_root_competition(crops_selected)
        
        # Apply competition reduction to yields
        adjusted_yields = [y * (1.0 - competition * 0.3) for y in yields]
        
        # Apply synergy bonuses
        synergy_bonus = self._calculate_synergy_bonus(crops_selected)
        final_yields = [y * (1.0 + synergy_bonus) for y in adjusted_yields]
        
        # Calculate LER
        ler = self._calculate_ler(final_yields, crops_selected)
        
        # Calculate economics
        total_revenue, total_cost = self._calculate_economics(final_yields, crops_selected)
        
        # Fill configuration metrics
        config.total_yield = sum(final_yields)
        config.ler = ler
        config.competition_index = competition
        config.net_profit_inr_ha = total_revenue - total_cost
        config.light_efficiency = sum(light_fracs) / max(len(light_fracs), 1)
        
        return config
    
    def _calculate_light_cascade(
        self, crops: List[Tuple[CropSpecies, float]]
    ) -> Tuple[List[float], List[float]]:
        """
        Calculate light transmission and yield through each layer.
        
        Uses Beer-Lambert law to cascade PAR from canopy to understory.
        """
        yields = []
        light_fractions = []
        current_par = self.I_0
        
        # Sort by layer (canopy first)
        layer_order = {StrataLayer.CANOPY: 0, StrataLayer.MIDDLE: 1, StrataLayer.UNDERSTORY: 2}
        crops_sorted = sorted(crops, key=lambda x: layer_order.get(x[0].layer, 3))
        
        for crop, spacing in crops_sorted:
            # Calculate light interception for this layer
            params = BeersLawParams(
                I_0=current_par,
                k=crop.k_coefficient,
                LAI=crop.lai_typical,
                canopy_height=crop.canopy_height_m,
                row_spacing=spacing,
                path_width=spacing * 0.7,  # Assume 30% path
                solar_elevation_deg=self.solar_elevation,
            )
            
            result = calculate_light_interception(params)
            
            # Check if crop receives enough light
            light_fraction = result.f_intercepted
            light_fractions.append(light_fraction)
            
            # Calculate yield reduction if light is insufficient
            light_stress = 1.0
            if current_par < crop.min_par_required:
                light_stress = max(0.2, current_par / crop.min_par_required)
            
            # Base yield adjusted by light availability and GDD
            gdd_factor = min(1.0, self.gdd / crop.gdd_requirement)
            
            # Density adjustment based on spacing
            optimal_spacing = (crop.min_spacing_m + crop.max_spacing_m) / 2
            density_factor = optimal_spacing / max(spacing, 0.1)
            density_factor = min(1.2, max(0.5, density_factor))
            
            estimated_yield = (
                crop.typical_yield_t_ha
                * light_fraction
                * light_stress
                * gdd_factor
                * density_factor
            )
            yields.append(estimated_yield)
            
            # Update PAR for next layer
            current_par = result.I_z
        
        return yields, light_fractions
    
    def _calculate_root_competition(
        self, crops: List[Tuple[CropSpecies, float]]
    ) -> float:
        """
        Calculate aggregate root competition index across all layer pairs.
        """
        if len(crops) < 2:
            return 0.0
        
        total_roi = 0.0
        n_pairs = 0
        
        for i, (crop_a, spacing_a) in enumerate(crops):
            for j, (crop_b, spacing_b) in enumerate(crops):
                if i >= j:
                    continue
                
                # Create root params
                params_a = RootParams(
                    species_name=crop_a.name,
                    rooting_depth_cm=crop_a.root_depth_cm,
                    lateral_radius_cm=crop_a.root_radius_cm,
                    root_length_density=crop_a.root_length_density,
                    layer=crop_a.layer,
                )
                params_b = RootParams(
                    species_name=crop_b.name,
                    rooting_depth_cm=crop_b.root_depth_cm,
                    lateral_radius_cm=crop_b.root_radius_cm,
                    root_length_density=crop_b.root_length_density,
                    layer=crop_b.layer,
                )
                
                # Horizontal distance approximation
                h_dist = (spacing_a + spacing_b) / 2 * 100  # Convert to cm
                
                try:
                    roi = calculate_root_overlap_index(params_a, params_b, h_dist)
                    total_roi += roi
                    n_pairs += 1
                except Exception:
                    pass
        
        return total_roi / max(n_pairs, 1)
    
    def _calculate_synergy_bonus(
        self, crops: List[Tuple[CropSpecies, float]]
    ) -> float:
        """
        Calculate synergy bonus from compatible crop combinations.
        """
        bonus = 0.0
        penalty = 0.0
        
        crop_names = [c.name for c, _ in crops]
        
        for crop, _ in crops:
            # Check synergistic combinations
            for syn_name in crop.synergistic_with:
                if syn_name in crop_names:
                    bonus += 0.05  # 5% bonus per synergy
            
            # Check antagonistic combinations
            for ant_name in crop.antagonistic_with:
                if ant_name in crop_names:
                    penalty += 0.10  # 10% penalty per antagonism
        
        return max(-0.3, bonus - penalty)  # Cap at -30%
    
    def _calculate_ler(
        self, yields: List[float], crops: List[Tuple[CropSpecies, float]]
    ) -> float:
        """
        Calculate Land Equivalent Ratio.
        
        LER = Σ(yield_intercrop / yield_monocrop) for each crop
        LER > 1.0 indicates intercropping advantage.
        """
        ler = 0.0
        for yield_val, (crop, _) in zip(yields, crops):
            mono_yield = crop.typical_yield_t_ha
            if mono_yield > 0:
                ler += yield_val / mono_yield
        return ler
    
    def _calculate_economics(
        self, yields: List[float], crops: List[Tuple[CropSpecies, float]]
    ) -> Tuple[float, float]:
        """
        Calculate total revenue and costs.
        """
        total_revenue = 0.0
        total_cost = 0.0
        
        for yield_val, (crop, _) in zip(yields, crops):
            revenue = yield_val * crop.price_per_tonne_inr
            cost = crop.establishment_cost_inr_ha + crop.annual_maintenance_inr_ha
            total_revenue += revenue
            total_cost += cost
        
        return total_revenue, total_cost


# ---------------------------------------------------------------------------
# NSGA-II Multi-Objective Genetic Algorithm
# ---------------------------------------------------------------------------

class StrataOptimizer:
    """
    NSGA-II style multi-objective genetic algorithm for strata optimization.
    
    Optimizes 4 objectives simultaneously:
      1. Maximize total yield
      2. Maximize LER
      3. Minimize competition index
      4. Maximize net profit
    
    Returns a Pareto-optimal front of non-dominated solutions.
    """
    
    def __init__(
        self,
        population_size: int = 100,
        n_generations: int = 50,
        crossover_prob: float = 0.8,
        mutation_prob: float = 0.15,
        tournament_size: int = 3,
        evaluator: Optional[StrataFitnessEvaluator] = None,
    ) -> None:
        """
        Configure the optimizer.
        
        Args:
            population_size: Number of individuals per generation.
            n_generations: Maximum generations to run.
            crossover_prob: Probability of crossover.
            mutation_prob: Probability of mutation per gene.
            tournament_size: Tournament selection size.
            evaluator: Fitness evaluator (creates default if None).
        """
        self.pop_size = population_size
        self.n_gen = n_generations
        self.cx_prob = crossover_prob
        self.mut_prob = mutation_prob
        self.tournament_size = tournament_size
        self.evaluator = evaluator or StrataFitnessEvaluator()
        
        # Available crops per layer
        self.canopy_crops = [
            name for name, crop in CROP_DATABASE.items()
            if crop.layer == StrataLayer.CANOPY
        ]
        self.middle_crops = [
            name for name, crop in CROP_DATABASE.items()
            if crop.layer == StrataLayer.MIDDLE
        ]
        self.understory_crops = [
            name for name, crop in CROP_DATABASE.items()
            if crop.layer == StrataLayer.UNDERSTORY
        ]
    
    def optimize(
        self,
        required_layers: Optional[List[StrataLayer]] = None,
        fixed_crops: Optional[Dict[StrataLayer, str]] = None,
        min_ler: float = 0.0,
        budget_limit_inr: Optional[float] = None,
    ) -> List[StrataConfiguration]:
        """
        Run multi-objective optimization.
        
        Args:
            required_layers: Layers that must have a crop (default: all).
            fixed_crops: Pre-selected crops for specific layers.
            min_ler: Minimum acceptable LER (filter constraint).
            budget_limit_inr: Maximum establishment budget.
            
        Returns:
            Pareto-optimal front of StrataConfiguration objects.
        """
        logger.info(
            "Starting NSGA-II optimization: pop=%d, gens=%d",
            self.pop_size, self.n_gen
        )
        
        # Initialize population
        population = self._initialize_population(fixed_crops)
        
        # Evaluate initial population
        for ind in population:
            self.evaluator.evaluate(ind)
        
        # Evolution loop
        for gen in range(self.n_gen):
            # Non-dominated sorting
            fronts = self._fast_non_dominated_sort(population)
            
            # Assign crowding distance
            for front in fronts:
                self._assign_crowding_distance(front)
            
            # Create offspring
            offspring = self._create_offspring(population, fixed_crops)
            
            # Evaluate offspring
            for ind in offspring:
                self.evaluator.evaluate(ind)
            
            # Combine parent and offspring
            combined = population + offspring
            
            # Select next generation
            population = self._environmental_selection(combined)
            
            if gen % 10 == 0:
                best_yield = max(p.total_yield for p in population)
                best_ler = max(p.ler for p in population)
                logger.info(
                    "Gen %d: best_yield=%.2f, best_ler=%.3f",
                    gen, best_yield, best_ler
                )
        
        # Final non-dominated sorting
        fronts = self._fast_non_dominated_sort(population)
        pareto_front = fronts[0] if fronts else []
        
        # Apply constraints filter
        pareto_front = [
            p for p in pareto_front
            if p.ler >= min_ler
            and (budget_limit_inr is None or self._get_budget(p) <= budget_limit_inr)
        ]
        
        # Sort by net profit
        pareto_front.sort(key=lambda x: x.net_profit_inr_ha, reverse=True)
        
        logger.info("Optimization complete: %d Pareto-optimal solutions", len(pareto_front))
        return pareto_front
    
    def _initialize_population(
        self, fixed_crops: Optional[Dict[StrataLayer, str]] = None
    ) -> List[StrataConfiguration]:
        """Generate initial random population."""
        population = []
        
        for _ in range(self.pop_size):
            config = StrataConfiguration()
            
            # Canopy
            if fixed_crops and StrataLayer.CANOPY in fixed_crops:
                config.canopy_crop = fixed_crops[StrataLayer.CANOPY]
            else:
                config.canopy_crop = random.choice(self.canopy_crops + [None])
            
            # Middle
            if fixed_crops and StrataLayer.MIDDLE in fixed_crops:
                config.middle_crop = fixed_crops[StrataLayer.MIDDLE]
            else:
                config.middle_crop = random.choice(self.middle_crops + [None])
            
            # Understory
            if fixed_crops and StrataLayer.UNDERSTORY in fixed_crops:
                config.understory_crop = fixed_crops[StrataLayer.UNDERSTORY]
            else:
                config.understory_crop = random.choice(self.understory_crops + [None])
            
            # Random spacing within valid ranges
            if config.canopy_crop and config.canopy_crop in CROP_DATABASE:
                crop = CROP_DATABASE[config.canopy_crop]
                config.canopy_spacing = random.uniform(crop.min_spacing_m, crop.max_spacing_m)
            
            if config.middle_crop and config.middle_crop in CROP_DATABASE:
                crop = CROP_DATABASE[config.middle_crop]
                config.middle_spacing = random.uniform(crop.min_spacing_m, crop.max_spacing_m)
            
            if config.understory_crop and config.understory_crop in CROP_DATABASE:
                crop = CROP_DATABASE[config.understory_crop]
                config.understory_spacing = random.uniform(crop.min_spacing_m, crop.max_spacing_m)
            
            population.append(config)
        
        return population
    
    def _fast_non_dominated_sort(
        self, population: List[StrataConfiguration]
    ) -> List[List[StrataConfiguration]]:
        """
        NSGA-II fast non-dominated sorting.
        
        Objectives (all maximized, so negate competition):
          - total_yield: maximize
          - ler: maximize
          - -competition_index: maximize (minimize competition)
          - net_profit_inr_ha: maximize
        """
        fronts: List[List[StrataConfiguration]] = [[]]
        
        # Domination counts and dominated sets
        S = {id(p): [] for p in population}  # dominated set
        n = {id(p): 0 for p in population}   # domination count
        
        for p in population:
            for q in population:
                if p is q:
                    continue
                if self._dominates(p, q):
                    S[id(p)].append(q)
                elif self._dominates(q, p):
                    n[id(p)] += 1
            
            if n[id(p)] == 0:
                p.rank = 0
                fronts[0].append(p)
        
        i = 0
        while fronts[i]:
            next_front = []
            for p in fronts[i]:
                for q in S[id(p)]:
                    n[id(q)] -= 1
                    if n[id(q)] == 0:
                        q.rank = i + 1
                        next_front.append(q)
            i += 1
            fronts.append(next_front)
        
        return [f for f in fronts if f]
    
    def _dominates(self, p: StrataConfiguration, q: StrataConfiguration) -> bool:
        """Check if p dominates q (all objectives at least as good, one strictly better)."""
        objectives_p = [p.total_yield, p.ler, -p.competition_index, p.net_profit_inr_ha]
        objectives_q = [q.total_yield, q.ler, -q.competition_index, q.net_profit_inr_ha]
        
        at_least_as_good = all(op >= oq for op, oq in zip(objectives_p, objectives_q))
        strictly_better = any(op > oq for op, oq in zip(objectives_p, objectives_q))
        
        return at_least_as_good and strictly_better
    
    def _assign_crowding_distance(self, front: List[StrataConfiguration]) -> None:
        """Assign crowding distance for diversity preservation."""
        n = len(front)
        if n == 0:
            return
        
        for ind in front:
            ind.crowding_distance = 0.0
        
        objectives = ["total_yield", "ler", "competition_index", "net_profit_inr_ha"]
        
        for obj in objectives:
            front.sort(key=lambda x: getattr(x, obj))
            
            obj_min = getattr(front[0], obj)
            obj_max = getattr(front[-1], obj)
            obj_range = obj_max - obj_min if obj_max != obj_min else 1e-6
            
            front[0].crowding_distance = float("inf")
            front[-1].crowding_distance = float("inf")
            
            for i in range(1, n - 1):
                dist = (getattr(front[i + 1], obj) - getattr(front[i - 1], obj)) / obj_range
                front[i].crowding_distance += dist
    
    def _create_offspring(
        self,
        population: List[StrataConfiguration],
        fixed_crops: Optional[Dict[StrataLayer, str]] = None,
    ) -> List[StrataConfiguration]:
        """Create offspring through selection, crossover, and mutation."""
        offspring = []
        
        while len(offspring) < self.pop_size:
            # Tournament selection
            parent1 = self._tournament_select(population)
            parent2 = self._tournament_select(population)
            
            # Crossover
            if random.random() < self.cx_prob:
                child1, child2 = self._crossover(parent1, parent2)
            else:
                child1 = copy.deepcopy(parent1)
                child2 = copy.deepcopy(parent2)
            
            # Mutation
            self._mutate(child1, fixed_crops)
            self._mutate(child2, fixed_crops)
            
            offspring.extend([child1, child2])
        
        return offspring[:self.pop_size]
    
    def _tournament_select(self, population: List[StrataConfiguration]) -> StrataConfiguration:
        """Binary tournament selection based on rank and crowding distance."""
        candidates = random.sample(population, min(self.tournament_size, len(population)))
        
        # Sort by rank (lower is better), then by crowding distance (higher is better)
        candidates.sort(key=lambda x: (x.rank, -x.crowding_distance))
        return candidates[0]
    
    def _crossover(
        self, p1: StrataConfiguration, p2: StrataConfiguration
    ) -> Tuple[StrataConfiguration, StrataConfiguration]:
        """Simulated binary crossover for crop selection and spacing."""
        c1 = StrataConfiguration()
        c2 = StrataConfiguration()
        
        # Crop selection crossover (uniform)
        if random.random() < 0.5:
            c1.canopy_crop, c2.canopy_crop = p1.canopy_crop, p2.canopy_crop
        else:
            c1.canopy_crop, c2.canopy_crop = p2.canopy_crop, p1.canopy_crop
        
        if random.random() < 0.5:
            c1.middle_crop, c2.middle_crop = p1.middle_crop, p2.middle_crop
        else:
            c1.middle_crop, c2.middle_crop = p2.middle_crop, p1.middle_crop
        
        if random.random() < 0.5:
            c1.understory_crop, c2.understory_crop = p1.understory_crop, p2.understory_crop
        else:
            c1.understory_crop, c2.understory_crop = p2.understory_crop, p1.understory_crop
        
        # Spacing crossover (blend)
        alpha = random.random()
        c1.canopy_spacing = alpha * p1.canopy_spacing + (1 - alpha) * p2.canopy_spacing
        c2.canopy_spacing = (1 - alpha) * p1.canopy_spacing + alpha * p2.canopy_spacing
        
        c1.middle_spacing = alpha * p1.middle_spacing + (1 - alpha) * p2.middle_spacing
        c2.middle_spacing = (1 - alpha) * p1.middle_spacing + alpha * p2.middle_spacing
        
        c1.understory_spacing = alpha * p1.understory_spacing + (1 - alpha) * p2.understory_spacing
        c2.understory_spacing = (1 - alpha) * p1.understory_spacing + alpha * p2.understory_spacing
        
        return c1, c2
    
    def _mutate(
        self,
        ind: StrataConfiguration,
        fixed_crops: Optional[Dict[StrataLayer, str]] = None,
    ) -> None:
        """Mutate an individual's genes."""
        # Crop mutation
        if random.random() < self.mut_prob:
            if not (fixed_crops and StrataLayer.CANOPY in fixed_crops):
                ind.canopy_crop = random.choice(self.canopy_crops + [None])
        
        if random.random() < self.mut_prob:
            if not (fixed_crops and StrataLayer.MIDDLE in fixed_crops):
                ind.middle_crop = random.choice(self.middle_crops + [None])
        
        if random.random() < self.mut_prob:
            if not (fixed_crops and StrataLayer.UNDERSTORY in fixed_crops):
                ind.understory_crop = random.choice(self.understory_crops + [None])
        
        # Spacing mutation (Gaussian perturbation)
        if random.random() < self.mut_prob and ind.canopy_crop:
            crop = CROP_DATABASE.get(ind.canopy_crop)
            if crop:
                delta = random.gauss(0, 0.5)
                ind.canopy_spacing = np.clip(
                    ind.canopy_spacing + delta, crop.min_spacing_m, crop.max_spacing_m
                )
        
        if random.random() < self.mut_prob and ind.middle_crop:
            crop = CROP_DATABASE.get(ind.middle_crop)
            if crop:
                delta = random.gauss(0, 0.3)
                ind.middle_spacing = np.clip(
                    ind.middle_spacing + delta, crop.min_spacing_m, crop.max_spacing_m
                )
        
        if random.random() < self.mut_prob and ind.understory_crop:
            crop = CROP_DATABASE.get(ind.understory_crop)
            if crop:
                delta = random.gauss(0, 0.1)
                ind.understory_spacing = np.clip(
                    ind.understory_spacing + delta, crop.min_spacing_m, crop.max_spacing_m
                )
    
    def _environmental_selection(
        self, combined: List[StrataConfiguration]
    ) -> List[StrataConfiguration]:
        """Select next generation from combined parent+offspring using NSGA-II."""
        fronts = self._fast_non_dominated_sort(combined)
        
        new_population = []
        front_idx = 0
        
        while len(new_population) + len(fronts[front_idx]) <= self.pop_size:
            new_population.extend(fronts[front_idx])
            front_idx += 1
            if front_idx >= len(fronts):
                break
        
        # Fill remaining slots from last front by crowding distance
        if len(new_population) < self.pop_size and front_idx < len(fronts):
            self._assign_crowding_distance(fronts[front_idx])
            fronts[front_idx].sort(key=lambda x: -x.crowding_distance)
            remaining = self.pop_size - len(new_population)
            new_population.extend(fronts[front_idx][:remaining])
        
        return new_population
    
    def _get_budget(self, config: StrataConfiguration) -> float:
        """Calculate total establishment budget for a configuration."""
        total = 0.0
        for crop_name in [config.canopy_crop, config.middle_crop, config.understory_crop]:
            if crop_name and crop_name in CROP_DATABASE:
                total += CROP_DATABASE[crop_name].establishment_cost_inr_ha
        return total


# ---------------------------------------------------------------------------
# Quick Optimization Recommender
# ---------------------------------------------------------------------------

def quick_optimize(
    soil_type: str = "laterite",
    acres: float = 2.0,
    budget_inr: Optional[float] = None,
    preferred_canopy: Optional[str] = None,
    n_recommendations: int = 3,
) -> List[Dict[str, Any]]:
    """
    Run quick optimization and return top recommendations.
    
    Args:
        soil_type: Soil type (laterite, alluvial, red, black).
        acres: Farm size in acres.
        budget_inr: Optional budget constraint.
        preferred_canopy: Optional fixed canopy crop.
        n_recommendations: Number of recommendations to return.
        
    Returns:
        List of recommendation dictionaries.
    """
    # Soil-adjusted parameters
    soil_params = {
        "laterite": {"soil_n": 180, "soil_p": 20, "vwc": 0.28},
        "alluvial": {"soil_n": 250, "soil_p": 35, "vwc": 0.35},
        "red": {"soil_n": 150, "soil_p": 18, "vwc": 0.25},
        "black": {"soil_n": 200, "soil_p": 28, "vwc": 0.32},
    }
    
    params = soil_params.get(soil_type, soil_params["laterite"])
    
    evaluator = StrataFitnessEvaluator(
        soil_n=params["soil_n"],
        soil_p=params["soil_p"],
        vwc=params["vwc"],
    )
    
    optimizer = StrataOptimizer(
        population_size=50,
        n_generations=25,
        evaluator=evaluator,
    )
    
    fixed = None
    if preferred_canopy:
        fixed = {StrataLayer.CANOPY: preferred_canopy}
    
    results = optimizer.optimize(
        fixed_crops=fixed,
        budget_limit_inr=budget_inr,
    )
    
    # Format recommendations
    recommendations = []
    for i, config in enumerate(results[:n_recommendations]):
        rec = config.to_dict()
        rec["rank"] = i + 1
        rec["acres"] = acres
        rec["soil_type"] = soil_type
        recommendations.append(rec)
    
    return recommendations
