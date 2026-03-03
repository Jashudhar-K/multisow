'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ResearchBadge } from '@/types/landing'

const badges: ResearchBadge[] = [
  { emoji: '📊', label: 'ICRISAT Datasets' },
  { emoji: '🛰️', label: 'NASA POWER API' },
  { emoji: '🌍', label: 'Sentinel-2 Imagery' },
  { emoji: '📚', label: 'ICAR Research' },
]

export default function TrustSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.15, once: true })

  return (
    <section
      id="research"
      className="relative py-20 md:py-24 overflow-hidden"
      style={{ backgroundColor: '#0A0F0A' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={ref}>
        <motion.p
          className="text-neutral-400 text-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Built on peer-reviewed agricultural science.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {badges.map((badge) => (
            <span
              key={badge.label}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm text-neutral-300 bg-white/5 backdrop-blur-md border border-white/10"
            >
              <span>{badge.emoji}</span>
              {badge.label}
            </span>
          ))}
        </motion.div>

        <motion.p
          className="text-neutral-500 text-sm"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Validated on 480+ plot-years of Indian intercropping data.
        </motion.p>
      </div>
    </section>
  )
}
