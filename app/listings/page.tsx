'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';
import ListingCard from '@/components/cards/ListingCard';
import ListViewCard from '@/components/cards/ListViewCard';
import FilterSidebar from '@/components/filters/FilterSidebar';
import SortDropdown from '@/components/ui/SortDropdown';
import { useListingsInfinite } from '@/hooks/useListingsInfinite';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';

// Category and subcategory labels mapping
const categoryLabels: Record<string, string> = {
  electronics: 'Electronics',
  vehicles: 'Vehicles',
  'real-estate': 'Real Estate',
  'home-garden': 'Home & Garden',
  fashion: 'Fashion',
  sports: 'Sports & Outdoors',
};

const subcategoryLabels: Record<string, Record<string, string>> = {
  electronics: {
    phones: 'Phones & Accessories',
    computers: 'Computers & Laptops',
    audio: 'Audio & Headphones',
    cameras: 'Cameras & Photography',
    gaming: 'Gaming Consoles',
    tv: 'TV & Home Theater',
    'smart-home': 'Smart Home Devices',
  },
  vehicles: {
    cars: 'Cars',
    motorcycles: 'Motorcycles',
    bicycles: 'Bicycles',
    trucks: 'Trucks & Vans',
    parts: 'Parts & Accessories',
    boats: 'Boats & Watercraft',
    rvs: 'RVs & Campers',
  },
  'home-garden': {
    furniture: 'Furniture',
    appliances: 'Appliances',
    decor: 'Home Decor',
    garden: 'Garden & Outdoor',
    kitchen: 'Kitchen & Dining',
    bedroom: 'Bedroom',
    'living-room': 'Living Room',
  },
  fashion: {
    apparel: 'Apparel & Accessories',
    shoes: 'Shoes',
    bags: 'Bags & Luggage',
    jewelry: 'Jewelry & Watches',
    mens: "Men's Fashion",
    womens: "Women's Fashion",
    kids: "Kids' Fashion",
  },
  sports: {
    fitness: 'Fitness Equipment',
    outdoor: 'Outdoor Gear',
    'sports-apparel': 'Sports Apparel',
    'water-sports': 'Water Sports',
    'winter-sports': 'Winter Sports',
    'team-sports': 'Team Sports Equipment',
  },
};

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const subcategoryParam = searchParams.get('subcategory') || '';

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState<{
    category?: string;
    subcategory?: string;
    priceRange?: [number, number];
    condition?: string[];
    location?: string;
    brand?: string[];
    distance?: number;
  }>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    if (categoryParam || subcategoryParam) {
      setFilters((prev) => ({
        ...prev,
        category: categoryParam || prev.category,
        subcategory: subcategoryParam || prev.subcategory,
      }));
    }
  }, [categoryParam, subcategoryParam]);

  // Prevent body scroll when mobile filters are open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMobileFilters) {
        setShowMobileFilters(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMobileFilters]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useListingsInfinite({
    sortBy,
    filters
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const listings = data?.pages.flatMap((page: { data: Listing[] }) => page.data) || [];
  const totalResults = 2458; // Fixed total for realistic results display

  interface Listing {
    id: number;
    title: string;
    description: string;
    price: string;
    condition: string;
    location: string;
    views: string;
    image: string;
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  interface FilterState {
    priceRange: [number, number];
    category: string;
    condition: string[];
    location: string;
    brand: string[];
    distance: number;
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters as unknown as Record<string, unknown>);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={false} />
      
      {/* Breadcrumbs and Results Summary */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
            <nav className="text-xs md:text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              {categoryParam && (
                <>
                  <span className="mx-2">/</span>
                  <Link 
                    href={`/category/${categoryParam}`} 
                    className="hover:text-gray-900"
                  >
                    {categoryLabels[categoryParam] || categoryParam}
                  </Link>
                </>
              )}
              {subcategoryParam && categoryParam && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-gray-900">
                    {subcategoryLabels[categoryParam]?.[subcategoryParam] || subcategoryParam}
                  </span>
                </>
              )}
            </nav>
            <div className="text-xs md:text-sm text-gray-600">
              {categoryParam || subcategoryParam ? (
                <>
                  Showing <span className="font-semibold text-gray-900">{totalResults.toLocaleString()}</span> results
                  {subcategoryParam && categoryParam && (
                    <> for &apos;{subcategoryLabels[categoryParam]?.[subcategoryParam] || subcategoryParam}&apos;</>
                  )}
                </>
              ) : (
                <>
                  Showing <span className="font-semibold text-gray-900">{totalResults.toLocaleString()}</span> results
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <FilterSidebar onFiltersChange={handleFiltersChange} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6 gap-2">
              <div className="flex items-center gap-2 flex-1">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
                <SortDropdown onSortChange={handleSortChange} />
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-blue-600 text-white' : ''}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-blue-600 text-white' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading listings...</p>
              </div>
            ) : (
              <>
                {/* Listings - Grid or List View */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        id={listing.id}
                        title={listing.title}
                        description={listing.description}
                        price={listing.price}
                        condition={listing.condition}
                        location={listing.location}
                        views={listing.views}
                        image={listing.image}
                        onFavoriteClick={(id) => console.log('Favorited listing:', id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mb-8">
                    {listings.map((listing) => (
                      <ListViewCard
                        key={listing.id}
                        id={listing.id}
                        title={listing.title}
                        description={listing.description}
                        price={listing.price}
                        condition={listing.condition}
                        location={listing.location}
                        views={listing.views}
                        image={listing.image}
                        onFavoriteClick={(id) => console.log('Favorited listing:', id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar Overlay */}
      {showMobileFilters && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowMobileFilters(false);
            }
          }}
        >
          <div className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white shadow-lg overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilters(false)}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              <FilterSidebar 
                onFiltersChange={handleFiltersChange} 
                className="!w-full !max-w-none"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
}