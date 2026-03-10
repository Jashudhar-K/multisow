/**
 * MultiSow UI Primitives
 * ======================
 * Base components built on the design system tokens.
 * These are the foundational building blocks for all UI.
 */

'use client';

import React, { forwardRef, ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/index';

/* ============================================
   BUTTON COMPONENT
   ============================================ */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: `
    bg-primary-500 text-primary-950 
    hover:bg-primary-400 
    active:bg-primary-600
    shadow-glow-soft hover:shadow-glow
    focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background
  `,
  secondary: `
    bg-surface text-text-primary 
    border border-border-default
    hover:bg-elevated hover:border-border-strong
    active:bg-overlay
    focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background
  `,
  ghost: `
    bg-transparent text-text-secondary
    hover:bg-surface hover:text-text-primary
    active:bg-elevated
    focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background
  `,
  outline: `
    bg-transparent text-primary-400 
    border border-primary-500/50
    hover:bg-primary-500/10 hover:border-primary-400
    active:bg-primary-500/20
    focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background
  `,
  danger: `
    bg-error text-white
    hover:bg-red-600
    active:bg-red-700
    focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-background
  `,
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
  xl: 'h-14 px-8 text-lg gap-3 rounded-2xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, leftIcon, rightIcon, fullWidth, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-normal ease-out',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Spinner size={size === 'sm' ? 'sm' : 'md'} />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

/* ============================================
   SPINNER COMPONENT
   ============================================ */

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <svg
      className={cn('animate-spin', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/* ============================================
   INPUT COMPONENT
   ============================================ */

export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  error?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  label?: string;
  hint?: string;
  errorMessage?: string;
}

const inputSizes: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-4 text-base rounded-xl',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = 'md', error, leftIcon, rightIcon, label, hint, errorMessage, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-surface border transition-all duration-normal ease-out',
              'text-text-primary placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-error focus:ring-error/50 focus:border-error'
                : 'border-border-default hover:border-border-strong',
              inputSizes[size],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </span>
          )}
        </div>
        {hint && !error && (
          <span className="text-xs text-text-muted">{hint}</span>
        )}
        {error && errorMessage && (
          <span className="text-xs text-error">{errorMessage}</span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

/* ============================================
   TEXTAREA COMPONENT
   ============================================ */

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  label?: string;
  hint?: string;
  errorMessage?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, errorMessage, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full min-h-[100px] px-4 py-3 bg-surface border rounded-xl transition-all duration-normal ease-out',
            'text-text-primary placeholder:text-text-muted text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed resize-y',
            error
              ? 'border-error focus:ring-error/50 focus:border-error'
              : 'border-border-default hover:border-border-strong',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <span className="text-xs text-text-muted">{hint}</span>
        )}
        {error && errorMessage && (
          <span className="text-xs text-error">{errorMessage}</span>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

/* ============================================
   CARD COMPONENT
   ============================================ */

export type CardVariant = 'default' | 'glass' | 'outline' | 'elevated';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const cardVariants: Record<CardVariant, string> = {
  default: 'bg-surface border border-border-subtle',
  glass: 'glass-card',
  outline: 'bg-transparent border border-border-default',
  elevated: 'bg-elevated border border-border-default shadow-lg',
};

const cardPadding: Record<string, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hoverable, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-normal ease-out',
          cardVariants[variant],
          cardPadding[padding],
          hoverable && 'hover:border-border-strong hover:shadow-md cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

/* ============================================
   BADGE COMPONENT
   ============================================ */

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-surface text-text-secondary border border-border-default',
  success: 'bg-success-bg text-success border border-success/20',
  warning: 'bg-warning-bg text-warning border border-warning/20',
  error: 'bg-error-bg text-error border border-error/20',
  info: 'bg-info-bg text-info border border-info/20',
  outline: 'bg-transparent text-text-secondary border border-border-default',
};

const badgeSizes: Record<BadgeSize, string> = {
  sm: 'h-5 px-2 text-xs gap-1',
  md: 'h-6 px-2.5 text-sm gap-1.5',
};

export function Badge({ className, variant = 'default', size = 'sm', dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-colors',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'success' && 'bg-success',
          variant === 'warning' && 'bg-warning',
          variant === 'error' && 'bg-error',
          variant === 'info' && 'bg-info',
          (variant === 'default' || variant === 'outline') && 'bg-text-muted'
        )} />
      )}
      {children}
    </span>
  );
}

/* ============================================
   PROGRESS COMPONENT
   ============================================ */

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  label?: string;
  className?: string;
}

const progressSizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const progressColors = {
  primary: 'bg-primary-500',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
};

export function Progress({ 
  value, 
  max = 100, 
  size = 'md', 
  variant = 'primary',
  showValue,
  label,
  className 
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-text-secondary">{label}</span>}
          {showValue && <span className="text-text-muted">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div 
        className={cn(
          'w-full bg-surface rounded-full overflow-hidden',
          progressSizes[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <motion.div
          className={cn('h-full rounded-full', progressColors[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/* ============================================
   TOOLTIP COMPONENT (Simple CSS-based)
   ============================================ */

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const sideStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={cn('relative inline-flex group', className)}>
      {children}
      <span
        className={cn(
          'absolute z-tooltip px-2 py-1 text-xs font-medium rounded-lg whitespace-nowrap',
          'bg-overlay text-text-primary border border-border-default shadow-lg',
          'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
          'transition-all duration-fast ease-out',
          sideStyles[side]
        )}
        role="tooltip"
      >
        {content}
      </span>
    </div>
  );
}

/* ============================================
   DIVIDER COMPONENT
   ============================================ */

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  return (
    <div
      className={cn(
        'bg-border-subtle',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
      role="separator"
      aria-orientation={orientation}
    />
  );
}

/* ============================================
   SKELETON COMPONENT
   ============================================ */

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-surface animate-pulse',
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-xl',
        className
      )}
      style={{ width, height }}
    />
  );
}

/* ============================================
   AVATAR COMPONENT
   ============================================ */

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const initials = fallback || alt?.charAt(0).toUpperCase() || '?';

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden',
        'bg-surface border border-border-default',
        avatarSizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt || ''} className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-text-secondary">{initials}</span>
      )}
    </div>
  );
}

/* ============================================
   ICON BUTTON COMPONENT
   ============================================ */

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  label: string; // Required for accessibility
}

const iconButtonVariants = {
  ghost: 'bg-transparent hover:bg-surface active:bg-elevated text-text-secondary hover:text-text-primary',
  outline: 'bg-transparent border border-border-default hover:border-border-strong text-text-secondary hover:text-text-primary',
  filled: 'bg-surface hover:bg-elevated text-text-secondary hover:text-text-primary',
};

const iconButtonSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', label, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-all duration-normal ease-out',
          'focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          iconButtonVariants[variant],
          iconButtonSizes[size],
          className
        )}
        aria-label={label}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';

/* ============================================
   MOTION CARD (Animated Card)
   ============================================ */

interface MotionCardProps extends HTMLMotionProps<'div'> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, variant = 'default', padding = 'md', hoverable, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-2xl transition-colors duration-normal ease-out',
          cardVariants[variant],
          cardPadding[padding],
          hoverable && 'hover:border-border-strong cursor-pointer',
          className
        )}
        whileHover={hoverable ? { scale: 1.02 } : undefined}
        whileTap={hoverable ? { scale: 0.98 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionCard.displayName = 'MotionCard';
