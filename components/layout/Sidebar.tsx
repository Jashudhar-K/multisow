'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';
import { UserDropdown } from '@/components/navigation/UserDropdown';
import { useLanguage } from '@/context/LanguageContext';

// ---------------------------------------------------------------------------
// Primary navigation — Google Navigation Rail style
// ---------------------------------------------------------------------------
const PRIMARY_NAV = [
  { labelKey: 'nav.home',      href: '/',          icon: 'home' },
  { labelKey: 'nav.designer',  href: '/designer',  icon: 'agriculture' },
  { labelKey: 'nav.dashboard', href: '/dashboard', icon: 'dashboard' },
  { labelKey: 'nav.sensors',   href: '/sensors',   icon: 'sensors' },
  { labelKey: 'nav.crops',     href: '/crops',     icon: 'eco' },
  { labelKey: 'nav.research',  href: '/docs',      icon: 'menu_book' },
];

// ---------------------------------------------------------------------------
// Secondary nav
// ---------------------------------------------------------------------------
const SECONDARY_NAV = [
  { labelKey: 'nav.profile',  href: '/profile',  icon: 'person' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session } = useSession();
  const { t, language, setLanguage } = useLanguage();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'min-h-screen flex flex-col fixed left-0 top-0 bottom-0',
        'bg-surface/80 backdrop-blur-xl border-r border-border-default',
        'z-fixed'
      )}
    >
      {/* Logo + collapse toggle */}
      <div className="p-4 border-b border-border-subtle flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Icon name="energy_savings_leaf" size={18} filled className="text-white" />
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
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'p-1.5 rounded-lg hover:bg-overlay transition-colors',
            'text-text-muted hover:text-text-secondary',
            isCollapsed && 'absolute -right-3 top-5 bg-surface border border-border-default shadow-sm'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={isCollapsed ? 'chevron_right' : 'chevron_left'} size={16} />
        </button>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
        <div className="space-y-0.5 px-3">
          {PRIMARY_NAV.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
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
                title={isCollapsed ? t(link.labelKey) : undefined}
              >
                <Icon name={link.icon} size={20} filled={isActive} className={cn(isActive && 'text-primary-400')} />
                {!isCollapsed && (
                  <span className="font-medium text-sm truncate">{t(link.labelKey)}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick actions */}
        {!isCollapsed && (
          <div className="mt-4 px-3">
            <p className="text-[10px] uppercase tracking-widest text-text-disabled px-3 mb-2">Quick Actions</p>
            <Link href="/onboarding"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-text-secondary hover:bg-overlay hover:text-text-primary transition-colors text-sm">
              <Icon name="bolt" size={16} className="text-amber-400" />
              {!isCollapsed && 'New Farm Setup'}
            </Link>
          </div>
        )}

        {/* Secondary nav */}
        <div className="mt-4 border-t border-border-subtle pt-3 space-y-0.5 px-3">
          {SECONDARY_NAV.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm',
                  isActive ? 'bg-primary-600/10 text-primary-400' : 'text-text-muted hover:bg-overlay hover:text-text-secondary',
                  isCollapsed && 'justify-center px-0'
                )}
                title={isCollapsed ? t(link.labelKey) : undefined}
              >
                <Icon name={link.icon} size={18} filled={isActive} />
                {!isCollapsed && t(link.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section and Language */}
      <div className="p-3 border-t border-border-subtle flex flex-col gap-2">
        {!isCollapsed && (
          <div className="flex gap-1 justify-center">
            {(['en', 'hi', 'ml', 'ta', 'te', 'mr'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={cn(
                  "text-[10px] uppercase font-bold px-1.5 py-1 rounded transition-colors",
                  language === l ? "bg-primary-600 text-white" : "text-white/40 hover:text-white hover:bg-white/10"
                )}
                title={l.toUpperCase()}
              >
                {l}
              </button>
            ))}
          </div>
        )}
        {isCollapsed ? (
          <Link
            href={session?.user ? '/profile' : '/login'}
            className="flex items-center justify-center p-2.5 rounded-xl text-text-secondary hover:bg-overlay transition-colors"
            title={session?.user ? 'Profile' : 'Login'}
          >
            <Icon name={session?.user ? 'person' : 'login'} size={18} />
          </Link>
        ) : (
          <UserDropdown
            user={session?.user ? { name: session.user.name ?? 'User', email: session.user.email ?? undefined } : null}
            onLogout={() => {/* handled by UserDropdown/signOut */}}
            className="w-full"
          />
        )}
      </div>
    </motion.aside>
  );
}

