import { API_CONFIG, API_ENDPOINTS } from './config';

// Types for API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// HTTP Client Class
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Get auth token from Zustand store or localStorage (fallback)
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      // Try to get from Zustand store first (if available)
      try {
        // Dynamic import to avoid circular dependencies
        const { useAuthStore } = require('../store');
        const authState = useAuthStore.getState();
        if (authState?.token) {
          return authState.token;
        }
      } catch {
        // Zustand store might not be available yet, fallback to localStorage
      }
      // Fallback to localStorage
      return localStorage.getItem('auth_token') || null;
    }
    return null;
  }

  // Set auth token in both Zustand store and localStorage
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      // Update Zustand store if available
      try {
        const { useAuthStore } = require('../store');
        const setToken = useAuthStore.getState().setToken;
        if (setToken) {
          setToken(token);
        }
      } catch {
        // Zustand store might not be available yet
      }
      // Also store in localStorage as fallback
      localStorage.setItem('auth_token', token);
    }
  }

  // Remove auth token from both Zustand store and localStorage
  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      // Clear from Zustand store if available
      try {
        const { useAuthStore } = require('../store');
        const setToken = useAuthStore.getState().setToken;
        if (setToken) {
          setToken(null);
        }
      } catch {
        // Zustand store might not be available yet
      }
      // Also remove from localStorage
      localStorage.removeItem('auth_token');
    }
  }

  // Build headers
  private buildHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Handle API response
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || 'An error occurred',
        status: response.status,
        code: errorData.code,
      } as ApiError;
    }

    return response.json();
  }

  // GET request
  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.buildHeaders(includeAuth),
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.buildHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.buildHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  // DELETE request
  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.buildHeaders(includeAuth),
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.buildHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export API endpoints for easy access
export { API_ENDPOINTS };
