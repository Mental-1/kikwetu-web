'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Bookmark, Plus, Check } from 'lucide-react';

interface VideoOverlayProps {
  sellerAvatar?: string;
  sellerName: string;
  isFollowing?: boolean;
  likes: string;
  comments: string;
  shares: string;
  onFollow?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onContactSeller?: () => void;
}

export default function VideoOverlay({
  sellerAvatar,
  sellerName,
  isFollowing = false,
  likes,
  comments,
  shares,
  onFollow,
  onLike,
  onShare,
  onComment,
  onSave,
  onContactSeller
}: VideoOverlayProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const checkmarkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (checkmarkTimeoutRef.current) {
        clearTimeout(checkmarkTimeoutRef.current);
      }
    };
  }, []);

  const handleFollow = () => {
    // Clear any existing timeout
    if (checkmarkTimeoutRef.current) {
      clearTimeout(checkmarkTimeoutRef.current);
      checkmarkTimeoutRef.current = null;
    }

    if (!following) {
      setFollowing(true);
      setShowCheckmark(true);
      onFollow?.();
      
      // Show animated checkmark briefly then hide (600ms for visual feedback)
      checkmarkTimeoutRef.current = setTimeout(() => {
        setShowCheckmark(false);
        checkmarkTimeoutRef.current = null;
      }, 600);
    } else {
      setFollowing(false);
      setShowCheckmark(false);
      onFollow?.();
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  return (
    <div 
      className="absolute right-4 md:right-6 bottom-0 top-0 flex flex-col items-center justify-end gap-3 md:gap-4 pb-24 md:pb-24 z-10"
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
    >
      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-4 md:gap-5">
        {/* Seller Avatar with Follow Button - Just above Like button */}
        <div className="relative flex flex-col items-center gap-2 mb-1">
          <div className="relative">
            <Avatar className="w-10 h-10 md:w-12 md:h-12 border-2 border-white">
              <AvatarImage src={sellerAvatar} alt={sellerName} />
              <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 md:w-6 md:h-6 rounded-full ${
                following || showCheckmark
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-white hover:bg-gray-100'
              } border-2 border-gray-800 shadow-lg transition-all duration-200`}
              onClick={(e) => {
                e.stopPropagation();
                handleFollow();
              }}
            >
              {showCheckmark ? (
                <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white animate-in fade-in zoom-in duration-200" />
              ) : following ? (
                <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
              ) : (
                <Plus className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-900" />
              )}
            </Button>
          </div>
        </div>
        {/* Like Button */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 md:w-14 md:h-14 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full border border-white border-opacity-30 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <Heart
              className={`w-6 h-6 md:w-7 md:h-7 ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-white'
              } transition-all`}
            />
          </Button>
          <span className="text-xs md:text-sm font-medium text-white drop-shadow-lg">
            {likes}
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 md:w-14 md:h-14 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full border border-white border-opacity-30 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onComment?.();
            }}
          >
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </Button>
          <span className="text-xs md:text-sm font-medium text-white drop-shadow-lg">
            {comments}
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 md:w-14 md:h-14 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full border border-white border-opacity-30 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.();
            }}
          >
            <Share2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </Button>
          <span className="text-xs md:text-sm font-medium text-white drop-shadow-lg">
            {shares}
          </span>
        </div>

        {/* Save Button */}
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 md:w-14 md:h-14 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full border border-white border-opacity-30 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            onSave?.();
          }}
        >
          <Bookmark className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </Button>

        {/* Contact Seller Button - Mobile Only */}
        {onContactSeller && (
          <div className="md:hidden flex flex-col items-center gap-1 mt-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full border border-white border-opacity-30 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                onContactSeller();
              }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </Button>
            <span className="text-xs font-medium text-white drop-shadow-lg">
              Message
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

