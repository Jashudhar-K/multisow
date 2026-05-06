'use client'
/**
 * AIFarmContext — global single source of truth for the current farm session.
 *
 * Stores farm configuration, selected preset model, live prediction results,
 * and the AI advisory message history.  Design, Dashboard, Predict, and
 * AI-Advisor pages all read from / write to this context so every panel
 * stays in sync without individual prop-drilling.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SoilType =
  | 'alluvial'
  | 'black'
  | 'red'
  | 'laterite'
  | 'desert'
  | 'mountain'

export type GoalType = 'maximize_profit' | 'maximize_yield' | 'sustainability'

export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert'

export interface FarmConfig {
  name: string
  location: string
  region: string
  acres: number
  soilType: SoilType
  goal: GoalType
  experienceLevel: ExperienceLevel
  budget_inr: number
}

export interface LayerCrop {
  id: string
  name: string
  layer: 'canopy' | 'midstory' | 'understory' | 'groundcover'
  spacingM: number
  plantCount: number
}

export interface SelectedModel {
  id: string
  name: string
  crops: LayerCrop[]
  estimatedLER: number
  estimatedRevenue: string
  estimatedYield: string
  soilType?: string
}

export interface PredictionResult {
  prediction_id: string
  farm_id?: string
  timestamp: string
  layers: Record<
    string,
    {
      predicted_yield_t_ha: number
      ci_80_low: number
      ci_80_high: number
      top_shap_features?: Array<{ feature: string; contribution: number }>
      fis_stress_scores?: Record<string, number>
      weights_used?: number[]
    }
  >
  system_LER: number
  optimal_geometry_recommendation?: string
  model_version?: string
}

export interface AdvisoryMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  source?: 'claude' | 'rule-based' | 'fallback'
  confidence?: number
}

export interface AIFarmState {
  currentFarm: FarmConfig | null
  selectedModel: SelectedModel | null
  predictions: PredictionResult[]
  advisoryMessages: AdvisoryMessage[]
  isAIProcessing: boolean
  lastPredictionAt: string | null
}

interface AIFarmContextValue extends AIFarmState {
  setFarm: (farm: FarmConfig) => void
  setModel: (model: SelectedModel) => void
  addPrediction: (result: PredictionResult) => void
  addAdvisoryMessage: (msg: Omit<AdvisoryMessage, 'id' | 'timestamp'>) => void
  clearAdvisory: () => void
  setIsAIProcessing: (v: boolean) => void
  resetSession: () => void
}

// ---------------------------------------------------------------------------
// Context setup
// ---------------------------------------------------------------------------

const AIFarmContext = createContext<AIFarmContextValue | null>(null)

const STORAGE_KEY = 'multisow_farm_session'

function loadFromStorage(): Partial<AIFarmState> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Partial<AIFarmState>
  } catch {
    return {}
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

// Default farm for demo/testing
const DEFAULT_FARM: FarmConfig = {
  name: 'Sunrise Farm',
  location: 'Western Ghats, Karnataka',
  region: 'Karnataka',
  acres: 2.5,
  soilType: 'laterite',
  goal: 'maximize_profit',
  experienceLevel: 'intermediate',
  budget_inr: 150000,
}

// Default prediction with realistic yield data
const DEFAULT_PREDICTION: PredictionResult = {
  prediction_id: 'default_pred_001',
  farm_id: 'sunrise_farm',
  timestamp: new Date().toISOString(),
  layers: {
    canopy: {
      predicted_yield_t_ha: 2.8,
      ci_80_low: 2.4,
      ci_80_high: 3.2,
      top_shap_features: [
        { feature: 'soil_nitrogen', contribution: 0.35 },
        { feature: 'rainfall', contribution: 0.28 },
      ],
      fis_stress_scores: { water: 0.2, nutrient: 0.15 },
    },
    midstory: {
      predicted_yield_t_ha: 1.9,
      ci_80_low: 1.5,
      ci_80_high: 2.3,
      top_shap_features: [
        { feature: 'spacing', contribution: 0.32 },
        { feature: 'rainfall', contribution: 0.25 },
      ],
      fis_stress_scores: { water: 0.25, nutrient: 0.18 },
    },
    understory: {
      predicted_yield_t_ha: 1.2,
      ci_80_low: 0.9,
      ci_80_high: 1.5,
      top_shap_features: [
        { feature: 'canopy_cover', contribution: 0.4 },
        { feature: 'soil_ph', contribution: 0.22 },
      ],
      fis_stress_scores: { water: 0.35, nutrient: 0.2 },
    },
    groundcover: {
      predicted_yield_t_ha: 0.8,
      ci_80_low: 0.6,
      ci_80_high: 1.1,
      top_shap_features: [
        { feature: 'mulch_depth', contribution: 0.38 },
        { feature: 'soil_moisture', contribution: 0.3 },
      ],
      fis_stress_scores: { water: 0.28, nutrient: 0.15 },
    },
  },
  system_LER: 2.15,
  optimal_geometry_recommendation:
    'Current spacing allows excellent light penetration. Consider increasing groundcover density to 15-20 plants/m² for optimal yield.',
  model_version: 'v2.3-multimodel',
}

// Default model selection
const DEFAULT_MODEL: SelectedModel = {
  id: 'model_agroforestry_001',
  name: 'Coconut-Mango-Cacao-Pepper System',
  crops: [
    {
      id: 'crop_coconut',
      name: 'Coconut',
      layer: 'canopy',
      spacingM: 7.5,
      plantCount: 53,
    },
    {
      id: 'crop_mango',
      name: 'Mango',
      layer: 'midstory',
      spacingM: 10,
      plantCount: 25,
    },
    {
      id: 'crop_cacao',
      name: 'Cacao',
      layer: 'understory',
      spacingM: 3,
      plantCount: 111,
    },
    {
      id: 'crop_pepper',
      name: 'Black Pepper',
      layer: 'groundcover',
      spacingM: 2,
      plantCount: 250,
    },
  ],
  estimatedLER: 2.15,
  estimatedRevenue: '₹2,40,000',
  estimatedYield: '6.7 tonnes',
  soilType: 'laterite',
}

export function AIFarmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AIFarmState>({
    currentFarm: DEFAULT_FARM,
    selectedModel: DEFAULT_MODEL,
    predictions: [DEFAULT_PREDICTION],
    advisoryMessages: [],
    isAIProcessing: false,
    lastPredictionAt: DEFAULT_PREDICTION.timestamp,
  })

  // Hydrate from localStorage after mount to avoid SSR/client mismatch
  const hydratedRef = useRef(false)
  useEffect(() => {
    const saved = loadFromStorage()
    if (Object.keys(saved).length > 0) {
      setState(prev => ({
        ...prev,
        currentFarm: saved.currentFarm ?? prev.currentFarm,
        selectedModel: saved.selectedModel ?? prev.selectedModel,
        predictions: saved.predictions ?? prev.predictions,
        advisoryMessages: saved.advisoryMessages ?? prev.advisoryMessages,
        lastPredictionAt: saved.lastPredictionAt ?? prev.lastPredictionAt,
      }))
    }
    hydratedRef.current = true
  }, [])

  // Auto-save to localStorage (debounced via ref, skipped before hydration)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!hydratedRef.current) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      const { isAIProcessing: _skip, ...toSave } = state
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
      } catch {
        // Quota exceeded — silently ignore
      }
    }, 500)
  }, [state])

  const setFarm = useCallback((farm: FarmConfig) => {
    setState(s => ({ ...s, currentFarm: farm }))
  }, [])

  const setModel = useCallback((model: SelectedModel) => {
    setState(s => ({ ...s, selectedModel: model }))
  }, [])

  const addPrediction = useCallback((result: PredictionResult) => {
    setState(s => ({
      ...s,
      predictions: [result, ...s.predictions].slice(0, 50), // keep last 50
      lastPredictionAt: result.timestamp,
    }))
  }, [])

  const addAdvisoryMessage = useCallback(
    (msg: Omit<AdvisoryMessage, 'id' | 'timestamp'>) => {
      const full: AdvisoryMessage = {
        ...msg,
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        timestamp: new Date().toISOString(),
      }
      setState(s => ({
        ...s,
        advisoryMessages: [...s.advisoryMessages, full].slice(-40), // keep 40
      }))
    },
    []
  )

  const clearAdvisory = useCallback(() => {
    setState(s => ({ ...s, advisoryMessages: [] }))
  }, [])

  const setIsAIProcessing = useCallback((v: boolean) => {
    setState(s => ({ ...s, isAIProcessing: v }))
  }, [])

  const resetSession = useCallback(() => {
    setState({
      currentFarm: null,
      selectedModel: null,
      predictions: [],
      advisoryMessages: [],
      isAIProcessing: false,
      lastPredictionAt: null,
    })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AIFarmContext.Provider
      value={{
        ...state,
        setFarm,
        setModel,
        addPrediction,
        addAdvisoryMessage,
        clearAdvisory,
        setIsAIProcessing,
        resetSession,
      }}
    >
      {children}
    </AIFarmContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

export function useAIFarm(): AIFarmContextValue {
  const ctx = useContext(AIFarmContext)
  if (!ctx) {
    throw new Error('useAIFarm must be used inside <AIFarmProvider>')
  }
  return ctx
}
