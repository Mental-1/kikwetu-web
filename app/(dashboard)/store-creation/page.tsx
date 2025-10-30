'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Store, Star, Package, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { showToast } from '@/utils/toast';
import Image from 'next/image';

interface Store {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  rating: number;
  totalProducts: number;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
}

export default function StoreManagementPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);

  // Mock stores data
  const [stores, setStores] = useState<Store[]>([
    {
      id: '1',
      name: 'Main Store',
      description: 'Your primary store for electronics and gadgets',
      logo: '/placeholder-avatar.jpg',
      banner: '/placeholder-laptop-1.jpg',
      rating: 4.8,
      totalProducts: 45,
      totalViews: 1250,
      createdAt: '2024-01-15',
      updatedAt: '2024-12-10',
    },
    {
      id: '2',
      name: 'Electronics Hub',
      description: 'Specialized store for electronics and tech accessories',
      logo: '/placeholder-laptop-2.jpg',
      banner: '/placeholder-laptop-2.jpg',
      rating: 4.6,
      totalProducts: 28,
      totalViews: 890,
      createdAt: '2024-03-20',
      updatedAt: '2024-12-08',
    },
    {
      id: '3',
      name: 'Fashion Boutique',
      description: 'Trendy fashion items and accessories',
      logo: '/placeholder-laptop-3.jpg',
      banner: '/placeholder-laptop-3.jpg',
      rating: 4.9,
      totalProducts: 62,
      totalViews: 2100,
      createdAt: '2024-06-10',
      updatedAt: '2024-12-12',
    },
  ]);

  const handleEdit = (storeId: string) => {
    router.push(`/store-creation/${storeId}/edit`);
  };

  const handleDelete = (store: Store) => {
    setStoreToDelete(store);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (storeToDelete) {
      setStores((prev) => prev.filter((store) => store.id !== storeToDelete.id));
      showToast.success('Store Deleted', `${storeToDelete.name} has been deleted successfully`);
      setDeleteDialogOpen(false);
      setStoreToDelete(null);
    }
  };

  const handleCreate = () => {
    router.push('/store-creation/new');
  };

  const handleViewStore = (storeId: string) => {
    router.push(`/storefront/${storeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header isAuthenticated={true} />
      
      <div className="flex relative">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden fixed top-20 left-4 z-30 bg-gray-800 text-white hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Sidebar */}
        <DashboardSidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 lg:ml-0">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Store Management</h1>
              <p className="text-gray-400">Manage your stores and listings</p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Store
            </Button>
          </div>

          {/* Stores Grid */}
          {stores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <Card
                  key={store.id}
                  className="bg-gray-800 border-gray-700 overflow-hidden hover:border-gray-600 transition-colors"
                >
                  {/* Banner Image */}
                  {store.banner && (
                    <div className="relative w-full h-32 bg-gray-700">
                      <Image
                        src={store.banner}
                        alt={store.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="w-12 h-12 flex-shrink-0 border-2 border-gray-700">
                          <AvatarImage src={store.logo} alt={store.name} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {store.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-white text-lg truncate mb-1">
                            {store.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm text-gray-300">{store.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(store)}
                        className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {store.description}
                    </p>

                    {/* Statistics */}
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-700">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {store.totalProducts} Products
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {store.totalViews.toLocaleString()} Views
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewStore(store.id)}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(store.id)}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Store className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Stores Yet</h3>
                <p className="text-gray-400 text-center mb-6 max-w-md">
                  Create your first store to start selling and managing your products
                </p>
                <Button
                  onClick={handleCreate}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Store
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Store</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete &quot;{storeToDelete?.name}&quot;? This action cannot be undone.
              All products and data associated with this store will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
