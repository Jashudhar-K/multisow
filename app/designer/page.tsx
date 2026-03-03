'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  MousePointer2,
  Hand,
  Pentagon,
  Square,
  Rows3,
  TreeDeciduous,
  Eraser,
  Ruler,
  Layers,
  Settings,
  Download,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Leaf,
  Sprout,
  TreePine,
  Flower2,
} from 'lucide-react'
import type {
  DrawingTool,
  StrataLayerId,
  FarmMetrics,
  Species,
} from '@/types/farm'
import { useEnhancedDesigner } from '@/hooks/useEnhancedDesigner'
import { SeasonTimeline, MeasurementOverlays } from '@/components/farm'

// New custom designer canvas and sidebar
const FarmCanvas = dynamic(() => import('@/components/designer/FarmCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0A0F0A]">
      <div className="w-12 h-12 rounded-full border-4 border-green-500/30 border-t-green-500 animate-spin" />
    </div>
  ),
})
const DesignerSidebar = dynamic(() => import('@/components/designer/DesignerSidebar'), {
  ssr: false,
  loading: () => (
    <div className="w-80 h-full flex items-center justify-center bg-[#0F1A0F]">
      <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})



// ============================================================================
// SPECIES DATA
// ============================================================================
const speciesLibrary: Species[] = [
  {
    id: 'coconut',
    name: 'Coconut',
    scientificName: 'Cocos nucifera',
    commonNames: ['Coconut Palm'],
    layer: 'canopy',
    heightRange: [15, 25],
    canopyDiameter: 8,
    rootDepth: 2,
    rootSpread: 5,
    shadeTolerance: 'full-sun',
    waterNeeds: 'high',
    growthRate: 'medium',
    maturityYears: 6,
    yieldPerTree: 75,
    pricePerKg: 25,
    extinctionCoefficient: 0.52,
    leafAreaIndex: 4.8,
    nitrogenFixing: false,
    color: '#166534',
  },
  {
    id: 'teak',
    name: 'Teak',
    scientificName: 'Tectona grandis',
    commonNames: ['Sagwan'],
    layer: 'canopy',
    heightRange: [20, 30],
    canopyDiameter: 10,
    rootDepth: 3,
    rootSpread: 8,
    shadeTolerance: 'full-sun',
    waterNeeds: 'medium',
    growthRate: 'slow',
    maturityYears: 20,
    yieldPerTree: 0,
    pricePerKg: 0,
    extinctionCoefficient: 0.55,
    leafAreaIndex: 5.2,
    nitrogenFixing: false,
    color: '#14532d',
  },
  {
    id: 'banana',
    name: 'Banana',
    scientificName: 'Musa',
    commonNames: ['Plantain'],
    layer: 'middle',
    heightRange: [3, 6],
    canopyDiameter: 4,
    rootDepth: 0.5,
    rootSpread: 2,
    shadeTolerance: 'partial-shade',
    waterNeeds: 'high',
    growthRate: 'fast',
    maturityYears: 1,
    yieldPerTree: 25,
    pricePerKg: 30,
    extinctionCoefficient: 0.4,
    leafAreaIndex: 3.2,
    nitrogenFixing: false,
    color: '#15803d',
  },
  {
    id: 'coffee',
    name: 'Coffee',
    scientificName: 'Coffea arabica',
    commonNames: ['Arabica Coffee'],
    layer: 'middle',
    heightRange: [2, 4],
    canopyDiameter: 2.5,
    rootDepth: 1,
    rootSpread: 1.5,
    shadeTolerance: 'partial-shade',
    waterNeeds: 'medium',
    growthRate: 'medium',
    maturityYears: 3,
    yieldPerTree: 5,
    pricePerKg: 400,
    extinctionCoefficient: 0.35,
    leafAreaIndex: 2.8,
    nitrogenFixing: false,
    color: '#065f46',
  },
  {
    id: 'ginger',
    name: 'Ginger',
    scientificName: 'Zingiber officinale',
    commonNames: ['Ginger Root'],
    layer: 'understory',
    heightRange: [0.5, 1],
    canopyDiameter: 0.5,
    rootDepth: 0.3,
    rootSpread: 0.3,
    shadeTolerance: 'shade-tolerant',
    waterNeeds: 'medium',
    growthRate: 'medium',
    maturityYears: 1,
    yieldPerTree: 2,
    pricePerKg: 100,
    extinctionCoefficient: 0.25,
    leafAreaIndex: 1.5,
    nitrogenFixing: false,
    color: '#14b8a6',
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    commonNames: ['Yellow Ginger'],
    layer: 'root',
    heightRange: [0.3, 0.6],
    canopyDiameter: 0.4,
    rootDepth: 0.25,
    rootSpread: 0.2,
    shadeTolerance: 'shade-tolerant',
    waterNeeds: 'medium',
    growthRate: 'medium',
    maturityYears: 1,
    yieldPerTree: 1.5,
    pricePerKg: 120,
    extinctionCoefficient: 0.2,
    leafAreaIndex: 1.2,
    nitrogenFixing: false,
    color: '#a16207',
  },
]

// ============================================================================
// LAYER CONFIGURATION
// ============================================================================
const layerConfig: Record<
  StrataLayerId,
  { name: string; icon: typeof TreePine; color: string; bgColor: string }
> = {
  canopy: {
    name: 'Canopy (15-25m)',
    icon: TreePine,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
  middle: {
    name: 'Middle Tier (5-10m)',
    icon: Leaf,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
  },
  understory: {
    name: 'Understory (0.5-2m)',
    icon: Sprout,
    color: 'text-teal-400TailTailwind',
    bgColor: 'bg-teal-500/20',
  },
  root: {
    name: 'Root Zone (0-120cm)',
    icon: Flower2,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
  },
}

// ============================================================================
// TOOLBAR COMPONENT
// ============================================================================
interface ToolbarProps {
  activeTool: DrawingTool
  onToolChange: (tool: DrawingTool) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

function Toolbar({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolbarProps) {
  const tools: { id: DrawingTool; icon: typeof MousePointer2; label: string }[] = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'pan', icon: Hand, label: 'Pan' },
    { id: 'polygon', icon: Pentagon, label: 'Draw Field' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'row', icon: Rows3, label: 'Draw Row' },
    { id: 'plant', icon: TreeDeciduous, label: 'Place Plant' },
    { id: 'measure', icon: Ruler, label: 'Measure' },
    { id: 'erase', icon: Eraser, label: 'Erase' },
  ]

  return (
    <div className="flex items-center gap-1 p-2 bg-black/90 backdrop-blur-md rounded-xl border border-white/10">
      {/* Drawing tools */}
      <div className="flex items-center gap-1 pr-2 border-r border-white/10">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            className={`p-2.5 rounded-lg transition-all ${
              activeTool === tool.id
                ? 'bg-green-600 text-white'
                : 'text-neutral-400 hover:bg-white/10 hover:text-white'
            }`}
            title={tool.label}
          >
            <tool.icon size={18} />
          </button>
        ))}
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1 pl-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2.5 rounded-lg transition-all ${
            canUndo
              ? 'text-neutral-400 hover:bg-white/10 hover:text-white'
              : 'text-neutral-600 cursor-not-allowed'
          }`}
          title="Undo"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2.5 rounded-lg transition-all ${
            canRedo
              ? 'text-neutral-400 hover:bg-white/10 hover:text-white'
              : 'text-neutral-600 cursor-not-allowed'
          }`}
          title="Redo"
        >
          <Redo2 size={18} />
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// LAYER PANEL COMPONENT
// ============================================================================
interface LayerPanelProps {
  activeLayer: StrataLayerId
  onLayerChange: (layer: StrataLayerId) => void
  selectedSpecies: Species | null
  onSpeciesSelect: (species: Species) => void
  visibleLayers: StrataLayerId[]
  onToggleLayerVisibility: (layer: StrataLayerId) => void
}

function LayerPanel({
  activeLayer,
  onLayerChange,
  selectedSpecies,
  onSpeciesSelect,
  visibleLayers,
  onToggleLayerVisibility,
}: LayerPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const filteredSpecies = useMemo(
    () => speciesLibrary.filter((s) => s.layer === activeLayer),
    [activeLayer]
  )

  return (
    <motion.div
      className="bg-black/90 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden"
      animate={{ width: isExpanded ? 280 : 48 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-green-400" />
            <span className="text-sm font-medium text-white">Layers</span>
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-4">
          {/* Layer selection */}
          <div className="space-y-2">
            {(Object.keys(layerConfig) as StrataLayerId[]).map((layerId) => {
              const config = layerConfig[layerId]
              const Icon = config.icon
              const isActive = activeLayer === layerId
              const isVisible = visibleLayers.includes(layerId)

              return (
                <div
                  key={layerId}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? 'bg-green-600/30 border border-green-500/50'
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => onLayerChange(layerId)}
                >
                  <Icon size={16} className={config.color} />
                  <span className="flex-1 text-xs text-white truncate">
                    {config.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleLayerVisibility(layerId)
                    }}
                    className="p-1 rounded hover:bg-white/10"
                  >
                    {isVisible ? (
                      <Eye size={14} className="text-neutral-400" />
                    ) : (
                      <EyeOff size={14} className="text-neutral-600" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Species selection */}
          <div className="border-t border-white/10 pt-3">
            <div className="text-xs text-neutral-400 mb-2">
              Species for {layerConfig[activeLayer].name.split(' ')[0]}
            </div>
            <div className="space-y-1">
              {filteredSpecies.map((species) => (
                <button
                  key={species.id}
                  onClick={() => onSpeciesSelect(species)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                    selectedSpecies?.id === species.id
                      ? 'bg-green-600/30 border border-green-500/50'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full species-color-dot"
                    data-dot-color={species.color}
                    aria-label={species.name + ' color'}
                  />
                  <span className="text-xs text-white">{species.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ============================================================================
// AI ASSISTANT BUTTON
// ============================================================================
interface AiAssistantButtonProps {
  onClick: () => void
  isGenerating: boolean
}

function AiAssistantButton({ onClick, isGenerating }: AiAssistantButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isGenerating}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-shadow disabled:opacity-70"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Sparkles size={18} className={isGenerating ? 'animate-spin' : ''} />
      <span>{isGenerating ? 'Generating...' : 'Design for Me'}</span>
    </motion.button>
  )
}

// ============================================================================
// MAIN FARM DESIGNER PAGE
// ============================================================================
export default function FarmDesignerPage() {
  // Enhanced designer hook (Phase 7 & 8)
  const {
    designerState,
    compatibilityWarnings,
    selectedPresetId,
    toggleOverlay,
    setseason,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEnhancedDesigner()

  // Additional UI state (not managed by enhanced designer)
  const [activeTool, setActiveTool] = useState<DrawingTool>('pan')
  const [activeLayer, setActiveLayer] = useState<StrataLayerId>('canopy')
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(
    speciesLibrary[0]
  )
  const [visibleLayers, setVisibleLayers] = useState<StrataLayerId[]>([
    'canopy',
    'middle',
    'understory',
    'root',
  ])
  const [rows, setRows] = useState<
    { id: string; start: [number, number]; end: [number, number]; spacing: number; speciesId: string; layer: StrataLayerId }[]
  >([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Computed metrics
  const metrics: FarmMetrics = useMemo(() => {
    const totalTrees = designerState.plants.length + rows.reduce((acc, row) => {
      const dx = row.end[0] - row.start[0]
      const dy = row.end[1] - row.start[1]
      const length = Math.sqrt(dx * dx + dy * dy)
      return acc + Math.floor(length / row.spacing) + 1
    }, 0)

    return {
      totalArea: designerState.farmBounds.width * designerState.farmBounds.height / 10000 || 2.5,
      plantedArea: totalTrees > 0 ? (designerState.farmBounds.width * designerState.farmBounds.height / 10000 || 2.5) * 0.8 : 0,
      treeDensity: totalTrees / (designerState.farmBounds.width * designerState.farmBounds.height / 10000 || 2.5),
      ler: 1.8 + Math.min(totalTrees / 100, 0.7),
      waterSavings: Math.min(70, 40 + totalTrees * 0.3),
      carbonSequestration: totalTrees * 0.02,
      expectedYield: [],
      totalRevenue: totalTrees * 1200,
      roi: 35,
      rootOverlapIndex: 0.28,
      canopyCover: Math.min(95, totalTrees * 0.8),
    }
  }, [designerState.plants, rows, designerState.farmBounds])

  const handleToggleLayerVisibility = useCallback((layer: StrataLayerId) => {
    setVisibleLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    )
  }, [])

  // Undo/redo now handled by enhanced designer hook

  const handleAiDesign = useCallback(async () => {
    setIsGenerating(true)

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate sample layout
    const generatedRows = [
      { id: 'ai-row-1', start: [-20, -20] as [number, number], end: [20, -20] as [number, number], spacing: 8, speciesId: 'coconut', layer: 'canopy' as StrataLayerId },
      { id: 'ai-row-2', start: [-20, 0] as [number, number], end: [20, 0] as [number, number], spacing: 4, speciesId: 'banana', layer: 'middle' as StrataLayerId },
      { id: 'ai-row-3', start: [-20, 20] as [number, number], end: [20, 20] as [number, number], spacing: 8, speciesId: 'coconut', layer: 'canopy' as StrataLayerId },
    ]

    setRows(generatedRows)
    setIsGenerating(false)
  }, [])

  const handleExport = useCallback(() => {
    // Export logic
    const exportData = {
      farmBounds: designerState.farmBounds,
      plants: designerState.plants,
      rows,
      metrics,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'farm-design.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [designerState.farmBounds, designerState.plants, rows, metrics])

  // Map preset layer names to StrataLayerId
  const mapLayerToStrataId = (layer: string): StrataLayerId => {
    const layerMap: Record<string, StrataLayerId> = {
      'overstory': 'canopy',
      'canopy': 'canopy',
      'middle': 'middle',
      'understory': 'understory',
      'vertical': 'middle', // Map vertical layer to middle
      'root': 'root',
      'ground': 'root',
    }
    return layerMap[layer] || 'understory'
  }

  // Load farm profile from localStorage and generate plants if available
  const [farmProfile, setFarmProfile] = useState<any>(null);
  const [plantsFromFarm, setPlantsFromFarm] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('multisow_farm_profile');
      if (stored) {
        const farm = JSON.parse(stored);
        setFarmProfile(farm);
        // Generate simple plant layout from recommended crops
        if (farm.recommendedCrops && farm.size) {
          const crops = farm.recommendedCrops;
          const area = parseFloat(farm.size) * 4047; // acres to m^2
          const spacing = Math.sqrt(area / crops.length);
          setPlantsFromFarm(
            crops.map((crop: string, i: number) => ({
              id: `farm-crop-${i}`,
              x: 20 + i * spacing * 0.5,
              y: 50 + (i % 2) * spacing * 0.5,
              layer: (speciesLibrary.find(s => s.name === crop)?.layer || 'middle'),
              species: crop.toLowerCase(),
              spacingRadius: 2,
              growthStage: 1,
            }))
          );
        }
      }
    }
  }, []);

  // Convert plants for 3D scene
  const plants3D = useMemo(
    () =>
      plantsFromFarm.length > 0
        ? plantsFromFarm
        : designerState.plants
            .filter((p) => visibleLayers.includes(mapLayerToStrataId(p.layer)))
            .map((p) => ({
              id: p.id,
              speciesId: p.species,
              position: { x: p.x, y: p.y },
              geoPosition: { lat: p.y / 1000, lng: p.x / 1000 },
              layer: mapLayerToStrataId(p.layer),
            })),
    [designerState.plants, visibleLayers, plantsFromFarm]
  )

  // Convert plants for overlays (different format required)
  const plantsForOverlays = useMemo(
    () =>
      designerState.plants.map((p) => ({
        x: p.x,
        y: p.y,
        species: p.species,
        layer: p.layer,
      })),
    [designerState.plants]
  )

  return (
    <div className="h-full w-full flex flex-col bg-[#0A0F0A] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">
            Multi<span className="text-green-400">Sow</span> Designer
          </h1>
          <Toolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>

        <div className="flex items-center gap-3">
          <AiAssistantButton onClick={handleAiDesign} isGenerating={isGenerating} />
          <button
            onClick={handleExport}
            className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
            title="Export"
          >
            <Download size={18} />
          </button>
          <button className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all" title="Settings">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left sidebar - Layer panel and overlays */}
        <div className="w-[300px] shrink-0 p-3 flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
          <LayerPanel
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            selectedSpecies={selectedSpecies}
            onSpeciesSelect={setSelectedSpecies}
            visibleLayers={visibleLayers}
            onToggleLayerVisibility={handleToggleLayerVisibility}
          />
          <MeasurementOverlays
            overlays={[
              { type: 'sunlight', enabled: designerState.overlays.sunlight },
              { type: 'root-competition', enabled: designerState.overlays.rootCompetition },
              { type: 'water-zones', enabled: designerState.overlays.waterZones },
            ]}
            onToggle={(type) => {
              // Convert hyphenated format to camelCase
              const typeMap: Record<string, 'sunlight' | 'rootCompetition' | 'waterZones'> = {
                'sunlight': 'sunlight',
                'root-competition': 'rootCompetition',
                'water-zones': 'waterZones',
              };
              toggleOverlay(typeMap[type]);
            }}
            plants={plantsForOverlays}
            farmBounds={{
              width: designerState.farmBounds.width,
              height: designerState.farmBounds.height,
            }}
          />
        </div>

        {/* Main viewport */}
        <div className="flex-1 p-3 relative min-w-0">
          <div className="h-full rounded-xl overflow-hidden border border-white/10">
            {/* 3D Farm Canvas */}
            <FarmCanvas
              plants={plants3D}
              rows={rows}
              visibleLayers={visibleLayers}
              flyoverActive={designerState.flyoverActive}
              farmBounds={{
                x: designerState.farmBounds.x,
                y: designerState.farmBounds.y,
                width: designerState.farmBounds.width,
                height: designerState.farmBounds.height,
              }}
            />
          </div>

          {/* Phase 7 & 8 Components */}
          {/* Season Timeline - Bottom of viewport */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <SeasonTimeline
              season={designerState.season}
              onSeasonChange={setseason}
              mode="monthly"
            />
          </div>


        </div>

        {/* Right sidebar - DesignerSidebar */}
        <DesignerSidebar
          compatibilityWarnings={compatibilityWarnings}
          plants={plants3D}
          season={designerState.season}
          overlays={designerState.overlays}
          selectedPresetId={selectedPresetId}
        />
      </div>
    </div>
  )
}
