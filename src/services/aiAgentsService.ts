import { apiClient } from './authService';
import { config } from '../config';
import { Agent } from '../types';

// API types for agents - Updated to match backend response
export interface ApiAgent {
  id?: string;
  name: string;
  agent_type: 'codegen' | 'test' | 'review' | 'task_planner' | 'integration' | 'qa' | 'deployment' | 'analysis';
  description?: string;
  capabilities: string[];
  configuration?: Record<string, any> | null;
  max_concurrent_actions?: number;
  status?: 'idle' | 'busy' | 'offline' | 'error';
  version?: string;
  success_rate?: number;
  average_confidence?: number;
  total_actions?: number;
  successful_actions?: number;
  current_load?: number;
  project_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AgentExecutionRequest {
  agent_id: string;
  action: string;
  context: {
    task_id?: string;
    requirements?: string;
    [key: string]: any;
  };
}

export interface AgentExecutionResponse {
  execution_id: string;
  status: 'started' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface AgentListResponse {
  items: ApiAgent[];
  total: number;
}

// AI Agents API Service
class AIAgentsService {
  // List agents
  async listAgents(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    agent_type?: string;
  }): Promise<AgentListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.agent_type) searchParams.set('agent_type', params.agent_type);

    const endpoint = `${config.agents.list}?${searchParams.toString()}`;
    // Backend returns array directly, not wrapped in an object
    const agentsArray = await apiClient.get<ApiAgent[]>(endpoint);
    
    return {
      items: agentsArray,
      total: agentsArray.length
    };
  }

  // Get a specific agent
  async getAgent(id: string): Promise<ApiAgent> {
    return apiClient.get<ApiAgent>(config.agents.get(id));
  }

  // Create a new agent
  async createAgent(agentData: Omit<ApiAgent, 'id' | 'created_at' | 'updated_at' | 'status' | 'success_rate' | 'total_actions' | 'successful_actions' | 'current_load'>): Promise<ApiAgent> {
    return apiClient.post<ApiAgent>(config.agents.create, agentData);
  }

  // Update an agent
  async updateAgent(id: string, updates: Partial<ApiAgent>): Promise<ApiAgent> {
    return apiClient.put<ApiAgent>(config.agents.update(id), updates);
  }

  // Execute agent action
  async executeAgent(executionData: AgentExecutionRequest): Promise<AgentExecutionResponse> {
    // Use the execute endpoint without agent ID since it's in the payload
    return apiClient.post<AgentExecutionResponse>('/api/v1/agents/execute', executionData);
  }

  // Get agent status
  async getAgentStatus(id: string): Promise<{ id: string; status: string; current_action?: string; progress?: number }> {
    return apiClient.get<{ id: string; status: string; current_action?: string; progress?: number }>(`/api/v1/agents/${id}/status`);
  }

  // Get agent analytics
  async getAgentAnalytics(): Promise<{
    total_agents: number;
    active_agents: number;
    total_actions: number;
    success_rate: number;
    performance_metrics: Record<string, any>;
  }> {
    return apiClient.get<{
      total_agents: number;
      active_agents: number;
      total_actions: number;
      success_rate: number;
      performance_metrics: Record<string, any>;
    }>(config.agents.analytics);
  }
}

// Export service instance
export const aiAgentsService = new AIAgentsService();
export default aiAgentsService;
