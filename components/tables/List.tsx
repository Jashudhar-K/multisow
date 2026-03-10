/**
 * List Components
 * ================
 * Versatile list and list item components.
 */

'use client';

import {
  ReactNode,
  ComponentPropsWithoutRef,
  forwardRef,
  createContext,
  useContext,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';

// ============================================================================
// Context
// ============================================================================

interface ListContextValue {
  variant: 'default' | 'bordered' | 'divided';
  interactive: boolean;
}

const ListContext = createContext<ListContextValue>({
  variant: 'default',
  interactive: false,
});

// ============================================================================
// List
// ============================================================================

export type ListVariant = 'default' | 'bordered' | 'divided';

export interface ListProps extends ComponentPropsWithoutRef<'ul'> {
  variant?: ListVariant;
  interactive?: boolean;
  animate?: boolean;
  children: ReactNode;
}

const listVariantStyles: Record<ListVariant, string> = {
  default: '',
  bordered: 'border border-border rounded-xl overflow-hidden',
  divided: 'divide-y divide-border',
};

export const List = forwardRef<HTMLUListElement, ListProps>(
  (
    {
      variant = 'default',
      interactive = false,
      animate = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <ListContext.Provider value={{ variant, interactive }}>
        <ul
          ref={ref}
          className={cn('space-y-0', listVariantStyles[variant], className)}
          role="list"
          {...props}
        >
          {animate ? (
            <AnimatePresence>{children}</AnimatePresence>
          ) : (
            children
          )}
        </ul>
      </ListContext.Provider>
    );
  }
);

List.displayName = 'List';

// ============================================================================
// ListItem
// ============================================================================

export interface ListItemProps extends ComponentPropsWithoutRef<'li'> {
  /** Left icon or avatar */
  leading?: ReactNode;
  /** Right content (action, chevron, etc.) */
  trailing?: ReactNode;
  /** Primary text */
  title?: string;
  /** Secondary text */
  description?: string;
  /** Makes item clickable */
  onClick?: () => void;
  /** Shows a chevron indicator */
  showChevron?: boolean;
  /** Selected state */
  selected?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Animation delay index */
  index?: number;
  children?: ReactNode;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      leading,
      trailing,
      title,
      description,
      onClick,
      showChevron = false,
      selected = false,
      disabled = false,
      index = 0,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { variant, interactive } = useContext(ListContext);
    const isClickable = !!onClick || interactive;

    const content = (
      <>
        {/* Leading */}
        {leading && (
          <div className="flex-shrink-0 text-text-secondary">{leading}</div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title ? (
            <>
              <p
                className={cn(
                  'text-sm font-medium text-text-primary truncate',
                  disabled && 'text-text-muted'
                )}
              >
                {title}
              </p>
              {description && (
                <p className="text-sm text-text-secondary truncate">
                  {description}
                </p>
              )}
            </>
          ) : (
            children
          )}
        </div>

        {/* Trailing */}
        {(trailing || showChevron) && (
          <div className="flex-shrink-0 flex items-center gap-2 text-text-muted">
            {trailing}
            {showChevron && <Icon name="chevron_right" size={16} />}
          </div>
        )}
      </>
    );

    return (
      <motion.li
        ref={ref}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ delay: index * 0.03 }}
        className={cn(
          'flex items-center gap-3 px-4 py-3',
          variant === 'bordered' && 'border-b border-border last:border-b-0',
          isClickable && !disabled && [
            'cursor-pointer transition-colors',
            'hover:bg-surface-elevated/50',
          ],
          selected && 'bg-primary-500/10',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={!disabled ? onClick : undefined}
        {...(props as object)}
      >
        {content}
      </motion.li>
    );
  }
);

ListItem.displayName = 'ListItem';

// ============================================================================
// ListItemSkeleton
// ============================================================================

export interface ListItemSkeletonProps {
  showAvatar?: boolean;
  showDescription?: boolean;
  className?: string;
}

export function ListItemSkeleton({
  showAvatar = false,
  showDescription = true,
  className,
}: ListItemSkeletonProps) {
  return (
    <div className={cn('flex items-center gap-3 px-4 py-3', className)}>
      {showAvatar && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-elevated animate-pulse" />
      )}
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-surface-elevated animate-pulse" />
        {showDescription && (
          <div className="h-3 w-2/3 rounded bg-surface-elevated animate-pulse" />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SelectList
// ============================================================================

export interface SelectListProps<T> {
  items: T[];
  selected?: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, selected: boolean) => ReactNode;
  onSelect?: (items: T[]) => void;
  multiple?: boolean;
  variant?: ListVariant;
  className?: string;
}

export function SelectList<T>({
  items,
  selected = [],
  keyExtractor,
  renderItem,
  onSelect,
  multiple = false,
  variant = 'bordered',
  className,
}: SelectListProps<T>) {
  const isSelected = (item: T) =>
    selected.some((s) => keyExtractor(s) === keyExtractor(item));

  const handleSelect = (item: T) => {
    if (!onSelect) return;

    if (multiple) {
      const alreadySelected = isSelected(item);
      if (alreadySelected) {
        onSelect(selected.filter((s) => keyExtractor(s) !== keyExtractor(item)));
      } else {
        onSelect([...selected, item]);
      }
    } else {
      onSelect([item]);
    }
  };

  return (
    <List variant={variant} interactive className={className}>
      {items.map((item, index) => {
        const itemSelected = isSelected(item);
        return (
          <ListItem
            key={keyExtractor(item)}
            index={index}
            selected={itemSelected}
            onClick={() => handleSelect(item)}
            trailing={
              itemSelected ? (
                <Icon name="check_circle" size={18} className="text-success" />
              ) : null
            }
          >
            {renderItem(item, itemSelected)}
          </ListItem>
        );
      })}
    </List>
  );
}

// ============================================================================
// DescriptionList
// ============================================================================

export interface DescriptionListItem {
  term: string;
  description: ReactNode;
}

export interface DescriptionListProps extends ComponentPropsWithoutRef<'dl'> {
  items: DescriptionListItem[];
  layout?: 'stacked' | 'horizontal';
}

export function DescriptionList({
  items,
  layout = 'stacked',
  className,
  ...props
}: DescriptionListProps) {
  return (
    <dl
      className={cn(
        layout === 'horizontal' && 'grid grid-cols-2 gap-4',
        layout === 'stacked' && 'space-y-4',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <div
          key={item.term}
          className={cn(layout === 'horizontal' && 'contents')}
        >
          <dt className="text-sm font-medium text-text-secondary">
            {item.term}
          </dt>
          <dd className="text-sm text-text-primary mt-1">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

// ============================================================================
// NavList
// ============================================================================

export interface NavListItemData {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface NavListProps {
  items: NavListItemData[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function NavList({
  items,
  activeId,
  onSelect,
  className,
}: NavListProps) {
  return (
    <nav className={className}>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => !item.disabled && onSelect?.(item.id)}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                'text-sm font-medium transition-colors',
                item.id === activeId
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {item.icon && (
                <span className="flex-shrink-0">{item.icon}</span>
              )}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="flex-shrink-0">{item.badge}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
