import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './shared/components/layout.tsx';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './features/dashboard/dashboard-page.tsx';
import { ProjectsPage } from './features/projects/projects-page.tsx';
import { RequirementsPage } from './features/requirements/requirements-page.tsx';
import { TaskBreakdownPage } from './pages/TaskBreakdownPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentReviewPage } from './pages/AgentReviewPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { DeploymentPage } from './pages/DeploymentPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen gradient-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Loading TechSophy Platform
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Initializing AI agents and workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute>
          <ProjectsPage />
        </ProtectedRoute>
      } />
      <Route path="/requirements" element={
        <ProtectedRoute>
          <RequirementsPage />
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <TaskBreakdownPage />
        </ProtectedRoute>
      } />
      <Route path="/tasks/:taskId" element={
        <ProtectedRoute>
          <TaskDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/agents" element={
        <ProtectedRoute>
          <AgentsPage />
        </ProtectedRoute>
      } />
      <Route path="/agent-review" element={
        <ProtectedRoute>
          <AgentReviewPage />
        </ProtectedRoute>
      } />
      <Route path="/integrations" element={
        <ProtectedRoute>
          <IntegrationsPage />
        </ProtectedRoute>
      } />
      <Route path="/deployment" element={
        <ProtectedRoute>
          <DeploymentPage />
        </ProtectedRoute>
      } />
      <Route path="/permissions" element={
        <ProtectedRoute>
          <PermissionsPage />
        </ProtectedRoute>
      } />
      <Route path="/audit-logs" element={
        <ProtectedRoute>
          <AuditLogsPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 transition-colors duration-300">
              <AppRoutes />
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;