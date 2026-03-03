'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ShapFeature } from '@/types/landing'

const shapFeatures: ShapFeature[] = [
  { name: 'Leaf Area Index (LAI)', value: 0.48, isPositive: true },
  { name: '30-day Solar Radiation', value: 0.31, isPositive: true },
  { name: 'Row Spacing (3.5m)', value: 0.22, isPositive: true },
  { name: 'Soil Nitrogen', value: 0.18, isPositive: true },
  { name: 'Root Overlap Index', value: 0.14, isPositive: false },
  { name: 'VWC (Soil Moisture)', value: 0.09, isPositive: false },
]

const maxAbsValue = 0.48

const explanations = [
  {
    emoji: '🌿',
    text: 'Your canopy LAI of 4.8 is optimal, capturing maximum solar radiation without over-shading lower tiers.',
  },
  {
    emoji: '☀️',
    text: '30-day average solar radiation is 15% above baseline — ideal conditions for coconut fruit development.',
  },
  {
    emoji: '📏',
    text: 'Row spacing of 3.5m allows sufficient light penetration to your middle tier banana plants.',
  },
  {
    emoji: '⚠️',
    text: 'Root overlap with understory (ROI: 0.32) is creating mild nitrogen competition. Consider deep-band N placement.',
  },
]

const languages = [
  { label: 'English', code: 'en' },
  { label: 'தமிழ்', code: 'ta' },
  { label: 'മലയാളം', code: 'ml' },
  { label: 'తెలుగు', code: 'te' },
]

export default function ExplainSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.15, once: true })
  const [activeLang, setActiveLang] = useState('en')

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#0F1A0F' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI You Can Actually Understand
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Every recommendation comes with a plain-English explanation powered
            by SHAP and LIME.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: SHAP Waterfall Chart */}
          <motion.div
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-sm font-mono text-neutral-400 mb-6">
              Canopy Yield — Top Feature Contributions
            </h3>

            <div className="space-y-4">
              {shapFeatures.map((feature, index) => {
                const barWidth = (Math.abs(feature.value) / maxAbsValue) * 100
                return (
                  <div key={feature.name} className="flex items-center gap-3">
                    <span className="text-xs text-neutral-400 w-44 shrink-0 text-right">
                      {feature.name}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-6 bg-white/5 rounded relative overflow-hidden">
                        <motion.div
                          className={`h-full rounded ${
                            feature.isPositive
                              ? 'bg-green-500/80'
                              : 'bg-red-500/80'
                          }`}
                          initial={{ width: 0 }}
                          animate={
                            isInView ? { width: `${barWidth}%` } : { width: 0 }
                          }
                          transition={{
                            duration: 0.8,
                            delay: 0.4 + index * 0.1,
                            ease: 'easeOut',
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-mono w-12 shrink-0 ${
                          feature.isPositive ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {feature.isPositive ? '+' : '−'}
                        {feature.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Right: Explanation Card */}
          <motion.div
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">
              Why is yield predicted at 2.8 t/ha?
            </h3>

            <div className="space-y-4 flex-1">
              {explanations.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.15 }}
                >
                  <span className="text-lg shrink-0">{item.emoji}</span>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Language Toggle */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="text-xs text-neutral-500 mb-2">
                Explanation Language
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setActiveLang(lang.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeLang === lang.code
                        ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                        : 'bg-white/5 text-neutral-400 border border-white/10 hover:border-white/20'
                    }`}
                    aria-label={`Switch explanation to ${lang.label}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
