// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '', // Empty for proxy mode in development
    version: import.meta.env.VITE_API_VERSION || 'v1',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
  },

  // Authentication Endpoints
  auth: {
    register: import.meta.env.VITE_AUTH_REGISTER_ENDPOINT || '/api/v1/auth/register',
    login: import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || '/api/v1/auth/login',
    logout: import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT || '/api/v1/auth/logout',
    refresh: import.meta.env.VITE_AUTH_REFRESH_ENDPOINT || '/api/v1/auth/refresh',
    me: import.meta.env.VITE_AUTH_ME_ENDPOINT || '/api/v1/auth/me',
  },

  // Projects Endpoints
  projects: {
    list: '/api/v1/projects/',
    create: '/api/v1/projects/',
    get: (id: string) => `/api/v1/projects/${id}/`,
    update: (id: string) => `/api/v1/projects/${id}/`,
    delete: (id: string) => `/api/v1/projects/${id}/`,
  },

  // Requirements Endpoints  
  requirements: {
    list: (projectId: string) => `/api/v1/requirements/project/${projectId}`,
    create: '/api/v1/requirements',
    get: (id: string) => `/api/v1/requirements/${id}`,
    update: (id: string) => `/api/v1/requirements/${id}`,
    analyze: (id: string) => `/api/v1/requirements/${id}/analyze`,
    generateTasks: (id: string) => `/api/v1/requirements/${id}/generate-tasks`,
  },

  // Tasks Endpoints
  tasks: {
    list: '/api/v1/tasks',
    create: '/api/v1/tasks',
    get: (id: string) => `/api/v1/tasks/${id}`,
    update: (id: string) => `/api/v1/tasks/${id}`,
    start: (id: string) => `/api/v1/tasks/${id}/start`,
    complete: (id: string) => `/api/v1/tasks/${id}/complete`,
    comments: (id: string) => `/api/v1/tasks/${id}/comments`,
  },

  // AI Agents Endpoints
  agents: {
    list: '/api/v1/agents',
    create: '/api/v1/agents',
    get: (id: string) => `/api/v1/agents/${id}`,
    update: (id: string) => `/api/v1/agents/${id}`,
    execute: (id: string) => `/api/v1/agents/${id}/execute`,
    actions: (id: string) => `/api/v1/agents/${id}/actions`,
    approveAction: (actionId: string) => `/api/v1/agents/actions/${actionId}/approve`,
    analytics: '/api/v1/agents/analytics/overview',
  },

  // Integrations & Deployments Endpoints
  integrations: {
    list: '/api/v1/integrations',
    create: '/api/v1/integrations',
    get: (id: string) => `/api/v1/integrations/${id}`,
    test: (id: string) => `/api/v1/integrations/${id}/test`,
    deployments: {
      list: '/api/v1/integrations/deployments',
      create: '/api/v1/integrations/deployments',
      get: (id: string) => `/api/v1/integrations/deployments/${id}`,
    },
  },

  // Dashboard & Analytics Endpoints
  dashboard: {
    overview: '/api/v1/dashboard/overview',
    automation: '/api/v1/dashboard/metrics/automation',
    projects: '/api/v1/dashboard/metrics/projects',
    activityFeed: '/api/v1/dashboard/activity-feed',
    trends: '/api/v1/dashboard/analytics/trends',
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Keystone UI',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  },

  // Feature Flags
  features: {
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
    enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  },

  // Security
  security: {
    enableHttps: import.meta.env.VITE_ENABLE_HTTPS === 'true',
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000'),
  },

  // UI Configuration
  ui: {
    defaultTheme: import.meta.env.VITE_DEFAULT_THEME || 'system',
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${endpoint}`;
};

// Helper function to check if we're in development
export const isDevelopment = (): boolean => {
  return config.app.environment === 'development';
};

// Helper function to check if we're in production
export const isProduction = (): boolean => {
  return config.app.environment === 'production';
};

export default config;
