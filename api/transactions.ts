import { apiClient, API_ENDPOINTS, ApiResponse } from './client';

// Transaction Types
export interface Transaction {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  sellerId: string;
  sellerName: string;
  sellerEmail?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  listingId: string;
  paymentMethod: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface TransactionFilters {
  status?: Transaction['status'];
  type?: 'buyer' | 'seller';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Transactions API functions
export const transactionsApi = {
  // Get all transactions
  getAll: async (filters?: TransactionFilters): Promise<ApiResponse<Transaction[]>> => {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `${API_ENDPOINTS.TRANSACTIONS.GET_ALL}?${queryParams.toString()}`
      : API_ENDPOINTS.TRANSACTIONS.GET_ALL;

    return apiClient.get<Transaction[]>(endpoint);
  },

  // Get transaction by ID
  getById: async (id: string): Promise<ApiResponse<Transaction>> => {
    return apiClient.get<Transaction>(`${API_ENDPOINTS.TRANSACTIONS.GET_BY_ID}/${id}`);
  },

  // Create transaction
  create: async (data: CreateTransactionData): Promise<ApiResponse<Transaction>> => {
    return apiClient.post<Transaction>(API_ENDPOINTS.TRANSACTIONS.CREATE, data);
  },

  // Update transaction status
  updateStatus: async (
    id: string,
    status: Transaction['status']
  ): Promise<ApiResponse<Transaction>> => {
    return apiClient.patch<Transaction>(`${API_ENDPOINTS.TRANSACTIONS.GET_BY_ID}/${id}`, {
      status,
    });
  },

  // Cancel transaction
  cancel: async (id: string): Promise<ApiResponse<Transaction>> => {
    return apiClient.post<Transaction>(`${API_ENDPOINTS.TRANSACTIONS.GET_BY_ID}/${id}/cancel`, {});
  },
};
