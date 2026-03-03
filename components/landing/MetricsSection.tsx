'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'

interface StatItemProps {
  end: number
  decimals: number
  prefix: string
  suffix: string
  label: string
}

function StatItem({ end, decimals, prefix, suffix, label }: StatItemProps) {
  const { ref, formatted } = useCountUp({ end, decimals, prefix, suffix, duration: 2500 })

  return (
    <div ref={ref} className="flex-1 text-center px-4 py-6">
      <p className="text-4xl md:text-5xl font-black text-success font-mono mb-2">
        {formatted}
      </p>
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  )
}

const stats: StatItemProps[] = [
  { end: 3.8, decimals: 1, prefix: '', suffix: '×', label: 'Average Land Equivalent Ratio' },
  { end: 67, decimals: 0, prefix: '', suffix: '%', label: 'Water Use Reduction' },
  { end: 1.8, decimals: 1, prefix: '₹', suffix: 'L', label: 'Avg Monthly Revenue per Acre' },
  { end: 94, decimals: 0, prefix: '', suffix: '%', label: 'Compatibility Accuracy' },
]

export default function MetricsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.15, once: true })

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden bg-background"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(var(--color-success),0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--color-success),0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-border bg-surface-elevated/50 backdrop-blur-sm border border-border rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
