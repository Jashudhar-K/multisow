/**
 * AreaChart Component
 * ===================
 * Animated area chart with gradient fills and tooltips.
 */

'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AreaChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  width?: number;
  height?: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  secondaryColor?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  title?: string;
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

export function AreaChart({
  data,
  width = 400,
  height = 200,
  color = 'primary',
  secondaryColor,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  animate = true,
  title,
  className,
}: AreaChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const { primaryPath, primaryAreaPath, secondaryPath, secondaryAreaPath, points, secondaryPoints, yAxisTicks, maxValue } = useMemo(() => {
    if (data.length === 0) return { primaryPath: '', primaryAreaPath: '', secondaryPath: '', secondaryAreaPath: '', points: [], secondaryPoints: [], yAxisTicks: [], maxValue: 0 };

    const values = data.map(d => d.value);
    const secondaryValues = data.map(d => d.secondary ?? 0);
    const allValues = [...values, ...secondaryValues.filter(v => v > 0)];
    const max = Math.max(...allValues) * 1.1;
    const min = 0;

    // Generate Y axis ticks
    const tickCount = 5;
    const tickStep = max / (tickCount - 1);
    const ticks = Array.from({ length: tickCount }, (_, i) => Math.round(i * tickStep));

    // Calculate points
    const pts = data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1 || 1)) * chartWidth,
      y: padding.top + chartHeight - ((d.value - min) / (max - min || 1)) * chartHeight,
      ...d,
    }));

    const secPts = data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1 || 1)) * chartWidth,
      y: padding.top + chartHeight - (((d.secondary ?? 0) - min) / (max - min || 1)) * chartHeight,
      value: d.secondary ?? 0,
      label: d.label,
    }));

    // Create smooth path
    const createPath = (points: typeof pts) => {
      if (points.length === 0) return '';
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = (prev.x + curr.x) / 2;
        d += ` Q ${prev.x} ${prev.y} ${midX} ${(prev.y + curr.y) / 2}`;
      }
      if (points.length > 1) {
        const last = points[points.length - 1];
        d += ` T ${last.x} ${last.y}`;
      }
      return d;
    };

    const createAreaPath = (points: typeof pts) => {
      const linePath = createPath(points);
      if (!linePath || points.length === 0) return '';
      const bottomY = padding.top + chartHeight;
      return `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
    };

    return {
      primaryPath: createPath(pts),
      primaryAreaPath: createAreaPath(pts),
      secondaryPath: secondaryColor ? createPath(secPts) : '',
      secondaryAreaPath: secondaryColor ? createAreaPath(secPts) : '',
      points: pts,
      secondaryPoints: secPts,
      yAxisTicks: ticks,
      maxValue: max,
    };
  }, [data, chartWidth, chartHeight, padding, secondaryColor]);

  if (data.length === 0) {
    return (
      <div 
        ref={ref}
        className={cn('flex items-center justify-center bg-surface rounded-2xl border border-border-subtle', className)}
        style={{ width, height }}
      >
        <span className="text-text-muted text-sm">No data available</span>
      </div>
    );
  }

  const colors = colorMap[color];
  const secColors = secondaryColor ? colorMap[secondaryColor] : null;

  return (
    <div ref={ref} className={cn('relative', className)}>
      {title && (
        <h3 className="text-sm font-medium text-text-primary mb-3">{title}</h3>
      )}
      
      <svg width={width} height={height} className="overflow-visible">
        {/* Gradient definitions */}
        <defs>
          <linearGradient id={`area-gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.fill} stopOpacity="0.4" />
            <stop offset="100%" stopColor={colors.fill} stopOpacity="0" />
          </linearGradient>
          {secColors && (
            <linearGradient id={`area-gradient-${secondaryColor}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={secColors.fill} stopOpacity="0.3" />
              <stop offset="100%" stopColor={secColors.fill} stopOpacity="0" />
            </linearGradient>
          )}
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <g className="text-border-subtle">
            {yAxisTicks.map((tick, i) => {
              const y = padding.top + chartHeight - (tick / maxValue) * chartHeight;
              return (
                <line
                  key={i}
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeDasharray="4 4"
                />
              );
            })}
          </g>
        )}

        {/* Y Axis */}
        {showYAxis && (
          <g className="text-text-muted text-xs">
            {yAxisTicks.map((tick, i) => {
              const y = padding.top + chartHeight - (tick / maxValue) * chartHeight;
              return (
                <text
                  key={i}
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="currentColor"
                >
                  {tick >= 1000 ? `${(tick / 1000).toFixed(0)}K` : tick}
                </text>
              );
            })}
          </g>
        )}

        {/* X Axis */}
        {showXAxis && (
          <g className="text-text-muted text-xs">
            {points.map((pt, i) => (
              <text
                key={i}
                x={pt.x}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                fill="currentColor"
              >
                {pt.label}
              </text>
            ))}
          </g>
        )}

        {/* Secondary area (if present) */}
        {secColors && secondaryAreaPath && (
          <>
            <motion.path
              d={secondaryAreaPath}
              fill={`url(#area-gradient-${secondaryColor})`}
              initial={animate ? { opacity: 0 } : undefined}
              animate={isInView && animate ? { opacity: 1 } : undefined}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.path
              d={secondaryPath}
              fill="none"
              stroke={secColors.stroke}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={0.6}
              initial={animate ? { pathLength: 0 } : undefined}
              animate={isInView && animate ? { pathLength: 1 } : undefined}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </>
        )}

        {/* Primary area */}
        <motion.path
          d={primaryAreaPath}
          fill={`url(#area-gradient-${color})`}
          initial={animate ? { opacity: 0 } : undefined}
          animate={isInView && animate ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5 }}
        />

        {/* Primary line */}
        <motion.path
          d={primaryPath}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0 } : undefined}
          animate={isInView && animate ? { pathLength: 1 } : undefined}
          transition={{ duration: 1 }}
        />

        {/* Interactive dots */}
        {showTooltip && points.map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIndex === i ? 6 : 4}
              fill={colors.stroke}
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {hoveredIndex === i && (
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r={12}
                fill={colors.stroke}
                fillOpacity={0.2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredIndex !== null && points[hoveredIndex] && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute pointer-events-none px-3 py-2 bg-overlay backdrop-blur-sm border border-border-subtle rounded-xl shadow-lg z-10"
          style={{
            left: points[hoveredIndex].x,
            top: points[hoveredIndex].y - 50,
            transform: 'translateX(-50%)',
          }}
        >
          <p className="text-xs text-text-muted">{points[hoveredIndex].label}</p>
          <p className="text-sm font-semibold text-text-primary">
            {points[hoveredIndex].value.toLocaleString()}
          </p>
          {secondaryPoints[hoveredIndex]?.value > 0 && (
            <p className="text-xs text-text-secondary">
              Secondary: {secondaryPoints[hoveredIndex].value.toLocaleString()}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
