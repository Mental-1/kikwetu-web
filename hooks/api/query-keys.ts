/**
 * Query Key Factory
 * Centralized query key management for consistent caching and invalidation
 */

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
    settings: () => [...queryKeys.auth.all, 'settings'] as const,
  },

  // Listings queries
  listings: {
    all: ['listings'] as const,
    lists: () => [...queryKeys.listings.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.listings.lists(), filters] as const,
    details: () => [...queryKeys.listings.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.listings.details(), id] as const,
    search: (params?: Record<string, unknown>) =>
      [...queryKeys.listings.all, 'search', params] as const,
    myListings: () => [...queryKeys.listings.all, 'my'] as const,
  },

  // User queries
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    settings: () => [...queryKeys.user.all, 'settings'] as const,
    preferences: () => [...queryKeys.user.all, 'preferences'] as const,
  },

  // Store queries
  store: {
    all: ['store'] as const,
    detail: (id?: string) => [...queryKeys.store.all, id] as const,
  },

  // Messages queries
  messages: {
    all: ['messages'] as const,
    conversations: () => [...queryKeys.messages.all, 'conversations'] as const,
    conversation: (id: string) =>
      [...queryKeys.messages.all, 'conversation', id] as const,
  },

  // Transactions queries
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...queryKeys.transactions.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.transactions.lists(), filters] as const,
    detail: (id: string) =>
      [...queryKeys.transactions.all, 'detail', id] as const,
  },

  // Billing queries
  billing: {
    all: ['billing'] as const,
    plans: () => [...queryKeys.billing.all, 'plans'] as const,
    subscription: () => [...queryKeys.billing.all, 'subscription'] as const,
    paymentMethods: () =>
      [...queryKeys.billing.all, 'payment-methods'] as const,
  },
} as const;
