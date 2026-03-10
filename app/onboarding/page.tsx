'use client'
/**
 * /onboarding — 3-step wizard for first-time users.
 *
 * Step 1: Farm basics (name, location, acres, soil type)
 * Step 2: Goals (maximize profit / yield / sustainability)
 * Step 3: Experience level
 *
 * On completion: POST /api/ai/plan, store result in AIFarmContext,
 * then redirect to /designer.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icon'
import { acresToCents, centsToAcres } from '@/lib/units'
import { useAIFarm, type SoilType, type GoalType, type ExperienceLevel } from '@/context/AIFarmContext'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormState {
  name: string
  location: string
  region: string
  acres: number
  soilType: SoilType
  budget_inr: number
  goal: GoalType
  experienceLevel: ExperienceLevel
}

const SOIL_OPTIONS: { value: SoilType; label: string; desc: string }[] = [
  { value: 'alluvial',  label: 'Alluvial',  desc: 'River plains — fertile, well-drained' },
  { value: 'black',     label: 'Black',     desc: 'Deccan plateau — moisture retentive' },
  { value: 'red',       label: 'Red',       desc: 'South India — warm, leached' },
  { value: 'laterite',  label: 'Laterite',  desc: 'Western Ghats — acidic, spice-suitable' },
  { value: 'desert',    label: 'Desert',    desc: 'Rajasthan / Gujarat — low moisture' },
  { value: 'mountain',  label: 'Mountain',  desc: 'Hill regions — cool, humus-rich' },
]

const REGION_OPTIONS = [
  'Kerala', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh',
  'Maharashtra', 'Telangana', 'Gujarat', 'Rajasthan', 'Other',
]

const GOAL_OPTIONS: { value: GoalType; label: string; icon: string; desc: string }[] = [
  { value: 'maximize_profit', label: 'Maximise Profit', icon: '💰', desc: 'Optimise for INR revenue per acre per year' },
  { value: 'maximize_yield',  label: 'Maximise Yield',  icon: '🌾', desc: 'Highest total biomass and crop output' },
  { value: 'sustainability',  label: 'Sustainability',  icon: '♻️', desc: 'Carbon sequestration, soil health, low-input' },
]

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: 'beginner',     label: 'Beginner',     desc: 'New to intercropping — I want step-by-step guidance' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Some experience — I understand basic strata concepts' },
  { value: 'expert',       label: 'Expert',       desc: 'Advanced farmer — show me full ML controls' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const STEPS = ['Farm Basics', 'Your Goal', 'Experience']

export default function OnboardingPage() {
  const router = useRouter()
  const { setFarm, setModel } = useAIFarm()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<FormState>({
    name: '',
    location: '',
    region: 'Kerala',
    acres: 2,
    soilType: 'laterite',
    budget_inr: 200000,
    goal: 'maximize_profit',
    experienceLevel: 'beginner',
  })

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleFinish() {
    setLoading(true)
    setError(null)
    try {
      // Save farm into context
      setFarm({
        name: form.name || 'My Farm',
        location: form.location,
        region: form.region,
        acres: form.acres,
        soilType: form.soilType,
        goal: form.goal,
        experienceLevel: form.experienceLevel,
        budget_inr: form.budget_inr,
      })

      // Call AI planner to get recommended model
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acres: form.acres,
          soil_type: form.soilType,
          budget_inr: form.budget_inr,
          goal: form.goal,
        }),
      })

      if (res.ok) {
        const plan = await res.json()
        setModel({
          id: plan.recommended_model_id ?? 'ai-plan',
          name: plan.recommended_model_name ?? 'AI Recommended Plan',
          crops: (plan.tiers ?? []).flatMap((t: { crops?: unknown[] }) => t.crops ?? []),
          estimatedLER: 1.4,
          estimatedRevenue: plan.expected_annual_revenue_range_inr?.join(' – ') ?? '',
          estimatedYield: plan.expected_annual_yield_note ?? '',
          soilType: form.soilType,
        })
      }
      // Mark onboarding complete
      localStorage.setItem('multisow_onboarded', '1')
      router.push('/designer')
    } catch (e) {
      setError('Could not connect to the AI planner. You can still proceed and configure manually.')
      setTimeout(() => {
        localStorage.setItem('multisow_onboarded', '1')
        router.push('/designer')
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = [
    form.acres > 0,
    !!form.goal,
    !!form.experienceLevel,
  ][step]

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070d07] px-4">
      <div className="w-full max-w-2xl">

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all
                ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-green-600 text-white ring-2 ring-green-400/50' : 'bg-white/10 text-white/40'}`}>
                {i < step ? <Icon name="check_circle" size={16}/> : i + 1}
              </div>
              <span className={`text-sm ${i === step ? 'text-white' : 'text-white/40'}`}>{label}</span>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-[2px] ${i < step ? 'bg-green-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center">
                    <Icon name="agriculture" className="text-green-400" size={22}/>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Tell us about your farm</h2>
                    <p className="text-white/50 text-sm">Basic details help us tailor your AI plan.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-white/60 mb-1">Farm Name <span className="text-white/30">(optional)</span></label>
                    <input value={form.name} onChange={e => update('name', e.target.value)}
                      placeholder="e.g. Krishnan's Homestead"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-green-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Region</label>
                    <select value={form.region} onChange={e => update('region', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500/50 appearance-none">
                      {REGION_OPTIONS.map(r => <option key={r} value={r} className="bg-[#0f1a0f]">{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Farm Area (acres)</label>
                    <input type="number" min={0.5} max={50} step={0.5} value={form.acres}
                      onChange={e => update('acres', Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-white/60 mb-2">Soil Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {SOIL_OPTIONS.map(opt => (
                        <button key={opt.value} onClick={() => update('soilType', opt.value)}
                          className={`rounded-xl p-3 text-left border transition-all ${form.soilType === opt.value ? 'border-green-500 bg-green-500/10 text-white' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25'}`}>
                          <div className="font-medium text-sm">{opt.label}</div>
                          <div className="text-xs opacity-60 mt-0.5">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Budget (INR)</label>
                    <input type="number" min={10000} step={10000} value={form.budget_inr}
                      onChange={e => update('budget_inr', Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-green-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Location <span className="text-white/30">(optional)</span></label>
                    <input value={form.location} onChange={e => update('location', e.target.value)}
                      placeholder="e.g. Wayanad, Kerala"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-green-500/50" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center">
                    <Icon name="target" className="text-green-400" size={22}/>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">What&apos;s your primary goal?</h2>
                    <p className="text-white/50 text-sm">We&apos;ll bias the AI towards models that serve your objective.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {GOAL_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => update('goal', opt.value)}
                      className={`w-full rounded-xl p-4 text-left border transition-all flex items-center gap-4
                        ${form.goal === opt.value ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-white/5 hover:border-white/25'}`}>
                      <span className="text-3xl">{opt.icon}</span>
                      <div>
                        <div className="font-semibold text-white">{opt.label}</div>
                        <div className="text-sm text-white/50">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center">
                    <Icon name="school" className="text-green-400" size={22}/>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your experience level</h2>
                    <p className="text-white/50 text-sm">This adjusts guidance depth and UI complexity.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {EXPERIENCE_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => update('experienceLevel', opt.value)}
                      className={`w-full rounded-xl p-4 text-left border transition-all
                        ${form.experienceLevel === opt.value ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-white/5 hover:border-white/25'}`}>
                      <div className="font-semibold text-white">{opt.label}</div>
                      <div className="text-sm text-white/50">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="mt-4 text-sm text-amber-400 bg-amber-500/10 rounded-xl px-4 py-3">{error}</p>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white/50 hover:text-white disabled:opacity-30 transition-colors"
            >
              <Icon name="arrow_back" size={16}/> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium disabled:opacity-40 transition-colors"
              >
                Next <Icon name="arrow_forward" size={16}/>
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={loading || !canProceed}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium disabled:opacity-40 transition-colors"
              >
                {loading ? <Icon name="progress_activity" size={16} className="animate-spin"/> : <Icon name="agriculture" size={16}/>}
                {loading ? 'Building your plan…' : 'Generate AI Plan'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
