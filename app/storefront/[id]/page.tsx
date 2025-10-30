'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/navigation/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Facebook, Twitter, Link as LinkIcon, Users, Star, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  condition: string;
  price: string;
  image: string;
}

export default function StorefrontPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [isFollowing, setIsFollowing] = useState(false);
  const itemsPerPage = 12;
  // Mock: Check if current user owns this store (in real app, check against auth user)
  const isOwner = false; // Set to true to see edit buttons

  // Mock store data
  const store = {
    name: 'The Gadget Grove',
    description: 'Your one-stop shop for modern electronics.',
    joinedYear: '2023',
    followers: 1200,
    reviews: { rating: 4.8, count: 152 },
    category: 'Electronics',
    social: {
      facebook: '#',
      twitter: '#',
      website: '#',
    },
    about: 'Welcome to The Gadget Grove, your ultimate destination for the latest and greatest in tech. From smartphones and laptops to drones and smart home devices, we\'re passionate about bringing you cutting-edge technology at competitive prices. We pride ourselves on excellent customer service and fast shipping.',
    logo: '/placeholder-logo.jpg',
    banner: '/placeholder-banner.jpg',
  };

  // Mock products matching the design
  const products: (Product & { likes: number })[] = [
    { id: '1', title: 'Aura Wireless Headphones', condition: 'Like New Condition', price: '$199.99', image: '/placeholder-headphones.jpg', likes: 45 },
    { id: '2', title: 'Chrono Smartwatch Series 5', condition: 'Gently Used', price: '$249.00', image: '/placeholder-smartwatch.jpg', likes: 123 },
    { id: '3', title: 'Sky-High 4K Drone', condition: 'Brand New in Box', price: '$450.00', image: '/placeholder-drone.jpg', likes: 89 },
    { id: '4', title: 'BeatBox Portable Speaker', condition: 'Open Box', price: '$75.50', image: '/placeholder-speaker.jpg', likes: 67 },
    { id: '5', title: 'ProBook 14" Laptop', condition: 'Used - Excellent', price: '$899.00', image: '/placeholder-laptop-1.jpg', likes: 234 },
    { id: '6', title: 'NextGen Gaming Controller', condition: 'Brand New', price: '$59.99', image: '/placeholder-controller.jpg', likes: 156 },
    { id: '7', title: 'Canvas Pro 11" Tablet', condition: 'Like New', price: '$650.00', image: '/placeholder-tablet.jpg', likes: 98 },
    { id: '8', title: 'Echo Buds Mini', condition: 'Gently Used', price: '$89.00', image: '/placeholder-earbuds.jpg', likes: 72 },
    // Add more products to match 32 total
    ...Array.from({ length: 24 }, (_, i) => ({
      id: `${i + 9}`,
      title: `Product ${i + 9}`,
      condition: ['Brand New', 'Like New', 'Gently Used', 'Open Box'][i % 4],
      price: `$${(Math.random() * 900 + 50).toFixed(2)}`,
      image: '/placeholder-laptop-1.jpg',
      likes: Math.floor(Math.random() * 200),
    })),
  ];

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isAuthenticated={false} />

      {/* Seller Profile Section */}
      <section className="relative bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 py-12 md:py-16 -mt-16 pt-24 md:pt-28">
        <div className="container mx-auto px-4">
          <Card className="bg-white border-gray-200 shadow-lg overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Store Logo */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-amber-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                    <div className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-200 rounded-full flex items-center justify-center mb-1">
                        <div className="text-amber-800 font-bold text-xs md:text-sm">TG</div>
                      </div>
                      <div className="text-[6px] md:text-[8px] font-bold text-gray-900 leading-tight">
                        THE GADGET<br />GROVE
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {store.name}
                      </h1>
                      <p className="text-gray-600 mb-2">{store.description}</p>
                      <p className="text-sm text-gray-500">Joined in {store.joinedYear}</p>

                      {/* Metrics */}
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            {store.followers.toLocaleString()} Followers
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-medium">
                            {store.reviews.rating} ({store.reviews.count}) Reviews
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-shrink-0">
                      <Button
                        onClick={handleFollow}
                        className={cn(
                          'bg-blue-600 hover:bg-blue-700 text-white px-6',
                          isFollowing && 'bg-gray-600 hover:bg-gray-700'
                        )}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      <Button
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6"
                        asChild
                      >
                        <Link href="/conversations">
                          Contact Seller
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* About Section */}
            <Card className="bg-white border-gray-200 mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About {store.name}</h2>
                <p className="text-gray-700 leading-relaxed">{store.about}</p>
              </CardContent>
            </Card>

            {/* All Listings Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                All Listings ({products.length})
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden md:inline">Sort by:</span>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[140px] bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                        <p className="text-xs text-gray-600 mb-2">{product.condition}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-blue-600">{product.price}</p>
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
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-300 text-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
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
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-gray-300 text-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Category</h3>
                <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-2 text-sm font-medium">
                  {store.category}
                </Badge>
              </CardContent>
            </Card>

            {/* Find us on */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Find us on</h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 border-gray-300 hover:bg-gray-50"
                    asChild
                  >
                    <Link href={store.social.facebook}>
                      <Facebook className="w-5 h-5 text-gray-600" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 border-gray-300 hover:bg-gray-50"
                    asChild
                  >
                    <Link href={store.social.twitter}>
                      <Twitter className="w-5 h-5 text-gray-600" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 border-gray-300 hover:bg-gray-50"
                    asChild
                  >
                    <Link href={store.social.website}>
                      <LinkIcon className="w-5 h-5 text-gray-600" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
