import { apiClient } from './authService';
import { config } from '../config';

// Types for Dashboard
export interface DashboardOverview {
  projects: {
    total: number;
    active: number;
    completed: number;
    on_hold: number;
  };
  tasks: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    overdue: number;
  };
  agents: {
    total: number;
    active: number;
    busy: number;
    actions_today: number;
  };
  automation: {
    percentage: number;
    time_saved_hours: number;
    cost_saved: number;
  };
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'project_created' | 'task_completed' | 'agent_action' | 'deployment' | 'requirement_added';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  metadata?: {
    project_id?: string;
    task_id?: string;
    agent_id?: string;
    [key: string]: any;
  };
}

export interface AutomationMetrics {
  total_actions: number;
  automated_actions: number;
  automation_percentage: number;
  time_saved_hours: number;
  cost_saved: number;
  efficiency_score: number;
  breakdown_by_type: {
    code_generation: number;
    testing: number;
    deployment: number;
    review: number;
    documentation: number;
  };
  trends: {
    daily: Array<{ date: string; automated: number; manual: number }>;
    weekly: Array<{ week: string; automated: number; manual: number }>;
  };
}

export interface ProjectMetrics {
  project_id: string;
  project_name: string;
  completion_percentage: number;
  tasks_completed: number;
  tasks_total: number;
  requirements_completed: number;
  requirements_total: number;
  team_productivity: number;
  velocity: number;
  budget_utilization: number;
  timeline_status: 'on_track' | 'delayed' | 'ahead' | 'at_risk';
  risk_factors: string[];
  next_milestones: Array<{
    name: string;
    due_date: string;
    completion_percentage: number;
  }>;
}

export interface TrendsAnalytics {
  period: string;
  project_creation_trend: Array<{ date: string; count: number }>;
  task_completion_trend: Array<{ date: string; completed: number; created: number }>;
  automation_trend: Array<{ date: string; percentage: number }>;
  team_productivity_trend: Array<{ date: string; score: number }>;
  code_quality_trend: Array<{ date: string; score: number }>;
  deployment_frequency: Array<{ date: string; deployments: number; success_rate: number }>;
  bug_detection_rate: Array<{ date: string; bugs_found: number; bugs_fixed: number }>;
}

// Dashboard API Service
class DashboardService {
  // Get dashboard statistics
  async getStats(): Promise<DashboardOverview> {
    return apiClient.get<DashboardOverview>(config.dashboard.stats);
  }

  // Get detailed dashboard metrics
  async getMetrics(): Promise<any> {
    return apiClient.get<any>(config.dashboard.metrics);
  }

  // Get activity feed
  async getActivity(params?: {
    limit?: number;
    offset?: number;
    type?: string;
    project_id?: string;
  }): Promise<{ activities: ActivityItem[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.type) searchParams.set('type', params.type);
    if (params?.project_id) searchParams.set('project_id', params.project_id);

    const endpoint = `${config.dashboard.activity}?${searchParams.toString()}`;
    return apiClient.get<{ activities: ActivityItem[]; total: number }>(endpoint);
  }

  // Get dashboard overview
  async getOverview(params?: { project_id?: string }): Promise<DashboardOverview> {
    const searchParams = new URLSearchParams();
    if (params?.project_id) searchParams.set('project_id', params.project_id);

    const endpoint = `${config.dashboard.overview}?${searchParams.toString()}`;
    return apiClient.get<DashboardOverview>(endpoint);
  }

  // Get automation metrics
  async getAutomationMetrics(params?: { 
    project_id?: string;
    days?: number;
  }): Promise<AutomationMetrics> {
    const searchParams = new URLSearchParams();
    if (params?.project_id) searchParams.set('project_id', params.project_id);
    if (params?.days) searchParams.set('days', params.days.toString());

    const endpoint = `${config.dashboard.automation}?${searchParams.toString()}`;
    return apiClient.get<AutomationMetrics>(endpoint);
  }

  // Get project metrics
  async getProjectMetrics(params?: { 
    project_id?: string;
  }): Promise<ProjectMetrics | ProjectMetrics[]> {
    const searchParams = new URLSearchParams();
    if (params?.project_id) searchParams.set('project_id', params.project_id);

    const endpoint = `${config.dashboard.projects}?${searchParams.toString()}`;
    return apiClient.get<ProjectMetrics | ProjectMetrics[]>(endpoint);
  }

  // Get activity feed (legacy endpoint)
  async getActivityFeed(params?: {
    project_id?: string;
    limit?: number;
    skip?: number;
    type?: string;
  }): Promise<{ items: ActivityItem[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.project_id) searchParams.set('project_id', params.project_id);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.skip) searchParams.set('skip', params.skip.toString());
    if (params?.type) searchParams.set('type', params.type);

    const endpoint = `${config.dashboard.activityFeed}?${searchParams.toString()}`;
    return apiClient.get<{ items: ActivityItem[]; total: number }>(endpoint);
  }

  // Get trends analytics
  async getTrendsAnalytics(params?: {
    project_id?: string;
    days?: number;
  }): Promise<TrendsAnalytics> {
    const searchParams = new URLSearchParams();
    if (params?.project_id) searchParams.set('project_id', params.project_id);
    if (params?.days) searchParams.set('days', params.days.toString());

    const endpoint = `${config.dashboard.trends}?${searchParams.toString()}`;
    return apiClient.get<TrendsAnalytics>(endpoint);
  }
}

// Export service instance
export const dashboardService = new DashboardService();
export default dashboardService;
