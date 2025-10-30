'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import ListingCard from '@/components/cards/ListingCard';
import VideoCard from '@/components/cards/VideoCard';
import { Button } from '@/components/ui/button';
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  // Mock authentication state - replace with actual auth logic
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userLocation = 'New York'; // This will be dynamic based on user's actual location
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollButtons = () => {
    if (categoriesScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesScrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const scrollAmount = 300;
      const currentScroll = categoriesScrollRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      categoriesScrollRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const categories = [
    {
      name: 'Electronics',
      image: '/categories/electronics.jpg',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Vehicles',
      image: '/categories/vehicles.jpg',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Real Estate',
      image: '/categories/real-estate.jpg',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Home & Garden',
      image: '/categories/home-garden.jpg',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Fashion',
      image: '/categories/fashion.jpg',
      bgColor: 'bg-pink-50'
    },
    {
      name: 'Sports & Outdoors',
      image: '/categories/sports.jpg',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Books & Media',
      image: '/categories/electronics.jpg',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Toys & Games',
      image: '/categories/vehicles.jpg',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Health & Beauty',
      image: '/categories/fashion.jpg',
      bgColor: 'bg-pink-50'
    },
    {
      name: 'Pet Supplies',
      image: '/categories/home-garden.jpg',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Baby & Kids',
      image: '/categories/electronics.jpg',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Office Supplies',
      image: '/categories/vehicles.jpg',
      bgColor: 'bg-gray-50'
    },
    {
      name: 'Musical Instruments',
      image: '/categories/fashion.jpg',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Art & Crafts',
      image: '/categories/home-garden.jpg',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Collectibles',
      image: '/categories/electronics.jpg',
      bgColor: 'bg-indigo-50'
    },
    {
      name: 'Antiques',
      image: '/categories/real-estate.jpg',
      bgColor: 'bg-amber-50'
    },
    {
      name: 'Services',
      image: '/categories/sports.jpg',
      bgColor: 'bg-cyan-50'
    },
    {
      name: 'Jobs',
      image: '/categories/vehicles.jpg',
      bgColor: 'bg-teal-50'
    },
    {
      name: 'Community',
      image: '/categories/fashion.jpg',
      bgColor: 'bg-lime-50'
    },
    {
      name: 'Events',
      image: '/categories/home-garden.jpg',
      bgColor: 'bg-rose-50'
    },
    {
      name: 'Tickets',
      image: '/categories/electronics.jpg',
      bgColor: 'bg-violet-50'
    },
    {
      name: 'Travel',
      image: '/categories/real-estate.jpg',
      bgColor: 'bg-emerald-50'
    },
    {
      name: 'Free Stuff',
      image: '/categories/sports.jpg',
      bgColor: 'bg-sky-50'
    }
  ];

  const videos = [
    {
      title: 'Assembling Flat-Pack Furniture',
      thumbnail: '/video-thumbnails/furniture.jpg'
    },
    {
      title: 'Test Drive: Vintage Roadster',
      thumbnail: '/video-thumbnails/car.jpg'
    },
    {
      title: 'Getting the Perfect Shot',
      thumbnail: '/video-thumbnails/camera.jpg'
    },
    {
      title: 'Tips for Urban Gardening',
      thumbnail: '/video-thumbnails/gardening.jpg'
    }
  ];

  const listings = [
    {
      id: 1,
      title: 'Mid-Century Modern Armchair',
      description: 'Beautiful vintage armchair in excellent condition. Perfect for modern living spaces. Comfortable seating with original upholstery.',
      price: 'KES 32,500',
      condition: 'Used',
      location: 'Brooklyn, NY',
      views: '245',
      image: '/listings/armchair.jpg'
    },
    {
      id: 2,
      title: 'Classic Dutch Style Bicycle',
      description: 'Well-maintained Dutch bicycle with original components. Great for city commuting or leisurely rides around town.',
      price: 'KES 23,400',
      condition: 'Used',
      location: 'Queens, NY',
      views: '189',
      image: '/listings/bicycle.jpg'
    },
    {
      id: 3,
      title: 'Vinyl Record Collection (70s/80s Rock)',
      description: 'Extensive collection of classic rock vinyl records from the 70s and 80s. Includes rare pressings and popular albums.',
      price: 'KES 15,600',
      condition: 'New',
      location: 'Manhattan, NY',
      views: '312',
      image: '/listings/records.jpg'
    },
    {
      id: 4,
      title: 'Handmade Leather Backpack',
      description: 'Artisan-crafted leather backpack with multiple compartments. Perfect for work, travel, or daily use. High-quality materials.',
      price: 'KES 12,350',
      condition: 'Used Like New',
      location: 'Jersey City, NJ',
      views: '156',
      image: '/listings/backpack.jpg'
    },
    {
      id: 5,
      title: 'Vintage Camera Collection',
      description: 'Collection of vintage film cameras including Canon, Nikon, and Leica models. All cameras are in working condition.',
      price: 'KES 45,000',
      condition: 'Used',
      location: 'Bronx, NY',
      views: '423',
      image: '/listings/camera.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header isAuthenticated={isAuthenticated} />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto w-full">
              <div className="flex flex-row gap-1 md:gap-2 p-2 md:p-3 bg-white border-2 border-gray-200 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
                <div className="flex-[1.5] md:flex-1 flex items-center px-2 md:px-6 py-2 md:py-3 min-w-0">
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base min-w-0 w-0"
                  />
                </div>
                <div className="flex-[0.8] md:flex-1 flex items-center px-2 md:px-6 py-2 md:py-3 border-l border-gray-200 min-w-0">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={userLocation}
                    className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base min-w-0 w-0"
                  />
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-8 py-2 md:py-3 h-auto rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0"
                >
                  <span className="hidden md:inline">Search</span>
                  <Search className="w-4 h-4 md:w-5 md:h-5 md:hidden" />
                </Button>
              </div>
              
              {/* Demo Authentication Toggle - Remove in production */}
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAuthenticated(!isAuthenticated)}
                >
                  {isAuthenticated ? 'Logout (Demo)' : 'Login (Demo)'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-left mb-8 md:mb-12">
              Explore Our Categories
            </h2>
            <div className="relative w-full">
              {/* Left Arrow Button */}
              {showLeftArrow && (
                <button
                  onClick={() => scrollCategories('left')}
                  className="absolute -left-20 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
              )}

              {/* Scrollable Categories Container - Shows exactly 8 categories */}
              <div
                ref={categoriesScrollRef}
                onScroll={checkScrollButtons}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-2"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {categories.map((category, index) => {
                  // Map category names to their URL-friendly values
                  const categoryMap: Record<string, string> = {
                    'Electronics': 'electronics',
                    'Vehicles': 'vehicles',
                    'Real Estate': 'real-estate',
                    'Home & Garden': 'home-garden',
                    'Fashion': 'fashion',
                    'Sports & Outdoors': 'sports',
                    'Books & Media': 'books-media',
                    'Toys & Games': 'toys-games',
                    'Health & Beauty': 'health-beauty',
                    'Pet Supplies': 'pet-supplies',
                    'Baby & Kids': 'baby-kids',
                    'Office Supplies': 'office-supplies',
                    'Musical Instruments': 'musical-instruments',
                    'Art & Crafts': 'art-crafts',
                    'Collectibles': 'collectibles',
                    'Antiques': 'antiques',
                    'Services': 'services',
                    'Jobs': 'jobs',
                    'Community': 'community',
                    'Events': 'events',
                    'Tickets': 'tickets',
                    'Travel': 'travel',
                    'Free Stuff': 'free-stuff',
                  };
                  const categoryValue = categoryMap[category.name] || category.name.toLowerCase().replace(/\s+/g, '-');
                  
                  return (
                    <Link 
                      key={index} 
                      href={`/category/${categoryValue}`}
                      className="flex-shrink-0"
                      style={{ 
                        width: 'calc((100% - 112px) / 8)', // (100% - 7 gaps * 16px) / 8 categories
                        minWidth: 'calc((100% - 112px) / 8)',
                        flex: '0 0 calc((100% - 112px) / 8)',
                      }}
                    >
                      <div className="hover:shadow-lg transition-shadow cursor-pointer text-center px-2">
                        <div className="w-16 h-16 md:w-18 md:h-18 mx-auto mb-2 rounded-full overflow-hidden">
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium text-gray-900 text-xs leading-tight">{category.name}</h3>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Right Arrow Button */}
              {showRightArrow && (
                <button
                  onClick={() => scrollCategories('right')}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="pt-16 pb-8 md:pb-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 text-left mb-6 md:mb-12">
              See It In Action: For You
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {videos.map((video, index) => (
                <VideoCard
                  key={index}
                  thumbnail={video.thumbnail}
                  title={video.title}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Listings Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 text-left mb-12">
              Fresh Listings Near {userLocation}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
            <div className="text-center mt-8">
              <Button variant="outline" className="px-8">
                Load More
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
