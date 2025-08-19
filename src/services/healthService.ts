import { config } from '../config';

// Simple API health check service
export class ApiHealthService {
  static async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${config.api.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        return {
          status: 'success',
          message: 'API is reachable'
        };
      } else {
        return {
          status: 'error',
          message: `API returned status: ${response.status}`
        };
      }
    } catch (error) {
      console.error('API Health Check failed:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'API is not reachable'
      };
    }
  }

  static async testRegistrationEndpoint(testData: any): Promise<{ status: string; message: string; data?: any }> {
    try {
      console.log('Testing registration endpoint with data:', { ...testData, password: '***' });
      
      const response = await fetch(`${config.api.baseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(testData),
        mode: 'cors',
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = { message: 'Could not parse response as JSON' };
      }

      console.log('Response data:', responseData);

      if (response.ok) {
        return {
          status: 'success',
          message: 'Registration endpoint is working',
          data: responseData
        };
      } else {
        return {
          status: 'error',
          message: `Registration failed: ${responseData.message || response.statusText} (Status: ${response.status})`,
          data: responseData
        };
      }
    } catch (error) {
      console.error('Registration test failed:', error);
      
      if (error instanceof TypeError && error.message.includes('CORS')) {
        return {
          status: 'error',
          message: 'CORS error: Your API server needs to allow cross-origin requests from http://localhost:5173'
        };
      }
      
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Registration endpoint is not reachable'
      };
    }
  }

  static async testCorsPreflightRequest(): Promise<{ status: string; message: string }> {
    try {
      console.log('Testing CORS preflight request...');
      
      const response = await fetch(`${config.api.baseUrl}/api/v1/auth/register`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
        },
        mode: 'cors',
        signal: AbortSignal.timeout(5000),
      });

      console.log('OPTIONS response status:', response.status);
      console.log('OPTIONS response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        return {
          status: 'success',
          message: 'CORS preflight request successful'
        };
      } else {
        return {
          status: 'error',
          message: `CORS preflight failed with status: ${response.status}`
        };
      }
    } catch (error) {
      console.error('CORS preflight test failed:', error);
      return {
        status: 'error',
        message: 'CORS preflight request failed - your API server may not support CORS'
      };
    }
  }
}

export default ApiHealthService;
