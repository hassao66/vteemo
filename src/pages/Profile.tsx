import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Users, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContext';
import VideoCard from '../components/VideoCard';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { videos } = useVideo();

  const userVideos = videos.filter(video => video.status === 'published');

  const totalViews = userVideos.reduce((sum, video) => sum + video.views, 0);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Channel Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-8 mb-8">
        <div className="flex items-center space-x-6">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-4xl font-bold text-white">{user?.username}</h1>
              {user?.verified && <CheckCircle className="w-8 h-8 text-white" />}
            </div>
            <div className="flex items-center space-x-6 text-white text-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{formatNumber(user?.subscribers || 0)} subscribers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>{formatNumber(totalViews)} total views</span>
              </div>
              <span>{userVideos.length} videos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Navigation */}
      <div className="border-b border-gray-700 mb-8">
        <nav className="flex space-x-8">
          <button className="px-4 py-3 text-white border-b-2 border-red-500 font-medium">
            Videos
          </button>
          <button className="px-4 py-3 text-gray-400 hover:text-white transition-colors">
            Playlists
          </button>
          <button className="px-4 py-3 text-gray-400 hover:text-white transition-colors">
            About
          </button>
        </nav>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {userVideos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {userVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No videos uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default Profile;