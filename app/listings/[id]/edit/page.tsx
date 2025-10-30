'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/navigation/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ImagePlus, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { showToast } from '@/utils/toast';
import { toast } from 'sonner';

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id as string;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'KES',
    category: '',
    subcategory: '',
    condition: 'USED_LIKE_NEW',
    location: '',
    images: [] as string[],
  });

  const [loading, setLoading] = useState(true);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});

  // Load existing listing data
  useEffect(() => {
    if (listingId) {
      setLoading(true);
      // TODO: Fetch listing data from API
      // Mock data based on listing ID
      const mockListings: Record<string, typeof formData> = {
        '1': {
          title: 'Vintage Leather Jacket',
          description: 'Authentic vintage leather jacket from the 80s. In excellent condition with minimal signs of wear. Features a classic bomber style cut, zip-front closure, and two side pockets. A timeless piece for any wardrobe.',
          price: '8500',
          currency: 'KES',
          category: 'fashion',
          subcategory: 'apparel-accessories',
          condition: 'USED_LIKE_NEW',
          location: 'Nairobi',
          images: ['/placeholder-laptop-1.jpg', '/placeholder-laptop-2.jpg', '/placeholder-laptop-3.jpg'],
        },
        '2': {
          title: 'Antique Wooden Chair',
          description: 'Beautiful antique wooden chair with intricate carvings. Perfect for collectors.',
          price: '7550',
          currency: 'KES',
          category: 'home-garden',
          subcategory: 'furniture',
          condition: 'USED_GOOD',
          location: 'Mombasa',
          images: ['/placeholder-laptop-4.jpg'],
        },
      };

      const listingData = mockListings[listingId] || mockListings['1'];
      setFormData(listingData);
      setLoading(false);
    }
  }, [listingId]);

  // Detect current location
  useEffect(() => {
    if (useCurrentLocation && navigator.geolocation) {
      // TODO: Use geolocation API to get location and reverse geocode to city name
      // For now, just set a default
      setFormData((prev) => ({ ...prev, location: 'Nairobi' }));
    }
  }, [useCurrentLocation]);

  const categories = [
    { value: 'electronics', label: 'Electronics', subcategories: [
      { value: 'phones', label: 'Phones & Accessories' },
      { value: 'computers', label: 'Computers & Laptops' },
      { value: 'audio', label: 'Audio & Headphones' },
      { value: 'cameras', label: 'Cameras & Photography' },
    ]},
    { value: 'fashion', label: 'Fashion', subcategories: [
      { value: 'apparel-accessories', label: 'Apparel & Accessories' },
      { value: 'shoes', label: 'Shoes' },
      { value: 'bags', label: 'Bags & Luggage' },
      { value: 'jewelry', label: 'Jewelry & Watches' },
    ]},
    { value: 'vehicles', label: 'Vehicles', subcategories: [
      { value: 'cars', label: 'Cars' },
      { value: 'motorcycles', label: 'Motorcycles' },
      { value: 'bicycles', label: 'Bicycles' },
      { value: 'parts', label: 'Parts & Accessories' },
    ]},
    { value: 'home-garden', label: 'Home & Garden', subcategories: [
      { value: 'furniture', label: 'Furniture' },
      { value: 'appliances', label: 'Appliances' },
      { value: 'decor', label: 'Home Decor' },
      { value: 'garden', label: 'Garden & Outdoor' },
    ]},
    { value: 'sports', label: 'Sports & Outdoors', subcategories: [
      { value: 'fitness', label: 'Fitness Equipment' },
      { value: 'outdoor', label: 'Outdoor Gear' },
      { value: 'sports-apparel', label: 'Sports Apparel' },
    ]},
  ];

  const conditions = [
    { value: 'NEW', label: 'New' },
    { value: 'USED_LIKE_NEW', label: 'Used - Like New' },
    { value: 'USED_GOOD', label: 'Used - Good' },
  ];

  const currentCategory = categories.find((cat) => cat.value === formData.category);
  const availableSubcategories = currentCategory?.subcategories || [];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Reset subcategory when category changes
    if (field === 'category') {
      setFormData((prev) => ({
        ...prev,
        subcategory: '',
      }));
    }
  };

  const simulateUpload = (fileIndex: number) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress((prev) => {
            const updated = { ...prev };
            delete updated[fileIndex];
            return updated;
          });
        }, 500);
      }
      setUploadProgress((prev) => ({
        ...prev,
        [fileIndex]: progress,
      }));
    }, 200);
  };

  const handleImageUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newImageCount = formData.images.length;
    
    // Filter out files if we're at the limit
    const remainingSlots = 4 - formData.images.length;
    const filesToUpload = fileArray.slice(0, remainingSlots);
    
    if (filesToUpload.length === 0) {
      showToast.warning('Maximum images reached', 'You can only upload up to 4 images');
      return;
    }

    filesToUpload.forEach((file, index) => {
      const fileIndex = newImageCount + index;
      // Create preview URL immediately
      const previewUrl = URL.createObjectURL(file);
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, previewUrl],
      }));

      // Simulate upload progress
      simulateUpload(fileIndex);

      // TODO: In production, upload to server here
      // Example:
      // const formData = new FormData();
      // formData.append('image', file);
      // uploadImage(formData, (progress) => {
      //   setUploadProgress((prev) => ({
      //     ...prev,
      //     [fileIndex]: progress,
      //   }));
      // });
    });
    
    if (filesToUpload.length < fileArray.length) {
      showToast.info('Some images skipped', `${fileArray.length - filesToUpload.length} image(s) were not added because the limit was reached`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleImageUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
      };
    });
    // Clear upload progress for removed image
    setUploadProgress((prev) => {
      const updated = { ...prev };
      delete updated[index];
      // Shift progress indices
      const shifted: Record<number, number> = {};
      Object.keys(updated).forEach((key) => {
        const numKey = parseInt(key);
        if (numKey > index) {
          shifted[numKey - 1] = updated[numKey];
        } else {
          shifted[numKey] = updated[numKey];
        }
      });
      return shifted;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading toast
    const toastId = showToast.loading('Saving changes...', 'Please wait while we update your listing');
    
    try {
      // TODO: Update listing via API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Dismiss loading toast
      showToast.dismiss(toastId);
      
      // Show success toast
      showToast.success('Listing updated successfully!', 'Your changes have been saved');
      
      // Redirect after a short delay to see the success toast
      setTimeout(() => {
        router.push('/my-listings');
      }, 1000);
    } catch (error) {
      // Dismiss loading toast
      showToast.dismiss(toastId);
      
      // Show error toast
      showToast.error('Failed to update listing', error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated={true} />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading listing data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <nav className="text-sm text-gray-600">
            <Link href="/my-listings" className="hover:text-blue-600">
              My Listings
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Editing &apos;{formData.title}&apos;</span>
          </nav>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Listing</h1>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Section - Product Details */}
                <div className="space-y-6">
                  {/* Product Title */}
                  <div>
                    <Label htmlFor="title" className="text-gray-900 mb-2 block font-semibold text-base">
                      Product Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter product title"
                      className="bg-white border-gray-300 text-gray-900"
                      required
                    />
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
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
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
                          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
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
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <Label htmlFor="price" className="text-gray-900 mb-2 block font-semibold text-base">
                      Price
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.00"
                        className="bg-white border-gray-300 text-gray-900 flex-1"
                        required
                      />
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => handleInputChange('currency', value)}
                      >
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="KES">KES</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <Label className="text-gray-900 mb-3 block font-semibold text-base">
                      Condition
                    </Label>
                    <RadioGroup
                      value={formData.condition}
                      onValueChange={(value) => handleInputChange('condition', value)}
                      className="space-y-3"
                    >
                      {conditions.map((cond) => (
                        <div key={cond.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={cond.value} id={cond.value} />
                          <Label
                            htmlFor={cond.value}
                            className="text-gray-900 font-normal cursor-pointer"
                          >
                            {cond.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <Label htmlFor="description" className="text-gray-900 mb-2 block font-semibold text-base">
                      Detailed Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your item in detail..."
                      rows={8}
                      className="bg-white border-gray-300 text-gray-900 resize-none"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <Label className="text-gray-900 mb-2 block font-semibold text-base">
                      Location
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="use-current-location"
                          checked={useCurrentLocation}
                          onChange={(e) => {
                            setUseCurrentLocation(e.target.checked);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <Label
                          htmlFor="use-current-location"
                          className="text-gray-700 font-normal cursor-pointer flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4" />
                          Use current location
                        </Label>
                      </div>
                      {!useCurrentLocation && (
                        <Input
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="Enter city or location"
                          className="bg-white border-gray-300 text-gray-900"
                          required={!useCurrentLocation}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section - Product Images */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative aspect-square group">
                          <Image
                            src={image}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover rounded-lg border border-gray-200"
                          />
                          {/* Upload Progress Bar */}
                          {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-end">
                              <div className="w-full bg-blue-600 h-1 rounded-b-lg" style={{ width: `${uploadProgress[index]}%` }} />
                            </div>
                          )}
                          {/* Upload Progress Percentage */}
                          {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                                {Math.round(uploadProgress[index])}%
                              </span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {formData.images.length < 4 && (
                        <label
                          htmlFor="image-upload"
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                            isDragging
                              ? 'border-blue-500 bg-blue-50 scale-105'
                              : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            multiple
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                          <ImagePlus className={`w-8 h-8 mb-2 transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                          <span className={`text-sm transition-colors ${isDragging ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                            {isDragging ? 'Drop images here' : 'Add Image'}
                          </span>
                          <span className="text-xs text-gray-400 mt-1">or drag and drop</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Condition Badge */}
                  <div>
                    <Badge className="bg-gray-900 text-white px-3 py-1.5 text-sm">
                      Condition: {conditions.find((c) => c.value === formData.condition)?.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/my-listings')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
