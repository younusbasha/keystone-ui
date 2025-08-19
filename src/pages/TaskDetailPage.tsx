import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Code, TestTube, Settings, MessageSquare, CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockTasks } from '../data/mockData';

export function TaskDetailPage() {
  const { taskId } = useParams();
  const [activeTab, setActiveTab] = useState('code');
  
  const task = mockTasks.find(t => t.id === taskId);
  
  if (!task) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Task not found</p>
      </div>
    );
  }

  const tabs = [
    { id: 'code', label: 'Generated Code', icon: Code },
    { id: 'tests', label: 'Test Cases', icon: TestTube },
    { id: 'infra', label: 'Infrastructure', icon: Settings },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => window.history.back()}>
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {task.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {task.description}
          </p>
        </div>
      </div>

      {/* Task Metadata */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <div className="mt-1">
                <Badge variant={task.status === 'completed' ? 'success' : 'info'}>
                  {task.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <div className="mt-1">
                <Badge variant={task.priority === 'high' ? 'warning' : 'default'}>
                  {task.priority}
                </Badge>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Component
              </label>
              <div className="mt-1">
                <Badge variant="info">{task.component}</Badge>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Assigned To
              </label>
              <div className="mt-1">
                <Badge variant={task.isAgentAssigned ? 'agent' : 'human'}>
                  {task.assignedTo}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <Card>
        <div className="p-6">
          {activeTab === 'code' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Generated Code
              </h3>
              {task.generatedCode ? (
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-gray-800 dark:text-gray-200">
                    {task.generatedCode}
                  </code>
                </pre>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No code generated yet
                </p>
              )}
            </div>
          )}

          {activeTab === 'tests' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Test Cases
              </h3>
              {task.testCases && task.testCases.length > 0 ? (
                <ul className="space-y-2">
                  {task.testCases.map((testCase, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {testCase}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No test cases defined yet
                </p>
              )}
            </div>
          )}

          {activeTab === 'infra' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Infrastructure Setup
              </h3>
              {task.infraSetup && task.infraSetup.length > 0 ? (
                <ul className="space-y-2">
                  {task.infraSetup.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Settings className="w-5 h-5 text-blue-500 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {step}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No infrastructure setup required
                </p>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Comments & Notes
              </h3>
              <div className="space-y-4">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={comment.isHuman ? 'human' : 'agent'}>
                          {comment.isHuman ? 'Human' : 'Agent'}
                        </Badge>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {comment.author}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                ))}
                
                {task.comments.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No comments yet
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Approval History
              </h3>
              <div className="space-y-4">
                {task.approvals.map((approval) => (
                  <div key={approval.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            approval.action === 'approved' ? 'success' :
                            approval.action === 'rejected' ? 'error' : 'warning'
                          }
                        >
                          {approval.action}
                        </Badge>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {approval.approver}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(approval.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {approval.reason && (
                      <p className="text-gray-700 dark:text-gray-300">
                        Reason: {approval.reason}
                      </p>
                    )}
                  </div>
                ))}
                
                {task.approvals.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No approvals recorded yet
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}