/**
 * HeroSection — single centered column, farmer-friendly language.
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { Spotlight } from '@/components/ui/spotlight'
import { useLanguage } from '@/context/LanguageContext'

const statPills = [
  '3.5–4.2× More Production',
  '40–70% Less Water',
  '100% Research Validated',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
} as const

export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Spotlight */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgb(var(--color-success))"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6 py-24"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-green-400 border border-green-500/30 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.15)] backdrop-blur-sm">
              <Icon name="eco" size={14} filled />
              {t('hero.badge') || 'AI-Powered Farm Planning for Indian Farmers'}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05]"
          >
            <span className="text-white drop-shadow-sm">{t('hero.grow') || 'Grow More'}</span>
            <br />
            <span className="text-white/90">{t('hero.from') || 'From Every Cent'}</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
              {t('hero.land') || 'of Land'}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/70 max-w-2xl font-light"
          >
            {t('hero.sub') || 'Plan multi-layer farms using AI. Get exact planting guides, yield predictions in tonnes per acre, and revenue estimates in ₹ — all in one place.'}
          </motion.p>

          {/* Stat Pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
            {statPills.map((pill) => (
              <span
                key={pill}
                className="px-4 py-2 rounded-full text-sm font-medium text-green-300 bg-white/5 border border-white/10 backdrop-blur-md shadow-sm"
              >
                {pill}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mt-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5"
            >
              <Icon name="agriculture" size={20} />
              {t('hero.cta1') || 'Plan My Farm'}
            </Link>
            <Link
              href="/designer"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium text-lg px-6 py-4 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <Icon name="grid_on" size={20} />
              {t('hero.cta2') || 'Open Designer'}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
