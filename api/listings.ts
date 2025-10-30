import { apiClient, API_ENDPOINTS, ApiResponse } from './client';

// Listing Types
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  status: 'active' | 'sold' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export interface SearchListingsParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  page?: number;
  limit?: number;
}

// Listings API functions
export const listingsApi = {
  // Get all listings
  getAll: async (params?: SearchListingsParams): Promise<ApiResponse<Listing[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.LISTINGS.GET_ALL}?${queryParams.toString()}`
      : API_ENDPOINTS.LISTINGS.GET_ALL;
    
    return apiClient.get<Listing[]>(endpoint, false);
  },

  // Get listing by ID
  getById: async (id: string): Promise<ApiResponse<Listing>> => {
    return apiClient.get<Listing>(`${API_ENDPOINTS.LISTINGS.GET_BY_ID}/${id}`, false);
  },

  // Create listing
  create: async (data: CreateListingData): Promise<ApiResponse<Listing>> => {
    return apiClient.post<Listing>(API_ENDPOINTS.LISTINGS.CREATE, data);
  },

  // Update listing
  update: async (id: string, data: Partial<CreateListingData>): Promise<ApiResponse<Listing>> => {
    return apiClient.put<Listing>(`${API_ENDPOINTS.LISTINGS.UPDATE}/${id}`, data);
  },

  // Delete listing
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`${API_ENDPOINTS.LISTINGS.DELETE}/${id}`);
  },

  // Get my listings
  getMyListings: async (): Promise<ApiResponse<Listing[]>> => {
    return apiClient.get<Listing[]>(API_ENDPOINTS.LISTINGS.MY_LISTINGS);
  },

  // Search listings
  search: async (params: SearchListingsParams): Promise<ApiResponse<Listing[]>> => {
    return apiClient.post<Listing[]>(API_ENDPOINTS.LISTINGS.SEARCH, params, false);
  },
};
