import React, { createContext, useContext, useState, ReactNode } from 'react';
import { videosAPI } from '../services/api';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploadDate: string;
  channel: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  description: string;
  likes: number;
  dislikes: number;
  category: string;
  tags: string[];
  status: 'published' | 'pending' | 'rejected';
  isPremium?: boolean;
  hasSubtitles?: boolean;
  quality: string[];
  monetized?: boolean;
  earnings?: number;
}

interface VideoContextType {
  videos: Video[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  getVideoById: (id: string) => Video | undefined;
  addVideo: (video: Omit<Video, 'id' | 'uploadDate' | 'views' | 'likes' | 'dislikes'>) => void;
  updateVideoStatus: (id: string, status: Video['status']) => void;
  deleteVideo: (id: string) => void;
  searchVideos: (query: string) => Video[];
  fetchVideos: (params?: any) => Promise<void>;
  likeVideo: (id: string) => Promise<void>;
  dislikeVideo: (id: string) => Promise<void>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'آموزش کامل React و TypeScript - پروژه عملی ویتیمو',
    thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '25:45',
    views: 125000,
    uploadDate: '2024-01-15',
    channel: {
      id: 'ch1',
      name: 'آکادمی کدنویسی',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true
    },
    description: 'در این ویدیو کامل، یاد می‌گیرید چگونه یک پلتفرم ویدیویی مشابه یوتیوب با React و TypeScript بسازید. شامل تمام ویژگی‌های پیشرفته مانند پخش زنده، کیف پول و پنل مدیریت.',
    likes: 8500,
    dislikes: 120,
    category: 'Technology',
    tags: ['react', 'typescript', 'tutorial', 'programming', 'vitimo'],
    status: 'published',
    isPremium: true,
    hasSubtitles: true,
    quality: ['720p', '1080p', '1440p', '2160p'],
    monetized: true,
    earnings: 45000
  },
  {
    id: '2',
    title: 'راهنمای کامل کسب درآمد از ویدیو در ویتیمو',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '18:30',
    views: 89000,
    uploadDate: '2024-01-12',
    channel: {
      id: 'ch2',
      name: 'کسب و کار دیجیتال',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true
    },
    description: 'یاد بگیرید چگونه از ویدیوهای خود در ویتیمو درآمد کسب کنید. از تنظیمات کسب درآمد تا استراتژی‌های افزایش بازدید.',
    likes: 6200,
    dislikes: 85,
    category: 'Business',
    tags: ['monetization', 'earnings', 'business', 'vitimo'],
    status: 'published',
    hasSubtitles: true,
    quality: ['720p', '1080p'],
    monetized: true,
    earnings: 32000
  },
  {
    id: '3',
    title: 'پخش زنده: بررسی آیفون ۱۵ پرو مکس',
    thumbnail: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '45:20',
    views: 234000,
    uploadDate: '2024-01-10',
    channel: {
      id: 'ch3',
      name: 'تک‌ریویو',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true
    },
    description: 'بررسی کامل و جامع آیفون ۱۵ پرو مکس در پخش زنده. تست‌های عملکرد، دوربین، باتری و مقایسه با رقبا.',
    likes: 15600,
    dislikes: 340,
    category: 'Technology',
    tags: ['iphone', 'review', 'technology', 'live'],
    status: 'published',
    hasSubtitles: true,
    quality: ['720p', '1080p', '1440p'],
    monetized: true,
    earnings: 78000
  },
  {
    id: '4',
    title: 'پادکست: آینده هوش مصنوعی در ایران',
    thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '52:15',
    views: 67000,
    uploadDate: '2024-01-08',
    channel: {
      id: 'ch4',
      name: 'پادکست تکنولوژی',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: false
    },
    description: 'گفتگو با متخصصان هوش مصنوعی درباره آینده این تکنولوژی در ایران و فرصت‌های شغلی آن.',
    likes: 4200,
    dislikes: 45,
    category: 'Technology',
    tags: ['ai', 'podcast', 'technology', 'iran', 'future'],
    status: 'published',
    hasSubtitles: true,
    quality: ['720p', '1080p'],
    monetized: true,
    earnings: 28000
  },
  {
    id: '5',
    title: 'آموزش آشپزی: کباب کوبیده اصل ایرانی',
    thumbnail: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '15:40',
    views: 156000,
    uploadDate: '2024-01-05',
    channel: {
      id: 'ch5',
      name: 'آشپزخانه مامان',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true
    },
    description: 'یاد بگیرید چگونه کباب کوبیده اصل ایرانی درست کنید. از انتخاب گوشت تا نکات پخت روی آتش.',
    likes: 12400,
    dislikes: 180,
    category: 'Cooking',
    tags: ['cooking', 'iranian', 'kebab', 'recipe'],
    status: 'published',
    hasSubtitles: false,
    quality: ['720p', '1080p'],
    monetized: true,
    earnings: 52000
  },
  {
    id: '6',
    title: 'بازی FIFA 24 - مسابقه آنلاین با بینندگان',
    thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '1:35:20',
    views: 89000,
    uploadDate: '2024-01-03',
    channel: {
      id: 'ch6',
      name: 'گیمر پرو',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true
    },
    description: 'مسابقه آنلاین FIFA 24 با بینندگان. شما هم می‌تونید شرکت کنید و جایزه ببرید!',
    likes: 7800,
    dislikes: 95,
    category: 'Gaming',
    tags: ['fifa', 'gaming', 'online', 'competition'],
    status: 'published',
    isPremium: false,
    hasSubtitles: false,
    quality: ['720p', '1080p', '1440p'],
    monetized: true,
    earnings: 35000
  }
];

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Home');

  const fetchVideos = async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await videosAPI.getVideos(params);
      if (response.success && response.data?.videos) {
        setVideos(response.data.videos);
      }
    } catch (err: any) {
      setError(err.message || 'خطا در دریافت ویدیوها');
    } finally {
      setLoading(false);
    }
  };

  const likeVideo = async (id: string) => {
    try {
      const response = await videosAPI.likeVideo(id);
      if (response.success) {
        setVideos(prev => prev.map(video => 
          video.id === id 
            ? { ...video, likes: response.data?.likes || video.likes + 1 }
            : video
        ));
      }
    } catch (err: any) {
      console.error('Like video error:', err);
    }
  };

  const dislikeVideo = async (id: string) => {
    try {
      const response = await videosAPI.dislikeVideo(id);
      if (response.success) {
        setVideos(prev => prev.map(video => 
          video.id === id 
            ? { ...video, dislikes: response.data?.dislikes || video.dislikes + 1 }
            : video
        ));
      }
    } catch (err: any) {
      console.error('Dislike video error:', err);
    }
  };

  const getVideoById = (id: string) => videos.find(video => video.id === id);

  const addVideo = (videoData: Omit<Video, 'id' | 'uploadDate' | 'views' | 'likes' | 'dislikes'>) => {
    const newVideo: Video = {
      ...videoData,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      dislikes: 0,
    };
    setVideos(prev => [newVideo, ...prev]);
  };

  const updateVideoStatus = (id: string, status: Video['status']) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, status } : video
    ));
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  };

  const searchVideos = (query: string) => {
    return videos.filter(video => 
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      video.channel.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const value = {
    videos,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    getVideoById,
    addVideo,
    updateVideoStatus,
    deleteVideo,
    searchVideos,
    fetchVideos,
    likeVideo,
    dislikeVideo
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};