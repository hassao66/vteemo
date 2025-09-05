import React from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Eye, Clock } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const dailyData = [
    { date: '2024-01-01', views: 12000, users: 1200, watchTime: 8500 },
    { date: '2024-01-02', views: 15000, users: 1400, watchTime: 9200 },
    { date: '2024-01-03', views: 11000, users: 1100, watchTime: 7800 },
    { date: '2024-01-04', views: 18000, users: 1800, watchTime: 11200 },
    { date: '2024-01-05', views: 22000, users: 2100, watchTime: 13500 },
    { date: '2024-01-06', views: 25000, users: 2300, watchTime: 15200 },
    { date: '2024-01-07', views: 28000, users: 2600, watchTime: 17800 },
  ];

  const topVideos = [
    { title: 'Amazing Sunset Timelapse', views: 2500000, duration: '3:45' },
    { title: 'Web Development Tutorial', views: 850000, duration: '15:20' },
    { title: 'Cooking Perfect Pasta', views: 1200000, duration: '8:15' },
    { title: 'Gaming Highlights', views: 680000, duration: '12:30' },
    { title: 'Travel Vlog', views: 920000, duration: '18:45' },
  ];

  const deviceData = [
    { device: 'Desktop', percentage: 45 },
    { device: 'Mobile', percentage: 40 },
    { device: 'Tablet', percentage: 15 },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Detailed insights into your platform's performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Daily Views</p>
              <p className="text-2xl font-bold text-white">28K</p>
              <p className="text-green-400 text-xs">+12% from yesterday</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">2.6K</p>
              <p className="text-green-400 text-xs">+8% from yesterday</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-600 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Watch Time</p>
              <p className="text-2xl font-bold text-white">17.8K</p>
              <p className="text-green-400 text-xs">+15% from yesterday</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Engagement Rate</p>
              <p className="text-2xl font-bold text-white">4.2%</p>
              <p className="text-green-400 text-xs">+0.3% from yesterday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Views Over Time */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Views Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Active Users */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Active Users</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Watch Time */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Total Watch Time (minutes)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="watchTime" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Usage */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Device Usage</h3>
          <div className="space-y-4">
            {deviceData.map((item) => (
              <div key={item.device}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">{item.device}</span>
                  <span className="text-white font-medium">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Videos */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Top Performing Videos</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-3 text-gray-300">Video Title</th>
                <th className="text-left p-3 text-gray-300">Views</th>
                <th className="text-left p-3 text-gray-300">Duration</th>
                <th className="text-left p-3 text-gray-300">Performance</th>
              </tr>
            </thead>
            <tbody>
              {topVideos.map((video, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-3 text-white">{video.title}</td>
                  <td className="p-3 text-gray-300">{formatNumber(video.views)}</td>
                  <td className="p-3 text-gray-300">{video.duration}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min((video.views / 2500000) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {Math.min((video.views / 2500000) * 100, 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;