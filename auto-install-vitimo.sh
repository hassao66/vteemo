#!/bin/bash

# اسکریپت نصب خودکار ویتیمو روی اوبونتو
# استفاده: curl -sSL https://raw.githubusercontent.com/your-repo/auto-install-vitimo.sh | bash

set -e  # خروج در صورت خطا

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# تابع‌های نمایش پیام
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# بررسی دسترسی root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "این اسکریپت باید با دسترسی root اجرا شود"
        echo "لطفاً دستور زیر را اجرا کنید:"
        echo "sudo $0"
        exit 1
    fi
}

# تشخیص سیستم عامل
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        print_error "نمی‌توان سیستم عامل را تشخیص داد"
        exit 1
    fi
    
    if [[ "$OS" != *"Ubuntu"* ]]; then
        print_error "این اسکریپت فقط برای اوبونتو طراحی شده است"
        exit 1
    fi
    
    print_success "سیستم عامل تشخیص داده شد: $OS $VER"
}

# دریافت اطلاعات از کاربر
get_user_input() {
    print_header "تنظیمات اولیه"
    
    echo -e "${CYAN}لطفاً اطلاعات زیر را وارد کنید:${NC}"
    echo ""
    
    read -p "نام دامنه شما (مثال: vitimo.com): " DOMAIN_NAME
    read -p "ایمیل شما (برای SSL): " EMAIL
    read -p "نام کاربری جدید (پیش‌فرض: vitimo): " USERNAME
    USERNAME=${USERNAME:-vitimo}
    
    echo ""
    echo -e "${YELLOW}اطلاعات وارد شده:${NC}"
    echo "دامنه: $DOMAIN_NAME"
    echo "ایمیل: $EMAIL"
    echo "کاربر: $USERNAME"
    echo ""
    
    read -p "آیا اطلاعات صحیح است؟ (y/n): " CONFIRM
    if [[ $CONFIRM != "y" && $CONFIRM != "Y" ]]; then
        echo "لطفاً اسکریپت را دوباره اجرا کنید"
        exit 1
    fi
}

# به‌روزرسانی سیستم
update_system() {
    print_header "به‌روزرسانی سیستم"
    
    print_status "به‌روزرسانی لیست پکیج‌ها..."
    apt update
    
    print_status "به‌روزرسانی سیستم..."
    apt upgrade -y
    
    print_success "سیستم به‌روزرسانی شد"
}

# نصب پیش‌نیازها
install_prerequisites() {
    print_header "نصب پیش‌نیازها"
    
    print_status "نصب ابزارهای پایه..."
    apt install -y curl wget git unzip htop nano ufw software-properties-common
    
    print_status "نصب Nginx..."
    apt install -y nginx
    
    print_status "نصب Certbot برای SSL..."
    apt install -y certbot python3-certbot-nginx
    
    print_status "نصب Fail2Ban برای امنیت..."
    apt install -y fail2ban
    
    print_success "پیش‌نیازها نصب شدند"
}

# نصب Node.js
install_nodejs() {
    print_header "نصب Node.js"
    
    print_status "اضافه کردن مخزن NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    
    print_status "نصب Node.js..."
    apt-get install -y nodejs
    
    # بررسی نصب
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    print_success "Node.js $NODE_VERSION نصب شد"
    print_success "npm $NPM_VERSION نصب شد"
}

# نصب PM2
install_pm2() {
    print_header "نصب PM2"
    
    print_status "نصب PM2 و serve..."
    npm install -g pm2 serve
    
    PM2_VERSION=$(pm2 --version)
    print_success "PM2 $PM2_VERSION نصب شد"
}

# ایجاد کاربر پروژه
create_user() {
    print_header "ایجاد کاربر پروژه"
    
    print_status "ایجاد کاربر $USERNAME..."
    if ! id "$USERNAME" &>/dev/null; then
        adduser --disabled-password --gecos "" $USERNAME
        usermod -aG sudo $USERNAME
        print_success "کاربر $USERNAME ایجاد شد"
    else
        print_warning "کاربر $USERNAME از قبل وجود دارد"
    fi
    
    # ایجاد پوشه‌های مورد نیاز
    print_status "ایجاد پوشه‌های پروژه..."
    sudo -u $USERNAME mkdir -p /home/$USERNAME/apps
    sudo -u $USERNAME mkdir -p /home/$USERNAME/backups
    sudo -u $USERNAME mkdir -p /home/$USERNAME/logs
    
    print_success "پوشه‌های پروژه ایجاد شدند"
}

# نصب پروژه ویتیمو
install_vitimo() {
    print_header "نصب پروژه ویتیمو"
    
    PROJECT_DIR="/home/$USERNAME/apps/vitimo"
    
    print_status "ایجاد پوشه پروژه..."
    sudo -u $USERNAME mkdir -p $PROJECT_DIR
    cd $PROJECT_DIR
    
    print_status "ایجاد package.json..."
    sudo -u $USERNAME cat > package.json << 'EOF'
{
  "name": "vitimo-platform",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "serve -s dist -l 3000"
  },
  "dependencies": {
    "date-fns": "^4.1.0",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.8.0",
    "recharts": "^3.1.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
EOF

    print_status "ایجاد فایل‌های تنظیمات..."
    
    # ایجاد index.html
    sudo -u $USERNAME cat > index.html << 'EOF'
<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ویتیمو - پلتفرم ویدیویی حرفه‌ای</title>
    <meta name="description" content="پلتفرم ویدیویی حرفه‌ای با امکانات کامل آپلود، پخش، پادکست و کیف پول ریالی" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

    # ایجاد vite.config.ts
    sudo -u $USERNAME cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          icons: ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
EOF

    # ایجاد tailwind.config.js
    sudo -u $USERNAME cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vitimo: {
          50: '#f8f4ff',
          100: '#f0e6ff',
          200: '#e6d9ff',
          300: '#d1b3ff',
          400: '#b380ff',
          500: '#9966ff',
          600: '#6A0DAD',
          700: '#4B0082',
          800: '#3d0066',
          900: '#2d004d',
          950: '#1a0029',
        },
        gold: {
          50: '#fffef7',
          100: '#fffbeb',
          200: '#fff4d1',
          300: '#ffe8a3',
          400: '#ffd966',
          500: '#FFD700',
          600: '#e6c200',
          700: '#cc9900',
          800: '#b38600',
          900: '#996600',
        },
      },
      fontFamily: {
        'fa': ['Vazirmatn', 'sans-serif'],
        'en': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
EOF

    # ایجاد postcss.config.js
    sudo -u $USERNAME cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

    # ایجاد پوشه src
    sudo -u $USERNAME mkdir -p src
    
    # ایجاد src/main.tsx
    sudo -u $USERNAME cat > src/main.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
EOF

    # ایجاد src/App.tsx
    sudo -u $USERNAME cat > src/App.tsx << 'EOF'
import React from 'react';
import { Play, Crown, Users, Video, Wallet, Radio, Mic, Star, Globe, Shield, Download } from 'lucide-react';

function App() {
  const stats = [
    { icon: Video, label: 'ویدیوهای آپلود شده', value: '1000+', color: 'text-blue-400' },
    { icon: Users, label: 'کاربران فعال', value: '5000+', color: 'text-green-400' },
    { icon: Radio, label: 'پخش زنده', value: '24/7', color: 'text-red-400' },
    { icon: Wallet, label: 'درآمد کاربران', value: '10M+ ریال', color: 'text-yellow-400' },
  ];

  const features = [
    { icon: Play, title: 'پخش ویدیو 4K', desc: 'تماشای ویدیو با بالاترین کیفیت ممکن' },
    { icon: Crown, title: 'اشتراک ویژه', desc: 'محتوای اختصاصی و بدون تبلیغات' },
    { icon: Radio, title: 'پخش زنده', desc: 'پخش زنده تعاملی با چت و کامنت' },
    { icon: Mic, title: 'پادکست', desc: 'پادکست‌های صوتی با کیفیت استودیویی' },
    { icon: Wallet, title: 'کیف پول ریالی', desc: 'کسب درآمد مستقیم از ویدیوهای خود' },
    { icon: Star, title: 'سیستم پاداش', desc: 'امتیاز جمع کنید و جایزه نقدی بگیرید' },
    { icon: Globe, title: 'چندزبانه', desc: 'پشتیبانی کامل از فارسی و انگلیسی' },
    { icon: Shield, title: 'امنیت بالا', desc: 'حفاظت کامل از اطلاعات کاربران' },
    { icon: Download, title: 'دانلود آفلاین', desc: 'دانلود ویدیوها برای تماشای آفلاین' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 text-white fill-current" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-purple-900" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  ویتیمو
                </h1>
                <p className="text-yellow-400 font-medium text-sm">Premium Video Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all">
                ورود
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2 rounded-lg font-medium transition-all">
                ثبت نام
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-6 py-3 mb-8">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 font-medium">🎉 ویتیمو با موفقیت نصب و راه‌اندازی شد!</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-yellow-200 bg-clip-text text-transparent mb-6 leading-tight">
              ویتیمو
              <br />
              <span className="text-yellow-400 text-5xl md:text-6xl">پلتفرم ویدیویی حرفه‌ای</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-4xl mx-auto leading-relaxed">
              پلتفرم کاملی برای اشتراک‌گذاری ویدیو با پخش زنده، پادکست، کیف پول ریالی، سیستم پاداش و پنل مدیریت پیشرفته
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl">
                🚀 شروع کنید
              </button>
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900 px-10 py-5 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl">
                👑 اشتراک ویژه
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">آمار پلتفرم</h2>
            <p className="text-xl text-purple-200">ویتیمو در یک نگاه</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center hover:bg-white/15 transition-all transform hover:scale-105">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg">
                      <IconComponent className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">{stat.value}</h3>
                  <p className="text-purple-200">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">ویژگی‌های ویتیمو</h2>
            <p className="text-2xl text-purple-200 max-w-3xl mx-auto">
              همه چیز که برای یک پلتفرم ویدیویی مدرن و حرفه‌ای نیاز دارید
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 group">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-300 shadow-lg">
                      <IconComponent className="w-8 h-8 text-white group-hover:text-purple-900 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-purple-200 leading-relaxed text-lg">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-yellow-400/20 backdrop-blur-sm border border-white/20 rounded-3xl p-16">
            <h2 className="text-5xl font-bold text-white mb-6">آماده شروع هستید؟</h2>
            <p className="text-2xl text-purple-200 mb-12 leading-relaxed">
              همین الان حساب کاربری خود را ایجاد کنید و از تمام امکانات پیشرفته ویتیمو استفاده کنید
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900 px-12 py-6 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl">
                🎬 شروع رایگان
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-12 py-6 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl">
                👑 اشتراک ویژه
              </button>
            </div>
            <p className="text-purple-300 mt-8 text-lg">
              ✨ بدون نیاز به کارت اعتباری • لغو در هر زمان
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <Play className="w-7 h-7 text-white fill-current" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">ویتیمو</span>
                  <p className="text-purple-200">پلتفرم ویدیویی حرفه‌ای</p>
                </div>
              </div>
              <p className="text-purple-200 leading-relaxed text-lg max-w-md">
                ویتیمو، پلتفرم کاملی برای اشتراک‌گذاری ویدیو با امکانات پیشرفته و تجربه کاربری بی‌نظیر
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">لینک‌های مفید</h3>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">درباره ما</a></li>
                <li><a href="#" className="hover:text-white transition-colors">تماس با ما</a></li>
                <li><a href="#" className="hover:text-white transition-colors">قوانین و مقررات</a></li>
                <li><a href="#" className="hover:text-white transition-colors">حریم خصوصی</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">پشتیبانی</h3>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">مرکز راهنمایی</a></li>
                <li><a href="#" className="hover:text-white transition-colors">پشتیبانی فنی</a></li>
                <li><a href="#" className="hover:text-white transition-colors">گزارش مشکل</a></li>
                <li><a href="#" className="hover:text-white transition-colors">درخواست ویژگی</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-purple-200 mb-4 md:mb-0">
                © 2024 ویتیمو. تمام حقوق محفوظ است.
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-purple-200">نسخه 1.0.0</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm">سرور آنلاین</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
EOF

    # ایجاد src/index.css
    sudo -u $USERNAME cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap');

/* Base styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Vazirmatn', 'Inter', sans-serif;
  background-color: #0f0f23;
  color: #ffffff;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a2e;
}

::-webkit-scrollbar-thumb {
  background: #6A0DAD;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4B0082;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

/* Gradient backgrounds */
.bg-gradient-purple {
  background: linear-gradient(135deg, #6A0DAD 0%, #4B0082 100%);
}

.bg-gradient-gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

/* Button styles */
.btn-primary {
  background: linear-gradient(135deg, #6A0DAD 0%, #4B0082 100%);
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(106, 13, 173, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(106, 13, 173, 0.5);
}

.btn-gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #0f0f23;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.5);
}

/* Responsive design */
@media (max-width: 768px) {
  .mobile-responsive {
    padding: 1rem;
  }
}

/* RTL support */
[dir="rtl"] .rtl-flip {
  transform: scaleX(-1);
}

/* Loading spinner */
.spinner {
  border: 3px solid rgba(106, 13, 173, 0.2);
  border-radius: 50%;
  border-top: 3px solid #6A0DAD;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
EOF

    # ایجاد src/vite-env.d.ts
    sudo -u $USERNAME cat > src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />
EOF

    print_status "نصب dependencies..."
    sudo -u $USERNAME npm install
    
    print_status "ساخت پروژه..."
    sudo -u $USERNAME npm run build
    
    print_success "پروژه ویتیمو ایجاد شد"
}

# تنظیم PM2
setup_pm2() {
    print_header "تنظیم PM2"
    
    PROJECT_DIR="/home/$USERNAME/apps/vitimo"
    cd $PROJECT_DIR
    
    print_status "ایجاد فایل ecosystem.config.js..."
    sudo -u $USERNAME cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'vitimo',
    script: 'serve',
    args: '-s dist -l 3000',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/vitimo/logs/err.log',
    out_file: '/home/vitimo/logs/out.log',
    log_file: '/home/vitimo/logs/combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000
  }]
}
EOF

    print_status "راه‌اندازی PM2..."
    sudo -u $USERNAME pm2 start ecosystem.config.js
    sudo -u $USERNAME pm2 save
    
    # تنظیم startup برای کاربر vitimo
    sudo -u $USERNAME pm2 startup
    
    print_success "PM2 تنظیم شد"
}

# تنظیم Nginx
setup_nginx() {
    print_header "تنظیم Nginx"
    
    print_status "ایجاد تنظیمات Nginx..."
    cat > /etc/nginx/sites-available/vitimo << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;
    
    root /home/$USERNAME/apps/vitimo/dist;
    index index.html;
    
    # تنظیمات برای SPA
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # تنظیمات فایل‌های static
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        gzip_static on;
    }
    
    # تنظیمات امنیتی
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;
    
    # فشرده‌سازی
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml
        font/truetype
        font/opentype
        application/vnd.ms-fontobject;
    
    client_max_body_size 100M;
    
    access_log /var/log/nginx/vitimo_access.log;
    error_log /var/log/nginx/vitimo_error.log;
}
EOF

    # فعال‌سازی سایت
    ln -sf /etc/nginx/sites-available/vitimo /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # تست تنظیمات
    nginx -t
    
    # راه‌اندازی مجدد
    systemctl reload nginx
    
    print_success "Nginx تنظیم شد"
}

# نصب SSL
install_ssl() {
    print_header "نصب SSL Certificate"
    
    print_status "دریافت SSL Certificate از Let's Encrypt..."
    certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --non-interactive --agree-tos --email $EMAIL
    
    # تست تمدید خودکار
    certbot renew --dry-run
    
    print_success "SSL Certificate نصب شد"
}

# تنظیم امنیت
setup_security() {
    print_header "تنظیم امنیت"
    
    print_status "تنظیم فایروال UFW..."
    ufw --force enable
    ufw allow ssh
    ufw allow 'Nginx Full'
    
    print_status "تنظیم Fail2Ban..."
    cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600
EOF

    systemctl enable fail2ban
    systemctl start fail2ban
    
    print_success "تنظیمات امنیتی اعمال شد"
}

# ایجاد اسکریپت‌های مدیریت
create_management_scripts() {
    print_header "ایجاد اسکریپت‌های مدیریت"
    
    # اسکریپت مانیتورینگ
    print_status "ایجاد اسکریپت monitor..."
    cat > /home/$USERNAME/monitor.sh << 'EOF'
#!/bin/bash

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_status() {
    local service=$1
    local status=$2
    local color=$3
    printf "%-20s: ${color}%s${NC}\n" "$service" "$status"
}

echo -e "${PURPLE}🖥️  مانیتور سیستم ویتیمو${NC}"
echo -e "${PURPLE}========================${NC}"
echo ""

echo -e "${BLUE}📊 اطلاعات سیستم:${NC}"
echo "   نام سرور: $(hostname)"
echo "   زمان فعالیت: $(uptime -p)"
echo "   بار سیستم: $(uptime | awk -F'load average:' '{print $2}')"
echo ""

echo -e "${BLUE}💾 استفاده از منابع:${NC}"
echo "   حافظه: $(free -h | awk 'NR==2{printf "%.1f%% (%s/%s)", $3*100/$2, $3, $2}')"
echo "   دیسک: $(df -h /home/vitimo | awk 'NR==2{printf "%s (%s استفاده شده)", $5, $3}')"
echo ""

echo -e "${BLUE}🔧 وضعیت سرویس‌ها:${NC}"

if systemctl is-active --quiet nginx; then
    print_status "Nginx" "✅ در حال اجرا" $GREEN
else
    print_status "Nginx" "❌ متوقف" $RED
fi

if pm2 describe vitimo | grep -q "online"; then
    print_status "PM2 (ویتیمو)" "✅ در حال اجرا" $GREEN
else
    print_status "PM2 (ویتیمو)" "❌ متوقف" $RED
fi

echo ""
echo -e "${BLUE}🌐 وضعیت شبکه:${NC}"
if curl -f -s http://localhost:3000 > /dev/null; then
    print_status "App محلی (3000)" "✅ در دسترس" $GREEN
else
    print_status "App محلی (3000)" "❌ در دسترس نیست" $RED
fi

if curl -f -s http://localhost > /dev/null; then
    print_status "Nginx (80)" "✅ در دسترس" $GREEN
else
    print_status "Nginx (80)" "❌ در دسترس نیست" $RED
fi

echo ""
echo -e "${GREEN}📅 آخرین بررسی: $(date)${NC}"
EOF

    # اسکریپت backup
    print_status "ایجاد اسکریپت backup..."
    cat > /home/$USERNAME/backup.sh << 'EOF'
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/vitimo/backups"
PROJECT_DIR="/home/vitimo/apps/vitimo"

echo "💾 شروع backup..."

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/vitimo_$DATE.tar.gz -C $PROJECT_DIR .

find $BACKUP_DIR -name "vitimo_*.tar.gz" -mtime +7 -delete

echo "✅ Backup تکمیل شد: vitimo_$DATE.tar.gz"
EOF

    # اسکریپت deploy
    print_status "ایجاد اسکریپت deploy..."
    cat > /home/$USERNAME/deploy.sh << 'EOF'
#!/bin/bash

cd /home/vitimo/apps/vitimo

echo "🚀 شروع deploy..."

# Backup
/home/vitimo/backup.sh

# Build
echo "🔨 ساخت پروژه..."
npm run build

# Restart PM2
echo "🔄 راه‌اندازی مجدد PM2..."
pm2 restart vitimo

echo "✅ Deploy تکمیل شد!"
EOF

    # تنظیم مجوزها
    chmod +x /home/$USERNAME/*.sh
    chown $USERNAME:$USERNAME /home/$USERNAME/*.sh
    
    print_success "اسکریپت‌های مدیریت ایجاد شدند"
}

# تنظیم cron jobs
setup_cron() {
    print_header "تنظیم Backup خودکار"
    
    print_status "تنظیم crontab برای backup روزانه..."
    (sudo -u $USERNAME crontab -l 2>/dev/null; echo "0 2 * * * /home/$USERNAME/backup.sh") | sudo -u $USERNAME crontab -
    
    print_success "Backup خودکار تنظیم شد (هر شب ساعت 2)"
}

# نمایش اطلاعات نهایی
show_final_info() {
    print_header "نصب تکمیل شد!"
    
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")
    
    echo -e "${GREEN}🎉 ویتیمو با موفقیت نصب شد!${NC}"
    echo ""
    echo -e "${CYAN}📋 خلاصه نصب:${NC}"
    echo -e "   • Node.js: $(node --version)"
    echo -e "   • PM2: $(pm2 --version)"
    echo -e "   • Nginx: $(nginx -v 2>&1 | cut -d' ' -f3)"
    echo -e "   • SSL: $([ -f "/etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem" ] && echo "✅ نصب شده" || echo "❌ نصب نشده")"
    echo ""
    echo -e "${CYAN}🌐 اطلاعات دسترسی:${NC}"
    echo -e "   • آدرس سایت: https://$DOMAIN_NAME"
    echo -e "   • آدرس IP: http://$SERVER_IP"
    echo -e "   • حساب ادمین: admin@vitimo.com / admin"
    echo -e "   • حساب کاربر: user@vitimo.com / user"
    echo ""
    echo -e "${CYAN}🔧 دستورات مدیریت:${NC}"
    echo -e "   • مانیتورینگ: /home/$USERNAME/monitor.sh"
    echo -e "   • Backup: /home/$USERNAME/backup.sh"
    echo -e "   • Deploy: /home/$USERNAME/deploy.sh"
    echo -e "   • وضعیت PM2: pm2 status"
    echo -e "   • لاگ‌های PM2: pm2 logs vitimo"
    echo ""
    echo -e "${CYAN}📁 مسیرهای مهم:${NC}"
    echo -e "   • پروژه: /home/$USERNAME/apps/vitimo"
    echo -e "   • لاگ‌ها: /home/$USERNAME/logs"
    echo -e "   • Backup ها: /home/$USERNAME/backups"
    echo -e "   • تنظیمات Nginx: /etc/nginx/sites-available/vitimo"
    echo ""
    echo -e "${YELLOW}⚠️  نکات مهم:${NC}"
    echo -e "   • DNS ممکن است تا 24 ساعت طول بکشد"
    echo -e "   • Backup خودکار هر شب ساعت 2 انجام می‌شود"
    echo -e "   • برای به‌روزرسانی از اسکریپت deploy استفاده کنید"
    echo ""
    echo -e "${GREEN}🎊 سایت شما آماده است!${NC}"
    echo -e "${GREEN}🚀 موفق باشید!${NC}"
}

# تابع اصلی
main() {
    print_header "نصب خودکار ویتیمو روی اوبونتو"
    echo -e "${CYAN}نسخه: 2.0 | تاریخ: $(date)${NC}"
    echo ""
    
    check_root
    detect_os
    get_user_input
    update_system
    install_prerequisites
    install_nodejs
    install_pm2
    create_user
    install_vitimo
    setup_pm2
    setup_nginx
    
    # نصب SSL فقط اگر دامنه وارد شده باشد
    if [[ -n "$DOMAIN_NAME" && "$DOMAIN_NAME" != "localhost" ]]; then
        install_ssl
    else
        print_warning "دامنه وارد نشده، SSL نصب نمی‌شود"
    fi
    
    setup_security
    create_management_scripts
    setup_cron
    show_final_info
}

# اجرای اسکریپت
main "$@"