'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icon';// ============================================================================
// TYPES
// ============================================================================

interface CropEntry {
  name: string
  layer: string
  typical_yield_t_ha: number
  price_per_tonne_inr: number
  min_spacing_m: number
  max_spacing_m: number
  shade_tolerance: number
  synergistic_with: string[]
  establishment_cost_inr_ha: number
}

interface CropResponse {
  total_crops: number
  crops: CropEntry[]
}

// ============================================================================
// LAYER COLORS / ICONS
// ============================================================================

const LAYER_META: Record<string, { color: string; bg: string; icon: string }> = {
  canopy: { color: 'text-green-400', bg: 'bg-green-500/10', icon: '🌳' },
  middle: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: '🌿' },
  understory: { color: 'text-orange-400', bg: 'bg-orange-500/10', icon: '🌱' },
  belowground: { color: 'text-amber-600', bg: 'bg-amber-600/10', icon: '🥕' },
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CropsDatabase() {
  const [crops, setCrops] = useState<CropEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterLayer, setFilterLayer] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'yield' | 'price' | 'cost'>('name')
  const [selectedCrop, setSelectedCrop] = useState<CropEntry | null>(null)

  const fetchCrops = async (layer?: string) => {
    setLoading(true)
    setError('')
    try {
      const url = layer && layer !== 'all'
        ? `/ml/optimize/crops?layer=${layer}`
        : '/ml/optimize/crops'
      const res = await fetch(url)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `HTTP ${res.status}`)
      }
      const data: CropResponse = await res.json()
      setCrops(data.crops)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load crops.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCrops(filterLayer)
  }, [filterLayer])

  // Filter + sort
  const filtered = crops
    .filter((c) =>
      search
        ? c.name.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'yield':
          return b.typical_yield_t_ha - a.typical_yield_t_ha
        case 'price':
          return b.price_per_tonne_inr - a.price_per_tonne_inr
        case 'cost':
          return a.establishment_cost_inr_ha - b.establishment_cost_inr_ha
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Icon name="agriculture" className="w-5 h-5 text-lime-400" />
          Crops Database
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Browse all crops available in the optimisation database — yields, spacing, costs, shade tolerance, and synergies.
        </p>
      </div>

      {/* Filters bar */}
      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crops…"
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-lime-500/50 focus:outline-none"
          />
        </div>

        {/* Layer filter */}
        <div className="flex gap-2 items-center">
          <Icon name="filter_list" className="w-4 h-4 text-neutral-400" />
          {['all', 'canopy', 'middle', 'understory'].map((l) => (
            <button
              key={l}
              onClick={() => setFilterLayer(l)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize transition ${
                filterLayer === l
                  ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
                  : 'text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-lime-500/50 focus:outline-none"
        >
          <option value="name">Sort: Name</option>
          <option value="yield">Sort: Yield ↓</option>
          <option value="price">Sort: Price ↓</option>
          <option value="cost">Sort: Cost ↑</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-neutral-400">
          <Icon name="progress_activity" className="w-5 h-5 animate-spin mr-2" /> Loading crops…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <Icon name="warning" className="w-5 h-5 text-red-400 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((crop) => {
            const meta = LAYER_META[crop.layer] ?? LAYER_META.canopy
            return (
              <motion.div
                key={crop.name}
                className={`glass rounded-xl p-4 border border-white/5 hover:border-lime-500/30 cursor-pointer transition ${
                  selectedCrop?.name === crop.name ? 'ring-2 ring-lime-500/40' : ''
                }`}
                onClick={() => setSelectedCrop(selectedCrop?.name === crop.name ? null : crop)}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                layout
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-lg mr-1.5">{meta.icon}</span>
                    <span className="text-white font-semibold capitalize">{crop.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${meta.bg} ${meta.color}`}>
                    {crop.layer}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-3">
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Icon name="eco" className="w-3 h-3" /> Yield
                  </div>
                  <div className="text-white text-right">{crop.typical_yield_t_ha} t/ha</div>

                  <div className="flex items-center gap-1 text-neutral-400">
                    <Icon name="currency_rupee" className="w-3 h-3" /> Price
                  </div>
                  <div className="text-white text-right">₹{crop.price_per_tonne_inr.toLocaleString()}/t</div>

                  <div className="flex items-center gap-1 text-neutral-400">
                    <Icon name="straighten" className="w-3 h-3" /> Spacing
                  </div>
                  <div className="text-white text-right">{crop.min_spacing_m}–{crop.max_spacing_m}m</div>

                  <div className="flex items-center gap-1 text-neutral-400">
                    <Icon name="light_mode" className="w-3 h-3" /> Shade tol.
                  </div>
                  <div className="text-white text-right">{(crop.shade_tolerance * 100).toFixed(0)}%</div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {selectedCrop?.name === crop.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-white/10"
                    >
                      <div className="text-xs space-y-2">
                        <div className="flex justify-between text-neutral-300">
                          <span>Establishment cost</span>
                          <span className="text-white">₹{crop.establishment_cost_inr_ha.toLocaleString()}/ha</span>
                        </div>
                        {crop.synergistic_with.length > 0 && (
                          <div>
                            <span className="text-neutral-400 block mb-1">Synergistic with:</span>
                            <div className="flex flex-wrap gap-1">
                              {crop.synergistic_with.map((s) => (
                                <span key={s} className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] capitalize">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12 text-neutral-400">
          No crops match your search/filter.
        </div>
      )}

      {/* Count */}
      {!loading && filtered.length > 0 && (
        <div className="text-xs text-neutral-500 text-center">
          Showing {filtered.length} of {crops.length} crops
        </div>
      )}
    </div>
  )
}
