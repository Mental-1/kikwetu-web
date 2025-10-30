'use client';

import { useState } from 'react';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import ImageGallery from '@/components/listings/ImageGallery';
import SellerInfo from '@/components/listings/SellerInfo';
import Specifications from '@/components/listings/Specifications';
import ItemLocation from '@/components/listings/ItemLocation';
import SafetyTips from '@/components/listings/SafetyTips';
import RelatedItems from '@/components/listings/RelatedItems';
import ContactModal from '@/components/listings/ContactModal';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ListingDetailsPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  // Mock data - replace with actual data fetching
  const listing = {
    id: 1,
    title: 'High-Performance Gaming Laptop',
    price: 'KES 185,000',
    condition: 'BRAND NEW',
    location: 'Nairobi, Kenya',
    description: 'Unleash your gaming potential with this brand new, top-of-the-line gaming laptop. Featuring the latest generation processor and a powerful dedicated graphics card, it delivers buttery-smooth frame rates in all the latest AAA titles. The stunning high-refresh-rate display brings your games to life with vibrant colors and incredible detail. With a sleek, portable design and customizable RGB keyboard, this laptop is perfect for gaming on the go or at home.',
    images: {
      main: '/placeholder-laptop-main.jpg',
      thumbnails: [
        '/placeholder-laptop-1.jpg',
        '/placeholder-laptop-2.jpg',
        '/placeholder-laptop-3.jpg'
      ]
    },
    seller: {
      id: 'jane-doe-123',
      name: 'Jane Doe',
      image: '/placeholder-avatar.jpg',
      rating: 5,
      reviewCount: 12,
      isVerified: true
    },
    specs: [
      { label: 'Processor', value: '12th Gen Intel Core i9-12900HX' },
      { label: 'Graphics', value: 'NVIDIA GeForce RTX 3080 Ti Laptop GPU' },
      { label: 'Memory', value: '32GB DDR5 RAM' },
      { label: 'Storage', value: '2TB NVMe PCIe Gen4 SSD' },
      { label: 'Display', value: '17.3-inch QHD (2560x1440) 240Hz, 3ms' },
      { label: 'Operating System', value: 'Windows 11 Home' }
    ]
  };

  const relatedItems = [
    {
      id: 2,
      title: 'Professional 4K Drone',
      description: 'High-quality drone with 4K camera capabilities.',
      price: 'KES 75,000',
      condition: 'NEW',
      location: 'Nairobi, KE',
      views: '189',
      image: '/placeholder-drone.jpg'
    },
    {
      id: 3,
      title: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit mechanical keyboard for gaming.',
      price: 'KES 12,000',
      condition: 'USED',
      location: 'Mombasa, KE',
      views: '234',
      image: '/placeholder-keyboard.jpg'
    },
    {
      id: 4,
      title: '34" Ultrawide Curved Monitor',
      description: 'Wide curved monitor perfect for gaming and productivity.',
      price: 'KES 55,000',
      condition: 'REFURBISHED',
      location: 'Kisumu, KE',
      views: '156',
      image: '/placeholder-monitor.jpg'
    },
    {
      id: 5,
      title: 'Virtual Reality Headset',
      description: 'High-end VR headset with controllers.',
      price: 'KES 48,000',
      condition: 'NEW',
      location: 'Nairobi, KE',
      views: '278',
      image: '/placeholder-vr.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={false} />
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <nav className="text-xs md:text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/listings" className="hover:text-gray-900">Electronics</Link>
            <span className="mx-2">/</span>
            <Link href="/listings" className="hover:text-gray-900">Laptops</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {/* Main Product Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <ImageGallery
              mainImage={listing.images.main}
              thumbnails={listing.images.thumbnails}
              onFavoriteClick={() => console.log('Favorite clicked')}
              onShareClick={() => console.log('Share clicked')}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Condition Badge */}
            <Badge className="bg-black text-white text-xs px-3 py-1">
              {listing.condition}
            </Badge>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {listing.title}
            </h1>

            {/* Price */}
            <p className="text-3xl md:text-4xl font-bold text-blue-600">
              {listing.price}
            </p>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{listing.location}</span>
            </div>

            {/* Seller Info */}
            <SellerInfo
              sellerId={listing.seller.id}
              sellerName={listing.seller.name}
              sellerImage={listing.seller.image}
              rating={listing.seller.rating}
              reviewCount={listing.seller.reviewCount}
              isVerified={listing.seller.isVerified}
              onContactClick={() => setIsContactModalOpen(true)}
              onDirectionsClick={() => console.log('Get directions clicked')}
              onFavoriteClick={() => console.log('Favorite clicked')}
              onShareClick={() => console.log('Share clicked')}
              onBookmarkClick={() => console.log('Bookmark clicked')}
            />
          </div>
        </div>

        {/* Description and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
          {/* Left Column - Description and Specs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Specifications */}
            <Specifications specs={listing.specs} />
          </div>

          {/* Right Column - Location and Safety */}
          <div className="lg:col-span-1 space-y-6">
            <ItemLocation location={listing.location} />
            <SafetyTips />
          </div>
        </div>

        {/* Related Items */}
        <div className="mt-12">
          <RelatedItems items={relatedItems} />
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        sellerName={listing.seller.name}
        email="jane.doe@example.com"
        phone="+254 712 345 678"
        whatsapp="+254 712 345 678"
        onEmailClick={() => console.log('Email clicked')}
        onPhoneClick={() => console.log('Phone clicked')}
        onWhatsAppClick={() => console.log('WhatsApp clicked')}
        onMessageClick={() => console.log('Message clicked')}
      />

      <Footer />
    </div>
  );
}
