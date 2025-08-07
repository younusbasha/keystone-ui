import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Filter, Bot } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { mockAgentActions } from '../data/mockData';
import { AgentAction, RiskLevel } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

export function AgentReviewPage() {
  const [selectedAction, setSelectedAction] = useState<AgentAction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'escalated': return 'warning';
      default: return 'default';
    }
  };

  const handleApprove = (actionId: string) => {
    console.log('Approved action:', actionId);
    // In real app, this would update the backend
  };

  const handleReject = (actionId: string) => {
    console.log('Rejected action:', actionId);
    // In real app, this would update the backend
  };

  const handleEscalate = (actionId: string) => {
    console.log('Escalated action:', actionId);
    // In real app, this would escalate to human reviewer
  };

  const filteredActions = mockAgentActions.filter(action => {
    if (filterRisk !== 'all' && action.riskLevel !== filterRisk) return false;
    if (filterStatus !== 'all' && action.status !== filterStatus) return false;
    return true;
  });

  const columns = [
    {
      key: 'agentName',
      header: 'Agent',
      render: (action: AgentAction) => (
        <div className="flex items-center space-x-3">
          <Bot className="w-5 h-5 text-purple-600" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {action.agentName}
            </div>
            <div className="text-sm text-gray-500">
              {formatDistanceToNow(action.timestamp)} ago
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (action: AgentAction) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {action.action}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {action.dataTouched}
          </div>
        </div>
      ),
    },
    {
      key: 'riskLevel',
      header: 'Risk Level',
      render: (action: AgentAction) => (
        <Badge variant={getRiskColor(action.riskLevel)}>
          {action.riskLevel}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (action: AgentAction) => (
        <Badge variant={getStatusColor(action.status)}>
          {action.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (action: AgentAction) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedAction(action);
              setIsModalOpen(true);
            }}
          >
            View Details
          </Button>
          {action.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                icon={CheckCircle}
                onClick={() => handleApprove(action.id)}
                className="text-green-600 hover:text-green-700"
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={XCircle}
                onClick={() => handleReject(action.id)}
                className="text-red-600 hover:text-red-700"
              >
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={AlertTriangle}
                onClick={() => handleEscalate(action.id)}
                className="text-yellow-600 hover:text-yellow-700"
              >
                Escalate
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agent Action Review
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve actions taken by AI agents
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Risk Level
                </label>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value as RiskLevel | 'all')}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions Table */}
      <Card>
        <Table
          data={filteredActions}
          columns={columns}
          emptyMessage="No agent actions found"
        />
      </Card>

      {/* Action Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAction(null);
        }}
        title="Agent Action Details"
        maxWidth="lg"
      >
        {selectedAction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Agent Name
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedAction.agentName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Risk Level
                </label>
                <div className="mt-1">
                  <Badge variant={getRiskColor(selectedAction.riskLevel)}>
                    {selectedAction.riskLevel}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Action Taken
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {selectedAction.action}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {selectedAction.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Impact Description
              </label>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {selectedAction.impactDescription}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Data Touched
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {selectedAction.dataTouched}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Timestamp
              </label>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {new Date(selectedAction.timestamp).toLocaleString()}
              </p>
            </div>

            {selectedAction.status === 'pending' && (
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="primary"
                  icon={CheckCircle}
                  onClick={() => {
                    handleApprove(selectedAction.id);
                    setIsModalOpen(false);
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  icon={XCircle}
                  onClick={() => {
                    handleReject(selectedAction.id);
                    setIsModalOpen(false);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="outline"
                  icon={AlertTriangle}
                  onClick={() => {
                    handleEscalate(selectedAction.id);
                    setIsModalOpen(false);
                  }}
                >
                  Escalate to Human
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}