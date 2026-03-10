/**
 * MetricCard Component
 * ====================
 * Dashboard metric card with animated counter, trend indicator, and sparkline.
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';
import { Sparkline, SparklineBar } from './Sparkline';

export interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  description?: string;
  sparklineData?: number[];
  sparklineType?: 'line' | 'bar';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  decimals?: number;
  loading?: boolean;
  className?: string;
}

// Animated number hook
function useAnimatedNumber(
  target: number,
  duration: number = 1200,
  decimals: number = 0,
  enabled: boolean = true
): number {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !enabled) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCurrent(Number((eased * target).toFixed(decimals)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, decimals, isInView, enabled]);

  return current;
}

// Color variants
const colorVariants = {
  primary: {
    icon: 'text-primary-400 bg-primary-500/15',
    trend: 'text-primary-400',
    border: 'border-primary-500/20',
    glow: 'group-hover:shadow-glow-soft',
  },
  success: {
    icon: 'text-success bg-success/15',
    trend: 'text-success',
    border: 'border-success/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]',
  },
  warning: {
    icon: 'text-warning bg-warning/15',
    trend: 'text-warning',
    border: 'border-warning/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]',
  },
  error: {
    icon: 'text-error bg-error/15',
    trend: 'text-error',
    border: 'border-error/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]',
  },
  accent: {
    icon: 'text-accent-400 bg-accent-500/15',
    trend: 'text-accent-400',
    border: 'border-accent-500/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
  },
};

const sizeVariants = {
  sm: {
    card: 'p-4',
    value: 'text-xl',
    label: 'text-xs',
    icon: 'p-1.5',
    iconSize: 16,
    sparkline: { width: 60, height: 24 },
  },
  md: {
    card: 'p-5',
    value: 'text-2xl',
    label: 'text-sm',
    icon: 'p-2',
    iconSize: 20,
    sparkline: { width: 80, height: 28 },
  },
  lg: {
    card: 'p-6',
    value: 'text-3xl',
    label: 'text-sm',
    icon: 'p-2.5',
    iconSize: 24,
    sparkline: { width: 100, height: 32 },
  },
};

export function MetricCard({
  label,
  value,
  unit,
  prefix = '',
  suffix = '',
  icon,
  trend,
  trendLabel,
  description,
  sparklineData,
  sparklineType = 'line',
  color = 'primary',
  size = 'md',
  decimals = 0,
  loading = false,
  className,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const animatedValue = useAnimatedNumber(value, 1200, decimals, !loading);
  
  const colors = colorVariants[color];
  const sizes = sizeVariants[size];

  // Format number with locale
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  // Trend indicator
  const trendIconName = trend && trend > 0 ? 'trending_up' : trend && trend < 0 ? 'trending_down' : 'remove';
  const trendColor = trend && trend > 0 ? 'text-success' : trend && trend < 0 ? 'text-error' : 'text-text-muted';

  if (loading) {
    return (
      <div className={cn(
        'relative rounded-2xl bg-surface border border-border-subtle overflow-hidden',
        sizes.card,
        className
      )}>
        <div className="animate-pulse space-y-3">
          <div className="h-10 w-10 rounded-xl bg-overlay" />
          <div className="h-8 w-24 rounded-lg bg-overlay" />
          <div className="h-4 w-16 rounded bg-overlay" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className={cn(
        'group relative rounded-2xl bg-surface border border-border-subtle overflow-hidden transition-all duration-300',
        colors.glow,
        colors.border,
        sizes.card,
        className
      )}
    >
      {/* Top row: Icon + Sparkline */}
      <div className="flex items-start justify-between mb-3">
        {/* Icon */}
        {icon && (
          <div className={cn('rounded-xl', sizes.icon, colors.icon)}>
            {icon}
          </div>
        )}
        
        {/* Sparkline */}
        {sparklineData && sparklineData.length > 1 && (
          <div className="flex-shrink-0">
            {sparklineType === 'line' ? (
              <Sparkline
                data={sparklineData}
                width={sizes.sparkline.width}
                height={sizes.sparkline.height}
                color={color}
                showArea
              />
            ) : (
              <SparklineBar
                data={sparklineData}
                width={sizes.sparkline.width}
                height={sizes.sparkline.height}
                color={color}
              />
            )}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className={cn('font-bold text-text-primary tracking-tight', sizes.value)}>
          {prefix}{decimals > 0 ? animatedValue.toFixed(decimals) : formatNumber(animatedValue)}{suffix}
        </span>
        {unit && (
          <span className="text-sm text-text-muted">{unit}</span>
        )}
      </div>

      {/* Label + Trend */}
      <div className="flex items-center justify-between">
        <span className={cn('text-text-secondary', sizes.label)}>{label}</span>
        
        {trend !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
            <Icon name={trendIconName} size={14} />
            <span>{Math.abs(trend)}%</span>
            {trendLabel && <span className="text-text-muted">{trendLabel}</span>}
          </div>
        )}
      </div>

      {/* Description tooltip */}
      {description && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative group/tip">
            <Icon name="info" size={14} className="text-text-muted hover:text-text-secondary cursor-help" />
            <div className="absolute right-0 top-full mt-2 w-48 p-3 rounded-xl bg-overlay backdrop-blur-sm border border-border-subtle text-xs text-text-secondary opacity-0 group-hover/tip:opacity-100 transition-opacity z-20 shadow-lg">
              {description}
            </div>
          </div>
        </div>
      )}

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

/**
 * MetricCardGrid - Container for metric cards
 */
export interface MetricCardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function MetricCardGrid({ children, columns = 4, className }: MetricCardGridProps) {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={cn('grid gap-4', colClasses[columns], className)}>
      {children}
    </div>
  );
}
