/**
 * Select Component
 * ================
 * Dropdown select with search, multi-select, and custom styling.
 */

'use client';

import { forwardRef, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  hint?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  maxHeight?: number;
  emptyMessage?: string;
  className?: string;
  containerClassName?: string;
}

const sizeStyles = {
  sm: {
    trigger: 'h-8 text-sm px-3',
    option: 'py-1.5 px-3 text-sm',
    icon: 14,
    label: 'text-xs',
  },
  md: {
    trigger: 'h-10 text-sm px-4',
    option: 'py-2 px-4 text-sm',
    icon: 16,
    label: 'text-sm',
  },
  lg: {
    trigger: 'h-12 text-base px-4',
    option: 'py-2.5 px-4 text-base',
    icon: 18,
    label: 'text-sm',
  },
};

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select...',
      label,
      description,
      error,
      hint,
      multiple = false,
      searchable = false,
      clearable = false,
      disabled = false,
      size = 'md',
      maxHeight = 240,
      emptyMessage = 'No options found',
      className,
      containerClassName,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sizes = sizeStyles[size];
    const hasError = !!error;

    // Normalize value to array for easier handling
    const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

    // Filter options based on search
    const filteredOptions = searchQuery
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    // Get display label
    const displayLabel = selectedValues.length > 0
      ? multiple
        ? selectedValues.length === 1
          ? options.find((o) => o.value === selectedValues[0])?.label
          : `${selectedValues.length} selected`
        : options.find((o) => o.value === selectedValues[0])?.label
      : null;

    // Handle option select
    const handleSelect = (optionValue: string) => {
      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        onChange?.(newValues);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
      }
      setSearchQuery('');
    };

    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(multiple ? [] : '');
    };

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search on open
    useEffect(() => {
      if (isOpen && searchable && searchRef.current) {
        searchRef.current.focus();
      }
    }, [isOpen, searchable]);

    return (
      <div ref={ref} className={cn('w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label className={cn('block font-medium text-text-primary mb-1.5', sizes.label)}>
            {label}
          </label>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-text-muted mb-2">{description}</p>
        )}

        {/* Select Container */}
        <div ref={containerRef} className={cn('relative', className)}>
          {/* Trigger */}
          <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'w-full flex items-center justify-between gap-2 rounded-xl outline-none transition-all duration-200',
              'bg-surface border border-border-subtle',
              'text-left',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
              sizes.trigger,
              hasError && 'border-error focus:border-error focus:ring-error/20',
              isOpen && 'border-primary-500 ring-2 ring-primary-500/20',
              disabled && 'opacity-50 cursor-not-allowed bg-surface-hover'
            )}
          >
            <span className={cn('flex-1 truncate', !displayLabel && 'text-text-muted')}>
              {displayLabel || placeholder}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Error icon */}
              {hasError && <AlertCircle size={sizes.icon} className="text-error" />}

              {/* Clear button */}
              {clearable && selectedValues.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-0.5 text-text-muted hover:text-text-secondary transition-colors"
                >
                  <X size={sizes.icon} />
                </button>
              )}

              {/* Chevron */}
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={sizes.icon} className="text-text-muted" />
              </motion.div>
            </div>
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 w-full mt-1 bg-surface border border-border-subtle rounded-xl shadow-lg overflow-hidden"
              >
                {/* Search */}
                {searchable && (
                  <div className="p-2 border-b border-border-subtle">
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                      />
                      <input
                        ref={searchRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full h-8 pl-9 pr-3 text-sm bg-surface-hover rounded-lg outline-none placeholder:text-text-muted"
                      />
                    </div>
                  </div>
                )}

                {/* Options */}
                <div
                  className="overflow-y-auto"
                  style={{ maxHeight }}
                >
                  {filteredOptions.length === 0 ? (
                    <div className="py-4 text-center text-sm text-text-muted">
                      {emptyMessage}
                    </div>
                  ) : (
                    filteredOptions.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          disabled={option.disabled}
                          onClick={() => handleSelect(option.value)}
                          className={cn(
                            'w-full flex items-center gap-3 transition-colors text-left',
                            sizes.option,
                            'hover:bg-surface-hover',
                            isSelected && 'bg-primary-500/10 text-primary-400',
                            option.disabled && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {/* Checkbox for multi-select */}
                          {multiple && (
                            <div
                              className={cn(
                                'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                                isSelected
                                  ? 'bg-primary-500 border-primary-500'
                                  : 'border-border-default'
                              )}
                            >
                              {isSelected && <Check size={10} className="text-white" />}
                            </div>
                          )}

                          {/* Option icon */}
                          {option.icon && (
                            <span className="flex-shrink-0">{option.icon}</span>
                          )}

                          {/* Option content */}
                          <div className="flex-1 min-w-0">
                            <div className={cn('truncate', isSelected && 'font-medium')}>
                              {option.label}
                            </div>
                            {option.description && (
                              <div className="text-xs text-text-muted truncate">
                                {option.description}
                              </div>
                            )}
                          </div>

                          {/* Check mark for single select */}
                          {!multiple && isSelected && (
                            <Check size={14} className="text-primary-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {(error || hint) && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={cn(
                'text-xs mt-1.5',
                error ? 'text-error' : 'text-text-muted'
              )}
            >
              {error || hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = 'Select';

/**
 * NativeSelect - Lightweight native select for simple use cases
 */
export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      options,
      label,
      error,
      hint,
      disabled,
      containerClassName,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}

        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full h-10 px-4 pr-10 rounded-xl outline-none transition-all duration-200',
            'bg-surface border border-border-subtle appearance-none',
            'text-sm text-text-primary',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            error && 'border-error focus:border-error focus:ring-error/20',
            disabled && 'opacity-50 cursor-not-allowed bg-surface-hover',
            className
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {(error || hint) && (
          <p className={cn('text-xs mt-1.5', error ? 'text-error' : 'text-text-muted')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

NativeSelect.displayName = 'NativeSelect';
