import { config, getApiUrl } from '../config';

// Types for API requests and responses
export interface RegisterRequest {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface LoginRequest {
  username: string;  // Updated to match API expectation (was email)
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserResponse;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Base API class with common functionality
class ApiClient {
  private timeout: number;

  constructor() {
    this.timeout = config.api.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuth: boolean = false
  ): Promise<T> {
    const url = getApiUrl(endpoint);
    const token = localStorage.getItem('access_token');

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Only add Authorization header if not skipping auth and token exists
    if (!skipAuth && token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log(`Making ${options.method || 'GET'} request to:`, url);
      console.log('Request headers:', defaultHeaders);
      if (options.body) {
        console.log('Request body:', options.body);
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'include', // Include credentials for CORS
      });

      clearTimeout(timeoutId);

      console.log(`Response status: ${response.status} ${response.statusText}`);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { 
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status 
          };
        }
        
        console.error('API Error Response:', errorData);
        
        // Handle 401 Unauthorized - try to refresh token automatically
        if (response.status === 401 && !skipAuth && !url.includes('/auth/refresh') && !url.includes('/auth/login')) {
          console.log('Received 401, attempting to refresh token...');
          try {
            const refreshedAuth = await this.refreshTokenInternal();
            console.log('Token refreshed successfully, retrying original request...');
            
            // Retry the original request with new token
            const retryHeaders = {
              ...defaultHeaders,
              'Authorization': `Bearer ${refreshedAuth.access_token}`,
              ...options.headers,
            };
            
            const retryResponse = await fetch(url, {
              ...options,
              headers: retryHeaders,
              signal: controller.signal,
              mode: 'cors',
              credentials: 'include',
            });
            
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              console.log('Retry successful:', retryData);
              return retryData;
            }
          } catch (refreshError) {
            console.error('Token refresh failed, redirecting to login:', refreshError);
            // If refresh fails, clear tokens and let the error propagate
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
          }
        }
        
        // For validation errors, preserve the detailed error structure
        if (response.status === 422 && errorData.detail) {
          const validationMessages = errorData.detail
            .map((detail: any) => detail.msg)
            .join(', ');
          throw new Error(validationMessages);
        }
        
        throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        
        // Provide more specific error messages for common network issues
        if (error.message.includes('Failed to fetch')) {
          console.error('Network error - this might be a CORS or connectivity issue');
          console.error('Request URL:', url);
          console.error('Base URL from config:', config.api.baseUrl);
          throw new Error('Network error: Unable to connect to the API server. Please check if the server is running and CORS is configured properly.');
        }
        
        console.error('Request failed:', error.message);
        throw error;
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

  // GET request
  async get<T>(endpoint: string, skipAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, skipAuth);
  }

  // POST request
  async post<T>(endpoint: string, data?: any, skipAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, skipAuth);
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, skipAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, skipAuth);
  }

  // DELETE request
  async delete<T>(endpoint: string, skipAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, skipAuth);
  }

  // Internal token refresh method (doesn't trigger recursive calls)
  private async refreshTokenInternal(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    console.log('ApiClient: Internal token refresh');
    const refreshEndpoint = `/api/v1/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`;
    const loginResponse = await this.post<LoginResponse>(refreshEndpoint, undefined, false);
    
    // Get user profile with new token
    localStorage.setItem('access_token', loginResponse.access_token);
    const userResponse = await this.get<UserResponse>('/api/v1/auth/me', false);
    
    const authResponse: AuthResponse = {
      access_token: loginResponse.access_token,
      refresh_token: loginResponse.refresh_token,
      token_type: loginResponse.token_type,
      expires_in: loginResponse.expires_in,
      user: userResponse
    };
    
    // Update localStorage
    localStorage.setItem('access_token', authResponse.access_token);
    localStorage.setItem('refresh_token', authResponse.refresh_token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    
    return authResponse;
  }
}

// Authentication API service
class AuthService extends ApiClient {
  // Register a new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('AuthService: Step 1 - Registering user');
      // Step 1: Register the user (returns user data only)
      const userResponse = await this.post<UserResponse>(config.auth.register, userData, true);
      console.log('AuthService: Registration successful, user created:', userResponse);
      
      console.log('AuthService: Step 2 - Auto-logging in user');
      // Step 2: Automatically log in the user to get tokens
      const loginData: LoginRequest = {
        username: userData.email, // Use email as username for login
        password: userData.password
      };
      
      const loginResponse = await this.post<LoginResponse>(config.auth.login, loginData, true);
      console.log('AuthService: Auto-login successful, tokens received');
      
      // Step 3: Combine login response with user data
      const authResponse: AuthResponse = {
        access_token: loginResponse.access_token,
        refresh_token: loginResponse.refresh_token,
        token_type: loginResponse.token_type,
        expires_in: loginResponse.expires_in,
        user: userResponse
      };
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', authResponse.access_token);
      localStorage.setItem('refresh_token', authResponse.refresh_token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      console.log('AuthService: Registration and auto-login completed successfully');
      return authResponse;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('AuthService: Step 1 - Logging in user');
      // Step 1: Login to get tokens (no auth header needed for login)
      const loginResponse = await this.post<LoginResponse>(config.auth.login, credentials, true);
      console.log('AuthService: Login successful, tokens received');
      
      // Store token temporarily to make authenticated request
      localStorage.setItem('access_token', loginResponse.access_token);
      
      console.log('AuthService: Step 2 - Fetching user profile');
      // Step 2: Get user profile using the token (this requires auth header)
      const userResponse = await this.get<UserResponse>(config.auth.me, false); // false = include auth header
      console.log('AuthService: User profile fetched');
      
      // Step 3: Combine login response with user data
      const authResponse: AuthResponse = {
        access_token: loginResponse.access_token,
        refresh_token: loginResponse.refresh_token,
        token_type: loginResponse.token_type,
        expires_in: loginResponse.expires_in,
        user: userResponse
      };
      
      // Store all data in localStorage
      localStorage.setItem('access_token', authResponse.access_token);
      localStorage.setItem('refresh_token', authResponse.refresh_token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      console.log('AuthService: Login completed successfully');
      return authResponse;
    } catch (error) {
      console.error('Login failed:', error);
      // Clear any stored tokens on login failure
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await this.post(config.auth.logout);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear tokens from localStorage regardless of API call success
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  // Refresh access token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      console.log('AuthService: Refreshing access token');
      // Send refresh token as query parameter based on API testing
      const refreshEndpoint = `${config.auth.refresh}?refresh_token=${encodeURIComponent(refreshToken)}`;
      const loginResponse = await this.post<LoginResponse>(refreshEndpoint, undefined, false); // Don't skip auth
      
      console.log('AuthService: Token refresh successful');
      
      // Get updated user profile with new token
      localStorage.setItem('access_token', loginResponse.access_token);
      const userResponse = await this.get<UserResponse>(config.auth.me, false);
      
      // Combine refreshed login response with user data
      const authResponse: AuthResponse = {
        access_token: loginResponse.access_token,
        refresh_token: loginResponse.refresh_token,
        token_type: loginResponse.token_type,
        expires_in: loginResponse.expires_in,
        user: userResponse
      };
      
      // Update tokens in localStorage
      localStorage.setItem('access_token', authResponse.access_token);
      localStorage.setItem('refresh_token', authResponse.refresh_token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      return authResponse;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens if refresh fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

// Export the service instance
export const authService = new AuthService();
export const apiClient = new ApiClient();

export default authService;
