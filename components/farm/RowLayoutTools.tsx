'use client'

import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icon'
import type { StrataLayerId, Species, PlantingRow, RowGrid, LayoutPattern } from '@/types/farm'

// ============================================================================
// TYPES
// ============================================================================

export interface RowLayoutConfig {
  pattern: LayoutPattern
  orientation: number // degrees from north
  rowSpacing: number // meters
  inRowSpacing: number // meters
  headlandOffset: number // meters from boundary
  staggerOffset: boolean
  curvedRows: boolean
  followContours: boolean
}

export interface RowLayoutToolsProps {
  config: RowLayoutConfig
  onConfigChange: (config: RowLayoutConfig) => void
  selectedSpecies: Species | null
  onGenerateGrid: (config: RowLayoutConfig) => void
  fieldArea?: number // hectares
  isCompact?: boolean
}

// ============================================================================
// PATTERN PRESETS
// ============================================================================

const patternPresets: {
  id: LayoutPattern
  name: string
  description: string
  icon: string
  defaultConfig: Partial<RowLayoutConfig>
}[] = [
  {
    id: 'alley-cropping',
    name: 'Alley Cropping',
    description: 'Tree rows with crop alleys between',
    icon: '🌳',
    defaultConfig: {
      rowSpacing: 10,
      inRowSpacing: 8,
      staggerOffset: false,
    },
  },
  {
    id: 'silvopasture',
    name: 'Silvopasture',
    description: 'Scattered trees with grazing space',
    icon: '🐄',
    defaultConfig: {
      rowSpacing: 15,
      inRowSpacing: 12,
      staggerOffset: true,
    },
  },
  {
    id: 'contour-planting',
    name: 'Contour Planting',
    description: 'Rows following terrain contours',
    icon: '⛰️',
    defaultConfig: {
      followContours: true,
      curvedRows: true,
      rowSpacing: 8,
    },
  },
  {
    id: 'block-planting',
    name: 'Block Planting',
    description: 'Dense rectangular blocks',
    icon: '🟩',
    defaultConfig: {
      rowSpacing: 6,
      inRowSpacing: 6,
      staggerOffset: false,
    },
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Define your own pattern',
    icon: '⚙️',
    defaultConfig: {},
  },
]

// ============================================================================
// NUMBER INPUT COMPONENT
// ============================================================================

interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}

function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 0.5,
  unit = 'm',
}: NumberInputProps) {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step)
    onChange(Number(newValue.toFixed(1)))
  }

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step)
    onChange(Number(newValue.toFixed(1)))
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-neutral-400">{label}</label>
      <div className="flex items-center gap-1">
        <button
          onClick={handleDecrement}
          title="Decrease"
          className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <Icon name="remove" size={14} />
        </button>
        <div className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 text-center">
          <span className="text-sm font-mono text-white">{value}</span>
          <span className="text-xs text-neutral-500 ml-1">{unit}</span>
        </div>
        <button
          onClick={handleIncrement}
          title="Increase"
          className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <Icon name="add" size={14} />
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// ORIENTATION DIAL COMPONENT
// ============================================================================

interface OrientationDialProps {
  value: number
  onChange: (value: number) => void
}

function OrientationDial({ value, onChange }: OrientationDialProps) {
  const cardinalPoints = [
    { angle: 0, label: 'N' },
    { angle: 45, label: 'NE' },
    { angle: 90, label: 'E' },
    { angle: 135, label: 'SE' },
    { angle: 180, label: 'S' },
    { angle: 225, label: 'SW' },
    { angle: 270, label: 'W' },
    { angle: 315, label: 'NW' },
  ]

  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-neutral-400">Row Orientation</label>
      <div className="relative w-32 h-32 mx-auto">
        {/* Dial background */}
        <div className="absolute inset-0 rounded-full bg-white/5 border border-white/10" />

        {/* Cardinal points */}
        {cardinalPoints.map((point) => {
          const rad = (point.angle - 90) * (Math.PI / 180)
          const x = 50 + 40 * Math.cos(rad)
          const y = 50 + 40 * Math.sin(rad)

          return (
            <button
              key={point.label}
              onClick={() => onChange(point.angle)}
              className={`absolute text-xs font-medium transition-colors ${
                Math.abs(value - point.angle) < 22.5
                  ? 'text-green-400'
                  : 'text-neutral-500 hover:text-white'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {point.label}
            </button>
          )
        })}

        {/* Needle */}
        <div
          className="absolute left-1/2 top-1/2 w-0.5 h-12 bg-green-500 origin-bottom rounded-full shadow-lg shadow-green-500/50"
          style={{
            transform: `translateX(-50%) rotate(${value}deg)`,
          }}
        />

        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500" />

        {/* Value display */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 text-xs font-mono text-white">
          {value}°
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// TOGGLE SWITCH COMPONENT
// ============================================================================

interface ToggleSwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

function ToggleSwitch({ label, checked, onChange, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={() => onChange(!checked)}
        title={label}
        aria-label={label}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          checked ? 'bg-green-600' : 'bg-white/10'
        }`}
      >
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ left: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      <div className="flex-1">
        <span className="text-sm text-white">{label}</span>
        {description && (
          <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// GRID PREVIEW COMPONENT
// ============================================================================

interface GridPreviewProps {
  config: RowLayoutConfig
  species: Species | null
}

function GridPreview({ config, species }: GridPreviewProps) {
  const gridSize = 100 // px
  const scale = gridSize / 50 // 50m visual

  // Calculate row positions
  const rows = useMemo(() => {
    const count = Math.floor(50 / config.rowSpacing)
    return Array.from({ length: count }, (_, i) => {
      const y = (config.headlandOffset + i * config.rowSpacing) * scale
      return { y, stagger: config.staggerOffset && i % 2 === 1 }
    })
  }, [config, scale])

  // Calculate plant positions per row
  const plantsPerRow = useMemo(() => {
    return Math.floor(50 / config.inRowSpacing)
  }, [config.inRowSpacing])

  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-neutral-400">Preview</label>
      <div
        className="relative bg-gradient-to-b from-green-900/30 to-green-950/30 rounded-lg overflow-hidden border border-white/10"
        style={{ width: gridSize, height: gridSize }}
      >
        {/* Grid lines */}
        <svg
          className="absolute inset-0"
          style={{ width: gridSize, height: gridSize }}
        >
          {rows.map((row, i) => (
            <g key={i}>
              {/* Row line */}
              <line
                x1={0}
                y1={row.y}
                x2={gridSize}
                y2={row.y}
                stroke="rgba(34, 197, 94, 0.3)"
                strokeWidth={1}
                strokeDasharray={config.curvedRows ? '2,2' : 'none'}
              />
              {/* Plants */}
              {Array.from({ length: plantsPerRow }, (_, j) => {
                const x =
                  (config.headlandOffset + j * config.inRowSpacing + (row.stagger ? config.inRowSpacing / 2 : 0)) *
                  scale
                return (
                  <circle
                    key={j}
                    cx={x}
                    cy={row.y}
                    r={2}
                    fill={species?.color || '#22c55e'}
                    opacity={0.8}
                  />
                )
              })}
            </g>
          ))}
        </svg>

        {/* Compass indicator */}
        <div
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center"
          style={{ transform: `rotate(${config.orientation}deg)` }}
        >
          <div className="w-0.5 h-3 bg-green-400 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// STATISTICS PREVIEW
// ============================================================================

interface StatsPreviewProps {
  config: RowLayoutConfig
  species: Species | null
  fieldArea?: number
}

function StatsPreview({ config, species, fieldArea = 1 }: StatsPreviewProps) {
  const stats = useMemo(() => {
    const areaM2 = fieldArea * 10000
    const effectiveArea = areaM2 * (1 - config.headlandOffset / 50) // Approximate
    const treesPerRow = Math.floor(Math.sqrt(effectiveArea) / config.inRowSpacing)
    const numRows = Math.floor(Math.sqrt(effectiveArea) / config.rowSpacing)
    const totalTrees = treesPerRow * numRows

    return {
      totalTrees,
      treesPerHa: Math.round(totalTrees / fieldArea),
      rowCount: numRows,
      treesPerRow,
      estimatedYield: species
        ? Math.round(totalTrees * species.yieldPerTree * 0.8)
        : 0,
      estimatedRevenue: species
        ? Math.round(totalTrees * species.yieldPerTree * species.pricePerKg * 0.8)
        : 0,
    }
  }, [config, species, fieldArea])

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="p-2 rounded-lg bg-white/5">
        <div className="text-xs text-neutral-400">Total Trees</div>
        <div className="text-sm font-bold text-white">{stats.totalTrees}</div>
      </div>
      <div className="p-2 rounded-lg bg-white/5">
        <div className="text-xs text-neutral-400">Trees/ha</div>
        <div className="text-sm font-bold text-white">{stats.treesPerHa}</div>
      </div>
      <div className="p-2 rounded-lg bg-white/5">
        <div className="text-xs text-neutral-400">Row Count</div>
        <div className="text-sm font-bold text-white">{stats.rowCount}</div>
      </div>
      <div className="p-2 rounded-lg bg-white/5">
        <div className="text-xs text-neutral-400">Trees/Row</div>
        <div className="text-sm font-bold text-white">{stats.treesPerRow}</div>
      </div>
      {species && (
        <>
          <div className="p-2 rounded-lg bg-green-500/10 col-span-2">
            <div className="text-xs text-green-400">Est. Revenue</div>
            <div className="text-sm font-bold text-green-400">
              ₹{(stats.estimatedRevenue / 1000).toFixed(0)}k/year
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// MAIN ROW LAYOUT TOOLS COMPONENT
// ============================================================================

export default function RowLayoutTools({
  config,
  onConfigChange,
  selectedSpecies,
  onGenerateGrid,
  fieldArea = 1,
  isCompact = false,
}: RowLayoutToolsProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handlePatternSelect = useCallback(
    (patternId: LayoutPattern) => {
      const preset = patternPresets.find((p) => p.id === patternId)
      if (preset) {
        onConfigChange({
          ...config,
          pattern: patternId,
          ...preset.defaultConfig,
        })
      }
    },
    [config, onConfigChange]
  )

  const handleConfigUpdate = useCallback(
    <K extends keyof RowLayoutConfig>(key: K, value: RowLayoutConfig[K]) => {
      onConfigChange({ ...config, [key]: value })
    },
    [config, onConfigChange]
  )

  const handleReset = useCallback(() => {
    onConfigChange({
      pattern: 'alley-cropping',
      orientation: 0,
      rowSpacing: 10,
      inRowSpacing: 8,
      headlandOffset: 5,
      staggerOffset: false,
      curvedRows: false,
      followContours: false,
    })
  }, [onConfigChange])

  if (isCompact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-black/90 backdrop-blur-md rounded-lg border border-white/10">
        <Icon name="table_rows" size={16} className="text-green-400" />
        <span className="text-sm text-white">Row Spacing: {config.rowSpacing}m</span>
        <span className="text-neutral-500">|</span>
        <span className="text-sm text-white">In-Row: {config.inRowSpacing}m</span>
        <button
          onClick={() => onGenerateGrid(config)}
          className="ml-2 px-3 py-1 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-colors"
        >
          Generate
        </button>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-black/90 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden"
      animate={{ height: isExpanded ? 'auto' : 48 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Icon name="grid_on" size={18} className="text-green-400" />
          <span className="text-sm font-medium text-white">Row Layout Tools</span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <Icon name="expand_more" size={16} className="text-neutral-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 pt-0 space-y-4"
          >
            {/* Pattern selection */}
            <div className="space-y-2">
              <label className="block text-xs text-neutral-400">Pattern</label>
              <div className="grid grid-cols-2 gap-2">
                {patternPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePatternSelect(preset.id)}
                    className={`p-2 rounded-lg text-left transition-all ${
                      config.pattern === preset.id
                        ? 'bg-green-600/30 border border-green-500/50'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{preset.icon}</span>
                      <span className="text-xs font-medium text-white">
                        {preset.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing controls */}
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label="Row Spacing"
                value={config.rowSpacing}
                onChange={(v) => handleConfigUpdate('rowSpacing', v)}
                min={2}
                max={30}
                step={0.5}
                unit="m"
              />
              <NumberInput
                label="In-Row Spacing"
                value={config.inRowSpacing}
                onChange={(v) => handleConfigUpdate('inRowSpacing', v)}
                min={1}
                max={20}
                step={0.5}
                unit="m"
              />
            </div>

            <NumberInput
              label="Headland Offset"
              value={config.headlandOffset}
              onChange={(v) => handleConfigUpdate('headlandOffset', v)}
              min={0}
              max={20}
              step={1}
              unit="m"
            />

            {/* Preview and orientation */}
            <div className="flex gap-4">
              <GridPreview config={config} species={selectedSpecies} />
              <OrientationDial
                value={config.orientation}
                onChange={(v) => handleConfigUpdate('orientation', v)}
              />
            </div>

            {/* Advanced options */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <Icon name="settings" size={14} />
                <span>Advanced Options</span>
                {showAdvanced ? <Icon name="expand_less" size={14} /> : <Icon name="expand_more" size={14} />}
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 space-y-3"
                  >
                    <ToggleSwitch
                      label="Stagger Offset"
                      checked={config.staggerOffset}
                      onChange={(v) => handleConfigUpdate('staggerOffset', v)}
                      description="Offset alternating rows by half spacing"
                    />
                    <ToggleSwitch
                      label="Curved Rows"
                      checked={config.curvedRows}
                      onChange={(v) => handleConfigUpdate('curvedRows', v)}
                      description="Allow rows to follow curves"
                    />
                    <ToggleSwitch
                      label="Follow Contours"
                      checked={config.followContours}
                      onChange={(v) => handleConfigUpdate('followContours', v)}
                      description="Align rows with terrain contours"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Statistics */}
            <div className="border-t border-white/10 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="park" size={14} className="text-green-400" />
                <span className="text-xs text-neutral-400">Estimated Layout</span>
              </div>
              <StatsPreview
                config={config}
                species={selectedSpecies}
                fieldArea={fieldArea}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-neutral-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                <Icon name="refresh" size={14} className="inline mr-2" />
                Reset
              </button>
              <button
                onClick={() => onGenerateGrid(config)}
                className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-all"
              >
                <Icon name="auto_fix_high" size={14} className="inline mr-2" />
                Generate Grid
              </button>
            </div>

            {/* Help text */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Icon name="info" size={14} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-300">
                Draw a field boundary first, then click "Generate Grid" to auto-fill with rows.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
