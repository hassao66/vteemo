import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Eye, EyeOff, Crown, Wallet, Radio, Mic } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, isRTL } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(formData.email, formData.password);
    
    if (success) {
      navigate('/');
    } else {
      setError('ایمیل یا رمز عبور اشتباه است');
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    { icon: Play, text: 'پخش ویدیو با کیفیت 4K' },
    { icon: Radio, text: 'پخش زنده تعاملی' },
    { icon: Mic, text: 'پادکست‌های اختصاصی' },
    { icon: Wallet, text: 'کیف پول ریالی' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gold-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-right space-y-8">
          <div>
            <div className="flex items-center justify-center lg:justify-end space-x-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-vitimo rounded-2xl flex items-center justify-center shadow-vitimo">
                  <Play className="w-12 h-12 text-white fill-current" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-gray-900" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-vitimo bg-clip-text text-transparent">
                  ویتیمو
                </h1>
                <p className="text-gold-600 font-bold text-lg">Premium Video Platform</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('login.subtitle')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              پلتفرم ویدیویی حرفه‌ای با امکانات پیشرفته پخش زنده، پادکست و کیف پول ریالی
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-vitimo rounded-lg">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {feature.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('login.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                وارد حساب کاربری خود شوید
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('login.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all"
                  placeholder="example@vitimo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all pr-12"
                    placeholder="رمز عبور خود را وارد کنید"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-vitimo text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-vitimo hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'در حال ورود...' : t('login.signin')}
              </button>
            </form>

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                {t('login.demo')}
              </h4>
              <div className="space-y-3">
                <div className="bg-gradient-vitimo/10 border border-vitimo-200 dark:border-vitimo-800 p-4 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <strong className="text-vitimo-600 dark:text-vitimo-400">{t('login.admin')}:</strong> admin@vitimo.com / admin
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <strong className="text-gray-600 dark:text-gray-400">{t('login.user')}:</strong> user@vitimo.com / user
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button className="text-vitimo-600 dark:text-vitimo-400 hover:underline text-sm font-medium">
                {t('login.forgotPassword')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;