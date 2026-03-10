/**
 * DataTable Component
 * ====================
 * Flexible data table with sorting, filtering, and pagination.
 */

'use client';

import {
  useState,
  useMemo,
  useCallback,
  ReactNode,
  ComponentPropsWithoutRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';

// ============================================================================
// Types
// ============================================================================

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T, index: number) => ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (row: T, index: number) => string;
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  tableClassName?: string;
  onRowClick?: (row: T, index: number) => void;
}

// ============================================================================
// DataTable
// ============================================================================

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor = (_, index) => String(index),
  pageSize = 10,
  searchable = true,
  searchPlaceholder = 'Search...',
  striped = false,
  hoverable = true,
  compact = false,
  stickyHeader = false,
  emptyMessage = 'No data available',
  loading = false,
  className,
  tableClassName,
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        if (col.filterable === false) return false;
        const value = getNestedValue(row, col.key as string);
        return String(value ?? '').toLowerCase().includes(query);
      })
    );
  }, [data, search, columns]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = getNestedValue(a, sortKey);
      const bVal = getNestedValue(b, sortKey);
      
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortDir === 'asc' ? 1 : -1;
      if (bVal == null) return sortDir === 'asc' ? -1 : 1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      const cmp = aStr.localeCompare(bStr);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Reset page on search/filter change
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  // Handle sort
  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      if (sortDir === 'asc') {
        setSortDir('desc');
      } else if (sortDir === 'desc') {
        setSortKey(null);
        setSortDir(null);
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setCurrentPage(1);
  }, [sortKey, sortDir]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      {searchable && (
        <div className="relative w-full max-w-sm">
          <Icon
            name="search"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              'w-full pl-9 pr-4 py-2 rounded-lg',
              'bg-surface-elevated border border-border',
              'text-sm text-text-primary placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
              'transition-all duration-200'
            )}
          />
        </div>
      )}

      {/* Table */}
      <div
        className={cn(
          'overflow-x-auto rounded-xl border border-border',
          'bg-surface'
        )}
      >
        <table
          className={cn(
            'w-full border-collapse',
            compact ? 'text-sm' : 'text-sm',
            tableClassName
          )}
        >
          <thead
            className={cn(
              'bg-surface-elevated border-b border-border',
              stickyHeader && 'sticky top-0 z-10'
            )}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ width: col.width }}
                  className={cn(
                    'px-4 font-semibold text-text-secondary',
                    compact ? 'py-2' : 'py-3',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable !== false && 'cursor-pointer select-none',
                    'transition-colors hover:text-text-primary'
                  )}
                  onClick={() =>
                    col.sortable !== false && handleSort(String(col.key))
                  }
                >
                  <div
                    className={cn(
                      'flex items-center gap-1',
                      col.align === 'center' && 'justify-center',
                      col.align === 'right' && 'justify-end'
                    )}
                  >
                    {col.header}
                    {col.sortable !== false && (
                      <SortIcon
                        active={sortKey === String(col.key)}
                        direction={
                          sortKey === String(col.key) ? sortDir : null
                        }
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-12 text-center text-text-muted"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-12 text-center text-text-muted"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => {
                  const actualIndex = (currentPage - 1) * pageSize + rowIndex;
                  return (
                    <motion.tr
                      key={keyExtractor(row, actualIndex)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: rowIndex * 0.02 }}
                      onClick={() => onRowClick?.(row, actualIndex)}
                      className={cn(
                        'border-b border-border/50 last:border-b-0',
                        striped && rowIndex % 2 === 1 && 'bg-surface-elevated/30',
                        hoverable &&
                          'hover:bg-surface-elevated/50 transition-colors',
                        onRowClick && 'cursor-pointer'
                      )}
                    >
                      {columns.map((col) => {
                        const value = getNestedValue(row, String(col.key));
                        return (
                          <td
                            key={String(col.key)}
                            className={cn(
                              'px-4 text-text-primary',
                              compact ? 'py-2' : 'py-3',
                              col.align === 'center' && 'text-center',
                              col.align === 'right' && 'text-right'
                            )}
                          >
                            {col.render
                              ? col.render(value as T[keyof T], row, actualIndex)
                              : String(value ?? '')}
                          </td>
                        );
                      })}
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  if (!active || !direction) {
    return (
      <Icon
        name="unfold_more"
        size={14}
        className="text-text-muted/50"
      />
    );
  }
  return direction === 'asc' ? (
    <Icon name="expand_less" size={14} className="text-primary-400" />
  ) : (
    <Icon name="expand_more" size={14} className="text-primary-400" />
  );
}

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: TablePaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between text-sm text-text-secondary">
      <span>
        Showing {start}–{end} of {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <PaginationButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <Icon name="first_page" size={16} />
        </PaginationButton>
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon name="chevron_left" size={16} />
        </PaginationButton>

        <span className="px-3 py-1.5 text-text-primary">
          {currentPage} / {totalPages}
        </span>

        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Icon name="chevron_right" size={16} />
        </PaginationButton>
        <PaginationButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <Icon name="last_page" size={16} />
        </PaginationButton>
      </div>
    </div>
  );
}

interface PaginationButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
}

function PaginationButton({
  children,
  disabled,
  ...props
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'p-1.5 rounded-md transition-colors',
        disabled
          ? 'text-text-muted/50 cursor-not-allowed'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================================================
// Simple Table
// ============================================================================

export interface SimpleTableProps extends ComponentPropsWithoutRef<'table'> {
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

export function SimpleTable({
  striped = false,
  hoverable = true,
  compact = false,
  className,
  children,
  ...props
}: SimpleTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table
        className={cn('w-full border-collapse text-sm', className)}
        data-striped={striped}
        data-hoverable={hoverable}
        data-compact={compact}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function Thead({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'thead'>) {
  return (
    <thead
      className={cn(
        'bg-surface-elevated border-b border-border',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function Tbody({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'tbody'>) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export function Tr({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'tr'>) {
  return (
    <tr
      className={cn(
        'border-b border-border/50 last:border-b-0',
        'hover:bg-surface-elevated/50 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function Th({
  align = 'left',
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'th'> & { align?: 'left' | 'center' | 'right' }) {
  return (
    <th
      className={cn(
        'px-4 py-3 font-semibold text-text-secondary',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({
  align = 'left',
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'td'> & { align?: 'left' | 'center' | 'right' }) {
  return (
    <td
      className={cn(
        'px-4 py-3 text-text-primary',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

// ============================================================================
// Utilities
// ============================================================================

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
