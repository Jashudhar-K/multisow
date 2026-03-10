'use client'

import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icon';// ============================================================================
// TYPES
// ============================================================================
interface FormValues {
  n: string
  p: string
  k: string
  temperature: string
  humidity: string
  ph: string
  rainfall: string
}

interface RecommendResult {
  recommended_crop: string
  confidence: number | null
  input_features: Record<string, number>
}

// ============================================================================
// FIELD METADATA
// ============================================================================
const FIELDS: {
  key: keyof FormValues
  label: string
  placeholder: string
  unit: string
  min: number
  max: number
  step: number
}[] = [
  { key: 'n',           label: 'Nitrogen (N)',     placeholder: '90',    unit: 'kg/ha', min: 0,   max: 999, step: 1    },
  { key: 'p',           label: 'Phosphorous (P)',  placeholder: '42',    unit: 'kg/ha', min: 0,   max: 999, step: 1    },
  { key: 'k',           label: 'Potassium (K)',    placeholder: '43',    unit: 'kg/ha', min: 0,   max: 999, step: 1    },
  { key: 'temperature', label: 'Temperature',      placeholder: '25',    unit: '°C',    min: -10, max: 60,  step: 0.1  },
  { key: 'humidity',    label: 'Humidity',         placeholder: '80',    unit: '%',     min: 0,   max: 100, step: 0.1  },
  { key: 'ph',          label: 'Soil pH',          placeholder: '6.5',   unit: 'pH',    min: 0,   max: 14,  step: 0.01 },
  { key: 'rainfall',    label: 'Rainfall',         placeholder: '200',   unit: 'mm',    min: 0,   max: 9999,step: 1    },
]

const INITIAL_FORM: FormValues = {
  n: '', p: '', k: '', temperature: '', humidity: '', ph: '', rainfall: '',
}

// ============================================================================
// COMPONENT
// ============================================================================
export default function CropRecommender() {
  const [form, setForm] = useState<FormValues>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RecommendResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleChange(key: keyof FormValues, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    const payload = {
      n:           parseFloat(form.n),
      p:           parseFloat(form.p),
      k:           parseFloat(form.k),
      temperature: parseFloat(form.temperature),
      humidity:    parseFloat(form.humidity),
      ph:          parseFloat(form.ph),
      rainfall:    parseFloat(form.rainfall),
    }

    try {
      const res = await fetch('/api/crop-recommender/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.detail ?? data?.error ?? `Server error (${res.status})`)
      } else {
        setResult(data as RecommendResult)
      }
    } catch {
      setError('Could not reach the server. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const confidencePct =
    result?.confidence != null ? (result.confidence * 100).toFixed(1) : null

  return (
    <div className="w-full space-y-6">
      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FIELDS.map(field => (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                {field.label}
                <span className="ml-1 text-zinc-500 normal-case">({field.unit})</span>
              </label>
              <input
                type="number"
                required
                step={field.step}
                min={field.min}
                max={field.max}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e => handleChange(field.key, e.target.value)}
                className="
                  w-full rounded-lg bg-white/10 border border-white/10
                  px-3 py-2 text-sm text-white placeholder-zinc-500
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                  transition-all duration-150
                "
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            flex items-center gap-2 px-6 py-2.5 rounded-xl
            bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50
            text-white text-sm font-semibold
            transition-colors duration-150
          "
        >
          {loading ? (
            <Icon name="progress_activity" className="w-4 h-4 animate-spin" />
          ) : (
            <Icon name="agriculture" className="w-4 h-4" />
          )}
          {loading ? 'Analysing…' : 'Recommend Crop'}
        </button>
      </form>

      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4"
          >
            <Icon name="warning" className="mt-0.5 w-5 h-5 shrink-0 text-red-400" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result panel */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5"
          >
            {/* Crop name */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/20">
                <Icon name="eco" className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-400 mb-0.5">
                  Recommended Crop
                </p>
                <p className="text-3xl font-bold capitalize text-white">
                  {result.recommended_crop}
                </p>
              </div>
            </div>

            {/* Confidence badge */}
            {confidencePct !== null && (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-4 py-1.5">
                <Icon name="science" className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">
                  {confidencePct}% confidence
                </span>
              </div>
            )}

            {/* Input summary table */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">
                Input Summary
              </p>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      {FIELDS.map(f => (
                        <th
                          key={f.key}
                          className="whitespace-nowrap px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-400"
                        >
                          {f.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {FIELDS.map(f => (
                        <td
                          key={f.key}
                          className="whitespace-nowrap px-3 py-2 text-zinc-200"
                        >
                          {result.input_features[f.key] ?? '—'}
                          <span className="ml-1 text-xs text-zinc-500">{f.unit}</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
