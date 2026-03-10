/**
 * Slider Component
 * =================
 * Range slider with labels, marks, and tooltips.
 */

'use client';

import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/index';

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  label?: string;
  description?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  marks?: SliderMark[];
  showTooltip?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  className?: string;
  containerClassName?: string;
}

const sizeStyles = {
  sm: { track: 'h-1', thumb: 'w-3 h-3', label: 'text-xs' },
  md: { track: 'h-1.5', thumb: 'w-4 h-4', label: 'text-sm' },
  lg: { track: 'h-2', thumb: 'w-5 h-5', label: 'text-sm' },
};

const colorStyles = {
  primary: 'bg-primary-500',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  accent: 'bg-accent-500',
};

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      onChangeEnd,
      label,
      description,
      showValue = true,
      valueFormatter = (v) => v.toString(),
      marks,
      showTooltip = false,
      disabled = false,
      size = 'md',
      color = 'primary',
      className,
      containerClassName,
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    const value = isControlled ? controlledValue : internalValue;
    const sizes = sizeStyles[size];
    const percentage = ((value - min) / (max - min)) * 100;

    const updateValue = useCallback(
      (clientX: number) => {
        if (!trackRef.current || disabled) return;

        const rect = trackRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        const rawValue = min + percent * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));

        if (!isControlled) {
          setInternalValue(clampedValue);
        }
        onChange?.(clampedValue);
      },
      [min, max, step, disabled, isControlled, onChange]
    );

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      setShowTip(true);
      updateValue(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      if (disabled) return;
      setIsDragging(true);
      setShowTip(true);
      updateValue(e.touches[0].clientX);
    };

    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX);
      const handleTouchMove = (e: TouchEvent) => updateValue(e.touches[0].clientX);
      const handleEnd = () => {
        setIsDragging(false);
        setShowTip(false);
        onChangeEnd?.(value);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }, [isDragging, updateValue, onChangeEnd, value]);

    return (
      <div ref={ref} className={cn('w-full', containerClassName)}>
        {/* Label and value */}
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <div>
                <span className={cn('font-medium text-text-primary', sizes.label)}>
                  {label}
                </span>
                {description && (
                  <span className="block text-xs text-text-muted mt-0.5">
                    {description}
                  </span>
                )}
              </div>
            )}
            {showValue && (
              <span className={cn('font-mono text-text-secondary', sizes.label)}>
                {valueFormatter(value)}
              </span>
            )}
          </div>
        )}

        {/* Track */}
        <div
          ref={trackRef}
          className={cn(
            'relative rounded-full cursor-pointer',
            sizes.track,
            'bg-border-default',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Filled track */}
          <motion.div
            className={cn('absolute top-0 left-0 h-full rounded-full', colorStyles[color])}
            style={{ width: `${percentage}%` }}
          />

          {/* Marks */}
          {marks && marks.length > 0 && (
            <div className="absolute inset-0">
              {marks.map((mark) => {
                const markPercent = ((mark.value - min) / (max - min)) * 100;
                return (
                  <div
                    key={mark.value}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${markPercent}%` }}
                  >
                    <div
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        mark.value <= value ? colorStyles[color] : 'bg-border-default'
                      )}
                    />
                    {mark.label && (
                      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-text-muted whitespace-nowrap">
                        {mark.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Thumb */}
          <motion.div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow-md border-2',
              sizes.thumb,
              disabled ? 'border-border-default' : `border-primary-500`,
              !disabled && 'hover:scale-110',
              isDragging && 'scale-110'
            )}
            style={{ left: `${percentage}%` }}
            whileHover={disabled ? undefined : { scale: 1.1 }}
            whileTap={disabled ? undefined : { scale: 1.2 }}
          >
            {/* Tooltip */}
            {showTooltip && showTip && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-surface-inverse text-text-inverse text-xs font-medium whitespace-nowrap shadow-lg"
              >
                {valueFormatter(value)}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Min/Max labels */}
        {!marks && (
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-text-muted">{valueFormatter(min)}</span>
            <span className="text-[10px] text-text-muted">{valueFormatter(max)}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

/**
 * RangeSlider - Dual thumb slider for ranges
 */
export interface RangeSliderProps {
  value?: [number, number];
  defaultValue?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: [number, number]) => void;
  onChangeEnd?: (value: [number, number]) => void;
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  className?: string;
  containerClassName?: string;
}

export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = [25, 75],
      min = 0,
      max = 100,
      step = 1,
      onChange,
      onChangeEnd,
      label,
      showValue = true,
      valueFormatter = (v) => v.toString(),
      disabled = false,
      size = 'md',
      color = 'primary',
      className,
      containerClassName,
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
    const [activeThumb, setActiveThumb] = useState<'start' | 'end' | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const value = isControlled ? controlledValue : internalValue;
    const [startValue, endValue] = value;
    const sizes = sizeStyles[size];

    const startPercent = ((startValue - min) / (max - min)) * 100;
    const endPercent = ((endValue - min) / (max - min)) * 100;

    const updateValue = useCallback(
      (clientX: number, thumb: 'start' | 'end') => {
        if (!trackRef.current || disabled) return;

        const rect = trackRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        const rawValue = min + percent * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));

        let newValue: [number, number];
        if (thumb === 'start') {
          newValue = [Math.min(clampedValue, endValue - step), endValue];
        } else {
          newValue = [startValue, Math.max(clampedValue, startValue + step)];
        }

        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
      [min, max, step, disabled, isControlled, onChange, startValue, endValue]
    );

    const handleMouseDown = (thumb: 'start' | 'end') => (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setActiveThumb(thumb);
      updateValue(e.clientX, thumb);
    };

    useEffect(() => {
      if (!activeThumb) return;

      const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX, activeThumb);
      const handleEnd = () => {
        setActiveThumb(null);
        onChangeEnd?.(value);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
      };
    }, [activeThumb, updateValue, onChangeEnd, value]);

    return (
      <div ref={ref} className={cn('w-full', containerClassName)}>
        {/* Label and value */}
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <span className={cn('font-medium text-text-primary', sizes.label)}>
                {label}
              </span>
            )}
            {showValue && (
              <span className={cn('font-mono text-text-secondary', sizes.label)}>
                {valueFormatter(startValue)} – {valueFormatter(endValue)}
              </span>
            )}
          </div>
        )}

        {/* Track */}
        <div
          ref={trackRef}
          className={cn(
            'relative rounded-full cursor-pointer',
            sizes.track,
            'bg-border-default',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          {/* Filled track */}
          <div
            className={cn('absolute top-0 h-full rounded-full', colorStyles[color])}
            style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }}
          />

          {/* Start thumb */}
          <motion.div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow-md border-2 border-primary-500',
              sizes.thumb,
              disabled && 'border-border-default'
            )}
            style={{ left: `${startPercent}%` }}
            onMouseDown={handleMouseDown('start')}
            whileHover={disabled ? undefined : { scale: 1.1 }}
          />

          {/* End thumb */}
          <motion.div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow-md border-2 border-primary-500',
              sizes.thumb,
              disabled && 'border-border-default'
            )}
            style={{ left: `${endPercent}%` }}
            onMouseDown={handleMouseDown('end')}
            whileHover={disabled ? undefined : { scale: 1.1 }}
          />
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-text-muted">{valueFormatter(min)}</span>
          <span className="text-[10px] text-text-muted">{valueFormatter(max)}</span>
        </div>
      </div>
    );
  }
);

RangeSlider.displayName = 'RangeSlider';
