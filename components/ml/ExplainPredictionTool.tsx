'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icon';// ============================================================================
// TYPES
// ============================================================================

interface ExplainResult {
  prediction_id: string
  farm_id: string
  layer: string
  shap_waterfall: { feature: string; shap_value: number }[]
  lime_contributions: { feature: string; weight: number }[]
  natural_language_summary: string
  regional_summary: string
  recommendation_actions: string[]
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function WaterfallChart({ data }: { data: { feature: string; shap_value: number }[] }) {
  if (!data.length) return <p className="text-neutral-500 text-sm">No SHAP waterfall data available.</p>
  const sorted = [...data].sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
  const maxAbs = Math.max(...sorted.map((d) => Math.abs(d.shap_value)), 0.01)

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
        <Icon name="trending_up" className="w-4 h-4 text-green-400" />
        SHAP Waterfall
      </h4>
      {sorted.map((item, i) => {
        const pct = (Math.abs(item.shap_value) / maxAbs) * 100
        const positive = item.shap_value >= 0
        return (
          <motion.div
            key={item.feature}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: positive ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="w-36 text-xs text-neutral-400 text-right truncate" title={item.feature}>
              {item.feature}
            </span>
            <div className="flex-1 relative h-5 flex items-center">
              {positive ? (
                <div className="bg-green-500/80 h-4 rounded-r" style={{ width: `${Math.max(pct, 3)}%` }} />
              ) : (
                <div className="flex justify-end w-full">
                  <div className="bg-red-500/80 h-4 rounded-l" style={{ width: `${Math.max(pct, 3)}%` }} />
                </div>
              )}
            </div>
            <span className={`w-16 text-xs text-right font-mono ${positive ? 'text-green-400' : 'text-red-400'}`}>
              {item.shap_value > 0 ? '+' : ''}{item.shap_value.toFixed(4)}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

function LimeChart({ data }: { data: { feature: string; weight: number }[] }) {
  if (!data.length) return <p className="text-neutral-500 text-sm">No LIME data available.</p>
  const sorted = [...data].sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
  const maxAbs = Math.max(...sorted.map((d) => Math.abs(d.weight)), 0.01)

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
        <Icon name="psychology" className="w-4 h-4 text-cyan-400" />
        LIME Contributions
      </h4>
      {sorted.map((item, i) => {
        const pct = (Math.abs(item.weight) / maxAbs) * 100
        const positive = item.weight >= 0
        return (
          <motion.div
            key={item.feature}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: positive ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="w-36 text-xs text-neutral-400 text-right truncate" title={item.feature}>
              {item.feature}
            </span>
            <div className="flex-1 relative h-5 flex items-center">
              {positive ? (
                <div className="bg-cyan-500/70 h-4 rounded-r" style={{ width: `${Math.max(pct, 3)}%` }} />
              ) : (
                <div className="flex justify-end w-full">
                  <div className="bg-rose-500/70 h-4 rounded-l" style={{ width: `${Math.max(pct, 3)}%` }} />
                </div>
              )}
            </div>
            <span className={`w-16 text-xs text-right font-mono ${positive ? 'text-cyan-400' : 'text-rose-400'}`}>
              {item.weight > 0 ? '+' : ''}{item.weight.toFixed(4)}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExplainPredictionTool({ 
  defaultPredictionId,
  defaultLayer,
}: { 
  defaultPredictionId?: string
  defaultLayer?: string 
}) {
  const [predictionId, setPredictionId] = useState(defaultPredictionId ?? '')
  const [layer, setLayer] = useState(defaultLayer ?? 'canopy')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ExplainResult | null>(null)
  const [error, setError] = useState('')

  // Update state when props change
  const handleSetPredictionId = (id: string) => {
    setPredictionId(id)
  }

  const handleSetLayer = (l: string) => {
    setLayer(l)
  }

  // Expose a way to set from parent (this will be called via useEffect in parent)
  if (typeof window !== 'undefined') {
    (window as any).__setExplainPredictionId = handleSetPredictionId;
    (window as any).__setExplainLayer = handleSetLayer;
  }

  const handleExplain = async () => {
    if (!predictionId.trim()) {
      setError('Please enter a prediction ID (from the Yield Prediction tool).')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`/ml/explain/${predictionId}?layer=${layer}`)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.detail || `HTTP ${res.status}`)
      }
      const data: ExplainResult = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message ?? 'Explain request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Icon name="psychology" className="w-5 h-5 text-cyan-400" />
          Explain Prediction
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Understand why the model predicted a particular yield — SHAP waterfall, LIME contributions, and actionable recommendations.
        </p>
      </div>

      {/* Input */}
      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-xs text-neutral-400 block mb-1">Prediction ID</label>
          <input
            value={predictionId}
            onChange={(e) => setPredictionId(e.target.value)}
            placeholder="e.g. a1b2c3d4-…"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-cyan-500/50 focus:outline-none transition"
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="text-xs text-neutral-400 block mb-1">Layer</label>
          <select
            value={layer}
            onChange={(e) => setLayer(e.target.value)}
            title="Layer"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-cyan-500/50 focus:outline-none transition"
          >
            <option value="canopy">Canopy</option>
            <option value="middle">Middle</option>
            <option value="understory">Understory</option>
            <option value="belowground">Belowground</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleExplain}
            disabled={loading}
            className="px-6 py-2 bg-cyan-500 text-black font-semibold rounded-xl hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {loading ? <Icon name="progress_activity" className="w-4 h-4 animate-spin" /> : <Icon name="psychology" className="w-4 h-4" />}
            {loading ? 'Explaining…' : 'Explain'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <Icon name="warning" className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium text-sm">Explain Failed</p>
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
            {/* Natural language summary */}
            {result.natural_language_summary && (
              <div className="glass border border-cyan-500/20 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                  <Icon name="lightbulb" className="w-4 h-4" />
                  Summary
                </h3>
                <p className="text-sm text-neutral-200 leading-relaxed">{result.natural_language_summary}</p>
                {result.regional_summary && (
                  <p className="text-xs text-neutral-400 mt-2">{result.regional_summary}</p>
                )}
              </div>
            )}

            {/* Charts side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4">
                <WaterfallChart data={result.shap_waterfall} />
              </div>
              <div className="glass rounded-xl p-4">
                <LimeChart data={result.lime_contributions} />
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendation_actions.length > 0 && (
              <div className="glass rounded-xl p-4 border border-green-500/20">
                <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <Icon name="lightbulb" className="w-4 h-4" />
                  Recommended Actions
                </h3>
                <ul className="space-y-2">
                  {result.recommendation_actions.map((action, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-2 text-sm text-neutral-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Icon name="chevron_right" className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      {action}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
