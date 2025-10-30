'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface SalesChartProps {
  period: '7days' | '30days' | '90days';
}

export default function SalesChart({ period }: SalesChartProps) {
  // Color palette for different bars
  const colors = [
    '#2563EB', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
  ];

  // Mock views data based on period
  const getData = () => {
    switch (period) {
      case '7days':
        return [
          { day: 'Mon', views: 4200 },
          { day: 'Tue', views: 3800 },
          { day: 'Wed', views: 5100 },
          { day: 'Thu', views: 4600 },
          { day: 'Fri', views: 6200 },
          { day: 'Sat', views: 7800 },
          { day: 'Sun', views: 6900 },
        ].map((item, index) => ({
          ...item,
          color: colors[index % colors.length],
        }));
      case '30days':
        return Array.from({ length: 4 }, (_, i) => ({
          week: `Week ${i + 1}`,
          views: Math.floor(Math.random() * 20000) + 15000,
          color: colors[i % colors.length],
        }));
      case '90days':
        return Array.from({ length: 3 }, (_, i) => ({
          month: `Month ${i + 1}`,
          views: Math.floor(Math.random() * 50000) + 40000,
          color: colors[i % colors.length],
        }));
      default:
        return [];
    }
  };

  const data = getData();
  
  // Ensure data is defined before using it
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-700 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
        <div className="text-gray-400 text-sm">No data available</div>
      </div>
    );
  }

  const getKey = () => {
    switch (period) {
      case '7days':
        return 'day';
      case '30days':
        return 'week';
      case '90days':
        return 'month';
      default:
        return 'day';
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey={getKey()}
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#D1D5DB' }}
          formatter={(value: number) => [`${value.toLocaleString()} views`, 'Views']}
        />
        <Bar dataKey="views" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#2563EB'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

