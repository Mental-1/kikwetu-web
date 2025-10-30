'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/navigation/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  CheckCircle2,
  MessageCircle,
  Package,
  DollarSign,
  Heart,
  UserPlus,
  AlertCircle,
  ArrowLeft,
  Trash2,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'message' | 'listing' | 'payment' | 'favorite' | 'follow' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  icon?: React.ReactNode;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New message from John Doe',
      message: 'Hi, I\'m interested in your laptop listing. Is it still available?',
      timestamp: '2 minutes ago',
      isRead: false,
      link: '/conversations/1',
    },
    {
      id: '2',
      type: 'listing',
      title: 'Your listing was viewed 25 times',
      message: 'Your "MacBook Pro 2023" listing received 25 views in the past hour',
      timestamp: '15 minutes ago',
      isRead: false,
      link: '/listings/123',
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment received',
      message: 'You received KES 45,000 for "Vintage Leather Jacket"',
      timestamp: '1 hour ago',
      isRead: true,
      link: '/transactions',
    },
    {
      id: '4',
      type: 'favorite',
      title: 'Someone favorited your listing',
      message: '5 people added "iPhone 14 Pro" to their favorites',
      timestamp: '3 hours ago',
      isRead: false,
      link: '/listings/456',
    },
    {
      id: '5',
      type: 'follow',
      title: 'New follower',
      message: 'Sarah Kim started following you',
      timestamp: '5 hours ago',
      isRead: true,
      link: '/profile/sarah-kim',
    },
    {
      id: '6',
      type: 'system',
      title: 'Account verification required',
      message: 'Please verify your email address to unlock all features',
      timestamp: '1 day ago',
      isRead: false,
      link: '/settings',
    },
    {
      id: '7',
      type: 'listing',
      title: 'Listing expired',
      message: 'Your "Gaming Chair" listing has expired. Renew it now to keep it active',
      timestamp: '2 days ago',
      isRead: true,
      link: '/my-listings',
    },
    {
      id: '8',
      type: 'payment',
      title: 'Payment pending',
      message: 'Payment of KES 8,500 for "Bicycle" is pending approval',
      timestamp: '3 days ago',
      isRead: true,
      link: '/transactions',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'listing':
        return <Package className="w-5 h-5 text-purple-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'favorite':
        return <Heart className="w-5 h-5 text-red-600" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-indigo-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => !n.isRead);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount > 0
                  ? `${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}`
                  : 'All caught up!'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="hidden md:flex border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filters - Mobile */}
        <div className="md:hidden mb-4">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                filter === 'all'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-300 text-gray-700'
              )}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
              className={cn(
                filter === 'unread'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-300 text-gray-700'
              )}
            >
              Unread ({unreadCount})
            </Button>
          </div>
        </div>

        {/* Filters - Desktop Tabs */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'unread')} className="mb-6">
          <TabsList className="hidden md:inline-flex bg-gray-100 border border-gray-200">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-white">
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  'bg-white border-gray-200 cursor-pointer transition-all hover:shadow-md',
                  !notification.isRead && 'border-l-4 border-l-blue-600 bg-blue-50/30'
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={cn(
                                'text-sm font-semibold text-gray-900',
                                !notification.isRead && 'font-bold'
                              )}
                            >
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs border-gray-300 text-gray-600"
                            >
                              {notification.type}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white border-gray-200">
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === 'unread'
                  ? 'You\'re all caught up! Check back later for new updates.'
                  : 'You don\'t have any notifications yet. They\'ll appear here when you receive updates.'}
              </p>
              {filter === 'unread' && (
                <Button
                  variant="outline"
                  onClick={() => setFilter('all')}
                  className="border-gray-300 text-gray-700"
                >
                  View all notifications
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Load More Button */}
        {filteredNotifications.length > 0 && filteredNotifications.length >= 8 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Load more notifications
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}


