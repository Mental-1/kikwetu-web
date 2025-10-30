/**
 * Authentication Hooks
 * React Query hooks for authentication operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { authApi, type LoginCredentials, type RegisterData } from '@/api';
import { queryKeys } from './query-keys';

/**
 * Hook for user login
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update Zustand store
        setAuth(response.data.user, response.data.token);
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      }
    },
  });
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update Zustand store
        setAuth(response.data.user, response.data.token);
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      }
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const { logout: clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear Zustand store
      clearAuth();
      // Clear all queries
      queryClient.clear();
    },
  });
}

/**
 * Hook for forgot password
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

/**
 * Hook for reset password
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword),
  });
}

/**
 * Hook for email verification
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}

/**
 * Hook for enabling 2FA
 */
export function useEnable2FA() {
  return useMutation({
    mutationFn: () => authApi.enable2FA(),
  });
}

/**
 * Hook for verifying 2FA
 */
export function useVerify2FA() {
  return useMutation({
    mutationFn: (code: string) => authApi.verify2FA(code),
  });
}

/**
 * Hook for 2FA login
 */
export function useLoginWith2FA() {
  const queryClient = useQueryClient();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: ({
      email,
      password,
      code,
    }: {
      email: string;
      password: string;
      code: string;
    }) => authApi.loginWith2FA(email, password, code),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update Zustand store
        setAuth(response.data.user, response.data.token);
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      }
    },
  });
}
