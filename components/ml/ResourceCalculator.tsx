'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Loader2,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Leaf,
  Droplets,
  BarChart3,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface OptMetrics {
  total_yield_t_ha: number
  ler: number
  competition_index: number
  light_efficiency: number
  net_profit_inr_ha: number
  establishment_cost_inr_ha: number
  annual_revenue_inr_ha: number
}

interface CostBreakdown {
  canopy: { crop: string | null; cost: number }
  middle: { crop: string | null; cost: number }
  understory: { crop: string | null; cost: number }
  total_establishment: number
  annual_revenue: number
  net_profit: number
  roi_pct: number
  payback_months: number
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ResourceCalculator() {
  const [soilType, setSoilType] = useState('laterite')
  const [acres, setAcres] = useState(2.0)
  const [budget, setBudget] = useState<number | ''>(200000)
  const [canopy, setCanopy] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [breakdown, setBreakdown] = useState<CostBreakdown | null>(null)
  const [rawResult, setRawResult] = useState<any>(null)

  const handleCalculate = async () => {
    setLoading(true)
    setError('')
    setBreakdown(null)
    setRawResult(null)
    try {
      // Use the quick optimizer to get budget/resource data
      const res = await fetch('/ml/optimize/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soil_type: soilType,
          acres,
          budget_inr: budget || undefined,
          preferred_canopy: canopy || undefined,
          n_recommendations: 1,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setRawResult(data)

      // Also try full strata for detailed cost info
      const res2 = await fetch('/ml/optimize/strata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm_id: 'resource-calc',
          acres,
          environment: { soil_type: soilType },
          constraints: {
            budget_limit_inr: budget || undefined,
          },
          optimization_goal: 'maximize_profit',
          population_size: 50,
          n_generations: 25,
          n_recommendations: 1,
        }),
      })

      if (res2.ok) {
        const strataData = await res2.json()
        const rec = strataData.recommendations?.[0]
        if (rec) {
          const m = rec.metrics as OptMetrics
          const bd: CostBreakdown = {
            canopy: { crop: rec.canopy?.crop ?? null, cost: 0 },
            middle: { crop: rec.middle?.crop ?? null, cost: 0 },
            understory: { crop: rec.understory?.crop ?? null, cost: 0 },
            total_establishment: m.establishment_cost_inr_ha * acres,
            annual_revenue: m.annual_revenue_inr_ha * acres,
            net_profit: m.net_profit_inr_ha * acres,
            roi_pct: m.establishment_cost_inr_ha > 0 ? (m.net_profit_inr_ha / m.establishment_cost_inr_ha) * 100 : 0,
            payback_months: m.net_profit_inr_ha > 0 ? Math.ceil((m.establishment_cost_inr_ha / m.net_profit_inr_ha) * 12) : 0,
          }
          setBreakdown(bd)
        }
      }
    } catch (err: any) {
      setError(err.message ?? 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          Resource Calculator
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Get budget and resource breakdowns from AI/ML optimisation — establishment costs, projected revenue, ROI, and payback period.
        </p>
      </div>

      {/* Input form */}
      <div className="glass rounded-xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Soil Type</label>
            <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500/50 focus:outline-none">
              <option value="laterite">Laterite</option>
              <option value="alluvial">Alluvial</option>
              <option value="red">Red</option>
              <option value="black">Black</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Acres</label>
            <input type="number" value={acres} onChange={(e) => setAcres(Number(e.target.value))} min={0.1} max={100} step={0.5} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Budget (₹)</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : '')} min={0} placeholder="No limit" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Preferred Canopy</label>
            <input type="text" value={canopy} onChange={(e) => setCanopy(e.target.value)} placeholder="e.g. coconut" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500/50 focus:outline-none" />
          </div>
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="px-6 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
          {loading ? 'Calculating…' : 'Calculate Resources'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="glass border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Breakdown */}
      <AnimatePresence>
        {breakdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard
                icon={DollarSign}
                label="Total Setup Cost"
                value={`₹${breakdown.total_establishment.toLocaleString()}`}
                sub={`for ${acres} acres`}
                color="text-yellow-400"
              />
              <SummaryCard
                icon={TrendingUp}
                label="Annual Revenue"
                value={`₹${breakdown.annual_revenue.toLocaleString()}`}
                sub="projected"
                color="text-green-400"
              />
              <SummaryCard
                icon={BarChart3}
                label="ROI"
                value={`${breakdown.roi_pct.toFixed(0)}%`}
                sub="first year"
                color={breakdown.roi_pct > 50 ? 'text-green-400' : 'text-yellow-400'}
              />
              <SummaryCard
                icon={DollarSign}
                label="Payback"
                value={`${breakdown.payback_months} mo`}
                sub="estimated"
                color={breakdown.payback_months <= 12 ? 'text-green-400' : 'text-orange-400'}
              />
            </div>

            {/* Crop cost breakdown */}
            <div className="glass rounded-xl p-5 border border-emerald-500/20">
              <h3 className="text-sm font-semibold text-emerald-400 mb-3">Crop Allocation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Canopy', data: breakdown.canopy, color: 'green' },
                  { label: 'Middle', data: breakdown.middle, color: 'yellow' },
                  { label: 'Understory', data: breakdown.understory, color: 'orange' },
                ].map(({ label, data, color }) => (
                  <div key={label} className={`bg-white/5 rounded-lg p-3 border border-${color}-500/10`}>
                    <div className={`text-xs font-medium text-${color}-400 mb-1`}>{label} Layer</div>
                    <div className="text-white text-sm font-semibold">{data.crop ?? 'Not assigned'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Net profit bar */}
            <div className="glass rounded-xl p-5 border border-emerald-500/20">
              <h3 className="text-sm font-semibold text-emerald-400 mb-3">Financial Flow</h3>
              <div className="space-y-3">
                <BarRow label="Establishment Cost" value={breakdown.total_establishment} max={Math.max(breakdown.total_establishment, breakdown.annual_revenue)} color="bg-red-500/70" />
                <BarRow label="Annual Revenue" value={breakdown.annual_revenue} max={Math.max(breakdown.total_establishment, breakdown.annual_revenue)} color="bg-green-500/70" />
                <BarRow label="Net Profit" value={breakdown.net_profit} max={Math.max(breakdown.total_establishment, breakdown.annual_revenue)} color="bg-emerald-500" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// HELPERS
// ============================================================================

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: any
  label: string
  value: string
  sub: string
  color: string
}) {
  return (
    <motion.div
      className="glass rounded-xl p-4 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-neutral-400 mt-0.5">{label}</div>
      <div className="text-[10px] text-neutral-500">{sub}</div>
    </motion.div>
  )
}

function BarRow({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = max > 0 ? (Math.abs(value) / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 text-xs text-neutral-400 text-right">{label}</span>
      <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="w-24 text-xs text-white text-right">₹{Math.abs(value).toLocaleString()}</span>
    </div>
  )
}
