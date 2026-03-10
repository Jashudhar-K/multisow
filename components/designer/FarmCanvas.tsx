'use client'

// FarmCanvas.tsx
// 3D farm designer canvas — InstancedMesh-based renderer

import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { FarmHUD } from '../three/FarmHUD'
import type { LayerKey } from '../three/FarmHUD'

// Dynamic import for 3D scene (R3F) — code-split to avoid SSR issues
const FarmScene = dynamic(() => import('../farm/FarmScene'), { ssr: false })

interface FarmCanvasProps {
  plants?: any[]
  farmBounds?: { x: number; y: number; width: number; height: number }
  season?: number
  overlays?: { sunlight: boolean; rootCompetition: boolean; waterZones: boolean }
  onPlantClick?: (plantId: string) => void
  showGrid?: boolean
  flyoverActive?: boolean
  selectedPlantId?: string
}

const ALL_LAYERS: LayerKey[] = ['canopy', 'midstory', 'understory', 'groundcover']

const FarmCanvas: React.FC<FarmCanvasProps> = ({
  plants = [],
  farmBounds = { x: 0, y: 0, width: 100, height: 100 },
  season = 0,
  overlays = { sunlight: false, rootCompetition: false, waterZones: false },
  onPlantClick,
  showGrid: initialShowGrid = true,
  flyoverActive = false,
  selectedPlantId,
}) => {
  const [visibleLayers, setVisibleLayers] = useState<LayerKey[]>(ALL_LAYERS)
  const [showGrid, setShowGrid] = useState(initialShowGrid)

  const fieldSize = Math.max(farmBounds.width, farmBounds.height)
  const farmAreaM2 = fieldSize * fieldSize

  const plantCount = useMemo(() => plants.length, [plants])

  // Filter plants by visible layers before passing to FarmScene
  const visiblePlants = useMemo(
    () => plants.filter((p: any) => !p.layer || visibleLayers.includes(p.layer)),
    [plants, visibleLayers]
  )

  const toggleLayer = (key: LayerKey) => {
    setVisibleLayers(prev =>
      prev.includes(key) ? prev.filter(l => l !== key) : [...prev, key]
    )
  }

  return (
    <div className="relative w-full h-full bg-[#0A0F0A] rounded-2xl overflow-hidden">
      <FarmScene
        plants={visiblePlants}
        rows={[]}
        showGrid={showGrid}
        showStats={false}
        fieldSize={fieldSize}
        flyoverActive={flyoverActive}
        farmBounds={farmBounds}
        onPlantClick={onPlantClick}
        selectedPlantId={selectedPlantId}
      />
      <FarmHUD
        visibleLayers={visibleLayers}
        onToggleLayer={toggleLayer}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(g => !g)}
        plantCount={plantCount}
        fareSizeM2={farmAreaM2}
      />
    </div>
  )
}

export default FarmCanvas;
