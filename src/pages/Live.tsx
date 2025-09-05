import React, { useState } from 'react';
import { Radio, Users, MessageCircle, Settings, Video, Mic, Monitor } from 'lucide-react';
import { useLive } from '../contexts/LiveContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LiveCard from '../components/LiveCard';

const Live: React.FC = () => {
  const { liveStreams, isStreaming, startStream, endStream } = useLive();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');
  const [streamData, setStreamData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    tags: ''
  });

  const handleStartStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamData.title.trim()) return;

    const tagsArray = streamData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    startStream({
      title: streamData.title,
      thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800',
      streamer: {
        id: user!.id,
        name: user!.username,
        avatar: user!.avatar,
        verified: user!.verified
      },
      category: streamData.category,
      description: streamData.description,
      tags: tagsArray
    });

    setActiveTab('browse');
  };

  const activeLiveStreams = liveStreams.filter(stream => stream.isLive);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Radio className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">پخش زنده ویتیمو</h1>
                <p className="text-red-100">تجربه پخش زنده با کیفیت بالا</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-red-100">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{activeLiveStreams.reduce((sum, stream) => sum + stream.viewers, 0)} بیننده آنلاین</span>
              </div>
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span>{activeLiveStreams.length} پخش زنده فعال</span>
              </div>
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="text-center">
              {isStreaming ? (
                <button
                  onClick={endStream}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  پایان پخش
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-all transform hover:scale-105"
                >
                  شروع پخش زنده
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center space-x-3 px-6 py-4 font-medium transition-all ${
              activeTab === 'browse'
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-5 h-5" />
            <span>پخش‌های زنده</span>
            <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full">
              {activeLiveStreams.length}
            </span>
          </button>
          
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center space-x-3 px-6 py-4 font-medium transition-all ${
                activeTab === 'create'
                  ? 'text-vitimo-600 border-b-2 border-vitimo-600 bg-vitimo-50 dark:bg-vitimo-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-5 h-5" />
              <span>ایجاد پخش زنده</span>
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Browse Tab */}
          {activeTab === 'browse' && (
            <div>
              {activeLiveStreams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeLiveStreams.map(stream => (
                    <LiveCard key={stream.id} stream={stream} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Radio className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    در حال حاضر پخش زنده‌ای وجود ندارد
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    اولین نفری باشید که پخش زنده را شروع می‌کند!
                  </p>
                  {isAuthenticated && (
                    <button
                      onClick={() => setActiveTab('create')}
                      className="bg-gradient-vitimo text-white px-8 py-4 rounded-xl font-bold hover:shadow-vitimo transition-all transform hover:scale-105"
                    >
                      شروع پخش زنده
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Create Tab */}
          {activeTab === 'create' && isAuthenticated && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-vitimo rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  ایجاد پخش زنده جدید
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  پخش زنده خود را تنظیم کنید و با مخاطبان ارتباط برقرار کنید
                </p>
              </div>

              <form onSubmit={handleStartStream} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عنوان پخش زنده *
                  </label>
                  <input
                    type="text"
                    value={streamData.title}
                    onChange={(e) => setStreamData({...streamData, title: e.target.value})}
                    placeholder="عنوان جذابی برای پخش زنده خود انتخاب کنید"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    توضیحات
                  </label>
                  <textarea
                    value={streamData.description}
                    onChange={(e) => setStreamData({...streamData, description: e.target.value})}
                    placeholder="درباره پخش زنده خود توضیح دهید..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      دسته‌بندی
                    </label>
                    <select
                      value={streamData.category}
                      onChange={(e) => setStreamData({...streamData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent"
                    >
                      <option value="Technology">تکنولوژی</option>
                      <option value="Gaming">بازی</option>
                      <option value="Music">موسیقی</option>
                      <option value="Education">آموزش</option>
                      <option value="Entertainment">سرگرمی</option>
                      <option value="Sports">ورزش</option>
                      <option value="News">اخبار</option>
                      <option value="Cooking">آشپزی</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      برچسب‌ها
                    </label>
                    <input
                      type="text"
                      value={streamData.tags}
                      onChange={(e) => setStreamData({...streamData, tags: e.target.value})}
                      placeholder="زنده، آموزش، تکنولوژی"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Stream Settings */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>تنظیمات پخش</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        کیفیت پخش
                      </label>
                      <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500">
                        <option value="720p">720p HD</option>
                        <option value="1080p">1080p Full HD</option>
                        <option value="1440p">1440p 2K</option>
                        <option value="2160p">2160p 4K</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نوع پخش
                      </label>
                      <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500">
                        <option value="video">ویدیو + صدا</option>
                        <option value="audio">فقط صدا</option>
                        <option value="screen">اشتراک صفحه</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        حریم خصوصی
                      </label>
                      <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500">
                        <option value="public">عمومی</option>
                        <option value="unlisted">غیرفهرست</option>
                        <option value="private">خصوصی</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('browse')}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl transition-colors"
                  >
                    لغو
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    شروع پخش زنده
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Live Streams Grid */}
      {activeTab === 'browse' && (
        <div>
          {activeLiveStreams.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                پخش‌های زنده فعال ({activeLiveStreams.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeLiveStreams.map(stream => (
                  <LiveCard key={stream.id} stream={stream} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Radio className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                هیچ پخش زنده‌ای در حال حاضر فعال نیست
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                اولین نفری باشید که پخش زنده را شروع می‌کند!
              </p>
              {isAuthenticated && (
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-gradient-vitimo text-white px-8 py-4 rounded-xl font-bold hover:shadow-vitimo transition-all transform hover:scale-105"
                >
                  شروع پخش زنده
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Live;