'use client'

import { useState, useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'

// ── Types ──────────────────────────────────────────────────────────────────

type CropStat = {
  N: number; P: number; K: number
  temperature: number; humidity: number; ph: number; rainfall: number
}

type CompatResult = {
  crop: string
  compatibility_score: number
  stats: CropStat
}

type RecommendResult = {
  recommended_crop: string
  confidence: number
  compatible_crops_from_library: CompatResult[]
  input_features: Record<string, number>
}

type LayerRecommendResult = {
  layer: string
  recommended_crops: { crop: string; score: number }[]
  input_features: Record<string, number>
}

type AISuggestedCrop = { name: string; reason: string }

type AIExtendResult = {
  ai_suggested_crops: AISuggestedCrop[]
  source: 'anthropic' | 'fallback'
  based_on_crops: string[]
}

// Normalise FastAPI error details (Pydantic v2 returns an array of objects)
function toErrorString(detail: unknown, fallback = 'An error occurred'): string {
  if (!detail) return fallback
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail))
    return detail
      .map((e) => (typeof e === 'object' && e !== null && 'msg' in e ? String((e as {msg: unknown}).msg) : JSON.stringify(e)))
      .join('; ')
  return fallback
}

const LAYERS = ['canopy', 'midstory', 'understory', 'groundcover'] as const
type Layer = (typeof LAYERS)[number]

const LAYER_COLORS: Record<string, string> = {
  canopy: 'bg-emerald-700',
  midstory: 'bg-teal-700',
  understory: 'bg-cyan-800',
  groundcover: 'bg-blue-800',
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatBadge({ label, val }: { label: string; val: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-zinc-800 px-2 py-0.5 rounded">
      <span className="text-zinc-400">{label}</span>
      <span className="text-white font-medium">{val.toFixed(1)}</span>
    </span>
  )
}

function CropCard({
  name,
  stats,
  selected,
  onClick,
}: {
  name: string
  stats: CropStat | undefined
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left w-full rounded-xl p-4 border transition-all ${
        selected
          ? 'border-emerald-500 bg-emerald-950/40'
          : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
      }`}
    >
      <p className="text-white font-semibold capitalize mb-2">{name}</p>
      {stats ? (
        <div className="flex flex-wrap gap-1">
          <StatBadge label="N" val={stats.N} />
          <StatBadge label="P" val={stats.P} />
          <StatBadge label="K" val={stats.K} />
          <StatBadge label="temp" val={stats.temperature} />
          <StatBadge label="hum" val={stats.humidity} />
          <StatBadge label="pH" val={stats.ph} />
          <StatBadge label="rain" val={stats.rainfall} />
        </div>
      ) : (
        <p className="text-zinc-500 text-xs">Loading stats…</p>
      )}
    </button>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function CropsPage() {
  // Library state
  const [crops, setCrops] = useState<string[]>([])
  const [allStats, setAllStats] = useState<Record<string, CropStat>>({})
  const [search, setSearch] = useState('')
  const [filterLayer, setFilterLayer] = useState<Layer | ''>('')
  const [layerCropSet, setLayerCropSet] = useState<Set<string>>(new Set())
  const [loadingLibrary, setLoadingLibrary] = useState(true)
  const [libraryError, setLibraryError] = useState('')

  // Compatible crops state
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null)
  const [compatibleCrops, setCompatibleCrops] = useState<CompatResult[]>([])
  const [loadingCompat, setLoadingCompat] = useState(false)

  // Recommender state
  const [inputs, setInputs] = useState({
    N: 50, P: 40, K: 50, temperature: 23, humidity: 80, ph: 6.5, rainfall: 180,
  })
  const [useLayerMode, setUseLayerMode] = useState(false)
  const [recLayer, setRecLayer] = useState<Layer>('canopy')
  const [recommending, setRecommending] = useState(false)
  const [recResult, setRecResult] = useState<RecommendResult | LayerRecommendResult | null>(null)
  const [recError, setRecError] = useState('')

  // AI extend state
  const [extending, setExtending] = useState(false)
  const [aiResult, setAiResult] = useState<AIExtendResult | null>(null)
  const [aiError, setAiError] = useState('')

  // Load crops + stats on mount
  useEffect(() => {
    const load = async () => {
      setLoadingLibrary(true)
      setLibraryError('')
      try {
        const [allRes, statsRes] = await Promise.all([
          fetch('/api/crops-v2/all'),
          fetch('/api/crops-v2/stats'),
        ])
        const { crops: cropList } = await allRes.json()
        const statsData = await statsRes.json()
        setCrops(Array.isArray(cropList) ? cropList : [])
        setAllStats(statsData ?? {})
      } catch {
        setLibraryError('Failed to load crop library. Is the backend running?')
      } finally {
        setLoadingLibrary(false)
      }
    }
    load()
  }, [])

  // Load layer filter
  useEffect(() => {
    if (!filterLayer) {
      setLayerCropSet(new Set())
      return
    }
    fetch(`/api/crops-v2/layer/${filterLayer}`)
      .then(r => r.json())
      .then(d => setLayerCropSet(new Set<string>(d.crops ?? [])))
      .catch(() => setLayerCropSet(new Set()))
  }, [filterLayer])

  // Select crop → load compatible partners
  const handleSelectCrop = async (name: string) => {
    if (selectedCrop === name) {
      setSelectedCrop(null)
      setCompatibleCrops([])
      return
    }
    setSelectedCrop(name)
    setCompatibleCrops([])
    setLoadingCompat(true)
    try {
      const res = await fetch(`/api/crops-v2/${encodeURIComponent(name)}/compatible`)
      const data = await res.json()
      setCompatibleCrops(data.compatible ?? [])
    } catch {
      setCompatibleCrops([])
    } finally {
      setLoadingCompat(false)
    }
  }

  // Recommend
  const handleRecommend = async () => {
    setRecommending(true)
    setRecResult(null)
    setRecError('')
    setAiResult(null)
    try {
      const endpoint = useLayerMode
        ? '/api/crops-v2/recommend-for-layer'
        : '/api/crops-v2/recommend'
      const body = useLayerMode ? { ...inputs, layer: recLayer } : inputs
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json()
        setRecError(toErrorString(err.detail, 'Recommendation failed'))
        return
      }
      setRecResult(await res.json())
    } catch {
      setRecError('Could not reach the backend.')
    } finally {
      setRecommending(false)
    }
  }

  // AI extend — builds crop list from current results
  const handleAIExtend = async () => {
    let cropList: string[] = []
    if (recResult) {
      if ('recommended_crop' in recResult) {
        cropList = [
          recResult.recommended_crop,
          ...(recResult.compatible_crops_from_library ?? []).map(c => c.crop),
        ]
      } else {
        cropList = (recResult.recommended_crops ?? []).map(r => r.crop)
      }
    } else if (selectedCrop) {
      cropList = [selectedCrop, ...compatibleCrops.map(c => c.crop)]
    }
    if (!cropList.length) return
    setExtending(true)
    setAiResult(null)
    setAiError('')
    try {
      const res = await fetch('/api/crops-v2/ai-extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop_list: cropList }),
      })
      setAiResult(await res.json())
    } catch {
      setAiError('AI extension unavailable.')
    } finally {
      setExtending(false)
    }
  }

  // Filtered crop list
  const displayedCrops = crops.filter(c => {
    const matchSearch = !search || c.toLowerCase().includes(search.toLowerCase())
    const matchLayer = !filterLayer || layerCropSet.has(c)
    return matchSearch && matchLayer
  })

  // Input field helper
  const inputField = (
    key: keyof typeof inputs,
    label: string,
    min: number,
    max: number,
    step: number,
  ) => (
    <div key={key} className="space-y-1">
      <label className="text-xs text-zinc-400">{label}</label>
      <input
        type="number"
        value={inputs[key]}
        step={step}
        min={min}
        max={max}
        onChange={e =>
          setInputs(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))
        }
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
      />
    </div>
  )

  return (
    <PageLayout title="Crop Library">
      <div className="space-y-12">

        {/* ── Library section ── */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">All Crops</h2>
            <p className="text-sm text-zinc-400">
              {crops.length} crops from the dataset. Click any crop to view its top compatible intercropping partners.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search crops…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm w-48 focus:outline-none focus:border-emerald-500"
            />
            <select
              value={filterLayer}
              onChange={e => setFilterLayer(e.target.value as Layer | '')}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="">All layers</option>
              {LAYERS.map(l => (
                <option key={l} value={l} className="capitalize">{l}</option>
              ))}
            </select>
            {filterLayer && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs text-white ${LAYER_COLORS[filterLayer]}`}>
                {filterLayer} — {layerCropSet.size} crops
              </span>
            )}
          </div>

          {libraryError && (
            <div className="rounded-xl p-4 bg-red-950/40 border border-red-700 text-red-300 text-sm">
              {libraryError}
            </div>
          )}
          {loadingLibrary && !libraryError && (
            <div className="text-zinc-400 text-sm animate-pulse">Loading crop library…</div>
          )}

          {!loadingLibrary && !libraryError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {displayedCrops.length === 0 && (
                <p className="text-zinc-500 text-sm col-span-full">No crops match the current filters.</p>
              )}
              {displayedCrops.map(name => (
                <CropCard
                  key={name}
                  name={name}
                  stats={allStats[name]}
                  selected={selectedCrop === name}
                  onClick={() => handleSelectCrop(name)}
                />
              ))}
            </div>
          )}

          {/* Compatible crops panel */}
          {selectedCrop && (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 space-y-3">
              <h3 className="text-white font-semibold">
                Top Compatible Crops for{' '}
                <span className="text-emerald-400 capitalize">{selectedCrop}</span>
              </h3>
              {loadingCompat && (
                <p className="text-zinc-400 text-sm animate-pulse">Loading compatible crops…</p>
              )}
              {!loadingCompat && compatibleCrops.length === 0 && (
                <p className="text-zinc-500 text-sm">No compatible crops found.</p>
              )}
              {!loadingCompat && compatibleCrops.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {compatibleCrops.map(c => (
                    <div key={c.crop} className="rounded-lg bg-zinc-800 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white capitalize font-medium">{c.crop}</span>
                        <span className="text-xs text-emerald-400">score {c.compatibility_score.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <StatBadge label="N" val={c.stats.N} />
                        <StatBadge label="temp" val={c.stats.temperature} />
                        <StatBadge label="hum" val={c.stats.humidity} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loadingCompat && compatibleCrops.length > 0 && (
                <button
                  onClick={handleAIExtend}
                  disabled={extending}
                  className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  {extending ? 'Consulting AI…' : '✦ Extend with AI (Beyond Dataset)'}
                </button>
              )}
            </div>
          )}
        </section>

        {/* ── Recommender section ── */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">ML Crop Recommender</h2>
            <p className="text-sm text-zinc-400">
              Enter soil nutrients and climate conditions to get a dataset-trained recommendation.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {inputField('N', 'Nitrogen (N)', 0, 200, 1)}
              {inputField('P', 'Phosphorus (P)', 0, 150, 1)}
              {inputField('K', 'Potassium (K)', 0, 250, 1)}
              {inputField('temperature', 'Temperature (°C)', 0, 50, 0.1)}
              {inputField('humidity', 'Humidity (%)', 0, 100, 0.1)}
              {inputField('ph', 'pH', 0, 14, 0.1)}
              {inputField('rainfall', 'Rainfall (mm)', 0, 500, 1)}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useLayerMode}
                  onChange={e => setUseLayerMode(e.target.checked)}
                  className="accent-emerald-500"
                />
                Filter by intercropping layer
              </label>
              {useLayerMode && (
                <select
                  value={recLayer}
                  onChange={e => setRecLayer(e.target.value as Layer)}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {LAYERS.map(l => (
                    <option key={l} value={l} className="capitalize">{l}</option>
                  ))}
                </select>
              )}
              <button
                onClick={handleRecommend}
                disabled={recommending}
                className="ml-auto bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
              >
                {recommending ? 'Analysing…' : 'Recommend'}
              </button>
            </div>

            {recError && (
              <div className="rounded-lg p-3 bg-red-950/40 border border-red-700 text-red-300 text-sm">
                {recError}
              </div>
            )}

            {recResult && (
              <div className="space-y-4">
                {'recommended_crop' in recResult ? (
                  <div className="flex flex-wrap items-center gap-6 rounded-lg bg-emerald-950/40 border border-emerald-700 p-4">
                    <div>
                      <p className="text-xs text-zinc-400 mb-0.5">Recommended crop</p>
                      <p className="text-2xl font-bold text-emerald-400 capitalize">{recResult.recommended_crop}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 mb-0.5">Confidence</p>
                      <p className="text-xl font-semibold text-white">{(recResult.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-teal-950/40 border border-teal-700 p-4 space-y-2">
                    <p className="text-xs text-zinc-400">Top crops for <span className="text-teal-300 capitalize">{recResult.layer}</span> layer</p>
                    <div className="flex flex-wrap gap-2">
                      {(recResult.recommended_crops ?? []).map(r => (
                        <span key={r.crop} className="bg-zinc-800 px-3 py-1 rounded text-white capitalize text-sm">
                          {r.crop} <span className="text-teal-400">({r.score.toFixed(2)})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {'compatible_crops_from_library' in recResult && (recResult.compatible_crops_from_library ?? []).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-300 font-medium">Compatible intercropping partners:</p>
                    <div className="flex flex-wrap gap-2">
                      {(recResult.compatible_crops_from_library ?? []).map(c => (
                        <span key={c.crop} className="bg-zinc-800 border border-zinc-700 px-3 py-1 rounded text-white capitalize text-sm">
                          {c.crop}{' '}
                          <span className="text-zinc-400 text-xs">({c.compatibility_score.toFixed(2)})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAIExtend}
                  disabled={extending}
                  className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  {extending ? 'Consulting AI…' : '✦ Extend with AI (Beyond Dataset)'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── AI Suggestions section ── */}
        {(aiResult || aiError || extending) && (
          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">
                ✦ AI Suggestions{' '}
                <span className="text-sm font-normal text-zinc-400">(Beyond Dataset)</span>
              </h2>
              <p className="text-sm text-zinc-400">
                Crops suggested by Claude that may pair well with your selection, outside the training data.
              </p>
            </div>

            {aiError && (
              <div className="rounded-xl p-4 bg-red-950/40 border border-red-700 text-red-300 text-sm">
                {aiError}
              </div>
            )}

            {extending && (
              <div className="text-zinc-400 text-sm animate-pulse">Asking Claude for additional crop ideas…</div>
            )}

            {aiResult && !extending && (
              <div className="rounded-xl border border-violet-700 bg-violet-950/20 p-5 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span>Source: <span className="text-violet-300">{aiResult.source}</span></span>
                  <span>·</span>
                  <span>Based on: <span className="text-zinc-300">{(aiResult.based_on_crops ?? []).join(', ')}</span></span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(aiResult.ai_suggested_crops ?? []).map(s => (
                    <div
                      key={s.name}
                      className="rounded-lg bg-zinc-900 border border-zinc-700 p-3 space-y-1"
                    >
                      <p className="text-violet-300 font-semibold capitalize">{s.name}</p>
                      <p className="text-zinc-400 text-xs">{s.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </PageLayout>
  )
}

