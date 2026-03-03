'use client';

import { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import { CommandPalette, useCommandPalette } from '@/components/navigation/CommandPalette';
import { SkipLink } from '@/components/utils';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

// Context for sidebar state management
interface SidebarContextValue {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isOpen, setIsOpen } = useCommandPalette();

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <SkipLink targetId="main-content" />
      <div className="h-screen bg-background flex overflow-hidden">
        <Sidebar />
        <main 
          id="main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden transition-[margin] duration-200 ease-in-out"
          style={{ marginLeft: isCollapsed ? 72 : 256 }}
        >
          {children}
        </main>
        
        {/* Global Command Palette */}
        <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </SidebarContext.Provider>
  );
}
