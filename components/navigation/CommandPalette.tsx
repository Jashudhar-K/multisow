/**
 * Command Palette Component
 * =========================
 * Cmd/Ctrl+K quick search and navigation.
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Home,
  LayoutDashboard,
  Layers,
  Compass,
  Brain,
  Palette,
  Leaf,
  Calculator,
  BookOpen,
  FileText,
  Settings,
  User,
  Command,
  ArrowRight,
  Hash,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { modalBackdrop, modalContent } from '@/lib/animations';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
  category: 'navigation' | 'actions' | 'tools';
  keywords?: string[];
}

const navigationItems: CommandItem[] = [
  { id: 'home', label: 'Home', description: 'Landing page', icon: <Home size={18} />, href: '/', category: 'navigation', keywords: ['start', 'main'] },
  { id: 'dashboard', label: 'Dashboard', description: 'Farm overview', icon: <LayoutDashboard size={18} />, href: '/dashboard', category: 'navigation', keywords: ['overview', 'stats'] },
  { id: 'designer', label: 'Farm Designer', description: '2D/3D crop layout', icon: <Compass size={18} />, href: '/designer', category: 'navigation', keywords: ['layout', 'design', '3d', 'map'] },
  { id: 'strata', label: 'Strata System', description: '4-layer presets', icon: <Layers size={18} />, href: '/strata', category: 'navigation', keywords: ['layers', 'presets', 'tiers'] },
  { id: 'predict', label: 'Yield Prediction', description: 'FOHEM ML model', icon: <Brain size={18} />, href: '/predict', category: 'navigation', keywords: ['ml', 'ai', 'forecast'] },
  { id: 'optimize', label: 'Optimizer', description: 'Genetic optimization', icon: <Palette size={18} />, href: '/optimize', category: 'navigation', keywords: ['genetic', 'improve'] },
  { id: 'crops', label: 'Crops Database', description: 'Browse species', icon: <Leaf size={18} />, href: '/crops', category: 'navigation', keywords: ['plants', 'species', 'varieties'] },
  { id: 'calc', label: 'Calculator', description: 'Resource calculator', icon: <Calculator size={18} />, href: '/calc', category: 'navigation', keywords: ['resources', 'compute'] },
  { id: 'farm', label: 'Farm Data Entry', description: 'Enter farm details', icon: <FileText size={18} />, href: '/farm', category: 'navigation', keywords: ['input', 'data', 'soil'] },
  { id: 'ai-advisor', label: 'AI Advisor', description: 'Get AI recommendations', icon: <Zap size={18} />, href: '/ai-advisor', category: 'navigation', keywords: ['chat', 'help', 'assistant'] },
  { id: 'research', label: 'Research Hub', description: 'Success stories', icon: <BookOpen size={18} />, href: '/research', category: 'navigation', keywords: ['studies', 'stories'] },
  { id: 'docs', label: 'Documentation', description: 'Guides & API', icon: <FileText size={18} />, href: '/docs', category: 'navigation', keywords: ['help', 'guides', 'api'] },
  { id: 'settings', label: 'Settings', description: 'App preferences', icon: <Settings size={18} />, href: '/settings', category: 'navigation', keywords: ['preferences', 'config'] },
  { id: 'profile', label: 'Profile', description: 'Your account', icon: <User size={18} />, href: '/profile', category: 'navigation', keywords: ['account', 'user'] },
];

const actionItems: CommandItem[] = [
  { id: 'new-design', label: 'New Farm Design', description: 'Start fresh', icon: <Compass size={18} />, href: '/designer?new=true', category: 'actions', keywords: ['create', 'start'] },
  { id: 'run-prediction', label: 'Run Prediction', description: 'Quick yield forecast', icon: <Brain size={18} />, href: '/predict', category: 'actions', keywords: ['predict', 'forecast'] },
  { id: 'view-presets', label: 'Browse Presets', description: '6 regional models', icon: <Layers size={18} />, href: '/strata', category: 'actions', keywords: ['templates', 'models'] },
];

const allItems = [...navigationItems, ...actionItems];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    
    const lowerQuery = query.toLowerCase();
    return allItems.filter((item) => {
      const searchText = [
        item.label,
        item.description,
        ...(item.keywords || []),
      ].join(' ').toLowerCase();
      return searchText.includes(lowerQuery);
    });
  }, [query]);

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      navigation: [],
      actions: [],
      tools: [],
    };
    filteredItems.forEach((item) => {
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          if (selected.href) {
            router.push(selected.href);
          } else if (selected.action) {
            selected.action();
          }
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [filteredItems, selectedIndex, router, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    selectedElement?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleItemClick = (item: CommandItem) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.action) {
      item.action();
    }
    onClose();
  };

  let itemIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-modal-backdrop"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-modal flex items-start justify-center pt-[15vh] px-4"
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div 
              className="w-full max-w-xl bg-surface border border-border-default rounded-2xl shadow-2xl overflow-hidden"
              onKeyDown={handleKeyDown}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
                <Search size={20} className="text-text-muted shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages, actions..."
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-base"
                  aria-label="Search commands"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-text-muted bg-overlay rounded border border-border-subtle">
                  <span>esc</span>
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
                {filteredItems.length === 0 ? (
                  <div className="py-8 text-center text-text-muted">
                    No results found for "{query}"
                  </div>
                ) : (
                  <>
                    {/* Navigation group */}
                    {groupedItems.navigation.length > 0 && (
                      <div className="mb-2">
                        <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">
                          Pages
                        </div>
                        {groupedItems.navigation.map((item) => {
                          const currentIndex = itemIndex++;
                          return (
                            <button
                              key={item.id}
                              data-index={currentIndex}
                              onClick={() => handleItemClick(item)}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors',
                                currentIndex === selectedIndex
                                  ? 'bg-primary-500/20 text-text-primary'
                                  : 'text-text-secondary hover:bg-overlay hover:text-text-primary'
                              )}
                            >
                              <span className={cn(
                                'shrink-0',
                                currentIndex === selectedIndex ? 'text-primary-400' : 'text-text-muted'
                              )}>
                                {item.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{item.label}</div>
                                {item.description && (
                                  <div className="text-sm text-text-muted truncate">{item.description}</div>
                                )}
                              </div>
                              {currentIndex === selectedIndex && (
                                <ArrowRight size={16} className="text-primary-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Actions group */}
                    {groupedItems.actions.length > 0 && (
                      <div className="mb-2">
                        <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">
                          Quick Actions
                        </div>
                        {groupedItems.actions.map((item) => {
                          const currentIndex = itemIndex++;
                          return (
                            <button
                              key={item.id}
                              data-index={currentIndex}
                              onClick={() => handleItemClick(item)}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors',
                                currentIndex === selectedIndex
                                  ? 'bg-primary-500/20 text-text-primary'
                                  : 'text-text-secondary hover:bg-overlay hover:text-text-primary'
                              )}
                            >
                              <span className={cn(
                                'shrink-0',
                                currentIndex === selectedIndex ? 'text-primary-400' : 'text-text-muted'
                              )}>
                                {item.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{item.label}</div>
                                {item.description && (
                                  <div className="text-sm text-text-muted truncate">{item.description}</div>
                                )}
                              </div>
                              {currentIndex === selectedIndex && (
                                <ArrowRight size={16} className="text-primary-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border-subtle text-xs text-text-muted">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-overlay rounded border border-border-subtle">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-overlay rounded border border-border-subtle">↓</kbd>
                    <span className="ml-1">navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-overlay rounded border border-border-subtle">↵</kbd>
                    <span className="ml-1">select</span>
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Command size={12} />
                  <span>K to toggle</span>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to manage command palette state and keyboard shortcut
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
