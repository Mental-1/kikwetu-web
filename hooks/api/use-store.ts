/**
 * Store Hooks
 * React Query hooks for store operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS, type ApiResponse } from '@/api';
import { queryKeys } from './query-keys';

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

/**
 * Hook for fetching store by ID
 */
export function useStore(id?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.store.detail(id),
    queryFn: () => apiClient.get<Store>(`${API_ENDPOINTS.STORE.GET}/${id}`),
    select: (response: ApiResponse<Store>) =>
      response.success ? response.data : null,
    enabled: enabled && !!id,
  });
}

/**
 * Hook for creating a store
 */
export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStoreData) =>
      apiClient.post<Store>(API_ENDPOINTS.STORE.CREATE, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Add to cache
        queryClient.setQueryData(
          queryKeys.store.detail(response.data.id),
          response
        );
      }
    },
  });
}

/**
 * Hook for updating a store
 */
export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateStoreData>;
    }) => apiClient.put<Store>(`${API_ENDPOINTS.STORE.UPDATE}/${id}`, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Update cache
        queryClient.setQueryData(
          queryKeys.store.detail(variables.id),
          response
        );
      }
      // Invalidate to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.store.detail(variables.id),
      });
    },
  });
}
