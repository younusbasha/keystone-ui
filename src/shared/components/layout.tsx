import React, { useState, useEffect } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 animate-fade-in"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={cn(
          "transition-transform duration-300 ease-in-out",
          isMobile ? "fixed inset-y-0 left-0 z-50" : "relative",
          isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}>
          <Sidebar 
            isMobile={isMobile}
            onClose={closeSidebar}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header 
            onMenuClick={toggleSidebar}
            isMobile={isMobile}
          />
          
          {/* Main content with better scroll behavior */}
                  <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
        </div>
      </div>
    </div>
  );
}
