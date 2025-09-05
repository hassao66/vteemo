import React, { useState } from 'react';
import { Shield, Ban, Eye, Mail, Calendar } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  joinDate: string;
  videosCount: number;
  subscribersCount: number;
  status: 'active' | 'suspended' | 'banned';
  isVerified: boolean;
}

const AdminUsers: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');

  // Mock user data
  const [users] = useState<User[]>([
    {
      id: '1',
      username: 'VideoCreator',
      email: 'creator@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      joinDate: '2023-01-15',
      videosCount: 25,
      subscribersCount: 125000,
      status: 'active',
      isVerified: true
    },
    {
      id: '2',
      username: 'TechReviewer',
      email: 'tech@example.com',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      joinDate: '2023-03-20',
      videosCount: 18,
      subscribersCount: 89000,
      status: 'active',
      isVerified: true
    },
    {
      id: '3',
      username: 'GameMaster',
      email: 'gamer@example.com',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      joinDate: '2023-06-10',
      videosCount: 45,
      subscribersCount: 230000,
      status: 'active',
      isVerified: false
    },
    {
      id: '4',
      username: 'CookingQueen',
      email: 'cooking@example.com',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
      joinDate: '2023-08-05',
      videosCount: 32,
      subscribersCount: 156000,
      status: 'suspended',
      isVerified: false
    }
  ]);

  const filteredUsers = users.filter(user => {
    if (statusFilter === 'all') return true;
    return user.status === statusFilter;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">Active</span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs bg-yellow-600 text-white rounded-full">Suspended</span>;
      case 'banned':
        return <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full">Banned</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-2">Manage platform users and their permissions</p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-red-500"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Total Users</h3>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Active Users</h3>
          <p className="text-2xl font-bold text-green-400">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Verified Users</h3>
          <p className="text-2xl font-bold text-blue-400">{users.filter(u => u.isVerified).length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Suspended/Banned</h3>
          <p className="text-2xl font-bold text-red-400">{users.filter(u => u.status !== 'active').length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300">User</th>
                <th className="text-left p-4 text-gray-300">Email</th>
                <th className="text-left p-4 text-gray-300">Join Date</th>
                <th className="text-left p-4 text-gray-300">Videos</th>
                <th className="text-left p-4 text-gray-300">Subscribers</th>
                <th className="text-left p-4 text-gray-300">Status</th>
                <th className="text-left p-4 text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-medium">{user.username}</h4>
                          {user.isVerified && (
                            <Shield className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{user.joinDate}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{user.videosCount}</td>
                  <td className="p-4 text-gray-300">{formatNumber(user.subscribersCount)}</td>
                  <td className="p-4">{getStatusBadge(user.status)}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                          title="Suspend User"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          title="Activate User"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Ban User"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No users found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;