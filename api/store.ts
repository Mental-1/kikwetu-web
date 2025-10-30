import { apiClient, API_ENDPOINTS, ApiResponse } from './client';

// Store Types
export interface Store {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  logo?: string;
  banner?: string;
  rating: number;
  totalProducts: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreData {
  name: string;
  description: string;
  logo?: string;
  banner?: string;
}

export interface UpdateStoreData {
  name?: string;
  description?: string;
  logo?: string;
  banner?: string;
}

// Store API functions
export const storeApi = {
  // Get store by ID
  getById: async (id: string): Promise<ApiResponse<Store>> => {
    return apiClient.get<Store>(`${API_ENDPOINTS.STORE.GET}/${id}`);
  },

  // Get current user's store
  getMyStore: async (): Promise<ApiResponse<Store>> => {
    return apiClient.get<Store>(API_ENDPOINTS.STORE.GET);
  },

  // Create store
  create: async (data: CreateStoreData): Promise<ApiResponse<Store>> => {
    return apiClient.post<Store>(API_ENDPOINTS.STORE.CREATE, data);
  },

  // Update store
  update: async (id: string, data: UpdateStoreData): Promise<ApiResponse<Store>> => {
    return apiClient.put<Store>(`${API_ENDPOINTS.STORE.UPDATE}/${id}`, data);
  },

  // Delete store
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`${API_ENDPOINTS.STORE.DELETE}/${id}`);
  },
};
