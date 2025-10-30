'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Rocket, ChevronLeft, ChevronRight, MapPin, Tag, CheckCircle2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { showToast } from '@/utils/toast';
import { toast } from 'sonner';
import { usePostAdStore, useAuthStore } from '@/store';

// Category and condition mappings
const categories = [
  { 
    value: 'vehicles', 
    label: 'Vehicles', 
    subcategories: [
      { value: 'cars', label: 'Cars' },
      { value: 'motorcycles', label: 'Motorcycles' },
      { value: 'bicycles', label: 'Bicycles' },
      { value: 'trucks', label: 'Trucks & Vans' },
      { value: 'parts', label: 'Parts & Accessories' },
    ]
  },
  { 
    value: 'electronics', 
    label: 'Electronics', 
    subcategories: [
      { value: 'phones', label: 'Phones & Accessories' },
      { value: 'computers', label: 'Computers & Laptops' },
      { value: 'audio', label: 'Audio & Headphones' },
      { value: 'cameras', label: 'Cameras & Photography' },
      { value: 'gaming', label: 'Gaming Consoles' },
    ]
  },
  { 
    value: 'fashion', 
    label: 'Fashion', 
    subcategories: [
      { value: 'apparel', label: 'Apparel & Accessories' },
      { value: 'shoes', label: 'Shoes' },
      { value: 'bags', label: 'Bags & Luggage' },
      { value: 'jewelry', label: 'Jewelry & Watches' },
    ]
  },
  { 
    value: 'home-garden', 
    label: 'Home & Garden', 
    subcategories: [
      { value: 'furniture', label: 'Furniture' },
      { value: 'appliances', label: 'Appliances' },
      { value: 'decor', label: 'Home Decor' },
      { value: 'garden', label: 'Garden & Outdoor' },
    ]
  },
  { 
    value: 'sports', 
    label: 'Sports & Fitness', 
    subcategories: [
      { value: 'fitness', label: 'Fitness Equipment' },
      { value: 'outdoor', label: 'Outdoor Gear' },
      { value: 'sports-apparel', label: 'Sports Apparel' },
    ]
  },
];

const conditions = [
  { value: 'NEW', label: 'New' },
  { value: 'USED', label: 'Used' },
  { value: 'FOR_PARTS', label: 'For Parts' },
];

export default function PostAdPreviewPage() {
  const router = useRouter();
  const { formData, clearFormData } = usePostAdStore();
  const { user } = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Redirect if no form data
  useEffect(() => {
    if (!formData || !formData.title || !formData.mediaFiles || formData.mediaFiles.length === 0) {
      showToast.warning('Missing Information', 'Please complete all steps before previewing');
      router.push('/post-ad/details');
    }
  }, [formData, router]);

  // Get category and subcategory labels
  const categoryLabel = formData ? categories.find(c => c.value === formData.category)?.label || formData.category : '';
  const subcategoryLabel = formData?.subcategory 
    ? categories.find(c => c.value === formData.category)?.subcategories.find(s => s.value === formData.subcategory)?.label || formData.subcategory
    : '';
  const conditionLabel = formData ? conditions.find(c => c.value === formData.condition)?.label || formData.condition : '';

  // Get images from media files
  const images = formData?.mediaFiles?.map(file => file.url) || [];

  // Build specifications from form data
  const specifications: Record<string, string> = {};
  if (formData?.brand) {
    specifications.brand = formData.brand;
  }
  if (categoryLabel) {
    specifications.category = categoryLabel;
  }
  if (subcategoryLabel) {
    specifications.subcategory = subcategoryLabel;
  }

  if (!formData || !formData.title) {
    return null; // Will redirect in useEffect
  }

  const listingData = {
    title: formData.title,
    price: formData.price,
    currency: formData.currency,
    condition: conditionLabel,
    location: formData.location,
    tags: formData.tags,
    description: formData.description,
    specifications,
    seller: {
      name: user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'User',
      avatar: user?.avatar || '/placeholder-avatar.jpg',
      verified: user?.isVerified || false,
    },
    images: images.length > 0 ? images : ['/placeholder-laptop-1.jpg'],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listingData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listingData.images.length) % listingData.images.length);
  };

  const handlePublish = () => {
    if (!agreedToTerms) {
      showToast.warning('Terms Required', 'Please agree to the Terms of Service and Community Guidelines');
      return;
    }

    if (!formData) {
      showToast.error('No Data', 'Please complete the form before publishing');
      return;
    }

    const toastId = showToast.loading('Publishing ad...', 'Please wait while we publish your listing');

    // TODO: Submit to API with formData
    // const submitData = {
    //   ...formData,
    //   mediaFiles: formData.mediaFiles.map(f => f.file) // Convert to FormData for upload
    // };

    // Simulate API call
    setTimeout(() => {
      showToast.dismiss(toastId);
      showToast.success('Ad Published!', 'Your listing is now live');
      
      // Clear form data after successful publish
      clearFormData();
      
      router.push('/my-listings');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Breadcrumbs */}
        <nav className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/post-ad/details" className="hover:text-gray-900 transition-colors">
              Post Ad
            </Link>
            <span>/</span>
            <Link href="/post-ad/details" className="hover:text-gray-900 transition-colors">
              Details
            </Link>
            <span>/</span>
            <Link href="/post-ad/media" className="hover:text-gray-900 transition-colors">
              Photos
            </Link>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Preview</span>
          </div>
        </nav>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/post-ad/media')}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Almost there! Here&apos;s a preview of your listing.
          </h1>
          <p className="text-gray-600 text-lg">
            Review all the details below to make sure everything is perfect before your ad goes live.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Listing Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={listingData.images[currentImageIndex]}
                    alt={listingData.title}
                    fill
                    className="object-cover"
                  />
                  {/* Navigation Arrows */}
                  {listingData.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}
                  {/* Image Indicators */}
                  {listingData.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {listingData.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-blue-600 w-6' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{listingData.title}</h2>
                  <div className="text-2xl font-bold text-blue-600">
                    {listingData.currency} {listingData.price}
                  </div>
                </div>

                {/* Condition & Location */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm">{listingData.condition}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{listingData.location}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {listingData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-blue-100 text-blue-700 border-none px-3 py-1 text-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{listingData.description}</p>
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(listingData.specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 pb-2">
                        <span className="text-sm font-medium text-gray-600 capitalize">{key}:</span>
                        <span className="text-sm text-gray-900 ml-2">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seller Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Seller Information</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={listingData.seller.avatar} alt={listingData.seller.name} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {listingData.seller.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{listingData.seller.name}</span>
                        {listingData.seller.verified && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Verified Seller</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Promotion & Actions */}
          <div className="space-y-6">
            {/* Promotion Package */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Promotion Package</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">7-Day Featured Ad</span>
                    </div>
                    <span className="font-bold text-blue-600">KES 500.00</span>
                  </div>
                  <p className="text-sm text-gray-600">Boost your visibility</p>
                </div>
                <p className="text-sm text-gray-600">
                  Your ad will be featured on the homepage and at the top of search results for 7 days.
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                    onClick={() => router.push('/post-ad/details')}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Ad
                  </Button>
                  <Button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handlePublish}
                  >
                    Confirm and Post Ad
                  </Button>
                </div>

                {/* Terms Checkbox */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                      className="mt-1"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                    >
                      By publishing this ad, you agree to our{' '}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Community Guidelines
                      </Link>
                      .
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
