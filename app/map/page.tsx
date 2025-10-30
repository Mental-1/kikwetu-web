'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/navigation/Header';
import MapSidebar from '@/components/map/MapSidebar';
import { Button } from '@/components/ui/button';
import { List } from 'lucide-react';
import { LatLngExpression } from 'leaflet';

// Dynamically import map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
});

interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  condition: string;
  distance: string;
  views: string;
  image: string;
  position: LatLngExpression;
}

// Default to Nairobi, Kenya coordinates
const NAIROBI_COORDINATES: LatLngExpression = [-1.2921, 36.8219];

export default function MapPage() {
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [searchQuery] = useState('vintage bicycle');
  const [category] = useState('Vehicles');
  const [radius] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(NAIROBI_COORDINATES);
  
  // Get user's location on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setMapCenter(NAIROBI_COORDINATES);
        }
      );
    }
  }, []);

  const listings: Listing[] = useMemo(() => [
    {
      id: 1,
      title: 'Vintage Raleigh Roadster Bicycle',
      description: 'Beautiful vintage roadster bicycle in excellent condition. Perfect for city commuting or leisurely rides. Original components maintained.',
      price: 'KES 32,500',
      condition: 'Used',
      distance: '1.2 km away',
      views: '245',
      image: '/placeholder-laptop-1.jpg',
      position: [37.7849, -122.4094] // Near Union Square, SF
    },
    {
      id: 2,
      title: 'Modern Trek Mountain Bike',
      description: 'High-performance mountain bike with excellent suspension and gear system. Great for trails and off-road adventures. Well-maintained.',
      price: 'KES 78,000',
      condition: 'Used',
      distance: '3.5 km away',
      views: '189',
      image: '/placeholder-laptop-2.jpg',
      position: [37.7599, -122.4149] // Twin Peaks area
    },
    {
      id: 3,
      title: 'Schwinn Cruiser - Like New',
      description: 'Comfortable cruiser bike perfect for casual rides. Like new condition with minimal use. Great style and smooth ride.',
      price: 'KES 23,400',
      condition: 'New',
      distance: '5.1 km away',
      views: '312',
      image: '/placeholder-laptop-3.jpg',
      position: [37.7649, -122.4194] // Mission District
    },
    {
      id: 4,
      title: 'Kids BMX Bike',
      description: 'Sturdy BMX bike perfect for kids and young riders. Lightweight frame and adjustable seat. Good condition with minor wear.',
      price: 'KES 15,600',
      condition: 'Used',
      distance: '2.8 km away',
      views: '156',
      image: '/placeholder-laptop-4.jpg',
      position: [37.7749, -122.4294] // Noe Valley
    },
    {
      id: 5,
      title: 'Electric City Bike',
      description: 'Premium electric city bike with long battery life and powerful motor. Perfect for daily commutes and eco-friendly transportation.',
      price: 'KES 95,000',
      condition: 'New',
      distance: '4.2 km away',
      views: '423',
      image: '/placeholder-laptop-5.jpg',
      position: [37.7549, -122.4494] // Bernal Heights
    }
  ], []);

  const handleListingClick = (id: number) => {
    setSelectedListingId(id);
  };

  const handleSearchArea = () => {
    console.log('Search this area clicked');
    // Implement search logic here
  };

  const handleSortChange = (sortBy: string) => {
    console.log('Sort changed to:', sortBy);
    // Implement sort logic here
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header isAuthenticated={false} />
      
      {/* Main Content - Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Mobile Sidebar Toggle Button - Positioned below search bar */}
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute top-20 left-4 z-[2000] bg-white shadow-lg hover:bg-gray-100"
          size="icon"
        >
          <List className="w-5 h-5" />
        </Button>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[1500]"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="md:hidden fixed inset-y-0 left-0 w-[85vw] max-w-sm z-[1600] bg-white shadow-xl">
              <MapSidebar
                searchQuery={searchQuery}
                resultCount={listings.length}
                radius={radius}
                listings={listings}
                onSortChange={handleSortChange}
                onListingClick={handleListingClick}
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>
          </>
        )}

        {/* Left Sidebar - Listings (Desktop) */}
        <div className="hidden md:flex md:w-1/3 lg:w-[400px] border-r border-gray-200 overflow-hidden">
          <MapSidebar
            searchQuery={searchQuery}
            resultCount={listings.length}
            radius={radius}
            listings={listings}
            onSortChange={handleSortChange}
            onListingClick={handleListingClick}
          />
        </div>

        {/* Right Side - Map */}
        <div className="flex-1 relative overflow-hidden h-full">
          <MapComponent
            center={mapCenter}
            zoom={13}
            listings={listings.map(listing => ({
              id: listing.id,
              position: listing.position,
              title: listing.title,
              price: listing.price
            }))}
            searchQuery={searchQuery}
            category={category}
            radius={radius}
            onSearchArea={handleSearchArea}
            onListingClick={handleListingClick}
          />
        </div>
      </div>
    </div>
  );
}
