'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Spotlight } from '@/components/ui/spotlight'
import dynamic from 'next/dynamic'

const SplineScene = dynamic(
  () => import('@/components/ui/splite').then((m) => ({ default: m.SplineScene })),
  { ssr: false }
)

const SPLINE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.15, once: true })

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(var(--color-success),0.15) 0%, transparent 60%)',
        }}
      />

      {/* Spline background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        aria-hidden="true"
        role="presentation"
      >
        <SplineScene scene={SPLINE_URL} className="w-full h-full" />
      </div>

      {/* Spotlight */}
      <Spotlight
        className="-top-40 left-1/2 -translate-x-1/2"
        fill="rgb(var(--color-success))"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={ref}>
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-text-primary mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Ready to Transform Your Farm?
        </motion.h2>

        <motion.p
          className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Join farmers across Kerala, Karnataka, Tamil Nadu, Andhra Pradesh and
          Maharashtra who are growing smarter with AI-guided intercropping.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="/designer"
            className="inline-flex items-center bg-success hover:bg-success/90 text-white font-bold px-10 py-5 rounded-full text-xl transition-all duration-200 shadow-lg shadow-success/25"
            aria-label="Start Designing Free"
          >
            Start Designing Free →
          </a>
          <p className="text-text-muted text-sm mt-4">
            No account needed. Free for farms up to 2 acres.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
