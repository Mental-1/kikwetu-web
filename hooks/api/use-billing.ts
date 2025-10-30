/**
 * Billing Hooks
 * React Query hooks for billing and subscription operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { apiClient, API_ENDPOINTS, type ApiResponse } from '@/api';
import { queryKeys } from './query-keys';

// Billing Types
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money' | 'bank_transfer';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

/**
 * Hook for fetching available plans
 */
export function usePlans(enabled = true) {
  return useQuery({
    queryKey: queryKeys.billing.plans(),
    queryFn: () => apiClient.get<Plan[]>(API_ENDPOINTS.BILLING.PLANS),
    select: (response: ApiResponse<Plan[]>) =>
      response.success ? response.data : null,
    enabled,
  });
}

/**
 * Hook for fetching current subscription
 */
export function useSubscription(enabled = true) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.billing.subscription(),
    queryFn: () =>
      apiClient.get<Subscription>(API_ENDPOINTS.BILLING.SUBSCRIPTION),
    select: (response: ApiResponse<Subscription>) =>
      response.success ? response.data : null,
    enabled: enabled && isAuthenticated,
  });
}

/**
 * Hook for updating subscription
 */
export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { planId: string }) =>
      apiClient.post<Subscription>(API_ENDPOINTS.BILLING.SUBSCRIPTION, data),
    onSuccess: () => {
      // Invalidate subscription data
      queryClient.invalidateQueries({
        queryKey: queryKeys.billing.subscription(),
      });
    },
  });
}

/**
 * Hook for cancelling subscription
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient.delete<void>(API_ENDPOINTS.BILLING.SUBSCRIPTION),
    onSuccess: () => {
      // Invalidate subscription data
      queryClient.invalidateQueries({
        queryKey: queryKeys.billing.subscription(),
      });
    },
  });
}

/**
 * Hook for fetching payment methods
 */
export function usePaymentMethods(enabled = true) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.billing.paymentMethods(),
    queryFn: () =>
      apiClient.get<PaymentMethod[]>(API_ENDPOINTS.BILLING.PAYMENT_METHODS),
    select: (response: ApiResponse<PaymentMethod[]>) =>
      response.success ? response.data : null,
    enabled: enabled && isAuthenticated,
  });
}
