import PageLayout from '@/components/layout/PageLayout';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/cards/GlassCard';

const componentCategories = [
  {
    title: 'Layout',
    description: 'Page structure and navigation components',
    components: [
      { name: 'PageLayout', description: 'Standard page wrapper with title and header' },
      { name: 'SidebarLayout', description: 'Application shell with collapsible sidebar' },
      { name: 'Sidebar', description: 'Navigation sidebar with links and sections' },
    ],
  },
  {
    title: 'UI Primitives',
    description: 'Core building blocks for interfaces',
    components: [
      { name: 'GlassCard', description: 'Glassmorphism card container with blur backdrop' },
      { name: 'Badge', description: 'Status labels with color variants' },
      { name: 'Chip', description: 'Interactive pills for tags and filters' },
      { name: 'Tooltip', description: 'Contextual hints on hover' },
      { name: 'Progress', description: 'Linear and circular progress indicators' },
      { name: 'Divider', description: 'Section separators with optional labels' },
      { name: 'Avatar', description: 'User avatars with fallback initials' },
      { name: 'Skeleton', description: 'Loading placeholders' },
    ],
  },
  {
    title: 'Forms',
    description: 'Input components and validation',
    components: [
      { name: 'Input', description: 'Text input with variants and states' },
      { name: 'Textarea', description: 'Multi-line text input' },
      { name: 'Select', description: 'Dropdown selection' },
      { name: 'Checkbox', description: 'Toggle checkboxes' },
      { name: 'Switch', description: 'On/off toggle switches' },
      { name: 'Radio', description: 'Radio button groups' },
      { name: 'FormField', description: 'Label, input, and error wrapper' },
    ],
  },
  {
    title: 'Actions',
    description: 'Buttons and interactive controls',
    components: [
      { name: 'Button', description: 'Button variants: primary, secondary, ghost, danger' },
      { name: 'IconButton', description: 'Compact icon-only buttons' },
      { name: 'ButtonGroup', description: 'Grouped button actions' },
      { name: 'SplitButton', description: 'Action with dropdown menu' },
      { name: 'LoadingButton', description: 'Button with loading spinner' },
    ],
  },
  {
    title: 'Feedback',
    description: 'Alerts and notifications',
    components: [
      { name: 'Alert', description: 'Inline status messages' },
      { name: 'Banner', description: 'Full-width announcements' },
      { name: 'StatusIndicator', description: 'Online/offline dots' },
      { name: 'Callout', description: 'Highlighted information blocks' },
    ],
  },
  {
    title: 'Overlays',
    description: 'Modals, drawers, and toasts',
    components: [
      { name: 'Modal', description: 'Dialog windows with backdrop' },
      { name: 'Drawer', description: 'Slide-out side panels' },
      { name: 'Toast', description: 'Temporary notification messages' },
      { name: 'ToastProvider', description: 'Context provider for toast system' },
    ],
  },
  {
    title: 'Data Display',
    description: 'Tables, lists, and data presentation',
    components: [
      { name: 'DataTable', description: 'Sortable, filterable data tables' },
      { name: 'SimpleTable', description: 'Basic table primitives' },
      { name: 'List', description: 'Vertical item lists with variants' },
      { name: 'DescriptionList', description: 'Key-value pair display' },
      { name: 'Pagination', description: 'Page navigation controls' },
      { name: 'EmptyState', description: 'No data placeholders' },
    ],
  },
  {
    title: 'Navigation',
    description: 'Tabs, breadcrumbs, and menus',
    components: [
      { name: 'Tabs', description: 'Tabbed content navigation' },
      { name: 'Breadcrumb', description: 'Page hierarchy nav' },
      { name: 'NavList', description: 'Sidebar navigation list' },
    ],
  },
  {
    title: 'Theme',
    description: 'Theming and appearance',
    components: [
      { name: 'ThemeProvider', description: 'Context provider for theme management' },
      { name: 'ThemeToggle', description: 'Light/dark mode toggle button' },
      { name: 'ThemeSelector', description: 'Theme picker with system option' },
    ],
  },
  {
    title: 'Performance',
    description: 'Optimization utilities',
    components: [
      { name: 'createLazyComponent', description: 'Lazy loading with suspense' },
      { name: 'useIntersection', description: 'Intersection observer hook' },
      { name: 'useDebounce', description: 'Debounced value hook' },
      { name: 'useVirtualList', description: 'Virtualized list rendering' },
      { name: 'OptimizedImage', description: 'Next.js Image wrapper with blur-up' },
      { name: 'RenderWhenVisible', description: 'Render children when in viewport' },
    ],
  },
  {
    title: 'Accessibility',
    description: 'A11y utilities and helpers',
    components: [
      { name: 'SkipLink', description: 'Skip to main content link' },
      { name: 'VisuallyHidden', description: 'Screen reader-only text' },
      { name: 'FocusTrap', description: 'Trap focus within element' },
      { name: 'Announce', description: 'ARIA live announcements' },
      { name: 'MotionPreferencesProvider', description: 'Respect reduced motion' },
    ],
  },
];

export default function DocsPage() {
  return (
    <PageLayout title="Component Library">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-3">
            MultiSow Design System
          </h1>
          <p className="text-text-secondary">
            Enterprise-grade component library with consistent design tokens,
            accessibility features, and performance optimizations.
          </p>
        </div>

        {/* Design Tokens */}
        <GlassCard>
          <GlassCardHeader>
            <h2 className="text-xl font-semibold text-text-primary">Design Tokens</h2>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-success" />
                    <span className="text-sm text-text-primary">Success / Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-warning" />
                    <span className="text-sm text-text-primary">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-error" />
                    <span className="text-sm text-text-primary">Error</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-info" />
                    <span className="text-sm text-text-primary">Info</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Surfaces</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-background border border-border-subtle" />
                    <span className="text-sm text-text-primary">Background</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-surface border border-border-subtle" />
                    <span className="text-sm text-text-primary">Surface</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-surface-elevated border border-border-subtle" />
                    <span className="text-sm text-text-primary">Elevated</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Typography</h3>
                <div className="space-y-1">
                  <p className="text-text-primary">Primary text</p>
                  <p className="text-text-secondary">Secondary text</p>
                  <p className="text-text-muted">Muted text</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Borders</h3>
                <div className="space-y-2">
                  <div className="h-8 rounded border border-border-subtle flex items-center justify-center text-sm text-text-secondary">Subtle</div>
                  <div className="h-8 rounded border border-border-default flex items-center justify-center text-sm text-text-secondary">Default</div>
                </div>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Component Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {componentCategories.map((category) => (
            <GlassCard key={category.title}>
              <GlassCardHeader>
                <h2 className="text-lg font-semibold text-text-primary">{category.title}</h2>
                <p className="text-sm text-text-secondary mt-1">{category.description}</p>
              </GlassCardHeader>
              <GlassCardContent>
                <ul className="space-y-2">
                  {category.components.map((component) => (
                    <li key={component.name} className="flex items-start gap-2">
                      <code className="text-success text-sm font-mono bg-surface-elevated px-1.5 py-0.5 rounded">
                        {component.name}
                      </code>
                      <span className="text-xs text-text-muted mt-0.5">{component.description}</span>
                    </li>
                  ))}
                </ul>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>

        {/* Usage Example */}
        <GlassCard>
          <GlassCardHeader>
            <h2 className="text-xl font-semibold text-text-primary">Quick Start</h2>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Import Components</h3>
                <pre className="bg-background rounded-lg p-4 overflow-x-auto text-sm">
                  <code className="text-text-primary">{`// UI Components
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { Button, IconButton, ButtonGroup } from '@/components/ui/buttons';
import { Input, Select, Checkbox, Switch } from '@/components/ui/forms';
import { Badge, Chip, Tooltip, Progress } from '@/components/ui/primitives';

// Overlays
import { Modal, useModal } from '@/components/overlays/Modal';
import { Drawer, useDrawer } from '@/components/overlays/Drawer';
import { ToastProvider, useToast } from '@/components/overlays/Toast';

// Tables
import { DataTable, List, Pagination, EmptyState } from '@/components/tables';

// Theme
import { ThemeProvider, ThemeToggle } from '@/components/theme';

// Utilities
import { useDebounce, useIntersection, OptimizedImage } from '@/components/utils';`}</code>
                </pre>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Using Design Tokens</h3>
                <pre className="bg-background rounded-lg p-4 overflow-x-auto text-sm">
                  <code className="text-text-primary">{`// Tailwind classes use CSS custom properties
<div className="bg-background text-text-primary border-border-subtle">
  <span className="text-success">Success text</span>
  <div className="bg-surface-elevated">Elevated surface</div>
</div>

// Direct CSS variable access
const styles = {
  backgroundColor: 'var(--color-surface)',
  borderColor: 'var(--color-border-default)',
};`}</code>
                </pre>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </PageLayout>
  );
}
