'use client';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Category {
  value: string;
  label: string;
  image: string;
  bgColor: string;
  subcategories: {
    value: string;
    label: string;
    icon?: string;
  }[];
}

const categoriesData: Category[] = [
  {
    value: 'electronics',
    label: 'Electronics',
    image: '/categories/electronics.jpg',
    bgColor: 'bg-blue-50',
    subcategories: [
      { value: 'phones', label: 'Phones & Accessories' },
      { value: 'computers', label: 'Computers & Laptops' },
      { value: 'audio', label: 'Audio & Headphones' },
      { value: 'cameras', label: 'Cameras & Photography' },
      { value: 'gaming', label: 'Gaming Consoles' },
      { value: 'tv', label: 'TV & Home Theater' },
      { value: 'smart-home', label: 'Smart Home Devices' },
    ],
  },
  {
    value: 'vehicles',
    label: 'Vehicles',
    image: '/categories/vehicles.jpg',
    bgColor: 'bg-green-50',
    subcategories: [
      { value: 'cars', label: 'Cars' },
      { value: 'motorcycles', label: 'Motorcycles' },
      { value: 'bicycles', label: 'Bicycles' },
      { value: 'trucks', label: 'Trucks & Vans' },
      { value: 'parts', label: 'Parts & Accessories' },
      { value: 'boats', label: 'Boats & Watercraft' },
      { value: 'rvs', label: 'RVs & Campers' },
    ],
  },
  {
    value: 'real-estate',
    label: 'Real Estate',
    image: '/categories/real-estate.jpg',
    bgColor: 'bg-yellow-50',
    subcategories: [
      { value: 'apartments', label: 'Apartments' },
      { value: 'houses', label: 'Houses' },
      { value: 'land', label: 'Land' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'rentals', label: 'Rentals' },
    ],
  },
  {
    value: 'home-garden',
    label: 'Home & Garden',
    image: '/categories/home-garden.jpg',
    bgColor: 'bg-green-50',
    subcategories: [
      { value: 'furniture', label: 'Furniture' },
      { value: 'appliances', label: 'Appliances' },
      { value: 'decor', label: 'Home Decor' },
      { value: 'garden', label: 'Garden & Outdoor' },
      { value: 'kitchen', label: 'Kitchen & Dining' },
      { value: 'bedroom', label: 'Bedroom' },
      { value: 'living-room', label: 'Living Room' },
    ],
  },
  {
    value: 'fashion',
    label: 'Fashion',
    image: '/categories/fashion.jpg',
    bgColor: 'bg-pink-50',
    subcategories: [
      { value: 'apparel', label: 'Apparel & Accessories' },
      { value: 'shoes', label: 'Shoes' },
      { value: 'bags', label: 'Bags & Luggage' },
      { value: 'jewelry', label: 'Jewelry & Watches' },
      { value: 'mens', label: "Men's Fashion" },
      { value: 'womens', label: "Women's Fashion" },
      { value: 'kids', label: "Kids' Fashion" },
    ],
  },
  {
    value: 'sports',
    label: 'Sports & Outdoors',
    image: '/categories/sports.jpg',
    bgColor: 'bg-blue-50',
    subcategories: [
      { value: 'fitness', label: 'Fitness Equipment' },
      { value: 'outdoor', label: 'Outdoor Gear' },
      { value: 'sports-apparel', label: 'Sports Apparel' },
      { value: 'water-sports', label: 'Water Sports' },
      { value: 'winter-sports', label: 'Winter Sports' },
      { value: 'team-sports', label: 'Team Sports Equipment' },
    ],
  },
];

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryName = params?.categoryName as string;

  // Find the category by matching the URL parameter
  const category = categoriesData.find(
    (cat) => cat.value.toLowerCase() === categoryName?.toLowerCase()
  );

  // If category not found, show error or redirect
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated={false} />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back to homepage
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubcategoryClick = (subcategoryValue: string) => {
    // Navigate to listings page with category and subcategory as query parameters
    router.push(`/listings?category=${category.value}&subcategory=${subcategoryValue}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={false} />

      <main className="container mx-auto px-4 py-6 md:py-8 flex-1">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">Categories</span>
            <span>/</span>
            <span className="text-gray-900">{category.label}</span>
          </div>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ${category.bgColor} flex items-center justify-center`}>
              <Image
                src={category.image}
                alt={category.label}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{category.label}</h1>
              <p className="text-gray-600 mt-1">
                Browse {category.subcategories.length} subcategories
              </p>
            </div>
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {category.subcategories.map((subcategory) => (
            <Card
              key={subcategory.value}
              onClick={() => handleSubcategoryClick(subcategory.value)}
              className="bg-white border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2">
                    {subcategory.label}
                  </h3>
                  <div className="flex items-center gap-1 text-blue-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Listings</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Browse All Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push(`/listings?category=${category.value}`)}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Browse all {category.label} listings
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

