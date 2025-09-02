import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService, RegisterRequest } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    // Check for stored auth from real API
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
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
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
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    setIsLoading(true);
    
    try {
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
    } catch (error) {
      console.error('AuthContext: Registration failed:', error);
      setIsLoading(false);
      throw error; // Re-throw so LoginPage can catch and display the error
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
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