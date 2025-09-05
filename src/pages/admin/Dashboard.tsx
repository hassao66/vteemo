import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Users, Video, Eye, TrendingUp, DollarSign, Radio, 
  Mic, Crown, Wallet, Play, Calendar 
} from 'lucide-react';
import { useVideo } from '../../contexts/VideoContext';
import { useWallet } from '../../contexts/WalletContext';
import { useLive } from '../../contexts/LiveContext';

const AdminDashboard: React.FC = () => {
  const { videos } = useVideo();
  const { balance, transactions } = useWallet();
  const { liveStreams } = useLive();

  const totalVideos = videos.length;
  const publishedVideos = videos.filter(v => v.status === 'published').length;
  const pendingVideos = videos.filter(v => v.status === 'pending').length;
  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  const totalEarnings = videos.reduce((sum, video) => sum + (video.earnings || 0), 0);
  const activeLiveStreams = liveStreams.filter(s => s.isLive).length;
  const totalUsers = 1250; // Mock data

  const monthlyData = [
    { month: 'فروردین', views: 120000, uploads: 45, earnings: 2500000, users: 1100 },
    { month: 'اردیبهشت', views: 150000, uploads: 52, earnings: 3200000, users: 1150 },
    { month: 'خرداد', views: 180000, uploads: 61, earnings: 4100000, users: 1200 },
    { month: 'تیر', views: 220000, uploads: 58, earnings: 4800000, users: 1220 },
    { month: 'مرداد', views: 250000, uploads: 67, earnings: 5500000, users: 1240 },
    { month: 'شهریور', views: 290000, uploads: 73, earnings: 6200000, users: 1250 },
  ];

  const categoryData = [
    { name: 'تکنولوژی', value: 35, color: '#6A0DAD' },
    { name: 'بازی', value: 25, color: '#FFD700' },
    { name: 'آموزش', value: 20, color: '#4ECDC4' },
    { name: 'سرگرمی', value: 12, color: '#FF6B6B' },
    { name: 'سایر', value: 8, color: '#95A5A6' },
  ];

  const revenueData = [
    { source: 'تبلیغات', amount: 4500000, percentage: 45 },
    { source: 'اشتراک پریمیوم', amount: 3200000, percentage: 32 },
    { source: 'پاداش‌ها', amount: 1500000, percentage: 15 },
    { source: 'کمیسیون', amount: 800000, percentage: 8 },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          داشبورد مدیریت ویتیمو
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          
          نمای کلی از عملکرد پلتفرم و آمار کلیدی
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">کل ویدیوها</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalVideos}</p>
              <p className="text-blue-500 dark:text-blue-400 text-xs">+{pendingVideos} در انتظار</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">کل کاربران</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{formatNumber(totalUsers)}</p>
              <p className="text-green-500 dark:text-green-400 text-xs">+12% این ماه</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-vitimo-500 rounded-xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-vitimo-600 dark:text-vitimo-400 text-sm font-medium">کل بازدیدها</p>
              <p className="text-3xl font-bold text-vitimo-700 dark:text-vitimo-300">{formatNumber(totalViews)}</p>
              <p className="text-vitimo-500 dark:text-vitimo-400 text-xs">+8% این هفته</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900/20 dark:to-gold-800/20 rounded-xl p-6 border border-gold-200 dark:border-gold-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gold-500 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gold-600 dark:text-gold-400 text-sm font-medium">درآمد کل</p>
              <p className="text-3xl font-bold text-gold-700 dark:text-gold-300">
                {formatCurrency(totalEarnings)} ریال
              </p>
              <p className="text-gold-500 dark:text-gold-400 text-xs">+25% این ماه</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Radio className="w-6 h-6 text-red-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">پخش زنده</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">فعال</span>
              <span className="font-bold text-red-500">{activeLiveStreams}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">کل استریم‌ها</span>
              <span className="font-bold text-gray-900 dark:text-white">{liveStreams.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">بینندگان آنلاین</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {liveStreams.reduce((sum, s) => sum + s.viewers, 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Crown className="w-6 h-6 text-gold-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">اشتراک پریمیوم</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">مشترکین فعال</span>
              <span className="font-bold text-gold-500">245</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">درآمد ماهانه</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(4850000)} ریال
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">نرخ تبدیل</span>
              <span className="font-bold text-gray-900 dark:text-white">12.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Wallet className="w-6 h-6 text-vitimo-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">کیف پول</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">موجودی کل</span>
              <span className="font-bold text-vitimo-500">
                {formatCurrency(balance)} ریال
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">تراکنش‌های امروز</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {transactions.filter(t => t.date === new Date().toISOString().split('T')[0]).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">درآمد امروز</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(125000)} ریال
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Views */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">بازدیدهای ماهانه</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#6A0DAD"
                fill="#6A0DAD"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">درآمد ماهانه (ریال)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }}
                formatter={(value: any) => [`${formatCurrency(value)} ریال`, 'درآمد']}
              />
              <Line type="monotone" dataKey="earnings" stroke="#FFD700" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">توزیع محتوا بر اساس دسته</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">منابع درآمد</h3>
          <div className="space-y-4">
            {revenueData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{item.source}</span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(item.amount)} ریال
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-vitimo h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">فعالیت‌های اخیر</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">ویدیو جدید آپلود شد</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">توسط آکادمی کدنویسی • ۲ ساعت پیش</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">کاربر جدید ثبت نام کرد</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">محمد رضایی • ۴ ساعت پیش</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gold-50 dark:bg-gold-900/20 rounded-xl">
              <div className="w-3 h-3 bg-gold-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">اشتراک پریمیوم خریداری شد</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">سارا احمدی • ۶ ساعت پیش</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">پخش زنده شروع شد</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">گیمر پرو • ۸ ساعت پیش</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Videos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">ویدیوهای برتر</h3>
          <div className="space-y-4">
            {videos
              .filter(v => v.status === 'published')
              .sort((a, b) => b.views - a.views)
              .slice(0, 5)
              .map((video, index) => (
                <div key={video.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-vitimo rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-16 h-10 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {video.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{formatNumber(video.views)} بازدید</span>
                      <span>•</span>
                      <span>{formatCurrency(video.earnings || 0)} ریال</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;