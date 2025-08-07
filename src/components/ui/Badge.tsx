import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'agent' | 'human' | 'brand' | 'techsophy';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', size = 'sm', children, className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
    success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
    error: 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200',
    info: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
    agent: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200',
    human: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    brand: 'gradient-brand text-white shadow-soft',
    techsophy: 'bg-techsophy-100 text-techsophy-800 dark:bg-techsophy-900 dark:text-techsophy-200',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}