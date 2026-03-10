/**
 * Button Component
 * =================
 * World-class button system with variants, sizes, and animations.
 */

'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: string;
  rightIcon?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  external?: boolean;
  className?: string;
}

const variantStyles = {
  primary: cn(
    'bg-primary-500 text-white',
    'hover:bg-primary-600 active:bg-primary-700',
    'shadow-sm hover:shadow-md',
    'border border-primary-500'
  ),
  secondary: cn(
    'bg-surface text-text-primary',
    'hover:bg-surface-hover active:bg-surface-pressed',
    'border border-border-default',
    'hover:border-border-strong'
  ),
  outline: cn(
    'bg-transparent text-primary-400',
    'hover:bg-primary-500/10 active:bg-primary-500/20',
    'border border-primary-500/50',
    'hover:border-primary-500'
  ),
  ghost: cn(
    'bg-transparent text-text-primary',
    'hover:bg-surface-hover active:bg-surface-pressed',
    'border border-transparent'
  ),
  danger: cn(
    'bg-error text-white',
    'hover:bg-red-600 active:bg-red-700',
    'shadow-sm hover:shadow-md',
    'border border-error'
  ),
  success: cn(
    'bg-success text-white',
    'hover:bg-green-600 active:bg-green-700',
    'shadow-sm hover:shadow-md',
    'border border-success'
  ),
};

const sizeStyles = {
  xs: 'h-6 px-2 text-xs gap-1 rounded-md',
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2 rounded-xl',
  xl: 'h-14 px-8 text-lg gap-3 rounded-2xl',
};

const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      leftIcon: leftIconName,
      rightIcon: rightIconName,
      loading = false,
      disabled = false,
      fullWidth = false,
      href,
      external = false,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const iconSize = iconSizes[size];

    const buttonContent = (
      <>
        {/* Loading spinner */}
        {loading && (
          <Icon name="progress_activity" size={iconSize} className="animate-spin" />
        )}

        {/* Left icon */}
        {!loading && leftIconName && <Icon name={leftIconName} size={iconSize} />}

        {/* Label */}
        <span>{children}</span>

        {/* Right icon */}
        {!loading && rightIconName && <Icon name={rightIconName} size={iconSize} />}
      </>
    );

    const buttonClasses = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-2 focus:ring-offset-background',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      className
    );

    // Link button
    if (href && !isDisabled) {
      if (external) {
        return (
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {buttonContent}
          </motion.a>
        );
      }

      return (
        <Link href={href} className={buttonClasses}>
          <motion.span
            className="inline-flex items-center justify-center w-full h-full gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {buttonContent}
          </motion.span>
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type as ButtonHTMLAttributes<HTMLButtonElement>['type']}
        disabled={isDisabled}
        className={buttonClasses}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

/**
 * IconButton - Square button for icons only
 */
export interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon: string;
  label: string; // Required for accessibility
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const iconButtonSizes = {
  xs: 'w-6 h-6 rounded-md',
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-12 h-12 rounded-xl',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: iconName,
      label,
      variant = 'ghost',
      size = 'md',
      loading = false,
      disabled = false,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const iconSize = iconSizes[size];

    return (
      <motion.button
        ref={ref}
        type={type as ButtonHTMLAttributes<HTMLButtonElement>['type']}
        disabled={isDisabled}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/40',
          variantStyles[variant],
          iconButtonSizes[size],
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        whileHover={isDisabled ? undefined : { scale: 1.1 }}
        whileTap={isDisabled ? undefined : { scale: 0.95 }}
        {...props}
      >
        {loading ? (
          <Icon name="progress_activity" size={iconSize} className="animate-spin" />
        ) : (
          <Icon name={iconName} size={iconSize} />
        )}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';

/**
 * ButtonGroup - Group buttons together
 */
export interface ButtonGroupProps {
  children: React.ReactNode;
  attached?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ButtonGroup({
  children,
  attached = false,
  orientation = 'horizontal',
  className,
}: ButtonGroupProps) {
  if (attached) {
    return (
      <div
        className={cn(
          'inline-flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          // Remove borders between buttons
          '[&>*:not(:first-child):not(:last-child)]:rounded-none',
          orientation === 'horizontal' && [
            '[&>*:first-child]:rounded-r-none',
            '[&>*:last-child]:rounded-l-none',
            '[&>*:not(:first-child)]:border-l-0',
          ],
          orientation === 'vertical' && [
            '[&>*:first-child]:rounded-b-none',
            '[&>*:last-child]:rounded-t-none',
            '[&>*:not(:first-child)]:border-t-0',
          ],
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex gap-2',
        orientation === 'vertical' && 'flex-col',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * FloatingActionButton - FAB for primary actions
 */
export interface FABProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon: string;
  label: string;
  extended?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
}

const fabPositions = {
  'bottom-right': 'fixed bottom-6 right-6',
  'bottom-left': 'fixed bottom-6 left-6',
  'bottom-center': 'fixed bottom-6 left-1/2 -translate-x-1/2',
};

export const FAB = forwardRef<HTMLButtonElement, FABProps>(
  (
    {
      icon: fabIconName,
      label,
      extended = false,
      position = 'bottom-right',
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type as ButtonHTMLAttributes<HTMLButtonElement>['type']}
        aria-label={label}
        className={cn(
          'z-fab flex items-center justify-center',
          'bg-primary-500 text-white rounded-full shadow-lg',
          'hover:bg-primary-600 hover:shadow-xl',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-2',
          'transition-all duration-200',
          extended ? 'px-6 h-14 gap-2' : 'w-14 h-14',
          fabPositions[position],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        {...props}
      >
        <Icon name={fabIconName} size={24} />
        {extended && <span className="font-medium">{label}</span>}
      </motion.button>
    );
  }
);

FAB.displayName = 'FAB';
