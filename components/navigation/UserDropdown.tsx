/**
 * User Dropdown Menu
 * ==================
 * User profile dropdown with avatar and menu options.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { dropdownVariants } from '@/lib/animations';

interface UserData {
  name: string;
  email?: string;
  avatar?: string;
}

interface UserDropdownProps {
  user: UserData | null;
  onLogin?: () => void;
  onLogout?: () => void;
  className?: string;
}

export function UserDropdown({ user, onLogin, onLogout, className }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!user) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 text-sm font-medium bg-primary-500 text-primary-950 rounded-xl hover:bg-primary-400 transition-colors shadow-glow-soft"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors',
          'hover:bg-surface',
          isOpen && 'bg-surface'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-medium text-white">{initials}</span>
          )}
        </div>
        
        {/* Name (hidden on mobile) */}
        <span className="hidden sm:block text-sm font-medium text-text-primary max-w-[100px] truncate">
          {user.name}
        </span>
        
        <ChevronDown 
          size={16} 
          className={cn(
            'text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-56 origin-top-right"
          >
            <div className="bg-surface border border-border-default rounded-xl shadow-xl overflow-hidden">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-border-subtle">
                <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                {user.email && (
                  <p className="text-xs text-text-muted truncate">{user.email}</p>
                )}
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-overlay transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-overlay transition-colors"
                >
                  <User size={16} />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-overlay transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </Link>
                <Link
                  href="/docs"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-overlay transition-colors"
                >
                  <HelpCircle size={16} />
                  Help & Docs
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-border-subtle py-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout?.();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-error-bg transition-colors"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
