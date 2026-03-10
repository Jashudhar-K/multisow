
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/index';
import { UserDropdown } from '@/components/navigation/UserDropdown';
import { useCommandPalette } from '@/components/navigation/CommandPalette';

const navLinks = [
   { label: 'Home', href: '/' },
   { label: 'Designer', href: '/designer', new: true },
   { label: 'Predict', href: '/predict', new: true },
   { label: 'Optimizer', href: '/optimize' },
   { label: 'Crops', href: '/crops' },
   { label: 'Calculator', href: '/calc' },
   { label: 'AI Advisor', href: '/ai-advisor' },
   { label: 'Presets', href: '/presets' },
   { label: 'Docs', href: '/docs' },
];

// Simulated auth state (replace with real auth logic)
const useAuth = () => {
  // TODO: Replace with real auth logic
  const [user, setUser] = useState<{ name: string; email?: string } | null>(null);
  useEffect(() => {
    // setUser({ name: 'Demo User', email: 'demo@multisow.com' }); // Uncomment to simulate logged in
  }, []);
  return { user, setUser };
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { setIsOpen: setCommandPaletteOpen } = useCommandPalette();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  // Close mobile menu on outside click or Escape
  useEffect(() => {
    if (!isMobileOpen) return;
    function handle(e: MouseEvent | KeyboardEvent) {
      if (
        (e instanceof MouseEvent && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) ||
        (e instanceof KeyboardEvent && e.key === 'Escape')
      ) {
        setIsMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', handle);
    };
  }, [isMobileOpen]);

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-sticky transition-all duration-300',
        'backdrop-blur-xl border-b',
        isScrolled 
          ? 'bg-background/90 border-border-default shadow-glass' 
          : 'bg-background/70 border-border-subtle'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="MultiSow Home">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
              <Icon name="agriculture" size={18} className="text-white" />
            </div>
            <span className="text-primary-400 font-bold text-xl tracking-tight">MultiSow</span>
          </Link>

          {/* Center nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'relative text-sm px-3 py-2 rounded-lg transition-colors duration-200',
                  pathname === link.href
                    ? 'text-primary-400 bg-primary-600/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                )}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
                {link.new && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-accent-500 text-white rounded-full align-middle font-medium">
                    New
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search / Command Palette trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                'bg-surface border border-border-subtle',
                'text-text-muted hover:text-text-secondary hover:border-border-default',
                'transition-colors'
              )}
            >
              <Icon name="search" size={14} />
              <span className="text-sm hidden lg:inline">Search...</span>
              <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-overlay rounded font-mono">
                <Icon name="keyboard_command_key" size={10} />K
              </kbd>
            </button>

            {/* User dropdown */}
            <UserDropdown 
              user={user}
              onLogout={() => setUser(null)}
            />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? <Icon name="close" size={20} /> : <Icon name="menu" size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-border-subtle fixed top-16 left-0 right-0 z-dropdown"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
              {/* Search button */}
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  setCommandPaletteOpen(true);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-overlay text-text-secondary hover:text-text-primary transition-colors"
              >
                <Icon name="search" size={18} />
                <span>Search...</span>
              </button>

              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'block text-base py-2.5 px-3 rounded-xl transition-colors',
                    pathname === link.href 
                      ? 'text-primary-400 bg-primary-600/15' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-overlay'
                  )}
                  onClick={() => setIsMobileOpen(false)}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                  {link.new && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-accent-500 text-white rounded-full align-middle font-medium">
                      New
                    </span>
                  )}
                </Link>
              ))}
              
              <div className="mt-4 pt-4 border-t border-border-subtle flex flex-col gap-2">
                {!user ? (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setIsMobileOpen(false)}
                      className="w-full text-center px-4 py-2.5 rounded-xl border border-primary-500 text-primary-400 font-medium hover:bg-primary-600/10 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link 
                      href="/signup" 
                      onClick={() => setIsMobileOpen(false)}
                      className="w-full text-center px-4 py-2.5 rounded-xl bg-primary-500 text-primary-950 font-medium hover:bg-primary-400 transition-colors"
                    >
                      Get Started Free
                    </Link>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{user.name}</p>
                        {user.email && <p className="text-xs text-text-muted">{user.email}</p>}
                      </div>
                    </div>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsMobileOpen(false)}
                      className="block px-4 py-2.5 text-text-secondary hover:text-text-primary hover:bg-overlay rounded-lg"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/profile" 
                      onClick={() => setIsMobileOpen(false)}
                      className="block px-4 py-2.5 text-text-secondary hover:text-text-primary hover:bg-overlay rounded-lg"
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      onClick={() => setIsMobileOpen(false)}
                      className="block px-4 py-2.5 text-text-secondary hover:text-text-primary hover:bg-overlay rounded-lg"
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={() => {
                        setUser(null);
                        setIsMobileOpen(false);
                      }} 
                      className="w-full text-left px-4 py-2.5 text-error hover:bg-error-bg rounded-lg transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
