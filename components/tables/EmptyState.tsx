/**
 * EmptyState Component
 * =====================
 * Display states for empty data, errors, and loading.
 */

'use client';

import { ReactNode, ComponentPropsWithoutRef } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';

// ============================================================================
// Types
// ============================================================================

export type EmptyStateVariant =
  | 'default'
  | 'search'
  | 'error'
  | 'noData'
  | 'folder'
  | 'database';

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ============================================================================
// Variant Config
// ============================================================================

const variantConfig: Record<
  EmptyStateVariant,
  { icon: ReactNode; title: string; description: string }
> = {
  default: {
    icon: <Icon name="inbox" />,
    title: 'No items',
    description: 'There are no items to display.',
  },
  search: {
    icon: <Icon name="search" />,
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
  error: {
    icon: <Icon name="error" />,
    title: 'Something went wrong',
    description: 'An error occurred while loading data.',
  },
  noData: {
    icon: <Icon name="cancel" />,
    title: 'No data available',
    description: 'Data is not available at this time.',
  },
  folder: {
    icon: <Icon name="folder_open" />,
    title: 'Empty folder',
    description: 'This folder is empty.',
  },
  database: {
    icon: <Icon name="database" />,
    title: 'No records',
    description: 'No records found in the database.',
  },
};

// ============================================================================
// EmptyState
// ============================================================================

export function EmptyState({
  variant = 'default',
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];

  const sizeStyles = {
    sm: {
      container: 'py-8',
      icon: 'w-10 h-10',
      title: 'text-sm',
      description: 'text-xs',
    },
    md: {
      container: 'py-12',
      icon: 'w-14 h-14',
      title: 'text-base',
      description: 'text-sm',
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      title: 'text-lg',
      description: 'text-base',
    },
  };

  const styles = sizeStyles[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        styles.container,
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center text-text-muted mb-4',
          styles.icon
        )}
      >
        <span className="[&>svg]:w-full [&>svg]:h-full">
          {icon || config.icon}
        </span>
      </div>

      {/* Title */}
      <h3
        className={cn(
          'font-semibold text-text-primary mb-1',
          styles.title
        )}
      >
        {title || config.title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          'text-text-secondary max-w-sm',
          styles.description
        )}
      >
        {description || config.description}
      </p>

      {/* Action */}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}

// ============================================================================
// LoadingState
// ============================================================================

export interface LoadingStateProps extends ComponentPropsWithoutRef<'div'> {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({
  title = 'Loading...',
  description,
  size = 'md',
  className,
  ...props
}: LoadingStateProps) {
  const sizeStyles = {
    sm: { container: 'py-8', spinner: 24, title: 'text-sm' },
    md: { container: 'py-12', spinner: 32, title: 'text-base' },
    lg: { container: 'py-16', spinner: 40, title: 'text-lg' },
  };

  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        styles.container,
        className
      )}
      {...props}
    >
      <Icon
        name="progress_activity"
        size={styles.spinner}
        className="text-primary-500 animate-spin mb-4"
      />
      <h3 className={cn('font-medium text-text-primary', styles.title)}>
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary mt-1">{description}</p>
      )}
    </div>
  );
}

// ============================================================================
// ErrorState
// ============================================================================

export interface ErrorStateProps extends EmptyStateProps {
  error?: Error | string;
  retry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  error,
  retry,
  retryLabel = 'Try again',
  title = 'Something went wrong',
  description,
  ...props
}: ErrorStateProps) {
  const errorMessage =
    description ||
    (error instanceof Error ? error.message : error) ||
    'An unexpected error occurred.';

  return (
    <EmptyState
      variant="error"
      title={title}
      description={errorMessage}
      action={
        retry && (
          <button
            onClick={retry}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium',
              'bg-primary-500 text-white',
              'hover:bg-primary-600 transition-colors'
            )}
          >
            {retryLabel}
          </button>
        )
      }
      {...props}
    />
  );
}

// ============================================================================
// Skeleton Components
// ============================================================================

export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-elevated',
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

export interface SkeletonGroupProps {
  count?: number;
  gap?: number;
  children?: ReactNode;
  className?: string;
}

export function SkeletonGroup({
  count = 3,
  gap = 2,
  children,
  className,
}: SkeletonGroupProps) {
  if (children) {
    return (
      <div className={cn(`space-y-${gap}`, className)}>{children}</div>
    );
  }

  return (
    <div className={cn(`space-y-${gap}`, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}

// ============================================================================
// Table Skeleton
// ============================================================================

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-surface',
        className
      )}
    >
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 bg-surface-elevated border-b border-border">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            width={i === 0 ? '30%' : '15%'}
            height={16}
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-4 px-4 py-3 border-b border-border/50 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              width={colIdx === 0 ? '30%' : '15%'}
              height={14}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
