# Services and Hooks Setup Guide

This guide explains the services and hooks structure for interacting with the API server.

## 📁 Directory Structure

```
kikwetu_web/
├── api/                    # API Service Layer
│   ├── client.ts          # HTTP client with auth token management
│   ├── config.ts          # API configuration and endpoints
│   ├── auth.ts            # Authentication API functions
│   ├── listings.ts        # Listings API functions
│   ├── user.ts            # User API functions
│   └── index.ts           # Barrel export
│
└── hooks/
    ├── api/                # React Query Hooks
    │   ├── query-keys.ts  # Centralized query key factory
    │   ├── use-auth.ts    # Authentication hooks
    │   ├── use-listings.ts # Listings hooks
    │   ├── use-user.ts    # User profile hooks
    │   ├── use-store.ts   # Store management hooks
    │   ├── use-messages.ts # Messaging hooks
    │   ├── use-transactions.ts # Transaction hooks
    │   ├── use-billing.ts # Billing hooks
    │   ├── index.ts       # Barrel export
    │   └── README.md      # Detailed hooks documentation
    │
    └── useApi.ts          # Legacy hook (can be replaced with React Query hooks)
```

## 🏗️ Architecture Overview

### Service Layer (`api/`)
The service layer contains all API function calls. These are pure functions that:
- Make HTTP requests via the API client
- Handle response transformation
- Don't manage state (that's the hooks' job)

### Hooks Layer (`hooks/api/`)
The hooks layer uses React Query to:
- Manage loading states
- Cache responses
- Handle errors
- Invalidate and refetch data
- Sync with Zustand store

## 🚀 Quick Start

### 1. Import hooks from the centralized export

```tsx
import {
  // Query hooks
  useListings,
  useListing,
  useUserProfile,
  
  // Mutation hooks
  useLogin,
  useCreateListing,
  useUpdateProfile,
  
  // Query keys (for cache management)
  queryKeys
} from '@/hooks/api';
```

### 2. Use in your components

```tsx
'use client';

import { useListings, useCreateListing } from '@/hooks/api';

export default function ListingsPage() {
  // Fetch listings
  const { data: listings, isLoading, error } = useListings({
    category: 'electronics',
    page: 1,
    limit: 20,
  });

  // Create listing mutation
  const createListing = useCreateListing();

  const handleCreate = async (data) => {
    try {
      const result = await createListing.mutateAsync(data);
      if (result.success) {
        // Listing created, cache automatically updated
        console.log('Success!');
      }
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {listings?.map(listing => (
        <div key={listing.id}>{listing.title}</div>
      ))}
    </div>
  );
}
```

## 📚 Available Hooks

### Authentication
- `useLogin()` - User login
- `useRegister()` - User registration
- `useLogout()` - User logout
- `useForgotPassword()` - Request password reset
- `useResetPassword()` - Reset password
- `useVerifyEmail()` - Verify email address
- `useEnable2FA()` - Enable two-factor authentication
- `useVerify2FA()` - Verify 2FA code
- `useLoginWith2FA()` - Login with 2FA

### Listings
- `useListings(params?)` - Fetch listings with filters
- `useListingsInfinite(params?)` - Infinite scroll listings
- `useListing(id)` - Fetch single listing
- `useCreateListing()` - Create new listing
- `useUpdateListing()` - Update listing
- `useDeleteListing()` - Delete listing
- `useMyListings()` - Fetch user's listings
- `useSearchListings(params)` - Search listings

### User
- `useUserProfile(enabled?)` - Fetch user profile
- `useUpdateProfile()` - Update user profile
- `useUserSettings(enabled?)` - Fetch user settings
- `useUpdateSettings()` - Update user settings
- `useUserPreferences(enabled?)` - Fetch user preferences
- `useUpdatePreferences()` - Update user preferences

### Store
- `useStore(id)` - Fetch store by ID
- `useCreateStore()` - Create store
- `useUpdateStore()` - Update store

### Messages
- `useConversations(enabled?)` - Fetch all conversations
- `useConversationMessages(conversationId)` - Fetch messages with infinite scroll
- `useSendMessage()` - Send a message

### Transactions
- `useTransactions(filters?)` - Fetch transactions
- `useTransaction(id)` - Fetch single transaction
- `useCreateTransaction()` - Create transaction

### Billing
- `usePlans()` - Fetch available plans
- `useSubscription()` - Fetch current subscription
- `useUpdateSubscription()` - Update subscription
- `useCancelSubscription()` - Cancel subscription
- `usePaymentMethods()` - Fetch payment methods

## 🔄 Integration with Zustand

The hooks automatically integrate with your Zustand store:

1. **Authentication State**: Login/Register updates the auth store automatically
2. **Token Management**: Auth tokens are synced between Zustand and localStorage
3. **User Profile**: Profile updates sync with the Zustand user state
4. **Theme Preferences**: Preference updates sync with UI store

Example:
```tsx
const { user, isAuthenticated } = useAuthStore(); // Zustand store
const { data: profile } = useUserProfile(); // React Query hook

// Both stay in sync automatically!
```

## 🎯 Query Key Management

Query keys are centralized for easy cache invalidation:

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/api';

const queryClient = useQueryClient();

// Invalidate all listings
queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });

// Invalidate specific listing
queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(id) });

// Invalidate with filters
queryClient.invalidateQueries({ 
  queryKey: queryKeys.listings.list({ category: 'electronics' })
});
```

## 🔧 API Client Integration

The API client (`api/client.ts`) automatically:
- Reads auth tokens from Zustand store (with localStorage fallback)
- Sets auth tokens in both Zustand and localStorage
- Includes Bearer token in Authorization header
- Handles errors consistently

## 💡 Best Practices

1. **Always handle loading and error states**
   ```tsx
   const { data, isLoading, error } = useListings();
   if (isLoading) return <Loading />;
   if (error) return <Error message={error.message} />;
   ```

2. **Use enabled option for conditional fetching**
   ```tsx
   const { data } = useUserProfile(enabled={isAuthenticated});
   ```

3. **Invalidate queries after mutations**
   ```tsx
   const createListing = useCreateListing();
   // Automatically invalidates listings cache
   ```

4. **Use optimistic updates for better UX**
   ```tsx
   const updateListing = useUpdateListing();
   // Cache is updated immediately via queryClient.setQueryData
   ```

5. **Leverage React Query's caching**
   - Same query with same params = instant response
   - Background refetching keeps data fresh
   - Automatic deduplication of requests

## 🔄 Migrating from Old Hooks

If you're using the old `useApi` hook, here's how to migrate:

### Before:
```tsx
const { data, loading, error } = useApi(
  () => listingsApi.getAll(),
  []
);
```

### After:
```tsx
const { data, isLoading, error } = useListings();
```

The new hooks:
- ✅ Built on React Query (better caching)
- ✅ Automatic refetching
- ✅ Better TypeScript support
- ✅ Optimistic updates
- ✅ Automatic cache invalidation

## 📖 More Examples

See `hooks/api/README.md` for detailed usage examples and patterns.
