/**
 * HeroSection — single centered column, farmer-friendly language.
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { Spotlight } from '@/components/ui/spotlight'

const statPills = [
  '3.5–4.2× More Production',
  '40–70% Less Water',
  '100% Research Validated',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
} as const

export default function HeroSection() {
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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-success border border-success/30 bg-success/10 shadow-[0_0_15px_rgba(var(--color-success),0.15)]">
              <Icon name="eco" size={14} filled />
              AI-Powered Farm Planning for Indian Farmers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95]"
          >
            <span className="text-success">Grow More</span>
            <br />
            <span className="text-text-primary">From Every Cent</span>
            <br />
            <span className="bg-gradient-to-r from-success to-accent bg-clip-text text-transparent">
              of Land
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-text-secondary max-w-xl"
          >
            Plan multi-layer farms using AI. Get exact planting guides,
            yield predictions in tonnes per acre, and revenue estimates
            in ₹ — all in one place.
          </motion.p>

          {/* Stat Pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
            {statPills.map((pill) => (
              <span
                key={pill}
                className="px-4 py-2 rounded-full text-sm font-medium text-success bg-success/10 border border-success/20"
              >
                {pill}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mt-2">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-success hover:bg-success/90 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-success/25"
            >
              <Icon name="agriculture" size={20} />
              Plan My Farm
            </Link>
            <Link
              href="/designer"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium text-lg px-6 py-4 rounded-full border border-border hover:border-border-hover transition-all duration-200"
            >
              <Icon name="grid_on" size={20} />
              Open Designer
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
