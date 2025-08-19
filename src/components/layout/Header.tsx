import { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  Shield, 
  Menu, 
  X, 
  Search, 
  Settings,
  Command,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationPanel } from '../ui/NotificationPanel';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
  isSidebarCollapsed?: boolean;
}

export function Header({ onMenuClick, isMobile = false, isSidebarCollapsed = false }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
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

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
  };

  return (
    <header className="header relative z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button or desktop collapse indicator */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMenuClick}
            className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-accent/10 transition-colors"
            aria-label={isMobile ? "Open menu" : "Toggle sidebar"}
          >
            {isMobile ? (
              <Menu className="h-5 w-5" />
            ) : (
              <Command className="h-5 w-5" />
            )}
          </Button>
          
          {/* Logo - visible when sidebar is collapsed or on mobile */}
          {(isSidebarCollapsed || isMobile) && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-md">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Keystone
                </div>
              </div>
            </div>
          )}

          {/* Search bar - expandable on mobile */}
          <div className="flex items-center">
            {isMobile ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="h-10 w-10 rounded-xl"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects, tasks... ⌘K"
                  className="input-modern w-80 pl-10 pr-4 py-2.5 text-sm focus:w-96 transition-all duration-300"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
              className="relative h-10 w-10 rounded-xl hover:bg-accent/10 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center animate-bounce-soft">
                  {unreadCount}
                </div>
              )}
            </Button>
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl hover:bg-accent/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUserMenuToggle}
              className="flex items-center space-x-3 h-12 px-3 rounded-xl hover:bg-accent/10 transition-colors"
              aria-label="User menu"
            >
              <div className="relative">
                <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-success border-2 border-background rounded-full"></div>
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-sm font-semibold text-foreground">
                  {user.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user.role}
                </div>
              </div>
            </Button>

            {/* User dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-xl py-2 animate-scale-in z-50">
                <div className="px-4 py-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success border-2 border-card rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground">
                        {user.name}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </div>
                      <div className="mt-2">
                        <span className="badge-modern">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button 
                    className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-accent/10 flex items-center space-x-3 transition-colors"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      window.location.href = '/settings';
                    }}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Settings</span>
                  </button>
                  
                  <button 
                    className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-accent/10 flex items-center space-x-3 transition-colors"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      window.location.href = '/permissions';
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Permissions</span>
                  </button>
                </div>
                
                <div className="border-t border-border pt-2">
                  <button 
                    className="w-full px-4 py-3 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center space-x-3 transition-colors font-medium"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile search overlay */}
        {isMobile && isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-card border-b border-border p-4 animate-slide-down z-40">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects, tasks..."
                  className="input-modern pl-10 pr-4 py-3 text-sm"
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(false)}
                className="h-10 w-10 rounded-xl"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Notification Panel */}
        <NotificationPanel
          isOpen={isNotificationPanelOpen}
          onClose={() => setIsNotificationPanelOpen(false)}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </div>
      
      {/* Overlay to close dropdowns */}
      {(isNotificationPanelOpen || isUserMenuOpen) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setIsNotificationPanelOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </header>
  );
}