'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icon'
import type { FarmMetrics, YieldForecast, LightInterceptionResult, StrataLayerId } from '@/types/farm'

// ============================================================================
// ANIMATED COUNTER HOOK
// ============================================================================

function useAnimatedNumber(
  target: number,
  duration: number = 1500,
  decimals: number = 0
): number {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCurrent(Number((eased * target).toFixed(decimals)))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration, decimals, isInView])

  return current
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  label: string
  value: number
  unit: string
  prefix?: string
  icon: string
  color: string
  bgColor: string
  trend?: number
  description?: string
  decimals?: number
}

function StatCard({
  label,
  value,
  unit,
  prefix = '',
  icon: iconName,
  color,
  bgColor,
  trend,
  description,
  decimals = 0,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const animatedValue = useAnimatedNumber(value, 1500, decimals)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`relative p-4 rounded-xl ${bgColor} border border-white/10 overflow-hidden group`}
    >
      {/* Background glow */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity`}
        style={{
          background: `radial-gradient(circle at center, ${color.replace('text-', 'rgb(var(--')}) 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div className={`inline-flex p-2 rounded-lg ${bgColor} mb-3`}>
        <Icon name={iconName} size={20} className={color} />
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-bold text-white">
          {prefix}
          {animatedValue}
        </span>
        <span className="text-sm text-neutral-400">{unit}</span>
        {trend !== undefined && (
          <span
            className={`ml-2 text-xs font-medium ${
              trend >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      {/* Label */}
      <div className="text-sm text-neutral-400">{label}</div>

      {/* Description tooltip */}
      {description && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative group/tip">
            <Icon name="info" size={14} className="text-neutral-500" />
            <div className="absolute right-0 top-full mt-1 w-48 p-2 rounded-lg bg-black/90 text-xs text-neutral-300 opacity-0 group-hover/tip:opacity-100 transition-opacity z-10">
              {description}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ============================================================================
// ANIMATED BAR CHART
// ============================================================================

interface BarChartProps {
  data: { label: string; value: number; color: string }[]
  maxValue?: number
  showLabels?: boolean
  height?: number
}

function AnimatedBarChart({
  data,
  maxValue,
  showLabels = true,
  height = 150,
}: BarChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const max = maxValue || Math.max(...data.map((d) => d.value))

  return (
    <div ref={ref} className="w-full" style={{ height }}>
      <div className="flex items-end justify-between h-full gap-2">
        {data.map((item, index) => {
          const barHeight = (item.value / max) * 100

          return (
            <div key={item.label} className="flex-1 flex flex-col items-center">
              <div className="relative w-full flex justify-center" style={{ height: height - 30 }}>
                <motion.div
                  className="w-8 rounded-t-lg relative overflow-hidden"
                  style={{ backgroundColor: item.color }}
                  initial={{ height: 0 }}
                  animate={isInView ? { height: `${barHeight}%` } : { height: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>
              </div>
              {showLabels && (
                <span className="mt-2 text-xs text-neutral-400 truncate max-w-full">
                  {item.label}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// LIGHT INTERCEPTION DIAGRAM
// ============================================================================

interface LightInterceptionDiagramProps {
  layers: LightInterceptionResult[]
}

function LightInterceptionDiagram({ layers }: LightInterceptionDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const layerColors: Record<StrataLayerId, string> = {
    canopy: '#166534',
    middle: '#15803d',
    understory: '#14b8a6',
    root: '#a16207',
  }

  const layerNames: Record<StrataLayerId, string> = {
    canopy: 'Canopy',
    middle: 'Middle',
    understory: 'Understory',
    root: 'Root Zone',
  }

  // Calculate cumulative light transmission
  let remainingLight = 100

  return (
    <div ref={ref} className="space-y-3">
      {/* Sun icon at top */}
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          className="p-2 rounded-full bg-yellow-500/20"
        >
          <Icon name="light_mode" size={24} className="text-yellow-400" />
        </motion.div>
      </div>

      {/* Light rays */}
      <div className="relative h-4">
        <motion.div
          className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-b from-yellow-400/50 to-transparent"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Layers */}
      <div className="space-y-2">
        {layers.map((layer, index) => {
          const absorbed = layer.parAbsorption * 100
          const transmitted = remainingLight - absorbed
          remainingLight = transmitted

          return (
            <motion.div
              key={layer.layer}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex items-center gap-3"
            >
              {/* Layer indicator */}
              <div
                className="w-2 h-8 rounded-full"
                style={{ backgroundColor: layerColors[layer.layer] }}
              />

              {/* Layer info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">
                    {layerNames[layer.layer]}
                  </span>
                  <span className="text-xs text-neutral-400">
                    LAI: {layer.effectiveLAI.toFixed(1)}
                  </span>
                </div>

                {/* Light bar */}
                <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: layerColors[layer.layer] }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${absorbed}%` } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-white/80">
                      {absorbed.toFixed(0)}% absorbed
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Ground */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/10">
        <div className="w-2 h-8 rounded-full bg-amber-900/50" />
        <div className="flex-1">
          <div className="text-xs text-neutral-400">
            Light reaching ground: {remainingLight.toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// YIELD FORECAST CHART
// ============================================================================

interface YieldForecastChartProps {
  forecasts: YieldForecast[]
  currentYear?: number
}

function YieldForecastChart({ forecasts, currentYear = 2026 }: YieldForecastChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const maxRevenue = Math.max(...forecasts.map((f) => f.totalRevenue))

  return (
    <div ref={ref} className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">30-Year Revenue Projection</span>
        <span className="text-xs text-neutral-400">
          Total: ₹{(forecasts.reduce((a, f) => a + f.totalRevenue, 0) / 100000).toFixed(1)}L
        </span>
      </div>

      <div className="h-32 flex items-end gap-0.5">
        {forecasts.map((forecast, index) => {
          const barHeight = (forecast.totalRevenue / maxRevenue) * 100
          const isCurrentYear = forecast.year === currentYear

          return (
            <motion.div
              key={forecast.year}
              className={`flex-1 relative group ${isCurrentYear ? 'z-10' : ''}`}
              initial={{ height: 0 }}
              animate={isInView ? { height: `${barHeight}%` } : { height: 0 }}
              transition={{ duration: 0.8, delay: index * 0.02 }}
            >
              <div
                className={`w-full h-full rounded-t transition-colors ${
                  isCurrentYear
                    ? 'bg-green-500'
                    : 'bg-green-600/50 group-hover:bg-green-500/70'
                }`}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="p-2 rounded-lg bg-black/90 text-xs whitespace-nowrap">
                  <div className="text-white font-medium">{forecast.year}</div>
                  <div className="text-green-400">
                    ₹{(forecast.totalRevenue / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-neutral-500">
        <span>{forecasts[0]?.year}</span>
        <span>{forecasts[Math.floor(forecasts.length / 2)]?.year}</span>
        <span>{forecasts[forecasts.length - 1]?.year}</span>
      </div>
    </div>
  )
}

// ============================================================================
// LER BREAKDOWN CHART
// ============================================================================

interface LerBreakdownProps {
  ler: number
  breakdown: { species: string; contribution: number; color: string }[]
}

function LerBreakdown({ ler, breakdown }: LerBreakdownProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref} className="space-y-4">
      {/* LER value */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          className="inline-flex items-baseline gap-1"
        >
          <span className="text-4xl font-bold text-green-400">{ler.toFixed(2)}</span>
          <span className="text-lg text-neutral-400">LER</span>
        </motion.div>
        <p className="text-xs text-neutral-500 mt-1">
          {ler > 1 ? `${((ler - 1) * 100).toFixed(0)}% more efficient than monoculture` : 'Below monoculture efficiency'}
        </p>
      </div>

      {/* Stacked bar */}
      <div className="relative h-8 rounded-full bg-white/5 overflow-hidden flex">
        {breakdown.map((item, index) => {
          const width = item.contribution * 100

          return (
            <motion.div
              key={item.species}
              className="h-full relative group"
              style={{ backgroundColor: item.color }}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${width}%` } : { width: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="p-2 rounded-lg bg-black/90 text-xs whitespace-nowrap">
                  <div className="text-white">{item.species}</div>
                  <div className="text-neutral-400">{(item.contribution * 100).toFixed(0)}%</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {breakdown.map((item) => (
          <div key={item.species} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-neutral-400">{item.species}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN METRICS DASHBOARD COMPONENT
// ============================================================================

export interface MetricsDashboardProps {
  metrics: FarmMetrics
  lightInterception?: LightInterceptionResult[]
  yieldForecasts?: YieldForecast[]
  onRefresh?: () => void
  onExport?: () => void
  isLoading?: boolean
  className?: string
}

export default function MetricsDashboard({
  metrics,
  lightInterception,
  yieldForecasts,
  onRefresh,
  onExport,
  isLoading = false,
  className,
}: MetricsDashboardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview')

  // Generate sample data if not provided
  const sampleLightInterception: LightInterceptionResult[] = lightInterception || [
    { layer: 'canopy', parAbsorption: 0.52, parTransmission: 0.48, effectiveLAI: 4.8 },
    { layer: 'middle', parAbsorption: 0.22, parTransmission: 0.26, effectiveLAI: 3.2 },
    { layer: 'understory', parAbsorption: 0.12, parTransmission: 0.14, effectiveLAI: 1.5 },
    { layer: 'root', parAbsorption: 0.05, parTransmission: 0.09, effectiveLAI: 0.8 },
  ]

  const sampleForecasts: YieldForecast[] = yieldForecasts || Array.from({ length: 30 }, (_, i) => ({
    year: 2026 + i,
    yields: [],
    totalRevenue: (50000 + Math.random() * 100000) * (1 + i * 0.05),
    cumulativeRevenue: 0,
  }))

  const lerBreakdown = [
    { species: 'Coconut', contribution: 0.35, color: '#166534' },
    { species: 'Banana', contribution: 0.30, color: '#15803d' },
    { species: 'Ginger', contribution: 0.20, color: '#14b8a6' },
    { species: 'Turmeric', contribution: 0.15, color: '#a16207' },
  ]

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="monitoring" size={20} className="text-green-400" />
          <h2 className="text-lg font-bold text-white">Real-time Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh"
              className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
            >
              <Icon name="refresh" size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              title="Export"
              className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-all"
            >
              <Icon name="download" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          label="Total Area"
          value={metrics.totalArea}
          unit="ha"
          icon="map"
          color="text-blue-400"
          bgColor="bg-blue-500/10"
          decimals={2}
          description="Total field area covered by the design"
        />
        <StatCard
          label="Tree Density"
          value={metrics.treeDensity}
          unit="/ha"
          icon="park"
          color="text-green-400"
          bgColor="bg-green-500/10"
          trend={5}
          description="Number of trees per hectare"
        />
        <StatCard
          label="Land Equivalent Ratio"
          value={metrics.ler}
          unit=""
          icon="layers"
          color="text-emerald-400"
          bgColor="bg-emerald-500/10"
          trend={12}
          decimals={2}
          description="LER > 1 means intercropping is more efficient than monoculture"
        />
        <StatCard
          label="Water Savings"
          value={metrics.waterSavings}
          unit="%"
          icon="water_drop"
          color="text-cyan-400"
          bgColor="bg-cyan-500/10"
          description="Water saved compared to conventional farming"
        />
        <StatCard
          label="Carbon Capture"
          value={metrics.carbonSequestration}
          unit="t/yr"
          icon="eco"
          color="text-teal-400"
          bgColor="bg-teal-500/10"
          decimals={1}
          description="Estimated CO2 sequestered annually"
        />
        <StatCard
          label="Est. Revenue"
          value={metrics.totalRevenue / 1000}
          unit="k/yr"
          prefix="₹"
          icon="currency_rupee"
          color="text-amber-400"
          bgColor="bg-amber-500/10"
          trend={8}
          description="Projected annual revenue"
        />
      </div>

      {/* Expandable sections */}
      <div className="space-y-3">
        {/* Light Interception */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <button
            onClick={() => toggleSection('light')}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-2">
              <Icon name="light_mode" size={18} className="text-yellow-400" />
              <span className="text-sm font-medium text-white">
                Light Interception (Beer-Lambert)
              </span>
            </div>
            {expandedSection === 'light' ? (
              <Icon name="expand_less" size={18} className="text-neutral-400" />
            ) : (
              <Icon name="expand_more" size={18} className="text-neutral-400" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'light' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4"
              >
                <LightInterceptionDiagram layers={sampleLightInterception} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LER Breakdown */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <button
            onClick={() => toggleSection('ler')}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-2">
              <Icon name="bar_chart" size={18} className="text-green-400" />
              <span className="text-sm font-medium text-white">LER Breakdown</span>
            </div>
            {expandedSection === 'ler' ? (
              <Icon name="expand_less" size={18} className="text-neutral-400" />
            ) : (
              <Icon name="expand_more" size={18} className="text-neutral-400" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'ler' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4"
              >
                <LerBreakdown ler={metrics.ler} breakdown={lerBreakdown} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Revenue Forecast */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <button
            onClick={() => toggleSection('forecast')}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-2">
              <Icon name="trending_up" size={18} className="text-emerald-400" />
              <span className="text-sm font-medium text-white">Revenue Forecast</span>
            </div>
            {expandedSection === 'forecast' ? (
              <Icon name="expand_less" size={18} className="text-neutral-400" />
            ) : (
              <Icon name="expand_more" size={18} className="text-neutral-400" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'forecast' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4"
              >
                <YieldForecastChart forecasts={sampleForecasts} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
