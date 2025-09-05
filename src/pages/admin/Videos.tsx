import React, { useState } from 'react';
import { CheckCircle, X, Eye, Trash2, Filter } from 'lucide-react';
import { useVideo } from '../../contexts/VideoContext';

const AdminVideos: React.FC = () => {
  const { videos, updateVideoStatus, deleteVideo } = useVideo();
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending' | 'rejected'>('all');

  const filteredVideos = videos.filter(video => {
    if (statusFilter === 'all') return true;
    return video.status === statusFilter;
  });

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">Published</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-600 text-white rounded-full">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Video Management</h1>
          <p className="text-gray-400 mt-2">Manage and moderate uploaded videos</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="all">All Videos</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Total Videos</h3>
          <p className="text-2xl font-bold text-white">{videos.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Published</h3>
          <p className="text-2xl font-bold text-green-400">{videos.filter(v => v.status === 'published').length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Pending Review</h3>
          <p className="text-2xl font-bold text-yellow-400">{videos.filter(v => v.status === 'pending').length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Rejected</h3>
          <p className="text-2xl font-bold text-red-400">{videos.filter(v => v.status === 'rejected').length}</p>
        </div>
      </div>

      {/* Videos Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300">Video</th>
                <th className="text-left p-4 text-gray-300">Channel</th>
                <th className="text-left p-4 text-gray-300">Views</th>
                <th className="text-left p-4 text-gray-300">Upload Date</th>
                <th className="text-left p-4 text-gray-300">Status</th>
                <th className="text-left p-4 text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map((video) => (
                <tr key={video.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div>
                        <h4 className="text-white font-medium line-clamp-2 max-w-xs">
                          {video.title}
                        </h4>
                        <p className="text-gray-400 text-sm">{video.duration}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={video.channel.avatar}
                        alt={video.channel.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-gray-300">{video.channel.name}</span>
                      {video.channel.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{formatViews(video.views)}</td>
                  <td className="p-4 text-gray-300">{video.uploadDate}</td>
                  <td className="p-4">{getStatusBadge(video.status)}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {video.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateVideoStatus(video.id, 'published')}
                            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateVideoStatus(video.id, 'rejected')}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {video.status === 'rejected' && (
                        <button
                          onClick={() => updateVideoStatus(video.id, 'published')}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteVideo(video.id)}
                        className="p-2 bg-gray-600 hover:bg-red-600 text-white rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No videos found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideos;