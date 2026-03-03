'use client'

import PageLayout from '@/components/layout/PageLayout'
import dynamic from 'next/dynamic'

const ResourceCalculator = dynamic(() => import('@/components/ml/ResourceCalculator'), { ssr: false })
const DataHealthWidget = dynamic(() => import('@/components/ml/DataHealthWidget'), { ssr: false })

export default function CalcPage() {
  return (
    <PageLayout title="Resource Calculator">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ResourceCalculator />
        </div>
        <div>
          <DataHealthWidget />
        </div>
      </div>
    </PageLayout>
  )
}
