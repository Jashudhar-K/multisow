'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartPulse,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Calendar,
  Database,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface DataHealthReport {
  farm_id: string
  total_records: number
  missing_pct: Record<string, number>
  temporal_coverage: Record<string, string>
  quality_score: number
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DataHealthWidget({ defaultFarmId }: { defaultFarmId?: string }) {
  const [farmId, setFarmId] = useState(defaultFarmId ?? 'farm-001')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<DataHealthReport | null>(null)

  const fetchHealth = async () => {
    if (!farmId.trim()) return
    setLoading(true)
    setError('')
    setReport(null)
    try {
      const res = await fetch(`/ml/data/health?farm_id=${encodeURIComponent(farmId)}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `HTTP ${res.status}`)
      }
      setReport(await res.json())
    } catch (err: any) {
      setError(err.message ?? 'Failed to fetch data health.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch on mount
  useEffect(() => {
    if (defaultFarmId) fetchHealth()
  }, []) // eslint-disable-line

  const qualityColor = (score: number) =>
    score >= 0.8
      ? 'text-green-400'
      : score >= 0.5
      ? 'text-yellow-400'
      : 'text-red-400'

  const qualityLabel = (score: number) =>
    score >= 0.8
      ? 'Good'
      : score >= 0.5
      ? 'Fair'
      : 'Poor'

  const missingEntries = report ? Object.entries(report.missing_pct).sort((a, b) => b[1] - a[1]) : []

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-400" />
          Data Health
        </h3>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-white/5 transition text-neutral-400 hover:text-white disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Farm ID input */}
      <div className="flex gap-2">
        <input
          value={farmId}
          onChange={(e) => setFarmId(e.target.value)}
          placeholder="Farm ID"
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-rose-500/50 focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && fetchHealth()}
        />
        <button
          onClick={fetchHealth}
          disabled={loading || !farmId.trim()}
          className="px-4 py-2 bg-rose-500 text-white text-sm font-semibold rounded-lg hover:bg-rose-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-400">
          <AlertTriangle className="w-4 h-4 mt-0.5" />
          {error}
        </div>
      )}

      {/* Report */}
      <AnimatePresence>
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* Quality score */}
            <div className="glass rounded-xl p-4 text-center">
              <div className={`text-4xl font-black ${qualityColor(report.quality_score)}`}>
                {(report.quality_score * 100).toFixed(0)}%
              </div>
              <div className={`text-sm font-medium mt-1 ${qualityColor(report.quality_score)}`}>
                {report.quality_score >= 0.8 ? (
                  <span className="flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4" /> {qualityLabel(report.quality_score)}</span>
                ) : report.quality_score >= 0.5 ? (
                  <span className="flex items-center justify-center gap-1"><AlertTriangle className="w-4 h-4" /> {qualityLabel(report.quality_score)}</span>
                ) : (
                  <span className="flex items-center justify-center gap-1"><XCircle className="w-4 h-4" /> {qualityLabel(report.quality_score)}</span>
                )}
              </div>
              <div className="text-xs text-neutral-500 mt-1">Data Quality Score</div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-lg p-3 text-center">
                <Database className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{report.total_records.toLocaleString()}</div>
                <div className="text-[10px] text-neutral-400">Total Records</div>
              </div>
              <div className="glass rounded-lg p-3 text-center">
                <Calendar className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <div className="text-sm font-semibold text-white mt-1">
                  {report.temporal_coverage.start
                    ? `${report.temporal_coverage.start} → ${report.temporal_coverage.end}`
                    : 'N/A'}
                </div>
                <div className="text-[10px] text-neutral-400">Temporal Range</div>
              </div>
            </div>

            {/* Missing data per column */}
            {missingEntries.length > 0 && (
              <div className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-neutral-300 mb-2">Missing Data by Feature</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {missingEntries.map(([col, pct]) => (
                    <div key={col} className="flex items-center gap-2 text-xs">
                      <span className="w-32 text-neutral-400 truncate text-right" title={col}>{col}</span>
                      <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden">
                        <div
                          className={`h-full rounded ${pct > 30 ? 'bg-red-500' : pct > 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className={`w-12 text-right ${pct > 30 ? 'text-red-400' : pct > 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Zero records message */}
            {report.total_records === 0 && (
              <div className="text-sm text-neutral-400 text-center py-4">
                No records found for farm <span className="text-white font-mono">{report.farm_id}</span>. Upload data via the ingestion endpoints first.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
