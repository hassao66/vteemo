import React, { useState } from 'react';
import { Mic, Play, Pause, SkipBack, SkipForward, Volume2, Heart, Share, Download } from 'lucide-react';
import PodcastCard from '../components/PodcastCard';
import { useLanguage } from '../contexts/LanguageContext';

const Podcasts: React.FC = () => {
  const { t } = useLanguage();
  const [currentPodcast, setCurrentPodcast] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(2730); // 45:30 in seconds

  const podcasts = [
    {
      id: '1',
      title: 'پادکست تکنولوژی ویتیمو',
      description: 'آخرین اخبار و تحلیل‌های دنیای تکنولوژی',
      thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400',
      host: 'علی احمدی',
      episodes: 25,
      duration: '45:30',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'کسب و کار دیجیتال',
      description: 'راهنمای موفقیت در کسب و کار آنلاین',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      host: 'سارا محمدی',
      episodes: 18,
      duration: '38:15',
      category: 'Business'
    },
    {
      id: '3',
      title: 'سلامت و تندرستی',
      description: 'نکات طلایی برای زندگی سالم',
      thumbnail: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=400',
      host: 'دکتر رضا کریمی',
      episodes: 32,
      duration: '42:20',
      category: 'Health'
    },
    {
      id: '4',
      title: 'داستان‌های شب',
      description: 'داستان‌های جذاب برای خواب راحت',
      thumbnail: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400',
      host: 'مریم نوری',
      episodes: 45,
      duration: '25:10',
      category: 'Entertainment'
    }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-vitimo rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Mic className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">پادکست‌های ویتیمو</h1>
            <p className="text-purple-100">مجموعه‌ای از بهترین پادکست‌های فارسی</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-purple-100 text-sm">کل پادکست‌ها</p>
            <p className="text-2xl font-bold">{podcasts.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-purple-100 text-sm">کل قسمت‌ها</p>
            <p className="text-2xl font-bold">{podcasts.reduce((sum, p) => sum + p.episodes, 0)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-purple-100 text-sm">ساعات محتوا</p>
            <p className="text-2xl font-bold">۱۲۰+</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-purple-100 text-sm">مشترکین</p>
            <p className="text-2xl font-bold">۱۵K</p>
          </div>
        </div>
      </div>

      {/* Podcast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {podcasts.map(podcast => (
          <div
            key={podcast.id}
            onClick={() => setCurrentPodcast(podcast)}
            className="cursor-pointer"
          >
            <PodcastCard podcast={podcast} />
          </div>
        ))}
      </div>

      {/* Podcast Player */}
      {currentPodcast && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-2xl z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              {/* Podcast Info */}
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <img
                  src={currentPodcast.thumbnail}
                  alt={currentPodcast.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white truncate">
                    {currentPodcast.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {currentPodcast.host}
                  </p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <SkipBack className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="p-3 bg-gradient-vitimo text-white rounded-full hover:shadow-vitimo transition-all transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>
                
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <SkipForward className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Progress */}
              <div className="flex-1 max-w-md">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Volume and Actions */}
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="w-20 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Heart className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Share className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Podcasts;