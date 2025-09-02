import React, { useState, useEffect } from 'react';
import { Send, FileText, Loader, Sparkles, CheckCircle, XCircle, Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '../components/ui/Modal';
import { useData } from '../contexts/DataContext';
import { requirementsService } from '../services/projectsService';
import { Requirement, RequirementAnalysis } from '../services/projectsService';

export function RequirementsPageFunctional() {
  const { projects, isLoading: dataLoading } = useData();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'functional' | 'non_functional' | 'technical'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<RequirementAnalysis | null>(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  
  // Form states
  const [newRequirement, setNewRequirement] = useState({
    title: '',
    description: '',
    type: 'functional' as const,
    priority: 'medium' as const,
    acceptance_criteria: [''],
    tags: [] as string[],
  });

  // Load requirements when project is selected
  useEffect(() => {
    if (selectedProject) {
      loadRequirements();
    }
  }, [selectedProject]);

  const loadRequirements = async () => {
    if (!selectedProject) return;
    
    setIsLoading(true);
    try {
      const response = await requirementsService.listRequirements(selectedProject, { limit: 100 });
      setRequirements(response.items);
    } catch (error) {
      console.error('Failed to load requirements:', error);
      alert('Failed to load requirements. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequirement = async () => {
    if (!newRequirement.title.trim() || !selectedProject) return;
    
    setIsLoading(true);
    try {
      const requirementData = {
        ...newRequirement,
        project_id: selectedProject,
        acceptance_criteria: newRequirement.acceptance_criteria.filter(c => c.trim()),
      };
      
      const created = await requirementsService.createRequirement(requirementData);
      setRequirements(prev => [created, ...prev]);
      
      setIsCreateModalOpen(false);
      setNewRequirement({
        title: '',
        description: '',
        type: 'functional',
        priority: 'medium',
        acceptance_criteria: [''],
        tags: [],
      });
      
      alert('✅ Requirement created successfully!');
    } catch (error) {
      console.error('Failed to create requirement:', error);
      alert('❌ Failed to create requirement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeRequirement = async (requirementId: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await requirementsService.analyzeRequirement(requirementId);
      setAnalysisResult(analysis);
      setAnalysisModalOpen(true);
    } catch (error) {
      console.error('Failed to analyze requirement:', error);
      alert('❌ Failed to analyze requirement. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateTasks = async (requirementId: string) => {
    setIsLoading(true);
    try {
      const result = await requirementsService.generateTasks(requirementId);
      alert(`✅ ${result.message} - ${result.tasks_generated} tasks generated!`);
      // Optionally refresh requirements or navigate to tasks page
    } catch (error) {
      console.error('Failed to generate tasks:', error);
      alert('❌ Failed to generate tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addAcceptanceCriteria = () => {
    setNewRequirement(prev => ({
      ...prev,
      acceptance_criteria: [...prev.acceptance_criteria, '']
    }));
  };

  const updateAcceptanceCriteria = (index: number, value: string) => {
    setNewRequirement(prev => ({
      ...prev,
      acceptance_criteria: prev.acceptance_criteria.map((criteria, i) => 
        i === index ? value : criteria
      )
    }));
  };

  const removeAcceptanceCriteria = (index: number) => {
    setNewRequirement(prev => ({
      ...prev,
      acceptance_criteria: prev.acceptance_criteria.filter((_, i) => i !== index)
    }));
  };

  const filteredRequirements = requirements.filter(req => {
    if (searchTerm && !req.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !req.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterType !== 'all' && req.type !== filterType) return false;
    if (filterPriority !== 'all' && req.priority !== filterPriority) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'info';
      case 'draft': return 'warning';
      case 'archived': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'functional': return 'info';
      case 'non_functional': return 'warning';
      case 'technical': return 'accent';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Requirements Management
              </h1>
              <p className="text-muted-foreground">
                Create, analyze, and manage project requirements with AI assistance
              </p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!selectedProject}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Requirement
        </Button>
      </div>

      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Project</CardTitle>
          <CardDescription>
            Choose a project to manage its requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input-modern w-full max-w-md"
            disabled={dataLoading}
          >
            <option value="">Select a project...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {selectedProject && (
        <>
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search requirements..."
                    className="input-modern pl-10"
                  />
                </div>
                
                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="input-modern"
                >
                  <option value="all">All Types</option>
                  <option value="functional">Functional</option>
                  <option value="non_functional">Non-Functional</option>
                  <option value="technical">Technical</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="input-modern"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Requirements List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-2 bg-muted rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRequirements.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <div className="mx-auto w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
                    <FileText className="w-12 h-12 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {searchTerm || filterType !== 'all' || filterPriority !== 'all' 
                        ? 'No requirements found' 
                        : 'No requirements yet'}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {searchTerm || filterType !== 'all' || filterPriority !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Add your first requirement to get started'
                      }
                    </p>
                  </div>
                  {(!searchTerm && filterType === 'all' && filterPriority === 'all') && (
                    <Button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="btn-primary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Requirement
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequirements.map((requirement) => (
                <Card key={requirement.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {requirement.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={getStatusColor(requirement.status || 'draft')}>
                          {requirement.status || 'draft'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getTypeColor(requirement.type)}>
                        {requirement.type}
                      </Badge>
                      <Badge variant={getPriorityColor(requirement.priority)}>
                        {requirement.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {requirement.description}
                    </p>
                    
                    {requirement.acceptance_criteria.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">
                          Acceptance Criteria
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {requirement.acceptance_criteria.slice(0, 2).map((criteria, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{criteria}</span>
                            </li>
                          ))}
                          {requirement.acceptance_criteria.length > 2 && (
                            <li className="text-xs text-muted-foreground">
                              +{requirement.acceptance_criteria.length - 2} more criteria
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    
                    {requirement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {requirement.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-accent/10 text-xs font-medium text-accent"
                          >
                            {tag}
                          </span>
                        ))}
                        {requirement.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted/10 text-xs font-medium text-muted-foreground">
                            +{requirement.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAnalyzeRequirement(requirement.id!)}
                        disabled={isAnalyzing}
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Analyze
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGenerateTasks(requirement.id!)}
                        disabled={isLoading}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Generate Tasks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Requirement Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewRequirement({
            title: '',
            description: '',
            type: 'functional',
            priority: 'medium',
            acceptance_criteria: [''],
            tags: [],
          });
        }}
        title="Create New Requirement"
        maxWidth="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="form-label">
              Title *
            </label>
            <input
              type="text"
              value={newRequirement.title}
              onChange={(e) => setNewRequirement({ ...newRequirement, title: e.target.value })}
              className="form-input"
              placeholder="Enter requirement title"
              autoFocus
            />
          </div>

          <div>
            <label className="form-label">
              Description *
            </label>
            <textarea
              value={newRequirement.description}
              onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
              rows={4}
              className="form-input"
              placeholder="Describe the requirement in detail"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                Type
              </label>
              <select
                value={newRequirement.type}
                onChange={(e) => setNewRequirement({ ...newRequirement, type: e.target.value as any })}
                className="form-input"
              >
                <option value="functional">Functional</option>
                <option value="non_functional">Non-Functional</option>
                <option value="technical">Technical</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                Priority
              </label>
              <select
                value={newRequirement.priority}
                onChange={(e) => setNewRequirement({ ...newRequirement, priority: e.target.value as any })}
                className="form-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">
              Acceptance Criteria
            </label>
            <div className="space-y-3">
              {newRequirement.acceptance_criteria.map((criteria, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={criteria}
                    onChange={(e) => updateAcceptanceCriteria(index, e.target.value)}
                    className="form-input flex-1"
                    placeholder={`Criterion ${index + 1}`}
                  />
                  {newRequirement.acceptance_criteria.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAcceptanceCriteria(index)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={addAcceptanceCriteria}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Criterion
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleCreateRequirement}
              disabled={!newRequirement.title.trim() || !newRequirement.description.trim() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Requirement'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Analysis Result Modal */}
      <Modal
        isOpen={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        title="AI Analysis Result"
        maxWidth="lg"
      >
        {analysisResult && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Complexity Score</h4>
                <div className="text-2xl font-bold text-primary">{analysisResult.complexity_score}/10</div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Estimated Effort</h4>
                <div className="text-2xl font-bold text-accent">{analysisResult.estimated_effort}h</div>
              </div>
            </div>

            {analysisResult.risk_factors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Risk Factors</h4>
                <div className="space-y-2">
                  {analysisResult.risk_factors.map((risk, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysisResult.dependencies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Dependencies</h4>
                <div className="space-y-2">
                  {analysisResult.dependencies.map((dependency, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-info rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{dependency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysisResult.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => setAnalysisModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
