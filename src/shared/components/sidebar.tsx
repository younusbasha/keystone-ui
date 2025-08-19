import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  Shield,
  Settings,
  ScrollText,
  Bot,
  Users,
  FolderOpen,
  Zap,
  Rocket,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles: UserRole[];
  badge?: string;
}

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
  },
  {
    to: '/projects',
    icon: FolderOpen,
    label: 'Projects',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
  },
  {
    to: '/requirements',
    icon: FileText,
    label: 'Requirements',
    roles: ['PM', 'BA'],
  },
  {
    to: '/tasks',
    icon: GitBranch,
    label: 'Task Breakdown',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
    badge: 'New',
  },
  {
    to: '/agents',
    icon: Bot,
    label: 'AI Agents',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
  },
  {
    to: '/agent-review',
    icon: Shield,
    label: 'Agent Review',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
  },
  {
    to: '/integrations',
    icon: Zap,
    label: 'Integrations',
    roles: ['PM', 'BA'],
  },
  {
    to: '/deployment',
    icon: Rocket,
    label: 'Deployment',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
  },
  {
    to: '/permissions',
    icon: Users,
    label: 'Permissions',
    roles: ['PM'],
  },
  {
    to: '/audit-logs',
    icon: ScrollText,
    label: 'Audit Logs',
    roles: ['PM', 'Developer', 'Reviewer'],
  },
  {
    to: '/settings',
    icon: Settings,
    label: 'Settings',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
  },
];

export function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  return (
    <div className={cn(
      "h-full bg-card/95 backdrop-blur-xl border-r border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out",
      isMobile ? 'w-64' : sidebarWidth,
      isMobile && 'animate-slide-in-left'
    )}>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className={cn(
            "flex items-center transition-all duration-300",
            isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'
          )}>
            <img 
              src="/techsophy-logo.svg" 
              alt="TechSophy" 
              className={cn(
                "text-primary transition-all duration-300",
                isCollapsed && !isMobile ? 'h-8 w-8' : 'h-10 w-auto'
              )}
            />
            {(!isCollapsed || isMobile) && (
              <div className="ml-2 animate-fade-in">
                <div className="text-lg font-bold gradient-text">TechSophy</div>
                <div className="text-xs text-muted-foreground">AI Development Platform</div>
              </div>
            )}
          </div>
          
          {/* Mobile close button */}
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={cn(
                "nav-link group",
                isActive && 'active',
                isCollapsed && !isMobile ? 'justify-center px-3' : 'px-4'
              )}
            >
              <div className="flex items-center">
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isCollapsed && !isMobile ? '' : 'mr-3'
                )} />
                {(!isCollapsed || isMobile) && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
              </div>
              
              {/* Badge for new features */}
              {item.badge && (!isCollapsed || isMobile) && (
                <Badge variant="secondary" className="text-xs animate-pulse-soft">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User info section */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-t border-border animate-fade-in">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {user.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {user.role} • Online
              </div>
            </div>
            <div className="status-indicator online"></div>
          </div>
        </div>
      )}
      
      {/* Collapse Toggle - Desktop only */}
      {!isMobile && (
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center group"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 transition-transform group-hover:scale-110" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
