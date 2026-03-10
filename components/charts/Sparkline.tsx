/**
 * Sparkline Component
 * ===================
 * Compact inline chart for showing trends in metric cards.
 */

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/index';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  showArea?: boolean;
  showDots?: boolean;
  animate?: boolean;
  className?: string;
}

const colorMap = {
  primary: {
    stroke: 'var(--color-primary-400)',
    fill: 'var(--color-primary-500)',
  },
  success: {
    stroke: 'var(--color-success)',
    fill: 'var(--color-success)',
  },
  warning: {
    stroke: 'var(--color-warning)',
    fill: 'var(--color-warning)',
  },
  error: {
    stroke: 'var(--color-error)',
    fill: 'var(--color-error)',
  },
  accent: {
    stroke: 'var(--color-accent-400)',
    fill: 'var(--color-accent-500)',
  },
};

export function Sparkline({
  data,
  width = 100,
  height = 32,
  strokeWidth = 2,
  color = 'primary',
  showArea = true,
  showDots = false,
  animate = true,
  className,
}: SparklineProps) {
  const { path, areaPath, points, minY, maxY } = useMemo(() => {
    if (data.length === 0) return { path: '', areaPath: '', points: [], minY: 0, maxY: 0 };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const padding = 4;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const pts = data.map((value, i) => ({
      x: padding + (i / (data.length - 1 || 1)) * chartWidth,
      y: padding + chartHeight - ((value - min) / range) * chartHeight,
      value,
    }));

    // Create smooth path using quadratic bezier curves
    let pathD = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const midX = (prev.x + curr.x) / 2;
      pathD += ` Q ${prev.x} ${prev.y} ${midX} ${(prev.y + curr.y) / 2}`;
    }
    if (pts.length > 1) {
      const last = pts[pts.length - 1];
      pathD += ` T ${last.x} ${last.y}`;
    }

    // Area path (closes the shape at the bottom)
    const lastPt = pts[pts.length - 1];
    const firstPt = pts[0];
    const areaDPath = `${pathD} L ${lastPt.x} ${height - padding} L ${firstPt.x} ${height - padding} Z`;

    return { 
      path: pathD, 
      areaPath: areaDPath, 
      points: pts,
      minY: min,
      maxY: max,
    };
  }, [data, width, height]);

  if (data.length === 0) {
    return (
      <div 
        className={cn('flex items-center justify-center text-text-muted text-xs', className)}
        style={{ width, height }}
      >
        No data
      </div>
    );
  }

  const colors = colorMap[color];

  return (
    <svg
      width={width}
      height={height}
      className={cn('overflow-visible', className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Gradient definition */}
      <defs>
        <linearGradient id={`sparkline-gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.fill} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colors.fill} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      {showArea && areaPath && (
        <motion.path
          d={areaPath}
          fill={`url(#sparkline-gradient-${color})`}
          initial={animate ? { opacity: 0 } : undefined}
          animate={animate ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Line */}
      <motion.path
        d={path}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* Dots */}
      {showDots && points.map((pt, i) => (
        <motion.circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={3}
          fill={colors.stroke}
          initial={animate ? { scale: 0, opacity: 0 } : undefined}
          animate={animate ? { scale: 1, opacity: 1 } : undefined}
          transition={{ delay: (i / points.length) * 0.5 + 0.5, duration: 0.2 }}
        />
      ))}

      {/* End dot (highlighted) */}
      {points.length > 0 && (
        <motion.circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={4}
          fill={colors.stroke}
          initial={animate ? { scale: 0 } : undefined}
          animate={animate ? { scale: 1 } : undefined}
          transition={{ delay: 1, duration: 0.2, type: 'spring' }}
        />
      )}
    </svg>
  );
}

/**
 * SparklineBar - Bar sparkline variant
 */
export interface SparklineBarProps {
  data: number[];
  width?: number;
  height?: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  gap?: number;
  animate?: boolean;
  className?: string;
}

export function SparklineBar({
  data,
  width = 100,
  height = 32,
  color = 'primary',
  gap = 2,
  animate = true,
  className,
}: SparklineBarProps) {
  const bars = useMemo(() => {
    if (data.length === 0) return [];

    const max = Math.max(...data);
    const padding = 2;
    const availableWidth = width - padding * 2;
    const barWidth = (availableWidth - gap * (data.length - 1)) / data.length;

    return data.map((value, i) => ({
      x: padding + i * (barWidth + gap),
      height: ((value / (max || 1)) * (height - padding * 2)),
      value,
    }));
  }, [data, width, height, gap]);

  if (data.length === 0) {
    return (
      <div 
        className={cn('flex items-center justify-center text-text-muted text-xs', className)}
        style={{ width, height }}
      >
        No data
      </div>
    );
  }

  const colors = colorMap[color];
  const barWidth = (width - 4 - gap * (data.length - 1)) / data.length;

  return (
    <svg
      width={width}
      height={height}
      className={cn('overflow-visible', className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      {bars.map((bar, i) => (
        <motion.rect
          key={i}
          x={bar.x}
          y={height - 2 - bar.height}
          width={barWidth}
          height={bar.height}
          rx={1}
          fill={colors.stroke}
          fillOpacity={0.8}
          initial={animate ? { scaleY: 0 } : undefined}
          animate={animate ? { scaleY: 1 } : undefined}
          style={{ originY: '100%' }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        />
      ))}
    </svg>
  );
}
