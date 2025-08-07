import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, ExternalLink, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { useData } from '../contexts/DataContext';
import { Epic, Story, Task } from '../types';

export function TaskBreakdownPage() {
  const { epics, stories, tasks } = useData();
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set());
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');

  const toggleEpic = (epicId: string) => {
    const newExpanded = new Set(expandedEpics);
    if (newExpanded.has(epicId)) {
      newExpanded.delete(epicId);
    } else {
      newExpanded.add(epicId);
    }
    setExpandedEpics(newExpanded);
  };

  const toggleStory = (storyId: string) => {
    const newExpanded = new Set(expandedStories);
    if (newExpanded.has(storyId)) {
      newExpanded.delete(storyId);
    } else {
      newExpanded.add(storyId);
    }
    setExpandedStories(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'review': return 'warning';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const getComponentColor = (component: string) => {
    switch (component) {
      case 'frontend': return 'info';
      case 'backend': return 'success';
      case 'devops': return 'warning';
      case 'database': return 'error';
      default: return 'default';
    }
  };

  const taskColumns = [
    {
      key: 'title',
      header: 'Task',
      render: (task: Task) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-white">{task.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{task.description}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (task: Task) => (
        <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (task: Task) => (
        <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
      ),
    },
    {
      key: 'component',
      header: 'Component',
      render: (task: Task) => (
        <Badge variant={getComponentColor(task.component)}>{task.component}</Badge>
      ),
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (task: Task) => (
        <div className="flex items-center space-x-2">
          <Badge variant={task.isAgentAssigned ? 'agent' : 'human'}>
            {task.isAgentAssigned ? 'Agent' : 'Human'}
          </Badge>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {task.assignedTo}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (task: Task) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" icon={Edit}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" icon={ExternalLink}>
            View
          </Button>
          {task.isAgentAssigned && (
            <Button variant="outline" size="sm" icon={AlertCircle}>
              Review
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Task Breakdown
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your project's epic, story, and task breakdown
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1 text-sm rounded-l-lg ${
                viewMode === 'tree'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Tree View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-sm rounded-r-lg ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Table View
            </button>
          </div>
          
          <Button variant="outline" icon={ExternalLink}>
            Push to Jira
          </Button>
          <Button variant="primary" icon={Edit}>
            Edit Structure
          </Button>
        </div>
      </div>

      {viewMode === 'tree' ? (
        <Card>
          <div className="p-6">
            <div className="space-y-4">
              {epics.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>No epics found. Create requirements to generate task breakdowns.</p>
                </div>
              ) : (
                epics.map((epic) => (
                <div key={epic.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => toggleEpic(epic.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {expandedEpics.has(epic.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          📋 EPIC: {epic.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {epic.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(epic.status)}>{epic.status}</Badge>
                      <Badge variant={getPriorityColor(epic.priority)}>{epic.priority}</Badge>
                    </div>
                  </div>
                  
                  {expandedEpics.has(epic.id) && (
                      <div className="pl-8 space-y-3">
                        {stories
                          .filter(story => story.epicId === epic.id)
                          .map((story) => (
                            <div key={story.id} className="border-l-2 border-blue-200 dark:border-blue-700 pl-4">
                              <div
                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                                onClick={() => toggleStory(story.id)}
                              >
                                <div className="flex items-center space-x-3">
                                  {expandedStories.has(story.id) ? (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                  )}
                                  <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      📝 Story: {story.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {story.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={getStatusColor(story.status)}>{story.status}</Badge>
                                  <Badge variant={getPriorityColor(story.priority)}>{story.priority}</Badge>
                                </div>
                              </div>
                              
                              {expandedStories.has(story.id) && (
                                <div className="pl-7 mt-3 space-y-2">
                                  {tasks
                                    .filter(task => task.storyId === story.id)
                                    .map((task) => (
                                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                        <div className="flex-1">
                                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                            ⚡ {task.title}
                                          </h5>
                                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            {task.description}
                                          </p>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                          <Badge variant={getStatusColor(task.status)} size="sm">
                                            {task.status}
                                          </Badge>
                                          <Badge variant={getComponentColor(task.component)} size="sm">
                                            {task.component}
                                          </Badge>
                                          <Badge variant={task.isAgentAssigned ? 'agent' : 'human'} size="sm">
                                            {task.isAgentAssigned ? 'Agent' : 'Human'}
                                          </Badge>
                                          <div className="flex space-x-1">
                                            <Button variant="ghost" size="sm" icon={Edit} />
                                            <Button variant="ghost" size="sm" icon={ExternalLink} />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                  )}
                </div>
                ))
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <Table
            data={tasks}
            columns={taskColumns}
            emptyMessage="No tasks found. Create requirements to generate tasks."
          />
        </Card>
      )}
    </div>
  );
}