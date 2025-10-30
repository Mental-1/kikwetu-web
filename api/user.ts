import { apiClient, API_ENDPOINTS, ApiResponse } from './client';

// User Types
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: {
    city: string;
    country: string;
  };
  isVerified: boolean;
  has2FA: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  location?: {
    city: string;
    country: string;
  };
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    currency: string;
  };
}

// User API functions
export const userApi = {
  // Get user profile
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    return apiClient.get<UserProfile>(API_ENDPOINTS.USER.PROFILE);
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<UserProfile>> => {
    return apiClient.put<UserProfile>(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
  },

  // Get user settings
  getSettings: async (): Promise<ApiResponse<UserSettings>> => {
    return apiClient.get<UserSettings>(API_ENDPOINTS.USER.SETTINGS);
  },

  // Update user settings
  updateSettings: async (data: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> => {
    return apiClient.put<UserSettings>(API_ENDPOINTS.USER.SETTINGS, data);
  },

  // Get user preferences
  getPreferences: async (): Promise<ApiResponse<UserSettings['preferences']>> => {
    return apiClient.get<UserSettings['preferences']>(API_ENDPOINTS.USER.PREFERENCES);
  },

  // Update user preferences
  updatePreferences: async (data: Partial<UserSettings['preferences']>): Promise<ApiResponse<UserSettings['preferences']>> => {
    return apiClient.put<UserSettings['preferences']>(API_ENDPOINTS.USER.PREFERENCES, data);
  },
};
