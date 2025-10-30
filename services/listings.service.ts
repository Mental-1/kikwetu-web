/**
 * Listings Service
 * Business logic layer for listing operations
 */

import {
  listingsApi,
  type Listing,
  type CreateListingData,
  type SearchListingsParams,
} from '@/api';
import type { ApiResponse } from '@/api';

export class ListingsService {
  /**
   * Validate listing data before creation
   */
  static validateListingData(data: CreateListingData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    }

    if (!data.description || data.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters');
    }

    if (!data.price || data.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (!data.currency) {
      errors.push('Currency is required');
    }

    if (!data.category) {
      errors.push('Category is required');
    }

    if (!data.location?.city || !data.location?.country) {
      errors.push('Location (city and country) is required');
    }

    if (!data.images || data.images.length === 0) {
      errors.push('At least one image is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number, currency: string = 'KES'): string {
    const formatter = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return formatter.format(price);
  }

  /**
   * Format listing status
   */
  static formatStatus(status: Listing['status']): string {
    const statusMap: Record<Listing['status'], string> = {
      active: 'Active',
      sold: 'Sold',
      draft: 'Draft',
    };

    return statusMap[status] || status;
  }

  /**
   * Calculate listing age (time since creation)
   */
  static getListingAge(createdAt: string): string {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMs = now.getTime() - created.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
      }
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    }

    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }

    const years = Math.floor(diffInDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }

  /**
   * Create listing with validation
   */
  static async createListing(
    data: CreateListingData
  ): Promise<ApiResponse<Listing>> {
    // Validate data
    const validation = this.validateListingData(data);
    if (!validation.isValid) {
      return {
        success: false,
        data: {} as Listing,
        message: validation.errors.join(', '),
      };
    }

    // Call API
    try {
      return await listingsApi.create(data);
    } catch (error) {
      return {
        success: false,
        data: {} as Listing,
        message: (error as Error).message || 'Failed to create listing',
        error: (error as Error).message,
      };
    }
  }

  /**
   * Search listings with enhanced filters
   */
  static async searchListings(
    params: SearchListingsParams
  ): Promise<ApiResponse<Listing[]>> {
    try {
      // If query is provided, use search endpoint
      if (params.query) {
        return await listingsApi.search(params);
      }

      // Otherwise use getAll with filters
      return await listingsApi.getAll(params);
    } catch (error) {
      return {
        success: false,
        data: [],
        message: (error as Error).message || 'Failed to search listings',
        error: (error as Error).message,
      };
    }
  }
}
