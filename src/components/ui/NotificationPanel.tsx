import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X, Clock } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPanel({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead 
}: NotificationPanelProps) {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="absolute right-0 top-12 w-96 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-strong z-50 animate-slide-down">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <Badge variant="error" size="sm">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={onClose}
            />
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-brand-50 dark:bg-brand-900/20' : ''
                  }`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${getIconColor(notification.type)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead
                            ? 'text-neutral-900 dark:text-white'
                            : 'text-neutral-700 dark:text-neutral-300'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-brand-500 rounded-full ml-2" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-1 mt-2">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        {formatDistanceToNow(notification.timestamp)} ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}