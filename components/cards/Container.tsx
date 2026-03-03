/**
 * Container Components
 * ====================
 * Content wrappers, page containers, and layout primitives.
 */

'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// PageContainer - Full page wrapper
// ============================================================================

export interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  (
    {
      children,
      title,
      description,
      actions,
      breadcrumbs,
      className,
      contentClassName,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('min-h-screen', className)}>
        {/* Page Header */}
        {(title || actions || breadcrumbs) && (
          <div className="border-b border-border-subtle bg-background/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="px-6 py-4">
              {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {title && (
                    <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
                  )}
                  {description && (
                    <p className="text-text-secondary mt-1">{description}</p>
                  )}
                </div>
                {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className={cn('p-6', contentClassName)}>{children}</div>
      </div>
    );
  }
);

PageContainer.displayName = 'PageContainer';

// ============================================================================
// ContentContainer - Centered content wrapper
// ============================================================================

export interface ContentContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function ContentContainer({
  children,
  size = 'lg',
  className,
}: ContentContainerProps) {
  const sizeStyles = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('mx-auto w-full px-4', sizeStyles[size], className)}>
      {children}
    </div>
  );
}

// ============================================================================
// Grid - Responsive grid layout
// ============================================================================

export interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  className?: string;
}

export function Grid({
  children,
  cols = 3,
  gap = 'md',
  responsive = true,
  className,
}: GridProps) {
  const colStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  const responsiveStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12',
  };

  const gapStyles = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'grid',
        responsive ? responsiveStyles[cols] : colStyles[cols],
        gapStyles[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Stack - Vertical stack layout
// ============================================================================

export interface StackProps {
  children: React.ReactNode;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  dividers?: boolean;
  className?: string;
}

export function Stack({ children, gap = 'md', dividers = false, className }: StackProps) {
  const gapStyles = {
    none: 'space-y-0',
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  };

  if (dividers) {
    return (
      <div className={cn('divide-y divide-border-subtle', className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn(gapStyles[gap], className)}>
      {children}
    </div>
  );
}

// ============================================================================
// Flex - Flexible layout
// ============================================================================

export interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Flex({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'md',
  className,
}: FlexProps) {
  const alignStyles = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyStyles = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const gapStyles = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'flex',
        direction === 'col' ? 'flex-col' : 'flex-row',
        alignStyles[align],
        justifyStyles[justify],
        gapStyles[gap],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Box - Generic content wrapper
// ============================================================================

export interface BoxProps {
  children: React.ReactNode;
  as?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Box({ children, as: Component = 'div', padding = 'none', className }: BoxProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <Component className={cn(paddingStyles[padding], className)}>
      {children}
    </Component>
  );
}

// ============================================================================
// Center - Center content
// ============================================================================

export interface CenterProps {
  children: React.ReactNode;
  className?: string;
}

export function Center({ children, className }: CenterProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {children}
    </div>
  );
}

// ============================================================================
// AnimatedContainer - Container with entrance animation
// ============================================================================

export interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideIn' | 'scale';
  delay?: number;
  className?: string;
}

export function AnimatedContainer({
  children,
  animation = 'fadeIn',
  delay = 0,
  className,
}: AnimatedContainerProps) {
  const variants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      className={className}
      initial={variants[animation].initial}
      animate={variants[animation].animate}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// ScrollArea - Scrollable container
// ============================================================================

export interface ScrollAreaProps {
  children: React.ReactNode;
  maxHeight?: string;
  hideScrollbar?: boolean;
  className?: string;
}

export function ScrollArea({
  children,
  maxHeight = '400px',
  hideScrollbar = false,
  className,
}: ScrollAreaProps) {
  return (
    <div
      className={cn(
        'overflow-y-auto',
        hideScrollbar && 'scrollbar-hide',
        className
      )}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// TwoColumn - Two column layout
// ============================================================================

export interface TwoColumnProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: string;
  rightWidth?: string;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  stackOn?: 'sm' | 'md' | 'lg' | 'never';
  className?: string;
}

export function TwoColumn({
  left,
  right,
  leftWidth = '1fr',
  rightWidth = '1fr',
  gap = 'md',
  stackOn = 'md',
  className,
}: TwoColumnProps) {
  const gapStyles = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const stackStyles = {
    sm: 'flex-col sm:flex-row',
    md: 'flex-col md:flex-row',
    lg: 'flex-col lg:flex-row',
    never: 'flex-row',
  };

  return (
    <div className={cn('flex', stackStyles[stackOn], gapStyles[gap], className)}>
      <div style={{ flex: leftWidth === '1fr' ? 1 : `0 0 ${leftWidth}` }}>{left}</div>
      <div style={{ flex: rightWidth === '1fr' ? 1 : `0 0 ${rightWidth}` }}>{right}</div>
    </div>
  );
}

// ============================================================================
// AspectRatio - Maintain aspect ratio
// ============================================================================

export interface AspectRatioProps {
  children: React.ReactNode;
  ratio?: '1:1' | '4:3' | '16:9' | '21:9';
  className?: string;
}

export function AspectRatio({ children, ratio = '16:9', className }: AspectRatioProps) {
  const ratioStyles = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '21:9': 'aspect-[21/9]',
  };

  return (
    <div className={cn('relative overflow-hidden', ratioStyles[ratio], className)}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
