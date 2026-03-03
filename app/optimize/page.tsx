'use client'

import PageLayout from '@/components/layout/PageLayout'
import dynamic from 'next/dynamic'

const OptimizerPanel = dynamic(() => import('@/components/ml/OptimizerPanel'), { ssr: false })

export default function OptimizePage() {
  return (
    <PageLayout title="Strata Optimizer">
      <OptimizerPanel />
    </PageLayout>
  )
}
