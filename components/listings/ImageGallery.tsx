'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  mainImage: string;
  thumbnails: string[];
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
}

export default function ImageGallery({ 
  mainImage, 
  thumbnails, 
  onFavoriteClick,
  onShareClick 
}: ImageGalleryProps) {
  const allImages = [mainImage, ...thumbnails];
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedImage = allImages[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square md:aspect-video bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={selectedImage}
          alt="Product"
          fill
          className="object-cover"
        />
        
        {/* Navigation Chevrons */}
        {allImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 opacity-100 transition-opacity w-10 h-10 md:w-12 md:h-12"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 opacity-100 transition-opacity w-10 h-10 md:w-12 md:h-12"
              onClick={goToNext}
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
            onClick={onFavoriteClick}
          >
            <Heart className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
            onClick={onShareClick}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Image Count Pill */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {currentIndex + 1}/{allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {thumbnails.length > 0 && (
        <div className="grid grid-cols-4 gap-2 max-w-md md:max-w-sm mx-auto md:mx-0">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index 
                  ? 'border-blue-600' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
