'use client'

import { useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { Info, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react'
import type { ShapExplanation } from '@/types/farm'

// ============================================================================
// TYPES
// ============================================================================

export interface ShapExplanationChartProps {
  explanations: ShapExplanation[]
  title?: string
  subtitle?: string
  showDescriptions?: boolean
  maxBars?: number
  className?: string
}

// ============================================================================
// SHAP BAR COMPONENT
// ============================================================================

interface ShapBarProps {
  feature: string
  contribution: number
  maxContribution: number
  description?: string
  index: number
  isInView: boolean
  showDescription?: boolean
}

function ShapBar({
  feature,
  contribution,
  maxContribution,
  description,
  index,
  isInView,
  showDescription = true,
}: ShapBarProps) {
  const isPositive = contribution >= 0
  const barWidth = (Math.abs(contribution) / maxContribution) * 50 // 50% max width

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: isPositive ? -20 : 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div className="flex items-center gap-3">
        {/* Feature label */}
        <div className="w-44 shrink-0 text-right">
          <span className="text-xs text-neutral-300 truncate block" title={feature}>
            {feature}
          </span>
        </div>

        {/* Bar container */}
        <div className="flex-1 flex items-center">
          {/* Center line */}
          <div className="relative flex-1 h-7 flex items-center">
            {/* Negative side */}
            <div className="w-1/2 flex justify-end pr-0.5">
              {!isPositive && (
                <motion.div
                  className="h-5 rounded-l-sm bg-red-500/80 relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${barWidth}%` } : { width: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>
              )}
            </div>

            {/* Center divider */}
            <div className="w-0.5 h-7 bg-white/20" />

            {/* Positive side */}
            <div className="w-1/2 flex justify-start pl-0.5">
              {isPositive && (
                <motion.div
                  className="h-5 rounded-r-sm bg-green-500/80 relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${barWidth}%` } : { width: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Value */}
        <div className="w-14 shrink-0">
          <span
            className={`text-xs font-mono ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '+' : '−'}{Math.abs(contribution).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Description tooltip on hover */}
      {showDescription && description && (
        <motion.div
          className="mt-1 ml-44 pl-3 text-xs text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
        >
          💡 {description}
        </motion.div>
      )}
    </motion.div>
  )
}

// ============================================================================
// LEGEND COMPONENT
// ============================================================================

function ShapLegend() {
  return (
    <div className="flex items-center justify-center gap-6 text-xs text-neutral-400">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-green-500/80" />
        <span>Increases prediction</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-red-500/80" />
        <span>Decreases prediction</span>
      </div>
    </div>
  )
}

// ============================================================================
// SUMMARY STATS COMPONENT
// ============================================================================

interface SummaryStatsProps {
  explanations: ShapExplanation[]
}

function SummaryStats({ explanations }: SummaryStatsProps) {
  const stats = useMemo(() => {
    const positive = explanations.filter((e) => e.contribution >= 0)
    const negative = explanations.filter((e) => e.contribution < 0)
    const totalPositive = positive.reduce((sum, e) => sum + e.contribution, 0)
    const totalNegative = Math.abs(negative.reduce((sum, e) => sum + e.contribution, 0))
    const netEffect = totalPositive - totalNegative
    const topFeature = explanations.reduce((a, b) =>
      Math.abs(a.contribution) > Math.abs(b.contribution) ? a : b
    )

    return {
      positiveCount: positive.length,
      negativeCount: negative.length,
      totalPositive,
      totalNegative,
      netEffect,
      topFeature,
    }
  }, [explanations])

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={14} className="text-green-400" />
          <span className="text-xs text-neutral-400">Positive Impact</span>
        </div>
        <div className="text-lg font-bold text-green-400">
          +{stats.totalPositive.toFixed(2)}
        </div>
        <div className="text-xs text-neutral-500">
          {stats.positiveCount} feature{stats.positiveCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown size={14} className="text-red-400" />
          <span className="text-xs text-neutral-400">Negative Impact</span>
        </div>
        <div className="text-lg font-bold text-red-400">
          −{stats.totalNegative.toFixed(2)}
        </div>
        <div className="text-xs text-neutral-500">
          {stats.negativeCount} feature{stats.negativeCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div
        className={`p-3 rounded-lg border ${
          stats.netEffect >= 0
            ? 'bg-emerald-500/10 border-emerald-500/20'
            : 'bg-amber-500/10 border-amber-500/20'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <Info size={14} className={stats.netEffect >= 0 ? 'text-emerald-400' : 'text-amber-400'} />
          <span className="text-xs text-neutral-400">Net Effect</span>
        </div>
        <div className={`text-lg font-bold ${stats.netEffect >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
          {stats.netEffect >= 0 ? '+' : ''}{stats.netEffect.toFixed(2)}
        </div>
        <div className="text-xs text-neutral-500">on prediction</div>
      </div>
    </div>
  )
}

// ============================================================================
// HELP TOOLTIP
// ============================================================================

function ShapHelpTooltip() {
  return (
    <div className="group relative inline-block">
      <HelpCircle size={14} className="text-neutral-500 cursor-help" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-lg bg-black/95 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <h4 className="text-sm font-medium text-white mb-2">What is SHAP?</h4>
        <p className="text-xs text-neutral-400 leading-relaxed">
          SHAP (SHapley Additive exPlanations) values show how each feature
          contributes to the model's prediction. Positive values increase the
          prediction, while negative values decrease it.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ShapExplanationChart({
  explanations,
  title = 'Feature Contributions',
  subtitle,
  showDescriptions = true,
  maxBars = 10,
  className,
}: ShapExplanationChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  // Sort by absolute contribution and limit
  const sortedExplanations = useMemo(() => {
    return [...explanations]
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
      .slice(0, maxBars)
  }, [explanations, maxBars])

  const maxContribution = useMemo(() => {
    return Math.max(...sortedExplanations.map((e) => Math.abs(e.contribution)))
  }, [sortedExplanations])

  if (explanations.length === 0) {
    return (
      <div className={`p-6 rounded-xl bg-white/5 border border-white/10 ${className || ''}`}>
        <p className="text-sm text-neutral-400 text-center">
          No explanation data available.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={`p-6 rounded-xl bg-white/5 border border-white/10 ${className || ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <ShapHelpTooltip />
          </div>
          {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
        </div>
      </div>

      {/* Summary stats */}
      <SummaryStats explanations={sortedExplanations} />

      {/* Legend */}
      <div className="mb-4">
        <ShapLegend />
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {sortedExplanations.map((explanation, index) => (
          <ShapBar
            key={explanation.feature}
            feature={explanation.feature}
            contribution={explanation.contribution}
            maxContribution={maxContribution}
            description={explanation.description}
            index={index}
            isInView={isInView}
            showDescription={showDescriptions}
          />
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-neutral-500 text-center">
          Based on SHAP value analysis. Each bar represents the feature's contribution to the prediction.
        </p>
      </div>
    </div>
  )
}
