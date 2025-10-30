// Color constants based on your marketplace design
export const COLORS = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main blue (Search button)
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Orange accent (Post Ad button)
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Main orange
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  // Dark theme colors
  dark: {
    background: '#1a1a1a', // Main dark background
    surface: '#2a2a2a', // Card backgrounds
    border: '#3a3a3a', // Borders
    text: {
      primary: '#ffffff', // Main text
      secondary: '#a0a0a0', // Secondary text
      muted: '#666666', // Muted text
    },
  },
  
  // Light theme colors
  light: {
    background: '#ffffff',
    surface: '#f8f9fa',
    border: '#e9ecef',
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      muted: '#adb5bd',
    },
  },
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Category colors (for the category cards)
  categories: {
    electronics: '#e0f2fe', // Light blue
    vehicles: '#f0fdf4', // Light green
    realEstate: '#fef3c7', // Light yellow
    homeGarden: '#f0fdf4', // Light green
    fashion: '#fce7f3', // Light pink
    sports: '#f0f9ff', // Light blue
  },
} as const;

// Asset paths
export const ASSETS = {
  // Logo
  logo: '/logo.svg',
  
  // Category images (you'll add these to public/categories folder)
  categories: {
    electronics: '/categories/electronics.jpg',
    vehicles: '/categories/vehicles.jpg',
    realEstate: '/categories/real-estate.jpg',
    homeGarden: '/categories/home-garden.jpg',
    fashion: '/categories/fashion.jpg',
    sports: '/categories/sports.jpg',
  },
  
  // Placeholder images
  placeholder: {
    listing: '/placeholder-listing.jpg',
    avatar: '/placeholder-avatar.jpg',
    category: '/placeholder-category.jpg',
  },
} as const;
