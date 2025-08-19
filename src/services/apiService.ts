// Comprehensive API Service - Exports all services
export { authService, apiClient } from './authService';
export { projectsService, requirementsService, tasksService } from './projectsService';
export { aiAgentsService } from './agentsService';
export { integrationsService, deploymentsService } from './integrationsService';
export { dashboardService } from './dashboardService';

// Export all types
export type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ApiError,
} from './authService';

export type {
  Project,
  ProjectListResponse,
  Requirement,
  RequirementAnalysis,
  Task,
  TaskComment,
} from './projectsService';

export type {
  AIAgent,
  AgentAction,
  AgentAnalytics,
} from './agentsService';

export type {
  Integration,
  Deployment,
} from './integrationsService';

export type {
  DashboardOverview,
  ActivityItem,
  AutomationMetrics,
  ProjectMetrics,
  TrendsAnalytics,
} from './dashboardService';

// Unified API object for easy access
const api = {
  auth: () => import('./authService').then(m => m.authService),
  projects: () => import('./projectsService').then(m => m.projectsService),
  requirements: () => import('./projectsService').then(m => m.requirementsService),
  tasks: () => import('./projectsService').then(m => m.tasksService),
  agents: () => import('./agentsService').then(m => m.aiAgentsService),
  integrations: () => import('./integrationsService').then(m => m.integrationsService),
  deployments: () => import('./integrationsService').then(m => m.deploymentsService),
  dashboard: () => import('./dashboardService').then(m => m.dashboardService),
};

export default api;
