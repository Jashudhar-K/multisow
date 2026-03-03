/**
 * Utility Components
 * ===================
 * Accessibility, motion, and helper utilities.
 */

export {
  // Motion Preferences
  MotionPreferencesProvider,
  useMotionPreferences,
  // Skip Link
  SkipLink,
  type SkipLinkProps,
  // Visually Hidden
  VisuallyHidden,
  type VisuallyHiddenProps,
  // Focus Trap
  FocusTrap,
  type FocusTrapProps,
  // Announcements
  Announce,
  useAnnounce,
  type AnnounceProps,
  // Form Error
  FormError,
  type FormErrorProps,
  // Keyboard Shortcuts
  useKeyboardShortcut,
  type KeyboardShortcutProps,
  // Focus Ring Classes
  focusRingClasses,
  // Grouped Export
  a11y,
} from './accessibility';

export {
  // Lazy Loading
  createLazyComponent,
  type LazyComponentOptions,
  // Intersection Observer
  useIntersection,
  type UseIntersectionOptions,
  // Lazy Image
  LazyImage,
  type LazyImageProps,
  // Debounce & Throttle
  useDebounce,
  useThrottle,
  useDebouncedCallback,
  // Animation Frame
  useAnimationFrame,
  // Idle Callback
  useIdleCallback,
  // Preloading
  preloadImage,
  preloadImages,
  // Virtual List
  useVirtualList,
  type UseVirtualListOptions,
} from './performance';

export {
  // Optimized Image
  OptimizedImage,
  type OptimizedImageProps,
  // Aspect Ratio Image
  AspectRatioImage,
  type AspectRatioImageProps,
  // Background Image
  BackgroundImage,
  type BackgroundImageProps,
  // Thumbnail
  Thumbnail,
  type ThumbnailProps,
  // Avatar
  AvatarImage,
  type AvatarImageProps,
  // Gallery Image
  GalleryImage,
  type GalleryImageProps,
} from './image';

export {
  // Memoization HOCs
  memoWithCompare,
  memoWithKeys,
  // Hooks
  usePrevious,
  useStableCallback,
  useMemoCompare,
  useDeepMemo,
  useLazyValue,
  useConst,
  useComputed,
  useExpensiveValue,
  // Components
  MemoizedList,
  type MemoizedListProps,
  RenderWhenVisible,
  type RenderWhenVisibleProps,
  // Utilities
  batchUpdates,
} from './memoize';
