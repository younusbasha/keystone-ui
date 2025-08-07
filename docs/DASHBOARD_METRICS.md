# Dashboard Metrics - TechSophy Agent Platform

## Overview
This document defines the calculation logic, data sources, and update frequency for all dashboard metrics displayed in the TechSophy Agent Platform.

## Core Metrics

### 1. Active Projects
**Description**: Number of projects currently in progress
**Formula**: `COUNT(projects WHERE status = 'in-progress')`
**Data Source**: Projects table
**Update Frequency**: Real-time (on project status change)
**Display**: Integer count with percentage of total projects

### 2. Tasks Completed
**Description**: Total number of tasks completed by AI agents
**Formula**: `COUNT(tasks WHERE status = 'completed' AND isAgentAssigned = true)`
**Data Source**: Tasks table
**Update Frequency**: Real-time (on task completion)
**Display**: Integer count with "by AI agents" label

### 3. Pending Reviews
**Description**: Number of agent actions awaiting human review
**Formula**: `COUNT(agent_actions WHERE status = 'pending')`
**Data Source**: Agent actions table
**Update Frequency**: Real-time (on action status change)
**Display**: Integer count with urgency indicator

### 4. AI Automation Rate
**Description**: Percentage of tasks handled by AI agents vs humans
**Formula**: `(agentHandledTasks / totalTasks) * 100`
**Data Source**: Tasks table aggregation
**Update Frequency**: Every 30 seconds
**Display**: Percentage with efficiency label

## Agent Intelligence Metrics

### Overall Automation Rate
**Description**: System-wide automation percentage
**Formula**: 
```
automationRate = (totalAgentTasks / totalTasks) * 100
where:
- totalAgentTasks = COUNT(tasks WHERE isAgentAssigned = true AND status IN ['completed', 'in-progress'])
- totalTasks = COUNT(tasks WHERE status != 'cancelled')
```
**Target**: 80%+ automation rate
**Update Frequency**: Real-time

### Success Rate
**Description**: Percentage of agent tasks completed successfully without human intervention
**Formula**: 
```
successRate = (successfulAgentTasks / totalAgentTasks) * 100
where:
- successfulAgentTasks = COUNT(tasks WHERE isAgentAssigned = true AND status = 'completed' AND humanInterventionRequired = false)
```
**Target**: 90%+ success rate
**Update Frequency**: Real-time

### Efficiency Score
**Description**: Agent performance based on task completion time vs estimates
**Formula**: 
```
efficiency = AVG((estimatedHours / actualHours) * 100) for completed agent tasks
Capped at 100% for tasks completed faster than estimated
```
**Target**: 85%+ efficiency
**Update Frequency**: On task completion

## Project-Level Metrics

### Project Automation Breakdown
**Description**: Per-project automation statistics
**Calculations**:
- **Total Tasks**: `COUNT(tasks WHERE projectId = X)`
- **Agent Handled**: `COUNT(tasks WHERE projectId = X AND isAgentAssigned = true)`
- **Human Required**: `COUNT(tasks WHERE projectId = X AND isAgentAssigned = false)`
- **Automation Rate**: `(agentHandled / totalTasks) * 100`

### Project Progress
**Description**: Overall completion percentage for each project
**Formula**: 
```
progress = (completedTasks / totalTasks) * 100
where:
- completedTasks = COUNT(tasks WHERE projectId = X AND status = 'completed')
- totalTasks = COUNT(tasks WHERE projectId = X AND status != 'cancelled')
```

## Risk Assessment Metrics

### Risk Flags
**Description**: Number of high-risk items requiring attention
**Categories**:
- **Critical**: Agent actions with potential production impact
- **High**: Tasks blocked for >48 hours
- **Medium**: Agent confidence <70%
- **Low**: Standard review items

**Formula**: `COUNT(items WHERE riskLevel IN ['high', 'critical'] AND status = 'active')`

### Human Intervention Rate
**Description**: Percentage of tasks requiring human oversight
**Formula**: `(humanInterventionTasks / totalTasks) * 100`
**Target**: <20% intervention rate

## Real-Time Activity Metrics

### Agent Actions per Hour
**Description**: Rate of agent activity
**Formula**: `COUNT(agent_actions WHERE timestamp >= NOW() - INTERVAL 1 HOUR)`
**Display**: Rolling 24-hour chart

### Response Time
**Description**: Average time for human review of agent actions
**Formula**: `AVG(approvedAt - createdAt) for agent_actions WHERE status = 'approved'`
**Target**: <2 hours average response time

## Data Sources & Architecture

### Primary Tables
1. **projects**: Project metadata and status
2. **tasks**: Individual task records with agent assignments
3. **agent_actions**: Log of all agent activities
4. **users**: User roles and permissions
5. **activity_logs**: System-wide activity tracking

### Aggregation Strategy
- **Real-time metrics**: Updated via database triggers
- **Complex calculations**: Cached and refreshed every 30 seconds
- **Historical trends**: Pre-aggregated daily/weekly/monthly

### Performance Optimization
- Indexed queries on frequently accessed columns
- Materialized views for complex aggregations
- Redis caching for dashboard API responses
- WebSocket updates for real-time metrics

## Update Frequencies

| Metric Category | Update Frequency | Method |
|----------------|------------------|---------|
| Core Dashboard Stats | Real-time | Database triggers + WebSocket |
| Agent Intelligence | 30 seconds | Scheduled aggregation |
| Project Metrics | Real-time | Event-driven updates |
| Historical Trends | 5 minutes | Batch processing |
| Audit Logs | Real-time | Direct insertion |

## Alerting Thresholds

### Performance Alerts
- **Automation Rate < 75%**: Warning alert
- **Success Rate < 85%**: Critical alert
- **Response Time > 4 hours**: Escalation alert

### System Health
- **Agent Offline > 5 minutes**: Service alert
- **Failed Tasks > 10%**: Quality alert
- **Pending Reviews > 50**: Capacity alert

## Data Retention

- **Real-time metrics**: 30 days
- **Daily aggregations**: 1 year
- **Monthly summaries**: 5 years
- **Audit logs**: 7 years (compliance requirement)

## API Endpoints

### GET /api/dashboard/metrics
Returns current dashboard metrics with calculation timestamps

### GET /api/dashboard/trends
Returns historical trend data for charts and graphs

### WebSocket /ws/dashboard
Real-time metric updates for live dashboard

---

**Note**: All metrics are calculated in UTC timezone and converted to user's local timezone for display.