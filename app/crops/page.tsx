'use client'

import PageLayout from '@/components/layout/PageLayout'
import dynamic from 'next/dynamic'

const CropsDatabase = dynamic(() => import('@/components/ml/CropsDatabase'), { ssr: false })

export default function CropsPage() {
  return (
    <PageLayout title="Crops Database">
      <CropsDatabase />
    </PageLayout>
  )
}
