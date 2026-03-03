'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  LayoutDashboard, 
  Layers, 
  BookOpen, 
  Calculator, 
  Brain, 
  Wand2, 
  FileText, 
  Sprout,
  Map,
  PenTool,
  Save,
  Beaker,
  Search,
  Command,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCommandPalette } from '@/components/navigation/CommandPalette';
import { UserDropdown } from '@/components/navigation/UserDropdown';

// Sidebar navigation items
const sidebarLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Farm Data Entry', href: '/farm', icon: Map },
  { label: 'Custom Model', href: '/custom-model', icon: Layers },
  { label: 'Strata System', href: '/strata', icon: Layers },
  { label: 'Designer', href: '/designer', icon: PenTool },
  { label: 'Predictions', href: '/predict', icon: Brain },
  { label: 'Optimizer', href: '/optimize', icon: Wand2 },
  { label: 'Crops Database', href: '/crops', icon: Sprout },
  { label: 'Calculator', href: '/calc', icon: Calculator },
  { label: 'Presets', href: '/presets', icon: Save },
  { label: 'AI Advisor', href: '/ai-advisor', icon: Brain },
  { label: 'Research', href: '/research', icon: Beaker },
  { label: 'Documentation', href: '/docs', icon: BookOpen },
];

// Simulated auth state (replace with real auth logic)
const useAuth = () => {
  const [user, setUser] = useState<{ name: string; email?: string } | null>(null);
  return { user, setUser };
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setIsOpen: setCommandPaletteOpen } = useCommandPalette();
  const { user, setUser } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'min-h-screen flex flex-col fixed left-0 top-0 bottom-0',
        'bg-surface/80 backdrop-blur-xl border-r border-border-default',
        'z-[var(--z-fixed)]'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border-subtle flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Sprout size={18} className="text-white" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-text-primary font-bold text-lg tracking-tight whitespace-nowrap"
            >
              MultiSow
            </motion.span>
          )}
        </Link>
        
        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'p-1.5 rounded-lg hover:bg-overlay transition-colors',
            'text-text-muted hover:text-text-secondary',
            isCollapsed && 'absolute -right-3 top-5 bg-surface border border-border-default shadow-sm'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Search / Command Palette */}
      <div className="p-3 border-b border-border-subtle">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-xl',
            'bg-overlay border border-border-subtle',
            'text-text-muted hover:text-text-secondary hover:border-border-default',
            'transition-colors',
            isCollapsed && 'justify-center px-0'
          )}
        >
          <Search size={16} />
          {!isCollapsed && (
            <>
              <span className="text-sm flex-1 text-left">Search...</span>
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-surface rounded font-mono">
                <Command size={10} />K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
        <div className="space-y-1 px-3">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-primary-600/15 text-primary-400 shadow-sm'
                    : 'text-text-secondary hover:bg-overlay hover:text-text-primary',
                  isCollapsed && 'justify-center px-0'
                )}
                title={isCollapsed ? link.label : undefined}
              >
                <Icon size={20} className={cn(isActive && 'text-primary-400')} />
                {!isCollapsed && (
                  <span className="font-medium text-sm truncate">{link.label}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section at bottom */}
      <div className="p-3 border-t border-border-subtle">
        {isCollapsed ? (
          <Link
            href="/login"
            className="flex items-center justify-center p-2.5 rounded-xl text-text-secondary hover:bg-overlay hover:text-text-primary transition-colors"
            title="Login"
          >
            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center">
              <Sprout size={16} className="text-primary-400" />
            </div>
          </Link>
        ) : (
          <UserDropdown 
            user={user}
            onLogout={() => setUser(null)}
            className="w-full"
          />
        )}
      </div>
    </motion.aside>
  );
}
