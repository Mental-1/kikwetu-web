/**
 * User Hooks
 * React Query hooks for user profile and settings operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import {
  userApi,
  type UserProfile,
  type UpdateProfileData,
  type UserSettings,
} from '@/api';
import { queryKeys } from './query-keys';

/**
 * Hook for fetching user profile
 */
export function useUserProfile(enabled = true) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => userApi.getProfile(),
    select: (response) => (response.success ? response.data : null),
    enabled: enabled && isAuthenticated,
  });
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userApi.updateProfile(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update Zustand store
        setUser(response.data);
        // Update cache
        queryClient.setQueryData(queryKeys.user.profile(), response);
      }
      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
}

/**
 * Hook for fetching user settings
 */
export function useUserSettings(enabled = true) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.user.settings(),
    queryFn: () => userApi.getSettings(),
    select: (response) => (response.success ? response.data : null),
    enabled: enabled && isAuthenticated,
  });
}

/**
 * Hook for updating user settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserSettings>) => userApi.updateSettings(data),
    onSuccess: (response) => {
      if (response.success) {
        // Update cache
        queryClient.setQueryData(queryKeys.user.settings(), response);
      }
      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.user.settings() });
    },
  });
}

/**
 * Hook for fetching user preferences
 */
export function useUserPreferences(enabled = true) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.user.preferences(),
    queryFn: () => userApi.getPreferences(),
    select: (response) => (response.success ? response.data : null),
    enabled: enabled && isAuthenticated,
  });
}

/**
 * Hook for updating user preferences
 */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  const { setTheme } = useAuthStore();

  return useMutation({
    mutationFn: (
      data: Partial<UserSettings['preferences']>
    ) => userApi.updatePreferences(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update theme in Zustand if changed
        if (response.data.theme) {
          setTheme(response.data.theme as 'light' | 'dark' | 'system');
        }
        // Update cache
        queryClient.setQueryData(queryKeys.user.preferences(), response);
      }
      // Invalidate to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.preferences(),
      });
    },
  });
}
