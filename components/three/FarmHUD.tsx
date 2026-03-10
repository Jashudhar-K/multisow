'use client'
/**
 * FarmHUD — HTML overlay for canvas layer-visibility toggle controls.
 * Meant to be rendered *outside* the R3F <Canvas> wrapper, positioned
 * absolutely over the canvas div.
 */

import { Icon } from '@/components/ui/Icon'

export type LayerKey = 'canopy' | 'midstory' | 'understory' | 'groundcover'

const LAYER_DEFS: { key: LayerKey; label: string; color: string }[] = [
  { key: 'canopy',      label: 'Top Layer',      color: '#166534' },
  { key: 'midstory',    label: 'Middle Layer',    color: '#15803d' },
  { key: 'understory',  label: 'Lower Layer',     color: '#14532d' },
  { key: 'groundcover', label: 'Ground Layer',    color: '#a16207' },
]

interface FarmHUDProps {
  visibleLayers: LayerKey[]
  onToggleLayer: (key: LayerKey) => void
  showGrid: boolean
  onToggleGrid: () => void
  plantCount: number
  fareSizeM2: number
}

export function FarmHUD({ visibleLayers, onToggleLayer, showGrid, onToggleGrid, plantCount, fareSizeM2 }: FarmHUDProps) {
  const acres = fareSizeM2 / 4046.86
  const cents = Math.round(acres * 100)

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Layer toggles — top-left */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-auto">
        {LAYER_DEFS.map(({ key, label, color }) => {
          const active = visibleLayers.includes(key)
          return (
            <button key={key} onClick={() => onToggleLayer(key)}
              title={`Toggle ${label}`}
              style={{ borderColor: active ? color : 'transparent', color: active ? color : '#6b7280' }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border backdrop-blur-sm transition-all
                ${active ? 'bg-black/60' : 'bg-black/30 opacity-60'}`}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: active ? color : '#374151' }} />
              {label}
            </button>
          )
        })}

        {/* Grid toggle */}
        <button onClick={onToggleGrid}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border backdrop-blur-sm transition-all mt-1
            ${showGrid ? 'border-white/20 bg-black/60 text-white/80' : 'border-transparent bg-black/30 text-white/30'}`}>
          <Icon name="grid_on" size={12} />
          Grid
        </button>
      </div>

      {/* Stats — bottom-left */}
      <div className="absolute bottom-3 left-3 flex gap-3 pointer-events-none">
        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-white/70 border border-white/10">
          <span className="text-white font-semibold">{plantCount.toLocaleString()}</span> plants
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-white/70 border border-white/10">
          <span className="text-white font-semibold">{acres.toFixed(2)}</span> acres
          <span className="text-white/40 ml-1">({cents} cents)</span>
        </div>
      </div>

      {/* Scale indicator — bottom-right */}
      <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-white/40 border border-white/10 pointer-events-none">
        1 grid = 1 cent (≈6.4m)
      </div>
    </div>
  )
}
