import { apiClient } from './authService';
import { config } from '../config';

// Types for Projects
export interface Project {
  id?: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status?: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  start_date: string | null;
  end_date: string | null;
  budget: number;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
  requirements_count?: number;
  tasks_count?: number;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  page_size: number;
}

// Projects API Service
class ProjectsService {
  // List projects with optional filtering
  async listProjects(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }): Promise<ProjectListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.priority) searchParams.set('priority', params.priority);

    const endpoint = `${config.projects.list}?${searchParams.toString()}`;
    return apiClient.get<ProjectListResponse>(endpoint);
  }

  // Create a new project
  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    return apiClient.post<Project>(config.projects.create, projectData);
  }

  // Get a specific project
  async getProject(id: string): Promise<Project> {
    return apiClient.get<Project>(config.projects.get(id));
  }

  // Update a project
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return apiClient.put<Project>(config.projects.update(id), updates);
  }

  // Delete a project
  async deleteProject(id: string): Promise<void> {
    return apiClient.delete<void>(config.projects.delete(id));
  }
}

// Types for Requirements
export interface Requirement {
  id?: string;
  title: string;
  description: string;
  type: 'functional' | 'non_functional' | 'technical';
  priority: 'low' | 'medium' | 'high';
  status?: 'draft' | 'active' | 'completed' | 'archived';
  project_id: string | number; // Backend might expect integer
  acceptance_criteria: string[];
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface RequirementAnalysis {
  complexity_score: number;
  estimated_effort: number;
  risk_factors: string[];
  dependencies: string[];
  recommendations: string[];
}

export interface RequirementAnalysisRequest {
  requirement_text: string;
}

export interface RequirementListResponse {
  items: Requirement[];
  total: number;
}

// Requirements API Service
class RequirementsService {
  // List all requirements
  async listAllRequirements(params?: {
    skip?: number;
    limit?: number;
    type?: string;
    priority?: string;
  }): Promise<RequirementListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.type) searchParams.set('type', params.type);
    if (params?.priority) searchParams.set('priority', params.priority);

    const endpoint = `${config.requirements.listAll}?${searchParams.toString()}`;
    return apiClient.get<RequirementListResponse>(endpoint);
  }

  // List requirements for a project
  async listRequirements(projectId: string, params?: {
    skip?: number;
    limit?: number;
    type?: string;
    priority?: string;
  }): Promise<RequirementListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.type) searchParams.set('type', params.type);
    if (params?.priority) searchParams.set('priority', params.priority);

    const endpoint = `${config.requirements.list(projectId)}?${searchParams.toString()}`;
    return apiClient.get<RequirementListResponse>(endpoint);
  }

  // Create a new requirement
  async createRequirement(requirementData: Omit<Requirement, 'id' | 'created_at' | 'updated_at'>): Promise<Requirement> {
    return apiClient.post<Requirement>(config.requirements.create, requirementData);
  }

  // Get a specific requirement
  async getRequirement(id: string): Promise<Requirement> {
    return apiClient.get<Requirement>(config.requirements.get(id));
  }

  // Update a requirement
  async updateRequirement(id: string, updates: Partial<Requirement>): Promise<Requirement> {
    return apiClient.put<Requirement>(config.requirements.update(id), updates);
  }

  // AI analyze requirement by ID
  async analyzeRequirement(id: string): Promise<RequirementAnalysis> {
    return apiClient.post<RequirementAnalysis>(config.requirements.analyze(id));
  }

  // AI analyze requirement text (general analysis)
  async analyzeRequirementText(analysisRequest: RequirementAnalysisRequest): Promise<RequirementAnalysis> {
    return apiClient.post<RequirementAnalysis>(config.requirements.analyzeGeneral, analysisRequest);
  }

  // Generate tasks from requirement
  async generateTasks(id: string): Promise<{ message: string; tasks_generated: number }> {
    return apiClient.post<{ message: string; tasks_generated: number }>(config.requirements.generateTasks(id));
  }
}

// Types for Tasks
export interface Task {
  id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed' | 'blocked';
  task_type: 'development' | 'testing' | 'documentation' | 'deployment' | 'review';
  estimated_hours: number;
  actual_hours?: number;
  project_id: string;
  requirement_id?: string;
  assigned_to?: string;
  due_date: string;
  acceptance_criteria: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TaskComment {
  id?: string;
  content: string;
  comment_type: 'general' | 'question' | 'blocker' | 'update';
  author_id?: string;
  created_at?: string;
}

// Tasks API Service
class TasksService {
  // List tasks with filtering
  async listTasks(params?: {
    project_id?: string;
    requirement_id?: string;
    status?: string;
    priority?: string;
    assigned_to?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ items: Task[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.project_id) searchParams.set('project_id', params.project_id);
    if (params?.requirement_id) searchParams.set('requirement_id', params.requirement_id);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.priority) searchParams.set('priority', params.priority);
    if (params?.assigned_to) searchParams.set('assigned_to', params.assigned_to);
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());

    const endpoint = `${config.tasks.list}?${searchParams.toString()}`;
    return apiClient.get<{ items: Task[]; total: number }>(endpoint);
  }

  // Create a new task
  async createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    return apiClient.post<Task>(config.tasks.create, taskData);
  }

  // Get a specific task
  async getTask(id: string): Promise<Task> {
    return apiClient.get<Task>(config.tasks.get(id));
  }

  // Update a task
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return apiClient.put<Task>(config.tasks.update(id), updates);
  }

  // Start a task
  async startTask(id: string): Promise<{ message: string; status: string }> {
    return apiClient.post<{ message: string; status: string }>(config.tasks.start(id));
  }

  // Complete a task
  async completeTask(id: string): Promise<{ message: string; status: string }> {
    return apiClient.post<{ message: string; status: string }>(config.tasks.complete(id));
  }

  // Add comment to task
  async addComment(taskId: string, comment: Omit<TaskComment, 'id' | 'author_id' | 'created_at'>): Promise<TaskComment> {
    return apiClient.post<TaskComment>(config.tasks.comments(taskId), comment);
  }
}

// Export service instances
export const projectsService = new ProjectsService();
export const requirementsService = new RequirementsService();
export const tasksService = new TasksService();

export default {
  projects: projectsService,
  requirements: requirementsService,
  tasks: tasksService,
};
