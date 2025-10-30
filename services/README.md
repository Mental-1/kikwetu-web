# Services Layer

This directory contains business logic services that wrap the API calls and provide additional functionality like validation, formatting, and data transformation.

## Structure

```
services/
├── auth.service.ts      # Authentication business logic
├── listings.service.ts  # Listings business logic
├── user.service.ts      # User profile business logic
├── index.ts             # Barrel export
└── README.md            # This file
```

## Purpose

Services provide:
- **Validation**: Data validation before API calls
- **Formatting**: Data formatting for display (prices, dates, etc.)
- **Transformation**: Data transformation and calculations
- **Error Handling**: Enhanced error handling with context
- **Business Rules**: Implementation of business logic

## Usage Examples

### Authentication Service

```tsx
import { AuthService } from '@/services';

// Check authentication status
const isAuth = AuthService.isAuthenticated();

// Login with validation
const response = await AuthService.login({
  email: 'user@example.com',
  password: 'password123',
});

if (response.success) {
  // User logged in
}
```

### Listings Service

```tsx
import { ListingsService } from '@/services';

// Validate listing before creation
const validation = ListingsService.validateListingData(data);
if (!validation.isValid) {
  console.error(validation.errors);
  return;
}

// Format price for display
const formattedPrice = ListingsService.formatPrice(1500, 'KES');
// Returns: "KES 1,500"

// Get listing age
const age = ListingsService.getListingAge(listing.createdAt);
// Returns: "2 days ago", "Just now", etc.

// Create listing with validation
const response = await ListingsService.createListing(listingData);
```

### User Service

```tsx
import { UserService } from '@/services';

// Get formatted display name
const displayName = UserService.getDisplayName(profile);
// Returns: "John Doe" or email username as fallback

// Format phone number
const formatted = UserService.formatPhoneNumber('+254712345678');
// Returns: "+254 (712) 345-678"

// Update profile with validation
const response = await UserService.updateProfile({
  firstName: 'John',
  lastName: 'Doe',
});
```

## When to Use Services vs Hooks

### Use Services when:
- You need validation or data transformation
- You're working outside React components (utility functions, server actions)
- You need formatting utilities (prices, dates, names)
- You need to check authentication status programmatically

### Use Hooks when:
- You're inside React components
- You need loading/error states
- You need React Query caching
- You need automatic refetching

## Example: Combined Usage

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

    // Use hook for API call with React Query
    try {
      await createListing.mutateAsync(data);
      toast.success('Listing created!');
    } catch (error) {
      toast.error('Failed to create listing');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## Adding New Services

1. Create a new service file: `services/[name].service.ts`
2. Export a class with static methods
3. Add validation and business logic
4. Export from `services/index.ts`
5. Document usage in this README
