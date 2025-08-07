import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FeedbackLoop } from '../../types';

interface FeedbackCaptureProps {
  agentId: string;
  taskId: string;
  agentOutput: any;
  onFeedback: (feedback: Omit<FeedbackLoop, 'id' | 'timestamp' | 'userId'>) => void;
}

export function FeedbackCapture({ agentId, taskId, agentOutput, onFeedback }: FeedbackCaptureProps) {
  const [feedbackType, setFeedbackType] = useState<'approve' | 'reject' | 'modify' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [newImprovement, setNewImprovement] = useState('');

  const handleSubmitFeedback = () => {
    if (!feedbackType) return;

    onFeedback({
      agentId,
      taskId,
      humanFeedback: feedbackType,
      feedbackText,
      improvements,
    });

    // Reset form
    setFeedbackType(null);
    setFeedbackText('');
    setImprovements([]);
    setNewImprovement('');
  };

  const addImprovement = () => {
    if (newImprovement.trim()) {
      setImprovements([...improvements, newImprovement.trim()]);
      setNewImprovement('');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Review Agent Output
      </h3>

      {/* Agent Output Preview */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="agent">Agent: {agentId}</Badge>
          <Badge variant="info">Task: {taskId}</Badge>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {JSON.stringify(agentOutput, null, 2)}
        </div>
      </div>

      {/* Feedback Buttons */}
      <div className="flex space-x-3 mb-4">
        <Button
          variant={feedbackType === 'approve' ? 'primary' : 'outline'}
          icon={ThumbsUp}
          onClick={() => setFeedbackType('approve')}
        >
          Approve
        </Button>
        <Button
          variant={feedbackType === 'reject' ? 'danger' : 'outline'}
          icon={ThumbsDown}
          onClick={() => setFeedbackType('reject')}
        >
          Reject
        </Button>
        <Button
          variant={feedbackType === 'modify' ? 'secondary' : 'outline'}
          icon={MessageSquare}
          onClick={() => setFeedbackType('modify')}
        >
          Request Changes
        </Button>
      </div>

      {/* Feedback Details */}
      {feedbackType && (
        <div className="space-y-4 animate-slide-down">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Feedback Details
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Provide specific feedback to help the agent improve..."
            />
          </div>

          {(feedbackType === 'reject' || feedbackType === 'modify') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Suggested Improvements
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newImprovement}
                  onChange={(e) => setNewImprovement(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Add improvement suggestion..."
                  onKeyPress={(e) => e.key === 'Enter' && addImprovement()}
                />
                <Button variant="outline" onClick={addImprovement}>
                  Add
                </Button>
              </div>
              
              {improvements.length > 0 && (
                <div className="space-y-1">
                  {improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <span className="text-sm text-blue-900 dark:text-blue-200">
                        {improvement}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImprovements(improvements.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button
            variant="primary"
            icon={Send}
            onClick={handleSubmitFeedback}
            disabled={!feedbackText.trim()}
            className="w-full"
          >
            Submit Feedback
          </Button>
        </div>
      )}
    </Card>
  );
}