'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface MapListViewCardProps {
  id: number;
  title: string;
  description: string;
  price: string;
  condition: string;
  distance: string;
  views: string;
  image: string;
  href?: string;
  onFavoriteClick?: (id: number) => void;
  onClick?: (id: number) => void;
}

export default function MapListViewCard({
  id,
  title,
  description,
  price,
  condition,
  distance,
  views,
  image,
  href = `/listings/${id}`,
  onFavoriteClick,
  onClick
}: MapListViewCardProps) {
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
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden mb-3">
        <div className="flex gap-2 md:gap-3 p-2 md:p-3">
          {/* Image */}
          <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 bg-white bg-opacity-90 hover:bg-opacity-100 w-6 h-6"
              onClick={handleFavoriteClick}
            >
              <Heart className="w-3 h-3 text-gray-600" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 py-0.5 pr-2 flex flex-col justify-between min-w-0">
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="text-xs md:text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                {title}
              </h3>
              
              {/* Price */}
              <p className="text-xs md:text-sm font-bold text-blue-600 mb-1">
                {price}
              </p>

              {/* Description */}
              <p className="text-[10px] md:text-xs text-gray-600 mb-1 line-clamp-2 leading-relaxed">
                {description}
              </p>

              {/* Condition Badge and Distance/Views */}
              <div className="flex items-center justify-between">
                <Badge className="bg-black text-white text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full">
                  {condition}
                </Badge>
                <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-gray-500">
                  <span className="truncate">{distance}</span>
                  <span className="flex-shrink-0">{views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

