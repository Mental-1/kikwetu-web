import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: {
    city: string;
    country: string;
  };
  isVerified: boolean;
  has2FA: boolean;
}

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Auth store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// UI state interface
interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
}

// UI store
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: false,
      searchQuery: '',
      selectedCategory: null,
      
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

// Listing state interface
interface ListingState {
  listings: unknown[];
  currentListing: unknown | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setListings: (listings: unknown[]) => void;
  setCurrentListing: (listing: unknown | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addListing: (listing: unknown) => void;
  updateListing: (id: string, updates: unknown) => void;
  removeListing: (id: string) => void;
}

// Listing store
export const useListingStore = create<ListingState>((set) => ({
  listings: [],
  currentListing: null,
  isLoading: false,
  error: null,
  
  setListings: (listings) => set({ listings }),
  setCurrentListing: (currentListing) => set({ currentListing }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  addListing: (listing) => set((state) => ({
    listings: [...state.listings, listing],
  })),
  
  updateListing: (id, updates) => set((state) => ({
    listings: state.listings.map((listing) => {
      const listingObj = listing as Record<string, unknown>;
      const updatesObj = updates as Record<string, unknown>;
      return listingObj.id === id ? { ...listingObj, ...updatesObj } : listing;
    }),
  })),
  
  removeListing: (id) => set((state) => ({
    listings: state.listings.filter((listing) => {
      const listingObj = listing as Record<string, unknown>;
      return listingObj.id !== id;
    }),
  })),
}));

export interface PostAdFormData {
  // Details step
  title: string;
  category: string;
  subcategory: string;
  condition: string;
  price: string;
  currency: string;
  description: string;
  location: string;
  tags: string[];
  brand: string;
  
  // Media step
  mediaFiles: Array<{
    id: string;
    url: string;
    file: File | null;
    type: 'image' | 'video';
    name: string;
    size: number;
  }>;
}

// Post Ad state interface
interface PostAdState {
  formData: PostAdFormData | null;
  currentStep: 'details' | 'media' | 'preview';
  
  // Actions
  setFormData: (data: Partial<PostAdFormData>) => void;
  updateDetails: (details: Partial<PostAdFormData>) => void;
  updateMedia: (mediaFiles: PostAdFormData['mediaFiles']) => void;
  setCurrentStep: (step: 'details' | 'media' | 'preview') => void;
  resetFormData: () => void;
  clearFormData: () => void;
}

// Post Ad store
export const usePostAdStore = create<PostAdState>()(
  persist(
    (set) => ({
      formData: null,
      currentStep: 'details',
      
      setFormData: (data) => set((state) => ({
        formData: {
          ...(state.formData || {
            title: '',
            category: '',
            subcategory: '',
            condition: 'USED',
            price: '',
            currency: 'KES',
            description: '',
            location: '',
            tags: [],
            brand: '',
            mediaFiles: [],
          }),
          ...data,
        },
      })),
      
      updateDetails: (details) => set((state) => ({
        formData: {
          ...(state.formData || {
            title: '',
            category: '',
            subcategory: '',
            condition: 'USED',
            price: '',
            currency: 'KES',
            description: '',
            location: '',
            tags: [],
            brand: '',
            mediaFiles: [],
          }),
          ...details,
          // Preserve media files when updating details
          mediaFiles: state.formData?.mediaFiles || [],
        },
      })),
      
      updateMedia: (mediaFiles) => set((state) => ({
        formData: {
          ...(state.formData || {
            title: '',
            category: '',
            subcategory: '',
            condition: 'USED',
            price: '',
            currency: 'KES',
            description: '',
            location: '',
            tags: [],
            brand: '',
            mediaFiles: [],
          }),
          mediaFiles: mediaFiles.map(file => ({
            id: file.id,
            url: file.url,
            type: file.type,
            name: file.name,
            size: file.size,
            file: null, // Don't persist File objects
          })),
        },
      })),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      resetFormData: () => set({
        formData: {
          title: '',
          category: '',
          subcategory: '',
          condition: 'USED',
          price: '',
          currency: 'KES',
          description: '',
          location: '',
          tags: [],
          brand: '',
          mediaFiles: [],
        },
      }),
      
      clearFormData: () => set({ formData: null, currentStep: 'details' }),
    }),
    {
      name: 'post-ad-storage',
      // Only persist formData (without File objects)
      partialize: (state) => ({
        formData: state.formData ? {
          ...state.formData,
          mediaFiles: state.formData.mediaFiles.map(file => ({
            id: file.id,
            url: file.url,
            type: file.type,
            name: file.name,
            size: file.size,
            file: null,
          })),
        } : null,
      }),
    }
  )
);
