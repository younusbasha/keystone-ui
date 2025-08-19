import { useState } from 'react';
import { Bot, Plus, Settings, Activity, MessageSquare, Zap, Users, Shield, Cpu } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { mockAgents, mockAgentCommunications } from '../data/mockData';
import { Agent, AgentType, AgentCommunication, IntegrationType } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

// Simple Button component to replace the problematic import
const Button = ({ children, onClick, disabled, className, variant = 'default', ...props }: any) => {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses: { [key: string]: string } = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className || ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Badge component to replace the problematic import
const Badge = ({ children, variant = 'default', className }: any) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses: { [key: string]: string } = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    secondary: "bg-purple-100 text-purple-800",
    outline: "border border-gray-300 text-gray-700"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className || ''}`}>
      {children}
    </span>
  );
};

export function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
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
      case 'error': return 'destructive';
      case 'offline': return 'destructive';
      default: return 'default';
    }
  };

  const getTypeColor = (type: AgentType) => {
    switch (type) {
      case 'requirements-parser': return 'info';
      case 'task-planner': return 'warning';
      case 'story-generator': return 'success';
      case 'code-generator': return 'secondary';
      case 'reviewer': return 'destructive';
      case 'deployment': return 'default';
      case 'orchestrator': return 'outline';
      default: return 'default';
    }
  };

  const getCommunicationTypeColor = (type: string) => {
    switch (type) {
      case 'delegation': return 'info';
      case 'escalation': return 'destructive';
      case 'collaboration': return 'success';
      case 'status-update': return 'default';
      default: return 'default';
    }
  };

  const getAgentIcon = (type: AgentType) => {
    switch (type) {
      case 'requirements-parser': return MessageSquare;
      case 'task-planner': return Settings;
      case 'story-generator': return Bot;
      case 'code-generator': return Zap;
      case 'reviewer': return Shield;
      case 'deployment': return Activity;
      case 'orchestrator': return Users;
      default: return Bot;
    }
  };

  const handleAddAgent = () => {
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
        <div className="text-sm text-gray-600">
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
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
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
            <Bot className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">
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
        <div className="max-w-xs truncate text-sm text-gray-600">
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
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <Cpu className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Agents
              </h1>
              <p className="text-gray-600">
                Monitor and manage your intelligent automation agents
              </p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => setIsAddAgentModalOpen(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{mockAgents.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockAgents.filter(a => a.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks Today</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <Zap className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Active Agents</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAgents.map((agent) => {
            const IconComponent = getAgentIcon(agent.type);
            return (
              <div
                key={agent.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                onClick={() => {
                  setSelectedAgent(agent);
                  setIsConfigModalOpen(true);
                }}
              >
                <div className="space-y-4">
                  {/* Agent Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${
                        agent.status === 'active' ? 'from-green-50 to-green-100' :
                        agent.status === 'busy' ? 'from-yellow-50 to-yellow-100' :
                        'from-gray-50 to-gray-100'
                      }`}>
                        <IconComponent className={`h-6 w-6 ${
                          agent.status === 'active' ? 'text-green-600' :
                          agent.status === 'busy' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {agent.name}
                        </h3>
                        <Badge variant={getTypeColor(agent.type)} className="text-xs">
                          {agent.type.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>

                  {/* Agent Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {agent.description}
                  </p>

                  {/* Agent Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {agent.totalTasks || 0}
                      </div>
                      <div className="text-xs text-gray-600">Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.round(agent.successRate || 0)}%
                      </div>
                      <div className="text-xs text-gray-600">Success</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatDistanceToNow(agent.lastActivity)}
                      </div>
                      <div className="text-xs text-gray-600">Last Active</div>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 font-medium">Capabilities</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.slice(0, 3).map((cap, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md"
                        >
                          {cap}
                        </span>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-md">
                          +{agent.capabilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Communications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Communications
              </h2>
              <p className="text-sm text-gray-600">
                Inter-agent communication logs
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Table
            data={mockAgentCommunications.slice(0, 10)}
            columns={communicationColumns}
          />
        </div>
      </div>

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
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                {(() => {
                  const IconComponent = getAgentIcon(selectedAgent.type);
                  return <IconComponent className="h-8 w-8 text-blue-600" />;
                })()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedAgent.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={getTypeColor(selectedAgent.type)}>
                    {selectedAgent.type.replace('-', ' ')}
                  </Badge>
                  <Badge variant={getStatusColor(selectedAgent.status)}>
                    {selectedAgent.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tasks Completed</span>
                    <span className="font-semibold text-gray-900">{selectedAgent.totalTasks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-gray-900">{Math.round(selectedAgent.successRate || 0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Active</span>
                    <span className="font-semibold text-gray-900">{formatDistanceToNow(selectedAgent.lastActivity)} ago</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Configuration</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Status
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="active">Active</option>
                      <option value="idle">Idle</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Priority Level
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Capabilities</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.capabilities.map((cap, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsConfigModalOpen(false)}
              >
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Save Changes
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
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Agent Name
              </label>
              <input
                type="text"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agent name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Agent Type
              </label>
              <select
                value={newAgent.type}
                onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value as AgentType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="requirements-parser">Requirements Parser</option>
                <option value="task-planner">Task Planner</option>
                <option value="story-generator">Story Generator</option>
                <option value="code-generator">Code Generator</option>
                <option value="reviewer">Code Reviewer</option>
                <option value="deployment">Deployment Agent</option>
                <option value="orchestrator">Orchestrator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={newAgent.description}
              onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the agent's purpose and capabilities"
            />
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <Bot className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">AI Agent Configuration</h4>
                <p className="text-sm text-gray-600 mt-1">
                  The agent will be automatically configured with appropriate capabilities and integrations
                  based on the selected type.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsAddAgentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAgent}
              disabled={!newAgent.name.trim()}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Agent
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
