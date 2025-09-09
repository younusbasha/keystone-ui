import { authService } from './authService';
import { config } from '../config';

// Types for Task API
export interface ApiTask {
  id: string;
  title: string;
  description: string;
  project_id: string;
  requirement_id?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  estimated_hours?: number;
  actual_hours?: number;
  task_type: 'development' | 'testing' | 'documentation' | 'design' | 'review' | 'deployment';
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  project_id: string;
  requirement_id?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_hours?: number;
  task_type: 'development' | 'testing' | 'documentation' | 'design' | 'review' | 'deployment';
  assigned_to?: string;
  due_date?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  estimated_hours?: number;
  actual_hours?: number;
  task_type?: 'development' | 'testing' | 'documentation' | 'design' | 'review' | 'deployment';
  assigned_to?: string;
  due_date?: string;
}

export interface UpdateTaskStatusRequest {
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
}

export interface TasksListResponse {
  tasks: ApiTask[];
  total: number;
  skip: number;
  limit: number;
}

export interface TaskComment {
  id: string;
  task_id: string;
  content: string;
  created_by: string;
  created_at: string;
}

export interface CreateTaskCommentRequest {
  content: string;
}

class TasksService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = authService.getAccessToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`http://localhost:8000${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await authService.refreshToken();
      if (refreshed) {
        // Retry with new token
        const newToken = authService.getAccessToken();
        const retryResponse = await fetch(`http://localhost:8000${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
            ...options.headers,
          },
        });
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        
        return retryResponse.json();
      } else {
        throw new Error('Authentication failed');
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get all tasks with pagination
  async listTasks(params?: {
    skip?: number;
    limit?: number;
    project_id?: string;
    status?: string;
    priority?: string;
    assigned_to?: string;
  }): Promise<TasksListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.project_id) queryParams.append('project_id', params.project_id);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.assigned_to) queryParams.append('assigned_to', params.assigned_to);

    const queryString = queryParams.toString();
    const endpoint = `${config.tasks.list}${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<TasksListResponse>(endpoint);
  }

  // Get task by ID
  async getTask(id: string): Promise<ApiTask> {
    return this.makeRequest<ApiTask>(config.tasks.get(id));
  }

  // Create new task
  async createTask(taskData: CreateTaskRequest): Promise<ApiTask> {
    return this.makeRequest<ApiTask>(config.tasks.create, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // Update task
  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<ApiTask> {
    return this.makeRequest<ApiTask>(config.tasks.update(id), {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  // Update task status
  async updateTaskStatus(id: string, statusData: UpdateTaskStatusRequest): Promise<ApiTask> {
    return this.makeRequest<ApiTask>(config.tasks.updateStatus(id), {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  // Start task (change status to in_progress)
  async startTask(id: string): Promise<ApiTask> {
    return this.updateTaskStatus(id, { status: 'in_progress' });
  }

  // Complete task (change status to completed)
  async completeTask(id: string): Promise<ApiTask> {
    return this.updateTaskStatus(id, { status: 'completed' });
  }

  // Get task comments
  async getTaskComments(id: string): Promise<TaskComment[]> {
    return this.makeRequest<TaskComment[]>(config.tasks.comments(id));
  }

  // Add task comment
  async addTaskComment(id: string, commentData: CreateTaskCommentRequest): Promise<TaskComment> {
    return this.makeRequest<TaskComment>(config.tasks.comments(id), {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  // Delete task
  async deleteTask(id: string): Promise<void> {
    await this.makeRequest<void>(config.tasks.get(id), {
      method: 'DELETE',
    });
  }

  // Get tasks by project
  async getTasksByProject(projectId: string, params?: {
    skip?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }): Promise<TasksListResponse> {
    return this.listTasks({
      ...params,
      project_id: projectId,
    });
  }

  // Get tasks by requirement
  async getTasksByRequirement(requirementId: string): Promise<TasksListResponse> {
    // This would need to be implemented on the backend if not available
    // For now, we'll filter on the frontend
    const allTasks = await this.listTasks();
    const filteredTasks = allTasks.tasks.filter(task => task.requirement_id === requirementId);
    
    return {
      tasks: filteredTasks,
      total: filteredTasks.length,
      skip: 0,
      limit: filteredTasks.length,
    };
  }
}

export const tasksService = new TasksService();
export default tasksService;
