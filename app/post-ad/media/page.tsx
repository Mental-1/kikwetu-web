'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/navigation/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Upload, X, Lightbulb, CheckCircle2, Play, GripVertical } from 'lucide-react';
import Image from 'next/image';
import { showToast } from '@/utils/toast';
import { usePostAdStore } from '@/store';

interface MediaFile {
  id: string;
  url: string;
  file: File;
  type: 'image' | 'video';
  progress: number;
  isUploading: boolean;
}

// File validation constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
const MAX_FILES = 10;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export default function PostAdMediaPage() {
  const router = useRouter();
  const { formData: storeData, updateMedia, setCurrentStep } = usePostAdStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Restore media files from store on mount
  useEffect(() => {
    if (storeData?.mediaFiles && storeData.mediaFiles.length > 0) {
      // Restore file URLs if they exist (from persisted store)
      // Note: File objects won't be restored, but URLs should be preserved
      const restoredFiles: MediaFile[] = storeData.mediaFiles.map((file) => ({
        id: file.id,
        url: file.url,
        file: file.file || null,
        type: file.type,
        progress: 0,
        isUploading: false,
      })).filter((file) => file.url); // Only restore if URL exists
      
      if (restoredFiles.length > 0) {
        // Use setTimeout to avoid setState in effect warning
        setTimeout(() => {
          setMediaFiles(restoredFiles);
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount - we intentionally don't want to re-run when storeData changes

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    
    if (!isImage && !isVideo) {
      return {
        valid: false,
        error: `File type not supported. Allowed: PNG, JPG, MP4, WEBM, MOV`,
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File size too large (${fileSizeMB}MB). Maximum: ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setMediaFiles((prev) =>
          prev.map((file) =>
            file.id === fileId
              ? { ...file, progress: 100, isUploading: false }
              : file
          )
        );
        setTimeout(() => {
          setMediaFiles((prev) =>
            prev.map((file) =>
              file.id === fileId ? { ...file, progress: 0 } : file
            )
          );
        }, 500);
      } else {
        setMediaFiles((prev) =>
          prev.map((file) =>
            file.id === fileId ? { ...file, progress } : file
          )
        );
      }
    }, 200);
  };

  const handleFileUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = MAX_FILES - mediaFiles.length;
    const filesToProcess = fileArray.slice(0, remainingSlots);

    if (filesToProcess.length === 0) {
      showToast.warning('Maximum files reached', `You can only upload up to ${MAX_FILES} files`);
      return;
    }

    const validFiles: File[] = [];
    const invalidFiles: { file: File; error: string }[] = [];

    // Validate each file
    filesToProcess.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file, error: validation.error || 'Invalid file' });
      }
    });

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      const errorMessages = invalidFiles.map(({ file, error }) => `${file.name}: ${error}`).join(', ');
      showToast.error('Invalid files', errorMessages);
    }

    if (validFiles.length === 0) {
      return;
    }

    // Process valid files
    validFiles.forEach((file) => {
      const fileId = `${Date.now()}-${Math.random()}`;
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      const url = URL.createObjectURL(file);

      const mediaFile: MediaFile = {
        id: fileId,
        url,
        file,
        type,
        progress: 0,
        isUploading: true,
      };

      setMediaFiles((prev) => [...prev, mediaFile]);

      // Simulate upload
      simulateUpload(fileId);

      // TODO: Real upload implementation
    });

    if (filesToProcess.length < fileArray.length) {
      showToast.info(
        'Some files skipped',
        `${fileArray.length - filesToProcess.length} file(s) were not added because the limit was reached`
      );
    }

    if (invalidFiles.length > 0 && validFiles.length > 0) {
      showToast.success('Files added', `${validFiles.length} file(s) added successfully`);
    } else if (validFiles.length > 0) {
      showToast.success('Files added', `${validFiles.length} file(s) added successfully`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
    // Reset input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setMediaFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOverThumbnail = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newFiles = [...mediaFiles];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedFile);
    setMediaFiles(newFiles);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (mediaFiles.length === 0) {
      showToast.warning('No media uploaded', 'Please upload at least one photo or video');
      return;
    }
    
    // Save media files to store
    const mediaFilesForStore = mediaFiles.map((file) => ({
      id: file.id,
      url: file.url,
      file: file.file,
      type: file.type,
      name: file.file?.name || `file-${file.id}`,
      size: file.file?.size || 0,
    }));
    
    updateMedia(mediaFilesForStore);
    setCurrentStep('preview');
    router.push('/post-ad/preview');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Breadcrumbs */}
        <nav className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/post-ad/details" className="hover:text-gray-900 transition-colors">
              Post Ad
            </Link>
            <span>/</span>
            <Link href="/post-ad/details" className="hover:text-gray-900 transition-colors">
              Details
            </Link>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Upload Media</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">Preview</span>
          </div>
        </nav>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/post-ad/details')}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Photos & Videos</h1>
        <p className="text-gray-600 mb-8">Add high-resolution images and vertical videos to showcase your item.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload Zone */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Zone */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={mediaFiles.length >= MAX_FILES}
                />
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-gray-50'
                  } ${mediaFiles.length >= MAX_FILES ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={handleBrowseClick}
                >
                  <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className={`text-lg font-medium mb-2 ${isDragging ? 'text-blue-600' : 'text-gray-900'}`}>
                    {isDragging ? 'Drop files here' : 'Drag & drop photos and videos here'}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    or click to browse. Max {MAX_FILES} files. PNG, JPG, MP4, WEBM, MOV accepted. Up to {MAX_FILE_SIZE / (1024 * 1024)}MB per file.
                  </p>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrowseClick();
                    }}
                    disabled={mediaFiles.length >= MAX_FILES}
                  >
                    Browse Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Media Display */}
            {mediaFiles.length > 0 && (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      Drag to reorder. The first photo will be your cover image.
                    </p>
                    <p className="text-sm text-gray-500">
                      {mediaFiles.length}/{MAX_FILES} files
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {mediaFiles.map((file, index) => (
                      <div
                        key={file.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOverThumbnail(e, index)}
                        onDragEnd={handleDragEnd}
                        className="relative aspect-square group cursor-move"
                      >
                        {file.type === 'image' ? (
                          <Image
                            src={file.url}
                            alt={`Media ${index + 1}`}
                            fill
                            className="object-cover rounded-lg border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        )}
                        
                        {/* Cover Badge */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-semibold">
                            Cover
                          </div>
                        )}

                        {/* File Type Badge */}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded font-medium">
                          {file.type === 'image' ? 'IMG' : 'VID'}
                        </div>

                        {/* Upload Progress */}
                        {file.isUploading && file.progress > 0 && file.progress < 100 && (
                          <>
                            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-end">
                              <div
                                className="w-full bg-blue-600 h-1 rounded-b-lg transition-all"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                                {Math.round(file.progress)}%
                              </span>
                            </div>
                          </>
                        )}

                        {/* File Size Info */}
                        {file.progress === 0 && !file.isUploading && (
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              {formatFileSize(file.file.size)}
                            </div>
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.id)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Drag Handle */}
                        <div className="absolute bottom-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-5 h-5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Tips */}
          <div>
            <Card className="bg-blue-50 border-blue-200 shadow-sm sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Tips for Great Photos</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Use bright, natural lighting. Avoid harsh shadows.',
                    'Show the item from multiple angles (front, back, side).',
                    'Highlight any defects or unique features. Honesty builds trust.',
                    'Clean the item before photographing. A clean item looks more valuable.',
                    'Vertical videos perform best in our \'For You\' section!',
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/post-ad/details')}
            className="bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={mediaFiles.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}
