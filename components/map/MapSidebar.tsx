'use client';

import { useState } from 'react';
import MapListingCard from './MapListingCard';
import MapListViewCard from './MapListViewCard';
import MapSortDropdown from './MapSortDropdown';
import { LayoutGrid, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  condition: string;
  distance: string;
  views: string;
  image: string;
}

interface MapSidebarProps {
  searchQuery?: string;
  resultCount?: number;
  radius?: number;
  listings: Listing[];
  onSortChange?: (sortBy: string) => void;
  onViewToggle?: (view: 'grid' | 'list') => void;
  onListingClick?: (id: number) => void;
  onClose?: () => void;
}

export default function MapSidebar({
  searchQuery = 'vintage bicycle',
  resultCount = 25,
  radius = 10,
  listings,
  onSortChange,
  onViewToggle,
  onListingClick,
  onClose
}: MapSidebarProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const handleViewToggle = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    onViewToggle?.(mode);
  };

  const handleSortChange = (sortBy: string) => {
    onSortChange?.(sortBy);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Mobile Close Button */}
      {onClose && (
        <div className="p-4 border-b border-gray-200 flex items-center justify-between md:hidden">
          <h2 className="text-lg font-semibold">Listings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
      
      {/* Search Summary */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-sm font-bold text-gray-900 mb-1">
          {resultCount} results found within {radius}km
        </div>
        <div className="text-xs font-bold text-gray-700">
          Showing results for &apos;{searchQuery}&apos;
        </div>
      </div>

      {/* Sort and View Controls */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <MapSortDropdown onSortChange={handleSortChange} />
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleViewToggle('list')}
            className="w-8 h-8"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleViewToggle('grid')}
            className="w-8 h-8"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Listings */}
      <div className="flex-1 overflow-y-auto p-4">
        {listings.length > 0 ? (
          viewMode === 'list' ? (
            <div className="space-y-0">
              {listings.map((listing) => (
                <MapListViewCard
                  key={listing.id}
                  {...listing}
                  onClick={onListingClick}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {listings.map((listing) => (
                <MapListingCard
                  key={listing.id}
                  {...listing}
                  onClick={onListingClick}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center text-gray-500 py-12">
            No listings found
          </div>
        )}
      </div>
    </div>
  );
}

