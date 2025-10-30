'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/navigation/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';

export default function EditListingMediaPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id as string;

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load existing images
  useEffect(() => {
    if (listingId) {
      setLoading(true);
      // TODO: Fetch existing images from API
      // Mock existing images
      const mockImages: Record<string, string[]> = {
        '1': ['/placeholder-laptop-1.jpg', '/placeholder-laptop-2.jpg'],
        '2': ['/placeholder-laptop-3.jpg'],
      };
      setImages(mockImages[listingId] || mockImages['1']);
      setLoading(false);
    }
  }, [listingId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // TODO: Upload images to server
    console.log('Updating listing media:', listingId, images);
    // After successful update, navigate back to my-listings or listing details
    router.push('/my-listings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header isAuthenticated={true} />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-gray-400">Loading media...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/listings/${listingId}/edit`)}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">
            Update Listing Media
          </h1>
          <p className="text-gray-400">
            Update photos and videos of your item
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Media</CardTitle>
            <CardDescription className="text-gray-400">
              Upload up to 10 photos. The first photo will be your main listing image.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload Area */}
            <div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={images.length >= 10}
              />
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  images.length >= 10
                    ? 'border-gray-600 bg-gray-700 opacity-50 cursor-not-allowed'
                    : 'border-gray-600 bg-gray-700 hover:bg-gray-600 hover:border-gray-500'
                }`}
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-400 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB ({images.length}/10)
                </p>
              </label>
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveImage(index)}
                        className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {images.length === 0 && (
              <div className="text-center py-12 border border-gray-700 rounded-lg">
                <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No images uploaded yet</p>
                <p className="text-sm text-gray-500">
                  Upload at least one photo to create your listing
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-between pt-6 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/listings/${listingId}/edit`)}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={images.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

