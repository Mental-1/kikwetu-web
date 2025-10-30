# API Integration Setup Guide

## Overview

Your Next.js web app is now configured to use your existing API at `app.ki-kwetu.com/api/v1`. This setup allows you to share the same backend between your React Native mobile app and Next.js web app.

## ✅ What's Been Set Up

### 1. API Client (`lib/api/client.ts`)
- HTTP client with authentication support
- Automatic token management
- Error handling and timeout configuration
- Support for all HTTP methods (GET, POST, PUT, DELETE, PATCH)

### 2. API Configuration (`lib/api/config.ts`)
- Centralized API endpoints
- Environment-based configuration
- Type-safe endpoint definitions

### 3. API Modules
- **Authentication** (`lib/api/auth.ts`) - Login, register, 2FA, etc.
- **Listings** (`lib/api/listings.ts`) - CRUD operations for listings
- **User** (`lib/api/user.ts`) - Profile, settings, preferences

### 4. React Hooks (`lib/hooks/useApi.ts`)
- `useApi` - For GET requests with loading/error states
- `useApiMutation` - For POST/PUT/DELETE operations

## 🔧 Environment Setup

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_API_URL=https://app.ki-kwetu.com/api/v1
NEXT_PUBLIC_APP_NAME=Kikwetu Marketplace
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 Usage Examples

### Authentication
```typescript
import { authApi } from '@/lib/api';

// Login
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authApi.login({ email, password });
    if (response.success) {
      // User is now logged in, token is automatically stored
      router.push('/seller-dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Fetching Data
```typescript
import { useApi } from '@/lib/hooks/useApi';
import { listingsApi } from '@/lib/api';

function ListingsPage() {
  const { data: listings, loading, error } = useApi(
    () => listingsApi.getAll(),
    []
  );

  if (loading) return <div>Loading...</div>;
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

### Mutations
```typescript
import { useApiMutation } from '@/lib/hooks/useApi';
import { listingsApi } from '@/lib/api';

function CreateListingPage() {
  const { mutate: createListing, loading } = useApiMutation();

  const handleSubmit = async (formData: CreateListingData) => {
    try {
      await createListing((data) => listingsApi.create(data), formData);
      // Success - redirect or show success message
    } catch (error) {
      // Handle error
    }
  };
}
```

## 🔐 Authentication Flow

1. **Login/Register** - Token is automatically stored in localStorage
2. **Protected Routes** - Token is automatically included in API requests
3. **Logout** - Token is automatically removed

## 🌐 API Compatibility

This setup works with any REST API that follows these conventions:

- **Response Format**: `{ success: boolean, data: any, message?: string }`
- **Authentication**: Bearer token in Authorization header
- **Error Handling**: HTTP status codes + error messages

## 🚀 Benefits

1. **Code Reuse** - Same API logic for mobile and web
2. **Consistency** - Identical data models and business logic
3. **Lightweight** - No duplicate API routes in Next.js
4. **Type Safety** - Full TypeScript support
5. **Easy Testing** - Mock API calls easily

## 🔄 Next Steps

1. **Add More API Modules** - Extend with transactions, messaging, etc.
2. **Add Caching** - Implement React Query or SWR for better caching
3. **Add Offline Support** - Cache data for offline usage
4. **Add Real-time** - WebSocket integration for live updates
5. **Add Error Boundaries** - Better error handling UI

## 📝 Notes

- The API client automatically handles authentication tokens
- All API calls include proper error handling
- The setup is fully TypeScript compatible
- You can easily extend this with additional API modules
- The hooks provide loading states and error handling out of the box

Your Next.js app is now ready to communicate with your existing API! 🎉
