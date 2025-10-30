import { apiClient, API_ENDPOINTS, ApiResponse } from './client';

// Billing Types
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface CreateSubscriptionData {
  planId: string;
  paymentMethodId?: string;
}

export interface UpdatePaymentMethodData {
  paymentMethodId: string;
}

// Billing API functions
export const billingApi = {
  // Get all available plans
  getPlans: async (): Promise<ApiResponse<Plan[]>> => {
    return apiClient.get<Plan[]>(API_ENDPOINTS.BILLING.PLANS, false);
  },

  // Get current subscription
  getSubscription: async (): Promise<ApiResponse<Subscription>> => {
    return apiClient.get<Subscription>(API_ENDPOINTS.BILLING.SUBSCRIPTION);
  },

  // Create/Update subscription
  updateSubscription: async (
    data: CreateSubscriptionData
  ): Promise<ApiResponse<Subscription>> => {
    return apiClient.post<Subscription>(API_ENDPOINTS.BILLING.SUBSCRIPTION, data);
  },

  // Cancel subscription
  cancelSubscription: async (): Promise<ApiResponse<Subscription>> => {
    return apiClient.delete<Subscription>(API_ENDPOINTS.BILLING.SUBSCRIPTION);
  },

  // Get payment methods
  getPaymentMethods: async (): Promise<ApiResponse<PaymentMethod[]>> => {
    return apiClient.get<PaymentMethod[]>(API_ENDPOINTS.BILLING.PAYMENT_METHODS);
  },

  // Add payment method
  addPaymentMethod: async (data: {
    type: PaymentMethod['type'];
    token?: string; // For card payments
    phoneNumber?: string; // For mobile money
  }): Promise<ApiResponse<PaymentMethod>> => {
    return apiClient.post<PaymentMethod>(API_ENDPOINTS.BILLING.PAYMENT_METHODS, data);
  },

  // Update payment method
  updatePaymentMethod: async (
    id: string,
    data: UpdatePaymentMethodData
  ): Promise<ApiResponse<PaymentMethod>> => {
    return apiClient.put<PaymentMethod>(`${API_ENDPOINTS.BILLING.PAYMENT_METHODS}/${id}`, data);
  },

  // Delete payment method
  deletePaymentMethod: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`${API_ENDPOINTS.BILLING.PAYMENT_METHODS}/${id}`);
  },
};
