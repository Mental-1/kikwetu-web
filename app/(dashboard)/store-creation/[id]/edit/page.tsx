'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/navigation/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Menu, Save, Upload, Pencil, Star, Trash2, Edit, User, MessageSquare, Plus } from 'lucide-react';
import { showToast } from '@/utils/toast';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StoreFormData {
  name: string;
  category: string;
  description: string;
  website: string;
  instagram: string;
  facebook: string;
            twitter: string;
            tiktok: string;
            banner?: string;
            logo?: string;
          }

interface Listing {
  id: string;
  title: string;
  price: string;
  image?: string;
}

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params?.id as string;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    category: '',
    description: '',
    website: '',
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
    banner: '',
    logo: '',
  });

  // Mock store data - in production, fetch from API
  const [storeData] = useState({
    id: storeId,
    name: "Alex's Vintage Finds",
    category: 'home-garden',
    description: 'Curated vintage items and unique finds for your home and wardrobe. Discover timeless pieces with a story.',
    website: 'https://example.com',
    instagram: '@username',
    facebook: 'facebook.com/page',
    twitter: '@username',
    banner: '/placeholder-laptop-1.jpg',
    logo: '/placeholder-avatar.jpg',
    followers: 1234,
    reviews: 567,
    rating: 4.8,
  });

  // Mock listings data
  const [listings, setListings] = useState<Listing[]>([
    { id: '1', title: 'Vintage Leather Jac...', price: '$120.00', image: '/placeholder-laptop-1.jpg' },
    { id: '2', title: 'Antique Wooden Ch...', price: '$75.50', image: '/placeholder-avatar.jpg' },
    { id: '3', title: 'Modern Art Print', price: '$49.99', image: '/placeholder-laptop-2.jpg' },
    { id: '4', title: 'Handmade Ceramic ...', price: '$60.00', image: '/placeholder-laptop-3.jpg' },
  ]);

  useEffect(() => {
    // In production, fetch store data from API
    setFormData({
      name: storeData.name,
      category: storeData.category,
      description: storeData.description,
      website: storeData.website,
      instagram: storeData.instagram,
      facebook: storeData.facebook,
      twitter: storeData.twitter,
      tiktok: '', // Add TikTok if it exists in storeData
      banner: storeData.banner,
      logo: storeData.logo,
    });
  }, [storeId]);

  const categories = [
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'services', label: 'Services' },
    { value: 'other', label: 'Other' },
  ];

  const handleInputChange = (field: keyof StoreFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBannerUpload = (file?: File) => {
    if (file) {
      // TODO: Implement file upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, banner: reader.result as string }));
      };
      reader.readAsDataURL(file);
      showToast.success('Banner Uploaded', 'Banner image has been uploaded');
    } else {
      // Trigger file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleBannerUpload(file);
      };
      input.click();
    }
  };

  const handleLogoEdit = (file?: File) => {
    if (file) {
      // TODO: Implement file upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
      showToast.success('Logo Uploaded', 'Logo image has been uploaded');
    } else {
      // Trigger file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleLogoEdit(file);
      };
      input.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleBannerUpload(file);
    } else {
      showToast.error('Invalid File', 'Please upload an image file');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement API call to save store data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    showToast.success('Store Updated', 'Your store information has been saved successfully');
    router.push('/store-creation');
  };

  const handleDeleteListing = (listingId: string) => {
    setListings((prev) => prev.filter((listing) => listing.id !== listingId));
    showToast.success('Listing Deleted', 'The listing has been removed from your store');
  };

  const handleEditListing = (listingId: string) => {
    router.push(`/listings/${listingId}/edit`);
  };

  const handleAddListing = () => {
    router.push('/post-ad/details');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} />
      
      <div className="flex relative">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden fixed top-20 left-4 z-30 bg-white text-gray-900 hover:bg-gray-100 border border-gray-200"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Sidebar */}
        <DashboardSidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 lg:ml-0 bg-gray-50">
          {/* Breadcrumbs */}
          <nav className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/seller-dashboard" className="hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link href="/store-creation" className="hover:text-gray-900 transition-colors">
                Store Management
              </Link>
              <span>/</span>
              <span className="text-gray-900">Edit Store</span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Management</h1>
              <p className="text-gray-600">Create or update your store&apos;s information and manage your listings.</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Store Branding Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Store Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Banner Area with Drag and Drop */}
                <div>
                  <Label className="text-gray-900 mb-2 block font-semibold">
                    Store Banner
                  </Label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      'relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed transition-colors',
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-200 hover:border-gray-400 cursor-pointer'
                    )}
                    onClick={() => !formData.banner && handleBannerUpload()}
                  >
                    {formData.banner ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={formData.banner}
                          alt="Store banner"
                          fill
                          className="object-cover"
                        />
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBannerUpload();
                          }}
                          className="absolute top-3 right-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                          size="sm"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Change Banner
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo Selection */}
                <div>
                  <Label className="text-gray-900 mb-2 block font-semibold">
                    Store Logo
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-2 border-gray-300">
                        <AvatarImage src={formData.logo} alt="Store logo" />
                        <AvatarFallback className="bg-blue-600 text-white text-2xl">
                          {formData.name.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        onClick={() => handleLogoEdit()}
                        size="icon"
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-white shadow-md"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        Upload a square logo image. Recommended size: 200x200px
                      </p>
                      <Button
                        onClick={() => handleLogoEdit()}
                        variant="outline"
                        size="sm"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 gap-4 pt-8">
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Followers</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{storeData.followers.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Reviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-gray-900">{storeData.reviews}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-600">{storeData.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Store Details Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Store Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="storeName" className="text-gray-900 mb-2 block font-semibold">
                    Store Name
                  </Label>
                  <Input
                    id="storeName"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                    placeholder="Enter store name"
                  />
                </div>

                <div>
                  <Label htmlFor="storeCategory" className="text-gray-900 mb-2 block font-semibold">
                    Store Category
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

                <div>
                  <Label htmlFor="storeDescription" className="text-gray-900 mb-2 block font-semibold">
                    Store Description
                  </Label>
                  <Textarea
                    id="storeDescription"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 min-h-[100px]"
                    placeholder="Describe your store..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* External Links Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">External Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="website" className="text-gray-900 mb-2 block font-semibold">
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram" className="text-gray-900 mb-2 block font-semibold">
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <Label htmlFor="facebook" className="text-gray-900 mb-2 block font-semibold">
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                    placeholder="facebook.com/page"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter" className="text-gray-900 mb-2 block font-semibold">
                    Twitter / X
                  </Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <Label htmlFor="tiktok" className="text-gray-900 mb-2 block font-semibold">
                    TikTok
                  </Label>
                  <Input
                    id="tiktok"
                    value={formData.tiktok}
                    onChange={(e) => handleInputChange('tiktok', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                    placeholder="@username"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Manage Listings Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900">Manage Listings</CardTitle>
                <Button
                  onClick={handleAddListing}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Listing
                </Button>
              </CardHeader>
              <CardContent>
                {listings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {listings.map((listing) => (
                      <Card key={listing.id} className="bg-white border-gray-200 overflow-hidden">
                        <div className="relative w-full h-32 bg-gray-200">
                          {listing.image ? (
                            <Image
                              src={listing.image}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                            {listing.title}
                          </h3>
                          <p className="text-sm font-semibold text-gray-900 mb-3">
                            {listing.price}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditListing(listing.id)}
                              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteListing(listing.id)}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No listings yet</p>
                    <Button
                      onClick={handleAddListing}
                      variant="outline"
                      className="border-gray-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Listing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

