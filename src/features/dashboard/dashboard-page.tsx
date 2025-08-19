import { useState } from 'react';
import { TrendingUp, CheckCircle, Clock, Plus, FileText, Bot, Activity, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { formatDistanceToNow } from '@/utils/dateUtils';

export function DashboardPage() {
  const { user, hasPermission } = useAuth();
  const { 
    projects, 
    activities, 
    dashboardStats, 
    createRequirementAnalysis, 
    createProject
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground text-lg">
            {getPersonaGreeting()}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setIsLogsModalOpen(true)}
          >
            <Activity className="w-4 h-4 mr-2" />
            System Activity
          </Button>
          {hasPermission('create_requirements') && (
            <Button 
              onClick={() => setIsAddRequirementModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Requirement
            </Button>
          )}
        </div>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              of {dashboardStats.totalProjects} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">
              by AI agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Automation
            </CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.automationRate}%</div>
            <p className="text-xs text-muted-foreground">
              efficiency rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Project Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>
              Real-time status of your active projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
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
                <Card key={project.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge variant={getStatusColor(project.status) as any}>
                        {project.status}
                      </Badge>
                      {project.riskFlags > 0 && (
                        <Badge variant="destructive">
                          {project.riskFlags} risks
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Bot className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {project.assignedAgents.length} agents
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Updated {formatDistanceToNow(project.lastActivity)} ago
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium">
                        {project.progress}%
                      </div>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* Real-time Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Live agent actions and system events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              activities.slice(0, 6).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'agent_decision' ? 'bg-blue-500' :
                    activity.type === 'escalation' ? 'bg-red-500' :
                    activity.type === 'flagged_task' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium">
                        {activity.title}
                      </h4>
                      <Badge variant={getRiskLevelColor(activity.riskLevel) as any}>
                        {activity.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(activity.timestamp)} ago
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Persona-Specific Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getPersonaActions().map((action, index) => {
              const Icon = action.icon;
              return (
                <Button 
                  key={index}
                  variant="outline" 
                  size="lg" 
                  className="justify-start h-16"
                  onClick={action.action}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-sm text-muted-foreground">Role-specific action</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create Project Modal */}
      <Dialog open={isCreateProjectModalOpen} onOpenChange={setIsCreateProjectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new project to start managing your development workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateProjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProject.name.trim() || isProcessing}
            >
              {isProcessing ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Requirement Modal */}
      <Dialog open={isAddRequirementModalOpen} onOpenChange={setIsAddRequirementModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Requirement</DialogTitle>
            <DialogDescription>
              Describe your requirement and let AI agents analyze and create actionable tasks.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                Project
              </Label>
              <select
                id="project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requirement" className="text-right">
                Requirement
              </Label>
              <Textarea
                id="requirement"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="col-span-3"
                placeholder="Describe your requirement in detail..."
              />
            </div>
          </div>
          <DialogFooter>
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
            >
              {isProcessing ? 'Processing...' : 'Add Requirement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Activity Modal */}
      <Dialog open={isLogsModalOpen} onOpenChange={setIsLogsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>System Activity Logs</DialogTitle>
            <DialogDescription>
              Recent system activity and agent actions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'agent_decision' ? 'bg-blue-500' :
                  activity.type === 'escalation' ? 'bg-red-500' :
                  activity.type === 'flagged_task' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium">
                      {activity.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getRiskLevelColor(activity.riskLevel) as any}>
                        {activity.riskLevel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp)} ago
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Agent: {activity.agentId}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
