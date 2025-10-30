'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Menu, Save, Upload, Pencil } from 'lucide-react';
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

export default function CreateStorePage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    category: '',
    description: '',
    website: '',
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
  });

  const [isDragging, setIsDragging] = useState(false);

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
    if (!formData.name || !formData.category || !formData.description) {
      showToast.error('Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    // TODO: Implement API call to create store
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    showToast.success('Store Created', 'Your store has been created successfully');
    router.push('/store-creation');
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
              <span className="text-gray-900">Create New Store</span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Store</h1>
              <p className="text-gray-600">Set up your store information to start selling.</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Creating...' : 'Create Store'}
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
                    Store Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="storeName"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                    placeholder="Enter store name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="storeCategory" className="text-gray-900 mb-2 block font-semibold">
                    Store Category <span className="text-red-500">*</span>
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
                    Store Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="storeDescription"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 min-h-[100px]"
                    placeholder="Describe your store..."
                    required
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
          </div>
        </main>
      </div>
    </div>
  );
}

