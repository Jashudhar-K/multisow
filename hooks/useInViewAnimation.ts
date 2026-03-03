'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'

interface UseInViewAnimationOptions {
  threshold?: number
  once?: boolean
}

export function useInViewAnimation(options: UseInViewAnimationOptions = {}) {
  const { threshold = 0.15, once = true } = options
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: threshold, once })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  } as const

  return { ref, isInView, containerVariants, itemVariants }
}
