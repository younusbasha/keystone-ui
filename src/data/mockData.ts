import {
  Project,
  Epic,
  Story,
  Task,
  AgentAction,
  ActivityItem,
  AuditLog,
  SystemSettings,
  Agent,
  Integration,
  RequirementAnalysis,
  DeploymentPipeline,
  AgentCommunication,
} from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Modern e-commerce platform with AI recommendations',
    status: 'in-progress',
    progress: 65,
    riskFlags: 2,
    createdAt: '2024-01-15T10:00:00Z',
    lastActivity: '2024-01-20T14:30:00Z',
    repository: 'https://github.com/company/ecommerce-platform',
    integrations: ['github', 'jira', 'jenkins'],
    assignedAgents: ['agent-1', 'agent-2', 'agent-4'],
    owner: 'alice@company.com',
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    description: 'Secure mobile banking application',
    status: 'review',
    progress: 90,
    riskFlags: 1,
    createdAt: '2024-01-10T09:00:00Z',
    lastActivity: '2024-01-20T16:45:00Z',
    repository: 'https://github.com/company/mobile-banking',
    integrations: ['github', 'gcp', 'firebase'],
    assignedAgents: ['agent-1', 'agent-3', 'agent-5'],
    owner: 'bob@company.com',
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting dashboard',
    status: 'pending',
    progress: 25,
    riskFlags: 0,
    createdAt: '2024-01-18T11:00:00Z',
    lastActivity: '2024-01-19T09:15:00Z',
    repository: 'https://github.com/company/analytics-dashboard',
    integrations: ['github', 'jenkins'],
    assignedAgents: ['agent-2', 'agent-4'],
    owner: 'carol@company.com',
  },
];

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Requirements Parser',
    type: 'requirements-parser',
    status: 'active',
    description: 'Analyzes natural language requirements and extracts structured information',
    capabilities: ['NLP processing', 'Intent recognition', 'Entity extraction', 'Context analysis'],
    currentTask: 'Analyzing user authentication requirements',
    lastActivity: '2024-01-20T14:30:00Z',
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
    lastActivity: '2024-01-20T14:25:00Z',
    successRate: 89.2,
    totalTasks: 89,
    configuration: {
      model: 'gemini-pro',
      planningHorizon: 30,
      estimationMethod: 'story-points',
    },
    integrations: ['jira', 'github'],
  },
  {
    id: 'agent-3',
    name: 'Story Generator',
    type: 'story-generator',
    status: 'active',
    description: 'Generates user stories with acceptance criteria from epics',
    capabilities: ['Story writing', 'Acceptance criteria', 'Persona modeling', 'Journey mapping'],
    lastActivity: '2024-01-20T13:45:00Z',
    successRate: 91.8,
    totalTasks: 156,
    configuration: {
      model: 'gemini-pro',
      storyFormat: 'gherkin',
      includePersonas: true,
    },
    integrations: ['jira'],
  },
  {
    id: 'agent-4',
    name: 'Code Generator',
    type: 'code-generator',
    status: 'active',
    description: 'Generates production-ready code from technical specifications',
    capabilities: ['Code generation', 'Test creation', 'Documentation', 'Code review'],
    currentTask: 'Generating API endpoints for user management',
    lastActivity: '2024-01-20T14:20:00Z',
    successRate: 87.3,
    totalTasks: 203,
    configuration: {
      model: 'gemini-pro',
      language: 'typescript',
      framework: 'react',
      testFramework: 'jest',
    },
    integrations: ['github', 'jenkins'],
  },
  {
    id: 'agent-5',
    name: 'Code Reviewer',
    type: 'reviewer',
    status: 'idle',
    description: 'Reviews code quality, security, and best practices',
    capabilities: ['Code analysis', 'Security scanning', 'Performance review', 'Best practices'],
    lastActivity: '2024-01-20T12:30:00Z',
    successRate: 96.1,
    totalTasks: 178,
    configuration: {
      model: 'gemini-pro',
      strictness: 'high',
      securityFocus: true,
    },
    integrations: ['github'],
  },
  {
    id: 'agent-6',
    name: 'Deployment Orchestrator',
    type: 'deployment',
    status: 'idle',
    description: 'Manages CI/CD pipelines and deployment processes',
    capabilities: ['Pipeline management', 'Environment provisioning', 'Rollback handling', 'Monitoring'],
    lastActivity: '2024-01-20T11:15:00Z',
    successRate: 92.7,
    totalTasks: 67,
    configuration: {
      model: 'gemini-pro',
      environment: 'gcp',
      strategy: 'blue-green',
    },
    integrations: ['jenkins', 'gcp', 'github'],
  },
];

export const mockIntegrations: Integration[] = [
  {
    id: 'int-1',
    type: 'github',
    name: 'GitHub Enterprise',
    status: 'connected',
    configuration: {
      apiUrl: 'https://api.github.com',
      organization: 'company',
      webhookUrl: 'https://platform.company.com/webhooks/github',
    },
    lastSync: '2024-01-20T14:30:00Z',
  },
  {
    id: 'int-2',
    type: 'jira',
    name: 'Jira Cloud',
    status: 'connected',
    configuration: {
      baseUrl: 'https://company.atlassian.net',
      projectKey: 'SDLC',
    },
    lastSync: '2024-01-20T14:25:00Z',
  },
  {
    id: 'int-3',
    type: 'jenkins',
    name: 'Jenkins CI/CD',
    status: 'connected',
    configuration: {
      baseUrl: 'https://jenkins.company.com',
      defaultPipeline: 'build-test-deploy',
    },
    lastSync: '2024-01-20T14:20:00Z',
  },
  {
    id: 'int-4',
    type: 'gcp',
    name: 'Google Cloud Platform',
    status: 'connected',
    configuration: {
      projectId: 'company-sdlc-platform',
      region: 'us-central1',
    },
    lastSync: '2024-01-20T14:15:00Z',
  },
];

export const mockAgentCommunications: AgentCommunication[] = [
  {
    id: 'comm-1',
    fromAgent: 'agent-1',
    toAgent: 'agent-2',
    message: 'Requirements parsed successfully. Delegating task planning for user authentication epic.',
    type: 'delegation',
    timestamp: '2024-01-20T14:30:00Z',
    status: 'processed',
  },
  {
    id: 'comm-2',
    fromAgent: 'agent-2',
    toAgent: 'agent-3',
    message: 'Task breakdown complete. Need user stories for payment processing workflow.',
    type: 'collaboration',
    timestamp: '2024-01-20T14:25:00Z',
    status: 'processed',
  },
  {
    id: 'comm-3',
    fromAgent: 'agent-4',
    toAgent: 'agent-5',
    message: 'Code generation complete for API endpoints. Requesting security review.',
    type: 'escalation',
    timestamp: '2024-01-20T14:20:00Z',
    status: 'received',
  },
];

export const mockRequirementAnalyses: RequirementAnalysis[] = [
  {
    id: 'req-1',
    originalText: 'We need a user authentication system that supports email/password login, social login, and password reset functionality.',
    parsedIntent: 'Implement comprehensive user authentication system',
    extractedEntities: {
      features: ['email/password login', 'social login', 'password reset'],
      priority: 'high',
      complexity: 'medium',
      estimatedEffort: '2-3 sprints',
    },
    suggestedEpics: [],
    confidence: 0.92,
    agentId: 'agent-1',
    timestamp: '2024-01-20T14:30:00Z',
    feedback: 'accepted',
  },
];

export const mockDeploymentPipelines: DeploymentPipeline[] = [
  {
    id: 'pipeline-1',
    projectId: '1',
    name: 'E-commerce Platform CI/CD',
    stages: [
      {
        id: 'stage-1',
        name: 'Build',
        type: 'build',
        status: 'success',
        logs: ['Building application...', 'Dependencies installed', 'Build completed successfully'],
        duration: 120,
      },
      {
        id: 'stage-2',
        name: 'Test',
        type: 'test',
        status: 'success',
        logs: ['Running unit tests...', 'All tests passed', 'Coverage: 87%'],
        duration: 180,
      },
      {
        id: 'stage-3',
        name: 'Deploy to Staging',
        type: 'deploy',
        status: 'running',
        logs: ['Deploying to staging environment...'],
      },
    ],
    status: 'running',
    lastRun: '2024-01-20T14:30:00Z',
    agentId: 'agent-6',
  },
];
export const mockEpics: Epic[] = [
  {
    id: '1',
    title: 'User Authentication System',
    description: 'Complete user authentication and authorization system',
    projectId: '1',
    stories: [],
    priority: 'high',
    status: 'in-progress',
    createdAt: '2024-01-15T10:00:00Z',
    generatedBy: 'agent-1',
    confidence: 0.92,
  },
  {
    id: '2',
    title: 'Product Catalog Management',
    description: 'Product catalog with search and filtering capabilities',
    projectId: '1',
    stories: [],
    priority: 'medium',
    status: 'pending',
    createdAt: '2024-01-16T10:00:00Z',
    generatedBy: 'agent-1',
    confidence: 0.87,
  },
];

export const mockStories: Story[] = [
  {
    id: '1',
    title: 'User Registration',
    description: 'Allow users to register with email and password',
    epicId: '1',
    tasks: [],
    priority: 'high',
    status: 'in-progress',
    createdAt: '2024-01-15T10:30:00Z',
    acceptanceCriteria: [
      'User can enter email and password',
      'System validates email format',
      'Password meets security requirements',
      'Confirmation email is sent',
    ],
    generatedBy: 'agent-3',
    confidence: 0.89,
  },
  {
    id: '2',
    title: 'User Login',
    description: 'Allow users to login with credentials',
    epicId: '1',
    tasks: [],
    priority: 'high',
    status: 'completed',
    createdAt: '2024-01-15T11:00:00Z',
    acceptanceCriteria: [
      'User can enter email and password',
      'System authenticates credentials',
      'User is redirected to dashboard on success',
      'Error message shown on failure',
    ],
    generatedBy: 'agent-3',
    confidence: 0.94,
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Create user registration API endpoint',
    description: 'Implement REST API endpoint for user registration with validation',
    storyId: '1',
    status: 'in-progress',
    priority: 'high',
    component: 'backend',
    assignedTo: 'CodeGen-Agent-01',
    isAgentAssigned: true,
    generatedCode: `// User Registration API Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: user._id 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});`,
    testCases: [
      'Test successful user registration with valid data',
      'Test registration with missing email returns 400',
      'Test registration with existing email returns 409',
      'Test password hashing is applied correctly',
    ],
    infraSetup: [
      'Set up MongoDB connection for user storage',
      'Configure bcrypt for password hashing',
      'Add input validation middleware',
    ],
    comments: [
      {
        id: '1',
        content: 'API endpoint generated successfully. Includes proper validation and error handling.',
        author: 'CodeGen-Agent-01',
        isHuman: false,
        createdAt: '2024-01-20T10:30:00Z',
      },
    ],
    approvals: [],
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    estimatedHours: 8,
    actualHours: 6,
    dependencies: [],
    blockers: [],
    generatedBy: 'agent-2',
    confidence: 0.91,
  },
  {
    id: '2',
    title: 'Create user registration form',
    description: 'Build React form component for user registration',
    storyId: '1',
    status: 'pending',
    priority: 'high',
    component: 'frontend',
    assignedTo: 'UI-Agent-02',
    isAgentAssigned: true,
    comments: [],
    approvals: [],
    createdAt: '2024-01-15T12:30:00Z',
    updatedAt: '2024-01-15T12:30:00Z',
    estimatedHours: 4,
    dependencies: ['1'],
    blockers: [],
    generatedBy: 'agent-2',
    confidence: 0.88,
  },
];

export const mockAgentActions: AgentAction[] = [
  {
    id: '1',
    agentName: 'CodeGen-Agent-01',
    action: 'Generated API endpoint',
    dataTouched: 'User registration endpoint',
    riskLevel: 'low',
    timestamp: '2024-01-20T10:30:00Z',
    status: 'pending',
    description: 'Generated REST API endpoint for user registration with validation and error handling',
    impactDescription: 'New endpoint will handle user registration requests. No existing functionality affected.',
  },
  {
    id: '2',
    agentName: 'Schema-Agent-01',
    action: 'Modified database schema',
    dataTouched: 'users table',
    riskLevel: 'medium',
    timestamp: '2024-01-20T09:15:00Z',
    status: 'pending',
    description: 'Added new columns to users table for profile information',
    impactDescription: 'Schema changes may require migration. Backup recommended before deployment.',
  },
  {
    id: '3',
    agentName: 'Deploy-Agent-01',
    action: 'Attempted production deployment',
    dataTouched: 'Production environment',
    riskLevel: 'high',
    timestamp: '2024-01-20T14:20:00Z',
    status: 'escalated',
    description: 'Attempted to deploy changes to production environment',
    impactDescription: 'High-risk action automatically escalated due to production environment impact.',
  },
];

export const mockActivityItems: ActivityItem[] = [
  {
    id: '1',
    type: 'agent_decision',
    title: 'CodeGen-Agent-01 generated new API endpoint',
    description: 'User registration endpoint with validation logic',
    timestamp: '2024-01-20T10:30:00Z',
    riskLevel: 'low',
    isRead: false,
  },
  {
    id: '2',
    type: 'escalation',
    title: 'Deploy-Agent-01 escalated production deployment',
    description: 'High-risk deployment requires human approval',
    timestamp: '2024-01-20T14:20:00Z',
    riskLevel: 'high',
    isRead: false,
  },
  {
    id: '3',
    type: 'flagged_task',
    title: 'Task flagged for review',
    description: 'Database schema changes need human verification',
    timestamp: '2024-01-20T09:15:00Z',
    riskLevel: 'medium',
    isRead: true,
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    agentName: 'CodeGen-Agent-01',
    action: 'Generated API endpoint for user registration',
    actionType: 'create',
    outcome: 'success',
    timestamp: '2024-01-20T10:30:00Z',
    details: 'Successfully generated REST API endpoint with proper validation and error handling',
    riskLevel: 'low',
  },
  {
    id: '2',
    userName: 'Alice Johnson',
    action: 'Approved agent-generated code',
    actionType: 'approve',
    outcome: 'success',
    timestamp: '2024-01-20T11:00:00Z',
    details: 'Human approved CodeGen-Agent-01 generated registration endpoint',
    riskLevel: 'low',
  },
  {
    id: '3',
    agentName: 'Deploy-Agent-01',
    action: 'Attempted production deployment',
    actionType: 'update',
    outcome: 'pending',
    timestamp: '2024-01-20T14:20:00Z',
    details: 'Production deployment escalated to human reviewer due to high risk level',
    riskLevel: 'high',
  },
];

export const mockSystemSettings: SystemSettings = {
  autoApproveSafeActions: true,
  requireHumanReviewForProdDB: true,
  allowAgentSelfDelegation: false,
  maxRiskLevelForAutoApproval: 'low',
  agentCommunicationTimeout: 300,
  maxConcurrentAgents: 10,
  enableAgentLearning: true,
  deploymentApprovalRequired: true,
};