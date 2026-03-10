/**
 * MultiSow Visual Effects
 * =======================
 * Components for noise textures, gradients, and visual depth.
 */

'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/index';

/* ============================================
   NOISE OVERLAY COMPONENT
   ============================================ */

interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

/**
 * Adds a subtle film grain / noise texture overlay.
 * Use as a sibling inside a relative container.
 */
export function NoiseOverlay({ opacity = 0.03, className }: NoiseOverlayProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-10',
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity,
        mixBlendMode: 'overlay',
        borderRadius: 'inherit',
      }}
      aria-hidden="true"
    />
  );
}

/* ============================================
   GRADIENT MESH BACKGROUND
   ============================================ */

interface GradientMeshProps {
  className?: string;
  variant?: 'default' | 'subtle' | 'vibrant';
}

/**
 * Creates a multi-color gradient mesh background.
 * Use as a background layer in hero sections.
 */
export function GradientMesh({ className, variant = 'default' }: GradientMeshProps) {
  const variants = {
    default: {
      background: `
        radial-gradient(at 40% 20%, rgba(34, 197, 94, 0.08) 0px, transparent 50%),
        radial-gradient(at 80% 0%, rgba(14, 165, 233, 0.05) 0px, transparent 50%),
        radial-gradient(at 0% 50%, rgba(146, 64, 14, 0.05) 0px, transparent 50%),
        var(--color-bg-base)
      `,
    },
    subtle: {
      background: `
        radial-gradient(at 40% 20%, rgba(34, 197, 94, 0.04) 0px, transparent 50%),
        radial-gradient(at 80% 0%, rgba(14, 165, 233, 0.03) 0px, transparent 50%),
        var(--color-bg-base)
      `,
    },
    vibrant: {
      background: `
        radial-gradient(at 40% 20%, rgba(34, 197, 94, 0.15) 0px, transparent 50%),
        radial-gradient(at 80% 0%, rgba(14, 165, 233, 0.10) 0px, transparent 50%),
        radial-gradient(at 20% 80%, rgba(251, 191, 36, 0.08) 0px, transparent 50%),
        radial-gradient(at 0% 50%, rgba(146, 64, 14, 0.08) 0px, transparent 50%),
        var(--color-bg-base)
      `,
    },
  };

  return (
    <div
      className={cn('absolute inset-0 -z-10', className)}
      style={variants[variant]}
      aria-hidden="true"
    />
  );
}

/* ============================================
   GRID PATTERN BACKGROUND
   ============================================ */

interface GridPatternProps {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
}

/**
 * Creates a subtle grid pattern background.
 * Use for dashboard or designer areas.
 */
export function GridPattern({ 
  className, 
  size = 40, 
  color = 'rgba(34, 197, 94, 0.03)',
  opacity = 1,
}: GridPatternProps) {
  return (
    <div
      className={cn('absolute inset-0 -z-10', className)}
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
      aria-hidden="true"
    />
  );
}

/* ============================================
   DOT PATTERN BACKGROUND
   ============================================ */

interface DotPatternProps {
  className?: string;
  size?: number;
  dotSize?: number;
  color?: string;
  opacity?: number;
}

/**
 * Creates a dot pattern background.
 * Useful for subtle texture.
 */
export function DotPattern({ 
  className, 
  size = 24,
  dotSize = 1,
  color = 'rgba(34, 197, 94, 0.15)',
  opacity = 1,
}: DotPatternProps) {
  return (
    <div
      className={cn('absolute inset-0 -z-10', className)}
      style={{
        backgroundImage: `radial-gradient(${color} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
      aria-hidden="true"
    />
  );
}

/* ============================================
   GLOW EFFECT
   ============================================ */

interface GlowProps {
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  blur?: number;
}

const glowSizes = {
  sm: 100,
  md: 200,
  lg: 300,
  xl: 500,
};

const glowPositions = {
  center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  top: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' },
  bottom: { bottom: '0%', left: '50%', transform: 'translate(-50%, 50%)' },
  left: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' },
  right: { top: '50%', right: '0%', transform: 'translate(50%, -50%)' },
};

/**
 * Creates a soft glow effect.
 * Position inside a relative container.
 */
export function Glow({ 
  className, 
  color = 'rgba(34, 197, 94, 0.3)',
  size = 'md',
  position = 'center',
  blur = 60,
}: GlowProps) {
  const sizeValue = glowSizes[size];

  return (
    <div
      className={cn('pointer-events-none absolute -z-10', className)}
      style={{
        width: sizeValue,
        height: sizeValue,
        background: color,
        borderRadius: '50%',
        filter: `blur(${blur}px)`,
        ...glowPositions[position],
      }}
      aria-hidden="true"
    />
  );
}

/* ============================================
   SPOTLIGHT EFFECT
   ============================================ */

interface SpotlightProps {
  className?: string;
}

/**
 * Creates a spotlight cone effect.
 * Use in hero sections for dramatic effect.
 */
export function Spotlight({ className }: SpotlightProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute -top-40 left-0 md:left-60 -z-10',
        'h-[80vh] w-[50vw]',
        className
      )}
      style={{
        background: `
          conic-gradient(
            from 225deg at 50% 50%,
            transparent 0deg,
            rgba(34, 197, 94, 0.1) 55deg,
            rgba(34, 197, 94, 0.2) 90deg,
            rgba(34, 197, 94, 0.1) 125deg,
            transparent 180deg
          )
        `,
        filter: 'blur(40px)',
      }}
      aria-hidden="true"
    />
  );
}

/* ============================================
   VIGNETTE EFFECT
   ============================================ */

interface VignetteProps {
  className?: string;
  intensity?: number;
}

/**
 * Creates a vignette (darkened edges) effect.
 */
export function Vignette({ className, intensity = 0.5 }: VignetteProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-10', className)}
      style={{
        background: `radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, ${intensity}) 100%)`,
      }}
      aria-hidden="true"
    />
  );
}

/* ============================================
   CARD WITH EFFECTS
   ============================================ */

interface EffectCardProps {
  children: ReactNode;
  className?: string;
  noise?: boolean;
  glow?: boolean;
  glowColor?: string;
}

/**
 * A card component with built-in visual effects.
 */
export function EffectCard({ 
  children, 
  className, 
  noise = true,
  glow = false,
  glowColor = 'rgba(34, 197, 94, 0.15)',
}: EffectCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-surface border border-border-subtle',
        className
      )}
    >
      {glow && (
        <div 
          className="absolute -inset-px -z-10 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${glowColor}, transparent 50%)`,
          }}
          aria-hidden="true"
        />
      )}
      {noise && <NoiseOverlay />}
      {children}
    </div>
  );
}

/* ============================================
   ANIMATED BORDER
   ============================================ */

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
  speed?: number;
}

/**
 * Creates a card with an animated gradient border.
 */
export function AnimatedBorder({ 
  children, 
  className,
  gradient = 'linear-gradient(90deg, var(--color-primary-500), var(--color-sky), var(--color-primary-500))',
  speed = 3,
}: AnimatedBorderProps) {
  return (
    <div className={cn('relative p-px rounded-2xl overflow-hidden', className)}>
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: gradient,
          backgroundSize: '200% 100%',
          animation: `shimmer ${speed}s linear infinite`,
        }}
        aria-hidden="true"
      />
      {/* Inner content */}
      <div className="relative bg-surface rounded-[calc(1rem-1px)]">
        {children}
      </div>
    </div>
  );
}

/* ============================================
   SHINE EFFECT (on hover)
   ============================================ */

interface ShineProps {
  children: ReactNode;
  className?: string;
}

/**
 * Adds a shine effect on hover.
 */
export function Shine({ children, className }: ShineProps) {
  return (
    <div className={cn('group relative overflow-hidden', className)}>
      {children}
      <div
        className="pointer-events-none absolute inset-0 -z-10 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
        aria-hidden="true"
      />
    </div>
  );
}
