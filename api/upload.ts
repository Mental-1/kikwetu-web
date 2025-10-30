import { apiClient, ApiResponse } from './client';
import { API_CONFIG } from './config';

// Upload Types
export interface UploadResponse {
  url: string;
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface UploadOptions {
  folder?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

// Helper to get auth token
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    try {
      const { useAuthStore } = require('../store');
      const state = useAuthStore.getState();
      if (state?.token) return state.token;
    } catch {
      // Zustand not available
    }
    return localStorage.getItem('auth_token');
  }
  return null;
}

// Upload API functions
export const uploadApi = {
  // Upload a single file
  uploadFile: async (
    file: File,
    options?: UploadOptions
  ): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    if (options?.folder) {
      formData.append('folder', options.folder);
    }

    // Build headers without Content-Type to let browser set it with boundary
    const headers: HeadersInit = {};
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || 'Upload failed',
        status: response.status,
        code: errorData.code,
      };
    }

    return response.json();
  },

  // Upload multiple files
  uploadFiles: async (
    files: File[],
    options?: UploadOptions
  ): Promise<ApiResponse<UploadResponse[]>> => {
    const uploadPromises = files.map((file) =>
      uploadApi.uploadFile(file, options)
    );

    const results = await Promise.all(uploadPromises);
    
    // Check if all uploads succeeded
    const failed = results.find((r) => !r.success);
    if (failed) {
      return {
        success: false,
        data: [],
        message: failed.message || 'Some uploads failed',
      };
    }

    return {
      success: true,
      data: results.map((r) => r.data),
    };
  },

  // Delete uploaded file
  deleteFile: async (key: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/upload/${key}`);
  },
};
