import { apiClient } from './authService';
import { config } from '../config';

// Types for AI Agents
export interface AIAgent {
  id?: string;
  name: string;
  agent_type: 'codegen' | 'testing' | 'review' | 'analysis' | 'deployment';
  status?: 'active' | 'inactive' | 'busy' | 'error';
  capabilities: string[];
  configuration: {
    max_code_lines?: number;
    coding_standards?: string;
    frameworks?: string[];
    ai_model?: string;
    [key: string]: any;
  };
  max_concurrent_actions: number;
  project_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AgentAction {
  id?: string;
  agent_id: string;
  action_type: 'code_generation' | 'code_review' | 'testing' | 'analysis' | 'deployment';
  target_type: 'task' | 'requirement' | 'project';
  target_id: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'requires_review' | 'approved' | 'rejected';
  input_data: {
    specification?: string;
    language?: string;
    framework?: string;
    requirements?: string[];
    [key: string]: any;
  };
  output_data?: {
    generated_code?: string;
    analysis_results?: any;
    recommendations?: string[];
    [key: string]: any;
  };
  confidence_score?: number;
  risk_level?: 'low' | 'medium' | 'high';
  review_comments?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AgentAnalytics {
  total_agents: number;
  active_agents: number;
  total_actions_today: number;
  success_rate: number;
  avg_completion_time: number;
  actions_by_type: { [key: string]: number };
  performance_metrics: {
    code_quality_score: number;
    automation_efficiency: number;
    error_rate: number;
  };
}

// AI Agents API Service
class AIAgentsService {
  // List AI agents with filtering
  async listAgents(params?: {
    project_id?: string;
    agent_type?: string;
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ items: AIAgent[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.project_id) searchParams.set('project_id', params.project_id);
    if (params?.agent_type) searchParams.set('agent_type', params.agent_type);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());

    const endpoint = `${config.agents.list}?${searchParams.toString()}`;
    return apiClient.get<{ items: AIAgent[]; total: number }>(endpoint);
  }

  // Create a new AI agent
  async createAgent(agentData: Omit<AIAgent, 'id' | 'created_at' | 'updated_at'>): Promise<AIAgent> {
    return apiClient.post<AIAgent>(config.agents.create, agentData);
  }

  // Get a specific agent
  async getAgent(id: string): Promise<AIAgent> {
    return apiClient.get<AIAgent>(config.agents.get(id));
  }

  // Update an agent
  async updateAgent(id: string, updates: Partial<AIAgent>): Promise<AIAgent> {
    return apiClient.put<AIAgent>(config.agents.update(id), updates);
  }

  // Execute an agent action
  async executeAction(agentId: string, actionData: Omit<AgentAction, 'id' | 'agent_id' | 'created_at' | 'updated_at'>): Promise<AgentAction> {
    return apiClient.post<AgentAction>(config.agents.execute(agentId), actionData);
  }

  // Get agent actions
  async getAgentActions(agentId: string, params?: {
    status?: string;
    action_type?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ items: AgentAction[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.action_type) searchParams.set('action_type', params.action_type);
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());

    const endpoint = `${config.agents.actions(agentId)}?${searchParams.toString()}`;
    return apiClient.get<{ items: AgentAction[]; total: number }>(endpoint);
  }

  // Approve an agent action
  async approveAction(actionId: string, reviewComments?: string): Promise<{ message: string; status: string }> {
    const body = reviewComments ? { review_comments: reviewComments } : {};
    return apiClient.post<{ message: string; status: string }>(config.agents.approveAction(actionId), body);
  }

  // Reject an agent action
  async rejectAction(actionId: string, reviewComments: string): Promise<{ message: string; status: string }> {
    return apiClient.post<{ message: string; status: string }>(
      config.agents.approveAction(actionId).replace('/approve', '/reject'),
      { review_comments: reviewComments }
    );
  }

  // Get agent analytics
  async getAnalytics(params?: { project_id?: string }): Promise<AgentAnalytics> {
    const searchParams = new URLSearchParams();
    if (params?.project_id) searchParams.set('project_id', params.project_id);

    const endpoint = `${config.agents.analytics}?${searchParams.toString()}`;
    return apiClient.get<AgentAnalytics>(endpoint);
  }
}

// Export service instance
export const aiAgentsService = new AIAgentsService();
export default aiAgentsService;
