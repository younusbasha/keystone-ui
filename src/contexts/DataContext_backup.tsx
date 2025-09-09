import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Project, Agent, Task, Epic, Story, AgentAction, ActivityItem, DeploymentPipeline, AuditLog,
  TaskStatus, Priority, Component, RiskLevel, IntegrationType, Integration, RequirementAnalysis
} from '../types';
import { projectsService } from '../services/projectsService';
import { aiAgentsService } from '../services/aiAgentsService';
import { tasksService } from '../services/tasksService';
import { dashboardService } from '../services/dashboardService';
import { integrationsService } from '../services/integrationsService';
import { useToastContext } from './ToastContext';

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
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  loadTasks: (projectId?: string) => Promise<void>;
  
  // Agents
  agents: Agent[];
  availableAgents: Agent[];
  loadAgents: () => Promise<void>;
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
  
  // Dashboard operations
  loadDashboardStats: () => Promise<any>;
  loadActivityFeed: (limit?: number) => Promise<any>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const toast = useToastContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents] = useState<Agent[]>([]); // Will be loaded from API
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]); // Real-time agents from API
  const [agentActions, setAgentActions] = useState<AgentAction[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [requirementAnalyses, setRequirementAnalyses] = useState<RequirementAnalysis[]>([]);
  const [integrations] = useState<Integration[]>([]);
  const [deploymentPipelines] = useState<DeploymentPipeline[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data from API
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Debug authentication state
        const token = localStorage.getItem('access_token');
        const user = localStorage.getItem('user');
        console.log('DataContext: Checking authentication...');
        console.log('Token exists:', !!token);
        console.log('Token (first 20 chars):', token?.substring(0, 20));
        console.log('User exists:', !!user);
        
        if (!token) {
          console.warn('DataContext: No access token found, user needs to login');
          toast.warning('Authentication required', 'Please login to view your projects and agents.');
          setIsLoading(false);
          return;
        }
        
                // Load projects from API
        const projectsResponse = await projectsService.listProjects({ limit: 50 });
        const apiProjects = projectsResponse.projects.map((apiProject: any) => ({
          id: apiProject.id!,
          name: apiProject.name,
          description: apiProject.description,
          status: apiProject.status === 'planning' ? 'pending' as const : 
                  apiProject.status === 'in_progress' ? 'in-progress' as const :
                  apiProject.status === 'completed' ? 'completed' as const : 'blocked' as const,
          progress: Math.floor(Math.random() * 100), // Calculate based on tasks when available
          riskFlags: 0, // Calculate based on actual risks
          createdAt: apiProject.created_at || new Date().toISOString(),
          lastActivity: apiProject.updated_at || new Date().toISOString(),
          repository: '', // Add when available
          integrations: [] as IntegrationType[], // Add when available
          assignedAgents: [], // Add when available
          owner: 'younus.s@techsophy.com', // Current user
          // Keep API fields as well
          priority: apiProject.priority,
          start_date: apiProject.start_date,
          end_date: apiProject.end_date,
          budget: apiProject.budget,
          owner_id: apiProject.owner_id,
          created_at: apiProject.created_at,
          updated_at: apiProject.updated_at,
          requirements_count: apiProject.requirements_count,
          tasks_count: apiProject.tasks_count,
        }));
        
        console.log('DataContext: Loaded projects from API:', apiProjects);
        setProjects(apiProjects);

        // Load agents from API
        const agentsResponse = await aiAgentsService.listAgents({ limit: 50 });
        const convertedAgents = agentsResponse.items.map(apiAgent => ({
          id: apiAgent.id!,
          name: apiAgent.name,
          type: apiAgent.agent_type as any, // Use agent_type from API
          status: apiAgent.status as any, // Cast to AgentStatus
          description: apiAgent.description || `${apiAgent.name} - AI Agent`,
          capabilities: apiAgent.capabilities,
          currentTask: undefined,
          lastActivity: apiAgent.updated_at || new Date().toISOString(),
          successRate: 95, // Default value
          totalTasks: 0, // Default value
          configuration: apiAgent.configuration || {},
          integrations: [] as IntegrationType[], // Default empty array
        }));
        setAvailableAgents(convertedAgents);
        console.log('Loaded agents:', convertedAgents);

        // Load integrations from API
        try {
          const integrationsResponse = await integrationsService.listIntegrations({ limit: 50 });
          console.log('Loaded integrations:', integrationsResponse);
        } catch (error) {
          console.warn('Integrations API not available:', error);
        }

        // Load dashboard stats if available
        try {
          const dashboardStats = await dashboardService.getStats();
          console.log('Loaded dashboard stats:', dashboardStats);
        } catch (error) {
          console.warn('Dashboard stats API not available:', error);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        toast.error('Failed to load data', 'Please check if you are logged in and try refreshing the page.');
        // Initialize with empty arrays on error
        setProjects([]);
        setAvailableAgents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

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
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.assigned_to).length;
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

  // Agents operations - Connected to Real API
  const loadAgents = async (): Promise<void> => {
    try {
      const agentsResponse = await aiAgentsService.listAgents({ limit: 50 });
      const convertedAgents = agentsResponse.items.map(apiAgent => ({
        id: apiAgent.id!,
        name: apiAgent.name,
        type: apiAgent.agent_type as any,
        status: apiAgent.status as any,
        description: apiAgent.description || `${apiAgent.name} - AI Agent`,
        capabilities: apiAgent.capabilities,
        currentTask: undefined,
        lastActivity: apiAgent.updated_at || new Date().toISOString(),
        successRate: 95,
        totalTasks: 0,
        configuration: apiAgent.configuration || {},
        integrations: [] as IntegrationType[],
      }));
      setAvailableAgents(convertedAgents);
      console.log('Reloaded agents:', agentsResponse.items);
    } catch (error) {
      console.error('Failed to load agents:', error);
      setAvailableAgents([]);
    }
  };

  // Project operations - Connected to Real API
  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'lastActivity'>): Promise<Project> => {
    setIsLoading(true);
    
    try {
      console.log('DataContext: Creating project with data:', projectData);
      
      // Convert our frontend Project type to API Project type
      const apiProjectData = {
        name: projectData.name,
        description: projectData.description,
        priority: (projectData.priority || 'medium') as 'low' | 'medium' | 'high',
        status: 'planning' as const,
        start_date: projectData.start_date || null,
        end_date: projectData.end_date || null,
        budget: projectData.budget || 10000,
      };

      console.log('DataContext: Sending to API:', apiProjectData);
      const createdApiProject = await projectsService.createProject(apiProjectData);
      console.log('DataContext: API Response:', createdApiProject);
      
      // Convert API response to our frontend Project type
      const newProject: Project = {
        id: createdApiProject.id!,
        name: createdApiProject.name,
        description: createdApiProject.description,
        status: createdApiProject.status === 'planning' ? 'pending' : 
                createdApiProject.status === 'in_progress' ? 'in-progress' :
                createdApiProject.status === 'completed' ? 'completed' : 'blocked',
        progress: 0,
        riskFlags: 0,
        createdAt: createdApiProject.created_at || new Date().toISOString(),
        lastActivity: createdApiProject.updated_at || new Date().toISOString(),
        repository: projectData.repository,
        integrations: projectData.integrations || [],
        assignedAgents: projectData.assignedAgents || [],
        owner: projectData.owner,
        // Keep API fields as well
        priority: createdApiProject.priority,
        start_date: createdApiProject.start_date,
        end_date: createdApiProject.end_date,
        budget: createdApiProject.budget,
        owner_id: createdApiProject.owner_id,
        created_at: createdApiProject.created_at,
        updated_at: createdApiProject.updated_at,
        requirements_count: createdApiProject.requirements_count,
        tasks_count: createdApiProject.tasks_count,
      };
      
      console.log('DataContext: Adding project to state:', newProject);
      setProjects(prev => [newProject, ...prev]);
      
      // Add activity log
      await addActivity({
        type: 'agent_decision',
        title: 'New project created',
        description: `Project "${newProject.name}" has been created successfully and is ready for requirements input`,
        riskLevel: 'low',
        isRead: false,
        projectId: newProject.id,
      });
      
      setIsLoading(false);
      
      // Show success message
      toast.success('Project Created', `Project "${newProject.name}" has been created successfully!`);
      
      return newProject;
    } catch (error) {
      setIsLoading(false);
      console.error('DataContext: Failed to create project:', error);
      throw new Error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
    setIsLoading(true);
    
    try {
      const apiTaskData = {
        title: taskData.title,
        description: taskData.description,
        project_id: taskData.project_id,
        requirement_id: taskData.requirement_id,
        priority: taskData.priority,
        estimated_hours: taskData.estimated_hours,
        task_type: taskData.task_type,
        assigned_to: taskData.assigned_to,
        due_date: taskData.due_date,
      };
      
      const createdTask = await tasksService.createTask(apiTaskData);
      setTasks(prev => [createdTask, ...prev]);
      
      // Add activity for new task
      await addActivity({
        type: 'agent_decision',
        title: 'New task created',
        description: `Task "${createdTask.title}" has been created${createdTask.assigned_to ? ` and assigned to ${createdTask.assigned_to}` : ''}`,
        riskLevel: 'low',
        isRead: false,
      });
      
      setIsLoading(false);
      toast.success('Task Created', `Task "${createdTask.title}" has been created successfully!`);
      return createdTask;
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to create task:', error);
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
    try {
      const updatedTask = await tasksService.updateTask(id, updates);
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      toast.success('Task Updated', 'Task has been updated successfully!');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Update Failed', 'Failed to update task. Please try again.');
    }
  };

  const loadTasks = async (projectId?: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = projectId 
        ? await tasksService.getTasksByProject(projectId, { limit: 100 })
        : await tasksService.listTasks({ limit: 100 });
      
      setTasks(response.tasks);
      console.log('Loaded tasks:', response.tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
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

  // Dashboard operations
  const loadDashboardStats = async (): Promise<any> => {
    try {
      const stats = await dashboardService.getStats();
      return stats;
    } catch (error) {
      console.warn('Dashboard stats not available:', error);
      return null;
    }
  };

  const loadActivityFeed = async (limit: number = 20): Promise<any> => {
    try {
      const activity = await dashboardService.getActivity({ limit });
      return activity;
    } catch (error) {
      console.warn('Activity feed not available:', error);
      return { activities: [], total: 0 };
    }
  };

  const refreshData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Reload projects from API
      const projectsResponse = await projectsService.listProjects({ limit: 50 });
      const apiProjects = projectsResponse.projects.map((apiProject: any) => ({
        id: apiProject.id!,
        name: apiProject.name,
        description: apiProject.description,
        status: apiProject.status === 'planning' ? 'pending' as const : 
                apiProject.status === 'in_progress' ? 'in-progress' as const :
                apiProject.status === 'completed' ? 'completed' as const : 'blocked' as const,
        progress: Math.floor(Math.random() * 100), // Calculate based on tasks when available
        riskFlags: 0, // Calculate based on actual risks
        createdAt: apiProject.created_at || new Date().toISOString(),
        lastActivity: apiProject.updated_at || new Date().toISOString(),
        repository: '', // Add when available
        integrations: [] as IntegrationType[], // Add when available
        assignedAgents: [], // Add when available
        owner: 'younus.s@techsophy.com', // Current user
      }));
      
      setProjects(apiProjects);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
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
      loadTasks,
      agents,
      availableAgents,
      loadAgents,
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
      loadDashboardStats,
      loadActivityFeed,
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