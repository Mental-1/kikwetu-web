'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSidebarProps {
  onFiltersChange?: (filters: FilterState) => void;
  className?: string;
}

interface FilterState {
  priceRange: [number, number];
  category: string;
  condition: string[];
  location: string;
  brand: string[];
  distance: number;
}

export default function FilterSidebar({ onFiltersChange, className }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: false,
    condition: false,
    location: false,
    brand: false,
    distance: false
  });

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [6500, 200000],
    category: '',
    condition: [],
    location: '',
    brand: [],
    distance: 50
  });

  // Debounce timers
  const priceDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const distanceDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (priceDebounceRef.current) {
        clearTimeout(priceDebounceRef.current);
      }
      if (distanceDebounceRef.current) {
        clearTimeout(distanceDebounceRef.current);
      }
    };
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = useCallback((value: number[]) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, priceRange: value as [number, number] };

      // Clear existing timeout
      if (priceDebounceRef.current) {
        clearTimeout(priceDebounceRef.current);
      }

      // Set new timeout for debounced callback
      priceDebounceRef.current = setTimeout(() => {
        onFiltersChange?.(newFilters);
      }, 300);

      return newFilters;
    });
  }, [onFiltersChange]);

  const handleConditionChange = (condition: string) => {
    const newConditions = filters.condition.includes(condition)
      ? filters.condition.filter(c => c !== condition)
      : [...filters.condition, condition];
    
    const newFilters = { ...filters, condition: newConditions };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brand.includes(brand)
      ? filters.brand.filter(b => b !== brand)
      : [...filters.brand, brand];
    
    const newFilters = { ...filters, brand: newBrands };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleDistanceChange = useCallback((value: number[]) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, distance: value[0] };

      // Clear existing timeout
      if (distanceDebounceRef.current) {
        clearTimeout(distanceDebounceRef.current);
      }

      // Set new timeout for debounced callback
      distanceDebounceRef.current = setTimeout(() => {
        onFiltersChange?.(newFilters);
      }, 300);

      return newFilters;
    });
  }, [onFiltersChange]);

  const clearAllFilters = () => {
    // Clear any pending debounced callbacks
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
      priceDebounceRef.current = null;
    }
    if (distanceDebounceRef.current) {
      clearTimeout(distanceDebounceRef.current);
      distanceDebounceRef.current = null;
    }

    const clearedFilters: FilterState = {
      priceRange: [6500, 200000] as [number, number],
      category: '',
      condition: [],
      location: '',
      brand: [],
      distance: 50
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const formatPrice = (price: number) => {
    if (price >= 200000) return 'KES 200,000+';
    return `KES ${price.toLocaleString()}`;
  };

  return (
    <Card className={`w-80 flex-shrink-0 ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Price
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.price && (
            <div className="space-y-4">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                max={200000}
                min={6500}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Category
            {expandedSections.category ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Electronics</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Fashion</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Home & Garden</span>
              </label>
            </div>
          )}
        </div>

        {/* Condition */}
        <div>
          <button
            onClick={() => toggleSection('condition')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Condition
            {expandedSections.condition ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.condition && (
            <div className="space-y-2">
              {['NEW', 'USED', 'REFURBISHED'].map((condition) => (
                <label key={condition} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.condition.includes(condition)}
                    onChange={() => handleConditionChange(condition)}
                    className="rounded"
                  />
                  <span className="text-sm">{condition}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <button
            onClick={() => toggleSection('location')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Location
            {expandedSections.location ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.location && (
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Nairobi</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Mombasa</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Kisumu</span>
              </label>
            </div>
          )}
        </div>

        {/* Brand */}
        <div>
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Brand
            {expandedSections.brand ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.brand && (
            <div className="space-y-2">
              {['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Razer', 'Microsoft'].map((brand) => (
                <label key={brand} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="rounded"
                  />
                  <span className="text-sm">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Distance */}
        <div>
          <button
            onClick={() => toggleSection('distance')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            Distance
            {expandedSections.distance ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.distance && (
            <div className="space-y-4">
              <Slider
                value={[filters.distance]}
                onValueChange={handleDistanceChange}
                max={100}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                Within {filters.distance} km
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
