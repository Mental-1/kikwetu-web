'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  condition: string;
  location: string;
  views: string;
  image: string;
}

interface ListingsResponse {
  data: Listing[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
}

interface UseListingsParams {
  searchQuery?: string;
  filters?: Record<string, any>;
  sortBy?: string;
}

// Mock API function - replace with actual API call
async function fetchListings(
  cursor: string | null,
  params: UseListingsParams
): Promise<ListingsResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const allListings: Listing[] = [
    { id: 1, title: 'MacBook Pro 16"', description: 'Powerful laptop perfect for professionals and creatives. Excellent condition with minimal wear. Great for video editing and software development.', price: 'KES 165,000', condition: 'USED', location: 'Nairobi, KE', views: '245', image: '/placeholder-laptop-1.jpg' },
    { id: 2, title: 'Dell XPS 15 Gaming', description: 'High-performance gaming laptop with excellent graphics capabilities. Recently refurbished. Perfect for gamers and content creators.', price: 'KES 130,000', condition: 'REFURBISHED', location: 'Mombasa, KE', views: '189', image: '/placeholder-laptop-2.jpg' },
    { id: 3, title: 'Surface Laptop 4', description: 'Sleek and portable laptop with touchscreen functionality. Perfect for students and professionals. Lightweight and powerful.', price: 'KES 95,000', condition: 'NEW', location: 'Nairobi, KE', views: '312', image: '/placeholder-laptop-3.jpg' },
    { id: 4, title: 'HP Spectre x360', description: 'Convertible laptop with 360-degree hinge. Great for both work and entertainment. Excellent display and build quality.', price: 'KES 112,000', condition: 'USED', location: 'Kisumu, KE', views: '156', image: '/placeholder-laptop-4.jpg' },
    { id: 5, title: 'Lenovo ThinkPad X1', description: 'Business-class laptop known for durability and performance. Excellent keyboard and build quality. Great for office work.', price: 'KES 145,000', condition: 'USED', location: 'Nakuru, KE', views: '203', image: '/placeholder-laptop-5.jpg' },
    { id: 6, title: 'ASUS ROG Zephyrus', description: 'Gaming laptop with powerful graphics and RGB lighting. Perfect for gaming enthusiasts. Great cooling system.', price: 'KES 190,000', condition: 'NEW', location: 'Nairobi, KE', views: '278', image: '/placeholder-laptop-6.jpg' },
    { id: 7, title: 'Razer Blade 15', description: 'Premium gaming laptop with sleek design and powerful performance. Excellent for content creation and gaming.', price: 'KES 172,000', condition: 'USED', location: 'Mombasa, KE', views: '167', image: '/placeholder-laptop-7.jpg' },
    { id: 8, title: 'Google Pixelbook Go', description: 'Lightweight Chromebook perfect for web browsing and productivity. Great battery life and fast boot times.', price: 'KES 82,000', condition: 'REFURBISHED', location: 'Eldoret, KE', views: '134', image: '/placeholder-laptop-8.jpg' },
    { id: 9, title: 'Acer Predator Helios', description: 'High-end gaming laptop with NVIDIA RTX graphics. Excellent for serious gamers and video editors.', price: 'KES 145,000', condition: 'USED', location: 'Thika, KE', views: '198', image: '/placeholder-laptop-1.jpg' },
    { id: 10, title: 'MSI GS66 Stealth', description: 'Thin and light gaming laptop with powerful internals. Great portability without compromising performance.', price: 'KES 180,000', condition: 'NEW', location: 'Nairobi, KE', views: '267', image: '/placeholder-laptop-2.jpg' },
    { id: 11, title: 'MacBook Air M2', description: 'Ultra-portable laptop with M2 chip. Excellent battery life and performance for everyday tasks.', price: 'KES 120,000', condition: 'USED', location: 'Kisumu, KE', views: '342', image: '/placeholder-laptop-3.jpg' },
    { id: 12, title: 'Dell Latitude 7420', description: 'Business laptop with enterprise-grade security. Perfect for corporate environments and professionals.', price: 'KES 98,000', condition: 'USED', location: 'Eldoret, KE', views: '156', image: '/placeholder-laptop-4.jpg' },
    { id: 13, title: 'HP Envy x360', description: '2-in-1 convertible laptop with AMD Ryzen processor. Great versatility and value for money.', price: 'KES 87,000', condition: 'REFURBISHED', location: 'Mombasa, KE', views: '178', image: '/placeholder-laptop-5.jpg' },
    { id: 14, title: 'Lenovo Yoga 9i', description: 'Premium convertible laptop with OLED display. Excellent for creative professionals and multimedia.', price: 'KES 135,000', condition: 'NEW', location: 'Nakuru, KE', views: '223', image: '/placeholder-laptop-6.jpg' },
    { id: 15, title: 'ASUS VivoBook Pro', description: 'Creative laptop with powerful processor and great display. Perfect for students and professionals.', price: 'KES 95,000', condition: 'USED', location: 'Nairobi, KE', views: '189', image: '/placeholder-laptop-7.jpg' },
    { id: 16, title: 'Surface Laptop Studio', description: 'Innovative laptop with flexible hinge design. Great for drawing, note-taking, and multitasking.', price: 'KES 155,000', condition: 'USED', location: 'Thika, KE', views: '145', image: '/placeholder-laptop-8.jpg' },
    { id: 17, title: 'Dell Alienware m15', description: 'High-performance gaming laptop with extreme graphics. Built for hardcore gamers and content creators.', price: 'KES 210,000', condition: 'NEW', location: 'Nairobi, KE', views: '298', image: '/placeholder-laptop-1.jpg' },
    { id: 18, title: 'MacBook Pro 14" M3', description: 'Latest MacBook with M3 chip. Exceptional performance for professionals and creative work.', price: 'KES 195,000', condition: 'NEW', location: 'Kisumu, KE', views: '367', image: '/placeholder-laptop-2.jpg' },
    { id: 19, title: 'Lenovo Legion 5', description: 'Gaming laptop with excellent price-to-performance ratio. Great for budget-conscious gamers.', price: 'KES 105,000', condition: 'USED', location: 'Mombasa, KE', views: '234', image: '/placeholder-laptop-3.jpg' },
    { id: 20, title: 'HP Omen 15', description: 'Powerful gaming laptop with great cooling. Excellent for demanding games and applications.', price: 'KES 125,000', condition: 'REFURBISHED', location: 'Eldoret, KE', views: '156', image: '/placeholder-laptop-4.jpg' },
    { id: 21, title: 'ASUS ZenBook 13', description: 'Ultra-thin laptop with powerful internals. Great for professionals on the go.', price: 'KES 88,000', condition: 'USED', location: 'Nairobi, KE', views: '198', image: '/placeholder-laptop-5.jpg' },
    { id: 22, title: 'Dell XPS 13', description: 'Compact laptop with premium build quality. Excellent display and keyboard for professionals.', price: 'KES 108,000', condition: 'USED', location: 'Nakuru, KE', views: '267', image: '/placeholder-laptop-6.jpg' },
    { id: 23, title: 'MacBook Pro 13" M2', description: 'Compact MacBook with excellent performance. Perfect for students and professionals.', price: 'KES 140,000', condition: 'NEW', location: 'Thika, KE', views: '289', image: '/placeholder-laptop-7.jpg' },
    { id: 24, title: 'MSI Prestige 14', description: 'Creator-focused laptop with excellent display. Great for photo and video editing.', price: 'KES 135,000', condition: 'USED', location: 'Nairobi, KE', views: '234', image: '/placeholder-laptop-8.jpg' },
  ];

  const pageSize = 8;
  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + pageSize;
  const paginatedListings = allListings.slice(startIndex, endIndex);
  
  return {
    data: paginatedListings,
    nextCursor: endIndex < allListings.length ? endIndex.toString() : null,
    hasMore: endIndex < allListings.length,
    totalCount: allListings.length
  };
}

export function useListingsInfinite(query: UseListingsParams) {
  return useInfiniteQuery({
    queryKey: ['listings', JSON.stringify(query)],
    queryFn: ({ pageParam }) => fetchListings(pageParam, query),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
  });
}
