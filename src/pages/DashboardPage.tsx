import { useState } from 'react';
import { TrendingUp, CheckCircle, Clock, Plus, FileText, Bot, Activity, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '../components/ui/Modal';
import { AgentIntelligenceMetrics } from '../components/metrics/AgentIntelligenceMetrics';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { formatDistanceToNow } from '../utils/dateUtils';

export function DashboardPage() {
  const { user, hasPermission } = useAuth();
  const { 
    projects, 
    activities, 
    dashboardStats, 
    createRequirementAnalysis, 
    createProject,
    availableAgents,
    isLoading
  } = useData();
  
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isAddRequirementModalOpen, setIsAddRequirementModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [newRequirement, setNewRequirement] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    assignedAgents: [] as string[],
    integrations: [] as any[],
  });

  // Mock agent intelligence metrics with real calculations
  const overallMetrics = {
    totalTasks: dashboardStats.agentActions + 50, // Base tasks
    agentHandled: dashboardStats.tasksCompleted,
    humanIntervention: (dashboardStats.agentActions + 50) - dashboardStats.tasksCompleted,
    automationRate: dashboardStats.automationRate,
    efficiency: 94.5,
    successRate: 92.8,
  };

  const projectMetrics = projects.map(project => {
    const baseTaskCount = Math.floor(Math.random() * 30) + 20;
    const agentHandled = Math.floor(baseTaskCount * (0.7 + Math.random() * 0.25));
    return {
      projectId: project.id,
      projectName: project.name,
      metrics: {
        totalTasks: baseTaskCount,
        agentHandled,
        humanIntervention: baseTaskCount - agentHandled,
        automationRate: Math.round((agentHandled / baseTaskCount) * 100),
        efficiency: Math.floor(Math.random() * 20) + 80,
        successRate: Math.floor(Math.random() * 15) + 85,
      },
    };
  });

  const handleAddRequirement = async () => {
    if (!newRequirement.trim() || !selectedProject) return;
    
    setIsProcessing(true);
    
    try {
      await createRequirementAnalysis({
        originalText: newRequirement,
        parsedIntent: 'AI-parsed requirement intent',
        extractedEntities: {
          features: ['feature1', 'feature2'],
          priority: 'high',
          complexity: 'medium',
        },
        suggestedEpics: [],
        confidence: 0.89,
        agentId: 'agent-1',
        feedback: 'accepted',
      });
      
      setIsAddRequirementModalOpen(false);
      setNewRequirement('');
      setSelectedProject('');
      alert('✅ Requirement processed successfully! AI agents have analyzed your request and created actionable tasks.');
    } catch (error) {
      alert('Error processing requirement. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;
    
    setIsProcessing(true);
    
    try {
      await createProject({
        name: newProject.name,
        description: newProject.description,
        status: 'pending',
        progress: 0,
        riskFlags: 0,
        repository: '',
        integrations: newProject.integrations,
        assignedAgents: newProject.assignedAgents,
        owner: user?.email || 'unknown',
      });
      
      setIsCreateProjectModalOpen(false);
      setNewProject({
        name: '',
        description: '',
        assignedAgents: [],
        integrations: [],
      });
      alert('✅ Project created successfully!');
    } catch (error) {
      alert('Error creating project. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'review': return 'warning';
      case 'blocked': return 'destructive';
      default: return 'default';
    }
  };

  const getPersonaGreeting = () => {
    switch (user?.role) {
      case 'PM':
        return 'Monitor project progress, agent performance, and team productivity across your development portfolio.';
      case 'BA':
        return 'Input requirements and collaborate with AI agents to transform business needs into actionable development tasks.';
      case 'Developer':
        return 'Access your assigned tasks, review agent-generated code, and collaborate on technical implementation.';
      case 'Reviewer':
        return 'Here\'s an overview of agent activity and system performance. Review outputs to ensure quality standards.';
      default:
        return 'Welcome to your intelligent development platform.';
    }
  };

  const getPersonaActions = () => {
    switch (user?.role) {
      case 'PM':
        return [
          { label: 'Create Project', icon: Plus, action: () => setIsCreateProjectModalOpen(true) },
          { label: 'Review Agent Performance', icon: Bot, action: () => window.location.href = '/agents' },
          { label: 'View Audit Logs', icon: Activity, action: () => setIsLogsModalOpen(true) },
        ];
      case 'BA':
        return [
          { label: 'Add Requirement', icon: Plus, action: () => setIsAddRequirementModalOpen(true) },
          { label: 'Review Stories', icon: FileText, action: () => window.location.href = '/tasks' },
          { label: 'Check Agent Analysis', icon: Bot, action: () => window.location.href = '/requirements' },
        ];
      case 'Developer':
        return [
          { label: 'View My Tasks', icon: CheckCircle, action: () => window.location.href = '/tasks' },
          { label: 'Review Generated Code', icon: Bot, action: () => window.location.href = '/agent-review' },
          { label: 'Check Deployments', icon: Zap, action: () => window.location.href = '/deployment' },
        ];
      case 'Reviewer':
        return [
          { label: 'Review Agent Actions', icon: Bot, action: () => window.location.href = '/agent-review' },
          { label: 'Approve Tasks', icon: CheckCircle, action: () => window.location.href = '/tasks' },
          { label: 'View Audit Trail', icon: Activity, action: () => setIsLogsModalOpen(true) },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {getPersonaGreeting()}
          </p>
        </div>
        
        <div className="flex space-x-3 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={() => setIsLogsModalOpen(true)}
            className="btn-secondary"
          >
            <Activity className="w-4 h-4 mr-2" />
            System Activity
          </Button>
          {hasPermission('create_requirements') && (
            <Button 
              onClick={() => setIsAddRequirementModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Requirement
            </Button>
          )}
        </div>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-modern">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Active Projects
              </p>
              <p className="text-3xl font-bold text-foreground mb-1">
                {dashboardStats.activeProjects}
              </p>
              <p className="text-sm text-success">
                of {dashboardStats.totalProjects} total
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card-modern">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Tasks Completed
              </p>
              <p className="text-3xl font-bold text-foreground mb-1">
                {dashboardStats.tasksCompleted}
              </p>
              <p className="text-sm text-primary">
                by AI agents
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-success/10 to-success/20 rounded-xl">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>
        </div>

        <div className="card-modern">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Pending Reviews
              </p>
              <p className="text-3xl font-bold text-foreground mb-1">
                {dashboardStats.pendingReviews}
              </p>
              <p className="text-sm text-warning">
                require attention
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-warning/10 to-warning/20 rounded-xl">
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </div>
        </div>

        <div className="card-modern">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                AI Automation
              </p>
              <p className="text-3xl font-bold text-foreground mb-1">
                {dashboardStats.automationRate}%
              </p>
              <p className="text-sm text-accent">
                efficiency rate
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/20 rounded-xl">
              <Bot className="w-8 h-8 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Agent Intelligence Metrics */}
      <AgentIntelligenceMetrics 
        overallMetrics={overallMetrics}
        projectMetrics={projectMetrics}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Project Summary */}
        <div className="card-modern">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Project Overview
                </h2>
                <p className="text-sm text-muted-foreground">
                  Real-time status of your active projects
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl w-fit mx-auto mb-4">
                  <Plus className="w-12 h-12 text-muted-foreground/50" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">Create your first project to get started with AI-powered development.</p>
                <Button 
                  variant="outline" 
                  className="btn-primary"
                  onClick={() => setIsCreateProjectModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="group p-5 bg-gradient-to-r from-card to-card/50 border border-border rounded-xl hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg mb-1 truncate">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                      <span className={`badge-modern ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      {project.riskFlags > 0 && (
                        <span className="badge-modern bg-destructive/10 text-destructive border-destructive/20">
                          {project.riskFlags} risks
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-accent" />
                        <span className="text-sm text-muted-foreground">
                          {project.assignedAgents.length} agents
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Updated {formatDistanceToNow(project.lastActivity)} ago
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-semibold text-foreground">
                        {project.progress}%
                      </div>
                      <div className="w-24 bg-border rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="card-modern">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-accent/20 to-accent/30 rounded-lg">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Recent Activity
                </h2>
                <p className="text-sm text-muted-foreground">
                  Live agent actions and system events
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/20 rounded-2xl w-fit mx-auto mb-4">
                  <Activity className="w-12 h-12 text-muted-foreground/50" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No recent activity</h3>
                <p className="text-muted-foreground">Agent actions will appear here as they happen.</p>
              </div>
            ) : (
              activities.slice(0, 6).map((activity) => (
                <div key={activity.id} className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-accent/5 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-3 flex-shrink-0 ${
                    activity.type === 'agent_decision' ? 'bg-accent animate-pulse' :
                    activity.type === 'escalation' ? 'bg-destructive animate-pulse' :
                    activity.type === 'flagged_task' ? 'bg-warning animate-pulse' :
                    'bg-primary animate-pulse'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {activity.title}
                      </h4>
                      <span className={`badge-modern text-xs ${getRiskLevelColor(activity.riskLevel)}`}>
                        {activity.riskLevel}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {formatDistanceToNow(activity.timestamp)} ago
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Persona-Specific Quick Actions */}
      <div className="card-modern">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-secondary/20 to-secondary/30 rounded-lg">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Quick Actions
              </h2>
              <p className="text-sm text-muted-foreground">
                Common tasks for your role
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getPersonaActions().map((action, index) => {
              const Icon = action.icon;
              return (
                <button 
                  key={index}
                  className="group flex items-start space-x-4 p-6 rounded-xl border border-border hover:border-primary/30 hover:bg-gradient-to-br hover:from-card to-card/50 transition-all duration-300 hover:shadow-lg text-left"
                  onClick={action.action}
                >
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                    <Icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      {action.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Role-specific action for {user?.role}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateProjectModalOpen}
        onClose={() => {
          setIsCreateProjectModalOpen(false);
          setNewProject({
            name: '',
            description: '',
            assignedAgents: [],
            integrations: [],
          });
        }}
        title="Create New Project"
        maxWidth="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus-ring dark:bg-neutral-800 dark:text-white"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Project Description
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus-ring dark:bg-neutral-800 dark:text-white"
              placeholder="Describe your project goals and requirements"
            />
          </div>

          <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
            <div className="flex items-start space-x-3 mb-4">
              <Zap className="w-5 h-5 text-brand-600 dark:text-brand-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-brand-900 dark:text-brand-100">
                  AI Agent Assignment
                </h4>
                <p className="text-sm text-brand-700 dark:text-brand-300 mt-1">
                  Select AI agents to work on this project. Agents can be added or modified later.
                </p>
              </div>
            </div>
            
            {/* Agent Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Available Agents {availableAgents.length > 0 && `(${availableAgents.length})`}
              </label>
              
              {isLoading ? (
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                  <div className="animate-spin h-4 w-4 border-2 border-brand-600 border-t-transparent rounded-full"></div>
                  <span>Loading agents...</span>
                </div>
              ) : availableAgents.length === 0 ? (
                <div className="text-sm text-neutral-500 dark:text-neutral-400 p-3 border border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg text-center">
                  No agents available. Agents will be automatically assigned based on project type.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {availableAgents.map((agent: any) => (
                    <label
                      key={agent.id}
                      className="flex items-center space-x-3 p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer"
                    >
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
                        className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {agent.name}
                          </span>
                          <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full">
                            {agent.agent_type || agent.type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            agent.status === 'idle' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            agent.status === 'busy' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                          }`}>
                            {agent.status}
                          </span>
                        </div>
                        {agent.capabilities && agent.capabilities.length > 0 && (
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            {agent.capabilities.slice(0, 3).join(', ')}{agent.capabilities.length > 3 ? '...' : ''}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
              
              {newProject.assignedAgents.length > 0 && (
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  {newProject.assignedAgents.length} agent{newProject.assignedAgents.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsCreateProjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProject.name.trim() || isProcessing}
              className="btn-primary"
            >
              {isProcessing ? 'Creating Project...' : 'Create Project'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Requirement Modal */}
      <Modal
        isOpen={isAddRequirementModalOpen}
        onClose={() => {
          setIsAddRequirementModalOpen(false);
          setNewRequirement('');
          setSelectedProject('');
        }}
        title="Add New Requirement"
        maxWidth="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Select Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus-ring dark:bg-neutral-800 dark:text-white"
            >
              <option value="">Choose a project...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Requirement Description
            </label>
            <textarea
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus-ring dark:bg-neutral-800 dark:text-white"
              placeholder="Describe your requirement in detail. For example: 'I need a user authentication system that supports email/password login, social authentication, and password reset functionality...'"
            />
          </div>

          <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-brand-600 dark:text-brand-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-brand-900 dark:text-brand-100">
                  AI-Powered Processing
                </h4>
                <p className="text-sm text-brand-700 dark:text-brand-300 mt-1">
                  Our agents will automatically analyze your requirement, break it down into user stories, 
                  and create actionable tasks with estimated effort and dependencies.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddRequirementModalOpen(false);
                setNewRequirement('');
                setSelectedProject('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRequirement}
              disabled={!newRequirement.trim() || !selectedProject || isProcessing}
              className="btn-primary"
            >
              {isProcessing ? 'Processing with AI...' : 'Add Requirement'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* System Activity Logs Modal */}
      <Modal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
        title="System Activity Logs"
        maxWidth="xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Real-time system activities and agent actions
            </p>
            <Badge variant="info">Live Updates</Badge>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity logs yet</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getRiskLevelColor(activity.riskLevel)}>
                          {activity.riskLevel}
                        </Badge>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-medium text-neutral-900 dark:text-white">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {activity.description}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'agent_decision' ? 'bg-accent-500' :
                      activity.type === 'escalation' ? 'bg-error-500' :
                      activity.type === 'flagged_task' ? 'bg-warning-500' :
                      'bg-brand-500'
                    }`} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}