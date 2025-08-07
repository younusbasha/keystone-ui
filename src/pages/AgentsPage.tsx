import React, { useState } from 'react';
import { Bot, Plus, Settings, Activity, MessageSquare, Zap, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { mockAgents, mockAgentCommunications } from '../data/mockData';
import { Agent, AgentType, AgentCommunication, IntegrationType } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

export function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'communications' | 'performance'>('overview');
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: 'requirements-parser' as AgentType,
    description: '',
    capabilities: [] as string[],
    integrations: [] as IntegrationType[],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'busy': return 'warning';
      case 'idle': return 'default';
      case 'error': return 'error';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type: AgentType) => {
    switch (type) {
      case 'requirements-parser': return 'info';
      case 'task-planner': return 'warning';
      case 'story-generator': return 'success';
      case 'code-generator': return 'agent';
      case 'reviewer': return 'error';
      case 'deployment': return 'default';
      case 'orchestrator': return 'human';
      default: return 'default';
    }
  };

  const getCommunicationTypeColor = (type: string) => {
    switch (type) {
      case 'delegation': return 'info';
      case 'escalation': return 'error';
      case 'collaboration': return 'success';
      case 'status-update': return 'default';
      default: return 'default';
    }
  };

  const handleAddAgent = () => {
    // In real app, this would call an API
    console.log('Adding agent:', newAgent);
    setIsAddAgentModalOpen(false);
    setNewAgent({
      name: '',
      type: 'requirements-parser',
      description: '',
      capabilities: [],
      integrations: [],
    });
    alert('Agent added successfully!');
  };

  const communicationColumns = [
    {
      key: 'timestamp',
      header: 'Time',
      render: (comm: AgentCommunication) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {formatDistanceToNow(comm.timestamp)} ago
        </div>
      ),
    },
    {
      key: 'fromAgent',
      header: 'From',
      render: (comm: AgentCommunication) => {
        const agent = mockAgents.find(a => a.id === comm.fromAgent);
        return (
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {agent?.name || comm.fromAgent}
            </span>
          </div>
        );
      },
    },
    {
      key: 'toAgent',
      header: 'To',
      render: (comm: AgentCommunication) => {
        const agent = mockAgents.find(a => a.id === comm.toAgent);
        return (
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {agent?.name || comm.toAgent}
            </span>
          </div>
        );
      },
    },
    {
      key: 'type',
      header: 'Type',
      render: (comm: AgentCommunication) => (
        <Badge variant={getCommunicationTypeColor(comm.type)}>
          {comm.type}
        </Badge>
      ),
    },
    {
      key: 'message',
      header: 'Message',
      render: (comm: AgentCommunication) => (
        <div className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400">
          {comm.message}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (comm: AgentCommunication) => (
        <Badge variant={comm.status === 'processed' ? 'success' : 'warning'}>
          {comm.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Agents
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage your AI agents
          </p>
        </div>
        
        <Button 
          variant="primary" 
          icon={Plus}
          onClick={() => setIsAddAgentModalOpen(true)}
        >
          Add Agent
        </Button>
      </div>

      {/* Agent Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAgents.map((agent) => (
          <Card key={agent.id} hoverable className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Bot className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {agent.name}
                    </h3>
                    <Badge variant={getTypeColor(agent.type)} size="sm">
                      {agent.type}
                    </Badge>
                  </div>
                </div>
                <Badge variant={getStatusColor(agent.status)}>
                  {agent.status}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {agent.description}
              </p>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {agent.successRate}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {agent.totalTasks}
                  </div>
                </div>
              </div>

              {/* Current Task */}
              {agent.currentTask && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Current Task
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {agent.currentTask}
                  </p>
                </div>
              )}

              {/* Capabilities */}
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Capabilities
                </div>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 3).map((capability) => (
                    <span
                      key={capability}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300"
                    >
                      {capability}
                    </span>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300">
                      +{agent.capabilities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Active {formatDistanceToNow(agent.lastActivity)} ago
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Settings}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setIsConfigModalOpen(true);
                    }}
                  >
                    Config
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={MessageSquare}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setActiveTab('communications');
                    }}
                  >
                    Logs
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Agent Communications */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Agent Communications
            </h2>
          </div>
        </div>
        <Table
          data={mockAgentCommunications}
          columns={communicationColumns}
          emptyMessage="No agent communications found"
        />
      </Card>

      {/* Agent Configuration Modal */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setSelectedAgent(null);
        }}
        title={`Configure ${selectedAgent?.name}`}
        maxWidth="lg"
      >
        {selectedAgent && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={selectedAgent.name}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <Badge variant={getTypeColor(selectedAgent.type)}>
                    {selectedAgent.type}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Configuration
              </h3>
              <div className="space-y-4">
                {Object.entries(selectedAgent.configuration).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type={typeof value === 'number' ? 'number' : 'text'}
                      value={value}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Integrations */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Integrations
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.integrations.map((integration) => (
                  <Badge key={integration} variant="info">
                    {integration}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setIsConfigModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary">
                Save Configuration
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Agent Modal */}
      <Modal
        isOpen={isAddAgentModalOpen}
        onClose={() => {
          setIsAddAgentModalOpen(false);
          setNewAgent({
            name: '',
            type: 'requirements-parser',
            description: '',
            capabilities: [],
            integrations: [],
          });
        }}
        title="Add New Agent"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Agent Name
            </label>
            <input
              type="text"
              value={newAgent.name}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter agent name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Agent Type
            </label>
            <select
              value={newAgent.type}
              onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value as AgentType })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="requirements-parser">Requirements Parser</option>
              <option value="task-planner">Task Planner</option>
              <option value="story-generator">Story Generator</option>
              <option value="code-generator">Code Generator</option>
              <option value="reviewer">Code Reviewer</option>
              <option value="deployment">Deployment Orchestrator</option>
              <option value="orchestrator">Master Orchestrator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={newAgent.description}
              onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Describe what this agent does"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Capabilities
            </label>
            <div className="space-y-2">
              {['NLP processing', 'Code generation', 'Task planning', 'Security analysis', 'Testing', 'Deployment'].map((capability) => (
                <label key={capability} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newAgent.capabilities.includes(capability)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewAgent({
                          ...newAgent,
                          capabilities: [...newAgent.capabilities, capability]
                        });
                      } else {
                        setNewAgent({
                          ...newAgent,
                          capabilities: newAgent.capabilities.filter(c => c !== capability)
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {capability}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Integrations
            </label>
            <div className="space-y-2">
              {(['github', 'jira', 'jenkins', 'gcp', 'firebase', 'slack'] as IntegrationType[]).map((integration) => (
                <label key={integration} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newAgent.integrations.includes(integration)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewAgent({
                          ...newAgent,
                          integrations: [...newAgent.integrations, integration]
                        });
                      } else {
                        setNewAgent({
                          ...newAgent,
                          integrations: newAgent.integrations.filter(i => i !== integration)
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {integration.charAt(0).toUpperCase() + integration.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setIsAddAgentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddAgent}
              disabled={!newAgent.name.trim() || !newAgent.description.trim()}
            >
              Add Agent
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}