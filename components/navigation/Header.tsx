'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Home, Menu, X, LayoutDashboard, Settings, User, LogOut, CreditCard, MessageCircle } from 'lucide-react';

interface HeaderProps {
  isAuthenticated?: boolean;
}

export default function Header({ isAuthenticated = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    console.log('Sign out clicked');
    // router.push('/signin');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Marketplace</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/listings" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Listings
              </Link>
              <Link 
                href="/map" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Map
              </Link>
              <Link 
                href="/discover" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Discover
              </Link>
            </nav>
          </div>

          {/* Right side - Actions and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Post Ad / Log In Button */}
            {isAuthenticated ? (
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 hidden sm:inline-flex"
                asChild
              >
                <Link href="/post-ad/details">Post Ad</Link>
              </Button>
            ) : (
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 hidden sm:inline-flex"
                asChild
              >
                <Link href="/signin">Log In</Link>
              </Button>
            )}

            {/* Messages - Only show when authenticated */}
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hidden md:flex"
                asChild
              >
                <Link href="/conversations">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </Link>
              </Button>
            )}

            {/* Notifications - Only show when authenticated */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hidden md:flex">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-blue-600 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Mark all as read
                      }}
                    >
                      Mark all as read
                    </Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {/* Mock notifications */}
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50 border-b">
                      <div className="flex items-start gap-3 w-full">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            New message from John
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Hey, I&apos;m interested in your listing...
                          </p>
                          <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50 border-b">
                      <div className="flex items-start gap-3 w-full">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            Your listing was viewed 50 times
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Your &quot;Vintage Leather Jacket&quot; is getting attention
                          </p>
                          <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50 border-b">
                      <div className="flex items-start gap-3 w-full">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-600">
                            Payment received
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            KES 12,500 for &quot;Toyota Vitz&quot;
                          </p>
                          <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-start gap-3 w-full">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-600">
                            New follower
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Sarah started following your store
                          </p>
                          <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <div className="border-t px-3 py-2">
                    <Link
                      href="/notifications"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View all notifications
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Avatar Dropdown - Only show when authenticated */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:flex">
                  <button className="outline-none focus:outline-none">
                    <Avatar className="w-8 h-8 cursor-pointer">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/seller-dashboard" className="flex items-center cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/plans-billing" className="flex items-center cursor-pointer">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Plans & Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/preferences" className="flex items-center cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Preferences
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/listings"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Listings
              </Link>
              <Link
                href="/map"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Map
              </Link>
              <Link
                href="/discover"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Discover
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="px-4 pt-4 border-t border-gray-200 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                      asChild
                    >
                      <Link href="/post-ad/details" onClick={() => setMobileMenuOpen(false)}>Post Ad</Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/notifications" onClick={() => setMobileMenuOpen(false)}>
                        <Bell className="w-5 h-5 mr-2" />
                        Notifications
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/seller-dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <LayoutDashboard className="w-5 h-5 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/plans-billing" onClick={() => setMobileMenuOpen(false)}>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Plans & Billing
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/preferences" onClick={() => setMobileMenuOpen(false)}>
                        <User className="w-5 h-5 mr-2" />
                        Preferences
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                        <Settings className="w-5 h-5 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    asChild
                  >
                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}