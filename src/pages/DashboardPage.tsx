import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Plus, FileText, Bot, Activity, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
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
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            {getPersonaGreeting()}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            icon={Activity}
            onClick={() => setIsLogsModalOpen(true)}
          >
            System Activity
          </Button>
          {hasPermission('create_requirements') && (
            <Button 
              variant="primary" 
              icon={Plus}
              onClick={() => setIsAddRequirementModalOpen(true)}
            >
              Add Requirement
            </Button>
          )}
        </div>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Active Projects
              </p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {dashboardStats.activeProjects}
              </p>
              <p className="text-sm text-success-600 dark:text-success-400 mt-1">
                of {dashboardStats.totalProjects} total
              </p>
            </div>
            <div className="p-3 bg-brand-100 dark:bg-brand-900 rounded-xl">
              <TrendingUp className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Tasks Completed
              </p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {dashboardStats.tasksCompleted}
              </p>
              <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
                by AI agents
              </p>
            </div>
            <div className="p-3 bg-success-100 dark:bg-success-900 rounded-xl">
              <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Pending Reviews
              </p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {dashboardStats.pendingReviews}
              </p>
              <p className="text-sm text-warning-600 dark:text-warning-400 mt-1">
                require attention
              </p>
            </div>
            <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-xl">
              <Clock className="w-8 h-8 text-warning-600 dark:text-warning-400" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                AI Automation
              </p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {dashboardStats.automationRate}%
              </p>
              <p className="text-sm text-accent-600 dark:text-accent-400 mt-1">
                efficiency rate
              </p>
            </div>
            <div className="p-3 bg-accent-100 dark:bg-accent-900 rounded-xl">
              <Bot className="w-8 h-8 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Agent Intelligence Metrics */}
      <AgentIntelligenceMetrics 
        overallMetrics={overallMetrics}
        projectMetrics={projectMetrics}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Project Summary */}
        <Card variant="elevated">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Project Overview
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Real-time status of your active projects
            </p>
          </div>
          <div className="p-6 space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <Plus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No projects yet. Create your first project to get started.</p>
                <Button 
                  variant="outline" 
                  className="mt-3"
                  onClick={() => setIsCreateProjectModalOpen(true)}
                >
                  Create Project
                </Button>
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {project.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge variant={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      {project.riskFlags > 0 && (
                        <Badge variant="error">
                          {project.riskFlags} risks
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Bot className="w-4 h-4 text-accent-600" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {project.assignedAgents.length} agents
                        </span>
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Updated {formatDistanceToNow(project.lastActivity)} ago
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {project.progress}%
                      </div>
                      <div className="w-20 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Real-time Activity Feed */}
        <Card variant="elevated">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Recent Activity
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Live agent actions and system events
            </p>
          </div>
          <div className="p-6 space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              activities.slice(0, 6).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'agent_decision' ? 'bg-accent-500' :
                    activity.type === 'escalation' ? 'bg-error-500' :
                    activity.type === 'flagged_task' ? 'bg-warning-500' :
                    'bg-brand-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium text-neutral-900 dark:text-white">
                        {activity.title}
                      </h4>
                      <Badge variant={getRiskLevelColor(activity.riskLevel)} size="sm">
                        {activity.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                      {formatDistanceToNow(activity.timestamp)} ago
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Persona-Specific Quick Actions */}
      <Card variant="elevated">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Quick Actions
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Common tasks for your role
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getPersonaActions().map((action, index) => {
              const Icon = action.icon;
              return (
                <Button 
                  key={index}
                  variant="outline" 
                  size="lg" 
                  icon={Icon} 
                  className="justify-start h-16"
                  onClick={action.action}
                >
                  <div className="text-left">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-sm text-neutral-500">Role-specific action</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

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
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-brand-600 dark:text-brand-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-brand-900 dark:text-brand-100">
                  AI Agent Assignment
                </h4>
                <p className="text-sm text-brand-700 dark:text-brand-300 mt-1">
                  Agents will be automatically assigned based on your project requirements and can be configured later.
                </p>
              </div>
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
              variant="primary"
              onClick={handleCreateProject}
              disabled={!newProject.name.trim() || isProcessing}
              loading={isProcessing}
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
              variant="primary"
              onClick={handleAddRequirement}
              disabled={!newRequirement.trim() || !selectedProject || isProcessing}
              loading={isProcessing}
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
                        <Badge variant={getRiskLevelColor(activity.riskLevel)} size="sm">
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