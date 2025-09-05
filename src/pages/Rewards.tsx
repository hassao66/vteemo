import React from 'react';
import { Gift, Star, Play, Upload, Share, Calendar, Trophy, Coins } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Rewards: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const userPoints = 2450;

  const activities = [
    { icon: Play, key: 'rewards.watchVideo', points: 10, color: 'text-blue-400' },
    { icon: Upload, key: 'rewards.uploadVideo', points: 100, color: 'text-green-400' },
    { icon: Share, key: 'rewards.shareVideo', points: 25, color: 'text-purple-400' },
    { icon: Calendar, key: 'rewards.dailyLogin', points: 5, color: 'text-gold-400' },
  ];

  const rewards = [
    {
      id: 1,
      title: 'Premium 1 Month',
      description: 'Get 1 month of premium subscription',
      points: 1000,
      image: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true,
    },
    {
      id: 2,
      title: 'Exclusive Badge',
      description: 'Show off with a special profile badge',
      points: 500,
      image: 'https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true,
    },
    {
      id: 3,
      title: 'Custom Thumbnail',
      description: 'Upload custom thumbnails for your videos',
      points: 750,
      image: 'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true,
    },
    {
      id: 4,
      title: 'Early Access',
      description: 'Get early access to new features',
      points: 2000,
      image: 'https://images.pexels.com/photos/1591063/pexels-photo-1591063.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: false,
    },
  ];

  const achievements = [
    { title: 'First Upload', description: 'Upload your first video', completed: true },
    { title: 'Video Lover', description: 'Watch 100 videos', completed: true },
    { title: 'Social Butterfly', description: 'Share 50 videos', completed: false },
    { title: 'Content Creator', description: 'Upload 10 videos', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-gold text-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full animate-bounce-slow">
                <Gift className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('rewards.title')}</h1>
            <p className="text-xl opacity-80 mb-8">{t('rewards.subtitle')}</p>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-4">
                <Coins className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-80">{t('rewards.points')}</p>
                  <p className="text-3xl font-bold">{userPoints.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Earn Points Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Earn Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 hover:border-gold-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-purple rounded-full">
                        <IconComponent className={`w-6 h-6 ${activity.color}`} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t(activity.key)}
                    </h3>
                    <div className="flex items-center justify-center space-x-2">
                      <Star className="w-4 h-4 text-gold-400" />
                      <span className="text-gold-400 font-bold">+{activity.points}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rewards Store */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Rewards Store</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  reward.available
                    ? 'border-purple-600/30 hover:border-gold-500/50'
                    : 'border-gray-700/50 opacity-60'
                }`}
              >
                <img
                  src={reward.image}
                  alt={reward.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{reward.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-gold-400" />
                      <span className="text-gold-400 font-bold">{reward.points}</span>
                    </div>
                    
                    <button
                      disabled={!reward.available || userPoints < reward.points}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        reward.available && userPoints >= reward.points
                          ? 'bg-gradient-gold text-gray-900 hover:shadow-gold transform hover:scale-105'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {reward.available ? 'Redeem' : 'Locked'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 ${
                  achievement.completed
                    ? 'border-gold-500/50 bg-gold-500/10'
                    : 'border-purple-600/30'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    achievement.completed ? 'bg-gradient-gold' : 'bg-gray-700'
                  }`}>
                    <Trophy className={`w-6 h-6 ${
                      achievement.completed ? 'text-gray-900' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      achievement.completed ? 'text-gold-400' : 'text-white'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-gray-400">{achievement.description}</p>
                  </div>
                  {achievement.completed && (
                    <div className="ml-auto">
                      <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-gray-900 fill-current" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;