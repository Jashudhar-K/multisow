/**
 * Image Optimization Utilities
 * =============================
 * Next.js Image component wrappers and optimization helpers.
 */

'use client';

import Image, { ImageProps } from 'next/image';
import { memo, useState, forwardRef, ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Optimized Image Component
// ============================================================================

export interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
  /**
   * Enable blur-up placeholder effect
   */
  blur?: boolean;
  /**
   * Custom blur data URL (base64)
   */
  blurDataURL?: string;
  /**
   * Wrapper className
   */
  wrapperClassName?: string;
  /**
   * Show loading skeleton
   */
  showSkeleton?: boolean;
}

export const OptimizedImage = memo(
  forwardRef<HTMLImageElement, OptimizedImageProps>(
    function OptimizedImage(
      {
        blur = true,
        blurDataURL,
        wrapperClassName,
        showSkeleton = true,
        className,
        onLoad,
        ...props
      },
      ref
    ) {
      const [isLoaded, setIsLoaded] = useState(false);

      // Default blur placeholder for when no blurDataURL is provided
      const defaultBlur =
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAyNjIwIi8+PC9zdmc+';

      return (
        <div className={cn('relative overflow-hidden', wrapperClassName)}>
          {showSkeleton && !isLoaded && (
            <div className="absolute inset-0 bg-surface-elevated animate-pulse" />
          )}
          <Image
            ref={ref}
            placeholder={blur ? 'blur' : 'empty'}
            blurDataURL={blurDataURL || defaultBlur}
            className={cn(
              'transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              className
            )}
            onLoad={e => {
              setIsLoaded(true);
              onLoad?.(e);
            }}
            {...props}
          />
        </div>
      );
    }
  )
);

// ============================================================================
// Aspect Ratio Image
// ============================================================================

export interface AspectRatioImageProps extends Omit<OptimizedImageProps, 'fill'> {
  /**
   * Aspect ratio (e.g., 16/9, 4/3, 1)
   */
  aspectRatio: number;
}

export const AspectRatioImage = memo(function AspectRatioImage({
  aspectRatio,
  wrapperClassName,
  ...props
}: AspectRatioImageProps) {
  return (
    <div
      className={cn('relative w-full', wrapperClassName)}
      style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
    >
      <OptimizedImage className="object-cover" fill {...props} wrapperClassName="absolute inset-0" />
    </div>
  );
});

// ============================================================================
// Background Image
// ============================================================================

export interface BackgroundImageProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Image source
   */
  src: string;
  /**
   * Image alt text (for SEO)
   */
  alt: string;
  /**
   * Overlay color/gradient
   */
  overlay?: string;
  /**
   * Image priority loading
   */
  priority?: boolean;
}

export const BackgroundImage = memo(
  forwardRef<HTMLDivElement, BackgroundImageProps>(
    function BackgroundImage(
      { src, alt, overlay, priority = false, className, children, ...props },
      ref
    ) {
      return (
        <div ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
          <OptimizedImage
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
            showSkeleton={false}
          />
          {overlay && (
            <div
              className="absolute inset-0"
              style={{ background: overlay }}
            />
          )}
          <div className="relative z-10">{children}</div>
        </div>
      );
    }
  )
);

// ============================================================================
// Thumbnail Image
// ============================================================================

export interface ThumbnailProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const thumbnailSizes = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const Thumbnail = memo(function Thumbnail({
  src,
  alt,
  size = 'md',
  rounded = 'md',
  className,
}: ThumbnailProps) {
  const dimension = thumbnailSizes[size];

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-surface-elevated',
        roundedClasses[rounded],
        className
      )}
      style={{ width: dimension, height: dimension }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={dimension}
        height={dimension}
        className="object-cover"
        showSkeleton
      />
    </div>
  );
});

// ============================================================================
// Avatar Image
// ============================================================================

export interface AvatarImageProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const avatarSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 96,
};

export const AvatarImage = memo(function AvatarImage({
  src,
  alt,
  fallback,
  size = 'md',
  className,
}: AvatarImageProps) {
  const dimension = avatarSizes[size];
  const initials = fallback || alt.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full bg-surface-elevated flex items-center justify-center',
        className
      )}
      style={{ width: dimension, height: dimension }}
    >
      {src ? (
        <OptimizedImage
          src={src}
          alt={alt}
          width={dimension}
          height={dimension}
          className="object-cover rounded-full"
          showSkeleton
        />
      ) : (
        <span
          className="text-text-secondary font-medium"
          style={{ fontSize: dimension * 0.4 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
});

// ============================================================================
// Image Gallery Item
// ============================================================================

export interface GalleryImageProps {
  src: string;
  alt: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export const GalleryImage = memo(function GalleryImage({
  src,
  alt,
  onClick,
  selected = false,
  className,
}: GalleryImageProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative aspect-square overflow-hidden rounded-lg',
        'ring-2 transition-all duration-200',
        selected
          ? 'ring-success ring-offset-2 ring-offset-background'
          : 'ring-transparent hover:ring-border-subtle',
        className
      )}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-200 hover:scale-105"
        showSkeleton
      />
    </button>
  );
});
