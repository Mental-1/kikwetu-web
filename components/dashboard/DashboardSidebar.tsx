'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  List,
  MessageSquare,
  Eye,
  Building2,
  X,
  Store,
  ChevronDown,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/seller-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/my-listings', label: 'My Listings', icon: List },
    { href: '/store-creation', label: 'Store Management', icon: Store },
    { href: '/conversations', label: 'Messages', icon: MessageSquare },
    { href: '/transactions', label: 'Transactions', icon: Eye },
  ];

  // Mock store data
  const stores = [
    { id: 1, name: 'Main Store', avatar: '/placeholder-avatar.jpg', isStoreSpecific: true },
    { id: 2, name: 'Electronics Hub', avatar: '/placeholder-laptop-1.jpg', isStoreSpecific: false },
    { id: 3, name: 'Fashion Boutique', avatar: '/placeholder-laptop-2.jpg', isStoreSpecific: false },
  ];

  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const [isStoreSpecificAnalytics, setIsStoreSpecificAnalytics] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'w-64 bg-gray-900 text-white min-h-screen flex-col flex-shrink-0 fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'lg:flex'
        )}
      >
        <div className="p-6 h-full overflow-y-auto flex flex-col">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-end mb-6 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Store Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors mb-6 text-left">
                <Avatar className="w-10 h-10 rounded-full flex-shrink-0">
                  <AvatarImage src={selectedStore.avatar} alt={selectedStore.name} />
                  <AvatarFallback className="bg-blue-600">
                    {selectedStore.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{selectedStore.name}</p>
                  <p className="text-xs text-gray-400 truncate">Store Analytics</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-gray-800 border-gray-700">
              <div className="px-2 py-1.5 text-xs text-gray-400 font-medium">Select Store</div>
              {stores.map((store) => (
                <DropdownMenuItem
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={cn(
                    'flex items-center gap-3 p-3 cursor-pointer',
                    selectedStore.id === store.id && 'bg-gray-700'
                  )}
                >
                  <Avatar className="w-8 h-8 rounded-full">
                    <AvatarImage src={store.avatar} alt={store.name} />
                    <AvatarFallback className="bg-blue-600 text-xs">
                      {store.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{store.name}</p>
                  </div>
                  {selectedStore.id === store.id && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                onClick={() => setIsStoreSpecificAnalytics(!isStoreSpecificAnalytics)}
                className="flex items-center gap-3 p-3 cursor-pointer"
              >
                <BarChart3 className={cn(
                  'w-4 h-4',
                  isStoreSpecificAnalytics ? 'text-blue-400' : 'text-gray-400'
                )} />
                <span className="text-sm text-white">Store-Specific Analytics</span>
                <div className={cn(
                  'ml-auto w-10 h-6 rounded-full transition-colors',
                  isStoreSpecificAnalytics ? 'bg-blue-600' : 'bg-gray-600'
                )}>
                  <div className={cn(
                    'w-4 h-4 rounded-full bg-white transition-transform mt-1',
                    isStoreSpecificAnalytics ? 'translate-x-4' : 'translate-x-1'
                  )} />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1">
            {/* Navigation */}
            <nav className="space-y-1 mb-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

          </div>
        </div>
      </aside>
    </>
  );
}

