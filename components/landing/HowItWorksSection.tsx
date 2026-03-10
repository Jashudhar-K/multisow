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

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Icon } from '@/components/ui/Icon'
import dynamic from 'next/dynamic'
import type { ProcessStep } from '@/types/landing'

const SplineScene = dynamic(
  () => import('@/components/ui/splite').then((m) => ({ default: m.SplineScene })),
  { ssr: false }
)

const SPLINE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

const steps: ProcessStep[] = [
  {
    number: 1,
    title: 'Design Your Strata',
    icon: 'layers',
    body: "Select your land size, soil type, and target crops. MultiSow's AI immediately validates compatibility across all 4 vertical tiers.",
  },
  {
    number: 2,
    title: 'AI Optimises Everything',
    icon: 'cpu',
    body: "FOHEM analyses 200+ features — from Beer's Law light interception to root overlap indices — and finds the optimal planting geometry.",
  },
  {
    number: 3,
    title: 'Track & Improve',
    icon: 'barchart',
    body: 'Connect IoT sensors and drone imagery. The model retrains on your real farm data every season, getting smarter with every harvest.',
  },
]

const materialIconMap: Record<string, string> = {
  layers: 'layers',
  cpu: 'memory',
  barchart: 'bar_chart',
}

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.15, once: true })

  return (
    <section
      id="how-it-works"
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
            How It Works
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Three steps from field to optimised harvest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Steps Timeline */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px overflow-hidden">
              <motion.div
                className="w-full bg-gradient-to-b from-green-500 to-emerald-600"
                initial={{ height: 0 }}
                animate={isInView ? { height: '100%' } : { height: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>

            <div className="space-y-12">
              {steps.map((step, index) => {
                const iconName = materialIconMap[step.icon as keyof typeof materialIconMap]
                return (
                  <motion.div
                    key={step.number}
                    className="relative flex gap-6"
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.3,
                      ease: 'easeOut',
                    }}
                  >
                    {/* Step number circle */}
                    <div className="relative z-10 w-12 h-12 shrink-0 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                      <Icon name={iconName ?? 'help'} size={20} className="text-green-400" />
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                          STEP {step.number}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-neutral-400 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right: Spline Scene with float animation */}
          <div
            className="hidden lg:block relative h-[500px] bg-black/10 rounded-xl"
            aria-hidden="true"
            role="presentation"
            style={{ minHeight: 400 }}
          >
            {/* Robot animation removed. Optionally, place a static image below: */}
            {/* <img src="/images/robot-placeholder.png" alt="Robot" className="w-full h-full object-contain" /> */}
          </div>
        </div>
      </div>
    </section>
  )
}
