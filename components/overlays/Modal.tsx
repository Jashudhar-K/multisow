/**
 * Modal Component
 * ================
 * Accessible modal with animations and backdrop.
 */

'use client';

import { forwardRef, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

// ============================================================================
// Modal Context
// ============================================================================

interface ModalContextValue {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within a Modal');
  }
  return context;
}

// ============================================================================
// useModal Hook
// ============================================================================

export function useModal(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle, setIsOpen };
}

import { useState } from 'react';

// ============================================================================
// Modal
// ============================================================================

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  centered?: boolean;
  className?: string;
  overlayClassName?: string;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[90vw] max-h-[90vh]',
};

export function Modal({
  children,
  isOpen,
  onClose,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  centered = true,
  className,
  overlayClassName,
}: ModalProps) {
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

  // Prevent body scroll when modal is open
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
        <ModalContext.Provider value={{ onClose }}>
          {/* Backdrop */}
          <motion.div
            className={cn(
              'fixed inset-0 z-modal bg-black/60 backdrop-blur-sm',
              centered && 'flex items-center justify-center p-4',
              overlayClassName
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
          >
            {/* Modal Content */}
            <motion.div
              className={cn(
                'relative w-full bg-surface rounded-2xl shadow-2xl border border-border-subtle overflow-hidden',
                sizeStyles[size],
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {/* Close button */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              )}

              {children}
            </motion.div>
          </motion.div>
        </ModalContext.Provider>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ============================================================================
// ModalHeader
// ============================================================================

export interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-border-subtle', className)}>
      {children}
    </div>
  );
}

// ============================================================================
// ModalTitle
// ============================================================================

export interface ModalTitleProps {
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export function ModalTitle({ children, description, className }: ModalTitleProps) {
  return (
    <div className={cn('pr-8', className)}>
      <h2 className="text-lg font-semibold text-text-primary">{children}</h2>
      {description && (
        <p className="text-sm text-text-secondary mt-1">{description}</p>
      )}
    </div>
  );
}

// ============================================================================
// ModalBody
// ============================================================================

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn('px-6 py-4 overflow-y-auto max-h-[60vh]', className)}>
      {children}
    </div>
  );
}

// ============================================================================
// ModalFooter
// ============================================================================

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
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
// ConfirmDialog - Simplified confirmation modal
// ============================================================================

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <ModalBody>
        <div className="text-center py-2">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>
      </ModalBody>
      <ModalFooter className="justify-center">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
          disabled={loading}
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            variant === 'danger'
              ? 'bg-error text-white hover:bg-red-600'
              : 'bg-primary-500 text-white hover:bg-primary-600',
            loading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {loading ? 'Loading...' : confirmLabel}
        </button>
      </ModalFooter>
    </Modal>
  );
}

// ============================================================================
// AlertDialog - For important alerts
// ============================================================================

export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  actionLabel?: string;
}

const alertIcons = {
  info: '💡',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

export function AlertDialog({
  isOpen,
  onClose,
  title,
  description,
  type = 'info',
  actionLabel = 'Got it',
}: AlertDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <ModalBody>
        <div className="text-center py-4">
          <div className="text-4xl mb-4">{alertIcons[type]}</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>
      </ModalBody>
      <ModalFooter className="justify-center border-t-0 pt-0">
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          {actionLabel}
        </button>
      </ModalFooter>
    </Modal>
  );
}
