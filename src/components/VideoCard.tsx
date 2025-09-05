import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, Crown, Play, Clock, Eye, Heart, 
  Share, Download, MoreVertical, Bookmark 
} from 'lucide-react';
import { Video } from '../contexts/VideoContext';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoCardProps {
  video: Video;
  size?: 'small' | 'medium' | 'large';
}

const VideoCard: React.FC<VideoCardProps> = ({ video, size = 'medium' }) => {
  const { t, language } = useLanguage();
  const [showActions, setShowActions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const formatViews = (views: number) => {
    if (language === 'fa') {
      if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)} میلیون ${t('video.views')}`;
      } else if (views >= 1000) {
        return `${(views / 1000).toFixed(1)} هزار ${t('video.views')}`;
      }
      return `${views} ${t('video.views')}`;
    } else {
      if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M ${t('video.views')}`;
      } else if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K ${t('video.views')}`;
      }
      return `${views} ${t('video.views')}`;
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - videoDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (language === 'fa') {
      if (diffDays === 1) return '۱ روز پیش';
      if (diffDays < 7) return `${diffDays} روز پیش`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} هفته پیش`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} ماه پیش`;
      return `${Math.floor(diffDays / 365)} سال پیش`;
    } else {
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    }
  };

  const sizeClasses = {
    small: 'h-32',
    medium: 'h-48',
    large: 'h-64'
  };

  return (
    <div 
      className="video-card vitimo-card overflow-hidden group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Link to={`/watch/${video.id}`}>
        <div className="relative group/thumbnail">
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full object-cover transition-transform duration-300 group-hover/thumbnail:scale-105 ${sizeClasses[size]}`}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover/thumbnail:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Play className="w-8 h-8 text-white fill-current" />
              </div>
            </div>
          </div>

          {/* Duration */}
          <span className="absolute bottom-2 right-2 bg-dark-primary/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-medium">
            {video.duration}
          </span>

          {/* Premium Badge */}
          {video.isPremium && (
            <div className="absolute top-2 left-2 bg-gradient-gold text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <Crown className="w-3 h-3" />
              <span>Premium</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className={`absolute top-2 right-2 flex flex-col space-y-2 transition-all duration-300 ${
            showActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsSaved(!isSaved);
              }}
              className="p-2 bg-dark-primary/70 hover:bg-dark-primary/90 text-white rounded-lg transition-colors backdrop-blur-sm"
              title="ذخیره"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                // Share functionality
              }}
              className="p-2 bg-dark-primary/70 hover:bg-dark-primary/90 text-white rounded-lg transition-colors backdrop-blur-sm"
              title="اشتراک‌گذاری"
            >
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex space-x-3">
          <Link to={`/profile/${video.channel.id}`}>
            <img
              src={video.channel.avatar}
              alt={video.channel.name}
              className="w-10 h-10 rounded-full border-2 border-dark-tertiary hover:border-vitimo-500 transition-colors flex-shrink-0"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/watch/${video.id}`}>
              <h3 className="font-semibold text-white line-clamp-2 hover:text-vitimo-400 transition-colors mb-2 leading-tight">
                {video.title}
              </h3>
            </Link>
            <div className="flex items-center space-x-1 mb-2">
              <Link 
                to={`/profile/${video.channel.id}`}
                className="text-text-secondary text-sm hover:text-white transition-colors font-medium"
              >
                {video.channel.name}
              </Link>
              {video.channel.verified && (
                <CheckCircle className="w-4 h-4 text-vitimo-500" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-text-muted text-sm">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{formatViews(video.views)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(video.uploadDate)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex items-center space-x-4 mt-3 transition-all duration-300 ${
              showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-1 text-xs transition-colors ${
                  isLiked ? 'text-red-400' : 'text-text-muted hover:text-red-400'
                }`}
              >
                <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                <span>{video.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-xs text-text-muted hover:text-vitimo-400 transition-colors">
                <Share className="w-3 h-3" />
                <span>اشتراک</span>
              </button>
              <button className="flex items-center space-x-1 text-xs text-text-muted hover:text-vitimo-400 transition-colors">
                <Download className="w-3 h-3" />
                <span>دانلود</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;