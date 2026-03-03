/**
 * Memoization Utilities
 * ======================
 * React.memo patterns and higher-order components for performance.
 */

'use client';

import {
  memo,
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
  ComponentType,
  ReactNode,
  DependencyList,
} from 'react';

// ============================================================================
// Memoized Wrapper HOC
// ============================================================================

/**
 * Create a memoized version of a component with custom comparison.
 * Useful for components receiving complex objects as props.
 */
export function memoWithCompare<P extends object>(
  Component: ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
) {
  return memo(Component, propsAreEqual);
}

/**
 * Create a memoized component that only re-renders when specified props change.
 */
export function memoWithKeys<P extends object>(
  Component: ComponentType<P>,
  keys: (keyof P)[]
) {
  return memo(Component, (prevProps, nextProps) => {
    return keys.every(key => prevProps[key] === nextProps[key]);
  });
}

// ============================================================================
// usePrevious Hook
// ============================================================================

/**
 * Get the previous value of a state or prop.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// ============================================================================
// useStableCallback Hook
// ============================================================================

/**
 * Create a stable callback that always references the latest function.
 * Useful for callbacks passed to memoized children.
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args) => callbackRef.current(...args)) as T,
    []
  );
}

// ============================================================================
// useMemoCompare Hook
// ============================================================================

/**
 * Memoize a value with custom comparison function.
 */
export function useMemoCompare<T>(
  next: T,
  compare: (prev: T | undefined, next: T) => boolean
): T {
  const previousRef = useRef<T | undefined>(undefined);
  const previous = previousRef.current;

  const isEqual = previous !== undefined && compare(previous, next);

  useEffect(() => {
    if (!isEqual) {
      previousRef.current = next;
    }
  });

  return isEqual && previous !== undefined ? previous : next;
}

// ============================================================================
// useDeepMemo Hook
// ============================================================================

/**
 * Deep comparison memoization for objects and arrays.
 */
export function useDeepMemo<T>(value: T): T {
  return useMemoCompare(value, (prev, next) => {
    return JSON.stringify(prev) === JSON.stringify(next);
  });
}

// ============================================================================
// useLazyValue Hook
// ============================================================================

/**
 * Compute a value lazily only once.
 */
export function useLazyValue<T>(factory: () => T): T {
  const ref = useRef<{ value: T; initialized: boolean }>({
    value: undefined as unknown as T,
    initialized: false,
  });

  if (!ref.current.initialized) {
    ref.current.value = factory();
    ref.current.initialized = true;
  }

  return ref.current.value;
}

// ============================================================================
// useConst Hook
// ============================================================================

/**
 * Initialize a constant value that never changes.
 */
export function useConst<T>(initialValue: T | (() => T)): T {
  const ref = useRef<{ value: T; initialized: boolean }>({
    value: undefined as unknown as T,
    initialized: false,
  });

  if (!ref.current.initialized) {
    ref.current.value =
      typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    ref.current.initialized = true;
  }

  return ref.current.value;
}

// ============================================================================
// useComputed Hook
// ============================================================================

/**
 * Memoized computation with explicit dependencies.
 * A clearer alternative to useMemo for computed values.
 */
export function useComputed<T>(
  compute: () => T,
  deps: DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(compute, deps);
}

// ============================================================================
// useExpensiveValue Hook
// ============================================================================

/**
 * Defer expensive computation to avoid blocking render.
 * Returns undefined initially, then the computed value.
 */
export function useExpensiveValue<T>(
  compute: () => T,
  deps: DependencyList
): T | undefined {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    // Use requestIdleCallback for non-critical computation
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => {
        setValue(compute());
      });
      return () => cancelIdleCallback(id);
    } else {
      // Fallback
      const id = setTimeout(() => setValue(compute()), 0);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return value;
}

// ============================================================================
// Memoized List Component
// ============================================================================

export interface MemoizedListProps<T> {
  items: T[];
  keyExtractor: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}

function MemoizedListInner<T>({
  items,
  keyExtractor,
  renderItem,
  className,
}: MemoizedListProps<T>) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <MemoizedListItem key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </MemoizedListItem>
      ))}
    </div>
  );
}

const MemoizedListItem = memo(function MemoizedListItem({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
});

export const MemoizedList = memo(MemoizedListInner) as typeof MemoizedListInner;

// ============================================================================
// Render When Visible
// ============================================================================

export interface RenderWhenVisibleProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export const RenderWhenVisible = memo(function RenderWhenVisible({
  children,
  fallback = null,
  rootMargin = '100px',
  threshold = 0,
}: RenderWhenVisibleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
});

// ============================================================================
// Batch Updates Helper
// ============================================================================

/**
 * Batch multiple state updates to reduce re-renders.
 * React 18+ does this automatically, but useful for callbacks.
 */
export function batchUpdates(callback: () => void): void {
  // React 18+ handles batching automatically
  callback();
}
