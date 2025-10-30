/**
 * Listings Hooks
 * React Query hooks for listing operations
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  listingsApi,
  type Listing,
  type CreateListingData,
  type SearchListingsParams,
} from '@/api';
import { queryKeys } from './query-keys';

/**
 * Hook for fetching all listings with filters
 */
export function useListings(params?: SearchListingsParams) {
  return useQuery({
    queryKey: queryKeys.listings.list(params),
    queryFn: () => listingsApi.getAll(params),
    select: (response) => (response.success ? response.data : null),
    enabled: true,
  });
}

/**
 * Hook for infinite scrolling listings
 */
export function useListingsInfinite(params?: SearchListingsParams) {
  return useInfiniteQuery({
    queryKey: queryKeys.listings.list(params),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await listingsApi.getAll({
        ...params,
        page: pageParam as number,
      });
      return {
        data: response.success ? response.data : [],
        nextPage: (pageParam as number) + 1,
        hasMore: response.success && response.data.length > 0,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
  });
}

/**
 * Hook for fetching a single listing by ID
 */
export function useListing(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.listings.detail(id),
    queryFn: () => listingsApi.getById(id),
    select: (response) => (response.success ? response.data : null),
    enabled: enabled && !!id,
  });
}

/**
 * Hook for creating a new listing
 */
export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListingData) => listingsApi.create(data),
    onSuccess: () => {
      // Invalidate listings queries to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.myListings() });
    },
  });
}

/**
 * Hook for updating a listing
 */
export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateListingData>;
    }) => listingsApi.update(id, data),
    onSuccess: (response, variables) => {
      // Update the specific listing in cache
      if (response.success) {
        queryClient.setQueryData(
          queryKeys.listings.detail(variables.id),
          response
        );
      }
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.myListings() });
    },
  });
}

/**
 * Hook for deleting a listing
 */
export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => listingsApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.listings.detail(deletedId),
      });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.myListings() });
    },
  });
}

/**
 * Hook for fetching user's listings
 */
export function useMyListings() {
  return useQuery({
    queryKey: queryKeys.listings.myListings(),
    queryFn: () => listingsApi.getMyListings(),
    select: (response) => (response.success ? response.data : null),
  });
}

/**
 * Hook for searching listings
 */
export function useSearchListings(params: SearchListingsParams) {
  return useQuery({
    queryKey: queryKeys.listings.search(params),
    queryFn: () => listingsApi.search(params),
    select: (response) => (response.success ? response.data : null),
    enabled: !!params.query || !!params.category,
  });
}
