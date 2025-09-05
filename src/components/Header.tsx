import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Upload, Bell, User, Menu, Play, Crown, Gift, 
  Wallet, Radio, Mic, Settings, Moon, Sun 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { searchQuery, setSearchQuery } = useVideo();
  const { balance } = useWallet();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  return (
    <header className="vitimo-header px-4 lg:px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Menu */}
        <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
          <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors lg:hidden">
            <Menu className="w-5 h-5 text-white" />
          </button>
          <Link to="/" className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-purple rounded-xl flex items-center justify-center shadow-purple">
                <Play className="w-6 h-6 text-white fill-current" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-gold rounded-full flex items-center justify-center">
                <Crown className="w-2.5 h-2.5 text-gray-900" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">
                ویتیمو
              </span>
              <div className="text-xs text-gold-600 font-bold">Premium</div>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 lg:mx-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('header.search')}
              className={`input w-full rounded-full ${
                isRTL ? 'pr-12' : 'pl-4 pr-12'
              }`}
            />
            <button
              type="submit"
              className={`absolute top-1/2 transform -translate-y-1/2 p-2 text-text-muted hover:text-purple transition-colors ${
                isRTL ? 'left-2' : 'right-2'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Right Side Actions */}
        <div className={`flex items-center space-x-2 lg:space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
            title="تغییر تم"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>

          <LanguageSelector />
          
          {isAuthenticated ? (
            <>
              {/* Wallet Balance */}
              <Link
                to="/wallet"
                className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-gradient-purple text-white rounded-lg hover:shadow-purple transition-all transform hover:scale-105"
                title={t('header.wallet')}
              >
                <Wallet className="w-4 h-4" />
                <span className="font-bold text-sm">
                  {formatBalance(balance)} ریال
                </span>
              </Link>
              
              {/* Premium */}
              <Link
                to="/premium"
                className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-gradient-gold text-gray-900 rounded-lg hover:shadow-gold transition-all transform hover:scale-105"
                title={t('sidebar.premium')}
              >
                <Crown className="w-4 h-4" />
                <span className="font-bold text-sm">{t('sidebar.premium')}</span>
              </Link>
              
              {/* Rewards */}
              <Link
                to="/rewards"
                className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors relative"
                title={t('sidebar.rewards')}
              >
                <Gift className="w-5 h-5 text-gold-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-500 rounded-full animate-pulse"></div>
              </Link>
              
              {/* Live Stream */}
              <Link
                to="/live"
                className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all transform hover:scale-105"
                title={t('header.live')}
              >
                <Radio className="w-4 h-4" />
                <span className="font-medium text-sm">{t('header.live')}</span>
              </Link>
              
              {/* Upload */}
              <Link
                to="/upload"
                className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
                title={t('header.upload')}
              >
                <Upload className="w-5 h-5 text-white" />
              </Link>
              
              {/* Notifications */}
              <button className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1 hover:bg-dark-tertiary rounded-lg transition-colors"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full border-2 border-vitimo-500"
                  />
                </button>
                
                {showUserMenu && (
                  <div className={`absolute top-full mt-2 w-64 bg-dark-secondary border border-dark-tertiary rounded-xl shadow-dark z-50 ${
                    isRTL ? 'left-0' : 'right-0'
                  }`}>
                    <div className="p-4 border-b border-dark-tertiary bg-gradient-purple rounded-t-xl">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user?.avatar}
                          alt={user?.username}
                          className="w-12 h-12 rounded-full border-2 border-white"
                        />
                        <div>
                          <p className="font-bold text-white">{user?.username}</p>
                          <p className="text-sm text-gray-200">{user?.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Wallet className="w-3 h-3 text-gold-600" />
                            <span className="text-xs font-bold text-gold-600">
                              {formatBalance(balance)} ریال
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        to={`/profile/${user?.id}`}
                        className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-dark-tertiary transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>{t('header.profile')}</span>
                      </Link>
                      <Link
                        to="/wallet"
                        className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-dark-tertiary transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Wallet className="w-4 h-4" />
                        <span>{t('header.wallet')}</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-dark-tertiary transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>{t('header.admin')}</span>
                        </Link>
                      )}
                      <div className="border-t border-dark-tertiary my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-dark-tertiary transition-colors"
                      >
                        <span>{t('header.signout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className={`flex items-center space-x-2 px-4 py-2 bg-gradient-purple text-white rounded-xl hover:shadow-purple transition-all transform hover:scale-105 font-bold ${
                isRTL ? 'space-x-reverse' : ''
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t('header.signin')}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;