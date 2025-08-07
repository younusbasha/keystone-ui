import React, { useState } from 'react';
import { Plus, Search, Filter, GitBranch, Users, Calendar, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useData } from '../contexts/DataContext';
import { mockAgents } from '../data/mockData';
import { Project, IntegrationType } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

export function ProjectsPage() {
  const { projects, createProject, isLoading } = useData();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    repository: '',
    integrations: [] as IntegrationType[],
    assignedAgents: [] as string[],
  });

  const filteredProjects = projects.filter(project => {
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterStatus !== 'all') {
      if (filterStatus === 'active' && project.status !== 'in-progress') return false;
      if (filterStatus === 'completed' && project.status !== 'completed') return false;
      if (filterStatus === 'on-hold' && project.status !== 'blocked') return false;
    }
    return true;
  });

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;
    
    try {
      await createProject({
        name: newProject.name,
        description: newProject.description,
        status: 'pending',
        progress: 0,
        riskFlags: 0,
        repository: newProject.repository,
        integrations: newProject.integrations,
        assignedAgents: newProject.assignedAgents,
        owner: 'younus.s@techsophy.com',
      });
      
      setIsCreateModalOpen(false);
      setNewProject({
        name: '',
        description: '',
        repository: '',
        integrations: [],
        assignedAgents: [],
      });
      alert('Project created successfully!');
    } catch (error) {
      alert('Error creating project. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'review': return 'warning';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };

  const getIntegrationIcon = (type: IntegrationType) => {
    switch (type) {
      case 'github': return '🐙';
      case 'jira': return '📋';
      case 'jenkins': return '🔧';
      case 'gcp': return '☁️';
      case 'firebase': return '🔥';
      case 'slack': return '💬';
      default: return '🔗';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your projects and their agent assignments
          </p>
        </div>
        
        <Button 
          variant="primary" 
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Project
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} hoverable className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {project.description}
                  </p>
                </div>
                <Badge variant={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Integrations */}
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Integrations
                </div>
                <div className="flex items-center space-x-2">
                  {project.integrations.map((integration) => (
                    <span
                      key={integration}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs"
                      title={integration}
                    >
                      {getIntegrationIcon(integration)} {integration}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assigned Agents */}
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Assigned Agents
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {project.assignedAgents.length} agents
                  </span>
                </div>
              </div>

              {/* Risk Flags */}
              {project.riskFlags > 0 && (
                <div className="flex items-center space-x-2">
                  <Badge variant="error" size="sm">
                    {project.riskFlags} risk flags
                  </Badge>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Updated {formatDistanceToNow(project.lastActivity)} ago
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" icon={GitBranch}>
                    Tasks
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={ExternalLink}
                    onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Describe your project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Repository URL (Optional)
            </label>
            <input
              type="url"
              value={newProject.repository}
              onChange={(e) => setNewProject({ ...newProject, repository: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="https://github.com/company/project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assign Agents
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {mockAgents.map((agent) => (
                <label key={agent.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={newProject.assignedAgents.includes(agent.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewProject({
                          ...newProject,
                          assignedAgents: [...newProject.assignedAgents, agent.id]
                        });
                      } else {
                        setNewProject({
                          ...newProject,
                          assignedAgents: newProject.assignedAgents.filter(id => id !== agent.id)
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {agent.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {agent.description}
                    </div>
                  </div>
                  <Badge variant="agent" size="sm">
                    {agent.type}
                  </Badge>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateProject}
              disabled={!newProject.name.trim()}
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}