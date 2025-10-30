'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ListingCardProps {
  id: number;
  title: string;
  description: string;
  price: string;
  condition: string;
  location: string;
  views: string;
  image: string;
  href?: string;
  onFavoriteClick?: (id: number) => void;
}

export default function ListingCard({
  id,
  title,
  description,
  price,
  condition,
  location,
  views,
  image,
  href = `/listings/${id}`,
  onFavoriteClick
}: ListingCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteClick?.(id);
  };

  return (
    <Link href={href}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square">
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
            <Heart className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
        <CardContent className="p-3">
          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-2 text-sm line-clamp-1">{title}</h3>
          
          {/* Description */}
          <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">{description}</p>
          
          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-blue-600">{price}</span>
          </div>
          
          {/* Condition Badge */}
          <div className="mb-3">
            <Badge className="bg-black text-white text-xs px-2 py-1">{condition}</Badge>
          </div>
          
          {/* Location and Views */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{location}</span>
            <span>{views} views</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
