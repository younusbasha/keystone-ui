import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles: UserRole[];
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

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 h-full transition-all duration-300 flex flex-col shadow-soft`}>
      <div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <img 
            src="/techsophy-logo.svg" 
            alt="TechSophy" 
            className={`${isCollapsed ? 'h-8 w-8' : 'h-10 w-auto'} text-techsophy-600 dark:text-white`}
          />
          {!isCollapsed && (
            <div className="ml-2">
              {/* Logo text is included in SVG */}
            </div>
          )}
        </div>
      </div>
      
      <nav className="px-4 space-y-2 flex-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-techsophy-100 text-techsophy-700 dark:bg-techsophy-900 dark:text-techsophy-200 shadow-soft'
                  : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 hover:shadow-soft'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      {/* Collapse Toggle */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 hover:shadow-soft"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}