import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SimplifiedRequirementsPage } from './pages/SimplifiedRequirementsPage';
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          <SimplifiedRequirementsPage />
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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <AppRoutes />
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;