'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icon'
import { thaToTotalTonnes, formatArea } from '@/lib/units'
import PageLayout from '@/components/layout/PageLayout'
import { useAIFarm } from '@/context/AIFarmContext'
import { PredictionSkeleton } from '@/components/skeletons'
import dynamic from 'next/dynamic'

const YieldPredictionTool = dynamic(() => import('@/components/ml/YieldPredictionTool'), { ssr: false })

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8001'

const LAYER_COLORS: Record<string, string> = {
  canopy: '#166534', midstory: '#15803d', middle: '#15803d',
  understory: '#14532d', belowground: '#a16207', groundcover: '#a16207'
}

// ---------------------------------------------------------------------------
// SHAP horizontal bar chart (pure CSS, no extra lib needed)
// ---------------------------------------------------------------------------
function SHAPBarChart({ features }: { features: { feature: string; shap_value: number }[] }) {
  if (!features || features.length === 0) return null
  const maxAbs = Math.max(...features.map(f => Math.abs(f.shap_value)), 0.001)
  return (
    <div className="space-y-2 w-full">
      {features.map((f, i) => {
        const positive = f.shap_value >= 0
        const pct = Math.abs(f.shap_value) / maxAbs * 100
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-white/50 w-36 shrink-0 truncate text-right"
              title={f.feature}>{f.feature.replace(/_/g, ' ')}</span>
            <div className="flex-1 flex items-center gap-1">
              {!positive && (
                <div className="flex-1 flex justify-end">
                  <div className="h-4 rounded-sm bg-red-500/70 transition-all"
                    style={{ width: `${pct}%`, minWidth: 2 }} />
                </div>
              )}
              <div className="w-px h-4 bg-white/20 shrink-0" />
              {positive && (
                <div className="flex-1">
                  <div className="h-4 rounded-sm bg-green-500/70 transition-all"
                    style={{ width: `${pct}%`, minWidth: 2 }} />
                </div>
              )}
            </div>
            <span className={`text-xs font-mono w-14 shrink-0 ${positive ? 'text-green-400' : 'text-red-400'}`}>
              {positive ? '+' : ''}{f.shap_value.toFixed(3)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// FIS Stress Gauge
// ---------------------------------------------------------------------------
function StressGauge({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, Math.max(0, value * 100))
  const color = pct < 30 ? '#22c55e' : pct < 60 ? '#eab308' : '#ef4444'
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/50 w-24 shrink-0">{label.replace(/_/g, ' ')}</span>
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono text-white/70 w-10 text-right">{(value * 100).toFixed(0)}%</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Layer result card
// ---------------------------------------------------------------------------
interface LayerPrediction {
  predicted_yield_t_ha: number
  ci_80_low: number
  ci_80_high: number
  top_shap_features: { feature: string; shap_value: number }[]
  fis_stress_scores: Record<string, number>
  weights_used: number[]
}

function LayerResultCard({ layer, pred }: { layer: string; pred: LayerPrediction }) {
  const [expanded, setExpanded] = useState(false)
  const color = LAYER_COLORS[layer] ?? '#166534'
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <button className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-semibold capitalize text-white">{layer}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-green-400">
            {pred.predicted_yield_t_ha.toFixed(2)} tonnes/acre
          </span>
          <span className="text-xs text-white/40">
            [{pred.ci_80_low.toFixed(1)}–{pred.ci_80_high.toFixed(1)}]
          </span>
          {expanded ? <Icon name="expand_less" size={16} /> : <Icon name="expand_more" size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div key="detail"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 space-y-5">
              {/* SHAP */}
              {pred.top_shap_features.length > 0 && (
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Icon name="bar_chart" size={12} /> SHAP Feature Contributions
                  </div>
                  <SHAPBarChart features={pred.top_shap_features} />
                </div>
              )}
              {/* FIS Stress */}
              {Object.keys(pred.fis_stress_scores).length > 0 && (
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Icon name="bolt" size={12} /> FIS Stress Scores
                  </div>
                  <div className="space-y-2">
                    {Object.entries(pred.fis_stress_scores).map(([k, v]) => (
                      <StressGauge key={k} label={k} value={v} />
                    ))}
                  </div>
                </div>
              )}
              {/* Model weights */}
              {pred.weights_used.length > 0 && (
                <div className="text-xs text-white/30 flex items-center gap-2">
                  <Icon name="info" size={12} />
                  Ensemble weights (FIS/RF/CB/ELM): {pred.weights_used.map(w => (w * 100).toFixed(0) + '%').join(' · ')}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
interface FullPrediction {
  prediction_id: string
  farm_id: string
  timestamp: string
  layers: Record<string, LayerPrediction>
  system_LER: number
  optimal_geometry_recommendation: string
  model_version: string
  nlp_explanation?: string
}

export default function PredictPage() {
  const { currentFarm, addPrediction } = useAIFarm()
  const [result, setResult]      = useState<FullPrediction | null>(null)
  const [loading, setLoading]    = useState(false)
  const [error, setError]        = useState<string | null>(null)
  const [showManual, setShowManual] = useState(false)
  const [mounted, setMounted]    = useState(false)
  const hasAutoRun = useRef(false)

  useEffect(() => { setMounted(true) }, [])

  // Build a minimal predict body from AIFarmContext
  const buildAutoBody = useCallback(() => {
    const farm = currentFarm
    const layers = ['canopy', 'middle', 'understory', 'belowground'].map(l => ({
      layer: l,
      crop_species: l === 'canopy' ? 'coconut' : l === 'middle' ? 'banana' : l === 'understory' ? 'ginger' : 'turmeric',
      LAI: l === 'canopy' ? 4.5 : 2.0,
      k_coeff: 0.5,
      row_spacing_m: l === 'canopy' ? 8 : l === 'middle' ? 3 : 1,
      soil_N: 120, soil_P: 40, soil_K: 180, soil_pH: 6.2,
      VWC: 0.28, GDD: 1800, rainfall_7d: 45,
      solar_elevation_deg: 55,
      root_depth_cm: l === 'canopy' ? 200 : 60,
      root_radius_cm: l === 'canopy' ? 150 : 40,
      canopy_height_m: l === 'canopy' ? 20 : l === 'middle' ? 5 : 1,
      path_width_m: 1.5, crop_density: 0.7,
      shade_fraction: l === 'canopy' ? 0 : l === 'middle' ? 0.35 : 0.6,
      root_length_density: 1.2,
    }))
    return {
      farm_id: farm?.name ? farm.name.replace(/\s+/g, '_').toLowerCase() : 'farm-001',
      timestamp: new Date().toISOString(),
      layers,
    }
  }, [currentFarm])

  const runPrediction = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const body = buildAutoBody()
      const res = await fetch(`${API_BASE}/ml/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Backend returned ${res.status}`)
      const data: FullPrediction = await res.json()
      setResult(data)
      // Sync to global context
      addPrediction({
        prediction_id: data.prediction_id,
        farm_id: data.farm_id,
        timestamp: data.timestamp,
        layers: data.layers as any,
        system_LER: data.system_LER,
        optimal_geometry_recommendation: data.optimal_geometry_recommendation,
        model_version: data.model_version,
      })
    } catch (e: any) {
      setError(e.message ?? 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }, [buildAutoBody, addPrediction])

  // Auto-run on mount if farm context is available
  useEffect(() => {
    if (!hasAutoRun.current && currentFarm) {
      hasAutoRun.current = true
      runPrediction()
    }
  }, [currentFarm, runPrediction])

  const totalYield = result
    ? Object.values(result.layers).reduce((s, l) => s + l.predicted_yield_t_ha, 0)
    : null

  return (
    <PageLayout title="Yield Prediction">
      <div className="space-y-6 max-w-4xl">

        {/* Header + controls */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Yield Prediction</h2>
            <p className="text-sm text-white/50 mt-1">FOHEM ensemble · FIS + RF + CatBoost + ELM</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowManual(m => !m)}
              className="px-4 py-2 rounded-xl border border-white/20 text-white/60 hover:text-white text-sm transition-colors">
              {showManual ? 'Hide' : 'Manual Input'}
            </button>
            <button onClick={runPrediction} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
              {loading ? <Icon name="progress_activity" size={15} className="animate-spin" /> : <Icon name="refresh" size={15} />}
              {loading ? 'Running…' : 'Re-run'}
            </button>
          </div>
        </div>

        {/* Farm context pill */}
        {mounted && currentFarm && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-sm">
            <Icon name="check_circle" size={15} className="text-green-400" />
            <span className="text-green-400 font-medium">Using farm: {currentFarm.name}</span>
            <span className="text-white/40">· {currentFarm.acres} acres · {currentFarm.region}</span>
          </div>
        )}

        {/* Loading */}
        {loading && !result && <PredictionSkeleton />}

        {/* Error */}
        {mounted && error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <Icon name="warning" size={16} />
            <span>{error}</span>
            {!currentFarm && (
              <span className="text-white/40 ml-2">· Set up a farm in <a href="/designer" className="underline">Designer</a> for richer predictions</span>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* System summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{result.system_LER.toFixed(2)}</div>
                <div className="text-xs text-white/40 mt-1">System LER</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-3xl font-bold text-white">{totalYield?.toFixed(1)} tonnes</div>
                <div className="text-xs text-white/40 mt-1">Total Yield</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-sm font-medium text-white/70 leading-snug">{result.model_version}</div>
                <div className="text-xs text-white/40 mt-1">Model version</div>
              </div>
            </div>

            {/* Natural language explanation */}
            {(result.nlp_explanation || result.optimal_geometry_recommendation) && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/40 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Icon name="psychology" size={12} /> AI Explanation
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {result.nlp_explanation ?? result.optimal_geometry_recommendation}
                </p>
              </div>
            )}

            {/* Per-layer cards */}
            <div className="space-y-3">
              {Object.entries(result.layers).map(([layer, pred]) => (
                <LayerResultCard key={layer} layer={layer} pred={pred} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Manual input toggle */}
        <AnimatePresence>
          {showManual && (
            <motion.div key="manual"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <div className="px-5 py-3 bg-white/5 text-sm font-medium text-white/70 border-b border-white/10">
                  Manual Prediction Input
                </div>
                <div className="p-4">
                  <YieldPredictionTool onExplain={(id, layer) => {
                    // scroll to result on manual run
                  }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  )
}
