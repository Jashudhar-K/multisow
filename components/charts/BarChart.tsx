/**
 * BarChart Component
 * ==================
 * Animated bar chart with horizontal and vertical variants.
 */

'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/index';

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
}

export interface BarChartProps {
  data: BarChartDataPoint[];
  width?: number;
  height?: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  orientation?: 'vertical' | 'horizontal';
  showValues?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  title?: string;
  barRadius?: number;
  gap?: number;
  className?: string;
}

const colorMap = {
  primary: {
    fill: 'var(--color-primary-500)',
    hover: 'var(--color-primary-400)',
  },
  success: {
    fill: 'var(--color-success)',
    hover: 'hsl(142, 76%, 45%)',
  },
  warning: {
    fill: 'var(--color-warning)',
    hover: 'hsl(48, 96%, 58%)',
  },
  error: {
    fill: 'var(--color-error)',
    hover: 'hsl(0, 84%, 65%)',
  },
  accent: {
    fill: 'var(--color-accent-500)',
    hover: 'var(--color-accent-400)',
  },
};

export function BarChart({
  data,
  width = 400,
  height = 250,
  color = 'primary',
  orientation = 'vertical',
  showValues = true,
  showGrid = true,
  animate = true,
  title,
  barRadius = 6,
  gap = 8,
  className,
}: BarChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isVertical = orientation === 'vertical';
  const padding = isVertical 
    ? { top: 20, right: 20, bottom: 50, left: 50 }
    : { top: 20, right: 60, bottom: 20, left: 100 };
    
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const { bars, maxValue, gridLines } = useMemo(() => {
    if (data.length === 0) return { bars: [], maxValue: 0, gridLines: [] };

    const max = Math.max(...data.map(d => d.value)) * 1.1;
    const barCount = data.length;
    
    // Generate grid lines
    const lineCount = 5;
    const lines = Array.from({ length: lineCount }, (_, i) => 
      Math.round((max / (lineCount - 1)) * i)
    );

    if (isVertical) {
      const barWidth = (chartWidth - gap * (barCount - 1)) / barCount;
      const computedBars = data.map((d, i) => ({
        x: padding.left + i * (barWidth + gap),
        y: padding.top + chartHeight - (d.value / max) * chartHeight,
        width: barWidth,
        height: (d.value / max) * chartHeight,
        ...d,
      }));
      return { bars: computedBars, maxValue: max, gridLines: lines };
    } else {
      const barHeight = (chartHeight - gap * (barCount - 1)) / barCount;
      const computedBars = data.map((d, i) => ({
        x: padding.left,
        y: padding.top + i * (barHeight + gap),
        width: (d.value / max) * chartWidth,
        height: barHeight,
        ...d,
      }));
      return { bars: computedBars, maxValue: max, gridLines: lines };
    }
  }, [data, chartWidth, chartHeight, gap, padding, isVertical]);

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

  const defaultColors = colorMap[color];

  return (
    <div ref={ref} className={cn('relative', className)}>
      {title && (
        <h3 className="text-sm font-medium text-text-primary mb-3">{title}</h3>
      )}
      
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {showGrid && gridLines.map((value, i) => {
          if (isVertical) {
            const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  className="text-text-muted"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-text-muted"
                >
                  {value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                </text>
              </g>
            );
          } else {
            const x = padding.left + (value / maxValue) * chartWidth;
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  className="text-text-muted"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 15}
                  textAnchor="middle"
                  className="text-[10px] fill-text-muted"
                >
                  {value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                </text>
              </g>
            );
          }
        })}

        {/* Bars */}
        {bars.map((bar, i) => {
          const barColor = bar.color ? colorMap[bar.color] : defaultColors;
          const isHovered = hoveredIndex === i;
          
          return (
            <g key={i}>
              {/* Bar */}
              <motion.rect
                x={bar.x}
                y={isVertical ? bar.y : bar.y}
                width={isVertical ? bar.width : 0}
                height={isVertical ? 0 : bar.height}
                rx={barRadius}
                ry={barRadius}
                fill={isHovered ? barColor.hover : barColor.fill}
                fillOpacity={isHovered ? 1 : 0.85}
                className="cursor-pointer transition-colors duration-150"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={animate ? (isVertical ? { height: 0, y: padding.top + chartHeight } : { width: 0 }) : undefined}
                animate={isInView && animate ? (
                  isVertical 
                    ? { height: bar.height, y: bar.y }
                    : { width: bar.width }
                ) : undefined}
                transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
              />

              {/* Label */}
              {isVertical ? (
                <text
                  x={bar.x + bar.width / 2}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  className="text-[11px] fill-text-secondary"
                >
                  {bar.label.length > 8 ? bar.label.slice(0, 8) + '…' : bar.label}
                </text>
              ) : (
                <text
                  x={padding.left - 10}
                  y={bar.y + bar.height / 2 + 4}
                  textAnchor="end"
                  className="text-[11px] fill-text-secondary"
                >
                  {bar.label.length > 12 ? bar.label.slice(0, 12) + '…' : bar.label}
                </text>
              )}

              {/* Value */}
              {showValues && (
                <motion.text
                  x={isVertical ? bar.x + bar.width / 2 : bar.x + bar.width + 8}
                  y={isVertical ? bar.y - 8 : bar.y + bar.height / 2 + 4}
                  textAnchor={isVertical ? 'middle' : 'start'}
                  className={cn(
                    'text-[11px] font-medium',
                    isHovered ? 'fill-text-primary' : 'fill-text-secondary'
                  )}
                  initial={animate ? { opacity: 0 } : undefined}
                  animate={isInView && animate ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.3, delay: i * 0.05 + 0.3 }}
                >
                  {bar.value.toLocaleString()}
                </motion.text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * BarChartStacked - Stacked bar chart variant
 */
export interface StackedBarDataPoint {
  label: string;
  values: { key: string; value: number; color?: 'primary' | 'success' | 'warning' | 'error' | 'accent' }[];
}

export interface BarChartStackedProps {
  data: StackedBarDataPoint[];
  width?: number;
  height?: number;
  showLegend?: boolean;
  animate?: boolean;
  title?: string;
  className?: string;
}

export function BarChartStacked({
  data,
  width = 400,
  height = 250,
  showLegend = true,
  animate = true,
  title,
  className,
}: BarChartStackedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const padding = { top: 20, right: 20, bottom: 50, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const gap = 8;

  const { bars, maxValue, keys } = useMemo(() => {
    if (data.length === 0) return { bars: [], maxValue: 0, keys: [] };

    // Get all unique keys
    const allKeys = [...new Set(data.flatMap(d => d.values.map(v => v.key)))];
    
    // Calculate max stacked value
    const max = Math.max(...data.map(d => 
      d.values.reduce((sum, v) => sum + v.value, 0)
    )) * 1.1;

    const barWidth = (chartWidth - gap * (data.length - 1)) / data.length;

    const computedBars = data.map((d, i) => {
      let currentY = padding.top + chartHeight;
      const segments = d.values.map(v => {
        const segmentHeight = (v.value / max) * chartHeight;
        const segment = {
          x: padding.left + i * (barWidth + gap),
          y: currentY - segmentHeight,
          width: barWidth,
          height: segmentHeight,
          ...v,
        };
        currentY -= segmentHeight;
        return segment;
      });
      return { label: d.label, segments };
    });

    return { bars: computedBars, maxValue: max, keys: allKeys };
  }, [data, chartWidth, chartHeight, gap, padding]);

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

  return (
    <div ref={ref} className={cn('relative', className)}>
      {title && (
        <h3 className="text-sm font-medium text-text-primary mb-3">{title}</h3>
      )}
      
      <svg width={width} height={height} className="overflow-visible">
        {bars.map((bar, barIndex) => (
          <g key={barIndex}>
            {bar.segments.map((segment, segIndex) => {
              const segmentColor = colorMap[segment.color || 'primary'];
              return (
                <motion.rect
                  key={segIndex}
                  x={segment.x}
                  y={segment.y}
                  width={segment.width}
                  height={segment.height}
                  rx={segIndex === bar.segments.length - 1 ? 6 : 0}
                  fill={segmentColor.fill}
                  fillOpacity={0.85}
                  initial={animate ? { height: 0, y: padding.top + chartHeight } : undefined}
                  animate={isInView && animate ? { height: segment.height, y: segment.y } : undefined}
                  transition={{ duration: 0.5, delay: barIndex * 0.1 + segIndex * 0.05 }}
                />
              );
            })}
            <text
              x={bar.segments[0]?.x + bar.segments[0]?.width / 2}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="text-[11px] fill-text-secondary"
            >
              {bar.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      {showLegend && keys.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {keys.map((key, i) => {
            const sampleValue = data[0]?.values.find(v => v.key === key);
            const legendColor = colorMap[sampleValue?.color || 'primary'];
            return (
              <div key={key} className="flex items-center gap-2 text-xs text-text-secondary">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: legendColor.fill, opacity: 0.85 }}
                />
                {key}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
