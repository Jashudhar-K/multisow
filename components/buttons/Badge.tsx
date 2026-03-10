/**
 * Badge & Tag Components
 * ======================
 * Status indicators, labels, and removable tags.
 */

'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';

// ============================================================================
// Badge
// ============================================================================

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'soft' | 'outline' | 'dot';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  className?: string;
}

const badgeColorStyles = {
  solid: {
    default: 'bg-surface-inverse text-text-inverse',
    primary: 'bg-primary-500 text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-black',
    error: 'bg-error text-white',
    accent: 'bg-accent-500 text-white',
  },
  soft: {
    default: 'bg-surface-hover text-text-primary',
    primary: 'bg-primary-500/15 text-primary-400',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    error: 'bg-error/15 text-error',
    accent: 'bg-accent-500/15 text-accent-400',
  },
  outline: {
    default: 'border border-border-default text-text-primary',
    primary: 'border border-primary-500/50 text-primary-400',
    success: 'border border-success/50 text-success',
    warning: 'border border-warning/50 text-warning',
    error: 'border border-error/50 text-error',
    accent: 'border border-accent-500/50 text-accent-400',
  },
  dot: {
    default: 'text-text-muted',
    primary: 'text-primary-400',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    accent: 'text-accent-400',
  },
};

const dotColors = {
  default: 'bg-text-muted',
  primary: 'bg-primary-500',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  accent: 'bg-accent-500',
};

const badgeSizeStyles = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
};

const iconSizes = {
  sm: 10,
  md: 12,
  lg: 14,
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'soft',
      color = 'default',
      size = 'md',
      icon: iconName,
      className,
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full whitespace-nowrap',
          badgeColorStyles[variant][color],
          badgeSizeStyles[size],
          variant !== 'dot' && 'gap-1',
          className
        )}
      >
        {variant === 'dot' && (
          <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dotColors[color])} />
        )}
        {iconName && variant !== 'dot' && <Icon name={iconName} size={iconSizes[size]} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// ============================================================================
// Status Badge
// ============================================================================

export type StatusType = 'online' | 'offline' | 'busy' | 'away' | 'pending' | 'active' | 'inactive';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<StatusType, { color: BadgeProps['color']; label: string }> = {
  online: { color: 'success', label: 'Online' },
  offline: { color: 'default', label: 'Offline' },
  busy: { color: 'error', label: 'Busy' },
  away: { color: 'warning', label: 'Away' },
  pending: { color: 'warning', label: 'Pending' },
  active: { color: 'success', label: 'Active' },
  inactive: { color: 'default', label: 'Inactive' },
};

export function StatusBadge({
  status,
  label,
  showDot = true,
  size = 'md',
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant={showDot ? 'dot' : 'soft'}
      color={config.color}
      size={size}
      className={className}
    >
      {label || config.label}
    </Badge>
  );
}

// ============================================================================
// NotificationBadge - For notification counts
// ============================================================================

export interface NotificationBadgeProps {
  count?: number;
  max?: number;
  showZero?: boolean;
  dot?: boolean;
  color?: 'primary' | 'error' | 'success' | 'warning';
  className?: string;
}

export function NotificationBadge({
  count = 0,
  max = 99,
  showZero = false,
  dot = false,
  color = 'error',
  className,
}: NotificationBadgeProps) {
  if (!showZero && count === 0 && !dot) return null;

  const colorStyles = {
    primary: 'bg-primary-500',
    error: 'bg-error',
    success: 'bg-success',
    warning: 'bg-warning',
  };

  if (dot) {
    return (
      <span
        className={cn(
          'w-2.5 h-2.5 rounded-full',
          colorStyles[color],
          className
        )}
      />
    );
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5',
        'text-[10px] font-bold text-white rounded-full',
        colorStyles[color],
        className
      )}
    >
      {displayCount}
    </span>
  );
}

// ============================================================================
// Tag - Removable label
// ============================================================================

export interface TagProps {
  children: React.ReactNode;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const tagSizeStyles = {
  sm: 'h-5 px-2 text-xs gap-1',
  md: 'h-6 px-2.5 text-xs gap-1.5',
  lg: 'h-7 px-3 text-sm gap-2',
};

const tagColorStyles = {
  default: 'bg-surface-hover text-text-primary border-border-subtle hover:bg-surface-pressed',
  primary: 'bg-primary-500/15 text-primary-400 border-primary-500/30 hover:bg-primary-500/25',
  success: 'bg-success/15 text-success border-success/30 hover:bg-success/25',
  warning: 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/25',
  error: 'bg-error/15 text-error border-error/30 hover:bg-error/25',
  accent: 'bg-accent-500/15 text-accent-400 border-accent-500/30 hover:bg-accent-500/25',
};

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      color = 'default',
      size = 'md',
      icon: tagIconName,
      removable = false,
      onRemove,
      onClick,
      disabled = false,
      className,
    },
    ref
  ) => {
    const isInteractive = !!onClick && !disabled;

    return (
      <motion.span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-lg border transition-colors',
          tagSizeStyles[size],
          tagColorStyles[color],
          isInteractive && 'cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={isInteractive ? onClick : undefined}
        whileHover={isInteractive ? { scale: 1.02 } : undefined}
        whileTap={isInteractive ? { scale: 0.98 } : undefined}
      >
        {tagIconName && <Icon name={tagIconName} size={iconSizes[size]} />}
        <span className="truncate">{children}</span>
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            disabled={disabled}
            className={cn(
              'ml-0.5 p-0.5 rounded-sm transition-colors',
              'hover:bg-black/10 dark:hover:bg-white/10',
              disabled && 'pointer-events-none'
            )}
          >
            <Icon name="close" size={iconSizes[size]} />
          </button>
        )}
      </motion.span>
    );
  }
);

Tag.displayName = 'Tag';

// ============================================================================
// TagGroup - Container for multiple tags
// ============================================================================

export interface TagGroupProps {
  children: React.ReactNode;
  wrap?: boolean;
  className?: string;
}

export function TagGroup({ children, wrap = true, className }: TagGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex gap-1.5',
        wrap && 'flex-wrap',
        !wrap && 'overflow-x-auto scrollbar-hide',
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Chip - Alternative styling for tags
// ============================================================================

export interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function Chip({
  children,
  selected = false,
  onClick,
  disabled = false,
  size = 'md',
  className,
}: ChipProps) {
  const sizeStyles = {
    sm: 'h-6 px-2.5 text-xs',
    md: 'h-8 px-3 text-sm',
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-all',
        'border focus:outline-none focus:ring-2 focus:ring-primary-500/40',
        sizeStyles[size],
        selected
          ? 'bg-primary-500 text-white border-primary-500'
          : 'bg-transparent text-text-primary border-border-default hover:border-primary-500 hover:text-primary-400',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
