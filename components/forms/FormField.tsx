/**
 * FormField Component
 * ===================
 * Wrapper for form fields with consistent label, description, and error handling.
 */

'use client';

import { forwardRef, createContext, useContext, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';

// ============================================================================
// FormField Context
// ============================================================================

interface FormFieldContextValue {
  id: string;
  hasError: boolean;
  disabled: boolean;
  required: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export function useFormField() {
  const context = useContext(FormFieldContext);
  return context;
}

// ============================================================================
// FormField
// ============================================================================

export interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
  hint?: string;
  tooltip?: string;
  required?: boolean;
  disabled?: boolean;
  horizontal?: boolean;
  labelWidth?: string;
  className?: string;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      children,
      label,
      description,
      error,
      hint,
      tooltip,
      required = false,
      disabled = false,
      horizontal = false,
      labelWidth = '120px',
      className,
    },
    ref
  ) => {
    const id = useId();
    const hasError = !!error;

    return (
      <FormFieldContext.Provider value={{ id, hasError, disabled, required }}>
        <div
          ref={ref}
          className={cn(
            'w-full',
            horizontal && 'flex items-start gap-4',
            className
          )}
        >
          {/* Label Section */}
          {label && (
            <div
              className={cn(
                'flex-shrink-0',
                horizontal ? 'pt-2' : 'mb-1.5'
              )}
              style={horizontal ? { width: labelWidth } : undefined}
            >
              <label
                htmlFor={id}
                className="flex items-center gap-1.5 text-sm font-medium text-text-primary"
              >
                {label}
                {required && <span className="text-error">*</span>}
                {tooltip && (
                  <div className="group relative">
                    <Icon
                      name="help"
                      size={14}
                      className="text-text-muted cursor-help"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-inverse text-text-inverse text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                      {tooltip}
                    </div>
                  </div>
                )}
              </label>
              {description && horizontal && (
                <p className="text-xs text-text-muted mt-0.5">{description}</p>
              )}
            </div>
          )}

          {/* Input Section */}
          <div className={cn('flex-1', horizontal && 'min-w-0')}>
            {description && !horizontal && (
              <p className="text-xs text-text-muted mb-2">{description}</p>
            )}

            {children}

            {/* Messages */}
            <AnimatePresence mode="wait">
              {(error || hint) && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className={cn(
                    'flex items-start gap-1.5 text-xs mt-1.5',
                    error ? 'text-error' : 'text-text-muted'
                  )}
                >
                  {error && <Icon name="error" size={12} className="mt-0.5 flex-shrink-0" />}
                  <span>{error || hint}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </FormFieldContext.Provider>
    );
  }
);

FormField.displayName = 'FormField';

// ============================================================================
// FormSection - Group related fields
// ============================================================================

export interface FormSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export function FormSection({
  children,
  title,
  description,
  className,
}: FormSectionProps) {
  return (
    <fieldset className={cn('w-full', className)}>
      {(title || description) && (
        <div className="mb-4 pb-3 border-b border-border-subtle">
          {title && (
            <legend className="text-base font-semibold text-text-primary">
              {title}
            </legend>
          )}
          {description && (
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

// ============================================================================
// FormActions - Footer with submit/cancel buttons
// ============================================================================

export interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
  className?: string;
}

export function FormActions({ children, align = 'right', className }: FormActionsProps) {
  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 pt-4 border-t border-border-subtle',
        alignStyles[align],
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// FormRow - Horizontal layout for multiple fields
// ============================================================================

export interface FormRowProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FormRow({ children, columns = 2, gap = 'md', className }: FormRowProps) {
  const colStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const gapStyles = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={cn('grid', colStyles[columns], gapStyles[gap], className)}>
      {children}
    </div>
  );
}

// ============================================================================
// Form - Root form wrapper
// ============================================================================

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  spacing?: 'compact' | 'normal' | 'relaxed';
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, spacing = 'normal', className, ...props }, ref) => {
    const spacingStyles = {
      compact: 'space-y-3',
      normal: 'space-y-4',
      relaxed: 'space-y-6',
    };

    return (
      <form
        ref={ref}
        className={cn(spacingStyles[spacing], className)}
        {...props}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';
