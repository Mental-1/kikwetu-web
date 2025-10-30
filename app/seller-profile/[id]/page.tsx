'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/navigation/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Send,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
  Edit,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  likes: number;
}

export default function SellerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const sellerId = params.id as string;
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');
  const [currentPage, setCurrentPage] = useState(3);
  const [isFollowing, setIsFollowing] = useState(false);
  const itemsPerPage = 6;
  
  // Mock: Check if current user is viewing their own profile
  const isOwner = false; // Set to true to see edit button

  // Mock seller data
  const seller = {
    id: sellerId,
    name: 'Elena Valor',
    tagline: 'Vintage finds & curated collectibles',
    avatar: '/placeholder-avatar.jpg',
    isVerified: true,
    followers: 1200,
    following: 150,
    likes: 5800,
    email: 'e.valor@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    memberSince: 'June 2021',
    responseTime: 'Responds within a few hours',
    about: 'Passionate about preserving history, one unique item at a time. I find joy in discovering vintage treasures and giving them a new home. Fast shipping and careful packaging are my promises.',
  };

  // Mock products - Use useMemo to prevent regeneration on every render
  const products: Product[] = [
    { id: '1', title: 'Vintage Analog Clock', price: '$45.00', image: '/placeholder-laptop-1.jpg', likes: 23 },
    { id: '2', title: 'Classic Runner Shoes', price: '$89.99', image: '/placeholder-laptop-2.jpg', likes: 67 },
    { id: '3', title: 'Noise-Cancelling Headph...', price: '$120.00', image: '/placeholder-laptop-3.jpg', likes: 45 },
    { id: '4', title: 'Minimalist Wristwatch', price: '$250.00', image: '/placeholder-laptop-1.jpg', likes: 89 },
    { id: '5', title: 'Modern Smart Watch', price: '$199.00', image: '/placeholder-laptop-2.jpg', likes: 124 },
    { id: '6', title: 'Leather Ankle Boots', price: '$155.00', image: '/placeholder-laptop-3.jpg', likes: 56 },
    // Fixed prices for additional products to prevent price changes on re-render
    { id: '7', title: 'Vintage Leather Jacket', price: '$175.00', image: '/placeholder-laptop-1.jpg', likes: 102 },
    { id: '8', title: 'Retro Sunglasses', price: '$65.00', image: '/placeholder-laptop-2.jpg', likes: 34 },
    { id: '9', title: 'Classic Backpack', price: '$95.00', image: '/placeholder-laptop-3.jpg', likes: 78 },
    { id: '10', title: 'Antique Mirror', price: '$135.00', image: '/placeholder-laptop-1.jpg', likes: 56 },
    { id: '11', title: 'Vintage Camera', price: '$220.00', image: '/placeholder-laptop-2.jpg', likes: 145 },
    { id: '12', title: 'Classic Vinyl Record', price: '$35.00', image: '/placeholder-laptop-3.jpg', likes: 29 },
    { id: '13', title: 'Retro Radio', price: '$85.00', image: '/placeholder-laptop-1.jpg', likes: 91 },
    { id: '14', title: 'Vintage Typewriter', price: '$165.00', image: '/placeholder-laptop-2.jpg', likes: 123 },
    { id: '15', title: 'Classic Watch', price: '$275.00', image: '/placeholder-laptop-3.jpg', likes: 167 },
    { id: '16', title: 'Antique Lamp', price: '$110.00', image: '/placeholder-laptop-1.jpg', likes: 58 },
    { id: '17', title: 'Vintage Phone', price: '$75.00', image: '/placeholder-laptop-2.jpg', likes: 42 },
    { id: '18', title: 'Classic Glasses', price: '$95.00', image: '/placeholder-laptop-3.jpg', likes: 89 },
    { id: '19', title: 'Retro Calculator', price: '$45.00', image: '/placeholder-laptop-1.jpg', likes: 67 },
    { id: '20', title: 'Vintage Wallet', price: '$55.00', image: '/placeholder-laptop-2.jpg', likes: 53 },
    { id: '21', title: 'Classic Belt', price: '$40.00', image: '/placeholder-laptop-3.jpg', likes: 38 },
    { id: '22', title: 'Antique Frame', price: '$30.00', image: '/placeholder-laptop-1.jpg', likes: 44 },
    { id: '23', title: 'Vintage Keychain', price: '$25.00', image: '/placeholder-laptop-2.jpg', likes: 31 },
    { id: '24', title: 'Classic Pen', price: '$50.00', image: '/placeholder-laptop-3.jpg', likes: 76 },
  ];

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={false} />

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Left Sidebar - Seller Information */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                {/* Profile Header */}
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={seller.avatar} alt={seller.name} />
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-2xl">
                      {seller.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h1 className="text-xl font-bold text-gray-900">{seller.name}</h1>
                    {seller.isVerified && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{seller.tagline}</p>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      asChild
                    >
                      <Link href="/conversations">
                        <Send className="w-4 h-4 mr-2" />
                        Send Private Message
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full border-gray-300',
                        isFollowing
                          ? 'bg-blue-50 border-blue-200 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                      onClick={handleFollow}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{seller.followers.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{seller.following}</p>
                    <p className="text-xs text-gray-600">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{seller.likes.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Likes</p>
                  </div>
                </div>

                {/* About Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{seller.about}</p>
                </div>

                {/* Contact and Details */}
                <div className="space-y-3 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 break-all">{seller.email}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{seller.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{seller.location}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Member since {seller.memberSince}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{seller.responseTime}</span>
                  </div>
                </div>

                {/* Visit Store Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    asChild
                  >
                    <Link href={`/storefront/${seller.id}`}>
                      View Store
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Active Listings */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'listings' | 'reviews')}>
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-gray-100 border border-gray-200">
                  <TabsTrigger value="listings" className="data-[state=active]:bg-white">
                    Active Listings ({products.length})
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-white">
                    Reviews (215)
                  </TabsTrigger>
                </TabsList>

                {activeTab === 'listings' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 hidden md:inline">Sort by:</span>
                    <Select defaultValue="most-recent">
                      <SelectTrigger className="w-[160px] bg-white border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="most-recent">Most Recent</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="most-liked">Most Liked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <TabsContent value="listings" className="mt-0">
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="relative">
                      <Link href={`/listings/${product.id}`}>
                        <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                          <div className="relative aspect-square">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="bg-white bg-opacity-90 hover:bg-opacity-100 w-8 h-8"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                <Heart className="w-4 h-4 text-gray-600" />
                              </Button>
                              {isOwner && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="bg-white bg-opacity-90 hover:bg-opacity-100 w-8 h-8"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.push(`/listings/${product.id}/edit`);
                                  }}
                                >
                                  <Edit className="w-4 h-4 text-blue-600" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
                              {product.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <p className="text-base font-bold text-blue-600">{product.price}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Heart className="w-3 h-3" />
                                <span>{product.likes}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            currentPage === pageNum
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}

                    {currentPage < totalPages - 2 && totalPages > 5 && (
                      <span className="text-gray-500 px-2">...</span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(totalPages)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        {totalPages}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-center py-12">
                      Reviews section will be implemented here
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

