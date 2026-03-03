/**
 * Toast & Notification System
 * ============================
 * Global toast notifications with animations.
 */

'use client';

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

// ============================================================================
// Types
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastOptions extends Omit<Toast, 'id'> {}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: ToastOptions) => string;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
}

// ============================================================================
// Context
// ============================================================================

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ============================================================================
// Provider
// ============================================================================

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
  defaultDuration?: number;
}

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
  defaultDuration = 5000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addToast = useCallback(
    (options: ToastOptions): string => {
      const id = Math.random().toString(36).slice(2, 9);
      const toast: Toast = {
        ...options,
        id,
        duration: options.duration ?? defaultDuration,
      };

      setToasts((prev) => {
        const newToasts = [toast, ...prev];
        return newToasts.slice(0, maxToasts);
      });

      return id;
    },
    [defaultDuration, maxToasts]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'success', title, description }),
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'error', title, description }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'warning', title, description }),
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'info', title, description }),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
      {mounted && (
        <ToastContainer
          toasts={toasts}
          position={position}
          onRemove={removeToast}
        />
      )}
    </ToastContext.Provider>
  );
}

// ============================================================================
// Toast Container
// ============================================================================

interface ToastContainerProps {
  toasts: Toast[];
  position: ToastPosition;
  onRemove: (id: string) => void;
}

const positionStyles: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

const slideDirections = {
  'top-right': {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  'top-left': {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
  'top-center': {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  'bottom-right': {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  'bottom-left': {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
  'bottom-center': {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
} as const;

function ToastContainer({ toasts, position, onRemove }: ToastContainerProps) {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      className={cn(
        'fixed z-toast flex flex-col gap-2 pointer-events-none',
        positionStyles[position]
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            position={position}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

// ============================================================================
// Toast Item
// ============================================================================

interface ToastItemProps {
  toast: Toast;
  position: ToastPosition;
  onRemove: (id: string) => void;
}

const typeStyles = {
  success: {
    bg: 'bg-success/15 border-success/30',
    icon: CheckCircle,
    iconColor: 'text-success',
  },
  error: {
    bg: 'bg-error/15 border-error/30',
    icon: AlertCircle,
    iconColor: 'text-error',
  },
  warning: {
    bg: 'bg-warning/15 border-warning/30',
    icon: AlertTriangle,
    iconColor: 'text-warning',
  },
  info: {
    bg: 'bg-primary-500/15 border-primary-500/30',
    icon: Info,
    iconColor: 'text-primary-400',
  },
};

function ToastItem({ toast, position, onRemove }: ToastItemProps) {
  const { type, title, description, duration, action } = toast;
  const styles = typeStyles[type];
  const Icon = styles.icon;
  const animation = slideDirections[position];

  // Auto-dismiss
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => onRemove(toast.id), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, toast.id, onRemove]);

  return (
    <motion.div
      layout
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'pointer-events-auto w-80 max-w-[calc(100vw-2rem)]',
        'bg-surface/95 backdrop-blur-xl border rounded-xl shadow-lg',
        'overflow-hidden',
        styles.bg
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={cn('flex-shrink-0 mt-0.5', styles.iconColor)}>
          <Icon size={18} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">{title}</p>
          {description && (
            <p className="text-sm text-text-secondary mt-0.5">{description}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-primary-400 hover:text-primary-300 mt-2 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close */}
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 p-1 text-text-muted hover:text-text-primary rounded transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      {duration && duration > 0 && (
        <motion.div
          className={cn('h-0.5', styles.iconColor.replace('text-', 'bg-'))}
          initial={{ width: '100%' }}
          animate={{ width: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
}

// ============================================================================
// Standalone Toast Function
// ============================================================================

let toastFn: ToastContextValue | null = null;

export function setToastRef(ref: ToastContextValue) {
  toastFn = ref;
}

export const toast = {
  success: (title: string, description?: string) => toastFn?.success(title, description),
  error: (title: string, description?: string) => toastFn?.error(title, description),
  warning: (title: string, description?: string) => toastFn?.warning(title, description),
  info: (title: string, description?: string) => toastFn?.info(title, description),
  custom: (options: ToastOptions) => toastFn?.addToast(options),
  dismiss: (id: string) => toastFn?.removeToast(id),
};
