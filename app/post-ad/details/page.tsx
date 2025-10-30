'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/navigation/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bold, Italic, List, ListOrdered, ArrowLeft, MapPin, X, Loader2 } from 'lucide-react';
import { showToast } from '@/utils/toast';
import { usePostAdStore } from '@/store';

// Constants for validation
const TITLE_MIN_LENGTH = 10;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MIN_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 2000;
const MIN_PRICE = 0;

export default function PostAdDetailsPage() {
  const router = useRouter();
  const { formData: storeData, updateDetails, setCurrentStep } = usePostAdStore();
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState({
    title: storeData?.title || '',
    category: storeData?.category || '',
    subcategory: storeData?.subcategory || '',
    condition: storeData?.condition || 'USED',
    price: storeData?.price || '',
    currency: storeData?.currency || 'KES',
    description: storeData?.description || '',
    location: storeData?.location || '',
    tags: storeData?.tags || [],
    brand: storeData?.brand || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update local state when store data changes (e.g., on mount)
  useEffect(() => {
    if (storeData) {
      setFormData({
        title: storeData.title || '',
        category: storeData.category || '',
        subcategory: storeData.subcategory || '',
        condition: storeData.condition || 'USED',
        price: storeData.price || '',
        currency: storeData.currency || 'KES',
        description: storeData.description || '',
        location: storeData.location || '',
        tags: storeData.tags || [],
        brand: storeData.brand || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount - we intentionally don't want to re-run when storeData changes

  const categories = [
    { 
      value: 'vehicles', 
      label: 'Vehicles', 
      subcategories: [
        { value: 'cars', label: 'Cars' },
        { value: 'motorcycles', label: 'Motorcycles' },
        { value: 'bicycles', label: 'Bicycles' },
        { value: 'trucks', label: 'Trucks & Vans' },
        { value: 'parts', label: 'Parts & Accessories' },
      ]
    },
    { 
      value: 'electronics', 
      label: 'Electronics', 
      subcategories: [
        { value: 'phones', label: 'Phones & Accessories' },
        { value: 'computers', label: 'Computers & Laptops' },
        { value: 'audio', label: 'Audio & Headphones' },
        { value: 'cameras', label: 'Cameras & Photography' },
        { value: 'gaming', label: 'Gaming Consoles' },
      ]
    },
    { 
      value: 'fashion', 
      label: 'Fashion', 
      subcategories: [
        { value: 'apparel', label: 'Apparel & Accessories' },
        { value: 'shoes', label: 'Shoes' },
        { value: 'bags', label: 'Bags & Luggage' },
        { value: 'jewelry', label: 'Jewelry & Watches' },
      ]
    },
    { 
      value: 'home-garden', 
      label: 'Home & Garden', 
      subcategories: [
        { value: 'furniture', label: 'Furniture' },
        { value: 'appliances', label: 'Appliances' },
        { value: 'decor', label: 'Home Decor' },
        { value: 'garden', label: 'Garden & Outdoor' },
      ]
    },
    { 
      value: 'sports', 
      label: 'Sports & Fitness', 
      subcategories: [
        { value: 'fitness', label: 'Fitness Equipment' },
        { value: 'outdoor', label: 'Outdoor Gear' },
        { value: 'sports-apparel', label: 'Sports Apparel' },
      ]
    },
  ];

  const conditions = [
    { value: 'NEW', label: 'New' },
    { value: 'USED', label: 'Used' },
    { value: 'FOR_PARTS', label: 'For Parts' },
  ];

  const currentCategory = categories.find((cat) => cat.value === formData.category);
  const availableSubcategories = currentCategory?.subcategories || [];

  const formatPrice = (value: string): string => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    
    // Format with locale
    const number = parseInt(numericValue, 10);
    return number.toLocaleString('en-KE');
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (field === 'category') {
      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: '', // Reset subcategory when category changes
      }));
    } else if (field === 'price') {
      const formatted = formatPrice(value);
      setFormData((prev) => ({
        ...prev,
        price: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast.error('Geolocation not supported', 'Your browser does not support location detection');
      return;
    }

    setIsDetectingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocoding to get location name
          // Using a free reverse geocoding API (Nominatim)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          const data = await response.json();
          
          // Extract city/town name
          const city = data.address?.city || 
                      data.address?.town || 
                      data.address?.village || 
                      data.address?.county || 
                      'Unknown Location';
          
          setFormData((prev) => ({
            ...prev,
            location: city,
          }));
          
          showToast.success('Location detected', `Found: ${city}`);
        } catch {
          showToast.error('Failed to detect location', 'Could not retrieve location details');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        showToast.error('Location detection failed', error.message || 'Please enable location permissions');
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    // Remove # if user added it, we'll add it back on display
    const tagWithoutHash = trimmedTag.startsWith('#') ? trimmedTag.slice(1) : trimmedTag;
    
    if (formData.tags.includes(tagWithoutHash)) {
      showToast.warning('Tag already exists', 'This tag has already been added');
      return;
    }

    if (formData.tags.length >= 10) {
      showToast.warning('Maximum tags reached', 'You can only add up to 10 tags');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tagWithoutHash],
    }));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < TITLE_MIN_LENGTH) {
      newErrors.title = `Title must be at least ${TITLE_MIN_LENGTH} characters`;
    } else if (formData.title.length > TITLE_MAX_LENGTH) {
      newErrors.title = `Title must not exceed ${TITLE_MAX_LENGTH} characters`;
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < DESCRIPTION_MIN_LENGTH) {
      newErrors.description = `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters`;
    } else if (formData.description.length > DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters`;
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Subcategory validation (if category has subcategories)
    if (availableSubcategories.length > 0 && !formData.subcategory) {
      newErrors.subcategory = 'Subcategory is required';
    }

    // Price validation
    const numericPrice = parseFloat(formData.price.replace(/,/g, ''));
    if (!formData.price || isNaN(numericPrice)) {
      newErrors.price = 'Valid price is required';
    } else if (numericPrice < MIN_PRICE) {
      newErrors.price = `Price cannot be negative`;
    } else if (numericPrice === 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast.error('Validation failed', 'Please fix the errors in the form');
      return;
    }

    // Save form data to store
    updateDetails({
      title: formData.title,
      category: formData.category,
      subcategory: formData.subcategory,
      condition: formData.condition,
      price: formData.price,
      currency: formData.currency,
      description: formData.description,
      location: formData.location,
      tags: formData.tags,
      brand: formData.brand,
    });
    
    setCurrentStep('media');
    router.push('/post-ad/media');
  };

  const titleCharCount = formData.title.length;
  const descriptionCharCount = formData.description.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/post-ad/details" className="text-blue-600 font-semibold">
              Post Ad
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">Details</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">Photos</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">Preview</span>
          </div>
        </nav>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Post Your Ad</h1>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-8">
              {/* Section Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tell us about your item.</h2>

              <div className="space-y-6">
                {/* Ad Title */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="title" className="text-gray-900 font-semibold text-base">
                      Ad Title
                    </Label>
                    <span className={`text-xs ${titleCharCount > TITLE_MAX_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                      {titleCharCount}/{TITLE_MAX_LENGTH}
                    </span>
                  </div>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Well-maintained 2015 Toyota Vitz."
                    className={`bg-white border-gray-300 text-gray-900 ${errors.title ? 'border-red-500' : ''}`}
                    maxLength={TITLE_MAX_LENGTH}
                    required
                  />
                  {titleCharCount < TITLE_MIN_LENGTH && titleCharCount > 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      At least {TITLE_MIN_LENGTH - titleCharCount} more characters needed
                    </p>
                  )}
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Category and Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-gray-900 mb-2 block font-semibold text-base">
                      Category
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger className={`bg-white border-gray-300 text-gray-900 ${errors.category ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                    )}
                  </div>
                  {availableSubcategories.length > 0 && (
                    <div>
                      <Label htmlFor="subcategory" className="text-gray-900 mb-2 block font-semibold text-base">
                        Subcategory
                      </Label>
                      <Select
                        value={formData.subcategory}
                        onValueChange={(value) => handleInputChange('subcategory', value)}
                      >
                        <SelectTrigger className={`bg-white border-gray-300 text-gray-900 ${errors.subcategory ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {availableSubcategories.map((sub) => (
                            <SelectItem key={sub.value} value={sub.value}>
                              {sub.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.subcategory && (
                        <p className="text-xs text-red-500 mt-1">{errors.subcategory}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Condition - Pill Buttons */}
                <div>
                  <Label className="text-gray-900 mb-3 block font-semibold text-base">
                    Condition
                  </Label>
                  <div className="flex gap-3">
                    {conditions.map((cond) => (
                      <button
                        key={cond.value}
                        type="button"
                        onClick={() => handleInputChange('condition', cond.value)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                          formData.condition === cond.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cond.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <Label htmlFor="price" className="text-gray-900 mb-2 block font-semibold text-base">
                    Price
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                      KES
                    </span>
                    <Input
                      id="price"
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="e.g., 1,200,000"
                      className={`bg-white border-gray-300 text-gray-900 pl-16 ${errors.price ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>

                {/* Location with Detect Button */}
                <div>
                  <Label htmlFor="location" className="text-gray-900 mb-2 block font-semibold text-base">
                    Location
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Nairobi, Kenya"
                      className={`flex-1 bg-white border-gray-300 text-gray-900 ${errors.location ? 'border-red-500' : ''}`}
                      required
                    />
                    <Button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isDetectingLocation}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isDetectingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">Detect</span>
                    </Button>
                  </div>
                  {errors.location && (
                    <p className="text-xs text-red-500 mt-1">{errors.location}</p>
                  )}
                </div>

                {/* Brand (Optional) */}
                <div>
                  <Label htmlFor="brand" className="text-gray-900 mb-2 block font-semibold text-base">
                    Brand <span className="text-gray-500 font-normal text-sm">(Optional)</span>
                  </Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="e.g., Toyota, Samsung, Nike"
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-gray-900 mb-2 block font-semibold text-base">
                    Tags <span className="text-gray-500 font-normal text-sm">(Optional)</span>
                  </Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add a tag (e.g., vintage, luxury, fast)"
                      className="flex-1 bg-white border-gray-300 text-gray-900"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      Add
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 px-3 py-1"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Add up to 10 tags to help buyers find your item
                  </p>
                </div>

                {/* Description with Rich Text Toolbar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="description" className="text-gray-900 font-semibold text-base">
                      Description
                    </Label>
                    <span className={`text-xs ${descriptionCharCount > DESCRIPTION_MAX_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                      {descriptionCharCount}/{DESCRIPTION_MAX_LENGTH}
                    </span>
                  </div>
                  {/* Rich Text Toolbar */}
                  <div className="flex items-center gap-2 p-2 border-b border-gray-300 bg-gray-50 rounded-t-lg">
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Bold"
                      onClick={(e) => {
                        e.preventDefault();
                        document.execCommand('bold', false);
                      }}
                    >
                      <Bold className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Italic"
                      onClick={(e) => {
                        e.preventDefault();
                        document.execCommand('italic', false);
                      }}
                    >
                      <Italic className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Unordered List"
                      onClick={(e) => {
                        e.preventDefault();
                        document.execCommand('insertUnorderedList', false);
                      }}
                    >
                      <List className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Ordered List"
                      onClick={(e) => {
                        e.preventDefault();
                        document.execCommand('insertOrderedList', false);
                      }}
                    >
                      <ListOrdered className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your item in detail..."
                    rows={8}
                    className={`bg-white border-gray-300 text-gray-900 resize-none rounded-t-none ${errors.description ? 'border-red-500' : ''}`}
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    required
                  />
                  {descriptionCharCount < DESCRIPTION_MIN_LENGTH && descriptionCharCount > 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      At least {DESCRIPTION_MIN_LENGTH - descriptionCharCount} more characters needed
                    </p>
                  )}
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
