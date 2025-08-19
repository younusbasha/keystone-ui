import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-secondary to-primary-50/10 dark:from-background dark:via-surface-secondary dark:to-secondary-950/10">
      <div className="flex h-screen overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 animate-fade-in"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
          ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          ${!isMobile && isSidebarCollapsed ? 'w-20' : isMobile ? 'w-72' : 'w-72'}
          transition-all duration-300 ease-in-out
        `}>
          <Sidebar 
            isMobile={isMobile}
            isOpen={isSidebarOpen}
            isCollapsed={!isMobile && isSidebarCollapsed}
            onClose={closeSidebar}
            onToggleCollapse={toggleSidebar}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header 
            onMenuClick={toggleSidebar}
            isMobile={isMobile}
            isSidebarCollapsed={!isMobile && isSidebarCollapsed}
          />
          
          {/* Main content with enhanced styling */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-surface-secondary/20">
            <div className="container-responsive py-6 lg:py-8 animate-fade-in-up">
              <div className="max-w-none space-y-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}