import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AlertCircle, Bot, Zap, TrendingUp, Sparkles, Shield, Users, ChevronRight, Wifi, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { ApiHealthService } from '../services/healthService';
import { config } from '../config';

export function LoginPage() {
  const [email, setEmail] = useState('vaibhav@mailinator.com'); // Pre-fill with actual DB user
  const [password, setPassword] = useState('Test@1234'); // Pre-fill with actual DB password
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('checking');
  const [showDebug, setShowDebug] = useState(config.features.enableDebugMode);
  const { user, login, register } = useAuth();
  
  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const health = await ApiHealthService.checkHealth();
        setApiStatus(health.status);
      } catch (error) {
        console.error('API health check failed:', error);
        setApiStatus('error');
      }
    };
    
    checkApiStatus();
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        console.log('Attempting registration with:', {
          email,
          username,
          first_name: firstName,
          last_name: lastName,
          password: '***'
        });
        
        await register({
          email,
          username,
          first_name: firstName,
          last_name: lastName,
          password
        });
        
        console.log('Registration successful');
      } else {
        console.log('Attempting login with email/username:', email);
        const success = await login(email, password);
        if (!success) {
          setError('Invalid credentials. Please check your email/username and password.');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      
      // Parse validation errors from API response
      if (err instanceof Error) {
        let errorMessage = err.message;
        
        try {
          // Try to parse detailed validation errors
          const errorObj = JSON.parse(err.message);
          if (errorObj.detail && Array.isArray(errorObj.detail)) {
            const validationErrors = errorObj.detail
              .map((detail: any) => detail.msg)
              .join(', ');
            errorMessage = validationErrors;
          }
        } catch {
          // If not JSON, use the original message
        }
        
        setError(errorMessage);
      } else {
        setError('An error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };  const quickLogin = (testEmail: string) => {
    setEmail(testEmail);
    if (testEmail === 'vaibhav@mailinator.com') {
      setPassword('Test@1234');
    } else {
      setPassword('password');
    }
  };

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Agents",
      description: "Autonomous task execution with intelligent decision making",
      gradient: "from-primary to-secondary"
    },
    {
      icon: Zap,
      title: "Instant Automation",
      description: "80%+ task automation with real-time processing",
      gradient: "from-accent to-warning"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Advanced insights and performance optimization",
      gradient: "from-success to-accent"
    }
  ];

  const demoAccounts = [
    { email: 'vaibhav@mailinator.com', name: 'Vaibhav', role: 'Project Manager', variant: 'default' as const },
    { email: 'younus.s@techsophy.com', name: 'Younus', role: 'Project Manager', variant: 'secondary' as const },
    { email: 'ba@test', name: 'Test BA', role: 'Business Analyst', variant: 'secondary' as const },
    { email: 'dev@test', name: 'Test Dev', role: 'Developer', variant: 'success' as const },
    { email: 'reviewer@test', name: 'Test Reviewer', role: 'Code Reviewer', variant: 'warning' as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/5 via-transparent to-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side - Branding & Features */}
        <div className="space-y-12 text-center lg:text-left">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Keystone AI
                </h1>
                <p className="text-sm text-muted-foreground">Intelligent Development Platform</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Build Smarter
                <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  with AI Agents
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Transform your development workflow with autonomous AI agents that handle tasks, 
                make decisions, and optimize your entire SDLC.
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-md group-hover:shadow-lg transition-shadow`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                247+
              </div>
              <div className="text-sm text-muted-foreground font-medium">Tasks Automated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
                94%
              </div>
              <div className="text-sm text-muted-foreground font-medium">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-success to-accent bg-clip-text text-transparent">
                15+
              </div>
              <div className="text-sm text-muted-foreground font-medium">Active Projects</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="card-modern p-8 space-y-8">
            {/* Form Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground">
                {isRegistering 
                  ? 'Fill in your details to get started with Keystone AI'
                  : 'Sign in to access your intelligent development platform'
                }
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {isRegistering && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-foreground mb-3">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="input-modern"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-foreground mb-3">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="input-modern"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="username" className="block text-sm font-semibold text-foreground mb-3">
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-modern"
                        placeholder="Choose a username"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-3">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-modern"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-3">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-modern"
                    placeholder="Enter your password"
                    autoComplete={isRegistering ? "new-password" : "current-password"}
                    required
                  />
                  {isRegistering && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Password must contain at least one uppercase letter
                    </p>
                  )}
                </div>

                {isRegistering && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground mb-3">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-modern"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center space-x-3 text-destructive text-sm bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold btn-primary"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isRegistering ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  isRegistering ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            {/* Toggle between Login and Register */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                    // Reset form fields when switching
                    setEmail('');
                    setPassword('');
                    setFirstName('');
                    setLastName('');
                    setUsername('');
                    setConfirmPassword('');
                  }}
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  {isRegistering ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>

            {/* Demo Accounts - Only show in login mode */}
            {!isRegistering && (
              <div className="space-y-6 pt-6 border-t border-border">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Demo Accounts</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {demoAccounts.map((account, index) => (
                    <button
                      key={index}
                      onClick={() => quickLogin(account.email)}
                      className="p-4 text-left rounded-xl border border-border hover:border-primary/30 hover:bg-accent/5 transition-all duration-200 group"
                    >
                      <div className="space-y-2">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {account.name}
                        </div>
                        <Badge variant={account.variant} className="text-xs">
                          {account.role}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    All demo accounts use password: 
                    <code className="mx-1 px-2 py-1 bg-muted rounded font-mono text-foreground">
                      password
                    </code>
                  </p>
                </div>
              </div>
            )}

            {/* Debug Panel */}
            {showDebug && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Debug Information</h4>
                  <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Hide
                  </button>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    {apiStatus === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : apiStatus === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Wifi className="w-4 h-4 text-yellow-600 animate-pulse" />
                    )}
                    <span className="text-gray-600">
                      API Status: <span className="font-semibold">{apiStatus}</span>
                    </span>
                  </div>
                  
                  <div className="text-gray-600">
                    API Base URL: <code className="bg-gray-100 px-1 rounded">{config.api.baseUrl}</code>
                  </div>
                  
                  <div className="text-gray-600">
                    Mock Data: <span className="font-semibold">{config.features.enableMockData ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  
                  {!config.features.enableMockData && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <div className="text-gray-700 font-semibold mb-2">Demo Credentials (Real API):</div>
                      <div className="bg-blue-50 p-2 rounded border">
                        <div className="text-xs text-gray-600">Email: <code className="bg-white px-1 rounded">vaibhav@mailinator.com</code></div>
                        <div className="text-xs text-gray-600 mt-1">Password: <code className="bg-white px-1 rounded">Test@1234</code></div>
                        <div className="text-xs text-gray-500 mt-2">Note: This user is registered in the backend database</div>
                        <button
                          type="button"
                          onClick={() => {
                            setEmail('vaibhav@mailinator.com');
                            setPassword('Test@1234');
                          }}
                          className="mt-2 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded border border-blue-300 text-blue-700"
                        >
                          Auto-fill credentials
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-gray-600">
                    Registration Endpoint: <code className="bg-gray-100 px-1 rounded">{config.auth.register}</code>
                  </div>
                  
                  <div className="text-gray-600">
                    Login Endpoint: <code className="bg-gray-100 px-1 rounded">{config.auth.login}</code>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <button
                      onClick={async () => {
                        console.log('Testing CORS preflight...');
                        const corsTest = await ApiHealthService.testCorsPreflightRequest();
                        console.log('CORS test result:', corsTest);
                        alert(`CORS Test: ${corsTest.status} - ${corsTest.message}`);
                      }}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded mr-2"
                    >
                      Test CORS
                    </button>
                    
                    <button
                      onClick={async () => {
                        console.log('Testing registration endpoint...');
                        const testData = {
                          email: "test@example.com",
                          username: "testuser123",
                          first_name: "Test",
                          last_name: "User",
                          password: "TestPass123!"
                        };
                        const regTest = await ApiHealthService.testRegistrationEndpoint(testData);
                        console.log('Registration test result:', regTest);
                        alert(`Registration Test: ${regTest.status} - ${regTest.message}`);
                      }}
                      className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded mr-2"
                    >
                      Test Registration
                    </button>
                    
                    <button
                      onClick={async () => {
                        console.log('Testing refresh token...');
                        try {
                          // First login to get tokens
                          const { authService } = await import('../services/authService');
                          await authService.login({
                            username: 'vaibhav@mailinator.com',
                            password: 'Test@1234'
                          });
                          console.log('Login successful, testing refresh...');
                          
                          // Wait a moment then test refresh
                          setTimeout(async () => {
                            try {
                              const refreshResult = await authService.refreshToken();
                              console.log('Refresh successful:', refreshResult);
                              alert('✅ Refresh Token Test: SUCCESS');
                            } catch (refreshError: any) {
                              console.error('Refresh failed:', refreshError);
                              alert(`❌ Refresh Token Test: FAILED - ${refreshError?.message || 'Unknown error'}`);
                            }
                          }, 1000);
                          
                        } catch (error: any) {
                          console.error('Test failed:', error);
                          alert(`❌ Refresh Token Test: FAILED - ${error?.message || 'Unknown error'}`);
                        }
                      }}
                      className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded"
                    >
                      Test Refresh Token
                    </button>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-300 text-xs text-orange-600">
                    <div className="flex items-start space-x-1">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>CORS Issue?</strong> If registration fails, your API server needs to allow cross-origin requests from <code>http://localhost:5173</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}