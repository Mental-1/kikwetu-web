'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ListViewCardProps {
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

export default function ListViewCard({
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
}: ListViewCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteClick?.(id);
  };

  return (
    <Link href={href}>
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden mb-4 md:mb-6">
        <div className="flex gap-3 md:gap-6 p-2 md:p-6">
          {/* Image */}
          <div className="relative w-32 h-32 md:w-64 md:h-48 flex-shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 md:top-3 md:right-3 bg-white bg-opacity-90 hover:bg-opacity-100 w-6 h-6 md:w-10 md:h-10"
              onClick={handleFavoriteClick}
            >
              <Heart className="w-3 h-3 md:w-5 md:h-5 text-gray-600" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 py-1 md:py-4 pr-2 md:pr-4 flex flex-col md:flex-row md:items-start md:justify-between min-w-0">
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="text-xs md:text-xl font-bold text-gray-900 line-clamp-1 mb-1 md:mb-2">
                {title}
              </h3>
              
              {/* Price - Below title on mobile */}
              <p className="text-sm font-bold text-blue-600 mb-1 md:hidden">
                {price}
              </p>

              {/* Description */}
              <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-3 line-clamp-2 md:line-clamp-3 leading-relaxed">
                {description}
              </p>

              {/* Condition Badge */}
              <div className="mb-1 md:mb-3">
                <Badge className="bg-black text-white text-[10px] md:text-xs px-1.5 md:px-3 py-0.5 md:py-1 rounded-full">
                  {condition}
                </Badge>
              </div>

              {/* Location and Views */}
              <div className="flex items-center justify-between text-[10px] md:text-sm text-gray-500 mt-auto">
                <span className="truncate">{location}</span>
                <span className="ml-2 flex-shrink-0">{views} views</span>
              </div>
            </div>

            {/* Desktop Price - Right side */}
            <div className="hidden md:flex flex-shrink-0 ml-4">
              <p className="text-2xl font-bold text-blue-600">
                {price}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
