'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import type { RegionalPreset } from '@/types/landing'

const presets: RegionalPreset[] = [
  {
    emoji: '🌴',
    name: 'Wayanad Classic',
    state: 'Kerala',
    crops: 'Coconut + Pepper + Ginger',
    ler: '1.8',
    revenue: '₹1.2L/month',
  },
  {
    emoji: '🌶️',
    name: 'Karnataka Spice Garden',
    state: 'Malnad',
    crops: 'Coffee + Cardamom + Vanilla',
    ler: '2.1',
    revenue: '₹1.5L/month',
  },
  {
    emoji: '🥥',
    name: 'Tamil Nadu Tropical',
    state: 'Coimbatore',
    crops: 'Coconut + Banana + Turmeric',
    ler: '1.9',
    revenue: '₹1.3L/month',
  },
  {
    emoji: '🌾',
    name: 'Andhra Commercial',
    state: 'Godavari',
    crops: 'Mango + Banana + Groundnut',
    ler: '1.7',
    revenue: '₹1.1L/month',
  },
  {
    emoji: '🥭',
    name: 'Maharashtra Konkan',
    state: 'Konkan',
    crops: 'Coconut + Mango + Cashew',
    ler: '1.6',
    revenue: '₹1.0L/month',
  },
  {
    emoji: '🍫',
    name: 'Cocoa Premium',
    state: 'Research Model',
    crops: 'Coconut + Cocoa + Spices',
    ler: '2.3',
    revenue: '₹1.8L/month',
  },
]

export default function PresetsSection() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.15, once: true })

  return (
    <section
      id="presets"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#0A0F0A' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pre-Built for Indian Agriculture
          </h2>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <motion.div
          className="overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex gap-6" style={{ width: 'max-content' }}>
            {presets.map((preset, index) => (
              <motion.div
                key={preset.name}
                className="w-80 shrink-0 snap-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-3 cursor-default"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 0 30px rgba(34,197,94,0.15)',
                  borderColor: 'rgba(34,197,94,0.4)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{preset.emoji}</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {preset.name}
                    </h3>
                    <span className="text-green-400 text-sm">{preset.state}</span>
                  </div>
                </div>

                <p className="text-neutral-400 text-sm">{preset.crops}</p>

                <div className="flex gap-2 mt-auto">
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20">
                    LER: {preset.ler}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
                    {preset.revenue}
                  </span>
                </div>

                <button
                  className="mt-2 text-sm text-neutral-400 hover:text-green-400 transition-colors border border-white/10 hover:border-green-500/30 rounded-full px-4 py-2"
                  aria-label={`Use ${preset.name} model`}
                  onClick={() => {
                    // Pass the preset name as a query param to /strata
                    const params = new URLSearchParams({ model: preset.name });
                    router.push(`/strata?${params.toString()}`);
                  }}
                >
                  Use This Model →
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
