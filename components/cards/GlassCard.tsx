/**
 * GlassCard Component
 * ===================
 * Glassmorphism card with blur, border, and gradient effects.
 */

'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'subtle' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  glowColor?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  hover?: boolean;
  className?: string;
}

const variantStyles = {
  default: 'bg-surface/80 backdrop-blur-xl border border-border-subtle',
  elevated: 'bg-surface/90 backdrop-blur-2xl border border-border-default shadow-glass',
  subtle: 'bg-surface/50 backdrop-blur-md border border-border-subtle/50',
  bordered: 'bg-surface/70 backdrop-blur-xl border-2 border-border-default',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
  xl: 'p-8',
};

const glowColors = {
  primary: 'shadow-glow-soft',
  success: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]',
  warning: 'shadow-[0_0_30px_rgba(234,179,8,0.15)]',
  error: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
  accent: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      glow = false,
      glowColor = 'primary',
      hover = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-2xl overflow-hidden transition-all duration-300',
          variantStyles[variant],
          paddingStyles[padding],
          glow && glowColors[glowColor],
          hover && 'hover:border-border-default hover:shadow-lg cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

/**
 * GlassCardHeader - Header section for GlassCard
 */
export interface GlassCardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function GlassCardHeader({ children, className, actions }: GlassCardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex-1">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/**
 * GlassCardTitle - Title for GlassCard
 */
export interface GlassCardTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function GlassCardTitle({ children, icon, className }: GlassCardTitleProps) {
  return (
    <h3 className={cn('flex items-center gap-2 text-lg font-semibold text-text-primary', className)}>
      {icon && <span className="text-primary-400">{icon}</span>}
      {children}
    </h3>
  );
}

/**
 * GlassCardDescription - Description for GlassCard
 */
export interface GlassCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCardDescription({ children, className }: GlassCardDescriptionProps) {
  return (
    <p className={cn('text-sm text-text-secondary mt-1', className)}>
      {children}
    </p>
  );
}

/**
 * GlassCardContent - Main content area for GlassCard
 */
export interface GlassCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCardContent({ children, className }: GlassCardContentProps) {
  return <div className={cn('', className)}>{children}</div>;
}

/**
 * GlassCardFooter - Footer section for GlassCard
 */
export interface GlassCardFooterProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

export function GlassCardFooter({ children, className, bordered = false }: GlassCardFooterProps) {
  return (
    <div
      className={cn(
        'mt-4 pt-4 flex items-center justify-between',
        bordered && 'border-t border-border-subtle',
        className
      )}
    >
      {children}
    </div>
  );
}
