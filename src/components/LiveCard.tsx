import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Eye, CheckCircle } from 'lucide-react';

interface LiveStream {
  id: string;
  title: string;
  thumbnail: string;
  streamer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  viewers: number;
  category: string;
}

interface LiveCardProps {
  stream: LiveStream;
}

const LiveCard: React.FC<LiveCardProps> = ({ stream }) => {
  const formatViewers = (viewers: number) => {
    if (viewers >= 1000000) {
      return `${(viewers / 1000000).toFixed(1)}M`;
    } else if (viewers >= 1000) {
      return `${(viewers / 1000).toFixed(1)}K`;
    }
    return viewers.toString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-red-300 dark:hover:border-red-600 transition-all duration-300 group">
      <Link to={`/live/${stream.id}`}>
        <div className="relative">
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Live Indicator */}
          <div className="absolute top-3 left-3 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>زنده</span>
          </div>

          {/* Viewer Count */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
            <Eye className="w-3 h-3" />
            <span>{formatViewers(stream.viewers)}</span>
          </div>

          {/* Category */}
          <div className="absolute top-3 right-3 bg-vitimo-600 text-white px-2 py-1 rounded text-xs font-medium">
            {stream.category}
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex space-x-3">
          <Link to={`/profile/${stream.streamer.id}`}>
            <img
              src={stream.streamer.avatar}
              alt={stream.streamer.name}
              className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 transition-colors"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/live/${stream.id}`}>
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-red-600 transition-colors mb-1">
                {stream.title}
              </h3>
            </Link>
            <div className="flex items-center space-x-1 mb-2">
              <Link 
                to={`/profile/${stream.streamer.id}`}
                className="text-gray-600 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                {stream.streamer.name}
              </Link>
              {stream.streamer.verified && (
                <CheckCircle className="w-4 h-4 text-vitimo-500" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
              <Radio className="w-3 h-3 text-red-500" />
              <span>پخش زنده</span>
              <span>•</span>
              <span>{formatViewers(stream.viewers)} بیننده</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCard;