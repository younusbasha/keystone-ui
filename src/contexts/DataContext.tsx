import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  Epic, 
  Story, 
  Task, 
  Agent, 
  AgentAction, 
  ActivityItem, 
  AuditLog,
  RequirementAnalysis,
  Integration,
  DeploymentPipeline
} from '../types';

interface DataContextType {
  // Projects
  projects: Project[];
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'lastActivity'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Requirements & Analysis
  requirementAnalyses: RequirementAnalysis[];
  createRequirementAnalysis: (analysis: Omit<RequirementAnalysis, 'id' | 'timestamp'>) => Promise<RequirementAnalysis>;
  
  // Epics, Stories, Tasks
  epics: Epic[];
  stories: Story[];
  tasks: Task[];
  createEpic: (epic: Omit<Epic, 'id' | 'createdAt'>) => Promise<Epic>;
  createStory: (story: Omit<Story, 'id' | 'createdAt'>) => Promise<Story>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  
  // Agents
  agents: Agent[];
  agentActions: AgentAction[];
  createAgentAction: (action: Omit<AgentAction, 'id' | 'timestamp'>) => Promise<AgentAction>;
  
  // Activity & Audit
  activities: ActivityItem[];
  auditLogs: AuditLog[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => Promise<ActivityItem>;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => Promise<AuditLog>;
  
  // Integrations
  integrations: Integration[];
  deploymentPipelines: DeploymentPipeline[];
  
  // Real-time stats
  dashboardStats: {
    totalProjects: number;
    activeProjects: number;
    pendingReviews: number;
    automationRate: number;
    tasksCompleted: number;
    agentActions: number;
  };
  
  // Loading states
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Modern e-commerce platform with AI recommendations',
    status: 'in-progress',
    progress: 65,
    riskFlags: 2,
    createdAt: '2024-01-15T10:00:00Z',
    lastActivity: new Date().toISOString(),
    repository: 'https://github.com/company/ecommerce-platform',
    integrations: ['github', 'jira', 'jenkins'],
    assignedAgents: ['agent-1', 'agent-2', 'agent-4'],
    owner: 'younus.s@techsophy.com',
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    description: 'Secure mobile banking application',
    status: 'review',
    progress: 90,
    riskFlags: 1,
    createdAt: '2024-01-10T09:00:00Z',
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    repository: 'https://github.com/company/mobile-banking',
    integrations: ['github', 'gcp', 'firebase'],
    assignedAgents: ['agent-1', 'agent-3', 'agent-5'],
    owner: 'younus.s@techsophy.com',
  },
];

const initialAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Requirements Parser',
    type: 'requirements-parser',
    status: 'active',
    description: 'Analyzes natural language requirements and extracts structured information',
    capabilities: ['NLP processing', 'Intent recognition', 'Entity extraction', 'Context analysis'],
    currentTask: 'Analyzing user authentication requirements',
    lastActivity: new Date().toISOString(),
    successRate: 94.5,
    totalTasks: 127,
    configuration: {
      model: 'gemini-pro',
      temperature: 0.3,
      maxTokens: 2048,
    },
    integrations: ['jira', 'slack'],
  },
  {
    id: 'agent-2',
    name: 'Task Planner',
    type: 'task-planner',
    status: 'busy',
    description: 'Creates detailed task breakdowns and estimates from user stories',
    capabilities: ['Task decomposition', 'Effort estimation', 'Dependency mapping', 'Resource allocation'],
    currentTask: 'Planning payment gateway integration',
    lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    successRate: 89.2,
    totalTasks: 89,
    configuration: {
      model: 'gemini-pro',
      planningHorizon: 30,
      estimationMethod: 'story-points',
    },
    integrations: ['jira', 'github'],
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents] = useState<Agent[]>(initialAgents);
  const [agentActions, setAgentActions] = useState<AgentAction[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [requirementAnalyses, setRequirementAnalyses] = useState<RequirementAnalysis[]>([]);
  const [integrations] = useState<Integration[]>([]);
  const [deploymentPipelines] = useState<DeploymentPipeline[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate real-time dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    pendingReviews: 0,
    automationRate: 0,
    tasksCompleted: 0,
    agentActions: 0,
  });

  // Update dashboard stats whenever data changes
  useEffect(() => {
    const activeProjects = projects.filter(p => p.status === 'in-progress').length;
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.isAgentAssigned).length;
    const totalTasks = tasks.length || 1; // Avoid division by zero
    const pendingReviews = agentActions.filter(a => a.status === 'pending').length;
    const automationRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    setDashboardStats({
      totalProjects: projects.length,
      activeProjects,
      pendingReviews,
      automationRate,
      tasksCompleted: completedTasks,
      agentActions: agentActions.length,
    });
  }, [projects, tasks, agentActions]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update last activity for active projects
      setProjects(prev => prev.map(project => 
        project.status === 'in-progress' 
          ? { ...project, lastActivity: new Date().toISOString() }
          : project
      ));

      // Simulate agent activity
      if (Math.random() > 0.7) {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        addActivity({
          type: 'agent_decision',
          title: `${randomAgent.name} completed a task`,
          description: `Automated task processing with ${Math.floor(Math.random() * 20 + 80)}% confidence`,
          riskLevel: 'low',
          isRead: false,
          agentId: randomAgent.id,
        });
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [agents]);

  // Project operations
  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'lastActivity'>): Promise<Project> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };
    
    setProjects(prev => [newProject, ...prev]);
    
    // Add activity log
    await addActivity({
      type: 'agent_decision',
      title: 'New project created',
      description: `Project "${newProject.name}" has been created and is ready for requirements input`,
      riskLevel: 'low',
      isRead: false,
      projectId: newProject.id,
    });
    
    // Add audit log
    await addAuditLog({
      userName: 'Younus',
      action: `Created project: ${newProject.name}`,
      actionType: 'create',
      outcome: 'success',
      details: `New project created with ${newProject.assignedAgents.length} assigned agents`,
      riskLevel: 'low',
      projectId: newProject.id,
    });
    
    setIsLoading(false);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, lastActivity: new Date().toISOString() }
        : project
    ));
  };

  const deleteProject = async (id: string): Promise<void> => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  // Requirement analysis operations
  const createRequirementAnalysis = async (analysisData: Omit<RequirementAnalysis, 'id' | 'timestamp'>): Promise<RequirementAnalysis> => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAnalysis: RequirementAnalysis = {
      ...analysisData,
      id: `req-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    setRequirementAnalyses(prev => [newAnalysis, ...prev]);
    
    // Create corresponding epics and stories if accepted
    if (newAnalysis.feedback === 'accepted') {
      for (const epic of newAnalysis.suggestedEpics) {
        await createEpic({
          ...epic,
          generatedBy: newAnalysis.agentId,
        });
      }
    }
    
    setIsLoading(false);
    return newAnalysis;
  };

  // Epic, Story, Task operations
  const createEpic = async (epicData: Omit<Epic, 'id' | 'createdAt'>): Promise<Epic> => {
    const newEpic: Epic = {
      ...epicData,
      id: `epic-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setEpics(prev => [newEpic, ...prev]);
    return newEpic;
  };

  const createStory = async (storyData: Omit<Story, 'id' | 'createdAt'>): Promise<Story> => {
    const newStory: Story = {
      ...storyData,
      id: `story-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setStories(prev => [newStory, ...prev]);
    return newStory;
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks(prev => [newTask, ...prev]);
    
    // Add activity for new task
    await addActivity({
      type: 'agent_decision',
      title: 'New task created',
      description: `Task "${newTask.title}" assigned to ${newTask.assignedTo}`,
      riskLevel: 'low',
      isRead: false,
      agentId: newTask.generatedBy,
    });
    
    return newTask;
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  // Agent action operations
  const createAgentAction = async (actionData: Omit<AgentAction, 'id' | 'timestamp'>): Promise<AgentAction> => {
    const newAction: AgentAction = {
      ...actionData,
      id: `action-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    setAgentActions(prev => [newAction, ...prev]);
    return newAction;
  };

  // Activity operations
  const addActivity = async (activityData: Omit<ActivityItem, 'id' | 'timestamp'>): Promise<ActivityItem> => {
    const newActivity: ActivityItem = {
      ...activityData,
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    setActivities(prev => [newActivity, ...prev.slice(0, 49)]); // Keep only last 50 activities
    return newActivity;
  };

  // Audit log operations
  const addAuditLog = async (logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> => {
    const newLog: AuditLog = {
      ...logData,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    setAuditLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const refreshData = async (): Promise<void> => {
    setIsLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <DataContext.Provider value={{
      projects,
      createProject,
      updateProject,
      deleteProject,
      requirementAnalyses,
      createRequirementAnalysis,
      epics,
      stories,
      tasks,
      createEpic,
      createStory,
      createTask,
      updateTask,
      agents,
      agentActions,
      createAgentAction,
      activities,
      auditLogs,
      addActivity,
      addAuditLog,
      integrations,
      deploymentPipelines,
      dashboardStats,
      isLoading,
      refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}