// Consolidated landing page sections: Footer, MetricsSection, TrustSection
'use client'

import { Icon } from '@/components/ui/Icon'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'
import type { ResearchBadge } from '@/types/landing'

// ===================== Footer =====================
export function Footer() {
  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Research', href: '#research' },
    { label: 'Dashboard', href: '/designer' },
    { label: 'API Docs', href: '/docs' },
    { label: 'GitHub', href: 'https://github.com/Jashudhar/MultiSow' },
  ]
  return (
    <footer style={{ backgroundColor: '#0A0F0A' }} className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left: Logo */}
          <div>
            <span className="text-green-400 font-bold text-xl">🌿 MultiSow</span>
            <p className="text-neutral-500 text-sm mt-1">Intelligent Intercropping</p>
          </div>
          {/* Center: Nav Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-neutral-400 hover:text-green-400 transition-colors"
                {...(link.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
          {/* Right: License + GitHub */}
          <div className="flex items-center justify-end gap-3">
            <span className="text-sm text-neutral-500">MIT Licensed • Open Source</span>
            <a
              href="https://github.com/Jashudhar/MultiSow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-green-400 transition-colors"
              aria-label="View MultiSow on GitHub"
            >
              <Icon name="code" size={20} />
            </a>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-neutral-600">
            © 2026 MultiSow. Built for Indian farmers with ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}

// ===================== MetricsSection =====================
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
      <p className="text-4xl md:text-5xl font-black text-success font-mono mb-2">{formatted}</p>
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
export function MetricsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.15, once: true })
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-background">
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

// ===================== TrustSection =====================
const badges: ResearchBadge[] = [
  { emoji: '📊', label: 'ICRISAT Datasets' },
  { emoji: '🛰️', label: 'NASA POWER API' },
  { emoji: '🌍', label: 'Sentinel-2 Imagery' },
  { emoji: '📚', label: 'ICAR Research' },
]
export function TrustSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.15, once: true })
  return (
    <section id="research" className="relative py-20 md:py-24 overflow-hidden" style={{ backgroundColor: '#0A0F0A' }}>
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
