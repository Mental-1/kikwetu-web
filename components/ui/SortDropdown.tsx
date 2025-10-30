'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface SortDropdownProps {
  onSortChange?: (sortBy: string) => void;
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'relevance', label: 'Most Relevant' }
];

export default function SortDropdown({ onSortChange }: SortDropdownProps) {
  const [selectedSort, setSelectedSort] = useState('newest');

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    onSortChange?.(value);
  };

  const selectedOption = sortOptions.find(option => option.value === selectedSort);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {selectedOption?.label}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={selectedSort === option.value ? 'bg-blue-50 text-blue-600' : ''}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
