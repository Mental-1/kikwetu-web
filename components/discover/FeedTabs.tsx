'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedTabsProps {
  activeTab: 'foryou' | 'nearby' | 'following';
  onTabChange: (tab: 'foryou' | 'nearby' | 'following') => void;
}

export default function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  const tabs = [
    { id: 'foryou' as const, label: 'For You', icon: Sparkles },
    { id: 'nearby' as const, label: 'Nearby', icon: MapPin },
    { id: 'following' as const, label: 'Following', icon: Users }
  ];

  return (
    <>
      {/* Desktop Tabs - Left Sidebar */}
      <div className="hidden md:block w-64 border-r border-gray-200 bg-white p-6 h-full overflow-y-auto">
        <div className="space-y-8">
          {/* Discover Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Discover</h2>
            <p className="text-sm text-gray-600 mb-4">Video Feed</p>
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3',
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                    onClick={() => onTabChange(tab.id)}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Categories
            </h2>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-100"
              >
                <div className="w-5 h-5 rounded bg-gray-300" />
                Electronics
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-100"
              >
                <div className="w-5 h-5 rounded bg-gray-300" />
                Fashion
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-100"
              >
                <div className="w-5 h-5 rounded bg-gray-300" />
                Home Goods
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs - Overlay at Top */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-[1100] bg-gradient-to-b from-black/60 via-black/40 to-transparent px-4 py-3">
        <div className="flex gap-2 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                className={cn(
                  'rounded-full px-4 py-2 backdrop-blur-sm border',
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                )}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}

