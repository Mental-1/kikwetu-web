'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Navigation, Heart, Share2, Bookmark, Store } from 'lucide-react';
import { Star } from 'lucide-react';

interface SellerInfoProps {
  sellerName: string;
  sellerId?: string;
  sellerImage?: string;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  onContactClick?: () => void;
  onDirectionsClick?: () => void;
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
  onBookmarkClick?: () => void;
}

export default function SellerInfo({
  sellerName,
  sellerId,
  sellerImage,
  rating = 5,
  reviewCount = 12,
  isVerified = true,
  onContactClick,
  onDirectionsClick,
  onFavoriteClick,
  onShareClick,
  onBookmarkClick
}: SellerInfoProps) {
  // Generate seller profile URL
  const sellerProfileUrl = sellerId ? `/seller-profile/${sellerId}` : '#';
  return (
    <div className="space-y-6">
      {/* Seller Profile */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={sellerImage} alt={sellerName} />
          <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link href={sellerProfileUrl}>
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                {sellerName}
              </h3>
            </Link>
            {isVerified && (
              <Badge className="bg-green-500 text-white text-xs px-2 py-0.5 flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-white"></span>
                Verified Seller
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({reviewCount} Reviews)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onContactClick}
          >
            <Phone className="w-4 h-4 mr-2" />
            Contact Seller
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={onDirectionsClick}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
          asChild
        >
          <Link href={sellerProfileUrl}>
            <Store className="w-4 h-4 mr-2" />
            Visit Seller Profile
          </Link>
        </Button>
        
        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onBookmarkClick}
            className="flex-1"
          >
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onFavoriteClick}
            className="flex-1"
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onShareClick}
            className="flex-1"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
