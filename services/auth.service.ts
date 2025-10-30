/**
 * Authentication Service
 * Business logic layer for authentication operations
 */

import { authApi, type LoginCredentials, type RegisterData, type AuthResponse } from '@/api';
import { apiClient } from '@/api';
import type { ApiResponse } from '@/api';

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await authApi.login(credentials);
      
      if (response.success && response.data) {
        // Token is automatically set in apiClient
        return response;
      }
      
      return {
        success: false,
        data: response.data,
        message: response.message || 'Login failed',
      };
    } catch (error) {
      return {
        success: false,
        data: {} as AuthResponse,
        message: (error as Error).message || 'Login failed',
        error: (error as Error).message,
      };
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return {
          success: false,
          data: {} as AuthResponse,
          message: 'Invalid email format',
        };
      }

      // Validate password strength
      if (data.password.length < 8) {
        return {
          success: false,
          data: {} as AuthResponse,
          message: 'Password must be at least 8 characters',
        };
      }

      const response = await authApi.register(data);
      
      if (response.success && response.data) {
        return response;
      }
      
      return {
        success: false,
        data: response.data,
        message: response.message || 'Registration failed',
      };
    } catch (error) {
      return {
        success: false,
        data: {} as AuthResponse,
        message: (error as Error).message || 'Registration failed',
        error: (error as Error).message,
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await authApi.logout();
      // Token is automatically removed in apiClient
      return response;
    } catch (error) {
      return {
        success: false,
        data: undefined,
        message: (error as Error).message || 'Logout failed',
        error: (error as Error).message,
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    try {
      // Try to get token from Zustand store or localStorage
      const { useAuthStore } = require('../store');
      const state = useAuthStore.getState();
      if (state?.token) return true;
    } catch {
      // Zustand not available
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth_token');
    }

    return false;
  }

  /**
   * Get current auth token
   */
  static getToken(): string | null {
    try {
      const { useAuthStore } = require('../store');
      const state = useAuthStore.getState();
      if (state?.token) return state.token;
    } catch {
      // Zustand not available
    }

    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }

    return null;
  }
}
