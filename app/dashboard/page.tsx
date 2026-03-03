'use client'

import PageLayout from '@/components/layout/PageLayout'
import MetricsDashboard from '@/components/farm/MetricsDashboard'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  TrendingUp, 
  Cpu, 
  Calculator, 
  Database,
  Droplets,
  Leaf,
  Map,
  DollarSign,
  Layers,
} from 'lucide-react'
import { MetricCard, MetricCardGrid, AreaChart, BarChart } from '@/components/charts'
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/cards'

const DataHealthWidget = dynamic(() => import('@/components/ml/DataHealthWidget'), { ssr: false })


import { useEffect, useState } from 'react';

// Sample data for charts
const yieldTrendData = [
  { label: 'Jan', value: 2400 },
  { label: 'Feb', value: 2800 },
  { label: 'Mar', value: 3200 },
  { label: 'Apr', value: 2900 },
  { label: 'May', value: 3500 },
  { label: 'Jun', value: 4200 },
];

const cropDistributionData = [
  { label: 'Tomatoes', value: 3200, color: 'success' as const },
  { label: 'Peppers', value: 2800, color: 'warning' as const },
  { label: 'Beans', value: 2100, color: 'primary' as const },
  { label: 'Maize', value: 1800, color: 'accent' as const },
];

export default function DashboardPage() {
  // Load farm profile from localStorage if available
  const [metrics, setMetrics] = useState({
    totalArea: 2.5,
    plantedArea: 2.0,
    treeDensity: 120,
    ler: 1.85,
    waterSavings: 68,
    carbonSequestration: 2.4,
    expectedYield: [],
    totalRevenue: 120000,
    roi: 35,
    rootOverlapIndex: 0.28,
    canopyCover: 92,
  });
  const [farmProfile, setFarmProfile] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('multisow_farm_profile');
      if (stored) {
        const farm = JSON.parse(stored);
        setFarmProfile(farm);
        // Map farm profile to metrics (simple mapping, can be extended)
        setMetrics((prev) => ({
          ...prev,
          totalArea: farm.size ? parseFloat(farm.size) * 0.4047 : prev.totalArea,
          plantedArea: farm.size ? parseFloat(farm.size) * 0.4047 : prev.plantedArea,
          treeDensity: farm.recommendedCrops?.length ? 100 + farm.recommendedCrops.length * 20 : prev.treeDensity,
          ler: 1.2 + (farm.recommendedCrops?.length || 1) * 0.15,
          waterSavings: farm.irrigation === 'Drip' ? 80 : farm.irrigation === 'Rain-fed' ? 60 : prev.waterSavings,
          carbonSequestration: 2.0 + (farm.recommendedCrops?.length || 1) * 0.3,
          totalRevenue: 100000 + (farm.recommendedCrops?.length || 1) * 20000,
          roi: 25 + (farm.recommendedCrops?.length || 1) * 5,
          rootOverlapIndex: 0.2 + (farm.recommendedCrops?.length || 1) * 0.02,
          canopyCover: 80 + (farm.recommendedCrops?.length || 1) * 3,
        }));
      }
    }
  }, []);

  return (
    <PageLayout title="Farmer Dashboard">
      <div className="space-y-6">
        {/* Top row: Quick Stats + AI/ML Tools + Data Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ML Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="h-full">
              <GlassCardHeader>
                <h3 className="text-primary-400 font-bold text-lg flex items-center gap-2">
                  <Cpu size={20} />
                  AI/ML Tools
                </h3>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3">
                <Link href="/predict" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-primary-500/15 border border-primary-500/30 text-primary-400 font-medium hover:bg-primary-500/25 transition-all">
                  <TrendingUp size={18} />
                  <span>Yield Prediction</span>
                </Link>
                <Link href="/optimize" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-accent-500/15 border border-accent-500/30 text-accent-400 font-medium hover:bg-accent-500/25 transition-all">
                  <Cpu size={18} />
                  <span>Strata Optimizer</span>
                </Link>
                <Link href="/calc" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-success/15 border border-success/30 text-success font-medium hover:bg-success/25 transition-all">
                  <Calculator size={18} />
                  <span>Resource Calculator</span>
                </Link>
                <Link href="/crops" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-warning/10 border border-warning/30 text-warning font-medium hover:bg-warning/20 transition-all">
                  <Database size={18} />
                  <span>Crops Database</span>
                </Link>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Data Health - takes 2 columns on larger screens */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="h-full">
              <GlassCardContent>
                <DataHealthWidget defaultFarmId="farm-001" />
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Farm Profile Summary Card */}
        {farmProfile && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.25 }}
          >
            <GlassCard>
              <GlassCardContent className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="text-primary-400 font-bold text-lg">{farmProfile.name || 'My Farm'}</div>
                  <div className="text-text-secondary text-sm">{farmProfile.location || ''}</div>
                  <div className="text-text-muted text-sm">Soil: {farmProfile.soilType || ''}</div>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="text-text-secondary text-xs">Owner: {farmProfile.owner || ''}</div>
                  <div className="text-text-secondary text-xs">Region: {farmProfile.region || ''}</div>
                  <div className="text-text-secondary text-xs">Season: {farmProfile.season || ''}</div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        )}

        {/* Key Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          <MetricCardGrid columns={4}>
            <MetricCard
              label="Total Area"
              value={metrics.totalArea}
              unit="ha"
              icon={<Map size={20} />}
              color="primary"
              sparklineData={[2.0, 2.2, 2.3, 2.4, 2.5]}
              trend={8}
              description="Total cultivated land area"
            />
            <MetricCard
              label="Land Equivalent Ratio"
              value={metrics.ler}
              icon={<Layers size={20} />}
              color="success"
              decimals={2}
              sparklineData={[1.4, 1.5, 1.6, 1.7, 1.85]}
              trend={12}
              description="Measure of intercropping efficiency vs monoculture"
            />
            <MetricCard
              label="Water Savings"
              value={metrics.waterSavings}
              unit="%"
              icon={<Droplets size={20} />}
              color="accent"
              sparklineData={[55, 60, 62, 65, 68]}
              trend={5}
              description="Water usage reduction through smart irrigation"
            />
            <MetricCard
              label="Total Revenue"
              value={metrics.totalRevenue}
              prefix="$"
              icon={<DollarSign size={20} />}
              color="warning"
              sparklineData={[80000, 90000, 100000, 110000, 120000]}
              trend={15}
              description="Projected annual revenue"
            />
          </MetricCardGrid>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.35 }}
          >
            <GlassCard className="h-full">
              <GlassCardContent>
                <AreaChart
                  data={yieldTrendData}
                  title="Yield Trend (kg/ha)"
                  width={500}
                  height={220}
                  color="primary"
                />
              </GlassCardContent>
            </GlassCard>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="h-full">
              <GlassCardContent>
                <BarChart
                  data={cropDistributionData}
                  title="Crop Distribution (kg)"
                  width={500}
                  height={220}
                />
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Full-width Metrics Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.45 }}
        >
          <GlassCard>
            <GlassCardContent>
              <MetricsDashboard metrics={metrics} />
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>
    </PageLayout>
  );
}
