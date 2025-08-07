import React, { useState } from 'react';
import { Bell, Moon, Sun, LogOut, User, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NotificationPanel } from '../ui/NotificationPanel';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  
  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'warning' as const,
      title: 'Agent Action Requires Review',
      message: 'CodeGen-Agent-01 attempted to modify production database schema',
      timestamp: '2024-01-20T14:20:00Z',
      isRead: false,
    },
    {
      id: '2',
      type: 'success' as const,
      title: 'Deployment Completed',
      message: 'E-commerce Platform successfully deployed to staging',
      timestamp: '2024-01-20T13:45:00Z',
      isRead: false,
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'New Task Generated',
      message: 'Task Planner created 5 new tasks for user authentication epic',
      timestamp: '2024-01-20T12:30:00Z',
      isRead: true,
    },
  ]);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/techsophy-logo.svg" 
              alt="TechSophy" 
              className="h-10 w-auto text-techsophy-600 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              icon={Bell}
              onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
              className="relative"
            >
              <span className="sr-only">Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="error" className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            icon={theme === 'light' ? Moon : Sun}
            onClick={toggleTheme}
          >
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                  {user.name}
                </div>
                <Badge variant="brand" size="sm">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    {user.email}
                  </div>
                </Badge>
                <Badge variant="techsophy" size="sm">
                </Badge>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              icon={LogOut}
              onClick={logout}
            >
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
        
        <NotificationPanel
          isOpen={isNotificationPanelOpen}
          onClose={() => setIsNotificationPanelOpen(false)}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </div>
      
      {/* Overlay to close notification panel */}
      {isNotificationPanelOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsNotificationPanelOpen(false)}
        />
      )}
    </header>
  );
}