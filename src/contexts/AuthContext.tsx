import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService, RegisterRequest } from '../services/authService';
import { config } from '../config';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  { id: '1', email: 'younus.s@techsophy.com', name: 'Younus', role: 'PM' },
  { id: '1b', email: 'test', name: 'Younus', role: 'PM' },
  { id: '2', email: 'ba@test', name: 'Test BA', role: 'BA' },
  { id: '3', email: 'dev@test', name: 'Test Dev', role: 'Developer' },
  { id: '4', email: 'reviewer@test', name: 'Test Reviewer', role: 'Reviewer' },
];

const rolePermissions: Record<UserRole, string[]> = {
  PM: ['create_requirements', 'edit_requirements', 'view_all', 'manage_permissions', 'approve_high_risk'],
  BA: ['create_requirements', 'edit_requirements', 'view_all'],
  Developer: ['view_all', 'edit_code'],
  Reviewer: ['view_all', 'approve_actions', 'escalate_actions'],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      // Map API user to our User type
      const mappedUser: User = {
        id: currentUser.id,
        email: currentUser.email,
        name: `${currentUser.first_name} ${currentUser.last_name}`,
        role: 'PM', // Default role, could be determined from API response
        avatar: undefined,
      };
      setUser(mappedUser);
    } else {
      // Fallback to local storage for mock mode
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Use mock data if enabled in config, otherwise use real API
      if (config.features.enableMockData) {
        // Mock authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        const foundUser = mockUsers.find(u => u.email === emailOrUsername);
        if (foundUser && password === 'password') {
          setUser(foundUser);
          localStorage.setItem('auth_user', JSON.stringify(foundUser));
          setIsLoading(false);
          return true;
        }
        setIsLoading(false);
        return false;
      } else {
        // Real API authentication - use email/username as username field
        const response = await authService.login({ username: emailOrUsername, password });
        const mappedUser: User = {
          id: response.user.id,
          email: response.user.email,
          name: `${response.user.first_name} ${response.user.last_name}`,
          role: 'PM', // Default role, could be determined from API response
          avatar: undefined,
        };
        setUser(mappedUser);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Use mock data if enabled in config, otherwise use real API
      if (config.features.enableMockData) {
        // Mock registration - simulate delay and success
        console.log('AuthContext: Using mock registration for:', { ...userData, password: '***' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser: User = {
          id: Date.now().toString(),
          email: userData.email,
          name: `${userData.first_name} ${userData.last_name}`,
          role: 'PM',
          avatar: undefined,
        };
        
        setUser(mockUser);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      } else {
        // Real API registration
        console.log('AuthContext: Starting registration with data:', { ...userData, password: '***' });
        const response = await authService.register(userData);
        console.log('AuthContext: Registration successful', response);
        
        const mappedUser: User = {
          id: response.user.id,
          email: response.user.email,
          name: `${response.user.first_name} ${response.user.last_name}`,
          role: 'PM', // Default role
          avatar: undefined,
        };
        setUser(mappedUser);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('AuthContext: Registration failed:', error);
      setIsLoading(false);
      throw error; // Re-throw so LoginPage can catch and display the error
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      hasPermission,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}