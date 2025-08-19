import { useState } from 'react';
import { Plus, Search, Filter, Bot, CheckCircle, AlertTriangle, Clock, FileText, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { formatDistanceToNow } from '@/utils/dateUtils';

export function RequirementsPage() {
  const { hasPermission } = useAuth();
  const { projects, requirementAnalyses, createRequirementAnalysis } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newRequirement, setNewRequirement] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  const handleAddRequirement = async () => {
    if (!newRequirement.trim() || !selectedProject) return;
    
    setIsProcessing(true);
    
    try {
      await createRequirementAnalysis({
        originalText: newRequirement,
        parsedIntent: 'AI-parsed requirement intent',
        extractedEntities: {
          features: ['feature1', 'feature2'],
          priority: 'high',
          complexity: 'medium',
        },
        suggestedEpics: [],
        confidence: 0.89,
        agentId: 'agent-1',
        feedback: 'accepted',
      });
      
      setIsAddModalOpen(false);
      setNewRequirement('');
      setSelectedProject('');
    } catch (error) {
      console.error('Error adding requirement:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'default';
    if (confidence >= 0.6) return 'secondary';
    return 'destructive';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getFeedbackColor = (feedback?: string) => {
    switch (feedback) {
      case 'accepted': return 'default';
      case 'modified': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredRequirements = requirementAnalyses.filter(req => {
    const matchesSearch = req.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.parsedIntent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.feedback === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Requirements Analysis</h1>
          <p className="text-muted-foreground text-lg">
            AI-powered requirement analysis and transformation into actionable tasks
          </p>
        </div>
        
        {hasPermission('create_requirements') && (
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Requirement
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requirements
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requirementAnalyses.length}</div>
            <p className="text-xs text-muted-foreground">
              analyzed by AI
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Accepted
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requirementAnalyses.filter(r => r.feedback === 'accepted').length}
            </div>
            <p className="text-xs text-muted-foreground">
              ready for development
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Under Review
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requirementAnalyses.filter(r => r.feedback === 'modified').length}
            </div>
            <p className="text-xs text-muted-foreground">
              pending feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Confidence
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requirementAnalyses.length > 0 
                ? Math.round(requirementAnalyses.reduce((acc, r) => acc + r.confidence, 0) / requirementAnalyses.length * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              average confidence
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Status: {statusFilter === 'all' ? 'All' : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              All Requirements
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('accepted')}>
              Accepted
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('modified')}>
              Modified
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
              Rejected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Requirements List */}
      {filteredRequirements.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Bot className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Requirements Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'No requirements match your current filters.' 
                : 'Start by adding your first requirement for AI analysis.'}
            </p>
            {hasPermission('create_requirements') && !searchTerm && statusFilter === 'all' && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredRequirements.map((requirement) => (
            <Card key={requirement.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant={getFeedbackColor(requirement.feedback)}>
                        {requirement.feedback}
                      </Badge>
                      <Badge variant={getConfidenceColor(requirement.confidence)}>
                        {getConfidenceText(requirement.confidence)} Confidence ({Math.round(requirement.confidence * 100)}%)
                      </Badge>
                      <Badge variant={getPriorityColor(requirement.extractedEntities.priority)}>
                        {requirement.extractedEntities.priority} Priority
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">
                      AI Analysis Result
                    </CardTitle>
                    <CardDescription className="text-base">
                      {requirement.parsedIntent}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Agent: {requirement.agentId}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Original Requirement */}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Original Requirement:</h4>
                  <p className="text-sm">{requirement.originalText}</p>
                </div>

                {/* Extracted Features */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Extracted Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {requirement.extractedEntities.features?.map((feature: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {feature}
                      </Badge>
                    )) || <span className="text-sm text-muted-foreground">No features extracted</span>}
                  </div>
                </div>

                {/* Complexity and Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Complexity:</span>
                    <p className="text-sm capitalize">{requirement.extractedEntities.complexity}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Priority:</span>
                    <p className="text-sm capitalize">{requirement.extractedEntities.priority}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Analyzed:</span>
                    <p className="text-sm">{formatDistanceToNow(requirement.timestamp)} ago</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    {requirement.feedback === 'accepted' && (
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Create Tasks
                      </Button>
                    )}
                    {requirement.feedback === 'modified' && (
                      <Button variant="outline" size="sm">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Provide Feedback
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Requirement Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Requirement</DialogTitle>
            <DialogDescription>
              Describe your requirement and let AI agents analyze it to create actionable development tasks.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project">Select Project</Label>
              <select
                id="project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirement">Requirement Description</Label>
              <Textarea
                id="requirement"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Describe your requirement in detail. For example: 'Create a user authentication system with social login, password reset, and role-based access control...'"
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Be as detailed as possible. AI agents will analyze this to extract features, estimate complexity, and suggest implementation approaches.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setNewRequirement('');
                setSelectedProject('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRequirement}
              disabled={!newRequirement.trim() || !selectedProject || isProcessing}
            >
              {isProcessing ? 'Analyzing...' : 'Analyze Requirement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
