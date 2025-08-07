import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, AlertCircle, Bot, Zap, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login, isLoading } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  const quickLogin = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-techsophy-50 via-white to-accent-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <img 
                src="/techsophy-logo.svg" 
                alt="TechSophy" 
                className="h-12 w-auto text-techsophy-600 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-neutral-900 dark:text-white">
                Intelligent Development
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400">
                Automate your entire SDLC with AI agents
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="glass" className="p-4 text-center">
              <div className="p-2 bg-techsophy-100 dark:bg-techsophy-900 rounded-lg w-fit mx-auto mb-3">
                <Bot className="w-6 h-6 text-techsophy-600 dark:text-techsophy-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">AI Agents</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Autonomous task execution
              </p>
            </Card>
            
            <Card variant="glass" className="p-4 text-center">
              <div className="p-2 bg-accent-100 dark:bg-accent-900 rounded-lg w-fit mx-auto mb-3">
                <Zap className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">Automation</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                80%+ task automation
              </p>
            </Card>
            
            <Card variant="glass" className="p-4 text-center">
              <div className="p-2 bg-success-100 dark:bg-success-900 rounded-lg w-fit mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-success-600 dark:text-success-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">Intelligence</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Smart decision making
              </p>
            </Card>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center lg:justify-start space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-techsophy-600 dark:text-techsophy-400">247</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Tasks Automated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">92%</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600 dark:text-success-400">15</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Active Projects</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card variant="elevated" className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <img 
              src="/techsophy-logo.svg" 
              alt="TechSophy" 
              className="h-10 w-auto mx-auto mb-4 text-techsophy-600 dark:text-white"
            />
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Welcome Back
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Sign in to your TechSophy account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus-ring dark:bg-neutral-800 dark:text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus-ring dark:bg-neutral-800 dark:text-white"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-error-600 dark:text-error-400 text-sm bg-error-50 dark:bg-error-900/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              <p className="font-medium mb-3">Demo Accounts - Quick Login:</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('younus.s@techsophy.com')}
                className="text-left justify-start p-3"
              >
                <div>
                  <div className="font-medium">Younus (PM)</div>
                  <Badge variant="techsophy" size="sm">Project Manager</Badge>
                </div>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('ba@test')}
                className="text-left justify-start p-3"
              >
                <div>
                  <div className="font-medium">Test BA</div>
                  <Badge variant="info" size="sm">Business Analyst</Badge>
                </div>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('dev@test')}
                className="text-left justify-start p-3"
              >
                <div>
                  <div className="font-medium">Test Dev</div>
                  <Badge variant="success" size="sm">Developer</Badge>
                </div>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('reviewer@test')}
                className="text-left justify-start p-3"
              >
                <div>
                  <div className="font-medium">Test Reviewer</div>
                  <Badge variant="warning" size="sm">Code Reviewer</Badge>
                </div>
              </Button>
            </div>
            
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3 text-center">
              All demo accounts use password: <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">password</code>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}