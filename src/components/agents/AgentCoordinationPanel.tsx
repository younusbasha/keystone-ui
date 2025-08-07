import React, { useState } from 'react';
import { Bot, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { AgentCoordination, ConflictResolution } from '../../types';

interface AgentCoordinationPanelProps {
  coordinations: AgentCoordination[];
  onResolveConflict: (coordinationId: string, resolution: ConflictResolution) => void;
}

export function AgentCoordinationPanel({ coordinations, onResolveConflict }: AgentCoordinationPanelProps) {
  const [selectedCoordination, setSelectedCoordination] = useState<AgentCoordination | null>(null);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'executing': return 'info';
      case 'planning': return 'warning';
      case 'conflict': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'executing': return Clock;
      case 'planning': return Users;
      case 'conflict': return AlertTriangle;
      default: return Bot;
    }
  };

  const handleConflictResolution = (strategy: ConflictResolution['strategy']) => {
    if (selectedCoordination) {
      const resolution: ConflictResolution = {
        strategy,
        resolver: 'human-reviewer',
        timestamp: new Date().toISOString(),
        resolution: `Resolved via ${strategy}`,
      };
      onResolveConflict(selectedCoordination.id, resolution);
      setIsConflictModalOpen(false);
      setSelectedCoordination(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Agent Coordination
      </h3>
      
      {coordinations.map((coordination) => {
        const StatusIcon = getStatusIcon(coordination.status);
        
        return (
          <Card key={coordination.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <StatusIcon className="w-5 h-5 mt-1 text-blue-600" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Task #{coordination.taskId}
                    </h4>
                    <Badge variant={getStatusColor(coordination.status)}>
                      {coordination.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Primary Agent:</span>
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        {coordination.primaryAgent}
                      </span>
                    </div>
                    
                    {coordination.collaboratingAgents.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Collaborating:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {coordination.collaboratingAgents.map((agent) => (
                            <Badge key={agent} variant="agent" size="sm">
                              {agent}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {coordination.status === 'conflict' && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={AlertTriangle}
                    onClick={() => {
                      setSelectedCoordination(coordination);
                      setIsConflictModalOpen(true);
                    }}
                  >
                    Resolve Conflict
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Conflict Resolution Modal */}
      <Modal
        isOpen={isConflictModalOpen}
        onClose={() => {
          setIsConflictModalOpen(false);
          setSelectedCoordination(null);
        }}
        title="Resolve Agent Conflict"
        maxWidth="lg"
      >
        {selectedCoordination && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-medium text-red-900 dark:text-red-200 mb-2">
                Conflict Detected
              </h4>
              <p className="text-sm text-red-800 dark:text-red-300">
                Multiple agents are attempting to modify the same resource. Choose a resolution strategy:
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleConflictResolution('human_review')}
                className="w-full justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">Human Review</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Escalate to human reviewer for manual resolution
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => handleConflictResolution('priority_based')}
                className="w-full justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">Priority Based</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Let higher priority agent proceed
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => handleConflictResolution('rollback')}
                className="w-full justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">Rollback</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Revert all changes and restart coordination
                  </div>
                </div>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}