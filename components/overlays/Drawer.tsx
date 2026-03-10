/**
 * Drawer Component
 * =================
 * Slide-out panel from any edge of the screen.
 */

'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';
import { createPortal } from 'react-dom';

// ============================================================================
// useDrawer Hook
// ============================================================================

export function useDrawer(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle, setIsOpen };
}

// ============================================================================
// Drawer
// ============================================================================

export interface DrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  hasBackdrop?: boolean;
  className?: string;
  overlayClassName?: string;
}

const sizeStyles = {
  left: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[480px]',
    full: 'w-full',
  },
  right: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[480px]',
    full: 'w-full',
  },
  top: {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
    xl: 'h-96',
    full: 'h-full',
  },
  bottom: {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
    xl: 'h-96',
    full: 'h-full',
  },
};

const positionStyles = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
};

const slideVariants = {
  left: {
    hidden: { x: '-100%' },
    visible: { x: 0 },
  },
  right: {
    hidden: { x: '100%' },
    visible: { x: 0 },
  },
  top: {
    hidden: { y: '-100%' },
    visible: { y: 0 },
  },
  bottom: {
    hidden: { y: '100%' },
    visible: { y: 0 },
  },
};

export function Drawer({
  children,
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  hasBackdrop = true,
  className,
  overlayClassName,
}: DrawerProps) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Don't render on server
  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {hasBackdrop && (
            <motion.div
              className={cn(
                'fixed inset-0 z-drawer bg-black/60 backdrop-blur-sm',
                overlayClassName
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeOnBackdrop ? onClose : undefined}
            />
          )}

          {/* Drawer Content */}
          <motion.div
            className={cn(
              'fixed z-drawer bg-surface shadow-2xl border-border-subtle overflow-hidden',
              positionStyles[position],
              sizeStyles[position][size],
              (position === 'left' || position === 'right') && 'border-x',
              (position === 'top' || position === 'bottom') && 'border-y',
              className
            )}
            variants={slideVariants[position]}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                aria-label="Close drawer"
              >
                <Icon name="close" size={18} />
              </button>
            )}

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ============================================================================
// DrawerHeader
// ============================================================================

export interface DrawerHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function DrawerHeader({ children, className }: DrawerHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-border-subtle', className)}>
      {children}
    </div>
  );
}

// ============================================================================
// DrawerTitle
// ============================================================================

export interface DrawerTitleProps {
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export function DrawerTitle({ children, description, className }: DrawerTitleProps) {
  return (
    <div className={cn('pr-10', className)}>
      <h2 className="text-lg font-semibold text-text-primary">{children}</h2>
      {description && (
        <p className="text-sm text-text-secondary mt-1">{description}</p>
      )}
    </div>
  );
}

// ============================================================================
// DrawerBody
// ============================================================================

export interface DrawerBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function DrawerBody({ children, className }: DrawerBodyProps) {
  return (
    <div className={cn('flex-1 overflow-y-auto px-6 py-4', className)}>
      {children}
    </div>
  );
}

// ============================================================================
// DrawerFooter
// ============================================================================

export interface DrawerFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DrawerFooter({ children, className }: DrawerFooterProps) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-border-subtle flex items-center justify-end gap-3',
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// SheetDrawer - Bottom sheet with drag handle
// ============================================================================

export interface SheetDrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: number[];
  className?: string;
}

export function SheetDrawer({
  children,
  isOpen,
  onClose,
  className,
}: SheetDrawerProps) {
  // Don't render on server
  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-drawer bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className={cn(
              'fixed bottom-0 left-0 right-0 z-drawer',
              'bg-surface rounded-t-3xl shadow-2xl',
              'max-h-[90vh] overflow-hidden',
              className
            )}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-border-default" />
            </div>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
