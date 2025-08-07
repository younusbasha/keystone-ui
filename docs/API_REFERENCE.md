# API Reference - TechSophy Agent Platform

## Overview
This document outlines the API endpoints for the TechSophy Agent Platform. All endpoints return JSON responses and use standard HTTP status codes.

**Base URL**: `https://api.techsophy.com/v1`
**Authentication**: Bearer token required for all endpoints

## Authentication

### POST /auth/login
Login with email and password

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "PM|BA|Developer|Reviewer"
  },
  "token": "string",
  "expires_in": 3600
}
```

## Projects

### GET /projects
Get all projects for the authenticated user

**Response:**
```json
{
  "projects": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "status": "in-progress|completed|blocked|review",
      "progress": 0-100,
      "riskFlags": "number",
      "assignedAgents": ["string"],
      "createdAt": "ISO 8601",
      "lastActivity": "ISO 8601"
    }
  ]
}
```

### POST /projects
Create a new project

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "assignedAgents": ["string"]
}
```

## Requirements

### POST /requirements/analyze
Submit a requirement for AI analysis

**Request Body:**
```json
{
  "projectId": "string",
  "requirementText": "string"
}
```

**Response:**
```json
{
  "analysisId": "string",
  "parsedIntent": "string",
  "confidence": 0.0-1.0,
  "extractedEntities": {
    "features": ["string"],
    "priority": "low|medium|high|critical",
    "complexity": "low|medium|high",
    "estimatedEffort": "string"
  },
  "suggestedEpics": [
    {
      "title": "string",
      "description": "string",
      "stories": [
        {
          "title": "string",
          "description": "string",
          "acceptanceCriteria": ["string"],
          "tasks": [
            {
              "title": "string",
              "description": "string",
              "component": "frontend|backend|devops|database",
              "estimatedHours": "number"
            }
          ]
        }
      ]
    }
  ]
}
```

## Agent Management

### GET /agents
Get all available agents

**Response:**
```json
{
  "agents": [
    {
      "id": "string",
      "name": "string",
      "type": "requirements-parser|task-planner|story-generator|code-generator|reviewer|deployment",
      "status": "active|idle|busy|error|offline",
      "capabilities": ["string"],
      "successRate": 0.0-100.0,
      "totalTasks": "number",
      "currentTask": "string|null",
      "lastActivity": "ISO 8601"
    }
  ]
}
```

### GET /agents/{agentId}/actions
Get actions performed by a specific agent

**Response:**
```json
{
  "actions": [
    {
      "id": "string",
      "action": "string",
      "riskLevel": "low|medium|high|critical",
      "status": "pending|approved|rejected|escalated",
      "timestamp": "ISO 8601",
      "description": "string",
      "impactDescription": "string"
    }
  ]
}
```

### POST /agents/{agentId}/actions/{actionId}/approve
Approve an agent action

**Response:**
```json
{
  "success": true,
  "message": "Action approved successfully"
}
```

## Dashboard Metrics

### GET /dashboard/metrics
Get real-time dashboard metrics

**Response:**
```json
{
  "overallMetrics": {
    "totalTasks": "number",
    "agentHandled": "number",
    "humanIntervention": "number",
    "automationRate": 0.0-100.0,
    "successRate": 0.0-100.0,
    "efficiency": 0.0-100.0
  },
  "projectMetrics": [
    {
      "projectId": "string",
      "projectName": "string",
      "metrics": {
        "totalTasks": "number",
        "agentHandled": "number",
        "humanIntervention": "number",
        "automationRate": 0.0-100.0,
        "successRate": 0.0-100.0
      }
    }
  ]
}
```

## Activity Logs

### GET /activity
Get system activity logs

**Query Parameters:**
- `limit`: number (default: 50)
- `offset`: number (default: 0)
- `riskLevel`: string (optional filter)
- `type`: string (optional filter)

**Response:**
```json
{
  "activities": [
    {
      "id": "string",
      "type": "agent_decision|escalation|flagged_task|human_override",
      "title": "string",
      "description": "string",
      "timestamp": "ISO 8601",
      "riskLevel": "low|medium|high|critical",
      "agentId": "string|null",
      "projectId": "string|null"
    }
  ],
  "total": "number",
  "hasMore": "boolean"
}
```

## Audit Logs

### GET /audit
Get comprehensive audit trail

**Query Parameters:**
- `startDate`: ISO 8601 date
- `endDate`: ISO 8601 date
- `agentId`: string (optional)
- `outcome`: string (optional)

**Response:**
```json
{
  "logs": [
    {
      "id": "string",
      "agentName": "string|null",
      "userName": "string|null",
      "action": "string",
      "actionType": "create|update|delete|approve|reject",
      "outcome": "success|failure|pending",
      "timestamp": "ISO 8601",
      "details": "string",
      "riskLevel": "low|medium|high|critical"
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters",
  "details": ["Specific validation errors"]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

All API endpoints are rate limited:
- **Standard endpoints**: 100 requests per minute
- **Analysis endpoints**: 10 requests per minute
- **Bulk operations**: 5 requests per minute

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Request limit per window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Postman Collection

Import our Postman collection for easy API testing:
[Download Postman Collection](https://api.techsophy.com/postman/collection.json)