/**
 * Checkbox & Radio Components
 * ===========================
 * Selection controls with animations and group support.
 */

'use client';

import { forwardRef, createContext, useContext, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Checkbox
// ============================================================================

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
  containerClassName?: string;
}

const checkboxSizes = {
  sm: { box: 'w-4 h-4', icon: 10, label: 'text-sm', gap: 'gap-2' },
  md: { box: 'w-5 h-5', icon: 12, label: 'text-sm', gap: 'gap-2.5' },
  lg: { box: 'w-6 h-6', icon: 14, label: 'text-base', gap: 'gap-3' },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      size = 'md',
      indeterminate = false,
      disabled = false,
      checked,
      containerClassName,
      className,
      ...props
    },
    ref
  ) => {
    const sizes = checkboxSizes[size];
    const isChecked = checked || indeterminate;

    return (
      <label
        className={cn(
          'inline-flex items-start cursor-pointer select-none',
          sizes.gap,
          disabled && 'cursor-not-allowed opacity-50',
          containerClassName
        )}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <motion.div
            className={cn(
              'rounded border-2 flex items-center justify-center transition-colors',
              sizes.box,
              isChecked
                ? 'bg-primary-500 border-primary-500'
                : 'bg-transparent border-border-default hover:border-primary-400',
              error && !isChecked && 'border-error',
              className
            )}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isChecked ? 1 : 0,
                opacity: isChecked ? 1 : 0,
              }}
              transition={{ duration: 0.15 }}
            >
              {indeterminate ? (
                <Minus size={sizes.icon} className="text-white" />
              ) : (
                <Check size={sizes.icon} className="text-white" />
              )}
            </motion.div>
          </motion.div>
        </div>

        {(label || description) && (
          <div className="min-w-0">
            {label && (
              <span className={cn('block text-text-primary', sizes.label)}>
                {label}
              </span>
            )}
            {description && (
              <span className="block text-xs text-text-muted mt-0.5">
                {description}
              </span>
            )}
            {error && (
              <span className="block text-xs text-error mt-0.5">{error}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ============================================================================
// CheckboxGroup
// ============================================================================

interface CheckboxGroupContextValue {
  value: string[];
  onChange: (value: string[]) => void;
  name?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export interface CheckboxGroupProps {
  children: React.ReactNode;
  value?: string[];
  onChange?: (value: string[]) => void;
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CheckboxGroup({
  children,
  value = [],
  onChange,
  name,
  label,
  description,
  error,
  orientation = 'vertical',
  disabled = false,
  size = 'md',
  className,
}: CheckboxGroupProps) {
  const handleChange = (itemValue: string, checked: boolean) => {
    if (checked) {
      onChange?.([...value, itemValue]);
    } else {
      onChange?.(value.filter((v) => v !== itemValue));
    }
  };

  return (
    <CheckboxGroupContext.Provider
      value={{
        value,
        onChange: (newValue) => onChange?.(newValue),
        name,
        disabled,
        size,
      }}
    >
      <fieldset className={cn('w-full', className)}>
        {label && (
          <legend className="text-sm font-medium text-text-primary mb-2">
            {label}
          </legend>
        )}
        {description && (
          <p className="text-xs text-text-muted mb-3">{description}</p>
        )}
        <div
          className={cn(
            orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'
          )}
        >
          {children}
        </div>
        {error && <p className="text-xs text-error mt-2">{error}</p>}
      </fieldset>
    </CheckboxGroupContext.Provider>
  );
}

export interface CheckboxGroupItemProps extends Omit<CheckboxProps, 'checked' | 'onChange'> {
  value: string;
}

export function CheckboxGroupItem({ value, ...props }: CheckboxGroupItemProps) {
  const context = useContext(CheckboxGroupContext);
  if (!context) throw new Error('CheckboxGroupItem must be used within CheckboxGroup');

  return (
    <Checkbox
      {...props}
      name={context.name}
      size={context.size}
      disabled={context.disabled || props.disabled}
      checked={context.value.includes(value)}
      onChange={(e) => {
        const newValue = e.target.checked
          ? [...context.value, value]
          : context.value.filter((v) => v !== value);
        context.onChange(newValue);
      }}
    />
  );
}

// ============================================================================
// Radio
// ============================================================================

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  containerClassName?: string;
}

const radioSizes = {
  sm: { box: 'w-4 h-4', dot: 'w-1.5 h-1.5', label: 'text-sm', gap: 'gap-2' },
  md: { box: 'w-5 h-5', dot: 'w-2 h-2', label: 'text-sm', gap: 'gap-2.5' },
  lg: { box: 'w-6 h-6', dot: 'w-2.5 h-2.5', label: 'text-base', gap: 'gap-3' },
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      error,
      size = 'md',
      disabled = false,
      checked,
      containerClassName,
      className,
      ...props
    },
    ref
  ) => {
    const sizes = radioSizes[size];

    return (
      <label
        className={cn(
          'inline-flex items-start cursor-pointer select-none',
          sizes.gap,
          disabled && 'cursor-not-allowed opacity-50',
          containerClassName
        )}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="radio"
            disabled={disabled}
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <motion.div
            className={cn(
              'rounded-full border-2 flex items-center justify-center transition-colors',
              sizes.box,
              checked
                ? 'border-primary-500'
                : 'border-border-default hover:border-primary-400',
              error && !checked && 'border-error',
              className
            )}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={cn('rounded-full bg-primary-500', sizes.dot)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: checked ? 1 : 0,
                opacity: checked ? 1 : 0,
              }}
              transition={{ duration: 0.15 }}
            />
          </motion.div>
        </div>

        {(label || description) && (
          <div className="min-w-0">
            {label && (
              <span className={cn('block text-text-primary', sizes.label)}>
                {label}
              </span>
            )}
            {description && (
              <span className="block text-xs text-text-muted mt-0.5">
                {description}
              </span>
            )}
            {error && (
              <span className="block text-xs text-error mt-0.5">{error}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';

// ============================================================================
// RadioGroup
// ============================================================================

interface RadioGroupContextValue {
  value?: string;
  onChange: (value: string) => void;
  name: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  label?: string;
  description?: string;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RadioGroup({
  children,
  value,
  onChange,
  name,
  label,
  description,
  error,
  orientation = 'vertical',
  disabled = false,
  size = 'md',
  className,
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider
      value={{
        value,
        onChange: (newValue) => onChange?.(newValue),
        name,
        disabled,
        size,
      }}
    >
      <fieldset className={cn('w-full', className)}>
        {label && (
          <legend className="text-sm font-medium text-text-primary mb-2">
            {label}
          </legend>
        )}
        {description && (
          <p className="text-xs text-text-muted mb-3">{description}</p>
        )}
        <div
          className={cn(
            orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'
          )}
        >
          {children}
        </div>
        {error && <p className="text-xs text-error mt-2">{error}</p>}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps extends Omit<RadioProps, 'checked' | 'onChange' | 'name'> {
  value: string;
}

export function RadioGroupItem({ value, ...props }: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error('RadioGroupItem must be used within RadioGroup');

  return (
    <Radio
      {...props}
      name={context.name}
      size={context.size}
      disabled={context.disabled || props.disabled}
      checked={context.value === value}
      onChange={() => context.onChange(value)}
    />
  );
}

// ============================================================================
// Switch / Toggle
// ============================================================================

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  containerClassName?: string;
}

const switchSizes = {
  sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4', label: 'text-sm' },
  md: { track: 'w-10 h-5', thumb: 'w-4 h-4', translate: 'translate-x-5', label: 'text-sm' },
  lg: { track: 'w-12 h-6', thumb: 'w-5 h-5', translate: 'translate-x-6', label: 'text-base' },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      size = 'md',
      disabled = false,
      checked,
      containerClassName,
      className,
      ...props
    },
    ref
  ) => {
    const sizes = switchSizes[size];

    return (
      <label
        className={cn(
          'inline-flex items-start cursor-pointer select-none gap-3',
          disabled && 'cursor-not-allowed opacity-50',
          containerClassName
        )}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            disabled={disabled}
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <motion.div
            className={cn(
              'rounded-full transition-colors',
              sizes.track,
              checked ? 'bg-primary-500' : 'bg-border-default',
              className
            )}
          >
            <motion.div
              className={cn(
                'absolute top-0.5 left-0.5 rounded-full bg-white shadow-sm',
                sizes.thumb
              )}
              animate={{ x: checked ? (size === 'sm' ? 16 : size === 'md' ? 20 : 24) : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.div>
        </div>

        {(label || description) && (
          <div className="min-w-0">
            {label && (
              <span className={cn('block text-text-primary', sizes.label)}>
                {label}
              </span>
            )}
            {description && (
              <span className="block text-xs text-text-muted mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
