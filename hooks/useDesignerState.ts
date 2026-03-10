'use client'
/**
 * useDesignerState — unified designer state management.
 *
 * Combines:
 *  - Farm configuration (soil, acres, region, budget)
 *  - Layer / crop configuration
 *  - Undo/redo via useUndoRedo
 *  - Auto-sync into AIFarmContext
 *  - Debounced auto-prediction (1500 ms after any change)
 *  - Auto-save to localStorage every 30 s
 */

import { useCallback, useEffect, useRef } from 'react'
import { useUndoRedo } from './useUndoRedo'
import { useAIFarm, type SoilType, type GoalType } from '@/context/AIFarmContext'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LayerKey = 'canopy' | 'midstory' | 'understory' | 'groundcover'

export interface LayerCropEntry {
  id: string
  name: string
  spacingM: number
  plantCount?: number
}

export interface DesignerState {
  farmName: string
  region: string
  soilType: SoilType
  acres: number
  budget_inr: number
  goal: GoalType
  layers: Record<LayerKey, LayerCropEntry[]>
  selectedPresetId: string | null
}

const DEFAULT_STATE: DesignerState = {
  farmName: '',
  region: 'Kerala',
  soilType: 'laterite',
  acres: 2,
  budget_inr: 200000,
  goal: 'maximize_profit',
  layers: {
    canopy: [],
    midstory: [],
    understory: [],
    groundcover: [],
  },
  selectedPresetId: null,
}

const LS_KEY = 'multisow_designer_state'

/** Sanitise a layers object so every key is guaranteed to be an array. */
function sanitiseLayers(raw: unknown): DesignerState['layers'] {
  const src = raw && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : {}
  return {
    canopy:      Array.isArray(src['canopy'])      ? (src['canopy']      as LayerCropEntry[]) : [],
    midstory:    Array.isArray(src['midstory'])    ? (src['midstory']    as LayerCropEntry[]) : [],
    understory:  Array.isArray(src['understory'])  ? (src['understory']  as LayerCropEntry[]) : [],
    groundcover: Array.isArray(src['groundcover']) ? (src['groundcover'] as LayerCropEntry[]) : [],
  }
}

function loadSaved(): DesignerState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<DesignerState> | null
    if (!parsed || typeof parsed !== 'object') return null
    return {
      ...DEFAULT_STATE,
      ...parsed,
      layers: sanitiseLayers(parsed.layers),
    }
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDesignerState() {
  const {
    setFarm,
    setModel,
    addPrediction,
    setIsAIProcessing,
    currentFarm,
  } = useAIFarm()

  const { state, set, undo, redo, reset, canUndo, canRedo } =
    useUndoRedo<DesignerState>(DEFAULT_STATE)

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hydrate from localStorage after mount to avoid SSR mismatch
  const hydratedRef = useRef(false)
  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    const saved = loadSaved()
    if (saved) reset(saved)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // Sync designer state → AIFarmContext whenever relevant fields change
  // -------------------------------------------------------------------------
  useEffect(() => {
    setFarm({
      name: state.farmName || currentFarm?.name || 'My Farm',
      location: currentFarm?.location ?? '',
      region: state.region,
      acres: state.acres,
      soilType: state.soilType,
      goal: state.goal,
      experienceLevel: currentFarm?.experienceLevel ?? 'beginner',
      budget_inr: state.budget_inr,
    })
  }, [state.farmName, state.region, state.soilType, state.acres, state.goal, state.budget_inr]) // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // Auto-save to localStorage every 30 s (or on state change, debounced)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    autoSaveTimerRef.current = setTimeout(() => {
      try { localStorage.setItem(LS_KEY, JSON.stringify(state)) } catch { /* quota */ }
    }, 30_000)
  }, [state])

  // -------------------------------------------------------------------------
  // Manual prediction trigger (replaces debounced auto-predict)
  // -------------------------------------------------------------------------
  const runPrediction = useCallback(async () => {
    const totalCrops = Object.values(state.layers ?? {}).flat().length
    if (totalCrops === 0) return
    setIsAIProcessing(true)
    try {
      const layerInputs = (Object.entries(state.layers ?? {}) as [LayerKey, LayerCropEntry[]][])
        .filter(([, crops]) => crops.length > 0)
        .map(([layer, crops]) => ({
          layer,
          crop_species: crops.map(c => c.name).join(', '),
          LAI: layer === 'canopy' ? 4.5 : layer === 'midstory' ? 3.2 : 2.0,
          k_coeff: 0.5,
          row_spacing_m: crops[0]?.spacingM ?? 3,
          soil_N: 80, soil_P: 30, soil_K: 200,
          pH: layer === 'canopy' ? 6.0 : 6.5,
          VWC: 0.25, GDD: 1200, rainfall_7d: 15,
          solar_elevation_deg: 55,
          root_depth_cm: layer === 'canopy' ? 150 : layer === 'midstory' ? 80 : 40,
          root_radius_cm: 30, canopy_height_m: layer === 'canopy' ? 18 : 6,
          path_width_m: 1.5, crop_density: Math.min(1, crops.length * 0.3), shade_fraction: 0,
          root_length_density: 1.8,
        }))

      const res = await fetch('/ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm_id: 'designer',
          layers: layerInputs,
          use_sensor_data: false,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        addPrediction({
          prediction_id: data.prediction_id ?? Date.now().toString(),
          timestamp: data.timestamp ?? new Date().toISOString(),
          layers: data.layers ?? {},
          system_LER: data.system_LER ?? 1.0,
        })
      }
    } catch {
      // Prediction failed silently — UI stays as is
    } finally {
      setIsAIProcessing(false)
    }
  }, [state.layers, addPrediction, setIsAIProcessing])

  // -------------------------------------------------------------------------
  // Mutators
  // -------------------------------------------------------------------------

  const updateConfig = useCallback((patch: Partial<Omit<DesignerState, 'layers'>>) => {
    set({ ...state, ...patch })
  }, [state, set])

  const addCropToLayer = useCallback((layer: LayerKey, crop: LayerCropEntry) => {
    const safeLs = state.layers ?? DEFAULT_STATE.layers
    const updated: DesignerState = {
      ...state,
      layers: {
        ...DEFAULT_STATE.layers,
        ...safeLs,
        [layer]: [...(safeLs[layer] ?? []), crop],
      },
    }
    set(updated)
  }, [state, set])

  const removeCropFromLayer = useCallback((layer: LayerKey, cropId: string) => {
    const safeLs = state.layers ?? DEFAULT_STATE.layers
    const updated: DesignerState = {
      ...state,
      layers: {
        ...DEFAULT_STATE.layers,
        ...safeLs,
        [layer]: (safeLs[layer] ?? []).filter(c => c.id !== cropId),
      },
    }
    set(updated)
  }, [state, set])

  const loadPreset = useCallback((presetId: string, presetLayers: Record<LayerKey, LayerCropEntry[]>) => {
    set({ ...state, selectedPresetId: presetId, layers: presetLayers })
    // Sync selected model into context
    const allCrops = Object.entries(presetLayers).flatMap(([layer, crops]) =>
      crops.map(c => ({
        id: c.id,
        name: c.name,
        layer: layer as LayerKey,
        spacingM: c.spacingM,
        plantCount: c.plantCount ?? 0,
      }))
    )
    setModel({
      id: presetId,
      name: presetId,
      crops: allCrops,
      estimatedLER: 1.4,
      estimatedRevenue: '',
      estimatedYield: '',
    })
  }, [state, set, setModel])

  const clearAllLayers = useCallback(() => {
    set({
      ...state,
      layers: { canopy: [], midstory: [], understory: [], groundcover: [] },
      selectedPresetId: null,
    })
  }, [state, set])

  // -------------------------------------------------------------------------
  // Derived metrics — safeLayers is ALWAYS a complete Record<LayerKey, LayerCropEntry[]>
  // -------------------------------------------------------------------------
  const safeLayers = sanitiseLayers(state.layers)
  const totalPlants = Object.values(safeLayers).flat().length
  const layerCounts: Record<LayerKey, number> = {
    canopy:      safeLayers.canopy.length,
    midstory:    safeLayers.midstory.length,
    understory:  safeLayers.understory.length,
    groundcover: safeLayers.groundcover.length,
  }
  const farmAreaM2 = state.acres * 4046.86
  const farmWidth = Math.sqrt(farmAreaM2)
  const farmLength = farmAreaM2 / farmWidth

  // Expose state with layers guaranteed to be sanitised so consumers never
  // receive null / undefined array values from a stale localStorage entry.
  const safeState: DesignerState = { ...state, layers: safeLayers }

  return {
    state: safeState,
    updateConfig,
    addCropToLayer,
    removeCropFromLayer,
    loadPreset,
    clearAllLayers,
    undo,
    redo,
    reset: () => { reset(DEFAULT_STATE); localStorage.removeItem(LS_KEY) },
    canUndo,
    canRedo,
    totalPlants,
    layerCounts,
    farmWidth,
    farmLength,
    farmAreaM2,
    runPrediction,
  }
}
