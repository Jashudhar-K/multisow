/**
 * Pagination Component
 * =====================
 * Standalone pagination with multiple variants.
 */

'use client';

import { useMemo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'simple' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showFirstLast?: boolean;
  siblingCount?: number;
  className?: string;
}

// ============================================================================
// Pagination
// ============================================================================

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'default',
  size = 'md',
  showFirstLast = true,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const range = useMemo(() => {
    if (variant === 'simple' || variant === 'minimal') {
      return [];
    }

    const totalNumbers = siblingCount * 2 + 3; // siblings + current + start + end
    const totalBlocks = totalNumbers + 2; // + 2 for ellipsis

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = Array.from(
        { length: 3 + 2 * siblingCount },
        (_, i) => i + 1
      );
      return [...leftRange, 'ellipsis-right', totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = Array.from(
        { length: 3 + 2 * siblingCount },
        (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
      );
      return [1, 'ellipsis-left', ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, 'ellipsis-left', ...middleRange, 'ellipsis-right', totalPages];
  }, [currentPage, totalPages, siblingCount, variant]);

  const sizeStyles = {
    sm: 'h-7 min-w-7 text-xs',
    md: 'h-9 min-w-9 text-sm',
    lg: 'h-11 min-w-11 text-base',
  };

  const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;

  if (totalPages <= 1) return null;

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <PaginationButton
          size={size}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={iconSize} />
        </PaginationButton>
        <span className="text-sm text-text-secondary px-2">
          {currentPage} / {totalPages}
        </span>
        <PaginationButton
          size={size}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={iconSize} />
        </PaginationButton>
      </div>
    );
  }

  if (variant === 'simple') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {showFirstLast && (
          <PaginationButton
            size={size}
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft size={iconSize} />
          </PaginationButton>
        )}
        <PaginationButton
          size={size}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={iconSize} />
        </PaginationButton>
        <span className={cn('px-3 text-text-primary', sizeStyles[size])}>
          Page {currentPage} of {totalPages}
        </span>
        <PaginationButton
          size={size}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={iconSize} />
        </PaginationButton>
        {showFirstLast && (
          <PaginationButton
            size={size}
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight size={iconSize} />
          </PaginationButton>
        )}
      </div>
    );
  }

  // Default variant with page numbers
  return (
    <nav
      className={cn('flex items-center gap-1', className)}
      aria-label="Pagination"
    >
      {showFirstLast && (
        <PaginationButton
          size={size}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <ChevronsLeft size={iconSize} />
        </PaginationButton>
      )}
      <PaginationButton
        size={size}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={iconSize} />
      </PaginationButton>

      {range.map((item, index) => {
        if (typeof item === 'string') {
          return (
            <span
              key={item}
              className={cn(
                'flex items-center justify-center px-1 text-text-muted',
                sizeStyles[size]
              )}
            >
              <MoreHorizontal size={iconSize} />
            </span>
          );
        }

        return (
          <PaginationButton
            key={item}
            size={size}
            active={currentPage === item}
            onClick={() => onPageChange(item)}
            aria-label={`Page ${item}`}
            aria-current={currentPage === item ? 'page' : undefined}
          >
            {item}
          </PaginationButton>
        );
      })}

      <PaginationButton
        size={size}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={iconSize} />
      </PaginationButton>
      {showFirstLast && (
        <PaginationButton
          size={size}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          <ChevronsRight size={iconSize} />
        </PaginationButton>
      )}
    </nav>
  );
}

// ============================================================================
// PaginationButton
// ============================================================================

interface PaginationButtonProps {
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  'aria-current'?: 'page' | undefined;
}

function PaginationButton({
  size = 'md',
  active = false,
  disabled = false,
  onClick,
  className,
  children,
  ...rest
}: PaginationButtonProps) {
  const sizeStyles = {
    sm: 'h-7 min-w-7 text-xs px-1.5',
    md: 'h-9 min-w-9 text-sm px-2',
    lg: 'h-11 min-w-11 text-base px-3',
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors',
        sizeStyles[size],
        active
          ? 'bg-primary-500 text-white'
          : disabled
          ? 'text-text-muted/50 cursor-not-allowed'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated',
        className
      )}
      aria-label={rest['aria-label']}
      aria-current={rest['aria-current']}
    >
      {children}
    </motion.button>
  );
}

// ============================================================================
// PageSizeSelector
// ============================================================================

export interface PageSizeSelectorProps {
  pageSize: number;
  options?: number[];
  onChange: (size: number) => void;
  className?: string;
}

export function PageSizeSelector({
  pageSize,
  options = [10, 25, 50, 100],
  onChange,
  className,
}: PageSizeSelectorProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <span className="text-text-secondary">Show</span>
      <select
        value={pageSize}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'px-2 py-1 rounded-lg border border-border',
          'bg-surface-elevated text-text-primary',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/30'
        )}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="text-text-secondary">per page</span>
    </div>
  );
}

// ============================================================================
// PaginationInfo
// ============================================================================

export interface PaginationInfoProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  className,
}: PaginationInfoProps) {
  const start = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <p className={cn('text-sm text-text-secondary', className)}>
      Showing <span className="font-medium text-text-primary">{start}</span>–
      <span className="font-medium text-text-primary">{end}</span> of{' '}
      <span className="font-medium text-text-primary">{totalItems}</span> results
    </p>
  );
}

// ============================================================================
// Compound Pagination
// ============================================================================

export interface CompoundPaginationProps extends PaginationProps {
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  showInfo?: boolean;
  showPageSize?: boolean;
}

export function CompoundPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  showInfo = true,
  showPageSize = true,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: CompoundPaginationProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {showInfo && (
          <PaginationInfo
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
          />
        )}
        {showPageSize && onPageSizeChange && (
          <PageSizeSelector
            pageSize={pageSize}
            options={pageSizeOptions}
            onChange={onPageSizeChange}
          />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        variant={variant}
        size={size}
        {...props}
      />
    </div>
  );
}
