'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import VideoOverlay from './VideoOverlay';

// Dynamically import react-player to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail?: string;
  sellerName: string;
  sellerAvatar?: string;
  isFollowing?: boolean;
  likes: string;
  comments: string;
  shares: string;
  hashtags?: string[];
  onFollow?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onContactSeller?: () => void;
  isActive?: boolean; // For scroll-based play/pause
}

export default function VideoPlayer({
  videoUrl,
  thumbnail,
  sellerName,
  sellerAvatar,
  isFollowing,
  likes,
  comments,
  shares,
  hashtags = [],
  onFollow,
  onLike,
  onComment,
  onShare,
  onSave,
  onContactSeller,
  isActive = true
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showAllHashtags, setShowAllHashtags] = useState(false);
  const playerRef = useRef<any>(null);
  
  const maxInitialHashtags = 6; // Show first 2 rows (3 cols × 2 rows)
  const hasMoreHashtags = hashtags.length > maxInitialHashtags;
  const displayedHashtags = showAllHashtags ? hashtags : hashtags.slice(0, maxInitialHashtags);

  useEffect(() => {
    // Auto-play when video becomes active (in view)
    if (isActive) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [isActive]);

  const handleTogglePlay = () => {
    setPlaying(!playing);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPlaying(!playing);
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {/* Video Player */}
      <div className="w-full h-full" onClick={handleTogglePlay} onContextMenu={handleContextMenu}>
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          width="100%"
          height="100%"
          onClick={handleTogglePlay}
          controls={false}
          muted={muted}
          loop={false}
          pip={false}
          light={thumbnail}
          playIcon={
            <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[20px] border-l-gray-900 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
            </div>
          }
        />
      </div>

      {/* Interactive Overlay */}
      <VideoOverlay
        sellerAvatar={sellerAvatar}
        sellerName={sellerName}
        isFollowing={isFollowing}
        likes={likes}
        comments={comments}
        shares={shares}
        onFollow={onFollow}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
        onSave={onSave}
        onContactSeller={onContactSeller}
      />

      {/* Hashtag Overlays - Lower Left */}
      {hashtags && hashtags.length > 0 && (
        <div 
          className="absolute left-4 md:left-6 bottom-24 md:bottom-28 z-10 max-w-[calc(100%-8rem)] md:max-w-[calc(100%-12rem)]"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-3 gap-x-2 md:gap-x-3 gap-y-1.5 md:gap-y-2 auto-cols-fr">
            {displayedHashtags.map((hashtag, index) => (
              <div
                key={index}
                className="text-white text-xs md:text-sm font-semibold drop-shadow-lg cursor-pointer hover:opacity-80 transition-opacity truncate min-w-0"
                onClick={() => console.log('Hashtag clicked:', hashtag)}
                title={hashtag}
              >
                {hashtag}
              </div>
            ))}
          </div>
          {hasMoreHashtags && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllHashtags(!showAllHashtags);
              }}
              className="mt-2 text-white text-xs md:text-sm font-semibold drop-shadow-lg hover:opacity-80 transition-opacity underline"
            >
              {showAllHashtags ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

