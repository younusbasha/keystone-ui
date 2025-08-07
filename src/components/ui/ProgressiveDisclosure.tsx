import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface ProgressiveDisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  level?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

export function ProgressiveDisclosure({ 
  title, 
  children, 
  defaultOpen = false, 
  level = 'primary',
  className = '' 
}: ProgressiveDisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const levelStyles = {
    primary: 'text-lg font-semibold text-gray-900 dark:text-white',
    secondary: 'text-base font-medium text-gray-800 dark:text-gray-200',
    tertiary: 'text-sm font-medium text-gray-700 dark:text-gray-300',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full justify-start p-2 ${levelStyles[level]}`}
        icon={isOpen ? ChevronDown : ChevronRight}
      >
        {title}
      </Button>
      
      {isOpen && (
        <div className="pl-6 space-y-2 animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );
}