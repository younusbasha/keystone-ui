import React, { useState } from 'react';
import { Send, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SimplifiedWorkflow } from '../components/ui/SimplifiedWorkflow';
import { ProgressiveDisclosure } from '../components/ui/ProgressiveDisclosure';
import { FeedbackCapture } from '../components/feedback/FeedbackCapture';
import { mockProjects } from '../data/mockData';

export function SimplifiedRequirementsPage() {
  const [requirement, setRequirement] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [currentPhase, setCurrentPhase] = useState<'input' | 'analysis' | 'review' | 'complete'>('input');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const workflowSteps = [
    {
      id: 'input',
      title: 'Input Requirement',
      description: 'Describe what you need in plain English',
      status: currentPhase === 'input' ? 'active' : 'completed',
      action: () => handleAnalyze(),
      actionLabel: 'Analyze Requirement',
    },
    {
      id: 'analysis',
      title: 'AI Analysis',
      description: 'Agent processes and breaks down your requirement',
      status: currentPhase === 'analysis' ? 'active' : currentPhase === 'input' ? 'pending' : 'completed',
    },
    {
      id: 'review',
      title: 'Review & Approve',
      description: 'Review generated stories and tasks',
      status: currentPhase === 'review' ? 'active' : ['input', 'analysis'].includes(currentPhase) ? 'pending' : 'completed',
    },
    {
      id: 'complete',
      title: 'Create Tasks',
      description: 'Tasks are created and assigned to agents',
      status: currentPhase === 'complete' ? 'active' : 'pending',
    },
  ];

  const handleAnalyze = async () => {
    if (!requirement.trim() || !selectedProject) return;

    setCurrentPhase('analysis');
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis result
    setAnalysisResult({
      intent: 'User Authentication System',
      confidence: 0.92,
      stories: [
        {
          id: '1',
          title: 'User Registration',
          description: 'Allow users to create accounts with email and password',
          tasks: ['Create registration form', 'Implement validation', 'Set up email verification'],
        },
        {
          id: '2',
          title: 'User Login',
          description: 'Allow users to sign in to their accounts',
          tasks: ['Create login form', 'Implement authentication', 'Add session management'],
        },
      ],
    });
    
    setCurrentPhase('review');
  };

  const handleApprove = () => {
    setCurrentPhase('complete');
    // In real app, this would create the tasks
    setTimeout(() => {
      alert('Tasks created successfully! Check the Task Breakdown page.');
    }, 1000);
  };

  const handleFeedback = (feedback: any) => {
    console.log('Feedback received:', feedback);
    // In real app, this would be sent to the backend for agent learning
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Requirements Input
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Describe what you need and let AI agents break it down into actionable tasks
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Simplified Workflow */}
        <div className="xl:col-span-1">
          <SimplifiedWorkflow
            title="Your Progress"
            steps={workflowSteps}
          />
        </div>

        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {currentPhase === 'input' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What do you need?
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select a project</option>
                    {mockProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe your requirement
                  </label>
                  <textarea
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Example: I need a user authentication system that allows users to register with email and password, reset their password, and have role-based access control..."
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!requirement.trim() || !selectedProject}
                  icon={Sparkles}
                  size="lg"
                  className="w-full"
                >
                  Analyze with AI
                </Button>
              </div>
            </Card>
          )}

          {currentPhase === 'analysis' && (
            <Card className="p-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    AI Agent is analyzing your requirement...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This usually takes a few seconds
                  </p>
                </div>
              </div>
            </Card>
          )}

          {currentPhase === 'review' && analysisResult && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Analysis Result
                  </h2>
                  <Badge variant="agent">
                    {Math.round(analysisResult.confidence * 100)}% confidence
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                      Parsed Intent
                    </h3>
                    <p className="text-blue-800 dark:text-blue-300">
                      {analysisResult.intent}
                    </p>
                  </div>

                  <ProgressiveDisclosure title="Generated User Stories" defaultOpen>
                    <div className="space-y-3">
                      {analysisResult.stories.map((story: any) => (
                        <div key={story.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            📝 {story.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {story.description}
                          </p>
                          
                          <ProgressiveDisclosure title="Tasks" level="secondary">
                            <ul className="space-y-1">
                              {story.tasks.map((task: string, index: number) => (
                                <li key={index} className="flex items-center space-x-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-gray-700 dark:text-gray-300">{task}</span>
                                </li>
                              ))}
                            </ul>
                          </ProgressiveDisclosure>
                        </div>
                      ))}
                    </div>
                  </ProgressiveDisclosure>

                  <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPhase('input')}
                    >
                      Back to Edit
                    </Button>
                    <Button
                      variant="default"
                      icon={ArrowRight}
                      onClick={handleApprove}
                      className="flex-1"
                    >
                      Approve & Create Tasks
                    </Button>
                  </div>
                </div>
              </Card>

              <FeedbackCapture
                agentId="requirements-parser"
                taskId="req-analysis-1"
                agentOutput={analysisResult}
                onFeedback={handleFeedback}
              />
            </div>
          )}

          {currentPhase === 'complete' && (
            <Card className="p-6">
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Tasks Created Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your requirement has been broken down into actionable tasks and assigned to AI agents.
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button variant="outline" onClick={() => setCurrentPhase('input')}>
                    Add Another Requirement
                  </Button>
                  <Button variant="default">
                    View Task Breakdown
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}