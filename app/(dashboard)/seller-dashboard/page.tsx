'use client';

import { useState } from 'react';
import Header from '@/components/navigation/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Plus, Bell, TrendingUp, TrendingDown, ShoppingCart, ArrowRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamically import chart to avoid SSR issues
const SalesChart = dynamic(() => import('@/components/dashboard/SalesChart'), { 
  ssr: false,
  loading: () => (
    <div className="bg-gray-700 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
      <div className="text-gray-400 text-sm">Loading chart...</div>
    </div>
  )
});

interface PerformanceCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

function PerformanceCard({ title, value, change, isPositive }: PerformanceCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span>{change}</span>
      </div>
    </div>
  );
}

interface TopListingProps {
  title: string;
  price: string;
  views: string;
  status: 'published' | 'sold';
  onAction: () => void;
}

function TopListingRow({ title, price, views, status, onAction }: TopListingProps) {
  const statusConfig = {
    published: { label: 'Published', dotColor: 'bg-green-500', textColor: 'text-green-400' },
    sold: { label: 'Sold', dotColor: 'bg-gray-500', textColor: 'text-gray-400' },
  };

  const config = statusConfig[status];

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
      <td className="py-4 pl-6">
        <p className="font-medium text-white">{title}</p>
      </td>
      <td className="py-4 text-white">{price}</td>
      <td className="py-4 text-gray-400">{views}</td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
          <span className={`text-sm ${config.textColor}`}>{config.label}</span>
        </div>
      </td>
      <td className="py-4">
        <button
          onClick={onAction}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          {status === 'published' ? 'Edit' : 'View'}
        </button>
      </td>
    </tr>
  );
}

export default function SellerDashboardPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

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
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Alex!</h1>
              <p className="text-gray-400">Here&apos;s a summary of your store&apos;s performance.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/post-ad/details">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </Link>
              </Button>
            </div>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <PerformanceCard
              title="Total Revenue"
              value="KES 125,000.00"
              change="+5.2%"
              isPositive={true}
            />
            <PerformanceCard
              title="Listing Views"
              value="8,430"
              change="+12.1%"
              isPositive={true}
            />
            <PerformanceCard
              title="Orders"
              value="62"
              change="-1.5%"
              isPositive={false}
            />
            <PerformanceCard
              title="Conversion Rate"
              value="2.1%"
              change="+0.3%"
              isPositive={true}
            />
            <PerformanceCard
              title="ROAS"
              value="4.2x"
              change="+0.8x"
              isPositive={true}
            />
          </div>

          {/* Sales Performance */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 sm:mb-0">Sales Performance</h2>
              <div className="flex gap-2">
                {[
                  { id: '7days', label: 'Last 7 Days' },
                  { id: '30days', label: 'Last 30 Days' },
                  { id: '90days', label: 'Last 90 Days' },
                ].map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      selectedPeriod === period.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    )}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="bg-gray-700 rounded-lg p-6">
              <SalesChart period={selectedPeriod} />
            </div>
          </div>

          {/* Top Performing Listings */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-white">Top Performing Listings</h2>
              <Link
                href="/my-listings"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      LISTING
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      PRICE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      VIEWS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <TopListingRow
                    title="Vintage Leather Jacket"
                    price="KES 12,000"
                    views="2,105"
                    status="published"
                    onAction={() => console.log('Edit clicked')}
                  />
                  <TopListingRow
                    title="Antique Wooden Chair"
                    price="KES 7,550"
                    views="1,842"
                    status="published"
                    onAction={() => console.log('Edit clicked')}
                  />
                  <TopListingRow
                    title="Modern Art Print"
                    price="KES 4,999"
                    views="1,503"
                    status="sold"
                    onAction={() => console.log('View clicked')}
                  />
                  <TopListingRow
                    title="Handmade Ceramic Vase"
                    price="KES 6,000"
                    views="987"
                    status="published"
                    onAction={() => console.log('Edit clicked')}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
