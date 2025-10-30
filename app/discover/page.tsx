'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/navigation/Header';
import FeedTabs from '@/components/discover/FeedTabs';
import VideoPlayer from '@/components/discover/VideoPlayer';
import ProductSidebar from '@/components/discover/ProductSidebar';

interface VideoFeedItem {
  id: number;
  videoUrl: string;
  thumbnail?: string;
  sellerName: string;
  sellerId?: string;
  sellerAvatar?: string;
  sellerRating: number;
  productName: string;
  productPrice: string;
  condition: string;
  description: string;
  likes: string;
  comments: string;
  shares: string;
  hashtags?: string[];
}

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'foryou' | 'nearby' | 'following'>('foryou');
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isScrolling = useRef<boolean>(false);

  // Mock video feed data
  const videoFeeds: VideoFeedItem[] = [
    {
      id: 1,
      videoUrl: 'https://example.com/video1.mp4',
      thumbnail: '/placeholder-laptop-1.jpg',
      sellerName: 'TechGadgets_Store',
      sellerId: 'techgadgets-store-123',
      sellerAvatar: '/placeholder-avatar.jpg',
      sellerRating: 4.8,
      productName: 'AuraGlow Smart Lamp',
      productPrice: 'KES 79,999',
      condition: 'New',
      description: 'The ultimate ambient lighting for any room. Control millions of colors right from your smartphone.',
      likes: '12.3k',
      comments: '1.2k',
      shares: '450',
      hashtags: ['#SmartLighting', '#HomeDecor', '#TechGadgets', '#ModernLiving']
    },
    {
      id: 2,
      videoUrl: 'https://example.com/video2.mp4',
      thumbnail: '/placeholder-laptop-2.jpg',
      sellerName: 'FashionForward',
      sellerId: 'fashionforward-456',
      sellerAvatar: '/placeholder-avatar.jpg',
      sellerRating: 4.9,
      productName: 'Vintage Leather Jacket',
      productPrice: 'KES 45,000',
      condition: 'Used Like New',
      description: 'Authentic vintage leather jacket in excellent condition. Perfect fit for the modern urban look.',
      likes: '8.5k',
      comments: '923',
      shares: '312',
      hashtags: ['#VintageFashion', '#LeatherJacket', '#StreetStyle', '#FashionFind']
    },
    {
      id: 3,
      videoUrl: 'https://example.com/video3.mp4',
      thumbnail: '/placeholder-laptop-3.jpg',
      sellerName: 'HomeEssentials',
      sellerId: 'homeessentials-789',
      sellerAvatar: '/placeholder-avatar.jpg',
      sellerRating: 4.7,
      productName: 'Modern Minimalist Sofa',
      productPrice: 'KES 125,000',
      condition: 'New',
      description: 'Comfortable and stylish sofa perfect for your living room. Premium materials and contemporary design.',
      likes: '15.2k',
      comments: '2.1k',
      shares: '678',
      hashtags: ['#MinimalistDesign', '#Furniture', '#LivingRoom', '#HomeStyling']
    }
  ];

  const currentVideo = videoFeeds.find(v => v.id === activeVideoId) || videoFeeds[0];

  // Scroll to specific video index
  const scrollToVideo = useCallback((index: number, smooth: boolean = true) => {
    if (index >= 0 && index < videoFeeds.length && videoRefs.current[index] && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const videoElement = videoRefs.current[index];
      
      if (videoElement) {
        // Use scrollIntoView with 'nearest' to respect snap points better
        videoElement.scrollIntoView({ 
          behavior: smooth ? 'smooth' : 'auto', 
          block: 'nearest',
          inline: 'nearest'
        });
        
        // Update state immediately for keyboard, delay for swipe
        if (smooth) {
          setCurrentVideoIndex(index);
          setActiveVideoId(videoFeeds[index].id);
        } else {
          // For swipes, let intersection observer update the state
          setTimeout(() => {
            setCurrentVideoIndex(index);
            setActiveVideoId(videoFeeds[index].id);
          }, 100);
        }
      }
    }
  }, [videoFeeds]);

  // Navigate to next video
  const goToNextVideo = useCallback((smooth: boolean = true) => {
    if (currentVideoIndex < videoFeeds.length - 1) {
      scrollToVideo(currentVideoIndex + 1, smooth);
    }
  }, [currentVideoIndex, videoFeeds.length, scrollToVideo]);

  // Navigate to previous video
  const goToPreviousVideo = useCallback((smooth: boolean = true) => {
    if (currentVideoIndex > 0) {
      scrollToVideo(currentVideoIndex - 1, smooth);
    }
  }, [currentVideoIndex, scrollToVideo]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextVideo();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPreviousVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNextVideo, goToPreviousVideo]);

  // Touch/swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartY.current || !touchEndY.current || !scrollContainerRef.current) {
      touchStartY.current = 0;
      touchEndY.current = 0;
      return;
    }
    
    // Prevent double-processing
    if (isScrolling.current) {
      touchStartY.current = 0;
      touchEndY.current = 0;
      return;
    }
    
    const distance = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 80; // Minimum swipe distance in pixels
    const viewportHeight = window.innerHeight;

    // Only handle swipe if it's significant enough
    if (Math.abs(distance) > minSwipeDistance && Math.abs(distance) > viewportHeight * 0.1) {
      isScrolling.current = true;
      const container = scrollContainerRef.current;
      
      if (distance > 0) {
        // Swipe up - scroll down to next video
        // Scroll by viewport height and let CSS snap handle the alignment
        container.scrollBy({
          top: viewportHeight,
          behavior: 'smooth'
        });
      } else {
        // Swipe down - scroll up to previous video
        container.scrollBy({
          top: -viewportHeight,
          behavior: 'smooth'
        });
      }
      
      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
      
      // Reset touch positions immediately
      touchStartY.current = 0;
      touchEndY.current = 0;
    } else {
      // Reset touch positions if swipe wasn't significant
      touchStartY.current = 0;
      touchEndY.current = 0;
    }
  };

  // Intersection Observer for scroll-based video play/pause
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    videoRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
                setCurrentVideoIndex(index);
                setActiveVideoId(videoFeeds[index].id);
              }
            });
          },
          {
            threshold: [0.8],
          }
        );

        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [videoFeeds]);

  // Set first video as active on mount
  useEffect(() => {
    if (videoFeeds.length > 0 && !activeVideoId) {
      setActiveVideoId(videoFeeds[0].id);
      setCurrentVideoIndex(0);
    }
  }, [activeVideoId, videoFeeds]);

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      <Header isAuthenticated={false} />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Feed Tabs - Desktop sidebar & Mobile overlay */}
        <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content - Video Feed */}
        <div className="flex-1 flex overflow-hidden relative bg-white">
          {/* Video Feed Container - One video at a time */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {videoFeeds.map((video, index) => (
              <div
                key={video.id}
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className="h-screen w-full snap-start snap-always snap-center flex items-center justify-center relative md:py-8"
              >
                <div className="w-full h-full max-w-[600px] mx-auto relative overflow-hidden rounded-xl md:rounded-2xl">
                  <VideoPlayer
                    videoUrl={video.videoUrl}
                    thumbnail={video.thumbnail}
                    sellerName={video.sellerName}
                    sellerAvatar={video.sellerAvatar}
                    isFollowing={false}
                    likes={video.likes}
                    comments={video.comments}
                    shares={video.shares}
                    hashtags={video.hashtags}
                    isActive={activeVideoId === video.id}
                    onFollow={() => console.log('Follow clicked', video.id)}
                    onLike={() => console.log('Like clicked', video.id)}
                    onComment={() => console.log('Comment clicked', video.id)}
                    onShare={() => console.log('Share clicked', video.id)}
                    onSave={() => console.log('Save clicked', video.id)}
                    onContactSeller={() => console.log('Contact seller clicked', video.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Product Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <ProductSidebar
              sellerId={currentVideo.sellerId}
              sellerName={currentVideo.sellerName}
              sellerAvatar={currentVideo.sellerAvatar}
              sellerRating={currentVideo.sellerRating}
              productName={currentVideo.productName}
              productPrice={currentVideo.productPrice}
              condition={currentVideo.condition}
              description={currentVideo.description}
              onFollow={() => console.log('Follow seller')}
              onShopNow={() => console.log('Shop now')}
              onContactSeller={() => console.log('Contact seller')}
              onSave={() => console.log('Save product')}
              onShare={() => console.log('Share product')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
