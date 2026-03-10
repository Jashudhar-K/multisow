'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { StrataLayer } from '@/types/landing'

const layers: StrataLayer[] = [
  {
    id: 'canopy',
    name: 'CANOPY',
    label: 'CANOPY LAYER • 15–25m',
    heightRange: '15–25m',
    title: 'Overstory Capture',
    description:
      'Coconut, Teak, Silver Oak intercept 52% of sunlight via Beer-Lambert law modelling.',
    icon: 'treePine',
    gradientFrom: 'from-green-900',
    gradientTo: 'to-green-700',
    statLabel: 'PAR Absorption',
    statValue: 52,
    statUnit: '%',
    chipText: 'k = 0.52 • LAI = 4.8',
    animDirection: 'left',
  },
  {
    id: 'middle',
    name: 'MIDDLE TIER',
    label: 'MIDDLE TIER • 5–10m',
    heightRange: '5–10m',
    title: 'Shade-Adapted Growth',
    description:
      'Banana, Cocoa, and Coffee thrive at 40–60% transmitted light. FOHEM optimises spacing to hit the target.',
    icon: 'leaf',
    gradientFrom: 'from-emerald-900',
    gradientTo: 'to-emerald-700',
    statLabel: 'Light Transmission',
    statValue: 38,
    statUnit: '%',
    chipText: 'Transmitted PAR: 38%',
    animDirection: 'right',
  },
  {
    id: 'understory',
    name: 'UNDERSTORY',
    label: 'UNDERSTORY • 0.5–2m',
    heightRange: '0.5–2m',
    title: 'Diffuse Light Specialists',
    description:
      'Ginger, Turmeric and Yams absorb diffuse sky radiation. Root geometry is optimised to avoid competition.',
    icon: 'sprout',
    gradientFrom: 'from-teal-900',
    gradientTo: 'to-teal-700',
    statLabel: 'Diffuse Light',
    statValue: 18,
    statUnit: '%',
    chipText: 'Diffuse fraction: 0.42',
    animDirection: 'left',
  },
  {
    id: 'root',
    name: 'ROOT ZONE',
    label: 'ROOT ZONE • 0–120cm',
    heightRange: '0–120cm',
    title: 'Underground Resource Map',
    description:
      'Root Architecture Modelling calculates species overlap (ROI). Nutrient placement is automated to eliminate competition.',
    icon: 'flower',
    gradientFrom: 'from-amber-950',
    gradientTo: 'to-amber-800',
    statLabel: 'ROI',
    statValue: 0.28,
    statUnit: '',
    chipText: 'N: 142mg/kg',
    animDirection: 'right',
  },
]

const materialIconMap: Record<string, string> = {
  treePine: 'park',
  leaf: 'eco',
  sprout: 'energy_savings_leaf',
  flower: 'grass',
}

function AnimatedBar({
  value,
  maxValue,
  label,
  unit,
  isInView,
  delay,
  isRoot,
}: {
  value: number
  maxValue: number
  label: string
  unit: string
  isInView: boolean
  delay: number
  isRoot?: boolean
}) {
  const percentage = isRoot ? (value / 1) * 100 : (value / maxValue) * 100
  const displayValue = isRoot ? `ROI: ${value} — Low` : `${value}${unit}`

  return (
    <div className="flex-1">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-neutral-400">{label}</span>
        <span className="text-green-400 font-mono">{displayValue}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function FlowArrow({ isInView, delay }: { isInView: boolean; delay: number }) {
  return (
    <div className="flex justify-center py-2">
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        <svg width="2" height="24" className="overflow-visible">
          <motion.line
            x1="1"
            y1="0"
            x2="1"
            y2="24"
            stroke="rgba(34,197,94,0.4)"
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
          />
        </svg>
        <motion.span
          className="text-green-500/60 text-xs"
          initial={{ opacity: 0, y: -4 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: 0.4, delay: delay + 0.5 }}
        >
          ▼
        </motion.span>
      </motion.div>
    </div>
  )
}

export default function StrataSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.15, once: true })

  return (
    <section
      id="features"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#0A0F0A' }}
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
            Four Layers. One Optimised Ecosystem.
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Every vertical tier is managed by a dedicated AI model that learns
            the physics of light, soil, and roots.
          </p>
        </motion.div>

        {/* Strata Diagram */}
        <div className="max-w-2xl mx-auto">
          {layers.map((layer, index) => {
            const iconName = materialIconMap[layer.icon as keyof typeof materialIconMap]
            return (
              <div key={layer.id}>
                <motion.div
                  className={`relative bg-gradient-to-r ${layer.gradientFrom} ${layer.gradientTo} rounded-2xl p-6 border border-white/5`}
                  initial={{
                    opacity: 0,
                    x: layer.animDirection === 'left' ? -60 : 60,
                  }}
                  animate={
                    isInView
                      ? { opacity: 1, x: 0 }
                      : {}
                  }
                  transition={{
                    duration: 0.6,
                    delay: index * 0.3,
                    ease: 'easeOut',
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Icon + Labels */}
                    <div className="flex items-center gap-3 sm:w-48 shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <Icon name={iconName ?? 'help'} size={20} className="text-green-400" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-green-400/80 font-medium">
                          {layer.label}
                        </span>
                        <h3 className="text-white font-bold text-lg leading-tight">
                          {layer.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <p className="text-sm text-neutral-300 leading-relaxed">
                        {layer.description}
                      </p>
                      <AnimatedBar
                        value={layer.statValue}
                        maxValue={100}
                        label={layer.statLabel}
                        unit={layer.statUnit}
                        isInView={isInView}
                        delay={index * 0.3 + 0.5}
                        isRoot={layer.id === 'root'}
                      />
                    </div>

                    {/* Chip */}
                    <div className="shrink-0 self-start">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20">
                        {layer.chipText}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Flow Arrow between layers */}
                {index < layers.length - 1 && (
                  <FlowArrow isInView={isInView} delay={index * 0.3 + 0.3} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
