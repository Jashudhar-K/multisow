'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icon';// ============================================================================
// TYPES
// ============================================================================

interface LayerFormData {
  layer: 'canopy' | 'middle' | 'understory' | 'belowground'
  crop_species: string
  LAI: number
  k_coeff: number
  row_spacing_m: number
  soil_N: number
  soil_P: number
  soil_K: number
  soil_pH: number
  VWC: number
  GDD: number
  rainfall_7d: number
  solar_elevation_deg: number
  root_depth_cm: number
  root_radius_cm: number
  canopy_height_m: number
  path_width_m: number
  crop_density: number
  shade_fraction: number
  root_length_density: number
}

interface LayerPrediction {
  predicted_yield_t_ha: number
  ci_80_low: number
  ci_80_high: number
  top_shap_features: { feature: string; shap_value: number }[]
  fis_stress_scores: Record<string, number>
  weights_used: number[]
}

interface PredictionResult {
  prediction_id: string
  farm_id: string
  timestamp: string
  layers: Record<string, LayerPrediction>
  system_LER: number
  optimal_geometry_recommendation: string
  model_version: string
  nlp_explanation?: string // <-- Add this field for LLM summary
}

// ============================================================================
// LAYER DEFAULTS
// ============================================================================

const LAYER_DEFAULTS: Record<string, Partial<LayerFormData>> = {
  canopy: {
    crop_species: 'coconut',
    LAI: 4.5,
    k_coeff: 0.5,
    row_spacing_m: 8.0,
    root_depth_cm: 200,
    root_radius_cm: 150,
    canopy_height_m: 20.0,
    shade_fraction: 0.0,
  },
  middle: {
    crop_species: 'banana',
    LAI: 3.5,
    k_coeff: 0.65,
    row_spacing_m: 3.0,
    root_depth_cm: 60,
    root_radius_cm: 80,
    canopy_height_m: 4.0,
    shade_fraction: 0.3,
  },
  understory: {
    crop_species: 'turmeric',
    LAI: 2.5,
    k_coeff: 0.4,
    row_spacing_m: 0.5,
    root_depth_cm: 30,
    root_radius_cm: 20,
    canopy_height_m: 0.8,
    shade_fraction: 0.5,
  },
  belowground: {
    crop_species: 'ginger',
    LAI: 1.5,
    k_coeff: 0.3,
    row_spacing_m: 0.3,
    root_depth_cm: 25,
    root_radius_cm: 15,
    canopy_height_m: 0.5,
    shade_fraction: 0.6,
  },
}

function makeDefault(layer: string): LayerFormData {
  const d = LAYER_DEFAULTS[layer] ?? {}
  return {
    layer: layer as LayerFormData['layer'],
    crop_species: d.crop_species ?? '',
    LAI: d.LAI ?? 3.0,
    k_coeff: d.k_coeff ?? 0.5,
    row_spacing_m: d.row_spacing_m ?? 2.0,
    soil_N: 200,
    soil_P: 25,
    soil_K: 150,
    soil_pH: 6.5,
    VWC: 0.3,
    GDD: 3000,
    rainfall_7d: 50,
    solar_elevation_deg: 45,
    root_depth_cm: d.root_depth_cm ?? 50,
    root_radius_cm: d.root_radius_cm ?? 30,
    canopy_height_m: d.canopy_height_m ?? 5.0,
    path_width_m: 1.0,
    crop_density: 0.5,
    shade_fraction: d.shade_fraction ?? 0.0,
    root_length_density: 1.0,
  }
}

// ============================================================================
// LAYER COLORS
// ============================================================================

const LAYER_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  canopy: { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  middle: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  understory: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  belowground: { text: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/30' },
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function LayerInputCard({
  data,
  onChange,
  onRemove,
  expanded,
  onToggle,
}: {
  data: LayerFormData
  onChange: (d: LayerFormData) => void
  onRemove: () => void
  expanded: boolean
  onToggle: () => void
}) {
  const c = LAYER_COLORS[data.layer] ?? LAYER_COLORS.canopy
  const upd = (key: keyof LayerFormData, val: string | number) =>
    onChange({ ...data, [key]: typeof val === 'string' ? val : Number(val) })

  return (
    <motion.div
      layout
      className={`glass border ${c.border} rounded-xl overflow-hidden`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between w-full px-4 py-3">
        <button
          onClick={onToggle}
          className="flex items-center justify-between flex-1 text-left"
        >
          <div className="flex items-center gap-2">
            <Icon name="layers" className={`w-4 h-4 ${c.text}`} />
            <span className={`font-semibold capitalize ${c.text}`}>{data.layer}</span>
            <span className="text-neutral-400 text-sm">— {data.crop_species || 'no crop'}</span>
          </div>
          {expanded ? <Icon name="expand_less" className="w-4 h-4 text-neutral-400" /> : <Icon name="expand_more" className="w-4 h-4 text-neutral-400" />}
        </button>
        <button
          onClick={onRemove}
          className="text-red-400 text-xs hover:text-red-300 px-2 py-1 rounded ml-2"
        >
          Remove
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
              <Field label="Crop Species" value={data.crop_species} onChange={v => upd('crop_species', v)} type="text" />
              <Field label="LAI" value={data.LAI} onChange={v => upd('LAI', v)} step={0.1} min={0} max={10} />
              <Field label="k Coeff" value={data.k_coeff} onChange={v => upd('k_coeff', v)} step={0.05} min={0.2} max={0.8} />
              <Field label="Row Spacing (m)" value={data.row_spacing_m} onChange={v => upd('row_spacing_m', v)} step={0.1} min={0.3} max={10} />
              <Field label="Soil N (mg/kg)" value={data.soil_N} onChange={v => upd('soil_N', v)} min={0} />
              <Field label="Soil P (mg/kg)" value={data.soil_P} onChange={v => upd('soil_P', v)} min={0} />
              <Field label="Soil K (cmol/kg)" value={data.soil_K} onChange={v => upd('soil_K', v)} min={0} />
              <Field label="Soil pH" value={data.soil_pH} onChange={v => upd('soil_pH', v)} step={0.1} min={3} max={11} />
              <Field label="VWC" value={data.VWC} onChange={v => upd('VWC', v)} step={0.01} min={0} max={0.6} />
              <Field label="GDD" value={data.GDD} onChange={v => upd('GDD', v)} min={0} />
              <Field label="Rainfall 7d (mm)" value={data.rainfall_7d} onChange={v => upd('rainfall_7d', v)} min={0} />
              <Field label="Solar Elev (°)" value={data.solar_elevation_deg} onChange={v => upd('solar_elevation_deg', v)} min={0} max={90} />
              <Field label="Root Depth (cm)" value={data.root_depth_cm} onChange={v => upd('root_depth_cm', v)} min={1} max={300} />
              <Field label="Root Radius (cm)" value={data.root_radius_cm} onChange={v => upd('root_radius_cm', v)} min={1} max={300} />
              <Field label="Canopy Ht (m)" value={data.canopy_height_m} onChange={v => upd('canopy_height_m', v)} step={0.1} min={0.1} max={30} />
              <Field label="Path Width (m)" value={data.path_width_m} onChange={v => upd('path_width_m', v)} step={0.1} min={0.1} max={10} />
              <Field label="Crop Density" value={data.crop_density} onChange={v => upd('crop_density', v)} step={0.05} min={0} max={1} />
              <Field label="Shade Fraction" value={data.shade_fraction} onChange={v => upd('shade_fraction', v)} step={0.05} min={0} max={1} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'number',
  step,
  min,
  max,
}: {
  label: string
  value: string | number
  onChange: (v: string | number) => void
  type?: string
  step?: number
  min?: number
  max?: number
}) {
  return (
    <div>
      <label className="block text-xs text-neutral-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        step={step}
        min={min}
        max={max}
        title={label}
        placeholder={label}
        className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-green-500/50 focus:outline-none transition"
      />
    </div>
  )
}

// Results components

function ShapMiniChart({ features }: { features: { feature: string; shap_value: number }[] }) {
  if (!features.length) return <span className="text-neutral-500 text-xs">No SHAP data</span>
  const maxAbs = Math.max(...features.map((f) => Math.abs(f.shap_value)), 0.01)
  return (
    <div className="space-y-1.5 mt-2">
      {features.map((f, i) => {
        const pct = (Math.abs(f.shap_value) / maxAbs) * 100
        const positive = f.shap_value >= 0
        return (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-28 text-neutral-400 truncate text-right" title={f.feature}>{f.feature}</span>
            <div className="flex-1 flex items-center">
              <div
                className={`h-3 rounded ${positive ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.max(pct, 4)}%` }}
              />
            </div>
            <span className={`w-14 text-right ${positive ? 'text-green-400' : 'text-red-400'}`}>
              {f.shap_value > 0 ? '+' : ''}{f.shap_value.toFixed(3)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function FISScores({ scores }: { scores: Record<string, number> }) {
  const entries = Object.entries(scores)
  if (!entries.length) return <span className="text-neutral-500 text-xs">No FIS data</span>
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between px-2 py-1 rounded bg-white/5 text-xs">
          <span className="text-neutral-400 truncate" title={k}>{k.replace(/_/g, ' ')}</span>
          <span className={v > 0.6 ? 'text-red-400 font-semibold' : v > 0.3 ? 'text-yellow-400' : 'text-green-400'}>
            {v.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )
}

function LayerResultCard({
  layerName,
  pred,
  onExplain,
}: {
  layerName: string
  pred: LayerPrediction
  onExplain?: (layer: string) => void
}) {
  const c = LAYER_COLORS[layerName] ?? LAYER_COLORS.canopy
  const [tab, setTab] = useState<'overview' | 'shap' | 'fis'>('overview')

  return (
    <div className={`glass border ${c.border} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`font-semibold capitalize ${c.text}`}>{layerName} Layer</h4>
        {onExplain && (
          <button
            onClick={() => onExplain(layerName)}
            className="text-xs text-green-400 hover:text-green-300 underline"
          >
            Explain →
          </button>
        )}
      </div>

      {/* Yield + CI */}
      <div className="text-center mb-3">
        <div className="text-3xl font-bold text-white">{pred.predicted_yield_t_ha}</div>
        <div className="text-xs text-neutral-400">t/ha predicted yield</div>
        <div className="text-xs text-neutral-500 mt-1">
          80% CI: [{pred.ci_80_low} — {pred.ci_80_high}]
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 mb-3">
        {(['overview', 'shap', 'fis'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs px-3 py-1.5 capitalize ${
              tab === t ? 'text-green-400 border-b-2 border-green-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t === 'fis' ? 'FIS Stress' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="text-xs space-y-1 text-neutral-300">
          <div className="flex justify-between">
            <span>Weights used</span>
            <span className="text-white">[{pred.weights_used.map(w => w.toFixed(2)).join(', ')}]</span>
          </div>
          <div className="flex justify-between">
            <span>SHAP features</span>
            <span className="text-white">{pred.top_shap_features.length}</span>
          </div>
          <div className="flex justify-between">
            <span>FIS scores</span>
            <span className="text-white">{Object.keys(pred.fis_stress_scores).length}</span>
          </div>
        </div>
      )}
      {tab === 'shap' && <ShapMiniChart features={pred.top_shap_features} />}
      {tab === 'fis' && <FISScores scores={pred.fis_stress_scores} />}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function YieldPredictionTool({
  onExplain,
}: {
  onExplain?: (predictionId: string, layer: string) => void
}) {
  const [farmId, setFarmId] = useState('farm-001')
  const [layers, setLayers] = useState<LayerFormData[]>([
    makeDefault('canopy'),
    makeDefault('middle'),
    makeDefault('understory'),
  ])
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState('')

  const addLayer = (layer: string) => {
    if (layers.some((l) => l.layer === layer)) return
    setLayers([...layers, makeDefault(layer)])
    setExpandedIdx(layers.length)
  }

  const removeLayer = (idx: number) => {
    setLayers(layers.filter((_, i) => i !== idx))
    setExpandedIdx(null)
  }

  const handlePredict = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farm_id: farmId, layers }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.detail || `HTTP ${res.status}`)
      }
      const data: PredictionResult = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message ?? 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }

  const unusedLayers = ['canopy', 'middle', 'understory', 'belowground'].filter(
    (l) => !layers.some((ld) => ld.layer === l)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Icon name="trending_up" className="w-5 h-5 text-green-400" />
            Yield Prediction
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Run FOHEM prediction for multi-layer intercropping — per-layer yield, confidence intervals, SHAP, and FIS.
          </p>
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Farm ID</label>
          <input
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
            title="Farm ID"
            placeholder="Enter farm ID"
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-green-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Layer inputs */}
      <div className="space-y-3">
        {layers.map((ld, i) => (
          <LayerInputCard
            key={ld.layer}
            data={ld}
            onChange={(d) => {
              const next = [...layers]
              next[i] = d
              setLayers(next)
            }}
            onRemove={() => removeLayer(i)}
            expanded={expandedIdx === i}
            onToggle={() => setExpandedIdx(expandedIdx === i ? null : i)}
          />
        ))}
      </div>

      {/* Add layer + Run */}
      <div className="flex flex-wrap items-center gap-3">
        {unusedLayers.map((l) => (
          <button
            key={l}
            onClick={() => addLayer(l)}
            className="text-xs px-3 py-1.5 border border-dashed border-white/20 rounded-lg text-neutral-400 hover:text-green-400 hover:border-green-400/40 transition capitalize"
          >
            + {l}
          </button>
        ))}
        <div className="ml-auto">
          <button
            onClick={handlePredict}
            disabled={loading || layers.length === 0}
            className="px-6 py-2.5 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {loading ? <Icon name="progress_activity" className="w-4 h-4 animate-spin" /> : <Icon name="bar_chart" className="w-4 h-4" />}
            {loading ? 'Predicting…' : 'Run Prediction'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <Icon name="warning" className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium text-sm">Prediction Failed</p>
            <p className="text-neutral-400 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* System summary */}
            <div className="glass rounded-xl p-5 border border-green-500/20">
              <div className="flex flex-wrap items-center gap-6 mb-3">
                <div>
                  <div className="text-xs text-neutral-400">System LER</div>
                  <div className={`text-2xl font-bold ${result.system_LER >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                    {result.system_LER}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Model</div>
                  <div className="text-sm text-white">{result.model_version}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-400">Prediction ID</div>
                  <div className="text-sm text-white font-mono">{result.prediction_id.slice(0, 8)}…</div>
                </div>
              </div>
              {result.optimal_geometry_recommendation && (
                <p className="text-sm text-neutral-300 flex items-start gap-2">
                  <Icon name="eco" className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  {result.optimal_geometry_recommendation}
                </p>
              )}
            </div>

            {/* NLP Summary */}
            {result.nlp_explanation && (
              <div className="glass border border-cyan-500/20 rounded-xl p-5 mb-4">
                <h3 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                  <Icon name="lightbulb" className="w-4 h-4" />
                  AI Summary
                </h3>
                <p className="text-sm text-neutral-200 leading-relaxed">{result.nlp_explanation}</p>
              </div>
            )}

            {/* Per-layer cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(result.layers).map(([name, pred]) => (
                <LayerResultCard
                  key={name}
                  layerName={name}
                  pred={pred}
                  onExplain={
                    onExplain
                      ? (layer) => onExplain(result.prediction_id, layer)
                      : undefined
                  }
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
