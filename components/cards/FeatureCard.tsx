/**
 * FeatureCard Component
 * =====================
 * Card for showcasing features with icon, title, and description.
 */

'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'gradient' | 'outlined' | 'minimal';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  badge?: string;
  disabled?: boolean;
  className?: string;
}

const colorStyles = {
  primary: {
    icon: 'text-primary-400 bg-primary-500/15',
    gradient: 'from-primary-500/20 via-primary-500/5 to-transparent',
    border: 'border-primary-500/30 hover:border-primary-500/50',
    badge: 'bg-primary-500/20 text-primary-400',
  },
  success: {
    icon: 'text-success bg-success/15',
    gradient: 'from-success/20 via-success/5 to-transparent',
    border: 'border-success/30 hover:border-success/50',
    badge: 'bg-success/20 text-success',
  },
  warning: {
    icon: 'text-warning bg-warning/15',
    gradient: 'from-warning/20 via-warning/5 to-transparent',
    border: 'border-warning/30 hover:border-warning/50',
    badge: 'bg-warning/20 text-warning',
  },
  error: {
    icon: 'text-error bg-error/15',
    gradient: 'from-error/20 via-error/5 to-transparent',
    border: 'border-error/30 hover:border-error/50',
    badge: 'bg-error/20 text-error',
  },
  accent: {
    icon: 'text-accent-400 bg-accent-500/15',
    gradient: 'from-accent-500/20 via-accent-500/5 to-transparent',
    border: 'border-accent-500/30 hover:border-accent-500/50',
    badge: 'bg-accent-500/20 text-accent-400',
  },
};

const sizeStyles = {
  sm: {
    card: 'p-4',
    icon: 'p-2',
    iconSize: 18,
    title: 'text-sm',
    description: 'text-xs',
  },
  md: {
    card: 'p-5',
    icon: 'p-2.5',
    iconSize: 20,
    title: 'text-base',
    description: 'text-sm',
  },
  lg: {
    card: 'p-6',
    icon: 'p-3',
    iconSize: 24,
    title: 'text-lg',
    description: 'text-sm',
  },
};

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  (
    {
      title,
      description,
      icon,
      href,
      onClick,
      variant = 'default',
      color = 'primary',
      size = 'md',
      showArrow = false,
      badge,
      disabled = false,
      className,
    },
    ref
  ) => {
    const colors = colorStyles[color];
    const sizes = sizeStyles[size];
    const isInteractive = !!href || !!onClick;

    const cardContent = (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-2xl overflow-hidden transition-all duration-300',
          // Variants
          variant === 'default' && 'bg-surface border border-border-subtle hover:border-border-default',
          variant === 'gradient' && `bg-gradient-to-br ${colors.gradient} bg-surface border border-border-subtle`,
          variant === 'outlined' && `bg-transparent border ${colors.border}`,
          variant === 'minimal' && 'bg-transparent hover:bg-surface/50',
          // Size
          sizes.card,
          // Interactive
          isInteractive && !disabled && 'cursor-pointer hover:shadow-lg group',
          // Disabled
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        whileHover={isInteractive && !disabled ? { y: -2 } : undefined}
        whileTap={isInteractive && !disabled ? { scale: 0.98 } : undefined}
        onClick={!disabled ? onClick : undefined}
      >
        {/* Badge */}
        {badge && (
          <div className={cn('absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-medium', colors.badge)}>
            {badge}
          </div>
        )}

        {/* Icon */}
        {icon && (
          <div className={cn('inline-flex rounded-xl mb-3', sizes.icon, colors.icon)}>
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className={cn('font-semibold text-text-primary', sizes.title)}>
              {title}
            </h4>
            {description && (
              <p className={cn('text-text-secondary mt-1 line-clamp-2', sizes.description)}>
                {description}
              </p>
            )}
          </div>

          {/* Arrow */}
          {showArrow && isInteractive && (
            <ArrowRight
              size={16}
              className="text-text-muted group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
            />
          )}
        </div>

        {/* Hover gradient overlay */}
        {variant !== 'gradient' && isInteractive && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        )}
      </motion.div>
    );

    if (href && !disabled) {
      return <Link href={href}>{cardContent}</Link>;
    }

    return cardContent;
  }
);

FeatureCard.displayName = 'FeatureCard';

/**
 * FeatureCardGrid - Grid container for feature cards
 */
export interface FeatureCardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureCardGrid({ children, columns = 3, className }: FeatureCardGridProps) {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', colClasses[columns], className)}>
      {children}
    </div>
  );
}

/**
 * IconFeatureCard - Horizontal feature card with larger icon
 */
export interface IconFeatureCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  href?: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  className?: string;
}

export function IconFeatureCard({
  title,
  description,
  icon,
  href,
  color = 'primary',
  className,
}: IconFeatureCardProps) {
  const colors = colorStyles[color];

  const content = (
    <div
      className={cn(
        'flex items-start gap-4 p-5 rounded-2xl bg-surface border border-border-subtle',
        'hover:border-border-default hover:shadow-lg transition-all group',
        href && 'cursor-pointer',
        className
      )}
    >
      <div className={cn('p-3 rounded-xl flex-shrink-0', colors.icon)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-text-primary group-hover:text-primary-400 transition-colors">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>
      {href && (
        <ArrowRight
          size={18}
          className="text-text-muted group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0"
        />
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
