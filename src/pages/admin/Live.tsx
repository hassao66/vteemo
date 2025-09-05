import React, { useState } from 'react';
import { 
  Radio, Users, Eye, Clock, Settings, Play, Square, 
  Mic, MicOff, Video, VideoOff, Monitor, Smartphone,
  TrendingUp, DollarSign, MessageCircle, Heart
} from 'lucide-react';
import { useLive } from '../../contexts/LiveContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminLive: React.FC = () => {
  const { liveStreams, createLiveStream, endLiveStream } = useLive();
  const { language, t } = useLanguage();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStreamTitle, setNewStreamTitle] = useState('');
  const [newStreamDescription, setNewStreamDescription] = useState('');

  const activeLiveStreams = liveStreams.filter(stream => stream.isLive);
  const scheduledStreams = liveStreams.filter(stream => !stream.isLive && new Date(stream.scheduledTime) > new Date());
  const endedStreams = liveStreams.filter(stream => !stream.isLive && new Date(stream.scheduledTime) <= new Date());

  const totalViewers = activeLiveStreams.reduce((sum, stream) => sum + stream.viewers, 0);
  const totalRevenue = liveStreams.reduce((sum, stream) => sum + (stream.revenue || 0), 0);

  const handleCreateStream = () => {
    if (newStreamTitle.trim()) {
      createLiveStream({
        title: newStreamTitle,
        description: newStreamDescription,
        scheduledTime: new Date().toISOString(),
      });
      setNewStreamTitle('');
      setNewStreamDescription('');
      setShowCreateModal(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'fa' ? 'مدیریت پخش زنده' : 'Live Stream Management'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'fa' 
              ? 'مدیریت و نظارت بر پخش‌های زنده پلتفرم'
              : 'Manage and monitor platform live streams'
            }
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-vitimo-500 to-vitimo-600 hover:from-vitimo-600 hover:to-vitimo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
        >
          <Radio className="w-5 h-5" />
          <span>{language === 'fa' ? 'ایجاد پخش زنده' : 'Create Live Stream'}</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-500 rounded-xl">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                {language === 'fa' ? 'پخش زنده فعال' : 'Active Streams'}
              </p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                {activeLiveStreams.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                {language === 'fa' ? 'بینندگان آنلاین' : 'Online Viewers'}
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {totalViewers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                {language === 'fa' ? 'برنامه‌ریزی شده' : 'Scheduled'}
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                {scheduledStreams.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900/20 dark:to-gold-800/20 rounded-xl p-6 border border-gold-200 dark:border-gold-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gold-500 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gold-600 dark:text-gold-400 text-sm font-medium">
                {language === 'fa' ? 'درآمد کل' : 'Total Revenue'}
              </p>
              <p className="text-3xl font-bold text-gold-700 dark:text-gold-300">
                {formatCurrency(totalRevenue)} {language === 'fa' ? 'ریال' : 'IRR'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Live Streams */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Radio className="w-6 h-6 text-red-500" />
            <span>{language === 'fa' ? 'پخش‌های زنده فعال' : 'Active Live Streams'}</span>
          </h2>
        </div>
        <div className="p-6">
          {activeLiveStreams.length === 0 ? (
            <div className="text-center py-12">
              <Radio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'fa' ? 'هیچ پخش زنده فعالی وجود ندارد' : 'No active live streams'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeLiveStreams.map((stream) => (
                <div key={stream.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-500 font-medium text-sm">
                          {language === 'fa' ? 'زنده' : 'LIVE'}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{stream.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{stream.description}</p>
                    </div>
                    <button
                      onClick={() => endLiveStream(stream.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {stream.viewers.toLocaleString()} {language === 'fa' ? 'بیننده' : 'viewers'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDuration(stream.duration || 0)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {(stream.chatMessages || 0).toLocaleString()} {language === 'fa' ? 'پیام' : 'messages'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(stream.revenue || 0)} {language === 'fa' ? 'ریال' : 'IRR'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={stream.streamer.avatar}
                        alt={stream.streamer.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {stream.streamer.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        <Monitor className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scheduled Streams */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-6 h-6 text-blue-500" />
            <span>{language === 'fa' ? 'پخش‌های برنامه‌ریزی شده' : 'Scheduled Streams'}</span>
          </h2>
        </div>
        <div className="p-6">
          {scheduledStreams.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'fa' ? 'هیچ پخش برنامه‌ریزی شده‌ای وجود ندارد' : 'No scheduled streams'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledStreams.map((stream) => (
                <div key={stream.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img
                      src={stream.streamer.avatar}
                      alt={stream.streamer.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{stream.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stream.streamer.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(stream.scheduledTime).toLocaleDateString('fa-IR')} - 
                        {new Date(stream.scheduledTime).toLocaleTimeString('fa-IR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      {language === 'fa' ? 'شروع' : 'Start'}
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      {language === 'fa' ? 'ویرایش' : 'Edit'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stream Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'fa' ? 'آمار پخش زنده' : 'Live Stream Analytics'}
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">
                {language === 'fa' ? 'میانگین بینندگان' : 'Average Viewers'}
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {Math.round(totalViewers / Math.max(activeLiveStreams.length, 1)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">
                {language === 'fa' ? 'کل ساعات پخش' : 'Total Stream Hours'}
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {liveStreams.reduce((sum, s) => sum + (s.duration || 0), 0) / 3600} ساعت
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">
                {language === 'fa' ? 'درآمد کل' : 'Total Revenue'}
              </span>
              <span className="font-bold text-gold-600">
                {formatCurrency(totalRevenue)} {language === 'fa' ? 'ریال' : 'IRR'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'fa' ? 'استریمرهای برتر' : 'Top Streamers'}
          </h3>
          <div className="space-y-4">
            {liveStreams
              .sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))
              .slice(0, 5)
              .map((stream, index) => (
                <div key={stream.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-vitimo rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <img
                    src={stream.streamer.avatar}
                    alt={stream.streamer.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {stream.streamer.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{(stream.totalViews || 0).toLocaleString()} بازدید</span>
                      <span>•</span>
                      <span>{stream.followers?.toLocaleString()} دنبال‌کننده</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold-600">
                      {formatCurrency(stream.revenue || 0)} ریال
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Ended Streams */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {language === 'fa' ? 'پخش‌های اخیر' : 'Recent Streams'}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'استریمر' : 'Streamer'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'عنوان' : 'Title'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'مدت زمان' : 'Duration'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'بینندگان' : 'Viewers'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'درآمد' : 'Revenue'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'عملیات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {endedStreams.slice(0, 10).map((stream) => (
                <tr key={stream.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={stream.streamer.avatar}
                        alt={stream.streamer.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {stream.streamer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white font-medium line-clamp-1">
                      {stream.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatDuration(stream.duration || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {(stream.totalViews || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gold-600">
                    {formatCurrency(stream.revenue || 0)} ریال
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        {language === 'fa' ? 'مشاهده' : 'View'}
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
                        {language === 'fa' ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Stream Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {language === 'fa' ? 'ایجاد پخش زنده جدید' : 'Create New Live Stream'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'fa' ? 'عنوان پخش' : 'Stream Title'}
                </label>
                <input
                  type="text"
                  value={newStreamTitle}
                  onChange={(e) => setNewStreamTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-vitimo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={language === 'fa' ? 'عنوان پخش زنده را وارد کنید' : 'Enter stream title'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'fa' ? 'توضیحات' : 'Description'}
                </label>
                <textarea
                  value={newStreamDescription}
                  onChange={(e) => setNewStreamDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-vitimo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={language === 'fa' ? 'توضیحات پخش زنده' : 'Stream description'}
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <button
                onClick={handleCreateStream}
                className="flex-1 bg-gradient-to-r from-vitimo-500 to-vitimo-600 hover:from-vitimo-600 hover:to-vitimo-700 text-white py-3 rounded-xl font-medium transition-all duration-200"
              >
                {language === 'fa' ? 'ایجاد پخش' : 'Create Stream'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                {language === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLive;