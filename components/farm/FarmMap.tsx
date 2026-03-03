'use client'

import type {
  Coordinate,
  FieldBoundary,
  PlantInstance,
  MapBasemap,
  MapOverlay,
  DrawingTool,
  StrataLayerId,
} from '@/types/farm'

// ============================================================================
// FarmMap stub – Mapbox was removed; use FarmCanvas instead.
// ============================================================================

export interface FarmMapProps {
  className?: string
  initialCenter?: Coordinate
  initialZoom?: number
  basemap?: MapBasemap
  overlays?: MapOverlay[]
  activeTool?: DrawingTool
  fieldBoundary?: FieldBoundary
  plants?: PlantInstance[]
  rows?: {
    id: string
    start: Coordinate
    end: Coordinate
    speciesId: string
    layer: StrataLayerId
  }[]
  showGrid?: boolean
  gridSize?: number
  onFieldDrawn?: (boundary: Coordinate[]) => void
  onPlantPlaced?: (coord: Coordinate, layer: StrataLayerId) => void
  onRowDrawn?: (start: Coordinate, end: Coordinate) => void
  onMapClick?: (coord: Coordinate) => void
  onMapMove?: (center: Coordinate, zoom: number) => void
  activeLayer?: StrataLayerId
}

export default function FarmMap({ className }: FarmMapProps) {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center
        bg-[#0A0F0A] border border-green-900/40 rounded-2xl ${className || ''}`}
      style={{ minHeight: '400px' }}
    >
      <p className="text-green-400 text-sm font-medium">
        Mapbox map has been removed. Use the <span className="text-green-300 font-bold">Farm Canvas</span> designer instead.
      </p>
    </div>
  )
}
