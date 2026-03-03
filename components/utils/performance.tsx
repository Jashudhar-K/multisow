/**
 * Performance Utilities
 * ======================
 * Lazy loading, memoization, and optimization helpers.
 */

'use client';

import {
  lazy,
  Suspense,
  ComponentType,
  ReactNode,
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import dynamic from 'next/dynamic';

// ============================================================================
// Lazy Component Wrapper
// ============================================================================

export interface LazyComponentOptions {
  fallback?: ReactNode;
  ssr?: boolean;
}

/**
 * Create a lazy-loaded component with suspense boundary
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentOptions = {}
) {
  const { fallback = null, ssr = false } = options;
  
  if (ssr) {
    return dynamic(importFn, {
      loading: () => <>{fallback}</>,
      ssr: true,
    });
  }

  const LazyComponent = lazy(importFn);

  return function WrappedLazyComponent(props: P) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// ============================================================================
// Intersection Observer Hook
// ============================================================================

export interface UseIntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersection<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionOptions = {}
) {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isNowIntersecting = entry.isIntersecting;
        setIsIntersecting(isNowIntersecting);
        
        if (isNowIntersecting && triggerOnce) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref: elementRef, isIntersecting: isIntersecting || hasTriggered };
}

// ============================================================================
// Lazy Image Component
// ============================================================================

export interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderClassName?: string;
  threshold?: number;
}

export const LazyImage = memo(function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  placeholderClassName,
  threshold = 0.1,
}: LazyImageProps) {
  const { ref, isIntersecting } = useIntersection<HTMLDivElement>({
    threshold,
    triggerOnce: true,
    rootMargin: '50px',
  });
  const [loaded, setLoaded] = useState(false);

  return (
    <div ref={ref} className={className} style={{ width, height }}>
      {isIntersecting ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setLoaded(true)}
          className={`transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div
          className={placeholderClassName || 'bg-surface-elevated animate-pulse w-full h-full'}
          style={{ width, height }}
        />
      )}
    </div>
  );
});

// ============================================================================
// Debounce Hook
// ============================================================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// Throttle Hook
// ============================================================================

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastExecuted.current;

    if (elapsed >= interval) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      const timeoutId = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, interval - elapsed);

      return () => clearTimeout(timeoutId);
    }
  }, [value, interval]);

  return throttledValue;
}

// ============================================================================
// Debounced Callback Hook
// ============================================================================

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );
}

// ============================================================================
// RAF Hook (Request Animation Frame)
// ============================================================================

export function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
}

// ============================================================================
// Idle Callback Hook
// ============================================================================

export function useIdleCallback(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
) {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(callback, options);
      return () => cancelIdleCallback(id);
    } else {
      // Fallback for Safari
      const id = setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline), 1);
      return () => clearTimeout(id);
    }
  }, [callback, options]);
}

// ============================================================================
// Preload Resources
// ============================================================================

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

// ============================================================================
// Virtual List Hook (for large lists)
// ============================================================================

export interface UseVirtualListOptions {
  itemHeight: number;
  overscan?: number;
}

export function useVirtualList<T>(
  items: T[],
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseVirtualListOptions
) {
  const { itemHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => setScrollTop(container.scrollTop);
    const handleResize = () => setContainerHeight(container.clientHeight);

    handleResize();
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef]);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    item,
    index: startIndex + index,
    style: {
      position: 'absolute' as const,
      top: (startIndex + index) * itemHeight,
      height: itemHeight,
      left: 0,
      right: 0,
    },
  }));

  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    startIndex,
    endIndex,
  };
}
