'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Icon } from '@/components/ui/Icon'
import {
  GlassCard,
  GlassCardContent,
} from '@/components/cards'
import type { FohemCard } from '@/types/landing'

const cards: FohemCard[] = [
  {
    icon: 'brain',
    color: 'primary' as const,
    title: 'Fuzzy Inference',
    body: '28 agricultural IF-THEN rules encode expert knowledge. Handles uncertainty in sparse field data with confidence.',
    statBadge: '48 Rules Encoded',
    weight: 28,
  },
  {
    icon: 'network',
    color: 'success' as const,
    title: 'Random Forest',
    body: '500 decision trees learn non-linear interactions between soil, climate, and management variables.',
    statBadge: '500 Trees',
    weight: 31,
  },
  {
    icon: 'zap',
    color: 'accent' as const,
    title: 'CatBoost Ensemble',
    body: 'Natively handles categorical farm data — soil types, crop varieties, and Indian regional profiles.',
    statBadge: '1000 Iterations',
    weight: 26,
  },
  {
    icon: 'dna',
    color: 'warning' as const,
    title: 'Genetic Optimizer',
    body: 'Evolves optimal blending weights across all models every season. Adapts to your farm\'s unique microclimate.',
    statBadge: '50 Generations',
    weight: 15,
  },
]

const materialIconMap: Record<string, string> = {
  brain: 'psychology',
  network: 'account_tree',
  zap: 'bolt',
  dna: 'genetics',
}

const colorStyles = {
  primary: { icon: 'text-primary-400 bg-primary-500/15', badge: 'text-primary-400 bg-primary-500/10 border-primary-500/20' },
  success: { icon: 'text-success bg-success/15', badge: 'text-success bg-success/10 border-success/20' },
  accent: { icon: 'text-accent-400 bg-accent-500/15', badge: 'text-accent-400 bg-accent-500/10 border-accent-500/20' },
  warning: { icon: 'text-warning bg-warning/15', badge: 'text-warning bg-warning/10 border-warning/20' },
}

const ensembleSegments = [
  { label: 'FIS', weight: 28, color: 'bg-green-500' },
  { label: 'RF', weight: 31, color: 'bg-emerald-500' },
  { label: 'CatBoost', weight: 26, color: 'bg-teal-500' },
  { label: 'ELM', weight: 15, color: 'bg-sky-500' },
]

export default function FohemSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.15, once: true })

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
            Powered by FOHEM
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Fuzzy-Optimized Hybrid Ensemble Model — four AI engines working in
            concert.
          </p>
        </motion.div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {cards.map((card, index) => {
            const iconName = materialIconMap[card.icon] ?? 'help'
            const colors = colorStyles[card.color as keyof typeof colorStyles]
            return (
              <GlassCard
                key={card.title}
                variant="default"
                glow
                glowColor={card.color as 'primary' | 'success' | 'accent' | 'warning'}
                padding="lg"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{
                  y: -8,
                  boxShadow: '0 20px 40px rgba(34,197,94,0.1)',
                }}
                className="cursor-default"
              >
                <GlassCardContent className="flex flex-col gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.icon}`}
                  >
                    <Icon name={iconName} size={24} />
                  </div>
                  <h3 className="text-text-primary font-bold text-xl">{card.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed flex-1">
                    {card.body}
                  </p>
                  <span className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-medium border ${colors.badge}`}>
                    {card.statBadge}
                  </span>
                </GlassCardContent>
              </GlassCard>
            )
          })}
        </div>

        {/* Ensemble Output Bar */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-sm text-neutral-400 text-center mb-3">
            Current Season Weight Distribution
          </p>
          <div className="h-10 rounded-full overflow-hidden flex bg-white/5 border border-white/10">
            {ensembleSegments.map((segment, index) => (
              <motion.div
                key={segment.label}
                className={`${segment.color} flex items-center justify-center relative group`}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${segment.weight}%` } : { width: 0 }}
                transition={{
                  duration: 1,
                  delay: 1 + index * 0.15,
                  ease: 'easeOut',
                }}
              >
                <span className="text-xs font-bold text-black whitespace-nowrap">
                  {segment.label}: {segment.weight}%
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
