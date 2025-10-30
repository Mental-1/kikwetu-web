'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface VideoCardProps {
  thumbnail: string;
  title: string;
  href?: string;
}

export default function VideoCard({ thumbnail, title, href = '#' }: VideoCardProps) {
  return (
    <Card className="flex-shrink-0 w-56 md:w-64 lg:w-72 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer snap-start">
      <div className="relative aspect-[9/16]">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <Play className="w-5 h-5 text-gray-900 ml-1" />
          </div>
        </div>
      </div>
      <CardContent className="px-4 py-2">
        <h3 className="font-medium text-gray-900 text-xs md:text-sm line-clamp-2">{title}</h3>
      </CardContent>
    </Card>
  );
}
