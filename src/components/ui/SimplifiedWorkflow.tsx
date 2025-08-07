import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  action?: () => void;
  actionLabel?: string;
}

interface SimplifiedWorkflowProps {
  steps: WorkflowStep[];
  title: string;
  className?: string;
}

export function SimplifiedWorkflow({ steps, title, className = '' }: SimplifiedWorkflowProps) {
  const activeStepIndex = steps.findIndex(step => step.status === 'active');
  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      
      {/* Progress Indicator */}
      <div className="flex items-center space-x-2 mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step.status === 'completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : step.status === 'active'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              {step.status === 'completed' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current Step Details */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">
            {currentStep.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {currentStep.description}
          </p>
        </div>

        {currentStep.action && currentStep.actionLabel && (
          <Button
            variant="primary"
            onClick={currentStep.action}
            className="w-full"
          >
            {currentStep.actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}