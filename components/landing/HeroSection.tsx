/**
 * SPLINE 3D SCENE — ACTION REQUIRED
 * ─────────────────────────────────
 * The default scene URL below is a placeholder robot arm scene.
 * For the best MultiSow experience, replace it with an agricultural
 * 3D scene. Options:
 *
 * 1. FREE: Browse https://spline.design/community and search:
 *    "plant" | "tree" | "nature" | "farm" | "leaf" | "soil"
 *    Copy the "Viewer URL" from any scene and use it here.
 *
 * 2. CUSTOM: Sign up free at spline.design, use their 3D editor to
 *    create a layered farm scene (4 vegetation layers top-to-bottom),
 *    publish it, and replace this URL with your scene's .splinecode URL.
 *
 * 3. FALLBACK: If no Spline scene is available, the component
 *    automatically shows an animated CSS illustration instead.
 *    (See <StrataSection /> for a pure CSS/framer-motion alternative)
 *
 * Current placeholder:
 * "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
 */

'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Spotlight } from '@/components/ui/spotlight'

const CropGrowthStatic = dynamic(
  () => import('@/components/three/CropGrowthStatic'),
  { ssr: false }
)

const statPills = [
  '3.5–4.2× Productivity',
  '70% Water Savings',
  '100% Compatibility',
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-24">
          {/* Left: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-success border border-success/30 bg-success/10 shadow-[0_0_15px_rgba(var(--color-success),0.15)]">
                🌿 AI-Powered Intercropping
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95]"
            >
              <span className="text-success">Grow More.</span>
              <br />
              <span className="text-text-primary">With Less.</span>
              <br />
              <span className="bg-gradient-to-r from-success to-accent bg-clip-text text-transparent">
                Intelligently.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-text-secondary max-w-xl"
            >
              MultiSow uses stratified AI to design the perfect 4-layer
              intercropping system for your land — maximising yield, minimising
              resource waste.
            </motion.p>

            {/* Stat Pills */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
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
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-2">
              <a
                href="/designer"
                className="inline-flex items-center gap-2 bg-success hover:bg-success/90 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-success/25"
                aria-label="Design Your Farm"
              >
                Design Your Farm
              </a>
              <a
                href="/designer"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium text-lg px-6 py-4 rounded-full border border-border hover:border-border-hover transition-all duration-200"
                aria-label="View Legacy Designer"
              >
                <Play size={20} />
                Open Designer
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Crop Growth Scene (3D on desktop, static on mobile) */}
          <div
            className="hidden lg:block relative h-[600px]"
            aria-hidden="true"
            role="presentation"
          >
            <CropGrowthStatic />
          </div>
          <div
            className="block lg:hidden relative h-64 w-full"
            aria-hidden="true"
            role="presentation"
          >
            <CropGrowthStatic />
          </div>
        </div>
      </div>
    </section>
  )
}
