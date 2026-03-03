"""
Genetic Algorithm optimizers for FOHEM.

1. GAFeatureSelector  — binary chromosome feature selection
2. GAWeightOptimizer  — real-valued chromosome for ensemble weight optimization

Uses DEAP library with graceful fallback to random search when DEAP
is unavailable.
"""

from __future__ import annotations

import logging
from typing import Any, Callable, List, Optional, Tuple

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

# Probe DEAP availability
try:
    from deap import algorithms, base, creator, tools

    HAS_DEAP = True
except ImportError:
    HAS_DEAP = False
    logger.warning("DEAP not installed; GA will use random-search fallback")


# ---------------------------------------------------------------------------
# GA Feature Selector
# ---------------------------------------------------------------------------

class GAFeatureSelector:
    """
    Binary-chromosome genetic algorithm for feature selection.

    Chromosome: 1 = include feature, 0 = exclude.
    Fitness: maximise R² on a 20% validation fold using a base model.
    """

    def __init__(
        self,
        population_size: int = 200,
        n_generations: int = 100,
        crossover_prob: float = 0.8,
        mutation_prob: float = 0.01,
        elite_fraction: float = 0.05,
        convergence_patience: int = 10,
    ) -> None:
        """
        Configure GA parameters.

        Args:
            population_size: Number of individuals per generation.
            n_generations: Maximum generations.
            crossover_prob: Two-point crossover probability.
            mutation_prob: Per-bit flip probability.
            elite_fraction: Fraction of top individuals preserved.
            convergence_patience: Early-stop if no improvement for N gens.
        """
        self.pop_size = population_size
        self.n_gen = n_generations
        self.cx_prob = crossover_prob
        self.mut_prob = mutation_prob
        self.elite_frac = elite_fraction
        self.patience = convergence_patience

    def evolve(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        base_model: Any,
    ) -> Tuple[List[str], float]:
        """
        Evolve a feature subset that maximises R² for the base model.

        Args:
            X: Full feature DataFrame.
            y: Target Series.
            base_model: Object with ``.fit(X, y)`` and ``.predict(X)`` methods.

        Returns:
            Tuple of (selected_feature_names, best_R²).
        """
        feature_names = list(X.columns)
        n_features = len(feature_names)

        if n_features == 0:
            return [], 0.0

        # Split into train (80%) and validation (20%)
        n_val = max(1, int(len(X) * 0.2))
        X_tr, X_val = X.iloc[:-n_val], X.iloc[-n_val:]
        y_tr, y_val = y.iloc[:-n_val], y.iloc[-n_val:]

        if HAS_DEAP and n_features > 1:
            return self._evolve_deap(
                X_tr, y_tr, X_val, y_val, feature_names, base_model
            )
        return self._evolve_random(
            X_tr, y_tr, X_val, y_val, feature_names, base_model
        )

    def _evaluate_individual(
        self,
        individual: List[int],
        X_tr: pd.DataFrame,
        y_tr: pd.Series,
        X_val: pd.DataFrame,
        y_val: pd.Series,
        feature_names: List[str],
        base_model: Any,
    ) -> Tuple[float]:
        """Evaluate fitness of one chromosome."""
        selected = [f for f, bit in zip(feature_names, individual) if bit == 1]
        if not selected:
            return (-1e6,)

        try:
            from sklearn.base import clone

            model = clone(base_model.model) if hasattr(base_model, "model") and base_model.model is not None else None
            if model is None:
                from sklearn.ensemble import RandomForestRegressor
                model = RandomForestRegressor(
                    n_estimators=100, max_depth=8, random_state=42, n_jobs=-1
                )

            model.fit(X_tr[selected], y_tr)
            preds = model.predict(X_val[selected])

            ss_res = np.sum((y_val.values - preds) ** 2)
            ss_tot = np.sum((y_val.values - y_val.mean()) ** 2)
            r2 = 1 - ss_res / ss_tot if ss_tot > 0 else 0.0
            return (r2,)
        except Exception as exc:
            logger.debug("GA eval error: %s", exc)
            return (-1e6,)

    def _evolve_deap(
        self,
        X_tr: pd.DataFrame,
        y_tr: pd.Series,
        X_val: pd.DataFrame,
        y_val: pd.Series,
        feature_names: List[str],
        base_model: Any,
    ) -> Tuple[List[str], float]:
        """Run DEAP-based GA evolution."""
        n_features = len(feature_names)

        # Create DEAP types (use unique names to avoid conflicts)
        if not hasattr(creator, "FitnessMaxFS"):
            creator.create("FitnessMaxFS", base.Fitness, weights=(1.0,))
        if not hasattr(creator, "IndividualFS"):
            creator.create("IndividualFS", list, fitness=creator.FitnessMaxFS)

        toolbox = base.Toolbox()
        toolbox.register("attr_bit", np.random.randint, 0, 2)
        toolbox.register(
            "individual",
            tools.initRepeat,
            creator.IndividualFS,
            toolbox.attr_bit,
            n=n_features,
        )
        toolbox.register("population", tools.initRepeat, list, toolbox.individual)
        toolbox.register(
            "evaluate",
            self._evaluate_individual,
            X_tr=X_tr, y_tr=y_tr, X_val=X_val, y_val=y_val,
            feature_names=feature_names, base_model=base_model,
        )
        toolbox.register("mate", tools.cxTwoPoint)
        toolbox.register("mutate", tools.mutFlipBit, indpb=self.mut_prob)
        toolbox.register("select", tools.selTournament, tournsize=3)

        pop = toolbox.population(n=min(self.pop_size, 50))  # Reduced for speed
        n_elite = max(1, int(len(pop) * self.elite_frac))
        hof = tools.HallOfFame(n_elite)

        # Stats
        stats = tools.Statistics(lambda ind: ind.fitness.values[0])
        stats.register("max", np.max)
        stats.register("avg", np.mean)

        # Evolution
        n_gens = min(self.n_gen, 30)  # Cap for dev-time speed
        best_fitness = -1e6
        no_improve = 0

        for gen in range(n_gens):
            # Evaluate
            fitnesses = map(toolbox.evaluate, pop)
            for ind, fit in zip(pop, fitnesses):
                ind.fitness.values = fit

            hof.update(pop)
            record = stats.compile(pop)
            current_best = record["max"]

            if current_best > best_fitness + 0.001:
                best_fitness = current_best
                no_improve = 0
            else:
                no_improve += 1

            if no_improve >= self.patience:
                logger.info("GA converged at generation %d", gen)
                break

            # Selection and variation
            offspring = toolbox.select(pop, len(pop) - n_elite)
            offspring = list(map(toolbox.clone, offspring))

            for child1, child2 in zip(offspring[::2], offspring[1::2]):
                if np.random.random() < self.cx_prob:
                    toolbox.mate(child1, child2)
                    del child1.fitness.values
                    del child2.fitness.values

            for mutant in offspring:
                if np.random.random() < 0.3:
                    toolbox.mutate(mutant)
                    del mutant.fitness.values

            # Elitism
            pop[:] = list(hof) + offspring[:len(pop) - n_elite]

        # Extract best
        best_ind = hof[0]
        selected = [f for f, bit in zip(feature_names, best_ind) if bit == 1]
        if not selected:
            selected = feature_names[:3]  # fallback

        return selected, float(best_fitness)

    def _evolve_random(
        self,
        X_tr: pd.DataFrame,
        y_tr: pd.Series,
        X_val: pd.DataFrame,
        y_val: pd.Series,
        feature_names: List[str],
        base_model: Any,
    ) -> Tuple[List[str], float]:
        """Random-search fallback when DEAP is unavailable."""
        n_features = len(feature_names)
        best_r2 = -1e6
        best_selected = feature_names

        rng = np.random.RandomState(42)
        n_trials = min(50, self.pop_size)

        for _ in range(n_trials):
            mask = rng.randint(0, 2, size=n_features)
            if mask.sum() == 0:
                continue
            individual = mask.tolist()
            r2 = self._evaluate_individual(
                individual, X_tr, y_tr, X_val, y_val, feature_names, base_model
            )[0]
            if r2 > best_r2:
                best_r2 = r2
                best_selected = [f for f, bit in zip(feature_names, individual) if bit == 1]

        return best_selected, float(best_r2)


# ---------------------------------------------------------------------------
# GA Weight Optimizer
# ---------------------------------------------------------------------------

class GAWeightOptimizer:
    """
    Real-valued GA for optimising ensemble weights [w_fis, w_rf, w_cb, w_elm].

    Constraint: sum(weights) = 1 (normalised after each mutation).
    Objective: minimise MAE on validation fold.
    """

    def __init__(
        self,
        population_size: int = 100,
        n_generations: int = 50,
        crossover_prob: float = 0.8,
        mutation_sigma: float = 0.05,
        elite_fraction: float = 0.10,
        convergence_delta: float = 0.001,
    ) -> None:
        """
        Configure GA weight optimiser.

        Args:
            population_size: Number of individuals per generation.
            n_generations: Maximum generations.
            crossover_prob: Arithmetic crossover probability.
            mutation_sigma: Gaussian mutation std dev.
            elite_fraction: Fraction of top individuals preserved.
            convergence_delta: Early-stop when max weight change < this.
        """
        self.pop_size = population_size
        self.n_gen = n_generations
        self.cx_prob = crossover_prob
        self.mut_sigma = mutation_sigma
        self.elite_frac = elite_fraction
        self.conv_delta = convergence_delta

    @staticmethod
    def _normalize_weights(w: np.ndarray) -> np.ndarray:
        """Normalize weight vector to sum to 1."""
        w = np.clip(w, 0.0, None)
        s = w.sum()
        if s > 0:
            return w / s
        return np.ones(len(w)) / len(w)

    def optimize(
        self,
        fis_preds: np.ndarray,
        rf_preds: np.ndarray,
        cb_preds: np.ndarray,
        elm_preds: np.ndarray,
        y_val: pd.Series | np.ndarray,
    ) -> Tuple[np.ndarray, float]:
        """
        Optimise ensemble weights to minimise MAE.

        Args:
            fis_preds: FIS yield proxies on validation set.
            rf_preds: Random Forest predictions.
            cb_preds: CatBoost predictions.
            elm_preds: ELM predictions.
            y_val: True validation targets.

        Returns:
            Tuple of (optimal_weights_array, best_MAE).
        """
        fis_p = np.asarray(fis_preds).ravel()
        rf_p = np.asarray(rf_preds).ravel()
        cb_p = np.asarray(cb_preds).ravel()
        elm_p = np.asarray(elm_preds).ravel()
        y = np.asarray(y_val).ravel()

        preds_matrix = np.column_stack([fis_p, rf_p, cb_p, elm_p])

        def evaluate(w: np.ndarray) -> float:
            """Return MAE for a weight vector."""
            w_norm = self._normalize_weights(w)
            ensemble_pred = preds_matrix @ w_norm
            return float(np.mean(np.abs(y - ensemble_pred)))

        if HAS_DEAP:
            return self._optimize_deap(evaluate)
        return self._optimize_random(evaluate)

    def _optimize_deap(self, evaluate_fn: Callable) -> Tuple[np.ndarray, float]:
        """Run DEAP-based real-valued GA."""
        if not hasattr(creator, "FitnessMinW"):
            creator.create("FitnessMinW", base.Fitness, weights=(-1.0,))
        if not hasattr(creator, "IndividualW"):
            creator.create("IndividualW", np.ndarray, fitness=creator.FitnessMinW)

        toolbox = base.Toolbox()

        def init_individual():
            w = np.random.dirichlet(np.ones(4))
            ind = creator.IndividualW(w)
            return ind

        toolbox.register("individual", init_individual)
        toolbox.register("population", tools.initRepeat, list, toolbox.individual)

        def eval_wrapper(ind):
            return (evaluate_fn(np.asarray(ind)),)

        toolbox.register("evaluate", eval_wrapper)
        toolbox.register("select", tools.selTournament, tournsize=3)

        pop = toolbox.population(n=min(self.pop_size, 50))
        best_mae = 1e6
        best_weights = np.array([0.25, 0.25, 0.25, 0.25])
        prev_best = best_weights.copy()

        n_gens = min(self.n_gen, 30)

        for gen in range(n_gens):
            fitnesses = list(map(toolbox.evaluate, pop))
            for ind, fit in zip(pop, fitnesses):
                ind.fitness.values = fit

            # Track best
            for ind in pop:
                mae = ind.fitness.values[0]
                if mae < best_mae:
                    best_mae = mae
                    best_weights = self._normalize_weights(np.asarray(ind).copy())

            # Convergence check
            if np.max(np.abs(best_weights - prev_best)) < self.conv_delta:
                logger.info("GA weights converged at generation %d", gen)
                break
            prev_best = best_weights.copy()

            # Selection
            n_elite = max(1, int(len(pop) * self.elite_frac))
            elite = tools.selBest(pop, n_elite)
            offspring = toolbox.select(pop, len(pop) - n_elite)
            offspring = [np.asarray(ind).copy() for ind in offspring]

            # Crossover (arithmetic)
            for i in range(0, len(offspring) - 1, 2):
                if np.random.random() < self.cx_prob:
                    alpha = np.random.random()
                    o1 = alpha * offspring[i] + (1 - alpha) * offspring[i + 1]
                    o2 = (1 - alpha) * offspring[i] + alpha * offspring[i + 1]
                    offspring[i] = o1
                    offspring[i + 1] = o2

            # Mutation (Gaussian)
            for i in range(len(offspring)):
                offspring[i] += np.random.normal(0, self.mut_sigma, 4)
                offspring[i] = self._normalize_weights(offspring[i])

            # Reconstruct population
            new_pop = []
            for ind in elite:
                new_ind = creator.IndividualW(np.asarray(ind).copy())
                new_pop.append(new_ind)
            for arr in offspring:
                new_ind = creator.IndividualW(self._normalize_weights(arr))
                new_pop.append(new_ind)

            pop[:] = new_pop[:len(pop)]

        return best_weights, float(best_mae)

    def _optimize_random(self, evaluate_fn: Callable) -> Tuple[np.ndarray, float]:
        """Random-search fallback when DEAP is unavailable."""
        rng = np.random.RandomState(42)
        best_mae = 1e6
        best_w = np.array([0.25, 0.25, 0.25, 0.25])

        for _ in range(min(self.pop_size * self.n_gen, 500)):
            w = rng.dirichlet(np.ones(4))
            mae = evaluate_fn(w)
            if mae < best_mae:
                best_mae = mae
                best_w = w

        return self._normalize_weights(best_w), float(best_mae)
