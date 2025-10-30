// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://app.ki-kwetu.com/api/v1',
  TIMEOUT: 10000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ENABLE_2FA: '/auth/enable-2fa',
    VERIFY_2FA: '/auth/verify-2fa',
  },
  
  // User Management
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    PREFERENCES: '/user/preferences',
    UPDATE_PROFILE: '/user/profile',
  },
  
  // Listings
  LISTINGS: {
    GET_ALL: '/listings',
    GET_BY_ID: '/listings',
    CREATE: '/listings',
    UPDATE: '/listings',
    DELETE: '/listings',
    SEARCH: '/listings/search',
    MY_LISTINGS: '/listings/my',
  },
  
  // Store Management
  STORE: {
    GET: '/store',
    CREATE: '/store',
    UPDATE: '/store',
    DELETE: '/store',
  },
  
  // Transactions
  TRANSACTIONS: {
    GET_ALL: '/transactions',
    GET_BY_ID: '/transactions',
    CREATE: '/transactions',
  },
  
  // Messaging
  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    MESSAGES: '/messages',
    SEND: '/messages/send',
  },
  
  // Billing
  BILLING: {
    PLANS: '/billing/plans',
    SUBSCRIPTION: '/billing/subscription',
    PAYMENT_METHODS: '/billing/payment-methods',
  },
} as const;
