/**
 * Input Component
 * ================
 * Text input with label, validation, and variants.
 */

'use client';

import { forwardRef, useState, InputHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: string;
  rightIcon?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flushed';
  clearable?: boolean;
  onClear?: () => void;
  containerClassName?: string;
  inputClassName?: string;
}

const sizeStyles = {
  sm: {
    input: 'h-8 text-sm px-3',
    icon: 14,
    label: 'text-xs',
  },
  md: {
    input: 'h-10 text-sm px-4',
    icon: 16,
    label: 'text-sm',
  },
  lg: {
    input: 'h-12 text-base px-4',
    icon: 18,
    label: 'text-sm',
  },
};

const variantStyles = {
  default: 'bg-surface border border-border-subtle focus:border-primary-500 rounded-xl',
  filled: 'bg-surface-hover border border-transparent focus:border-primary-500 rounded-xl',
  flushed: 'bg-transparent border-b border-border-subtle focus:border-primary-500 rounded-none px-0',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      success,
      hint,
      leftIcon: leftIconName,
      rightIcon: rightIconName,
      leftAddon,
      rightAddon,
      size = 'md',
      variant = 'default',
      type = 'text',
      clearable = false,
      onClear,
      disabled = false,
      containerClassName,
      inputClassName,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const sizes = sizeStyles[size];
    const isPassword = type === 'password';
    const isSearch = type === 'search';
    const hasError = !!error;
    const hasSuccess = !!success;
    const hasValue = !!props.value || !!props.defaultValue;

    return (
      <div className={cn('w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label className={cn('block font-medium text-text-primary mb-1.5', sizes.label)}>
            {label}
            {props.required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-text-muted mb-2">{description}</p>
        )}

        {/* Input Container */}
        <div className={cn('relative flex items-center', className)}>
          {/* Left Addon */}
          {leftAddon && (
            <div className="flex items-center justify-center px-3 h-full bg-surface-hover border border-r-0 border-border-subtle rounded-l-xl">
              {leftAddon}
            </div>
          )}

          {/* Input Wrapper */}
          <div className="relative flex-1">
            {/* Left Icon */}
            {(leftIconName || isSearch) && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <Icon name={leftIconName || 'search'} size={sizes.icon} />
              </div>
            )}

            {/* Input */}
            <input
              ref={ref}
              type={isPassword && showPassword ? 'text' : type}
              disabled={disabled}
              className={cn(
                'w-full outline-none transition-all duration-200',
                'text-text-primary placeholder:text-text-muted',
                'focus:ring-2 focus:ring-primary-500/20',
                variantStyles[variant],
                sizes.input,
                // Left padding for icon
                (leftIconName || isSearch) && 'pl-10',
                // Right padding for icons/buttons
                (rightIconName || isPassword || clearable || hasError || hasSuccess) && 'pr-10',
                // Addons
                leftAddon && 'rounded-l-none',
                rightAddon && 'rounded-r-none',
                // States
                hasError && 'border-error focus:border-error focus:ring-error/20',
                hasSuccess && 'border-success focus:border-success focus:ring-success/20',
                disabled && 'opacity-50 cursor-not-allowed bg-surface-hover',
                inputClassName
              )}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              {...props}
            />

            {/* Right Icons */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {/* Clear button */}
              {clearable && hasValue && !disabled && (
                <button
                  type="button"
                  onClick={onClear}
                  className="p-0.5 text-text-muted hover:text-text-secondary transition-colors"
                >
                  <Icon name="close" size={sizes.icon} />
                </button>
              )}

              {/* Password toggle */}
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-0.5 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <Icon name="visibility_off" size={sizes.icon} /> : <Icon name="visibility" size={sizes.icon} />}
                </button>
              )}

              {/* Status icons */}
              {hasError && !isPassword && <Icon name="error" size={sizes.icon} className="text-error" />}
              {hasSuccess && !hasError && !isPassword && <Icon name="check_circle" size={sizes.icon} className="text-success" />}

              {/* Custom right icon */}
              {rightIconName && !hasError && !hasSuccess && !isPassword && !clearable && (
                <Icon name={rightIconName} size={sizes.icon} className="text-text-muted" />
              )}
            </div>
          </div>

          {/* Right Addon */}
          {rightAddon && (
            <div className="flex items-center justify-center px-3 h-full bg-surface-hover border border-l-0 border-border-subtle rounded-r-xl">
              {rightAddon}
            </div>
          )}
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {(error || success || hint) && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={cn(
                'text-xs mt-1.5',
                error && 'text-error',
                success && !error && 'text-success',
                hint && !error && !success && 'text-text-muted'
              )}
            >
              {error || success || hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea Component
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  hint?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      error,
      success,
      hint,
      resize = 'vertical',
      disabled = false,
      containerClassName,
      className,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const hasSuccess = !!success;

    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className={cn('w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
            {props.required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-text-muted mb-2">{description}</p>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full min-h-[100px] px-4 py-3 rounded-xl outline-none transition-all duration-200',
            'bg-surface border border-border-subtle',
            'text-sm text-text-primary placeholder:text-text-muted',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            resizeStyles[resize],
            hasError && 'border-error focus:border-error focus:ring-error/20',
            hasSuccess && 'border-success focus:border-success focus:ring-success/20',
            disabled && 'opacity-50 cursor-not-allowed bg-surface-hover',
            className
          )}
          {...props}
        />

        {/* Messages */}
        <AnimatePresence mode="wait">
          {(error || success || hint) && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={cn(
                'text-xs mt-1.5',
                error && 'text-error',
                success && !error && 'text-success',
                hint && !error && !success && 'text-text-muted'
              )}
            >
              {error || success || hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

/**
 * SearchInput - Pre-configured search input
 */
export interface SearchInputProps extends Omit<InputProps, 'type' | 'leftIcon'> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch((e.target as HTMLInputElement).value);
      }
      onKeyDown?.(e);
    };

    return (
      <Input
        ref={ref}
        type="search"
        placeholder="Search..."
        clearable
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
