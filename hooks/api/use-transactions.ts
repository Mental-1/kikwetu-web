/**
 * Transactions Hooks
 * React Query hooks for transaction operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS, type ApiResponse } from '@/api';
import { queryKeys } from './query-keys';

// Transaction Types
export interface Transaction {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  listingId: string;
  paymentMethod: string;
}

/**
 * Hook for fetching all transactions
 */
export function useTransactions(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.transactions.list(filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      const endpoint = params.toString()
        ? `${API_ENDPOINTS.TRANSACTIONS.GET_ALL}?${params.toString()}`
        : API_ENDPOINTS.TRANSACTIONS.GET_ALL;
      return apiClient.get<Transaction[]>(endpoint);
    },
    select: (response: ApiResponse<Transaction[]>) =>
      response.success ? response.data : null,
  });
}

/**
 * Hook for fetching a single transaction by ID
 */
export function useTransaction(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () =>
      apiClient.get<Transaction>(`${API_ENDPOINTS.TRANSACTIONS.GET_BY_ID}/${id}`),
    select: (response: ApiResponse<Transaction>) =>
      response.success ? response.data : null,
    enabled: enabled && !!id,
  });
}

/**
 * Hook for creating a transaction
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionData) =>
      apiClient.post<Transaction>(API_ENDPOINTS.TRANSACTIONS.CREATE, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Add to cache
        queryClient.setQueryData(
          queryKeys.transactions.detail(response.data.id),
          response
        );
      }
      // Invalidate transactions list
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.lists(),
      });
    },
  });
}
