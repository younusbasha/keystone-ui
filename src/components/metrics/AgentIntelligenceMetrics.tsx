import React from 'react';
import { Bot, User, TrendingUp, Activity, Zap, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface AgentMetrics {
  totalTasks: number;
  agentHandled: number;
  humanIntervention: number;
  automationRate: number;
  efficiency: number;
  successRate: number;
}

interface ProjectMetrics {
  projectId: string;
  projectName: string;
  metrics: AgentMetrics;
}

interface AgentIntelligenceMetricsProps {
  overallMetrics: AgentMetrics;
  projectMetrics: ProjectMetrics[];
  className?: string;
}

export function AgentIntelligenceMetrics({ 
  overallMetrics, 
  projectMetrics, 
  className = '' 
}: AgentIntelligenceMetricsProps) {
  const getAutomationColor = (rate: number) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'error';
  };

  const formatPercentage = (value: number) => `${Math.round(value)}%`;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Intelligence Metrics */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-900 rounded-lg">
              <Bot className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Agent Intelligence Overview
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                AI automation vs human intervention across all projects
              </p>
            </div>
          </div>
          <Badge variant={getAutomationColor(overallMetrics.automationRate)} size="md">
            {formatPercentage(overallMetrics.automationRate)} Automated
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Automation Rate */}
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-neutral-200 dark:text-neutral-700"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${overallMetrics.automationRate}, 100`}
                  className="text-brand-600 dark:text-brand-400"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {formatPercentage(overallMetrics.automationRate)}
                </span>
              </div>
            </div>
            <div className="text-sm font-medium text-neutral-900 dark:text-white">Automation Rate</div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              {overallMetrics.agentHandled} of {overallMetrics.totalTasks} tasks
            </div>
          </div>

          {/* Agent Tasks */}
          <div className="flex items-center space-x-3 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
            <div className="p-2 bg-brand-100 dark:bg-brand-800 rounded-lg">
              <Bot className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-900 dark:text-brand-100">
                {overallMetrics.agentHandled}
              </div>
              <div className="text-sm text-brand-700 dark:text-brand-300">Agent Tasks</div>
            </div>
          </div>

          {/* Human Intervention */}
          <div className="flex items-center space-x-3 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
            <div className="p-2 bg-warning-100 dark:bg-warning-800 rounded-lg">
              <User className="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-warning-900 dark:text-warning-100">
                {overallMetrics.humanIntervention}
              </div>
              <div className="text-sm text-warning-700 dark:text-warning-300">Human Tasks</div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="flex items-center space-x-3 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
            <div className="p-2 bg-success-100 dark:bg-success-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-success-900 dark:text-success-100">
                {formatPercentage(overallMetrics.successRate)}
              </div>
              <div className="text-sm text-success-700 dark:text-success-300">Success Rate</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Project Breakdown */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-accent-100 dark:bg-accent-900 rounded-lg">
            <TrendingUp className="w-6 h-6 text-accent-600 dark:text-accent-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Project Intelligence Breakdown
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Agent performance metrics per project
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {projectMetrics.map((project) => (
            <div key={project.projectId} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-neutral-900 dark:text-white">
                  {project.projectName}
                </h4>
                <Badge variant={getAutomationColor(project.metrics.automationRate)}>
                  {formatPercentage(project.metrics.automationRate)} automated
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {project.metrics.totalTasks}
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">Total Tasks</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-brand-600 dark:text-brand-400">
                    {project.metrics.agentHandled}
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">Agent Handled</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-warning-600 dark:text-warning-400">
                    {project.metrics.humanIntervention}
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">Human Required</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-success-600 dark:text-success-400">
                    {formatPercentage(project.metrics.successRate)}
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">Success Rate</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  <span>Agent vs Human Distribution</span>
                  <span>{formatPercentage(project.metrics.automationRate)} automated</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div 
                    className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.metrics.automationRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}