/**
 * Accessibility Utilities
 * ========================
 * Components and hooks for enhanced accessibility.
 */

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  ComponentPropsWithoutRef,
  forwardRef,
  useId,
} from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Motion Preferences Context
// ============================================================================

interface MotionPreferencesContextValue {
  prefersReducedMotion: boolean;
}

const MotionPreferencesContext = createContext<MotionPreferencesContextValue>({
  prefersReducedMotion: false,
});

export function useMotionPreferences() {
  return useContext(MotionPreferencesContext);
}

export function MotionPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <MotionPreferencesContext.Provider value={{ prefersReducedMotion }}>
      {children}
    </MotionPreferencesContext.Provider>
  );
}

// ============================================================================
// SkipLink
// ============================================================================

export interface SkipLinkProps extends ComponentPropsWithoutRef<'a'> {
  targetId?: string;
}

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ targetId = 'main-content', className, children = 'Skip to main content', ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={`#${targetId}`}
        className={cn(
          'sr-only focus:not-sr-only',
          'focus:fixed focus:top-4 focus:left-4 focus:z-max',
          'focus:px-4 focus:py-2 focus:rounded-lg',
          'focus:bg-primary-500 focus:text-white',
          'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
          'font-medium text-sm',
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

SkipLink.displayName = 'SkipLink';

// ============================================================================
// VisuallyHidden
// ============================================================================

export interface VisuallyHiddenProps extends ComponentPropsWithoutRef<'span'> {
  as?: 'span' | 'div';
}

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as: Component = 'span', className, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn('sr-only', className)}
        {...props}
      />
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';

// ============================================================================
// FocusTrap
// ============================================================================

export interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  className?: string;
}

export function FocusTrap({ children, active = true, className }: FocusTrapProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!active || !container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active, container]);

  return (
    <div ref={setContainer} className={className}>
      {children}
    </div>
  );
}

// ============================================================================
// Announce
// ============================================================================

export interface AnnounceProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export function Announce({ message, politeness = 'polite' }: AnnounceProps) {
  const [announced, setAnnounced] = useState('');

  useEffect(() => {
    // Delay to ensure the live region is ready
    const timer = setTimeout(() => {
      setAnnounced(message);
    }, 100);

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announced}
    </div>
  );
}

// ============================================================================
// useAnnounce Hook
// ============================================================================

export function useAnnounce() {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState(0);

  const announce = (text: string) => {
    setMessage(text);
    setKey((k) => k + 1);
  };

  const AnnouncerComponent = () => (
    <Announce key={key} message={message} />
  );

  return { announce, Announcer: AnnouncerComponent };
}

// ============================================================================
// FormError
// ============================================================================

export interface FormErrorProps extends ComponentPropsWithoutRef<'p'> {
  id?: string;
}

export const FormError = forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ id, className, children, ...props }, ref) => {
    const generatedId = useId();
    
    if (!children) return null;

    return (
      <p
        ref={ref}
        id={id || generatedId}
        role="alert"
        aria-live="polite"
        className={cn('text-sm text-error mt-1', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

FormError.displayName = 'FormError';

// ============================================================================
// KeyboardShortcut
// ============================================================================

export interface KeyboardShortcutProps {
  keys: string[];
  onTrigger: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcut({
  keys,
  onTrigger,
  disabled = false,
}: KeyboardShortcutProps) {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedKeys = new Set<string>();
      
      if (e.metaKey || e.ctrlKey) pressedKeys.add('mod');
      if (e.shiftKey) pressedKeys.add('shift');
      if (e.altKey) pressedKeys.add('alt');
      pressedKeys.add(e.key.toLowerCase());

      const normalizedKeys = keys.map((k) => k.toLowerCase());
      const allKeysPressed = normalizedKeys.every((k) => pressedKeys.has(k));

      if (allKeysPressed && pressedKeys.size === normalizedKeys.length) {
        e.preventDefault();
        onTrigger();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, onTrigger, disabled]);
}

// ============================================================================
// Focus Ring Helper
// ============================================================================

export const focusRingClasses = cn(
  'focus:outline-none',
  'focus-visible:ring-2 focus-visible:ring-primary-500/50',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background'
);

// ============================================================================
// Exports for index
// ============================================================================

export const a11y = {
  SkipLink,
  VisuallyHidden,
  FocusTrap,
  Announce,
  FormError,
  useAnnounce,
  useKeyboardShortcut,
  useMotionPreferences,
  MotionPreferencesProvider,
  focusRingClasses,
};
