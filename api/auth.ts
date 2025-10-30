import { apiClient, API_ENDPOINTS, ApiResponse } from './client';

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    has2FA: boolean;
  };
}

// Authentication API functions
export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      false
    );
    
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Register
  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
      false
    );
    
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
    apiClient.removeAuthToken();
    return response;
  },

  // Forgot Password
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, false);
  },

  // Reset Password
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword }, false);
  },

  // Verify Email
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token }, false);
  },

  // Enable 2FA
  enable2FA: async (): Promise<ApiResponse<{ qrCode: string; secret: string }>> => {
    return apiClient.post<{ qrCode: string; secret: string }>(API_ENDPOINTS.AUTH.ENABLE_2FA);
  },

  // Verify 2FA
  verify2FA: async (code: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.VERIFY_2FA, { code });
  },

  // 2FA Login
  loginWith2FA: async (email: string, password: string, code: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      { email, password, twoFactorCode: code },
      false
    );
    
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  },
};
