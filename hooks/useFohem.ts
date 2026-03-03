'use client'

import { useState, useCallback } from 'react'
import type {
  FohemInput,
  FohemOutput,
  PredictionRequest,
  PredictionResponse,
  ApiResponse,
  FarmMetrics,
  ShapExplanation,
  StrataLayerId,
  Species,
} from '@/types/farm'

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  // FOHEM predictions
  predict: '/api/v1/predict',
  optimize: '/api/v1/optimize',
  explain: '/api/v1/explain',
  
  // Data endpoints
  species: '/api/v1/species',
  presets: '/api/v1/presets',
  
  // Light interception
  lightInterception: '/api/v1/light-interception',
  
  // Genetic optimization
  geneticOptimize: '/api/v1/genetic-optimize',
  
  // Export
  exportPlan: '/api/v1/export',
}

// ============================================================================
// API CLIENT
// ============================================================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: errorData.detail || response.statusText,
        },
      }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
    }
  }
}

// ============================================================================
// FOHEM SERVICE
// ============================================================================

export const fohemService = {
  /**
   * Get AI-optimized layout suggestion
   */
  async getOptimizedLayout(input: FohemInput): Promise<ApiResponse<FohemOutput>> {
    return apiRequest<FohemOutput>(API_ENDPOINTS.optimize, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  /**
   * Get yield prediction for a layout
   */
  async getPrediction(request: PredictionRequest): Promise<ApiResponse<PredictionResponse>> {
    return apiRequest<PredictionResponse>(API_ENDPOINTS.predict, {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  /**
   * Get SHAP explanations for a prediction
   */
  async getExplanation(predictionId: string): Promise<ApiResponse<ShapExplanation[]>> {
    return apiRequest<ShapExplanation[]>(`${API_ENDPOINTS.explain}/${predictionId}`)
  },

  /**
   * Calculate light interception using Beer-Lambert law
   */
  async calculateLightInterception(layers: {
    layerId: StrataLayerId
    lai: number
    extinctionCoeff: number
  }[]): Promise<ApiResponse<{
    layer: StrataLayerId
    parAbsorption: number
    parTransmission: number
    effectiveLAI: number
  }[]>> {
    return apiRequest(API_ENDPOINTS.lightInterception, {
      method: 'POST',
      body: JSON.stringify({ layers }),
    })
  },

  /**
   * Run genetic optimization for row placement
   */
  async runGeneticOptimization(params: {
    fieldArea: number
    targetSpecies: string[]
    constraints: {
      minSpacing: number
      maxDensity: number
      preferContours: boolean
    }
    fitnessWeights: {
      ler: number
      revenue: number
      carbon: number
    }
  }): Promise<ApiResponse<{
    optimizedLayout: {
      speciesId: string
      spacing: number
      orientation: number
    }[]
    fitness: number
    generations: number
  }>> {
    return apiRequest(API_ENDPOINTS.geneticOptimize, {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  /**
   * Get available species
   */
  async getSpecies(): Promise<ApiResponse<Species[]>> {
    return apiRequest<Species[]>(API_ENDPOINTS.species)
  },

  /**
   * Get regional presets
   */
  async getPresets(): Promise<ApiResponse<{
    id: string
    name: string
    region: string
    crops: string[]
    ler: number
  }[]>> {
    return apiRequest(API_ENDPOINTS.presets)
  },

  /**
   * Export farm plan
   */
  async exportPlan(
    planData: unknown,
    format: 'geojson' | 'kml' | 'csv' | 'pdf'
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiRequest(API_ENDPOINTS.exportPlan, {
      method: 'POST',
      body: JSON.stringify({ planData, format }),
    })
  },
}

// ============================================================================
// USE FOHEM HOOK
// ============================================================================

interface UseFohemState {
  isLoading: boolean
  error: string | null
  prediction: PredictionResponse | null
  explanation: ShapExplanation[] | null
  optimizedLayout: FohemOutput | null
}

interface UseFohemActions {
  predict: (request: PredictionRequest) => Promise<void>
  optimize: (input: FohemInput) => Promise<void>
  explain: (predictionId: string) => Promise<void>
  reset: () => void
}

export function useFohem(): [UseFohemState, UseFohemActions] {
  const [state, setState] = useState<UseFohemState>({
    isLoading: false,
    error: null,
    prediction: null,
    explanation: null,
    optimizedLayout: null,
  })

  const predict = useCallback(async (request: PredictionRequest) => {
    setState((s) => ({ ...s, isLoading: true, error: null }))

    const result = await fohemService.getPrediction(request)

    if (result.success && result.data) {
      setState((s) => ({
        ...s,
        isLoading: false,
        prediction: result.data!,
      }))
    } else {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: result.error?.message || 'Prediction failed',
      }))
    }
  }, [])

  const optimize = useCallback(async (input: FohemInput) => {
    setState((s) => ({ ...s, isLoading: true, error: null }))

    const result = await fohemService.getOptimizedLayout(input)

    if (result.success && result.data) {
      setState((s) => ({
        ...s,
        isLoading: false,
        optimizedLayout: result.data!,
      }))
    } else {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: result.error?.message || 'Optimization failed',
      }))
    }
  }, [])

  const explain = useCallback(async (predictionId: string) => {
    setState((s) => ({ ...s, isLoading: true, error: null }))

    const result = await fohemService.getExplanation(predictionId)

    if (result.success && result.data) {
      setState((s) => ({
        ...s,
        isLoading: false,
        explanation: result.data!,
      }))
    } else {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: result.error?.message || 'Explanation failed',
      }))
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      prediction: null,
      explanation: null,
      optimizedLayout: null,
    })
  }, [])

  return [state, { predict, optimize, explain, reset }]
}

// ============================================================================
// USE LIGHT INTERCEPTION HOOK
// ============================================================================

interface UseLightInterceptionState {
  isCalculating: boolean
  error: string | null
  results: {
    layer: StrataLayerId
    parAbsorption: number
    parTransmission: number
    effectiveLAI: number
  }[] | null
}

export function useLightInterception(): [
  UseLightInterceptionState,
  (layers: { layerId: StrataLayerId; lai: number; extinctionCoeff: number }[]) => Promise<void>
] {
  const [state, setState] = useState<UseLightInterceptionState>({
    isCalculating: false,
    error: null,
    results: null,
  })

  const calculate = useCallback(
    async (layers: { layerId: StrataLayerId; lai: number; extinctionCoeff: number }[]) => {
      setState((s) => ({ ...s, isCalculating: true, error: null }))

      // Local calculation using Beer-Lambert law
      // I = I0 * e^(-k * LAI)
      let transmittedLight = 1.0 // 100% at top
      const results: UseLightInterceptionState['results'] = []

      for (const layer of layers) {
        const absorbed = transmittedLight * (1 - Math.exp(-layer.extinctionCoeff * layer.lai))
        const transmitted = transmittedLight - absorbed

        results.push({
          layer: layer.layerId,
          parAbsorption: absorbed,
          parTransmission: transmitted,
          effectiveLAI: layer.lai,
        })

        transmittedLight = transmitted
      }

      setState({
        isCalculating: false,
        error: null,
        results,
      })
    },
    []
  )

  return [state, calculate]
}

// ============================================================================
// USE GENETIC OPTIMIZER HOOK
// ============================================================================

interface GeneticOptimizerConfig {
  populationSize: number
  generations: number
  mutationRate: number
  crossoverRate: number
}

interface Individual {
  genes: number[] // spacing values
  fitness: number
}

export function useGeneticOptimizer(config: GeneticOptimizerConfig = {
  populationSize: 50,
  generations: 100,
  mutationRate: 0.1,
  crossoverRate: 0.7,
}) {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [bestSolution, setBestSolution] = useState<Individual | null>(null)

  const fitnessFunction = useCallback(
    (genes: number[], targetMetrics: { ler: number; revenue: number }): number => {
      // Simplified fitness calculation
      // In real implementation, this would call the backend model
      const spacing = genes[0]
      const density = 10000 / (spacing * spacing) // trees per hectare
      
      // Penalty for too dense or too sparse
      const densityPenalty = Math.abs(density - 400) / 400
      
      // LER contribution
      const lerEstimate = 1.5 + (spacing - 5) * 0.1
      const lerScore = Math.min(lerEstimate / targetMetrics.ler, 1)
      
      // Revenue contribution
      const revenueEstimate = density * 1200
      const revenueScore = Math.min(revenueEstimate / targetMetrics.revenue, 1)
      
      return (lerScore + revenueScore) / 2 - densityPenalty * 0.5
    },
    []
  )

  const run = useCallback(
    async (
      speciesCount: number,
      targetMetrics: { ler: number; revenue: number }
    ): Promise<Individual> => {
      setIsRunning(true)
      setProgress(0)

      // Initialize population
      let population: Individual[] = Array.from({ length: config.populationSize }, () => ({
        genes: Array.from({ length: speciesCount }, () => 3 + Math.random() * 12),
        fitness: 0,
      }))

      // Evaluate initial fitness
      population = population.map((ind) => ({
        ...ind,
        fitness: fitnessFunction(ind.genes, targetMetrics),
      }))

      let best = population.reduce((a, b) => (a.fitness > b.fitness ? a : b))

      // Evolution loop
      for (let gen = 0; gen < config.generations; gen++) {
        // Selection (tournament)
        const newPopulation: Individual[] = []

        while (newPopulation.length < config.populationSize) {
          // Tournament selection
          const tournament = Array.from({ length: 3 }, () =>
            population[Math.floor(Math.random() * population.length)]
          )
          const winner = tournament.reduce((a, b) => (a.fitness > b.fitness ? a : b))

          // Crossover
          if (Math.random() < config.crossoverRate && newPopulation.length > 0) {
            const parent2 = newPopulation[Math.floor(Math.random() * newPopulation.length)]
            const crossPoint = Math.floor(Math.random() * winner.genes.length)
            const childGenes = [
              ...winner.genes.slice(0, crossPoint),
              ...parent2.genes.slice(crossPoint),
            ]

            newPopulation.push({
              genes: childGenes,
              fitness: 0,
            })
          } else {
            newPopulation.push({ ...winner })
          }
        }

        // Mutation
        for (const ind of newPopulation) {
          for (let i = 0; i < ind.genes.length; i++) {
            if (Math.random() < config.mutationRate) {
              ind.genes[i] += (Math.random() - 0.5) * 2
              ind.genes[i] = Math.max(2, Math.min(20, ind.genes[i])) // Clamp
            }
          }
        }

        // Evaluate fitness
        population = newPopulation.map((ind) => ({
          ...ind,
          fitness: fitnessFunction(ind.genes, targetMetrics),
        }))

        // Update best
        const genBest = population.reduce((a, b) => (a.fitness > b.fitness ? a : b))
        if (genBest.fitness > best.fitness) {
          best = genBest
        }

        setProgress((gen + 1) / config.generations)

        // Yield to UI
        if (gen % 10 === 0) {
          await new Promise((r) => setTimeout(r, 0))
        }
      }

      setBestSolution(best)
      setIsRunning(false)
      return best
    },
    [config, fitnessFunction]
  )

  return { run, isRunning, progress, bestSolution }
}

// ============================================================================
// MOCK DATA FOR OFFLINE/DEVELOPMENT
// ============================================================================

export function getMockPrediction(): PredictionResponse {
  return {
    predictedYield: 2.8,
    predictedRevenue: 156000,
    ler: 2.1,
    lightInterception: [
      { layer: 'canopy', parAbsorption: 0.52, parTransmission: 0.48, effectiveLAI: 4.8 },
      { layer: 'middle', parAbsorption: 0.22, parTransmission: 0.26, effectiveLAI: 3.2 },
      { layer: 'understory', parAbsorption: 0.12, parTransmission: 0.14, effectiveLAI: 1.5 },
    ],
    shapValues: [
      { feature: 'Leaf Area Index (LAI)', contribution: 0.48, importance: 0.48, description: 'Optimal LAI of 4.8', color: 'green' },
      { feature: '30-day Solar Radiation', contribution: 0.31, importance: 0.31, description: '15% above baseline', color: 'green' },
      { feature: 'Row Spacing (3.5m)', contribution: 0.22, importance: 0.22, description: 'Good light penetration', color: 'green' },
      { feature: 'Soil Nitrogen', contribution: 0.18, importance: 0.18, description: 'Adequate N levels', color: 'green' },
      { feature: 'Root Overlap Index', contribution: -0.14, importance: 0.14, description: 'Mild competition', color: 'red' },
      { feature: 'VWC (Soil Moisture)', contribution: -0.09, importance: 0.09, description: 'Slightly low', color: 'red' },
    ],
  }
}

export function getMockFohemOutput(): FohemOutput {
  return {
    optimizedLayout: [
      { species: 'coconut', layer: 'canopy', spacing: 8, rowOrientation: 0, plantCount: 156 },
      { species: 'banana', layer: 'middle', spacing: 4, rowOrientation: 0, plantCount: 625 },
      { species: 'ginger', layer: 'understory', spacing: 0.5, rowOrientation: 45, plantCount: 10000 },
    ],
    predictedMetrics: {
      totalArea: 2.5,
      plantedArea: 2.0,
      treeDensity: 430,
      ler: 2.1,
      waterSavings: 68,
      carbonSequestration: 4.2,
      expectedYield: [],
      totalRevenue: 156000,
      roi: 42,
      rootOverlapIndex: 0.28,
      canopyCover: 72,
    },
    confidence: 0.87,
    explanations: getMockPrediction().shapValues,
  }
}
