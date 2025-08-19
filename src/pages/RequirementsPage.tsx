import React, { useState } from 'react';
import { Send, FileText, Loader, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProjects, mockEpics, mockStories, mockTasks, mockRequirementAnalyses } from '../data/mockData';
import { RequirementAnalysis } from '../types';

export function RequirementsPage() {
  const [requirement, setRequirement] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisHistory, setAnalysisHistory] = useState<RequirementAnalysis[]>(mockRequirementAnalyses);

  const handleAnalyze = async () => {
    if (!requirement.trim() || !selectedProject) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis result
    setAnalysisResult({
      epics: mockEpics.slice(0, 2),
      stories: mockStories,
      tasks: mockTasks.slice(0, 3),
      autoAssign: true,
      confidence: 0.89,
      parsedIntent: 'Implement user authentication system with multiple login methods',
      extractedEntities: {
        features: ['email/password login', 'social login', 'password reset'],
        priority: 'high',
        complexity: 'medium',
        estimatedEffort: '2-3 sprints',
      },
    });
    
    setIsAnalyzing(false);
  };

  const handleAcceptAnalysis = () => {
    if (analysisResult) {
      const newAnalysis: RequirementAnalysis = {
        id: `req-${Date.now()}`,
        originalText: requirement,
        parsedIntent: analysisResult.parsedIntent,
        extractedEntities: analysisResult.extractedEntities,
        suggestedEpics: analysisResult.epics,
        confidence: analysisResult.confidence,
        agentId: 'agent-1',
        timestamp: new Date().toISOString(),
        feedback: 'accepted',
      };
      setAnalysisHistory([newAnalysis, ...analysisHistory]);
      setRequirement('');
      setAnalysisResult(null);
    }
  };

  const handleRejectAnalysis = () => {
    if (analysisResult) {
      const newAnalysis: RequirementAnalysis = {
        id: `req-${Date.now()}`,
        originalText: requirement,
        parsedIntent: analysisResult.parsedIntent,
        extractedEntities: analysisResult.extractedEntities,
        suggestedEpics: analysisResult.epics,
        confidence: analysisResult.confidence,
        agentId: 'agent-1',
        timestamp: new Date().toISOString(),
        feedback: 'rejected',
      };
      setAnalysisHistory([newAnalysis, ...analysisHistory]);
      setAnalysisResult(null);
    }
  };
  const handlePushToJira = () => {
    // Mock integration
    alert('Tasks would be pushed to Jira in a real implementation');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Requirements Input
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your business requirements in natural language for AI analysis
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input Section */}
        <Card>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI-Powered Analysis
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Project
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
                Business Requirement
              </label>
              <textarea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="Describe your business requirement in natural language. For example: 'I need a user authentication system that allows users to register with email and password, reset their password, and have role-based access control...'"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!requirement.trim() || !selectedProject || isAnalyzing}
              loading={isAnalyzing}
              icon={isAnalyzing ? Loader : Send}
              size="lg"
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing Requirement...' : 'Analyze & Generate'}
            </Button>
          </div>
        </Card>

        {/* Analysis Result Section */}
        <Card>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analysis Result
            </h2>
          </div>
          <div className="p-6">
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  AI is analyzing your requirement...
                </span>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                {/* AI Confidence & Intent */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      AI Confidence
                    </span>
                    <Badge variant="info">
                      {Math.round(analysisResult.confidence * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Parsed Intent:</strong> {analysisResult.parsedIntent}
                  </p>
                </div>

                {/* Extracted Entities */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Extracted Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                      <Badge variant="warning" className="ml-2">
                        {analysisResult.extractedEntities.priority}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Complexity:</span>
                      <Badge variant="info" className="ml-2">
                        {analysisResult.extractedEntities.complexity}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600 dark:text-gray-400">Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysisResult.extractedEntities.features.map((feature: string, index: number) => (
                          <Badge key={index} variant="default">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generated Structure */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Generated Structure
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.epics.map((epic: any) => (
                      <div key={epic.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            📋 EPIC: {epic.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="info">{epic.priority}</Badge>
                            <Badge variant="agent">
                              {Math.round(epic.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {epic.description}
                        </p>
                        
                        {/* Stories */}
                        <div className="pl-4 space-y-2">
                          {analysisResult.stories
                            .filter((story: any) => story.epicId === epic.id)
                            .map((story: any) => (
                              <div key={story.id} className="border-l-2 border-blue-200 pl-3">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    📝 Story: {story.title}
                                  </h5>
                                  <div className="flex items-center space-x-1">
                                    <Badge variant="warning">{story.priority}</Badge>
                                    <Badge variant="agent">
                                      {Math.round(story.confidence * 100)}%
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                  {story.description}
                                </p>
                                
                                {/* Acceptance Criteria */}
                                <div className="mb-2">
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    Acceptance Criteria:
                                  </div>
                                  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                                    {story.acceptanceCriteria.map((criteria: string, index: number) => (
                                      <li key={index} className="flex items-start space-x-1">
                                        <span>•</span>
                                        <span>{criteria}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {/* Tasks */}
                                <div className="pl-3 space-y-1">
                                  {analysisResult.tasks
                                    .filter((task: any) => task.storyId === story.id)
                                    .map((task: any) => (
                                      <div key={task.id} className="flex items-center justify-between text-xs">
                                        <span className="text-gray-700 dark:text-gray-300">
                                          ⚡ {task.title}
                                        </span>
                                        <div className="flex space-x-1">
                                          <Badge variant="default">
                                            {task.estimatedHours}h
                                          </Badge>
                                          <Badge variant={task.component === 'backend' ? 'agent' : 'human'}>
                                            {task.component}
                                          </Badge>
                                          {task.isAgentAssigned && (
                                            <Badge variant="agent">Agent</Badge>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="auto-assign"
                      checked={analysisResult.autoAssign}
                      onChange={(e) => setAnalysisResult({
                        ...analysisResult,
                        autoAssign: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="auto-assign" className="text-sm text-gray-700 dark:text-gray-300">
                      Auto-assign to agents
                    </label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      icon={XCircle}
                      onClick={handleRejectAnalysis}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      icon={CheckCircle}
                      onClick={handleAcceptAnalysis}
                    >
                      Accept & Create
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Enter a requirement and click "Analyze with AI" to see the breakdown</p>
              </div>
            )}
          </div>
        </Card>

        {/* Analysis History */}
        <Card>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analysis History
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {analysisHistory.map((analysis) => (
                <div key={analysis.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {analysis.parsedIntent}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {analysis.originalText.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="agent">
                        {Math.round(analysis.confidence * 100)}%
                      </Badge>
                      <Badge 
                        variant={analysis.feedback === 'accepted' ? 'success' : 'error'} 
                       
                      >
                        {analysis.feedback}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {analysis.suggestedEpics.length} epics generated
                    </span>
                    <span>
                      {new Date(analysis.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {analysisHistory.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No analysis history yet</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" size="lg" icon={FileText} className="justify-start">
              Import from Document
            </Button>
            <Button variant="outline" size="lg" icon={Sparkles} className="justify-start">
              Bulk Analysis
            </Button>
            <Button variant="outline" size="lg" icon={CheckCircle} className="justify-start">
              Review Accepted Items
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}