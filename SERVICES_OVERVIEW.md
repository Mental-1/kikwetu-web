# Services Overview

Complete guide to the services architecture in the Kikwetu web application.

## 📁 Architecture

```
kikwetu_web/
├── api/                    # API Service Layer (Low-level HTTP calls)
│   ├── client.ts          # HTTP client with auth management
│   ├── config.ts          # API configuration
│   ├── auth.ts            # Authentication API
│   ├── listings.ts        # Listings API
│   ├── user.ts            # User API
│   ├── store.ts           # Store API
│   ├── messages.ts        # Messages API
│   ├── transactions.ts    # Transactions API
│   ├── billing.ts         # Billing API
│   ├── upload.ts          # File upload API
│   └── index.ts           # Barrel export
│
├── services/               # Business Logic Layer (High-level services)
│   ├── auth.service.ts   # Authentication business logic
│   ├── listings.service.ts # Listings business logic
│   ├── user.service.ts   # User business logic
│   ├── index.ts          # Barrel export
│   └── README.md         # Services documentation
│
└── hooks/
    └── api/               # React Query Hooks (React integration)
        ├── query-keys.ts  # Query key factory
        ├── use-auth.ts   # Auth hooks
        ├── use-listings.ts # Listings hooks
        ├── use-user.ts   # User hooks
        └── ...           # Other hooks
```

## 🏗️ Three-Layer Architecture

### 1. API Layer (`api/`)
**Purpose**: Low-level HTTP communication with the server

- Makes raw API calls
- Handles request/response formatting
- Manages authentication tokens
- No business logic

**Example**:
```tsx
import { listingsApi } from '@/api';

const response = await listingsApi.getAll({ category: 'electronics' });
```

### 2. Services Layer (`services/`)
**Purpose**: Business logic and data transformation

- Validates data before API calls
- Formats data for display (prices, dates, names)
- Implements business rules
- Transforms and calculates data

**Example**:
```tsx
import { ListingsService } from '@/services';

// Validate before creating
const validation = ListingsService.validateListingData(data);
if (!validation.isValid) {
  console.error(validation.errors);
}

// Format for display
const price = ListingsService.formatPrice(1500, 'KES'); // "KES 1,500"
```

### 3. Hooks Layer (`hooks/api/`)
**Purpose**: React integration with caching and state management

- React Query integration
- Loading/error states
- Automatic caching
- Optimistic updates

**Example**:
```tsx
import { useListings, useCreateListing } from '@/hooks/api';

const { data, isLoading, error } = useListings();
const createListing = useCreateListing();
```

## 📋 Complete API Services

### Authentication (`api/auth.ts`)
- `authApi.login()` - User login
- `authApi.register()` - User registration
- `authApi.logout()` - User logout
- `authApi.forgotPassword()` - Request password reset
- `authApi.resetPassword()` - Reset password
- `authApi.verifyEmail()` - Verify email
- `authApi.enable2FA()` - Enable two-factor auth
- `authApi.verify2FA()` - Verify 2FA code
- `authApi.loginWith2FA()` - Login with 2FA

### Listings (`api/listings.ts`)
- `listingsApi.getAll()` - Get all listings with filters
- `listingsApi.getById()` - Get listing by ID
- `listingsApi.create()` - Create new listing
- `listingsApi.update()` - Update listing
- `listingsApi.delete()` - Delete listing
- `listingsApi.getMyListings()` - Get user's listings
- `listingsApi.search()` - Search listings

### User (`api/user.ts`)
- `userApi.getProfile()` - Get user profile
- `userApi.updateProfile()` - Update profile
- `userApi.getSettings()` - Get user settings
- `userApi.updateSettings()` - Update settings
- `userApi.getPreferences()` - Get preferences
- `userApi.updatePreferences()` - Update preferences

### Store (`api/store.ts`)
- `storeApi.getById()` - Get store by ID
- `storeApi.getMyStore()` - Get current user's store
- `storeApi.create()` - Create store
- `storeApi.update()` - Update store
- `storeApi.delete()` - Delete store

### Messages (`api/messages.ts`)
- `messagesApi.getConversations()` - Get all conversations
- `messagesApi.getConversation()` - Get conversation by ID
- `messagesApi.getMessages()` - Get messages in conversation
- `messagesApi.sendMessage()` - Send a message
- `messagesApi.markAsRead()` - Mark message as read
- `messagesApi.markConversationAsRead()` - Mark conversation as read

### Transactions (`api/transactions.ts`)
- `transactionsApi.getAll()` - Get all transactions with filters
- `transactionsApi.getById()` - Get transaction by ID
- `transactionsApi.create()` - Create transaction
- `transactionsApi.updateStatus()` - Update transaction status
- `transactionsApi.cancel()` - Cancel transaction

### Billing (`api/billing.ts`)
- `billingApi.getPlans()` - Get available plans
- `billingApi.getSubscription()` - Get current subscription
- `billingApi.updateSubscription()` - Create/update subscription
- `billingApi.cancelSubscription()` - Cancel subscription
- `billingApi.getPaymentMethods()` - Get payment methods
- `billingApi.addPaymentMethod()` - Add payment method
- `billingApi.updatePaymentMethod()` - Update payment method
- `billingApi.deletePaymentMethod()` - Delete payment method

### Upload (`api/upload.ts`)
- `uploadApi.uploadFile()` - Upload single file
- `uploadApi.uploadFiles()` - Upload multiple files
- `uploadApi.deleteFile()` - Delete uploaded file

## 🔧 Business Logic Services

### Auth Service (`services/auth.service.ts`)
- `AuthService.login()` - Login with validation
- `AuthService.register()` - Register with validation
- `AuthService.logout()` - Logout user
- `AuthService.isAuthenticated()` - Check auth status
- `AuthService.getToken()` - Get current token

### Listings Service (`services/listings.service.ts`)
- `ListingsService.validateListingData()` - Validate listing before creation
- `ListingsService.formatPrice()` - Format price for display
- `ListingsService.formatStatus()` - Format listing status
- `ListingsService.getListingAge()` - Calculate and format listing age
- `ListingsService.createListing()` - Create with validation
- `ListingsService.searchListings()` - Enhanced search

### User Service (`services/user.service.ts`)
- `UserService.validateProfileData()` - Validate profile updates
- `UserService.getFullName()` - Get formatted full name
- `UserService.getDisplayName()` - Get display name (with fallback)
- `UserService.formatPhoneNumber()` - Format phone number
- `UserService.updateProfile()` - Update with validation

## 🎯 Usage Patterns

### Pattern 1: Direct API Call (Outside React)
```tsx
import { listingsApi } from '@/api';

async function serverAction() {
  const response = await listingsApi.getAll();
  return response.data;
}
```

### Pattern 2: Service + Validation (Utility Functions)
```tsx
import { ListingsService } from '@/services';

function validateAndCreate(data: CreateListingData) {
  const validation = ListingsService.validateListingData(data);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }
  // Proceed with creation
}
```

### Pattern 3: Hook in Component (React)
```tsx
'use client';

import { useListings } from '@/hooks/api';
import { ListingsService } from '@/services';

function ListingsPage() {
  const { data: listings } = useListings();
  
  return (
    <div>
      {listings?.map(listing => (
        <div key={listing.id}>
          {listing.title} - {ListingsService.formatPrice(listing.price)}
        </div>
      ))}
    </div>
  );
}
```

### Pattern 4: Combined (Validation + Hook)
```tsx
'use client';

import { useCreateListing } from '@/hooks/api';
import { ListingsService } from '@/services';

function PostAdForm() {
  const createListing = useCreateListing();
  
  const handleSubmit = async (data: CreateListingData) => {
    // Use service for validation
    const validation = ListingsService.validateListingData(data);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }
    
    // Use hook for API call
    await createListing.mutateAsync(data);
  };
}
```

## 🔄 When to Use Each Layer

| Use Case | Layer | Example |
|----------|-------|---------|
| React component with caching | Hooks | `useListings()` |
| Server action or API route | API | `listingsApi.getAll()` |
| Data validation | Services | `ListingsService.validateListingData()` |
| Formatting for display | Services | `ListingsService.formatPrice()` |
| Business logic | Services | `AuthService.isAuthenticated()` |
| Direct HTTP call | API | `apiClient.get()` |

## 📦 Import Paths

```tsx
// API Services
import { listingsApi, authApi, userApi } from '@/api';
import type { Listing, UserProfile } from '@/api';

// Business Services
import { ListingsService, AuthService, UserService } from '@/services';

// React Hooks
import { useListings, useLogin, useUserProfile } from '@/hooks/api';

// Types
import type { Listing, CreateListingData } from '@/api';
```

## ✅ Best Practices

1. **Use hooks in React components** for automatic caching and state management
2. **Use services for validation** before making API calls
3. **Use services for formatting** when displaying data
4. **Use API directly** in server actions and API routes
5. **Combine services and hooks** for validation + React integration
6. **Keep business logic in services**, not in components or API layer

## 📚 Documentation

- [API Services Guide](./SERVICES_HOOKS_GUIDE.md) - Complete hooks documentation
- [Services README](./services/README.md) - Detailed services documentation
- [Hooks README](./hooks/api/README.md) - React Query hooks examples
