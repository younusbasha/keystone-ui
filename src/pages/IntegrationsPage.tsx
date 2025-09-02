import React, { useState, useEffect } from 'react';
import { Plus, Settings, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '../components/ui/Modal';
import { integrationsService } from '../services/integrationsService';
import { Integration, IntegrationType } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    type: 'github' as IntegrationType,
    name: '',
    configuration: {} as Record<string, any>,
  });

  // Load integrations from API
  useEffect(() => {
    const loadIntegrations = async () => {
      setIsLoading(true);
      try {
        const integrationsResponse = await integrationsService.listIntegrations({ limit: 50 });
        setIntegrations(integrationsResponse.items);
      } catch (error) {
        console.error('Failed to load integrations:', error);
        setIntegrations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadIntegrations();
  }, []);

  const integrationTypes = [
    { type: 'github', name: 'GitHub', icon: '🐙', description: 'Source code management and version control' },
    { type: 'jira', name: 'Jira', icon: '📋', description: 'Project management and issue tracking' },
    { type: 'jenkins', name: 'Jenkins', icon: '🔧', description: 'Continuous integration and deployment' },
    { type: 'gcp', name: 'Google Cloud', icon: '☁️', description: 'Cloud infrastructure and services' },
    { type: 'firebase', name: 'Firebase', icon: '🔥', description: 'Backend services and hosting' },
    { type: 'slack', name: 'Slack', icon: '💬', description: 'Team communication and notifications' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'success';
      case 'disconnected': return 'default';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'disconnected': return XCircle;
      case 'error': return XCircle;
      default: return XCircle;
    }
  };

  const handleAddIntegration = () => {
    // In real app, this would call an API
    console.log('Adding integration:', newIntegration);
    setIsAddModalOpen(false);
    setNewIntegration({
      type: 'github',
      name: '',
      configuration: {},
    });
  };

  const handleTestConnection = (integration: Integration) => {
    // In real app, this would test the connection
    console.log('Testing connection for:', integration.name);
    alert(`Testing connection to ${integration.name}...`);
  };

  const handleSync = (integration: Integration) => {
    // In real app, this would trigger a sync
    console.log('Syncing:', integration.name);
    alert(`Syncing ${integration.name}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Integrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your tools and services to enable agent automation
          </p>
        </div>
        
        <Button 
          variant="default" 
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Integration
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading integrations...</p>
          </div>
        </div>
      ) : (
        <>
      {/* Connected Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const typeInfo = integrationTypes.find(t => t.type === integration.type);
          const StatusIcon = getStatusIcon(integration.status);
          
          return (
            <Card key={integration.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{typeInfo?.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {typeInfo?.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`w-5 h-5 ${
                      integration.status === 'connected' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <Badge variant={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>
                </div>

                {/* Configuration Preview */}
                <div className="space-y-2">
                  {Object.entries(integration.configuration).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </span>
                      <span className="text-gray-900 dark:text-white font-mono text-xs">
                        {typeof value === 'string' && value.length > 30 
                          ? `${value.substring(0, 30)}...` 
                          : String(value)
                        }
                      </span>
                    </div>
                  ))}
                </div>

                {/* Last Sync */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Last synced {formatDistanceToNow(integration.lastSync)} ago
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    onClick={() => handleSync(integration)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedIntegration(integration);
                        setIsConfigModalOpen(true);
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                    <Button
                      variant="outline"
                     
                      onClick={() => handleTestConnection(integration)}
                    >
                      Test
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Available Integrations */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Integrations
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Connect additional tools to expand agent capabilities
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrationTypes
              .filter(type => !integrations.some(int => int.type === type.type))
              .map((type) => (
                <div
                  key={type.type}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{type.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {type.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {type.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                   
                    onClick={() => {
                      setNewIntegration({
                        type: type.type as IntegrationType,
                        name: type.name,
                        configuration: {},
                      });
                      setIsAddModalOpen(true);
                    }}
                  >
                    Connect
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </Card>

      {/* Add Integration Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Integration"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Integration Type
            </label>
            <select
              value={newIntegration.type}
              onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value as IntegrationType })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              {integrationTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.icon} {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={newIntegration.name}
              onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter a name for this integration"
            />
          </div>

          {/* Dynamic configuration fields based on type */}
          {newIntegration.type === 'github' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API URL
                </label>
                <input
                  type="url"
                  placeholder="https://api.github.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Personal Access Token
                </label>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </>
          )}

          {newIntegration.type === 'jira' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jira URL
                </label>
                <input
                  type="url"
                  placeholder="https://company.atlassian.net"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Token
                </label>
                <input
                  type="password"
                  placeholder="Your Jira API token"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAddIntegration}
              disabled={!newIntegration.name.trim()}
            >
              Add Integration
            </Button>
          </div>
        </div>
      </Modal>

      {/* Configure Integration Modal */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setSelectedIntegration(null);
        }}
        title={`Configure ${selectedIntegration?.name}`}
        maxWidth="lg"
      >
        {selectedIntegration && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={selectedIntegration.name}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {Object.entries(selectedIntegration.configuration).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type={key.toLowerCase().includes('token') || key.toLowerCase().includes('key') ? 'password' : 'text'}
                  value={value}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            ))}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setIsConfigModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="default">
                Save Configuration
              </Button>
            </div>
          </div>
        )}
      </Modal>
      </>
      )}
    </div>
  );
}