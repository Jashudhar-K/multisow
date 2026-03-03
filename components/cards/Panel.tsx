/**
 * Panel Components
 * ================
 * Collapsible panels and section containers.
 */

'use client';

import { forwardRef, useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Panel Context
// ============================================================================

interface PanelContextValue {
  isOpen: boolean;
  toggle: () => void;
}

const PanelContext = createContext<PanelContextValue | null>(null);

function usePanelContext() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('Panel components must be used within a Panel');
  }
  return context;
}

// ============================================================================
// Panel - Collapsible Container
// ============================================================================

export interface PanelProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}

export function Panel({
  children,
  defaultOpen = true,
  isOpen: controlledOpen,
  onOpenChange,
  className,
}: PanelProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const toggle = () => {
    if (isControlled) {
      onOpenChange?.(!isOpen);
    } else {
      setInternalOpen(!isOpen);
    }
  };

  return (
    <PanelContext.Provider value={{ isOpen, toggle }}>
      <div
        className={cn(
          'rounded-2xl bg-surface border border-border-subtle overflow-hidden',
          className
        )}
      >
        {children}
      </div>
    </PanelContext.Provider>
  );
}

// ============================================================================
// PanelHeader
// ============================================================================

export interface PanelHeaderProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  collapsible?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function PanelHeader({
  children,
  icon: Icon,
  collapsible = true,
  actions,
  className,
}: PanelHeaderProps) {
  const { isOpen, toggle } = usePanelContext();

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-5 py-4 border-b border-border-subtle',
        collapsible && 'cursor-pointer hover:bg-surface-hover transition-colors',
        className
      )}
      onClick={collapsible ? toggle : undefined}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {collapsible && (
          <motion.div
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} className="text-text-muted" />
          </motion.div>
        )}
        {Icon && <Icon size={18} className="text-text-muted flex-shrink-0" />}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PanelTitle
// ============================================================================

export interface PanelTitleProps {
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export function PanelTitle({ children, description, className }: PanelTitleProps) {
  return (
    <div className={cn('truncate', className)}>
      <h3 className="font-semibold text-text-primary truncate">{children}</h3>
      {description && (
        <p className="text-sm text-text-secondary truncate">{description}</p>
      )}
    </div>
  );
}

// ============================================================================
// PanelContent
// ============================================================================

export interface PanelContentProps {
  children: React.ReactNode;
  className?: string;
}

export function PanelContent({ children, className }: PanelContentProps) {
  const { isOpen } = usePanelContext();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <div className={cn('p-5', className)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Section - Simple Section Container
// ============================================================================

export interface SectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  variant?: 'default' | 'card' | 'transparent';
  className?: string;
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  (
    {
      children,
      title,
      description,
      icon: Icon,
      actions,
      variant = 'default',
      className,
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          variant === 'card' && 'rounded-2xl bg-surface border border-border-subtle overflow-hidden',
          variant === 'default' && 'rounded-2xl',
          className
        )}
      >
        {(title || description || actions) && (
          <SectionHeader
            title={title}
            description={description}
            icon={Icon}
            actions={actions}
            variant={variant}
          />
        )}
        <div className={cn(variant === 'card' && 'p-5')}>{children}</div>
      </section>
    );
  }
);

Section.displayName = 'Section';

// ============================================================================
// SectionHeader
// ============================================================================

export interface SectionHeaderProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  variant?: 'default' | 'card' | 'transparent';
  className?: string;
}

export function SectionHeader({
  title,
  description,
  icon: Icon,
  actions,
  variant = 'default',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        variant === 'card' && 'px-5 py-4 border-b border-border-subtle',
        variant === 'default' && 'mb-4',
        className
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="p-2 rounded-lg bg-primary-500/15 text-primary-400 flex-shrink-0">
            <Icon size={18} />
          </div>
        )}
        <div className="min-w-0">
          {title && (
            <h3 className="font-semibold text-text-primary">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-text-secondary mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

// ============================================================================
// Divider
// ============================================================================

export interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>
    );
  }

  return <div className={cn('h-px bg-border-subtle', className)} />;
}

// ============================================================================
// Accordion - Multiple Collapsible Panels
// ============================================================================

export interface AccordionItem {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  className?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className,
}: AccordionProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = expanded.has(item.id);
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="rounded-xl bg-surface border border-border-subtle overflow-hidden"
          >
            <button
              onClick={() => toggle(item.id)}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-surface-hover transition-colors"
            >
              <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.15 }}>
                <ChevronRight size={16} className="text-text-muted" />
              </motion.div>
              {Icon && <Icon size={18} className="text-text-muted flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-text-primary text-sm">{item.title}</div>
                {item.description && (
                  <div className="text-xs text-text-secondary truncate">{item.description}</div>
                )}
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 text-sm text-text-secondary">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
