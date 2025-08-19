import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '../components/ui/Modal';
import { mockDeploymentPipelines } from '../data/mockData';
import { DeploymentPipeline, DeploymentStage } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

export function DeploymentPage() {
  const [selectedPipeline, setSelectedPipeline] = useState<DeploymentPipeline | null>(null);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<DeploymentStage | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'running': return 'warning';
      case 'failed': return 'error';
      case 'idle': return 'default';
      default: return 'default';
    }
  };

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'running': return Clock;
      case 'failed': return XCircle;
      case 'pending': return Clock;
      case 'skipped': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'running': return 'text-blue-500 animate-spin';
      case 'failed': return 'text-red-500';
      case 'pending': return 'text-gray-400';
      case 'skipped': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  const handleRunPipeline = (pipeline: DeploymentPipeline) => {
    console.log('Running pipeline:', pipeline.name);
    // In real app, this would trigger the pipeline
    alert(`Starting pipeline: ${pipeline.name}`);
  };

  const handleStopPipeline = (pipeline: DeploymentPipeline) => {
    console.log('Stopping pipeline:', pipeline.name);
    // In real app, this would stop the pipeline
    alert(`Stopping pipeline: ${pipeline.name}`);
  };

  const handleViewLogs = (stage: DeploymentStage) => {
    setSelectedStage(stage);
    setIsLogsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Deployment Pipelines
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage your CI/CD pipelines
          </p>
        </div>
        
        <Button variant="default" icon={Settings}>
          Configure Pipeline
        </Button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockDeploymentPipelines.map((pipeline) => (
          <Card key={pipeline.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {pipeline.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last run {formatDistanceToNow(pipeline.lastRun)} ago
                  </p>
                </div>
                <Badge variant={getStatusColor(pipeline.status)}>
                  {pipeline.status}
                </Badge>
              </div>

              {/* Pipeline Stages */}
              <div className="space-y-3">
                {pipeline.stages.map((stage, index) => {
                  const StatusIcon = getStageStatusIcon(stage.status);
                  const isLast = index === pipeline.stages.length - 1;
                  
                  return (
                    <div key={stage.id} className="relative">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <StatusIcon className={`w-5 h-5 ${getStageStatusColor(stage.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {stage.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {stage.duration && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {stage.duration}s
                                </span>
                              )}
                              <Badge variant={getStatusColor(stage.status)}>
                                {stage.status}
                              </Badge>
                              {stage.logs.length > 0 && (
                                <Button
                                  variant="ghost"
                                 
                                  onClick={() => handleViewLogs(stage)}
                                  className="text-xs"
                                >
                                  Logs
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {stage.type} stage
                          </p>
                        </div>
                      </div>
                      
                      {/* Connection line to next stage */}
                      {!isLast && (
                        <div className="absolute left-2.5 top-6 w-0.5 h-4 bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pipeline Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  {pipeline.status === 'idle' || pipeline.status === 'failed' ? (
                    <Button
                      variant="default"
                     
                      icon={Play}
                      onClick={() => handleRunPipeline(pipeline)}
                    >
                      Run
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                     
                      icon={Pause}
                      onClick={() => handleStopPipeline(pipeline)}
                    >
                      Stop
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                   
                    icon={RotateCcw}
                    onClick={() => handleRunPipeline(pipeline)}
                  >
                    Retry
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                 
                  icon={Settings}
                  onClick={() => setSelectedPipeline(pipeline)}
                >
                  Configure
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Deployment History */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Deployments
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockDeploymentPipelines.map((pipeline) => (
              <div key={`history-${pipeline.id}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant={getStatusColor(pipeline.status)}>
                    {pipeline.status}
                  </Badge>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {pipeline.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Deployed {formatDistanceToNow(pipeline.lastRun)} ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {pipeline.stages.filter(s => s.status === 'success').length}/{pipeline.stages.length} stages
                  </span>
                  <Button variant="ghost">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Stage Logs Modal */}
      <Modal
        isOpen={isLogsModalOpen}
        onClose={() => {
          setIsLogsModalOpen(false);
          setSelectedStage(null);
        }}
        title={`${selectedStage?.name} Logs`}
        maxWidth="xl"
      >
        {selectedStage && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant={getStatusColor(selectedStage.status)}>
                {selectedStage.status}
              </Badge>
              {selectedStage.duration && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Duration: {selectedStage.duration}s
                </span>
              )}
            </div>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {selectedStage.logs.map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}