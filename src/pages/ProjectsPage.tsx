import { useState, useEffect } from 'react';
import { Plus, Search, GitBranch, Users, MoreVertical, Star, FolderOpen, Activity, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '../components/ui/Modal';
import { useData } from '../contexts/DataContext';
import { aiAgentsService } from '../services/agentsService';
import { Project, IntegrationType, Agent } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';
import { ApiHealthService } from '../services/healthService';

export function ProjectsPage() {
  const { projects, createProject, isLoading } = useData();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'updated'>('updated');
  const [apiConnectionStatus, setApiConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    repository: '',
    integrations: [] as IntegrationType[],
    assignedAgents: [] as string[],
  });

  // Load agents from API
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const agentsResponse = await aiAgentsService.listAgents({ limit: 50 });
        // Convert API agents to our Agent type (similar to AgentsPage)
        const mappedAgents: Agent[] = agentsResponse.items.map(apiAgent => ({
          id: apiAgent.id!,
          name: apiAgent.name,
          type: 'requirements-parser', // Default type, could be mapped properly
          status: 'active',
          description: `${apiAgent.agent_type} agent`,
          capabilities: apiAgent.capabilities || [],
          currentTask: 'Available',
          lastActivity: new Date().toISOString(),
          successRate: 95,
          totalTasks: 0,
          configuration: {},
          integrations: [],
        }));
        setAgents(mappedAgents);
      } catch (error) {
        console.error('Failed to load agents:', error);
        setAgents([]);
      }
    };

    loadAgents();
  }, []);

  const filteredProjects = projects
    .filter(project => {
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
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return b.progress - a.progress;
        case 'updated':
        default:
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      }
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
        owner: 'younus.s@techsophy.com', // Use the real registered user
      });
      
      setIsCreateModalOpen(false);
      setNewProject({
        name: '',
        description: '',
        repository: '',
        integrations: [],
        assignedAgents: [],
      });
      alert('✅ Project created successfully!');
      setApiConnectionStatus('connected');
    } catch (error) {
      console.error('Create project error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('connection')) {
        alert('❌ Cannot connect to backend API. Please ensure your backend server is running on localhost:8000');
        setApiConnectionStatus('disconnected');
      } else {
        alert(`❌ Error creating project: ${errorMessage}`);
      }
    }
  };

  const testApiConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await ApiHealthService.checkHealth();
      if (result.status === 'success') {
        setApiConnectionStatus('connected');
        alert('✅ API Connection successful! Backend is reachable.');
      } else {
        setApiConnectionStatus('disconnected');
        alert(`❌ API Connection failed: ${result.message}`);
      }
    } catch (error) {
      setApiConnectionStatus('disconnected');
      alert('❌ Cannot connect to backend API. Please ensure your backend server is running on localhost:8000');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'review': return 'warning';
      case 'blocked': return 'error';
      default: return 'secondary';
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

  const handleProjectAction = (projectId: string, action: 'view' | 'edit' | 'archive' | 'delete') => {
    switch (action) {
      case 'view':
        window.location.href = `/projects/${projectId}`;
        break;
      case 'edit':
        // TODO: Implement edit functionality
        alert('Edit functionality coming soon!');
        break;
      case 'archive':
        // TODO: Implement archive functionality
        alert('Archive functionality coming soon!');
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this project?')) {
          // TODO: Implement delete functionality
          alert('Delete functionality coming soon!');
        }
        break;
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <div 
      className="group card-modern p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      onClick={() => handleProjectAction(project.id, 'view')}
    >
      <div className="space-y-4">
        {/* Project Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {project.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={getStatusColor(project.status)}>
                    {project.status.replace('-', ' ')}
                  </Badge>
                  {project.riskFlags > 0 && (
                    <Badge variant="destructive">
                      {project.riskFlags} risk{project.riskFlags > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement favorite functionality
              }}
            >
              <Star className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Show dropdown menu
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Project Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {project.progress}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Integrations */}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground font-medium">
            Integrations
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            {project.integrations.slice(0, 4).map((integration) => (
              <span
                key={integration}
                className="inline-flex items-center px-2 py-1 rounded-md bg-accent/10 text-xs font-medium text-accent"
                title={integration}
              >
                {getIntegrationIcon(integration)} {integration}
              </span>
            ))}
            {project.integrations.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted/10 text-xs font-medium text-muted-foreground">
                +{project.integrations.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Team and Activity */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {project.assignedAgents.length} agent{project.assignedAgents.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(project.lastActivity)} ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Projects
              </h1>
              <p className="text-muted-foreground">
                Manage your projects and their AI agent assignments
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* API Connection Status */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testApiConnection}
              disabled={isTestingConnection}
              className="flex items-center space-x-2"
            >
              {isTestingConnection ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              ) : apiConnectionStatus === 'connected' ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : apiConnectionStatus === 'disconnected' ? (
                <WifiOff className="h-4 w-4 text-red-600" />
              ) : (
                <Wifi className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm">
                {isTestingConnection ? 'Testing...' : 
                 apiConnectionStatus === 'connected' ? 'API Connected' :
                 apiConnectionStatus === 'disconnected' ? 'API Disconnected' : 
                 'Test API'}
              </span>
            </Button>
          </div>
          
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* API Connection Warning Banner */}
      {apiConnectionStatus === 'disconnected' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Backend API Not Available</h3>
              <p className="text-xs text-yellow-700 mt-1">
                Projects will be stored locally until the backend API is available. Please start your backend server on localhost:8000 for full functionality.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={testApiConnection}
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
            >
              Retry Connection
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
              <p className="text-2xl font-bold text-foreground">{projects.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-foreground">
                {projects.filter(p => p.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-success/10 to-success/20 rounded-xl">
              <Activity className="h-6 w-6 text-success" />
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-accent/10 to-accent/20 rounded-xl">
              <Users className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">At Risk</p>
              <p className="text-2xl font-bold text-foreground">
                {projects.filter(p => p.riskFlags > 0).length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-warning/10 to-warning/20 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card-modern p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="input-modern pl-10"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="input-modern"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-modern"
            >
              <option value="updated">Last Updated</option>
              <option value="name">Name</option>
              <option value="progress">Progress</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-accent/10 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-modern p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="card-modern text-center py-12">
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
              <FolderOpen className="w-12 h-12 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {searchTerm || filterStatus !== 'all' ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first project to get started with AI-powered development'
                }
              </p>
            </div>
            {(!searchTerm && filterStatus === 'all') && (
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewProject({
            name: '',
            description: '',
            repository: '',
            integrations: [],
            assignedAgents: [],
          });
        }}
        title="Create New Project"
        maxWidth="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="form-label">
              Project Name
            </label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="form-input"
              placeholder="Enter project name"
              autoFocus
            />
          </div>

          <div>
            <label className="form-label">
              Description
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={4}
              className="form-input"
              placeholder="Describe your project goals and requirements"
            />
          </div>

          <div>
            <label className="form-label">
              Repository URL (Optional)
            </label>
            <input
              type="url"
              value={newProject.repository}
              onChange={(e) => setNewProject({ ...newProject, repository: e.target.value })}
              className="form-input"
              placeholder="https://github.com/company/project"
            />
          </div>

          <div>
            <label className="form-label">
              Assign AI Agents
            </label>
            <div className="space-y-3 max-h-48 overflow-y-auto border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
              {agents.map((agent) => (
                <label key={agent.id} className="flex items-center space-x-3 group cursor-pointer">
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
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {agent.name}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {agent.description}
                    </div>
                  </div>
                  <Badge variant="default">
                    {agent.type}
                  </Badge>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleCreateProject}
              disabled={!newProject.name.trim() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}