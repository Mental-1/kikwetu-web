'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface MapListingCardProps {
  id: number;
  title: string;
  price: string;
  condition: string;
  distance: string; // e.g., "1.2 km away"
  image: string;
  href?: string;
  onFavoriteClick?: (id: number) => void;
  onClick?: (id: number) => void; // For highlighting on map
}

export default function MapListingCard({
  id,
  title,
  price,
  condition,
  distance,
  image,
  href = `/listings/${id}`,
  onFavoriteClick,
  onClick
}: MapListingCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteClick?.(id);
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  return (
    <Link href={href} onClick={handleCardClick}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow mb-3 cursor-pointer">
        <div className="relative aspect-video">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 w-8 h-8"
            onClick={handleFavoriteClick}
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
        <CardContent className="p-3">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">{title}</h3>
          
          {/* Condition Badge and Distance */}
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-black text-white text-xs px-2 py-1">{condition}</Badge>
            <span className="text-xs text-gray-600">{distance}</span>
          </div>
          
          {/* Price */}
          <div>
            <span className="text-base font-bold text-blue-600">{price}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

