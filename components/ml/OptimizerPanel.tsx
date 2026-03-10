'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icon';// ============================================================================
// TYPES
// ============================================================================

interface CropRecommendation {
  crop: string | null
  spacing_m: number
  plants_per_hectare: number
  expected_yield_t_ha: number
}

interface OptMetrics {
  total_yield_t_ha: number
  ler: number
  competition_index: number
  light_efficiency: number
  net_profit_inr_ha: number
  establishment_cost_inr_ha: number
  annual_revenue_inr_ha: number
}

interface StrataRec {
  rank: number
  canopy: CropRecommendation
  middle: CropRecommendation
  understory: CropRecommendation
  metrics: OptMetrics
  synergy_notes: string[]
  warnings: string[]
}

interface OptResponse {
  optimization_id: string
  farm_id: string
  timestamp: string
  acres: number
  soil_type: string
  recommendations: StrataRec[]
  pareto_front_size: number
  optimization_stats: Record<string, any>
  natural_language_summary: string
}

interface QuickRec {
  recommendations: Record<string, any>[]
  execution_time_ms: number
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function MetricBadge({
  label,
  value,
  unit,
  good,
}: {
  label: string
  value: string | number
  unit?: string
  good?: boolean
}) {
  return (
    <div className="text-center">
      <div className={`text-lg font-bold ${good === undefined ? 'text-white' : good ? 'text-green-400' : 'text-red-400'}`}>
        {value}{unit && <span className="text-xs ml-0.5">{unit}</span>}
      </div>
      <div className="text-[10px] text-neutral-400">{label}</div>
    </div>
  )
}

function RecCard({ rec, expanded, onToggle }: { rec: StrataRec; expanded: boolean; onToggle: () => void }) {
  const m = rec.metrics
  return (
    <motion.div
      layout
      className="glass rounded-xl border border-white/10 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rec.rank * 0.05 }}
    >
      <button onClick={onToggle} className="w-full px-4 py-3 flex items-center justify-between text-left">
        <div className="flex items-center gap-3">
          {rec.rank === 1 ? (
            <Icon name="emoji_events" className="w-5 h-5 text-yellow-400" />
          ) : (
            <span className="w-5 h-5 flex items-center justify-center text-neutral-400 text-sm font-bold">#{rec.rank}</span>
          )}
          <div className="flex gap-2">
            {rec.canopy.crop && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">{rec.canopy.crop}</span>}
            {rec.middle.crop && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">{rec.middle.crop}</span>}
            {rec.understory.crop && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">{rec.understory.crop}</span>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-sm font-semibold ${m.ler >= 1 ? 'text-green-400' : 'text-red-400'}`}>
            LER {m.ler.toFixed(2)}
          </span>
          <span className="text-sm text-white font-semibold">{m.total_yield_t_ha} t/ha</span>
          {expanded ? <Icon name="expand_less" className="w-4 h-4 text-neutral-400" /> : <Icon name="expand_more" className="w-4 h-4 text-neutral-400" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            {/* Metrics row */}
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 py-3 border-t border-white/5">
              <MetricBadge label="Yield" value={m.total_yield_t_ha} unit="t/ha" />
              <MetricBadge label="LER" value={m.ler.toFixed(2)} good={m.ler >= 1} />
              <MetricBadge label="Competition" value={m.competition_index.toFixed(2)} good={m.competition_index < 0.5} />
              <MetricBadge label="Light Eff." value={(m.light_efficiency * 100).toFixed(0)} unit="%" />
              <MetricBadge label="Profit" value={`₹${(m.net_profit_inr_ha / 1000).toFixed(0)}k`} />
              <MetricBadge label="Setup Cost" value={`₹${(m.establishment_cost_inr_ha / 1000).toFixed(0)}k`} />
              <MetricBadge label="Revenue" value={`₹${(m.annual_revenue_inr_ha / 1000).toFixed(0)}k`} />
            </div>

            {/* Per-layer detail */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {[
                { label: 'Canopy', data: rec.canopy, color: 'green' },
                { label: 'Middle', data: rec.middle, color: 'yellow' },
                { label: 'Understory', data: rec.understory, color: 'orange' },
              ].map(({ label, data, color }) => (
                <div key={label} className={`bg-white/5 rounded-lg p-3 border border-${color}-500/10`}>
                  <h5 className={`text-xs font-semibold text-${color}-400 mb-1`}>{label}</h5>
                  <p className="text-sm text-white font-medium">{data.crop ?? '—'}</p>
                  <div className="text-xs text-neutral-400 mt-1 space-y-0.5">
                    <div>Spacing: {data.spacing_m}m</div>
                    <div>Plants/ha: {data.plants_per_hectare.toLocaleString()}</div>
                    <div>Yield: {data.expected_yield_t_ha} t/ha</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Synergy + warnings */}
            {rec.synergy_notes.length > 0 && (
              <div className="mt-3 space-y-1">
                {rec.synergy_notes.map((n, i) => (
                  <div key={i} className="text-xs text-green-400 flex items-center gap-1">
                    <Icon name="eco" className="w-3 h-3" /> {n}
                  </div>
                ))}
              </div>
            )}
            {rec.warnings.length > 0 && (
              <div className="mt-2 space-y-1">
                {rec.warnings.map((w, i) => (
                  <div key={i} className="text-xs text-yellow-400 flex items-center gap-1">
                    <Icon name="error" className="w-3 h-3" /> {w}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// MAIN
// ============================================================================

export default function OptimizerPanel() {
  const [mode, setMode] = useState<'strata' | 'quick'>('strata')

  // Strata form
  const [farmId, setFarmId] = useState('farm-001')
  const [acres, setAcres] = useState(2.0)
  const [soilType, setSoilType] = useState('laterite')
  const [goal, setGoal] = useState('balanced')
  const [popSize, setPopSize] = useState(100)
  const [gens, setGens] = useState(50)
  const [nRecs, setNRecs] = useState(5)
  const [budgetLimit, setBudgetLimit] = useState<number | ''>('')
  const [minLer, setMinLer] = useState(0)

  // Quick form
  const [qSoil, setQSoil] = useState('laterite')
  const [qAcres, setQAcres] = useState(2.0)
  const [qBudget, setQBudget] = useState<number | ''>('')
  const [qCanopy, setQCanopy] = useState('')
  const [qNRecs, setQNRecs] = useState(3)

  // State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [strataResult, setStrataResult] = useState<OptResponse | null>(null)
  const [quickResult, setQuickResult] = useState<QuickRec | null>(null)
  const [expandedRec, setExpandedRec] = useState<number>(0)

  const runStrata = async () => {
    setLoading(true)
    setError('')
    setStrataResult(null)
    try {
      const res = await fetch('/ml/optimize/strata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm_id: farmId,
          acres,
          environment: { soil_type: soilType },
          constraints: {
            min_ler: minLer,
            budget_limit_inr: budgetLimit || undefined,
          },
          optimization_goal: goal,
          population_size: popSize,
          n_generations: gens,
          n_recommendations: nRecs,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `HTTP ${res.status}`)
      }
      setStrataResult(await res.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const runQuick = async () => {
    setLoading(true)
    setError('')
    setQuickResult(null)
    try {
      const res = await fetch('/ml/optimize/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soil_type: qSoil,
          acres: qAcres,
          budget_inr: qBudget || undefined,
          preferred_canopy: qCanopy || undefined,
          n_recommendations: qNRecs,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `HTTP ${res.status}`)
      }
      setQuickResult(await res.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Icon name="memory" className="w-5 h-5 text-purple-400" />
          Strata Optimizer
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          NSGA-II genetic algorithm to find Pareto-optimal multi-tier crop configurations maximising yield, LER, and profit.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        {(['strata', 'quick'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === m ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            {m === 'strata' ? (
              <span className="flex items-center gap-1.5"><Icon name="layers" className="w-4 h-4" /> Full Strata</span>
            ) : (
              <span className="flex items-center gap-1.5"><Icon name="bolt" className="w-4 h-4" /> Quick</span>
            )}
          </button>
        ))}
      </div>

      {/* Forms */}
      {mode === 'strata' ? (
        <div className="glass rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Farm ID</label>
              <input value={farmId} onChange={(e) => setFarmId(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Acres</label>
              <input type="number" value={acres} onChange={(e) => setAcres(Number(e.target.value))} min={0.1} max={1000} step={0.5} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Soil Type</label>
              <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none">
                <option value="laterite">Laterite</option>
                <option value="alluvial">Alluvial</option>
                <option value="red">Red</option>
                <option value="black">Black</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Goal</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none">
                <option value="balanced">Balanced</option>
                <option value="maximize_yield">Maximize Yield</option>
                <option value="maximize_profit">Maximize Profit</option>
                <option value="maximize_ler">Maximize LER</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Population Size</label>
              <input type="number" value={popSize} onChange={(e) => setPopSize(Number(e.target.value))} min={20} max={500} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Generations</label>
              <input type="number" value={gens} onChange={(e) => setGens(Number(e.target.value))} min={10} max={200} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1"># Recs</label>
              <input type="number" value={nRecs} onChange={(e) => setNRecs(Number(e.target.value))} min={1} max={20} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Min LER</label>
              <input type="number" value={minLer} onChange={(e) => setMinLer(Number(e.target.value))} min={0} max={3} step={0.1} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Budget Limit (₹)</label>
              <input type="number" value={budgetLimit} onChange={(e) => setBudgetLimit(e.target.value ? Number(e.target.value) : '')} min={0} placeholder="No limit" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none" />
            </div>
          </div>
          <button
            onClick={runStrata}
            disabled={loading}
            className="px-6 py-2.5 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {loading ? <Icon name="progress_activity" className="w-4 h-4 animate-spin" /> : <Icon name="memory" className="w-4 h-4" />}
            {loading ? 'Optimizing…' : 'Run Optimization'}
          </button>
        </div>
      ) : (
        <div className="glass rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Soil Type</label>
              <select value={qSoil} onChange={(e) => setQSoil(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none">
                <option value="laterite">Laterite</option>
                <option value="alluvial">Alluvial</option>
                <option value="red">Red</option>
                <option value="black">Black</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Acres</label>
              <input type="number" value={qAcres} onChange={(e) => setQAcres(Number(e.target.value))} min={0.1} max={100} step={0.5} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Budget (₹)</label>
              <input type="number" value={qBudget} onChange={(e) => setQBudget(e.target.value ? Number(e.target.value) : '')} min={0} placeholder="Optional" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Canopy Crop</label>
              <input type="text" value={qCanopy} onChange={(e) => setQCanopy(e.target.value)} placeholder="e.g. coconut" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1"># Recs</label>
              <input type="number" value={qNRecs} onChange={(e) => setQNRecs(Number(e.target.value))} min={1} max={10} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-purple-500/50 focus:outline-none" />
            </div>
          </div>
          <button
            onClick={runQuick}
            disabled={loading}
            className="px-6 py-2.5 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {loading ? <Icon name="progress_activity" className="w-4 h-4 animate-spin" /> : <Icon name="bolt" className="w-4 h-4" />}
            {loading ? 'Optimizing…' : 'Quick Optimize'}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <Icon name="warning" className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium text-sm">Optimization Failed</p>
            <p className="text-neutral-400 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Strata results */}
      <AnimatePresence>
        {strataResult && mode === 'strata' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Summary */}
            <div className="glass rounded-xl p-5 border border-purple-500/20">
              <p className="text-sm text-neutral-200 leading-relaxed">{strataResult.natural_language_summary}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-neutral-400">
                <span>Pareto front: {strataResult.pareto_front_size} solutions</span>
                <span>Time: {strataResult.optimization_stats.elapsed_time_ms?.toFixed(0)}ms</span>
                <span>Pop: {strataResult.optimization_stats.population_size}</span>
                <span>Gens: {strataResult.optimization_stats.generations}</span>
              </div>
            </div>

            {/* Recommendation cards */}
            <div className="space-y-3">
              {strataResult.recommendations.map((rec) => (
                <RecCard
                  key={rec.rank}
                  rec={rec}
                  expanded={expandedRec === rec.rank}
                  onToggle={() => setExpandedRec(expandedRec === rec.rank ? -1 : rec.rank)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick results */}
      <AnimatePresence>
        {quickResult && mode === 'quick' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="glass rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-purple-400">Quick Results</h3>
                <span className="text-xs text-neutral-400">{quickResult.execution_time_ms.toFixed(0)}ms</span>
              </div>
              <div className="space-y-2">
                {quickResult.recommendations.map((r: any, i: number) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 text-sm">
                    <pre className="text-xs text-neutral-200 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(r, null, 2)}</pre>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
