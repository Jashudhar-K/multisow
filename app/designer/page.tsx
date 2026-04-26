'use client'
/**
 * /designer — 3-panel multi-tier intercropping designer.
 *
 * LEFT (320 px)   : Farm config + model selection + layer stack
 * CENTER (flex)   : Tabs — 3D View | Planting Guide | AI Advisor | Optimizer
 * RIGHT (280 px)  : Real-time metric sidebar + action buttons
 */

import { Suspense, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icon'
import { useDesignerState, type LayerKey, type LayerCropEntry } from '@/hooks/useDesignerState'
import { useAIAdvisor } from '@/hooks/useAIAdvisor'
import { useAIFarm } from '@/context/AIFarmContext'
import { DesignerSkeleton, ChartSkeleton } from '@/components/skeletons'
import { PlantingGuidePanel } from '@/components/designer/PlantingGuidePanel'
import { CompatibilityWarningPanel } from '@/components/designer/CompatibilityWarningPanel'
import { generatePlantsFromModel } from '@/lib/generatePlantsFromModel'
import { formatArea, formatMoney, formatLER, acresToCents, centsToAcres, acresToFarmDimensions, thaToTotalTonnes } from '@/lib/units'

// ---------------------------------------------------------------------------
// Dynamic imports — heavy 3D / chart components
// ---------------------------------------------------------------------------
const FarmCanvas = dynamic(() => import('@/components/designer/FarmCanvas'), {
  ssr: false,
  loading: () => <DesignerSkeleton />,
})



// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SOIL_OPTS = ['alluvial','black','red','laterite','desert','mountain'] as const
const REGION_OPTS = ['Kerala','Karnataka','Tamil Nadu','Andhra Pradesh','Maharashtra','Telangana','Other']
const GOAL_OPTS = [
  { value: 'maximize_profit', label: 'Max Profit' },
  { value: 'maximize_yield',  label: 'Max Yield' },
  { value: 'sustainability',  label: 'Sustainability' },
]

const LAYER_META: Record<LayerKey, { label: string; height: string; icon: string; color: string }> = {
  canopy:     { label: 'Top Layer',     height: '15–25 m', icon: 'park',                color: '#22c55e' },
  midstory:   { label: 'Middle Layer',  height: '3–10 m',  icon: 'energy_savings_leaf', color: '#fbbf24' },
  understory: { label: 'Lower Layer',   height: '0.5–2 m', icon: 'eco',                 color: '#fb923c' },
  groundcover:{ label: 'Ground Layer',  height: '<0.5 m',  icon: 'grass',               color: '#a78bfa' },
}

const CROP_CATALOGUE: Record<LayerKey, { id: string; name: string; spacingM: number }[]> = {
  canopy: [
    { id: 'coconut',   name: 'Coconut',   spacingM: 7.5 },
    { id: 'teak',      name: 'Teak',      spacingM: 5 },
    { id: 'jackfruit', name: 'Jackfruit', spacingM: 8 },
    { id: 'mango',     name: 'Mango',     spacingM: 10 },
  ],
  midstory: [
    { id: 'banana',  name: 'Banana',  spacingM: 3 },
    { id: 'coffee',  name: 'Coffee',  spacingM: 2 },
    { id: 'cocoa',   name: 'Cocoa',   spacingM: 3 },
    { id: 'papaya',  name: 'Papaya',  spacingM: 2.5 },
  ],
  understory: [
    { id: 'ginger',    name: 'Ginger',    spacingM: 0.5 },
    { id: 'turmeric',  name: 'Turmeric',  spacingM: 0.5 },
    { id: 'cardamom',  name: 'Cardamom',  spacingM: 1 },
    { id: 'pineapple', name: 'Pineapple', spacingM: 0.6 },
  ],
  groundcover: [
    { id: 'blackpepper', name: 'Black Pepper', spacingM: 0.3 },
    { id: 'vanilla',     name: 'Vanilla',      spacingM: 0.4 },
    { id: 'betelleaf',   name: 'Betel Leaf',   spacingM: 0.3 },
  ],
}

const PRESETS = [
  { id: 'wayanad',     name: 'Wayanad Classic',         layers: { canopy: [{id:'coconut',name:'Coconut',spacingM:7.5},{id:'teak',name:'Teak',spacingM:5}],     midstory: [{id:'banana',name:'Banana',spacingM:3},{id:'coffee',name:'Coffee',spacingM:2}],           understory: [{id:'ginger',name:'Ginger',spacingM:0.5}],                        groundcover: [{id:'blackpepper',name:'Black Pepper',spacingM:0.3}] }, ler: 1.6, yield: '4.2 t/acre', revenue: '₹3.8L – ₹5.2L/yr' },
  { id: 'karnataka',   name: 'Karnataka Spice Garden',  layers: { canopy: [{id:'silveroak',name:'Silver Oak',spacingM:6}],                                      midstory: [{id:'coffee',name:'Coffee',spacingM:2.5},{id:'cocoa',name:'Cocoa',spacingM:3}],        understory: [{id:'cardamom',name:'Cardamom',spacingM:1.5},{id:'turmeric',name:'Turmeric',spacingM:0.5}], groundcover: [{id:'blackpepper',name:'Black Pepper',spacingM:0.3}] }, ler: 1.5, yield: '3.8 t/acre', revenue: '₹4.5L – ₹6.0L/yr' },
  { id: 'maharashtra', name: 'Maharashtra Coconut-Mango',layers: { canopy: [{id:'coconut',name:'Coconut',spacingM:7.5},{id:'mango',name:'Mango',spacingM:10}], midstory: [{id:'banana',name:'Banana',spacingM:3}],                                               understory: [{id:'turmeric',name:'Turmeric',spacingM:0.5},{id:'ginger',name:'Ginger',spacingM:0.5}], groundcover: [] },                                                   ler: 1.4, yield: '3.5 t/acre', revenue: '₹2.5L – ₹3.8L/yr' },
  { id: 'tamilnadu',   name: 'Tamil Nadu Tropical',     layers: { canopy: [{id:'coconut',name:'Coconut',spacingM:7.5}],                                         midstory: [{id:'banana',name:'Banana',spacingM:3},{id:'papaya',name:'Papaya',spacingM:2.5}],     understory: [{id:'turmeric',name:'Turmeric',spacingM:0.5},{id:'pineapple',name:'Pineapple',spacingM:0.6}], groundcover: [{id:'vanilla',name:'Vanilla',spacingM:0.4}] }, ler: 1.45, yield: '3.6 t/acre', revenue: '₹3.0L – ₹4.2L/yr' },
  { id: 'andhra',      name: 'Andhra Commercial',       layers: { canopy: [{id:'coconut',name:'Coconut',spacingM:7.5}],                                         midstory: [{id:'cocoa',name:'Cocoa',spacingM:3},{id:'banana',name:'Banana',spacingM:3}],         understory: [{id:'ginger',name:'Ginger',spacingM:0.5}],                        groundcover: [{id:'blackpepper',name:'Black Pepper',spacingM:0.3}] }, ler: 1.5, yield: '4.0 t/acre', revenue: '₹3.5L – ₹4.8L/yr' },
  { id: 'cocoa',       name: 'Cocoa Premium Research',  layers: { canopy: [{id:'jackfruit',name:'Jackfruit',spacingM:8}],                                       midstory: [{id:'cocoa',name:'Cocoa',spacingM:3}],                                                understory: [{id:'cardamom',name:'Cardamom',spacingM:1.5},{id:'ginger',name:'Ginger',spacingM:0.5}], groundcover: [{id:'vanilla',name:'Vanilla',spacingM:0.4}] }, ler: 1.7, yield: '4.8 t/acre', revenue: '₹5.0L – ₹7.5L/yr' },
]

const CENTER_TABS = [
  { id: '3d',       label: '3D View',       icon: 'layers' },
  { id: 'planting', label: 'Planting Guide', icon: 'eco' },
  { id: 'advisor',  label: 'AI Advisor',    icon: 'auto_awesome' },
  { id: 'optimizer',label: 'Optimizer',     icon: 'tune' },
]

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function FarmDesignerPage() {
  const ds = useDesignerState()
  const advisor = useAIAdvisor()
  const { isAIProcessing, predictions } = useAIFarm()
  const [selectedPlantId, setSelectedPlantId] = useState<string | undefined>()

  // Memoised guard: every layer is guaranteed to be an array regardless of
  // any stale localStorage entry. useDesignerState now returns safeState but
  // this useMemo is a final safety net at the component boundary.
  const safeLayers = useMemo(() => {
    const layers = ds.state?.layers
    if (!layers || typeof layers !== 'object') {
      return { canopy: [] as LayerCropEntry[], midstory: [] as LayerCropEntry[], understory: [] as LayerCropEntry[], groundcover: [] as LayerCropEntry[] }
    }
    return {
      canopy:      Array.isArray(layers.canopy)      ? layers.canopy      : [] as LayerCropEntry[],
      midstory:    Array.isArray(layers.midstory)    ? layers.midstory    : [] as LayerCropEntry[],
      understory:  Array.isArray(layers.understory)  ? layers.understory  : [] as LayerCropEntry[],
      groundcover: Array.isArray(layers.groundcover) ? layers.groundcover : [] as LayerCropEntry[],
    }
  }, [ds.state?.layers])

  // Generate 3D plant instances from the current layer crops
  const generatedPlants = useMemo(() => {
    const cropObjects = (Object.entries(safeLayers) as [LayerKey, LayerCropEntry[]][]).flatMap(([layerKey, layerCrops]) =>
      layerCrops.map(c => ({ id: c.id, name: c.name, spacingM: c.spacingM, layer: layerKey }))
    )
    if (cropObjects.length === 0) return []
    return generatePlantsFromModel({
      id: 'designer',
      name: ds.state?.farmName ?? 'Farm',
      crops: cropObjects,
      acres: ds.state?.acres ?? 1,
    })
  }, [safeLayers, ds.state?.acres, ds.state?.farmName])

  const [activeTab, setActiveTab] = useState<string>('3d')
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [presetTab, setPresetTab] = useState<'presets' | 'custom'>('presets')
  const [chatInput, setChatInput] = useState('')
  const [optimizing, setOptimizing] = useState(false)
  const [optimizerResult, setOptimizerResult] = useState<unknown>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const latestPrediction = predictions[0] ?? null

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [advisor.messages.length])

  const lerColor = useMemo(() => {
    const ler = latestPrediction?.system_LER ?? 0
    if (ler >= 1.4) return 'text-green-400'
    if (ler >= 1.0) return 'text-amber-400'
    return 'text-red-400'
  }, [latestPrediction?.system_LER])

  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim()) return
    await advisor.sendMessage(chatInput)
    setChatInput('')
  }, [chatInput, advisor])

  const handleQuickChip = useCallback((text: string) => {
    void advisor.sendMessage(text)
  }, [advisor])

  const handleRunOptimizer = useCallback(async () => {
    setOptimizing(true)
    try {
      const res = await fetch('/ml/optimize/strata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm_id: 'designer',
          acres: ds.state.acres,
          environment: {
            soil_type: ds.state.soilType,
            incident_par: 400,
            solar_elevation_deg: 55,
            soil_n: 80, soil_p: 30, soil_k: 200,
            vwc: 0.25, gdd_available: 1200,
          },
          constraints: { budget_limit_inr: ds.state.budget_inr },
          optimization_goal: ds.state.goal,
          population_size: 40, n_generations: 20, n_recommendations: 5,
        }),
      })
      if (res.ok) setOptimizerResult(await res.json())
    } catch { /* silent */ }
    finally { setOptimizing(false) }
  }, [ds.state])

  const handleExport = useCallback(() => {
    const data = { farm: ds.state, prediction: latestPrediction, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `multisow-${ds.state.farmName ?? 'farm'}.json`
    a.click(); URL.revokeObjectURL(url)
  }, [ds.state, latestPrediction])

  return (
    <div className="flex h-screen bg-[#070d07] text-white overflow-hidden">

      {/* ================================================================== */}
      {/* LEFT PANEL (320 px)                                                 */}
      {/* ================================================================== */}
      <div className="w-80 border-r border-white/10 flex flex-col shrink-0 overflow-y-auto">

        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={ds.undo} disabled={!ds.canUndo}
              className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors" title="Undo">
              <Icon name="undo" size={15} />
            </button>
            <button onClick={ds.redo} disabled={!ds.canRedo}
              className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors" title="Redo">
              <Icon name="redo" size={15} />
            </button>
          </div>
          {isAIProcessing && (
            <div className="flex items-center gap-1.5 text-xs text-green-400">
              <Icon name="progress_activity" size={12} className="animate-spin" /> AI recalculating…
            </div>
          )}
        </div>

        {/* Farm Config */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
            <Icon name="settings" size={13} /> Farm Configuration
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-white/40 mb-1">Acres</label>
              <input type="number" min={0.1} max={100} step={0.1}
                value={ds.state.acres}
                onChange={e => ds.updateConfig({ acres: Number(e.target.value) })}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1">Cents</label>
              <input type="number" min={1} max={10000} step={1}
                value={acresToCents(ds.state.acres)}
                onChange={e => ds.updateConfig({ acres: centsToAcres(Number(e.target.value) || 0) })}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1">Region</label>
              <select value={ds.state.region}
                onChange={e => ds.updateConfig({ region: e.target.value })}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-sm focus:outline-none focus:border-green-500/50 appearance-none">
                {REGION_OPTS.map(r => <option key={r} value={r} className="bg-[#0f1a0f]">{r}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-white/40 mb-1">Soil Type</label>
            <div className="grid grid-cols-3 gap-1">
              {SOIL_OPTS.map(s => (
                <button key={s} onClick={() => ds.updateConfig({ soilType: s })}
                  className={`rounded-lg py-1 text-[11px] capitalize border transition-all
                    ${ds.state.soilType === s
                      ? 'border-green-500 bg-green-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-white/25'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-white/40 mb-1">Goal</label>
            <div className="flex gap-1">
              {GOAL_OPTS.map(g => (
                <button key={g.value}
                  onClick={() => ds.updateConfig({ goal: g.value as 'maximize_profit' | 'maximize_yield' | 'sustainability' })}
                  className={`flex-1 rounded-lg py-1 text-[11px] border transition-all
                    ${ds.state.goal === g.value
                      ? 'border-green-500 bg-green-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-white/25'}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-white/40 mb-1">Budget (INR)</label>
            <input type="number" min={10000} step={10000}
              value={ds.state.budget_inr}
              onChange={e => ds.updateConfig({ budget_inr: Number(e.target.value) })}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-sm focus:outline-none focus:border-green-500/50" />
          </div>
        </div>

        {/* Model Selection */}
        <div className="p-4 border-b border-white/10">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 flex items-center gap-1.5">
            <Icon name="layers" size={13} /> Model Selection
          </h3>
          <div className="flex rounded-lg border border-white/10 overflow-hidden mb-3">
            {(['presets', 'custom'] as const).map(tab => (
              <button key={tab} onClick={() => setPresetTab(tab)}
                className={`flex-1 py-1.5 text-xs capitalize transition-colors
                  ${presetTab === tab ? 'bg-green-600/20 text-green-400' : 'text-white/40 hover:text-white/70'}`}>
                {tab}
              </button>
            ))}
          </div>

          {presetTab === 'presets' ? (
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {PRESETS.map(p => (
                <button key={p.id}
                  onClick={() => ds.loadPreset(p.id, p.layers as Record<LayerKey, LayerCropEntry[]>)}
                  className={`w-full rounded-xl p-3 text-left border transition-all
                    ${ds.state.selectedPresetId === p.id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/25'}`}>
                  <div className="font-medium text-sm text-white">{p.name}</div>
                  <div className="text-[11px] text-white/40 mt-0.5">LER {p.ler} · {p.yield} · {p.revenue}</div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/40">Use the Layer Stack below to build a custom model.</p>
          )}
        </div>

        {/* Layer Stack */}
        <div className="p-4 flex-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 flex items-center gap-1.5">
            <Icon name="energy_savings_leaf" size={13} /> Layer Stack
          </h3>
          <div className="space-y-3">
            {(Object.keys(LAYER_META) as LayerKey[]).map(layer => {
              const meta = LAYER_META[layer]
              const crops = (safeLayers[layer]) ?? []
              const catalogue = CROP_CATALOGUE[layer]
              return (
                <div key={layer} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon name={meta.icon} size={14} className={`text-[${meta.color}]`} style={{ color: meta.color }} />
                      <span className="text-sm font-medium text-white">{meta.label}</span>
                      <span className="text-[10px] text-white/30">{meta.height}</span>
                    </div>
                    {/* Crop picker */}
                    <div className="relative group">
                      <button className="p-1 rounded-lg hover:bg-white/10 transition-colors" tabIndex={0}>
                        <Icon name="add" size={13} className="text-white/50" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-white/10 bg-[#0f1a0f] shadow-2xl z-50
                        opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity">
                        {catalogue.map(c => (
                          <button key={c.id}
                            onClick={() => ds.addCropToLayer(layer, {
                              id: `${c.id}-${Date.now()}`,
                              name: c.name,
                              spacingM: c.spacingM,
                            })}
                            className="w-full px-3 py-2 text-left text-xs text-white/70 hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl transition-colors">
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {crops.length === 0 ? (
                    <p className="text-[11px] text-white/25 italic">No crops added</p>
                  ) : (
                    <div className="space-y-1">
                      {crops.map(crop => (
                        <div key={crop.id} className="flex items-center justify-between bg-white/5 rounded-lg px-2 py-1">
                          <span className="text-xs text-white/80">{crop.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-white/30">{crop.spacingM}m</span>
                            <button onClick={() => ds.removeCropFromLayer(layer, crop.id)}
                              className="hover:text-red-400 transition-colors">
                              <Icon name="close" size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Warnings Panel */}
          <CompatibilityWarningPanel />
        </div>

        {/* Apply & Predict button */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={() => void ds.runPrediction()}
            disabled={isAIProcessing || ds.totalPlants === 0}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            {isAIProcessing
              ? <><Icon name="progress_activity" size={16} className="animate-spin" /> Predicting…</>
              : <><Icon name="play_arrow" size={18} /> Apply &amp; Predict</>}
          </button>
          <p className="text-[10px] text-white/30 text-center mt-1.5">
            Runs FOHEM prediction on your current layout
          </p>
        </div>
      </div>

      {/* ================================================================== */}
      {/* CENTER PANEL (flex-grow)                                            */}
      {/* ================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Tab bar */}
        <div className="border-b border-white/10 px-4 flex items-center gap-1 h-11 shrink-0">
          {CENTER_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-green-600/20 text-green-400'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
                <Icon name={tab.icon} size={14} />{tab.label}
              </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">

            {activeTab === '3d' && (
              <motion.div key="3d" className="absolute inset-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Icon name="progress_activity" className="animate-spin text-green-400" size={40}/></div>}>
                  <FarmCanvas
                    plants={generatedPlants}
                    farmBounds={{ x: 0, y: 0, width: ds.farmWidth, height: ds.farmLength }}
                    season={0}
                    overlays={{ sunlight: false, rootCompetition: false, waterZones: false }}
                    onPlantClick={setSelectedPlantId}
                    showGrid={true}
                    flyoverActive={false}
                    selectedPlantId={selectedPlantId}
                  />
                </Suspense>
              </motion.div>
            )}

            {activeTab === 'planting' && (
              <motion.div key="planting" className="absolute inset-0 overflow-y-auto p-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <PlantingGuidePanel presetId={ds.state.selectedPresetId} />
              </motion.div>
            )}

            {activeTab === 'advisor' && (
              <motion.div key="advisor" className="absolute inset-0 flex flex-col"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Quick chips */}
                <div className="p-4 border-b border-white/10 flex flex-wrap gap-2 shrink-0">
                  {[
                    'Suggest best crops for my soil',
                    'Explain this LER score',
                    'How do I improve yield?',
                    'What are the risks?',
                    'Generate planting schedule',
                  ].map(chip => (
                    <button key={chip} onClick={() => handleQuickChip(chip)}
                      className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-white/60 hover:border-green-500/50 hover:text-green-400 transition-all">
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {advisor.messages.length === 0 && (
                    <div className="text-center text-white/30 text-sm mt-12">
                      <Icon name="chat" size={32} className="mx-auto mb-3 opacity-30" />
                      Ask me anything about your intercropping system.
                    </div>
                  )}
                  {advisor.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm
                        ${msg.role === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-white/10 text-white/90 border border-white/10'}`}>
                        {msg.content}
                        {msg.confidence !== undefined && msg.role === 'assistant' && (
                          <div className="text-[10px] opacity-50 mt-1">
                            Confidence: {Math.round(msg.confidence * 100)}% · {msg.source}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {advisor.isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
                        <Icon name="progress_activity" size={14} className="animate-spin text-green-400" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 flex gap-2 shrink-0">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && void handleSendChat()}
                    placeholder="Ask your AI advisor…"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-green-500/50"
                  />
                  <button onClick={() => void handleSendChat()} disabled={advisor.isLoading || !chatInput.trim()}
                    className="p-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 transition-colors">
                    <Icon name="send" size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'optimizer' && (
              <motion.div key="optimizer" className="absolute inset-0 overflow-y-auto p-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="text-lg font-bold mb-4">Strata Optimizer</h3>
                <p className="text-sm text-white/50 mb-6">
                  Uses NSGA-II genetic algorithm to find Pareto-optimal crop configurations for your objectives.
                </p>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6">
                  <h4 className="text-sm font-medium mb-2">Optimization Objectives</h4>
                  {['Maximize LER', 'Maximize Revenue', 'Minimize Water Use', 'Minimize Competition Index'].map(obj => (
                    <label key={obj} className="flex items-center gap-2 py-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-green-500" />
                      <span className="text-sm text-white/70">{obj}</span>
                    </label>
                  ))}
                </div>
                <button onClick={() => void handleRunOptimizer()} disabled={optimizing}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 font-medium transition-colors">
                  {optimizing ? <Icon name="progress_activity" size={16} className="animate-spin" /> : <Icon name="tune" size={16} />}
                  {optimizing ? 'Optimizing…' : 'Run Optimizer'}
                </button>
                {optimizerResult !== null && (
                  <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Optimizer Results</h4>
                    <pre className="text-xs text-white/50 overflow-auto max-h-64">
                      {JSON.stringify(optimizerResult, null, 2)}
                    </pre>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ================================================================== */}
      {/* RIGHT PANEL (280 px, collapsible)                                   */}
      {/* ================================================================== */}
      <div className={`relative border-l border-white/10 flex flex-col shrink-0 transition-all duration-200 ${rightPanelOpen ? 'w-72' : 'w-10'}`}>

        <button onClick={() => setRightPanelOpen(o => !o)}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-10 bg-[#0f1a0f] border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors z-10">
          {rightPanelOpen ? <Icon name="chevron_right" size={12}/> : <Icon name="chevron_left" size={12}/>}
        </button>

        {rightPanelOpen && (
          <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <Icon name="speed" size={13} /> Live Metrics
            </h3>

            {[
              { label: 'LER Score',    value: latestPrediction ? formatLER(latestPrediction.system_LER) : '—', sub: 'Land Equivalent Ratio', cls: lerColor },
              { label: 'Total Plants', value: String(ds.totalPlants), sub: `across ${Object.values(ds.layerCounts).filter(Boolean).length} layers`, cls: 'text-white' },
              { label: 'Farm Area',    value: formatArea(ds.state.acres), sub: `${acresToCents(ds.state.acres)} cents`, cls: 'text-white' },
            ].map(m => (
              <div key={m.label} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className={`text-2xl font-bold ${m.cls}`}>{m.value}</div>
                <div className="text-xs font-medium text-white/70">{m.label}</div>
                <div className="text-[11px] text-white/30">{m.sub}</div>
              </div>
            ))}

            {/* Layer distribution */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-xs font-medium text-white/60 mb-2">Layer Distribution</div>
              {(Object.keys(LAYER_META) as LayerKey[]).map(layer => (
                <div key={layer} className="flex items-center justify-between py-1">
                  <span className="text-xs text-white/50">{LAYER_META[layer].label}</span>
                  <span className="text-xs font-medium" style={{ color: LAYER_META[layer].color }}>
                    {(safeLayers[layer]?.length ?? 0)} crops
                  </span>
                </div>
              ))}
            </div>

            {/* Predicted yield per layer */}
            {latestPrediction && latestPrediction.layers && Object.keys(latestPrediction.layers).length > 0 && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-xs font-medium text-white/60 mb-2 flex items-center gap-1">
                  <Icon name="bar_chart" size={12}/> Predicted Yield
                </div>
                {Object.entries(latestPrediction.layers).map(([layer, data]) => (
                  <div key={layer} className="flex items-center justify-between py-1">
                    <span className="text-xs text-white/50 capitalize">{layer}</span>
                    <span className="text-xs font-medium text-green-400">
                      {thaToTotalTonnes((data as { predicted_yield_t_ha: number }).predicted_yield_t_ha, ds.state.acres).toFixed(2)} t
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => void advisor.sendMessage('Run a full analysis of my current farm configuration.')}
                className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Icon name="auto_awesome" size={14} /> Run Full Analysis
              </button>
              <button onClick={handleExport}
                className="w-full py-2.5 rounded-xl border border-white/15 hover:bg-white/10 text-sm font-medium text-white/70 transition-colors flex items-center justify-center gap-2">
                <Icon name="download" size={14} /> Export Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inline planting guide loader
// ---------------------------------------------------------------------------
function PlantingGuideInline({ presetId }: { presetId: string | null }) {
  const PlantingGuide = dynamic(() => import('@/components/PlantingGuide'), {
    ssr: false,
    loading: () => <ChartSkeleton className="h-48" />,
  })
  if (!presetId) {
    return (
      <div className="text-center text-white/40 mt-12">
        <Icon name="eco" size={32} className="mx-auto mb-3 opacity-30"/>
        <p>Select a preset or build a custom model to view the planting guide.</p>
      </div>
    )
  }
  return <PlantingGuide presetId={presetId} />
}
