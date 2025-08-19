import React from 'react';
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
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Button } from '@/components/ui/button';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles: UserRole[];
  badge?: string;
  color?: string;
}

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
    color: 'text-primary',
  },
  {
    to: '/projects',
    icon: FolderOpen,
    label: 'Projects',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
    color: 'text-secondary',
  },
  {
    to: '/requirements',
    icon: FileText,
    label: 'Requirements',
    roles: ['PM', 'BA'],
    color: 'text-accent',
  },
  {
    to: '/tasks',
    icon: GitBranch,
    label: 'Task Breakdown',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
    badge: 'New',
    color: 'text-warning',
  },
  {
    to: '/agents',
    icon: Bot,
    label: 'AI Agents',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
    color: 'text-primary',
  },
  {
    to: '/agent-review',
    icon: Shield,
    label: 'Agent Review',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
    color: 'text-success',
  },
  {
    to: '/integrations',
    icon: Zap,
    label: 'Integrations',
    roles: ['PM', 'BA'],
    color: 'text-warning',
  },
  {
    to: '/deployment',
    icon: Rocket,
    label: 'Deployment',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
    color: 'text-secondary',
  },
  {
    to: '/permissions',
    icon: Users,
    label: 'Permissions',
    roles: ['PM'],
    color: 'text-destructive',
  },
  {
    to: '/audit-logs',
    icon: ScrollText,
    label: 'Audit Logs',
    roles: ['PM', 'Developer', 'Reviewer'],
    color: 'text-muted-foreground',
  },
  {
    to: '/settings',
    icon: Settings,
    label: 'Settings',
    roles: ['PM', 'BA', 'Developer', 'Reviewer'],
    color: 'text-muted-foreground',
  },
];

export function Sidebar({ 
  isMobile = false, 
  isOpen = false, 
  isCollapsed = false, 
  onClose,
  onToggleCollapse 
}: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`
      ${isMobile ? 'w-72' : isCollapsed ? 'w-20' : 'w-72'} 
      h-full bg-card/95 backdrop-blur-xl border-r border-border/50
      flex flex-col shadow-lg transition-all duration-300 ease-in-out
      ${isMobile ? 'animate-slide-in-right' : ''}
    `}>
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}`}>
            <div className="relative">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
                <Sparkles className={`${isCollapsed && !isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="animate-fade-in">
                <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Keystone
                </div>
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
              className="h-8 w-8 p-0"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''} ${
                  isCollapsed && !isMobile ? 'justify-center px-3' : 'px-4'
                }`
              }
            >
              <div className="flex items-center min-w-0">
                <Icon className={`h-5 w-5 ${item.color} ${
                  isCollapsed && !isMobile ? '' : 'mr-3'
                } transition-all duration-200 group-hover:scale-110 ${
                  isActive ? 'text-primary' : ''
                }`} />
                {(!isCollapsed || isMobile) && (
                  <span className="truncate flex-1 font-medium">{item.label}</span>
                )}
              </div>
              
              {/* Badge for new features */}
              {item.badge && (!isCollapsed || isMobile) && (
                <span className="badge-modern animate-pulse">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User info section */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-t border-border/50 animate-fade-in">
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/30">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success border-2 border-card rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">
                  {user.name}
                </div>
                <div className="text-xs text-muted-foreground flex items-center">
                  {user.role} 
                  <span className="mx-1">•</span>
                  <span className="text-success">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Collapse Toggle - Desktop only */}
      {!isMobile && onToggleCollapse && (
        <div className="p-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-start'
            } group hover:bg-accent/10`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 transition-transform group-hover:scale-110" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}