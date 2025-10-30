/**
 * User Service
 * Business logic layer for user operations
 */

import { userApi, type UserProfile, type UpdateProfileData } from '@/api';
import type { ApiResponse } from '@/api';

export class UserService {
  /**
   * Validate profile update data
   */
  static validateProfileData(data: UpdateProfileData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (data.firstName && data.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (data.lastName && data.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    if (data.phone) {
      // Basic phone validation (adjust based on your requirements)
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        errors.push('Invalid phone number format');
      }
    }

    if (data.bio && data.bio.length > 500) {
      errors.push('Bio must be less than 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format user full name
   */
  static getFullName(profile: UserProfile): string {
    return `${profile.firstName} ${profile.lastName}`.trim();
  }

  /**
   * Get user display name (full name or email fallback)
   */
  static getDisplayName(profile: UserProfile): string {
    const fullName = this.getFullName(profile);
    return fullName || profile.email.split('@')[0];
  }

  /**
   * Format phone number for display
   */
  static formatPhoneNumber(phone?: string): string | null {
    if (!phone) return null;

    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');

    // Format based on length
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    if (digits.length > 10) {
      return `+${digits.slice(0, -10)} (${digits.slice(-10, -7)}) ${digits.slice(-7, -4)}-${digits.slice(-4)}`;
    }

    return phone;
  }

  /**
   * Update profile with validation
   */
  static async updateProfile(
    data: UpdateProfileData
  ): Promise<ApiResponse<UserProfile>> {
    // Validate data
    const validation = this.validateProfileData(data);
    if (!validation.isValid) {
      return {
        success: false,
        data: {} as UserProfile,
        message: validation.errors.join(', '),
      };
    }

    try {
      return await userApi.updateProfile(data);
    } catch (error) {
      return {
        success: false,
        data: {} as UserProfile,
        message: (error as Error).message || 'Failed to update profile',
        error: (error as Error).message,
      };
    }
  }
}
