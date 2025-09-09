export type UserRole = 'PM' | 'BA' | 'Developer' | 'Reviewer';

export interface AgentCoordination {
  id: string;
  taskId: string;
  primaryAgent: string;
  collaboratingAgents: string[];
  delegationRules: DelegationRule[];
  conflictResolution: ConflictResolution;
  sharedContext: Record<string, any>;
  status: 'planning' | 'executing' | 'reviewing' | 'completed' | 'conflict';
}

export interface DelegationRule {
  fromAgent: string;
  toAgent: string;
  condition: string;
  priority: number;
  requiresApproval: boolean;
}

export interface ConflictResolution {
  strategy: 'human_review' | 'priority_based' | 'consensus' | 'rollback';
  resolver?: string; // Agent or human ID
  timestamp?: string;
  resolution?: string;
}

export interface FeedbackLoop {
  id: string;
  agentId: string;
  taskId: string;
  humanFeedback: 'approve' | 'reject' | 'modify';
  feedbackText: string;
  improvements: string[];
  timestamp: string;
  userId: string;
}

export interface MVPScope {
  phase: 'core' | 'extended' | 'advanced';
  features: string[];
  agents: string[];
  integrations: string[];
  priority: number;
}
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked' | 'review';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Component = 'frontend' | 'backend' | 'devops' | 'database';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type AgentType = 'requirements-parser' | 'task-planner' | 'story-generator' | 'code-generator' | 'reviewer' | 'deployment' | 'orchestrator';
export type AgentStatus = 'active' | 'idle' | 'busy' | 'error' | 'offline';
export type IntegrationType = 'github' | 'jira' | 'jenkins' | 'gcp' | 'firebase' | 'slack';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  progress: number;
  riskFlags: number;
  createdAt: string;
  lastActivity: string;
  repository?: string;
  integrations: IntegrationType[];
  assignedAgents: string[];
  owner: string;
  // Additional fields from API
  priority?: 'low' | 'medium' | 'high';
  start_date?: string | null;
  end_date?: string | null;
  budget?: number;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
  requirements_count?: number;
  tasks_count?: number;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  description: string;
  capabilities: string[];
  currentTask?: string;
  lastActivity: string;
  successRate: number;
  totalTasks: number;
  configuration: Record<string, any>;
  integrations: IntegrationType[];
}

export interface AgentCommunication {
  id: string;
  fromAgent: string;
  toAgent: string;
  message: string;
  type: 'delegation' | 'escalation' | 'collaboration' | 'status-update';
  timestamp: string;
  status: 'sent' | 'received' | 'processed' | 'failed';
}

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  configuration: Record<string, any>;
  lastSync: string;
  projectId?: string;
}
export interface Epic {
  id: string;
  title: string;
  description: string;
  projectId: string;
  stories: Story[];
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
  generatedBy?: string; // Agent ID
  confidence: number;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  epicId: string;
  tasks: Task[];
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
  acceptanceCriteria: string[];
  generatedBy?: string; // Agent ID
  confidence: number;
}

export interface Task {
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

export interface RequirementAnalysis {
  id: string;
  originalText: string;
  parsedIntent: string;
  extractedEntities: Record<string, any>;
  suggestedEpics: Epic[];
  confidence: number;
  agentId: string;
  timestamp: string;
  feedback?: 'accepted' | 'rejected' | 'modified';
}

export interface DeploymentPipeline {
  id: string;
  projectId: string;
  name: string;
  stages: DeploymentStage[];
  status: 'idle' | 'running' | 'success' | 'failed';
  lastRun: string;
  agentId?: string;
}

export interface DeploymentStage {
  id: string;
  name: string;
  type: 'build' | 'test' | 'deploy' | 'validate';
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  logs: string[];
  duration?: number;
}
export interface Comment {
  id: string;
  content: string;
  author: string;
  isHuman: boolean;
  createdAt: string;
}

export interface Approval {
  id: string;
  approver: string;
  action: 'approved' | 'rejected' | 'escalated';
  reason?: string;
  createdAt: string;
}

export interface AgentAction {
  id: string;
  agentName: string;
  action: string;
  dataTouched: string;
  riskLevel: RiskLevel;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  description: string;
  impactDescription: string;
  relatedTaskId?: string;
  relatedProjectId?: string;
  communicationId?: string;
}

export interface ActivityItem {
  id: string;
  type: 'agent_decision' | 'escalation' | 'flagged_task' | 'human_override';
  title: string;
  description: string;
  timestamp: string;
  riskLevel: RiskLevel;
  isRead: boolean;
  agentId?: string;
  projectId?: string;
}

export interface AuditLog {
  id: string;
  agentName?: string;
  userName?: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'approve' | 'reject';
  outcome: 'success' | 'failure' | 'pending';
  timestamp: string;
  details: string;
  riskLevel: RiskLevel;
  projectId?: string;
  taskId?: string;
  communicationTrace?: string[];
}

export interface SystemSettings {
  autoApproveSafeActions: boolean;
  requireHumanReviewForProdDB: boolean;
  allowAgentSelfDelegation: boolean;
  maxRiskLevelForAutoApproval: RiskLevel;
  agentCommunicationTimeout: number;
  maxConcurrentAgents: number;
  enableAgentLearning: boolean;
  deploymentApprovalRequired: boolean;
}