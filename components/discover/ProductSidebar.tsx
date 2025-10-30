'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Star, MessageCircle, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ProductSidebarProps {
  sellerName: string;
  sellerId?: string;
  sellerAvatar?: string;
  sellerRating: number;
  productName: string;
  productPrice: string;
  condition: string;
  description: string;
  isFollowing?: boolean;
  onFollow?: () => void;
  onShopNow?: () => void;
  onContactSeller?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export default function ProductSidebar({
  sellerName,
  sellerId,
  sellerAvatar,
  sellerRating,
  productName,
  productPrice,
  condition,
  description,
  isFollowing = false,
  onFollow,
  onShopNow,
  onContactSeller,
  onSave,
  onShare
}: ProductSidebarProps) {
  const router = useRouter();
  const sellerProfileUrl = sellerId ? `/seller-profile/${sellerId}` : '#';
  const storeUrl = sellerId ? `/storefront/${sellerId}` : '#';

  const handleContactSeller = () => {
    onContactSeller?.();
    router.push('/conversations');
  };
  return (
    <div className="w-full md:w-80 lg:w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      {/* Seller Info */}
      <div className="flex items-center justify-between mb-6">
        <Link href={sellerProfileUrl} className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarImage src={sellerAvatar} alt={sellerName} />
            <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
              {sellerName}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">{sellerRating} Star Seller</span>
            </div>
          </div>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={onFollow}
          className={cn(
            'flex-shrink-0 ml-2',
            isFollowing ? 'bg-blue-50 border-blue-200 text-blue-600' : ''
          )}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>

      {/* Product Info */}
      <div className="space-y-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{productName}</h2>
        <div className="text-3xl font-bold text-blue-600">{productPrice}</div>
        <Badge className="bg-black text-white">{condition}</Badge>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleContactSeller}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact Seller
        </Button>
        <Button
          variant="outline"
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
          asChild
        >
          <Link href={storeUrl}>
            <Store className="w-4 h-4 mr-2" />
            Visit Store
          </Link>
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onSave}
          >
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}

