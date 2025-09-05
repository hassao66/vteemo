import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fa' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  fa: {
    // Header
    'header.search': 'جستجوی ویدیوها، کانال‌ها و پادکست‌ها...',
    'header.upload': 'آپلود ویدیو',
    'header.live': 'پخش زنده',
    'header.notifications': 'اعلان‌ها',
    'header.signin': 'ورود',
    'header.signout': 'خروج',
    'header.profile': 'پروفایل من',
    'header.admin': 'پنل مدیریت',
    'header.wallet': 'کیف پول',
    
    // Sidebar
    'sidebar.home': 'خانه',
    'sidebar.trending': 'ترند',
    'sidebar.subscriptions': 'اشتراک‌ها',
    'sidebar.library': 'کتابخانه',
    'sidebar.history': 'تاریخچه',
    'sidebar.watchLater': 'تماشا بعداً',
    'sidebar.likedVideos': 'ویدیوهای پسندیده',
    'sidebar.playlists': 'پلی‌لیست‌ها',
    'sidebar.live': 'پخش زنده',
    'sidebar.podcasts': 'پادکست‌ها',
    'sidebar.premium': 'اشتراک ویژه',
    'sidebar.rewards': 'پاداش‌ها',
    'sidebar.wallet': 'کیف پول',
    'sidebar.categories': 'دسته‌بندی‌ها',
    'sidebar.music': 'موسیقی',
    'sidebar.gaming': 'بازی',
    'sidebar.sports': 'ورزش',
    'sidebar.news': 'اخبار',
    'sidebar.education': 'آموزش',
    'sidebar.technology': 'تکنولوژی',
    'sidebar.entertainment': 'سرگرمی',
    
    // Video
    'video.views': 'بازدید',
    'video.subscribers': 'مشترک',
    'video.like': 'پسندیدن',
    'video.dislike': 'نپسندیدن',
    'video.share': 'اشتراک‌گذاری',
    'video.download': 'دانلود',
    'video.save': 'ذخیره',
    'video.subscribe': 'اشتراک',
    'video.subscribed': 'عضو شده',
    'video.comments': 'نظرات',
    'video.addComment': 'نظر خود را بنویسید...',
    'video.comment': 'ارسال نظر',
    'video.quality': 'کیفیت',
    'video.speed': 'سرعت پخش',
    'video.subtitles': 'زیرنویس',
    'video.fullscreen': 'تمام صفحه',
    'video.pip': 'تصویر در تصویر',
    
    // Upload
    'upload.title': 'آپلود ویدیو',
    'upload.selectFile': 'انتخاب فایل ویدیو',
    'upload.dragDrop': 'یا فایل را اینجا بکشید',
    'upload.videoTitle': 'عنوان ویدیو',
    'upload.description': 'توضیحات',
    'upload.category': 'دسته‌بندی',
    'upload.tags': 'برچسب‌ها (با کاما جدا کنید)',
    'upload.thumbnail': 'تصویر شاخص',
    'upload.privacy': 'حریم خصوصی',
    'upload.monetization': 'کسب درآمد',
    'upload.subtitles': 'زیرنویس',
    'upload.cancel': 'لغو',
    'upload.publish': 'انتشار',
    'upload.draft': 'پیش‌نویس',
    
    // Login
    'login.title': 'ورود به ویتیمو',
    'login.subtitle': 'به پلتفرم ویدیویی حرفه‌ای خوش آمدید',
    'login.email': 'ایمیل',
    'login.password': 'رمز عبور',
    'login.signin': 'ورود',
    'login.signup': 'ثبت نام',
    'login.forgotPassword': 'فراموشی رمز عبور',
    'login.demo': 'حساب‌های نمونه:',
    'login.admin': 'مدیر',
    'login.user': 'کاربر',
    
    // Premium
    'premium.title': 'اشتراک ویژه ویتیمو',
    'premium.subtitle': 'تجربه بی‌نظیر تماشای ویدیو و پادکست',
    'premium.noAds': 'بدون تبلیغات',
    'premium.hd': 'کیفیت 4K',
    'premium.offline': 'تماشای آفلاین',
    'premium.exclusive': 'محتوای اختصاصی',
    'premium.earlyAccess': 'دسترسی زودهنگام',
    'premium.prioritySupport': 'پشتیبانی اولویت‌دار',
    'premium.price': '۱۹۹,۰۰۰ تومان/ماه',
    'premium.subscribe': 'خرید اشتراک',
    'premium.freeTrial': 'آزمایش رایگان ۷ روزه',
    
    // Rewards
    'rewards.title': 'پاداش‌ها و امتیازات',
    'rewards.subtitle': 'امتیاز جمع کنید و جوایز نقدی بگیرید',
    'rewards.points': 'امتیاز شما',
    'rewards.balance': 'موجودی',
    'rewards.watchVideo': 'تماشای ویدیو',
    'rewards.uploadVideo': 'آپلود ویدیو',
    'rewards.shareVideo': 'اشتراک‌گذاری',
    'rewards.dailyLogin': 'ورود روزانه',
    'rewards.invite': 'دعوت دوستان',
    'rewards.review': 'نظر و امتیاز',
    
    // Wallet
    'wallet.title': 'کیف پول ریالی',
    'wallet.balance': 'موجودی',
    'wallet.deposit': 'واریز',
    'wallet.withdraw': 'برداشت',
    'wallet.history': 'تاریخچه تراکنش‌ها',
    'wallet.earnings': 'درآمد از ویدیوها',
    'wallet.rewards': 'درآمد از پاداش‌ها',
    'wallet.bankAccount': 'حساب بانکی',
    'wallet.cardNumber': 'شماره کارت',
    'wallet.amount': 'مبلغ (تومان)',
    
    // Live
    'live.title': 'پخش زنده',
    'live.startStream': 'شروع پخش زنده',
    'live.viewers': 'بیننده',
    'live.chat': 'چت زنده',
    'live.settings': 'تنظیمات پخش',
    'live.quality': 'کیفیت پخش',
    'live.endStream': 'پایان پخش',
    
    // Podcasts
    'podcasts.title': 'پادکست‌ها',
    'podcasts.episodes': 'قسمت',
    'podcasts.duration': 'مدت زمان',
    'podcasts.play': 'پخش',
    'podcasts.pause': 'توقف',
    'podcasts.subscribe': 'اشتراک در پادکست',
    
    // Admin
    'admin.dashboard': 'داشبورد',
    'admin.users': 'مدیریت کاربران',
    'admin.videos': 'مدیریت ویدیوها',
    'admin.analytics': 'آمار و تحلیل',
    'admin.live': 'مدیریت پخش زنده',
    'admin.wallet': 'مدیریت کیف پول',
    'admin.revenue': 'درآمد کل',
    'admin.totalUsers': 'کل کاربران',
    'admin.totalVideos': 'کل ویدیوها',
    'admin.totalViews': 'کل بازدیدها',
    'admin.pendingReview': 'در انتظار بررسی',
    'admin.monetization': 'تنظیمات کسب درآمد',
    
    // Common
    'common.loading': 'در حال بارگذاری...',
    'common.error': 'خطا',
    'common.success': 'موفق',
    'common.cancel': 'لغو',
    'common.save': 'ذخیره',
    'common.delete': 'حذف',
    'common.edit': 'ویرایش',
    'common.view': 'مشاهده',
    'common.back': 'بازگشت',
    'common.next': 'بعدی',
    'common.previous': 'قبلی',
    'common.search': 'جستجو',
    'common.filter': 'فیلتر',
    'common.sort': 'مرتب‌سازی',
    'common.settings': 'تنظیمات',
  },
  
  en: {
    // Header
    'header.search': 'Search videos, channels, and podcasts...',
    'header.upload': 'Upload Video',
    'header.live': 'Go Live',
    'header.notifications': 'Notifications',
    'header.signin': 'Sign In',
    'header.signout': 'Sign Out',
    'header.profile': 'My Profile',
    'header.admin': 'Admin Panel',
    'header.wallet': 'Wallet',
    
    // Sidebar
    'sidebar.home': 'Home',
    'sidebar.trending': 'Trending',
    'sidebar.subscriptions': 'Subscriptions',
    'sidebar.library': 'Library',
    'sidebar.history': 'History',
    'sidebar.watchLater': 'Watch Later',
    'sidebar.likedVideos': 'Liked Videos',
    'sidebar.playlists': 'Playlists',
    'sidebar.live': 'Live',
    'sidebar.podcasts': 'Podcasts',
    'sidebar.premium': 'Premium',
    'sidebar.rewards': 'Rewards',
    'sidebar.wallet': 'Wallet',
    'sidebar.categories': 'Categories',
    'sidebar.music': 'Music',
    'sidebar.gaming': 'Gaming',
    'sidebar.sports': 'Sports',
    'sidebar.news': 'News',
    'sidebar.education': 'Education',
    'sidebar.technology': 'Technology',
    'sidebar.entertainment': 'Entertainment',
    
    // Video
    'video.views': 'views',
    'video.subscribers': 'subscribers',
    'video.like': 'Like',
    'video.dislike': 'Dislike',
    'video.share': 'Share',
    'video.download': 'Download',
    'video.save': 'Save',
    'video.subscribe': 'Subscribe',
    'video.subscribed': 'Subscribed',
    'video.comments': 'Comments',
    'video.addComment': 'Add a public comment...',
    'video.comment': 'Comment',
    'video.quality': 'Quality',
    'video.speed': 'Playback Speed',
    'video.subtitles': 'Subtitles',
    'video.fullscreen': 'Fullscreen',
    'video.pip': 'Picture in Picture',
    
    // Upload
    'upload.title': 'Upload Video',
    'upload.selectFile': 'Select Video File',
    'upload.dragDrop': 'Or drag and drop a file',
    'upload.videoTitle': 'Video Title',
    'upload.description': 'Description',
    'upload.category': 'Category',
    'upload.tags': 'Tags (comma separated)',
    'upload.thumbnail': 'Thumbnail',
    'upload.privacy': 'Privacy',
    'upload.monetization': 'Monetization',
    'upload.subtitles': 'Subtitles',
    'upload.cancel': 'Cancel',
    'upload.publish': 'Publish',
    'upload.draft': 'Save as Draft',
    
    // Login
    'login.title': 'Sign in to Vitimo',
    'login.subtitle': 'Welcome to the professional video platform',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.signin': 'Sign In',
    'login.signup': 'Sign Up',
    'login.forgotPassword': 'Forgot Password',
    'login.demo': 'Demo Accounts:',
    'login.admin': 'Admin',
    'login.user': 'User',
    
    // Premium
    'premium.title': 'Vitimo Premium',
    'premium.subtitle': 'Ultimate video and podcast experience',
    'premium.noAds': 'Ad-free',
    'premium.hd': '4K Quality',
    'premium.offline': 'Offline Viewing',
    'premium.exclusive': 'Exclusive Content',
    'premium.earlyAccess': 'Early Access',
    'premium.prioritySupport': 'Priority Support',
    'premium.price': '$19.99/month',
    'premium.subscribe': 'Subscribe Now',
    'premium.freeTrial': '7-day Free Trial',
    
    // Rewards
    'rewards.title': 'Rewards & Points',
    'rewards.subtitle': 'Earn points and get cash rewards',
    'rewards.points': 'Your Points',
    'rewards.balance': 'Balance',
    'rewards.watchVideo': 'Watch Video',
    'rewards.uploadVideo': 'Upload Video',
    'rewards.shareVideo': 'Share Video',
    'rewards.dailyLogin': 'Daily Login',
    'rewards.invite': 'Invite Friends',
    'rewards.review': 'Rate & Review',
    
    // Wallet
    'wallet.title': 'Rial Wallet',
    'wallet.balance': 'Balance',
    'wallet.deposit': 'Deposit',
    'wallet.withdraw': 'Withdraw',
    'wallet.history': 'Transaction History',
    'wallet.earnings': 'Video Earnings',
    'wallet.rewards': 'Reward Earnings',
    'wallet.bankAccount': 'Bank Account',
    'wallet.cardNumber': 'Card Number',
    'wallet.amount': 'Amount (Rial)',
    
    // Live
    'live.title': 'Live Streaming',
    'live.startStream': 'Start Live Stream',
    'live.viewers': 'viewers',
    'live.chat': 'Live Chat',
    'live.settings': 'Stream Settings',
    'live.quality': 'Stream Quality',
    'live.endStream': 'End Stream',
    
    // Podcasts
    'podcasts.title': 'Podcasts',
    'podcasts.episodes': 'episodes',
    'podcasts.duration': 'Duration',
    'podcasts.play': 'Play',
    'podcasts.pause': 'Pause',
    'podcasts.subscribe': 'Subscribe to Podcast',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.users': 'User Management',
    'admin.videos': 'Video Management',
    'admin.analytics': 'Analytics',
    'admin.live': 'Live Management',
    'admin.wallet': 'Wallet Management',
    'admin.revenue': 'Total Revenue',
    'admin.totalUsers': 'Total Users',
    'admin.totalVideos': 'Total Videos',
    'admin.totalViews': 'Total Views',
    'admin.pendingReview': 'Pending Review',
    'admin.monetization': 'Monetization Settings',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.settings': 'Settings',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fa');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'fa';

  const value = {
    language,
    setLanguage,
    t,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={`font-${language}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};