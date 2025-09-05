import React, { useState } from 'react';
import { List, Plus, Play, Lock, Globe, Users, Eye, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  totalDuration: string;
  privacy: 'public' | 'unlisted' | 'private';
  createdAt: string;
  views: number;
  creator: {
    name: string;
    avatar: string;
  };
}

const Playlists: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    description: '',
    privacy: 'public' as const
  });

  const [playlists] = useState<Playlist[]>([
    {
      id: '1',
      title: 'آموزش‌های برنامه‌نویسی',
      description: 'مجموعه کاملی از آموزش‌های برنامه‌نویسی',
      thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoCount: 15,
      totalDuration: '6:45:30',
      privacy: 'public',
      createdAt: '2024-01-10',
      views: 25000,
      creator: {
        name: 'آکادمی کدنویسی',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    },
    {
      id: '2',
      title: 'پادکست‌های تکنولوژی',
      description: 'بهترین پادکست‌های حوزه تکنولوژی',
      thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoCount: 8,
      totalDuration: '4:20:15',
      privacy: 'public',
      createdAt: '2024-01-05',
      views: 12000,
      creator: {
        name: 'پادکست تکنولوژی',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    },
    {
      id: '3',
      title: 'ویدیوهای آشپزی',
      description: 'دستور پخت غذاهای محلی و بین‌المللی',
      thumbnail: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoCount: 22,
      totalDuration: '8:15:45',
      privacy: 'public',
      createdAt: '2023-12-20',
      views: 45000,
      creator: {
        name: 'آشپزخانه مامان',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    }
  ]);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    // Create playlist logic here
    setShowCreateForm(false);
    setNewPlaylist({ title: '', description: '', privacy: 'public' });
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return <Globe className="w-4 h-4 text-green-500" />;
      case 'unlisted':
        return <Users className="w-4 h-4 text-yellow-500" />;
      case 'private':
        return <Lock className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getPrivacyText = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return 'عمومی';
      case 'unlisted':
        return 'غیرفهرست';
      case 'private':
        return 'خصوصی';
      default:
        return '';
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)} میلیون`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)} هزار`;
    }
    return views.toString();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-vitimo rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <List className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">پلی‌لیست‌های ویتیمو</h1>
                <p className="text-purple-100">مجموعه‌های منظم از ویدیوها و پادکست‌ها</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-purple-100">
              <div className="flex items-center space-x-2">
                <List className="w-5 h-5" />
                <span>{playlists.length} پلی‌لیست</span>
              </div>
              <div className="flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>{playlists.reduce((sum, p) => sum + p.videoCount, 0)} ویدیو</span>
              </div>
            </div>
          </div>
          
          {isAuthenticated && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>ایجاد پلی‌لیست</span>
            </button>
          )}
        </div>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            ایجاد پلی‌لیست جدید
          </h2>
          
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان پلی‌لیست
                </label>
                <input
                  type="text"
                  value={newPlaylist.title}
                  onChange={(e) => setNewPlaylist({...newPlaylist, title: e.target.value})}
                  placeholder="عنوان پلی‌لیست خود را وارد کنید"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  حریم خصوصی
                </label>
                <select
                  value={newPlaylist.privacy}
                  onChange={(e) => setNewPlaylist({...newPlaylist, privacy: e.target.value as any})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500"
                >
                  <option value="public">عمومی</option>
                  <option value="unlisted">غیرفهرست</option>
                  <option value="private">خصوصی</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                توضیحات
              </label>
              <textarea
                value={newPlaylist.description}
                onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
                placeholder="توضیحی درباره پلی‌لیست خود بنویسید"
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 resize-none"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl transition-colors"
              >
                لغو
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-vitimo text-white rounded-xl font-bold hover:shadow-vitimo transition-all transform hover:scale-105"
              >
                ایجاد پلی‌لیست
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-vitimo-300 dark:hover:border-vitimo-600 transition-all duration-300 group"
          >
            <div className="relative">
              <img
                src={playlist.thumbnail}
                alt={playlist.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                    <Play className="w-8 h-8 text-white fill-current" />
                  </div>
                </div>
              </div>

              {/* Video Count */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-3 py-1 rounded text-sm font-medium">
                {playlist.videoCount} ویدیو
              </div>

              {/* Privacy Icon */}
              <div className="absolute top-2 left-2 bg-black/80 text-white p-2 rounded-lg">
                {getPrivacyIcon(playlist.privacy)}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
                {playlist.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                {playlist.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{formatViews(playlist.views)} بازدید</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{playlist.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={playlist.creator.avatar}
                    alt={playlist.creator.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {playlist.creator.name}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getPrivacyIcon(playlist.privacy)}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getPrivacyText(playlist.privacy)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    مدت کل: {playlist.totalDuration}
                  </span>
                  <button className="text-vitimo-600 dark:text-vitimo-400 hover:underline font-medium">
                    پخش همه
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && (
        <div className="text-center py-16">
          <List className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            هنوز پلی‌لیستی ایجاد نشده
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            اولین پلی‌لیست خود را ایجاد کنید
          </p>
          {isAuthenticated && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-vitimo text-white px-8 py-4 rounded-xl font-bold hover:shadow-vitimo transition-all transform hover:scale-105"
            >
              ایجاد پلی‌لیست
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Playlists;