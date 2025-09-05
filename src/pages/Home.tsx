import React, { useState } from 'react';
import VideoCard from '../components/VideoCard';
import LiveCard from '../components/LiveCard';
import PodcastCard from '../components/PodcastCard';
import { useVideo } from '../contexts/VideoContext';
import { useLive } from '../contexts/LiveContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Radio, Mic, TrendingUp, Crown } from 'lucide-react';

const Home: React.FC = () => {
  const { videos, searchQuery, selectedCategory } = useVideo();
  const { liveStreams } = useLive();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'videos' | 'live' | 'podcasts'>('videos');

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || selectedCategory === 'Home' || video.category === selectedCategory;
    const isPublished = video.status === 'published';
    
    return matchesSearch && matchesCategory && isPublished;
  });

  const activeLiveStreams = liveStreams.filter(stream => stream.isLive);

  const tabs = [
    { id: 'videos', label: 'ویدیوها', icon: TrendingUp, count: filteredVideos.length },
    { id: 'live', label: 'پخش زنده', icon: Radio, count: activeLiveStreams.length },
    { id: 'podcasts', label: 'پادکست‌ها', icon: Mic, count: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section for Premium */}
      <div className="bg-gradient-purple rounded-2xl p-8 text-white relative overflow-hidden shadow-purple-lg">
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <Crown className="w-8 h-8 text-gold-400" />
            <h2 className="text-3xl font-bold">ویتیمو پریمیوم</h2>
          </div>
          <p className="text-xl mb-6 opacity-90">
            تجربه بی‌نظیر تماشای ویدیو با کیفیت 4K، بدون تبلیغات و محتوای اختصاصی
          </p>
          <button className="btn-gold">
            آزمایش رایگان ۷ روزه
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/20 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="vitimo-card p-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            نتایج جستجو برای "{searchQuery}"
          </h2>
          <p className="text-text-secondary">
            {filteredVideos.length} ویدیو پیدا شد
          </p>
        </div>
      )}

      {/* Content Tabs */}
      <div className="vitimo-card">
        <div className="flex border-b border-dark-tertiary">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-3 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-vitimo-400 border-b-2 border-vitimo-500 bg-vitimo-900/20'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-vitimo-800/30 text-vitimo-300'
                    : 'bg-dark-tertiary text-text-muted'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
              {filteredVideos.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-text-muted text-lg">
                    ویدیویی یافت نشد
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Live Tab */}
          {activeTab === 'live' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeLiveStreams.map(stream => (
                <LiveCard key={stream.id} stream={stream} />
              ))}
              {activeLiveStreams.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Radio className="w-16 h-16 text-text-muted mx-auto mb-4" />
                  <p className="text-text-muted text-lg">
                    در حال حاضر پخش زنده‌ای وجود ندارد
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Podcasts Tab */}
          {activeTab === 'podcasts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PodcastCard 
                podcast={{
                  id: '1',
                  title: 'پادکست تکنولوژی',
                  description: 'آخرین اخبار دنیای تکنولوژی',
                  thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400',
                  host: 'علی احمدی',
                  episodes: 25,
                  duration: '45:30'
                }}
              />
              <PodcastCard 
                podcast={{
                  id: '2',
                  title: 'پادکست کسب و کار',
                  description: 'راهنمای موفقیت در کسب و کار',
                  thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
                  host: 'سارا محمدی',
                  episodes: 18,
                  duration: '38:15'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;