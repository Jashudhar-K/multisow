'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { formatArea, formatMoney, formatLER, thaToTotalTonnes } from '@/lib/units'
import PageLayout from '@/components/layout/PageLayout'
import { useAIFarm } from '@/context/AIFarmContext'
import { DashboardSkeleton } from '@/components/skeletons'
import { MetricCard, MetricCardGrid, AreaChart, BarChart } from '@/components/charts'
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/cards'
import dynamic from 'next/dynamic'

const DataHealthWidget = dynamic(() => import('@/components/ml/DataHealthWidget'), { ssr: false })

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function kv(v: number, digits = 1) { return v.toFixed(digits) }

// Build yield-by-layer bar data from the latest prediction
function buildLayerYieldData(layers: Record<string, { predicted_yield_t_ha?: number, yield_t_ha?: number }> | null | undefined) {
  if (!layers || typeof layers !== 'object') return []
  const COLORS: Record<string, 'primary' | 'success' | 'warning' | 'accent'> = {
    canopy: 'primary', middle: 'success', midstory: 'success',
    understory: 'warning', belowground: 'accent', groundcover: 'accent',
  }
  return Object.entries(layers).map(([key, val]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: val.predicted_yield_t_ha ?? val.yield_t_ha ?? 0,
    color: (COLORS[key] ?? 'primary') as 'primary' | 'success' | 'warning' | 'accent',
  }))
}

// ---------------------------------------------------------------------------
// Empty state — shown when a farm exists but no predictions yet
// ---------------------------------------------------------------------------
function DashboardEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <Icon name="dashboard" size={48} className="text-white/10 mb-4" />
      <h2 className="text-xl font-semibold text-white/80 mb-2">No predictions yet</h2>
      <p className="text-white/40 max-w-md mb-6">
        Run your first yield prediction in the Designer or Predict page to see real data here.
      </p>
      <div className="flex gap-3">
        <Link
          href="/designer"
          className="px-5 py-2.5 rounded-xl bg-green-500/15 text-green-400 font-medium text-sm border border-green-500/20 hover:bg-green-500/25 transition-colors"
        >
          Open Designer
        </Link>
        <Link
          href="/predict"
          className="px-5 py-2.5 rounded-xl bg-white/5 text-white/60 font-medium text-sm border border-white/10 hover:bg-white/10 transition-colors"
        >
          Run Prediction
        </Link>
      </div>
    </motion.div>
  )
}

import { MarketPriceTicker } from '@/components/market/MarketPriceTicker'

import { useLanguage } from '@/context/LanguageContext'

export default function DashboardPage() {
  const { currentFarm, selectedModel, predictions } = useAIFarm()
  const { t } = useLanguage()

  const latestPred = predictions[0] ?? null

  // KPI derivation
  const kpis = useMemo(() => {
    const acres = currentFarm?.acres ?? 2.5
    const ler = latestPred?.system_LER || 1.65
    let totalYieldTha = 3.8
    if (latestPred?.layers) {
      const sum = Object.values(latestPred.layers).reduce((s, l) => s + ((l as any).predicted_yield_t_ha ?? (l as any).yield_t_ha ?? 0), 0)
      if (sum > 0) totalYieldTha = sum
    }
    const totalTonnes = thaToTotalTonnes(totalYieldTha, acres)
    // Revenue estimate: avg ₹80/kg for mixed spice-fruit system
    const revenueINR = totalTonnes * 1000 * 80
    const waterSaved = 62 + (ler - 1) * 10   // heuristic based on LER

    return { acres, ler, totalTonnes, revenueINR, waterSaved, totalYieldTha }
  }, [currentFarm, latestPred])

  // Time-series sparkline data (simulated from LER if no real data)
  const yieldTrendData = useMemo(() => {
    const base = kpis.totalTonnes
    return Array.from({ length: 8 }, (_, i) => ({
      label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][i],
      value: parseFloat((base * (0.75 + i * 0.04 + Math.sin(i) * 0.05)).toFixed(2)),
    }))
  }, [kpis.totalTonnes])

  const layerYieldData = useMemo(() => {
    if (latestPred && latestPred.layers && Object.keys(latestPred.layers).length > 0) {
      const data = buildLayerYieldData(latestPred.layers as any)
      if (data.length > 0 && data.some(d => d.value > 0)) return data
    }
    return [
      { label: 'Canopy', value: 1.8, color: 'primary' as const },
      { label: 'Midstory', value: 1.2, color: 'success' as const },
      { label: 'Understory', value: 0.5, color: 'warning' as const },
      { label: 'Groundcover', value: 0.3, color: 'accent' as const },
    ]
  }, [latestPred])

  return (
    <>
      <MarketPriceTicker />
      <PageLayout title={t('dashboard.title')}>
        <div className="space-y-6">

        {/* Farm context banner */}
        {currentFarm ? (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <div>
              <span className="font-semibold text-green-400">{currentFarm.name}</span>
              <span className="text-white/40 text-sm ml-3">{currentFarm.acres} acres · {currentFarm.region} · {currentFarm.soilType}</span>
            </div>
            {selectedModel && (
              <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {selectedModel.name}
              </span>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center justify-between px-5 py-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-white/50 text-sm">No farm set up yet.</span>
            <Link href="/onboarding" className="text-green-400 text-sm font-medium hover:underline">
              Set up your farm →
            </Link>
          </motion.div>
        )}

        {/* Empty state when farm exists but no predictions */}
        {currentFarm && predictions.length === 0 && <DashboardEmptyState />}

        {/* Main content — only show when we have data */}
        {(predictions.length > 0 || !currentFarm) && (
        <>
        {/* KPI row */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <MetricCardGrid columns={4}>
            <MetricCard
              label={t('dashboard.farm_area')}
              value={kpis.acres}
              unit="acres"
              icon={<Icon name="map" size={20} />}
              color="primary"
              decimals={2}
              description="Total cultivated area"
            />
            <MetricCard
              label={t('dashboard.system_ler')}
              value={kpis.ler}
              icon={<Icon name="layers" size={20} />}
              color="success"
              decimals={2}
              sparklineData={[1.2, 1.35, 1.45, 1.55, kpis.ler]}
              trend={((kpis.ler - 1.2) / 1.2 * 100)}
              description="Land Equivalent Ratio — higher = better intercropping"
            />
            <MetricCard
              label={t('dashboard.predicted_yield')}
              value={kpis.totalTonnes}
              unit="tonnes"
              icon={<Icon name="trending_up" size={20} />}
              color="accent"
              decimals={2}
              sparklineData={[2.5, 2.9, 3.2, 3.5, kpis.totalTonnes]}
              trend={12}
              description="Total system yield across all layers"
            />
            <MetricCard
              label={t('dashboard.est_revenue')}
              value={Math.max(kpis.revenueINR / 100000, 0.01)}
              prefix="₹"
              unit="L"
              icon={<Icon name="currency_rupee" size={20} />}
              color="warning"
              decimals={2}
              sparklineData={[80, 95, 110, 125, kpis.revenueINR / 100000]}
              trend={15}
              description="Estimated annual farm revenue"
            />
          </MetricCardGrid>
        </motion.div>

        {/* Charts + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Yield trend chart */}
          <motion.div className="lg:col-span-2"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="h-full">
              <GlassCardHeader>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Icon name="show_chart" size={16} className="text-green-400" /> {t('dashboard.yield_trend')}
                </h3>
              </GlassCardHeader>
              <GlassCardContent>
                <AreaChart data={yieldTrendData} title="Total Yield (tonnes)" width={480} height={200} color="primary" />
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Quick links */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <GlassCard className="h-full">
              <GlassCardHeader>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Icon name="memory" size={16} className="text-green-400" /> {t('dashboard.ai_ml_tools')}
                </h3>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3">
                <Link href="/predict" className="interactive-link flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/10 hover:text-white text-sm">
                  <Icon name="trending_up" size={16} className="text-green-400" /> {t('dashboard.yield_prediction')}
                </Link>
                <Link href="/optimize" className="interactive-link flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/10 hover:text-white text-sm">
                  <Icon name="bolt" size={16} className="text-amber-400" /> {t('dashboard.strata_optimizer')}
                </Link>
                <Link href="/designer" className="interactive-link flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/10 hover:text-white text-sm">
                  <Icon name="layers" size={16} className="text-blue-400" /> {t('dashboard.farm_designer')}
                </Link>
                <Link href="/crops" className="interactive-link flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/10 hover:text-white text-sm">
                  <Icon name="database" size={16} className="text-purple-400" /> {t('dashboard.crops_database')}
                </Link>
                <Link href="/calc" className="interactive-link flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/10 hover:text-white text-sm">
                  <Icon name="calculate" size={16} className="text-cyan-400" /> {t('dashboard.calculator')}
                </Link>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Layer yield breakdown + Data health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="h-full">
              <GlassCardHeader>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Icon name="bar_chart" size={16} className="text-green-400" /> {t('dashboard.yield_by_layer')}
                </h3>
              </GlassCardHeader>
              <GlassCardContent>
                <BarChart data={layerYieldData} title="Predicted Yield per Layer (tonnes)" width={420} height={200} />
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <GlassCard className="h-full">
              <GlassCardContent>
                <DataHealthWidget defaultFarmId={currentFarm?.name?.replace(/\s+/g, '_').toLowerCase() ?? 'farm-001'} />
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Last prediction details */}
        {latestPred && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard>
              <GlassCardHeader>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Icon name="bolt" size={16} className="text-amber-400" /> {t('dashboard.latest_prediction')}
                </h3>
                <span className="text-xs text-white/30 ml-auto">
                  {new Date(latestPred.timestamp).toISOString().replace('T', ' ').slice(0, 16)} UTC
                </span>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(latestPred.layers ?? {}).map(([layer, pred]) => {
                    const p = pred as any
                    const yieldVal = p.predicted_yield_t_ha ?? p.yield_t_ha ?? 0;
                    return (
                      <div key={layer} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center">
                        <div className="text-xs text-white/40 capitalize mb-1">{layer}</div>
                        <div className="text-xl font-bold text-green-400">{(yieldVal > 0 ? (yieldVal * 0.404686) : 0).toFixed(2)}</div>
                        <div className="text-xs text-white/30">tonnes/acre</div>
                      </div>
                    )
                  })}
                </div>
                {(latestPred as any).optimal_geometry_recommendation && (
                  <p className="mt-4 text-sm text-white/60 leading-relaxed">
                    {(latestPred as any).optimal_geometry_recommendation}
                  </p>
                )}
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        )}
        </>
        )}
      </div>
      </PageLayout>
    </>
  )
}

