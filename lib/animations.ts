/**
 * MultiSow Animation Utilities
 * ============================
 * Reusable Framer Motion animation variants and utilities.
 */

import { Variants, Transition, TargetAndTransition } from 'framer-motion';

/* ============================================
   TRANSITION PRESETS
   ============================================ */

export const transitions = {
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  } as Transition,

  springBouncy: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  } as Transition,

  springGentle: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  } as Transition,

  easeOut: {
    type: 'tween',
    ease: [0, 0, 0.2, 1],
    duration: 0.3,
  } as Transition,

  easeInOut: {
    type: 'tween',
    ease: [0.4, 0, 0.2, 1],
    duration: 0.3,
  } as Transition,

  fast: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.15,
  } as Transition,

  slow: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.5,
  } as Transition,
};

/* ============================================
   FADE VARIANTS
   ============================================ */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.easeOut,
  },
};

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.spring,
  },
};

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.spring,
  },
};

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.spring,
  },
};

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.spring,
  },
};

/* ============================================
   SCALE VARIANTS
   ============================================ */

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.springBouncy,
  },
};

export const scaleInCenter: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.springBouncy,
  },
};

export const popIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  },
};

/* ============================================
   SLIDE VARIANTS
   ============================================ */

export const slideInFromLeft: Variants = {
  hidden: { 
    x: '-100%',
    opacity: 0,
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: transitions.spring,
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: transitions.easeOut,
  },
};

export const slideInFromRight: Variants = {
  hidden: { 
    x: '100%',
    opacity: 0,
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: transitions.spring,
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: transitions.easeOut,
  },
};

export const slideInFromTop: Variants = {
  hidden: { 
    y: '-100%',
    opacity: 0,
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: transitions.spring,
  },
  exit: {
    y: '-100%',
    opacity: 0,
    transition: transitions.easeOut,
  },
};

export const slideInFromBottom: Variants = {
  hidden: { 
    y: '100%',
    opacity: 0,
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: transitions.spring,
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: transitions.easeOut,
  },
};

/* ============================================
   STAGGER CONTAINERS
   ============================================ */

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/* ============================================
   STAGGER CHILDREN
   ============================================ */

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.spring,
  },
};

export const staggerItemScale: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.springBouncy,
  },
};

export const staggerItemLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.spring,
  },
};

export const staggerItemRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.spring,
  },
};

/* ============================================
   MODAL / OVERLAY VARIANTS
   ============================================ */

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: transitions.springBouncy,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: transitions.fast,
  },
};

export const drawerLeft: Variants = {
  hidden: { x: '-100%' },
  visible: { 
    x: 0,
    transition: transitions.spring,
  },
  exit: { 
    x: '-100%',
    transition: transitions.easeOut,
  },
};

export const drawerRight: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: transitions.spring,
  },
  exit: { 
    x: '100%',
    transition: transitions.easeOut,
  },
};

export const drawerBottom: Variants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0,
    transition: transitions.spring,
  },
  exit: { 
    y: '100%',
    transition: transitions.easeOut,
  },
};

/* ============================================
   TOOLTIP / POPOVER VARIANTS
   ============================================ */

export const tooltipVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.fast,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

export const dropdownVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: transitions.spring,
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: transitions.fast,
  },
};

/* ============================================
   INTERACTIVE HOVER STATES
   ============================================ */

export const hoverScale: TargetAndTransition = {
  scale: 1.05,
  transition: transitions.spring,
};

export const hoverScaleSubtle: TargetAndTransition = {
  scale: 1.02,
  transition: transitions.spring,
};

export const hoverLift: TargetAndTransition = {
  y: -4,
  transition: transitions.spring,
};

export const hoverGlow: TargetAndTransition = {
  boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
  transition: transitions.easeOut,
};

export const tapScale: TargetAndTransition = {
  scale: 0.95,
  transition: transitions.fast,
};

export const tapScaleSubtle: TargetAndTransition = {
  scale: 0.98,
  transition: transitions.fast,
};

/* ============================================
   SPECIAL EFFECTS
   ============================================ */

export const pulseVariants: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

export const shimmerVariants: Variants = {
  initial: { backgroundPosition: '-200% 0' },
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

export const floatVariants: Variants = {
  initial: { y: 0 },
  float: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    },
  },
};

export const rotateVariants: Variants = {
  initial: { rotate: 0 },
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
    },
  },
};

/* ============================================
   PAGE TRANSITIONS
   ============================================ */

export const pageTransition: Variants = {
  initial: { 
    opacity: 0,
  },
  enter: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export const pageSlideUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
  },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.2, 1],
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Creates a stagger delay for an item based on its index
 */
export function getStaggerDelay(index: number, baseDelay = 0.1): number {
  return index * baseDelay;
}

/**
 * Creates custom stagger variants with configurable timing
 */
export function createStaggerContainer(
  staggerChildren = 0.1,
  delayChildren = 0.1
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

/**
 * Creates custom fade in variant with configurable direction and distance
 */
export function createFadeIn(
  direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'up',
  distance = 20
): Variants {
  const initial: { opacity: number; x?: number; y?: number } = { opacity: 0 };
  
  switch (direction) {
    case 'up':
      initial.y = distance;
      break;
    case 'down':
      initial.y = -distance;
      break;
    case 'left':
      initial.x = distance;
      break;
    case 'right':
      initial.x = -distance;
      break;
  }

  return {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: transitions.spring,
    },
  };
}

/**
 * Reduces motion for users who prefer it
 * Use with useReducedMotion hook from framer-motion
 */
export const reducedMotion: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.01 },
  },
};
