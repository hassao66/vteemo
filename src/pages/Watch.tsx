import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ThumbsUp, ThumbsDown, Share, Download, CheckCircle, 
  Bell, Flag, MoreHorizontal, Heart, Bookmark, Crown,
  Eye, Calendar, Tag
} from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import VideoPlayer from '../components/VideoPlayer';
import VideoCard from '../components/VideoCard';

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getVideoById, videos } = useVideo();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  
  const video = getVideoById(id!);

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">ویدیو یافت نشد</p>
      </div>
    );
  }

  const relatedVideos = videos
    .filter(v => v.id !== video.id && v.status === 'published')
    .slice(0, 12);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)} میلیون`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)} هزار`;
    }
    return views.toString();
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // Add comment logic here
      setComment('');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Video Player */}
          <VideoPlayer video={video} autoplay={true} />

          {/* Video Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {video.title}
            </h1>
            
            {/* Video Stats */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{formatViews(video.views)} بازدید</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{video.uploadDate}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    isLiked
                      ? 'bg-vitimo-100 dark:bg-vitimo-900 text-vitimo-600 dark:text-vitimo-400'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{formatViews(video.likes)}</span>
                </button>
                
                <button
                  onClick={handleDislike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    isDisliked
                      ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{formatViews(video.dislikes)}</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all">
                  <Share className="w-4 h-4" />
                  <span className="font-medium">اشتراک</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all">
                  <Download className="w-4 h-4" />
                  <span className="font-medium">دانلود</span>
                </button>

                <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Channel Info */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center space-x-4">
                <Link to={`/profile/${video.channel.id}`}>
                  <img
                    src={video.channel.avatar}
                    alt={video.channel.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-vitimo-500 transition-colors"
                  />
                </Link>
                <div>
                  <div className="flex items-center space-x-2">
                    <Link 
                      to={`/profile/${video.channel.id}`}
                      className="font-bold text-gray-900 dark:text-white hover:text-vitimo-600 transition-colors"
                    >
                      {video.channel.name}
                    </Link>
                    {video.channel.verified && (
                      <CheckCircle className="w-5 h-5 text-vitimo-500" />
                    )}
                    {video.isPremium && (
                      <Crown className="w-4 h-4 text-gold-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ۱.۲ میلیون مشترک
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-xl transition-colors">
                  <Bell className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                    isSubscribed
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      : 'bg-gradient-vitimo text-white shadow-vitimo'
                  }`}
                >
                  {isSubscribed ? 'عضو شده' : 'اشتراک'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${
                showDescription ? '' : 'line-clamp-3'
              }`}>
                {video.description}
              </p>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-vitimo-600 dark:text-vitimo-400 font-medium mt-2 hover:underline"
              >
                {showDescription ? 'کمتر نشان بده' : 'بیشتر نشان بده'}
              </button>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {video.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="flex items-center space-x-1 text-xs bg-vitimo-100 dark:bg-vitimo-900 text-vitimo-700 dark:text-vitimo-300 px-3 py-1 rounded-full hover:bg-vitimo-200 dark:hover:bg-vitimo-800 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3 h-3" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              نظرات ({video.likes + video.dislikes})
            </h3>
            
            {isAuthenticated && (
              <form onSubmit={handleComment} className="mb-8">
                <div className="flex space-x-4">
                  <img
                    src={user?.avatar}
                    alt={user?.username}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t('video.addComment')}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={!comment.trim()}
                        className="px-6 py-2 bg-gradient-vitimo text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-vitimo transition-all transform hover:scale-105"
                      >
                        {t('video.comment')}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Sample Comments */}
            <div className="space-y-6">
              <div className="flex space-x-4">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">علی احمدی</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">۲ روز پیش</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    ویدیو فوق‌العاده‌ای بود! خیلی مفید و آموزنده. ممنون از زحماتتون 👏
                  </p>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-vitimo-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>۱۲</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-vitimo-600 transition-colors text-sm font-medium">
                      پاسخ
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <img
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">سارا محمدی</span>
                    <CheckCircle className="w-4 h-4 text-vitimo-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">۱ روز پیش</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    عالی بود! منتظر ویدیوهای بعدی هستم. کیفیت تصویر هم فوق‌العاده بود 🔥
                  </p>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-vitimo-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>۸</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-vitimo-600 transition-colors text-sm font-medium">
                      پاسخ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with related videos */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              ویدیوهای مرتبط
            </h3>
            <div className="space-y-4">
              {relatedVideos.slice(0, 6).map(relatedVideo => (
                <div key={relatedVideo.id} className="flex space-x-3 group">
                  <Link to={`/watch/${relatedVideo.id}`} className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        className="w-32 h-20 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                        {relatedVideo.duration}
                      </span>
                      {relatedVideo.isPremium && (
                        <Crown className="absolute top-1 left-1 w-4 h-4 text-gold-400" />
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/watch/${relatedVideo.id}`}>
                      <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-vitimo-600 transition-colors text-sm leading-tight">
                        {relatedVideo.title}
                      </h4>
                    </Link>
                    <Link 
                      to={`/profile/${relatedVideo.channel.id}`}
                      className="text-gray-600 dark:text-gray-400 text-xs hover:text-gray-900 dark:hover:text-white transition-colors mt-1 block"
                    >
                      {relatedVideo.channel.name}
                    </Link>
                    <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      {formatViews(relatedVideo.views)} بازدید
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Promotion */}
          <div className="bg-gradient-gold rounded-xl p-6 text-gray-900">
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="w-8 h-8" />
              <h3 className="text-xl font-bold">ویتیمو پریمیوم</h3>
            </div>
            <p className="mb-4 opacity-90">
              تماشای بدون تبلیغات، کیفیت 4K و محتوای اختصاصی
            </p>
            <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
              آزمایش رایگان
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;