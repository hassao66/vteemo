import bcrypt from 'bcryptjs';

// Mock users data
export const users = [
  {
    id: '1',
    username: 'مدیر ویتیمو',
    email: 'admin@vitimo.com',
    password: await bcrypt.hash('admin', 12),
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    isAdmin: true,
    verified: true,
    subscribers: 0,
    subscriptions: [],
    joinDate: '2023-01-01',
    totalViews: 0,
    totalVideos: 0,
    isPremium: true,
    balance: 1000000,
    status: 'active',
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    username: 'کاربر ویتیمو',
    email: 'user@vitimo.com',
    password: await bcrypt.hash('user', 12),
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    isAdmin: false,
    verified: false,
    subscribers: 1250,
    subscriptions: [],
    joinDate: '2023-06-15',
    totalViews: 125000,
    totalVideos: 12,
    isPremium: false,
    balance: 245000,
    status: 'active',
    createdAt: '2023-06-15T00:00:00.000Z'
  },
  {
    id: '3',
    username: 'آکادمی کدنویسی',
    email: 'academy@vitimo.com',
    password: await bcrypt.hash('academy123', 12),
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
    isAdmin: false,
    verified: true,
    subscribers: 15000,
    subscriptions: [],
    joinDate: '2023-03-10',
    totalViews: 500000,
    totalVideos: 25,
    isPremium: true,
    balance: 850000,
    status: 'active',
    createdAt: '2023-03-10T00:00:00.000Z'
  }
];

// Mock videos data
export const videos = [
  {
    id: '1',
    title: 'آموزش کامل React و TypeScript - پروژه عملی ویتیمو',
    thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: '/uploads/videos/sample-video-1.mp4',
    duration: '25:45',
    views: 125000,
    uploadDate: '2024-01-15',
    channel: {
      id: '3',
      name: 'آکادمی کدنویسی',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true
    },
    description: 'در این ویدیو کامل، یاد می‌گیرید چگونه یک پلتفرم ویدیویی مشابه یوتیوب با React و TypeScript بسازید.',
    likes: 8500,
    dislikes: 120,
    category: 'Technology',
    tags: ['react', 'typescript', 'tutorial', 'programming', 'vitimo'],
    status: 'published',
    isPremium: true,
    hasSubtitles: true,
    quality: ['720p', '1080p', '1440p', '2160p'],
    monetized: true,
    earnings: 45000,
    privacy: 'public'
  },
  {
    id: '2',
    title: 'راهنمای کامل کسب درآمد از ویدیو در ویتیمو',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: '/uploads/videos/sample-video-2.mp4',
    duration: '18:30',
    views: 89000,
    uploadDate: '2024-01-12',
    channel: {
      id: '2',
      name: 'کاربر ویتیمو',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: false
    },
    description: 'یاد بگیرید چگونه از ویدیوهای خود در ویتیمو درآمد کسب کنید.',
    likes: 6200,
    dislikes: 85,
    category: 'Business',
    tags: ['monetization', 'earnings', 'business', 'vitimo'],
    status: 'published',
    hasSubtitles: true,
    quality: ['720p', '1080p'],
    monetized: true,
    earnings: 32000,
    privacy: 'public'
  }
];

// Mock live streams data
export const liveStreams = [
  {
    id: '1',
    title: 'آموزش برنامه‌نویسی React - پخش زنده',
    thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800',
    streamer: {
      id: '3',
      name: 'آکادمی کدنویسی',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true
    },
    viewers: 1250,
    isLive: true,
    category: 'Technology',
    startTime: '2024-01-15T10:00:00Z',
    description: 'آموزش کامل React از صفر تا صد',
    tags: ['react', 'programming', 'tutorial', 'live'],
    streamKey: 'live_1705320000_abc123def',
    rtmpUrl: 'rtmp://localhost:1935/live',
    chatMessages: [],
    duration: 3600,
    revenue: 15000
  }
];

// Mock transactions data
export const transactions = [
  {
    id: '1',
    userId: '2',
    user: 'کاربر ویتیمو',
    type: 'earning',
    amount: 50000,
    description: 'درآمد از ویدیو "آموزش React"',
    date: '2024-01-15',
    status: 'completed',
    videoId: '1',
    source: 'views'
  },
  {
    id: '2',
    userId: '2',
    user: 'کاربر ویتیمو',
    type: 'reward',
    amount: 25000,
    description: 'پاداش ورود روزانه',
    date: '2024-01-14',
    status: 'completed'
  },
  {
    id: '3',
    userId: '2',
    user: 'کاربر ویتیمو',
    type: 'deposit',
    amount: 100000,
    description: 'واریز از کارت بانکی',
    date: '2024-01-13',
    status: 'completed',
    paymentMethod: 'card'
  },
  {
    id: '4',
    userId: '3',
    user: 'آکادمی کدنویسی',
    type: 'withdraw',
    amount: 75000,
    description: 'برداشت به حساب بانکی',
    date: '2024-01-12',
    status: 'completed',
    bankAccount: '1234567890123456'
  }
];