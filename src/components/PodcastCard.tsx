import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Play, Clock, Users } from 'lucide-react';

interface Podcast {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  host: string;
  episodes: number;
  duration: string;
}

interface PodcastCardProps {
  podcast: Podcast;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-vitimo-300 dark:hover:border-vitimo-600 transition-all duration-300 group">
      <Link to={`/podcast/${podcast.id}`}>
        <div className="relative">
          <img
            src={podcast.thumbnail}
            alt={podcast.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Podcast Indicator */}
          <div className="absolute top-3 left-3 flex items-center space-x-2 bg-vitimo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            <Mic className="w-3 h-3" />
            <span>پادکست</span>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Play className="w-8 h-8 text-white fill-current" />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
            <Clock className="w-3 h-3" />
            <span>{podcast.duration}</span>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/podcast/${podcast.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-vitimo-600 dark:hover:text-vitimo-400 transition-colors mb-2">
            {podcast.title}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
          {podcast.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
            <Users className="w-3 h-3" />
            <span>{podcast.host}</span>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            {podcast.episodes} قسمت
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;