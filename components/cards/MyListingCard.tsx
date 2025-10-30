'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MoreVertical, Edit, Trash2, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MyListingCardProps {
  id: number;
  title: string;
  description: string;
  price: string;
  condition: string;
  location: string;
  views: string;
  image: string;
  status: 'published' | 'draft' | 'expired' | 'sold';
  onDelete?: (id: number) => void;
  onRenew?: (id: number) => void;
}

export default function MyListingCard({
  id,
  title,
  description,
  price,
  condition,
  location,
  views,
  image,
  status,
  onDelete,
  onRenew,
}: MyListingCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const statusConfig = {
    published: { label: 'Published', color: 'bg-green-500', textColor: 'text-green-400' },
    draft: { label: 'Draft', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
    expired: { label: 'Expired', color: 'bg-red-500', textColor: 'text-red-400' },
    sold: { label: 'Sold', color: 'bg-gray-500', textColor: 'text-gray-400' },
  };

  const statusInfo = statusConfig[status];

  const handleDelete = () => {
    onDelete?.(id);
    setShowDeleteDialog(false);
  };

  const handleRenew = () => {
    onRenew?.(id);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
        <div className="relative aspect-square group">
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
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </Button>
          <div className="absolute top-2 left-2">
            <Badge className={`${statusInfo.color} ${statusInfo.textColor} border-0`}>
              {statusInfo.label}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3 bg-gray-800">
          {/* Title */}
          <h3 className="font-bold text-white mb-2 text-sm line-clamp-1">{title}</h3>
          
          {/* Description */}
          <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{description}</p>
          
          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-blue-400">{price}</span>
          </div>
          
          {/* Condition Badge */}
          <div className="mb-3">
            <Badge className="bg-black text-white text-xs px-2 py-1">{condition}</Badge>
          </div>
          
          {/* Location and Views */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span>{location}</span>
            <span>{views} views</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-xs"
            >
              <Link href={`/listings/${id}/edit`}>
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Link>
            </Button>
            {(status === 'expired' || status === 'published') && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRenew}
                className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Renew
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 w-40">
                <DropdownMenuItem
                  asChild
                  className="text-white hover:bg-gray-700 cursor-pointer"
                >
                  <Link href={`/listings/${id}`} className="flex items-center">
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-400 hover:bg-gray-700 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Listing</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

