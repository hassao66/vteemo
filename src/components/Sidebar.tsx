import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, TrendingUp, Users, BookOpen, Clock, Heart, List,
  Radio, Mic, Crown, Gift, Wallet, Music, Gamepad2, 
  Trophy, Newspaper, GraduationCap, Lightbulb, Smile
} from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';

const Sidebar: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useVideo();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { balance } = useWallet();
  const location = useLocation();

  const mainItems = [
    { name: 'Home', key: 'sidebar.home', icon: Home, to: '/' },
    { name: 'Trending', key: 'sidebar.trending', icon: TrendingUp, to: '/trending' },
  ];

  const libraryItems = [
    { name: 'Subscriptions', key: 'sidebar.subscriptions', icon: Users, to: '/subscriptions' },
    { name: 'Library', key: 'sidebar.library', icon: BookOpen, to: '/library' },
    { name: 'History', key: 'sidebar.history', icon: Clock, to: '/history' },
    { name: 'Watch Later', key: 'sidebar.watchLater', icon: Clock, to: '/watch-later' },
    { name: 'Liked Videos', key: 'sidebar.likedVideos', icon: Heart, to: '/liked' },
    { name: 'Playlists', key: 'sidebar.playlists', icon: List, to: '/playlists' },
  ];

  const liveItems = [
    { name: 'Live', key: 'sidebar.live', icon: Radio, to: '/live' },
    { name: 'Podcasts', key: 'sidebar.podcasts', icon: Mic, to: '/podcasts' },
  ];

  const premiumItems = [
    { name: 'Premium', key: 'sidebar.premium', icon: Crown, to: '/premium', gradient: true },
    { name: 'Rewards', key: 'sidebar.rewards', icon: Gift, to: '/rewards', gold: true },
    { name: 'Wallet', key: 'sidebar.wallet', icon: Wallet, to: '/wallet', vitimo: true },
  ];

  const categories = [
    { name: 'Music', key: 'sidebar.music', icon: Music },
    { name: 'Gaming', key: 'sidebar.gaming', icon: Gamepad2 },
    { name: 'Sports', key: 'sidebar.sports', icon: Trophy },
    { name: 'News', key: 'sidebar.news', icon: Newspaper },
    { name: 'Education', key: 'sidebar.education', icon: GraduationCap },
    { name: 'Technology', key: 'sidebar.technology', icon: Lightbulb },
    { name: 'Entertainment', key: 'sidebar.entertainment', icon: Smile },
  ];

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  const isActive = (path: string) => location.pathname === path;

  const SidebarItem = ({ item, isCategory = false, onClick }: any) => {
    const IconComponent = item.icon;
    const active = isCategory ? selectedCategory === item.name : isActive(item.to);
    
    return (
      <Link
        to={item.to || '#'}
        onClick={onClick}
        className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3 transition-all duration-200 ${
          isRTL ? 'space-x-reverse' : ''
        } ${
          active
            ? 'active'
            : item.gradient
            ? 'bg-gradient-purple text-white shadow-purple hover:shadow-lg'
            : item.gold
            ? 'bg-gradient-gold text-gray-900 shadow-gold hover:shadow-lg font-bold'
            : item.vitimo
            ? 'bg-vitimo-900/20 text-vitimo-300 hover:bg-vitimo-800/30'
            : ''
        } ${
          (item.gradient || item.gold || item.vitimo) ? 'transform hover:scale-105' : ''
        }`}
      >
        <IconComponent className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium truncate">{t(item.key)}</span>
        {item.name === 'Wallet' && isAuthenticated && (
          <span className="ml-auto text-xs font-bold bg-gold-500/20 text-gold-400 px-2 py-1 rounded-full">
            {formatBalance(balance)}
          </span>
        )}
        {item.gold && (
          <div className="ml-auto">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </Link>
    );
  };

  return (
    <aside className={`vitimo-sidebar w-64 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto hidden lg:block ${
      isRTL ? 'border-l border-r-0' : ''
    }`}>
      <nav className="p-4 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-2">
          {mainItems.map((item) => (
            <SidebarItem key={item.name} item={item} />
          ))}
        </div>

        {/* Library Section */}
        {isAuthenticated && (
          <>
            <div className="border-t border-dark-tertiary pt-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-4">
                کتابخانه
              </h3>
              <div className="space-y-2">
                {libraryItems.map((item) => (
                  <SidebarItem key={item.name} item={item} />
                ))}
              </div>
            </div>

            {/* Live & Podcasts */}
            <div className="border-t border-dark-tertiary pt-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-4">
                پخش زنده و پادکست
              </h3>
              <div className="space-y-2">
                {liveItems.map((item) => (
                  <SidebarItem key={item.name} item={item} />
                ))}
              </div>
            </div>

            {/* Premium Features */}
            <div className="border-t border-dark-tertiary pt-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-4">
                ویژگی‌های ویژه
              </h3>
              <div className="space-y-2">
                {premiumItems.map((item) => (
                  <SidebarItem key={item.name} item={item} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Categories */}
        <div className="border-t border-dark-tertiary pt-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-4">
            {t('sidebar.categories')}
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <SidebarItem 
                key={category.name} 
                item={category} 
                isCategory={true}
                onClick={() => setSelectedCategory(category.name)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-dark-tertiary pt-4">
          <div className="text-xs text-text-muted space-y-1 px-4">
            <p>© 2024 ویتیمو</p>
            <p>پلتفرم ویدیویی حرفه‌ای</p>
            <p>نسخه 2.0</p>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;