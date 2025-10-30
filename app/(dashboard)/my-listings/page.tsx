'use client';

import { useState } from 'react';
import Header from '@/components/navigation/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MyListingCard from '@/components/cards/MyListingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();

  const listings = [
    {
      id: 1,
      title: 'Vintage Leather Jacket',
      description: 'Authentic vintage leather jacket in excellent condition. Perfect fit for the modern urban look.',
      price: 'KES 12,000',
      condition: 'USED',
      location: 'Nairobi, KE',
      views: '2,105',
      image: '/placeholder-laptop-1.jpg',
      status: 'published' as const,
    },
    {
      id: 2,
      title: 'Antique Wooden Chair',
      description: 'Beautiful antique wooden chair with intricate carvings. Perfect for collectors.',
      price: 'KES 7,550',
      condition: 'USED',
      location: 'Mombasa, KE',
      views: '1,842',
      image: '/placeholder-laptop-2.jpg',
      status: 'published' as const,
    },
    {
      id: 3,
      title: 'Modern Art Print',
      description: 'Contemporary art print in vibrant colors. Perfect for modern home decor.',
      price: 'KES 4,999',
      condition: 'NEW',
      location: 'Nairobi, KE',
      views: '1,503',
      image: '/placeholder-laptop-3.jpg',
      status: 'sold' as const,
    },
    {
      id: 4,
      title: 'Handmade Ceramic Vase',
      description: 'Unique handmade ceramic vase with beautiful glaze finish.',
      price: 'KES 6,000',
      condition: 'USED',
      location: 'Kisumu, KE',
      views: '987',
      image: '/placeholder-laptop-4.jpg',
      status: 'published' as const,
    },
    {
      id: 5,
      title: 'Designer Sunglasses',
      description: 'Brand new designer sunglasses with UV protection and stylish frame.',
      price: 'KES 8,500',
      condition: 'NEW',
      location: 'Nairobi, KE',
      views: '756',
      image: '/placeholder-laptop-5.jpg',
      status: 'expired' as const,
    },
    {
      id: 6,
      title: 'Vintage Camera',
      description: 'Classic film camera in working condition. Great for photography enthusiasts.',
      price: 'KES 15,000',
      condition: 'USED',
      location: 'Nakuru, KE',
      views: '543',
      image: '/placeholder-laptop-6.jpg',
      status: 'draft' as const,
    },
  ];

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    // TODO: Implement delete API call
    console.log('Delete listing:', id);
    // After successful deletion, you might want to refetch listings or remove from state
  };

  const handleRenew = (id: number) => {
    // TODO: Implement renew API call
    console.log('Renew listing:', id);
    // Renew should extend the listing's expiration date
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header isAuthenticated={true} />
      
      <div className="flex relative">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden fixed top-20 left-4 z-30 bg-gray-800 text-white hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Sidebar */}
        <DashboardSidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 lg:ml-0">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold text-white">My Listings</h1>
            <div className="flex gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
              <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/post-ad/details">
                  <Plus className="w-4 h-4 mr-2" />
                  New Listing
                </Link>
              </Button>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredListings.map((listing) => (
                <MyListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  description={listing.description}
                  price={listing.price}
                  condition={listing.condition}
                  location={listing.location}
                  views={listing.views}
                  image={listing.image}
                  status={listing.status}
                  onDelete={handleDelete}
                  onRenew={handleRenew}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400 mb-4">No listings found</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/post-ad/details">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Listing
                </Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
