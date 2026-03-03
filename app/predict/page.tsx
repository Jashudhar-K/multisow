'use client'

import { useState } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import dynamic from 'next/dynamic'

const YieldPredictionTool = dynamic(() => import('@/components/ml/YieldPredictionTool'), { ssr: false })
const ExplainPredictionTool = dynamic(() => import('@/components/ml/ExplainPredictionTool'), { ssr: false })

export default function PredictPage() {
  const [currentPredictionId, setCurrentPredictionId] = useState('')
  const [currentLayer, setCurrentLayer] = useState('canopy')

  const handleExplain = (predictionId: string, layer: string) => {
    setCurrentPredictionId(predictionId)
    setCurrentLayer(layer)
    // Scroll to the explain section
    setTimeout(() => {
      const el = document.getElementById('explain-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <PageLayout title="Yield Prediction &amp; Explanation">
      <div className="space-y-12">
        <YieldPredictionTool onExplain={handleExplain} />
        <div id="explain-section">
          <ExplainPredictionTool 
            key={`${currentPredictionId}-${currentLayer}`}
            defaultPredictionId={currentPredictionId} 
            defaultLayer={currentLayer}
          />
        </div>
      </div>
    </PageLayout>
  )
}
