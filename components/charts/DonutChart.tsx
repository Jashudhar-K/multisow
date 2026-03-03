/**
 * DonutChart Component
 * ====================
 * Animated donut/pie chart with legend.
 */

'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DonutChartDataPoint {
  label: string;
  value: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
}

export interface DonutChartProps {
  data: DonutChartDataPoint[];
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  showTotal?: boolean;
  totalLabel?: string;
  animate?: boolean;
  title?: string;
  className?: string;
}

const colorMap = {
  primary: 'var(--color-primary-500)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  accent: 'var(--color-accent-500)',
};

// Default color sequence
const defaultColors: Array<'primary' | 'success' | 'warning' | 'error' | 'accent'> = [
  'primary',
  'success',
  'warning',
  'accent',
  'error',
];

export function DonutChart({
  data,
  size = 180,
  thickness = 24,
  showLegend = true,
  showTotal = true,
  totalLabel = 'Total',
  animate = true,
  title,
  className,
}: DonutChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const { segments, total } = useMemo(() => {
    const sum = data.reduce((acc, d) => acc + d.value, 0);
    let currentAngle = -90; // Start from top

    const segs = data.map((d, i) => {
      const percentage = sum > 0 ? d.value / sum : 0;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      return {
        ...d,
        color: d.color || defaultColors[i % defaultColors.length],
        percentage,
        startAngle,
        angle,
        dashArray: circumference * percentage,
        dashOffset: circumference * (1 - percentage),
        rotation: startAngle,
      };
    });

    return { segments: segs, total: sum };
  }, [data, circumference]);

  if (data.length === 0) {
    return (
      <div 
        ref={ref}
        className={cn('flex items-center justify-center', className)}
        style={{ width: size, height: size }}
      >
        <span className="text-text-muted text-sm">No data</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn('flex flex-col items-center', className)}>
      {title && (
        <h3 className="text-sm font-medium text-text-primary mb-4">{title}</h3>
      )}
      
      <div className="flex items-center gap-8">
        {/* Chart */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={thickness}
              className="text-border-subtle"
              strokeOpacity={0.3}
            />

            {/* Segments */}
            {segments.map((segment, i) => {
              const isHovered = hoveredIndex === i;
              let accumulatedOffset = 0;
              for (let j = 0; j < i; j++) {
                accumulatedOffset += segments[j].dashArray;
              }

              return (
                <motion.circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={colorMap[segment.color]}
                  strokeWidth={isHovered ? thickness + 4 : thickness}
                  strokeDasharray={`${segment.dashArray} ${circumference}`}
                  strokeDashoffset={-accumulatedOffset}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-150"
                  style={{ 
                    filter: isHovered ? 'brightness(1.2)' : 'none',
                    transformOrigin: 'center',
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  initial={animate ? { strokeDasharray: `0 ${circumference}` } : undefined}
                  animate={isInView && animate ? { 
                    strokeDasharray: `${segment.dashArray} ${circumference}` 
                  } : undefined}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                />
              );
            })}
          </svg>

          {/* Center content */}
          {showTotal && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className="text-2xl font-bold text-text-primary"
                initial={animate ? { opacity: 0, scale: 0.5 } : undefined}
                animate={isInView && animate ? { opacity: 1, scale: 1 } : undefined}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {total.toLocaleString()}
              </motion.span>
              <span className="text-xs text-text-muted">{totalLabel}</span>
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-col gap-2">
            {segments.map((segment, i) => (
              <motion.div
                key={i}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer',
                  hoveredIndex === i ? 'bg-overlay' : 'hover:bg-overlay/50'
                )}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={animate ? { opacity: 0, x: 10 } : undefined}
                animate={isInView && animate ? { opacity: 1, x: 0 } : undefined}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colorMap[segment.color] }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-text-secondary truncate block">
                    {segment.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">
                    {segment.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-text-muted">
                    ({(segment.percentage * 100).toFixed(1)}%)
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ProgressRing - Circular progress indicator
 */
export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  showValue?: boolean;
  label?: string;
  animate?: boolean;
  className?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 80,
  thickness = 8,
  color = 'primary',
  showValue = true,
  label,
  animate = true,
  className,
}: ProgressRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / max, 1);
  const strokeDasharray = circumference * percentage;
  const strokeDashoffset = circumference - strokeDasharray;

  return (
    <div ref={ref} className={cn('relative inline-flex', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          className="text-border-subtle"
          strokeOpacity={0.3}
        />
        
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color]}
          strokeWidth={thickness}
          strokeLinecap="round"
          initial={animate ? { strokeDasharray: `0 ${circumference}` } : undefined}
          animate={isInView && animate ? { 
            strokeDasharray: `${strokeDasharray} ${strokeDashoffset}` 
          } : undefined}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>

      {/* Center content */}
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-text-primary">
            {Math.round(percentage * 100)}%
          </span>
          {label && (
            <span className="text-[10px] text-text-muted">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}
