import { useState } from 'react';
import { Bell, Moon, Sun, LogOut, User, Shield, Menu, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export function Header({ onMenuClick, isMobile = false }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Mock notifications data
  const [notifications] = useState([
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

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-card/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 py-3 relative z-30">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          {/* Logo - hidden on mobile when space is limited */}
          <div className="flex items-center space-x-3 hidden sm:flex">
            <img 
              src="/techsophy-logo.svg" 
              alt="TechSophy" 
              className="h-8 sm:h-10 w-auto"
            />
          </div>

          {/* Search bar - expandable on mobile */}
          <div className="flex items-center">
            {isMobile ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects, tasks..."
                  className="w-64 pl-10"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 text-xs animate-bounce-soft"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                  <div className="flex items-center justify-between w-full mb-1">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <Badge variant={notification.type === 'warning' ? 'warning' : notification.type === 'success' ? 'success' : 'default'}>
                      {notification.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium">
                    {user.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.role}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {user.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => window.location.href = '/permissions'}>
                <Shield className="w-4 h-4 mr-3" />
                Permissions
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-3" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Mobile search overlay */}
        {isMobile && isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-card border-b border-border p-4 animate-slide-down z-40">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects, tasks..."
                  className="pl-10"
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                ×
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
