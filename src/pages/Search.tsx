import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, SlidersHorizontal } from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';
import { useLanguage } from '../contexts/LanguageContext';
import VideoCard from '../components/VideoCard';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { searchVideos } = useVideo();
  const { t } = useLanguage();
  const [results, setResults] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'views' | 'rating'>('relevance');
  const [filterBy, setFilterBy] = useState<'all' | 'video' | 'channel' | 'playlist'>('all');
  const [duration, setDuration] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [uploadDate, setUploadDate] = useState<'all' | 'hour' | 'today' | 'week' | 'month' | 'year'>('all');

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      const searchResults = searchVideos(query);
      setResults(searchResults);
    }
  }, [query, searchVideos]);

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      case 'views':
        return b.views - a.views;
      case 'rating':
        return (b.likes / (b.likes + b.dislikes)) - (a.likes / (a.likes + a.dislikes));
      default:
        return 0; // relevance
    }
  });

  const filteredResults = sortedResults.filter(video => {
    // Duration filter
    if (duration !== 'all') {
      const [minutes, seconds] = video.duration.split(':').map(Number);
      const totalSeconds = minutes * 60 + seconds;
      
      switch (duration) {
        case 'short':
          if (totalSeconds > 240) return false; // Under 4 minutes
          break;
        case 'medium':
          if (totalSeconds <= 240 || totalSeconds > 1200) return false; // 4-20 minutes
          break;
        case 'long':
          if (totalSeconds <= 1200) return false; // Over 20 minutes
          break;
      }
    }

    // Upload date filter
    if (uploadDate !== 'all') {
      const videoDate = new Date(video.uploadDate);
      const now = new Date();
      const diffTime = now.getTime() - videoDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      switch (uploadDate) {
        case 'hour':
          if (diffDays > 1/24) return false;
          break;
        case 'today':
          if (diffDays > 1) return false;
          break;
        case 'week':
          if (diffDays > 7) return false;
          break;
        case 'month':
          if (diffDays > 30) return false;
          break;
        case 'year':
          if (diffDays > 365) return false;
          break;
      }
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <SearchIcon className="w-6 h-6 text-vitimo-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            نتایج جستجو برای "{query}"
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {filteredResults.length} نتیجه یافت شد
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="font-bold text-gray-900 dark:text-white">فیلترها و مرتب‌سازی</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              مرتب‌سازی بر اساس
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500"
            >
              <option value="relevance">مرتبط‌ترین</option>
              <option value="date">جدیدترین</option>
              <option value="views">پربازدیدترین</option>
              <option value="rating">بهترین امتیاز</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نوع محتوا
            </label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500"
            >
              <option value="all">همه</option>
              <option value="video">ویدیو</option>
              <option value="channel">کانال</option>
              <option value="playlist">پلی‌لیست</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              مدت زمان
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500"
            >
              <option value="all">همه</option>
              <option value="short">کوتاه (زیر ۴ دقیقه)</option>
              <option value="medium">متوسط (۴-۲۰ دقیقه)</option>
              <option value="long">بلند (بالای ۲۰ دقیقه)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              زمان آپلود
            </label>
            <select
              value={uploadDate}
              onChange={(e) => setUploadDate(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500"
            >
              <option value="all">همه</option>
              <option value="hour">ساعت گذشته</option>
              <option value="today">امروز</option>
              <option value="week">هفته گذشته</option>
              <option value="month">ماه گذشته</option>
              <option value="year">سال گذشته</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div>
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResults.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <SearchIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              نتیجه‌ای یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              متأسفانه برای "{query}" نتیجه‌ای پیدا نکردیم
            </p>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p>• کلمات کلیدی مختلفی امتحان کنید</p>
              <p>• املای کلمات را بررسی کنید</p>
              <p>• فیلترهای کمتری اعمال کنید</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;