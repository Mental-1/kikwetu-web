# API Hooks Structure

This directory contains React Query hooks for interacting with the API server. All hooks are built on top of React Query for automatic caching, background updates, and optimistic updates.

## Structure

```
hooks/api/
├── query-keys.ts      # Centralized query key factory
├── use-auth.ts        # Authentication hooks
├── use-listings.ts    # Listings hooks
├── use-user.ts        # User profile and settings hooks
├── use-store.ts       # Store management hooks
├── use-messages.ts    # Messaging hooks
├── use-transactions.ts # Transaction hooks
├── use-billing.ts     # Billing and subscription hooks
├── index.ts           # Barrel export
└── README.md          # This file
```

## Usage Examples

### Authentication

```tsx
import { useLogin, useLogout } from '@/hooks/api';

function LoginPage() {
  const login = useLogin();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login.mutateAsync({ email, password });
      if (result.success) {
        // User is logged in, token stored automatically
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <button onClick={() => handleLogin('user@example.com', 'password')}>
      {login.isPending ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

### Fetching Data

```tsx
import { useListings, useListing } from '@/hooks/api';

function ListingsPage() {
  const { data: listings, isLoading, error } = useListings({
    category: 'electronics',
    page: 1,
    limit: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {listings?.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

function ListingDetailPage({ id }: { id: string }) {
  const { data: listing } = useListing(id);

  return <div>{listing?.title}</div>;
}
```

### Mutations

```tsx
import { useCreateListing, useUpdateListing } from '@/hooks/api';

function PostAdForm() {
  const createListing = useCreateListing();

  const handleSubmit = async (data: CreateListingData) => {
    try {
      const result = await createListing.mutateAsync(data);
      if (result.success) {
        toast.success('Listing created!');
        router.push(`/listings/${result.data.id}`);
      }
    } catch (error) {
      toast.error('Failed to create listing');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createListing.isPending}>
        {createListing.isPending ? 'Creating...' : 'Create Listing'}
      </button>
    </form>
  );
}
```

### Infinite Scroll

```tsx
import { useListingsInfinite } from '@/hooks/api';

function InfiniteListingsPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListingsInfinite({ category: 'electronics' });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.data.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </React.Fragment>
      ))}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### User Profile

```tsx
import { useUserProfile, useUpdateProfile } from '@/hooks/api';

function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();

  const handleUpdate = async (data: UpdateProfileData) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return <ProfileForm profile={profile} onSubmit={handleUpdate} />;
}
```

## Query Key Management

Query keys are centralized in `query-keys.ts` for consistent cache management:

```tsx
import { queryKeys } from '@/hooks/api';

// Invalidate all listings
queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });

// Invalidate specific listing
queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(id) });

// Invalidate listings with filters
queryClient.invalidateQueries({ queryKey: queryKeys.listings.list(filters) });
```

## Integration with Zustand

The hooks automatically sync with the Zustand store:
- Login/Register updates the auth store
- Logout clears the auth store and all queries
- Profile updates sync with the user store

## Best Practices

1. **Always handle loading and error states**
2. **Use the `enabled` option for conditional fetching**
3. **Invalidate queries after mutations for fresh data**
4. **Use optimistic updates for better UX when appropriate**
5. **Leverage React Query's caching for better performance**
