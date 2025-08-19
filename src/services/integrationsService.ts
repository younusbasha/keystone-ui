import { apiClient } from './authService';
import { config } from '../config';

// Types for Integrations
export interface Integration {
  id?: string;
  name: string;
  integration_type: 'github' | 'gitlab' | 'jira' | 'slack' | 'teams' | 'jenkins' | 'docker';
  status?: 'active' | 'inactive' | 'error' | 'testing';
  endpoint_url: string;
  auth_type: 'token' | 'oauth' | 'basic' | 'apikey';
  credentials: {
    token?: string;
    username?: string;
    password?: string;
    api_key?: string;
    [key: string]: any;
  };
  config: {
    repository?: string;
    webhook_events?: string[];
    default_branch?: string;
    [key: string]: any;
  };
  project_id?: string;
  last_sync?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Deployment {
  id?: string;
  project_id: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  status?: 'pending' | 'in_progress' | 'success' | 'failed' | 'rolled_back';
  deployment_type: 'blue-green' | 'rolling' | 'recreate' | 'canary';
  commit_hash: string;
  branch: string;
  tag?: string;
  config: {
    instances?: number;
    health_check_url?: string;
    timeout?: number;
    rollback_on_failure?: boolean;
    [key: string]: any;
  };
  artifacts: {
    docker_image?: string;
    size_mb?: number;
    [key: string]: any;
  };
  started_at?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Integrations API Service
class IntegrationsService {
  // List integrations
  async listIntegrations(params?: {
    project_id?: string;
    integration_type?: string;
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ items: Integration[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.project_id) searchParams.set('project_id', params.project_id);
    if (params?.integration_type) searchParams.set('integration_type', params.integration_type);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());

    const endpoint = `${config.integrations.list}?${searchParams.toString()}`;
    return apiClient.get<{ items: Integration[]; total: number }>(endpoint);
  }

  // Create a new integration
  async createIntegration(integrationData: Omit<Integration, 'id' | 'created_at' | 'updated_at'>): Promise<Integration> {
    return apiClient.post<Integration>(config.integrations.create, integrationData);
  }

  // Get a specific integration
  async getIntegration(id: string): Promise<Integration> {
    return apiClient.get<Integration>(config.integrations.get(id));
  }

  // Update an integration
  async updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration> {
    return apiClient.put<Integration>(config.integrations.get(id), updates);
  }

  // Test an integration
  async testIntegration(id: string): Promise<{ status: string; message: string; details?: any }> {
    return apiClient.post<{ status: string; message: string; details?: any }>(config.integrations.test(id));
  }

  // Delete an integration
  async deleteIntegration(id: string): Promise<void> {
    return apiClient.delete<void>(config.integrations.get(id));
  }
}

// Deployments API Service
class DeploymentsService {
  // List deployments
  async listDeployments(params?: {
    project_id?: string;
    environment?: string;
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ items: Deployment[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.project_id) searchParams.set('project_id', params.project_id);
    if (params?.environment) searchParams.set('environment', params.environment);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());

    const endpoint = `${config.integrations.deployments.list}?${searchParams.toString()}`;
    return apiClient.get<{ items: Deployment[]; total: number }>(endpoint);
  }

  // Create a new deployment
  async createDeployment(deploymentData: Omit<Deployment, 'id' | 'created_at' | 'updated_at'>): Promise<Deployment> {
    return apiClient.post<Deployment>(config.integrations.deployments.create, deploymentData);
  }

  // Get a specific deployment
  async getDeployment(id: string): Promise<Deployment> {
    return apiClient.get<Deployment>(config.integrations.deployments.get(id));
  }

  // Rollback a deployment
  async rollbackDeployment(id: string): Promise<{ message: string; status: string }> {
    return apiClient.post<{ message: string; status: string }>(`${config.integrations.deployments.get(id)}/rollback`);
  }
}

// Export service instances
export const integrationsService = new IntegrationsService();
export const deploymentsService = new DeploymentsService();

export default {
  integrations: integrationsService,
  deployments: deploymentsService,
};
