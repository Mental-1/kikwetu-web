'use client';

import { useState } from 'react';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import Image from 'next/image';

interface Transaction {
  id: string;
  title: string;
  orderId: string;
  image: string;
  date: string;
  price: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const itemsPerPage = 5;
  const totalItems = 20;

  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Handmade Leather Backpack',
      orderId: '#8A4B2C',
      image: '/placeholder-backpack.jpg',
      date: 'Aug 12, 2024',
      price: 'KES 9,500.00',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Vinyl Record Collection',
      orderId: '#7F9E1D',
      image: '/placeholder-vinyl.jpg',
      date: 'Aug 10, 2024',
      price: 'KES 12,000.00',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Classic Dutch Style Bicycle',
      orderId: '#6C5A0B',
      image: '/placeholder-bicycle.jpg',
      date: 'Aug 05, 2024',
      price: 'KES 18,000.00',
      status: 'completed',
    },
    {
      id: '4',
      title: 'Mid-Century Modern Armchair',
      orderId: '#5E3F9A',
      image: '/placeholder-armchair.jpg',
      date: 'Jul 28, 2024',
      price: 'KES 25,000.00',
      status: 'cancelled',
    },
    {
      id: '5',
      title: 'Professional DSLR Camera',
      orderId: '#4D2E8B',
      image: '/placeholder-camera.jpg',
      date: 'Jul 21, 2024',
      price: 'KES 45,500.00',
      status: 'completed',
    },
  ];

  const statusConfig = {
    completed: { label: 'Completed', color: 'text-green-400', dotColor: 'bg-green-500' },
    pending: { label: 'Pending', color: 'text-orange-400', dotColor: 'bg-orange-500' },
    cancelled: { label: 'Cancelled', color: 'text-red-400', dotColor: 'bg-red-500' },
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header isAuthenticated={true} />
      
      <div className="flex flex-1 relative">
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold text-white">My Transactions</h1>
            <div className="flex gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
              <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ITEM DETAILS
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      DATE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      PRICE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {transactions.map((transaction) => {
                    const status = statusConfig[transaction.status];
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                              <Image
                                src={transaction.image}
                                alt={transaction.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-white truncate">{transaction.title}</p>
                              <p className="text-sm text-gray-400">Order ID: {transaction.orderId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{transaction.date}</td>
                        <td className="px-6 py-4 text-white font-medium">{transaction.price}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status.dotColor}`} />
                            <span className={`text-sm ${status.color}`}>{status.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <p className="text-gray-400 text-sm">
              Showing {startIndex + 1} to {endIndex} of {totalItems} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(totalItems / itemsPerPage), prev + 1))}
                disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
