import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
}

export function Card({ 
  children, 
  className = '', 
  padding = 'md', 
  hoverable = false,
  variant = 'default'
}: CardProps) {
  const baseClasses = 'rounded-xl transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-soft',
    elevated: 'bg-white dark:bg-neutral-800 shadow-medium border-0',
    bordered: 'bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700',
    glass: 'glass-effect border border-neutral-200/50 dark:border-neutral-700/50 shadow-soft',
  };
  
  const hoverClasses = hoverable ? 'card-hover cursor-pointer' : '';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}