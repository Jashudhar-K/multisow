/**
 * Mobile Navigation Drawer
 * ========================
 * Full-screen navigation drawer for mobile devices with gesture support.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';
import { slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <Icon name="dashboard" size={20} />, description: 'Overview & analytics' },
  { href: '/strata', label: 'Strata Builder', icon: <Icon name="layers" size={20} />, description: 'Design crop layers' },
  { href: '/crops', label: 'Crops Database', icon: <Icon name="agriculture" size={20} />, description: 'Browse all crops' },
  { href: '/farm', label: 'Farm View', icon: <Icon name="map" size={20} />, description: '3D farm visualization' },
  { href: '/designer', label: 'Designer', icon: <Icon name="draw" size={20} />, description: 'Visual crop designer' },
  { href: '/calc', label: 'Calculator', icon: <Icon name="calculate" size={20} />, description: 'Spacing & yield' },
  { href: '/optimize', label: 'Optimizer', icon: <Icon name="auto_fix_high" size={20} />, description: 'AI optimization' },
  { href: '/predict', label: 'Predictions', icon: <Icon name="show_chart" size={20} />, description: 'Yield predictions' },
  { href: '/custom-model', label: 'Custom Model', icon: <Icon name="settings" size={20} />, description: 'Train your model' },
  { href: '/presets', label: 'Presets', icon: <Icon name="save" size={20} />, description: 'Regional templates' },
  { href: '/ai-advisor', label: 'AI Advisor', icon: <Icon name="psychology" size={20} />, description: 'Smart recommendations' },
  { href: '/research', label: 'Research', icon: <Icon name="science" size={20} />, description: 'Latest studies' },
  { href: '/docs', label: 'Documentation', icon: <Icon name="menu_book" size={20} />, description: 'Guides & API' },
];

interface UserData {
  name: string;
  email?: string;
  avatar?: string;
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserData | null;
  onLogout?: () => void;
}

export function MobileDrawer({ isOpen, onClose, user, onLogout }: MobileDrawerProps) {
  const pathname = usePathname();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-overlay"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            variants={slideInFromLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-background border-r border-border-default z-modal flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-subtle">
              <Link href="/" onClick={onClose} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <Icon name="agriculture" size={18} className="text-white" />
                </div>
                <span className="text-lg font-semibold text-text-primary tracking-tight">
                  MultiSow
                </span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface transition-colors"
                aria-label="Close menu"
              >
                <Icon name="close" size={20} className="text-text-secondary" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-1 px-3"
              >
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div key={item.href} variants={staggerItem}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors',
                          isActive
                            ? 'bg-primary-600/15 text-primary-400'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                        )}
                      >
                        <span className={cn(isActive && 'text-primary-400')}>
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{item.label}</p>
                          {item.description && (
                            <p className="text-xs text-text-muted truncate">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </nav>

            {/* User section */}
            <div className="border-t border-border-subtle p-4">
              {user ? (
                <div className="space-y-3">
                  {/* User info */}
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-white">{initials}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                      {user.email && (
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      )}
                    </div>
                  </div>

                  {/* User actions */}
                  <div className="flex gap-2">
                    <Link
                      href="/profile"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-text-secondary bg-surface rounded-lg hover:bg-overlay transition-colors"
                    >
                      <Icon name="person" size={16} />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-text-secondary bg-surface rounded-lg hover:bg-overlay transition-colors"
                    >
                      <Icon name="settings" size={16} />
                      Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      onClose();
                      onLogout?.();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-error bg-error-bg rounded-lg hover:bg-error/20 transition-colors"
                  >
                    <Icon name="logout" size={16} />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-text-secondary bg-surface rounded-xl hover:bg-overlay transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium bg-primary-500 text-primary-950 rounded-xl hover:bg-primary-400 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for managing drawer state
export function useMobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
}
