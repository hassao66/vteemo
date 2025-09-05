# 🐧 راهنمای کامل نصب ویتیمو روی سرور اوبونتو

## 📋 فهرست مطالب
1. [آماده‌سازی اولیه](#آماده-سازی-اولیه)
2. [خرید و تنظیم سرور](#خرید-و-تنظیم-سرور)
3. [اتصال به سرور](#اتصال-به-سرور)
4. [نصب پیش‌نیازها](#نصب-پیش-نیازها)
5. [نصب Node.js](#نصب-nodejs)
6. [نصب و تنظیم پروژه](#نصب-و-تنظیم-پروژه)
7. [تنظیم PM2](#تنظیم-pm2)
8. [نصب و تنظیم Nginx](#نصب-و-تنظیم-nginx)
9. [تنظیم دامنه و SSL](#تنظیم-دامنه-و-ssl)
10. [تنظیمات امنیتی](#تنظیمات-امنیتی)
11. [مانیتورینگ و نگهداری](#مانیتورینگ-و-نگهداری)
12. [عیب‌یابی](#عیب-یابی)

---

## 🎯 آماده‌سازی اولیه

### چه چیزی نیاز داریم؟

#### ۱. سرور اوبونتو:
- **نسخه**: Ubuntu 20.04 LTS یا 22.04 LTS
- **RAM**: حداقل 1GB (توصیه: 2GB)
- **CPU**: حداقل 1 Core (توصیه: 2 Core)
- **Storage**: حداقل 20GB SSD
- **Network**: اتصال اینترنت پایدار

#### ۲. دامنه (اختیاری):
- مثال: `vitimo.com`
- قیمت: ۱۰-۵۰ هزار تومان/سال

#### ۳. ابزارهای محلی:
- **ویندوز**: PuTTY یا Windows Terminal
- **مک/لینوکس**: Terminal داخلی

---

## 🛒 خرید و تنظیم سرور

### گزینه الف: آروان کلود (ایرانی)

#### مرحله ۱: ثبت نام
1. به [arvancloud.com](https://arvancloud.com) بروید
2. روی "ثبت نام" کلیک کنید
3. اطلاعات خود را وارد کنید:
   - نام و نام خانوادگی
   - ایمیل معتبر
   - شماره موبایل
   - رمز عبور قوی

#### مرحله ۲: تأیید حساب
1. ایمیل تأیید را چک کنید
2. روی لینک تأیید کلیک کنید
3. شماره موبایل را تأیید کنید

#### مرحله ۳: خرید سرور
1. وارد پنل کاربری شوید
2. از منوی بالا "محصولات" → "سرور ابری" را انتخاب کنید
3. پلن مناسب را انتخاب کنید:
   - **پایه**: 1 CPU, 1GB RAM, 25GB SSD (۶۰,۰۰۰ تومان/ماه)
   - **استاندارد**: 2 CPU, 2GB RAM, 50GB SSD (۱۲۰,۰۰۰ تومان/ماه) ⭐ توصیه شده
   - **حرفه‌ای**: 4 CPU, 4GB RAM, 80GB SSD (۲۴۰,۰۰۰ تومان/ماه)

4. تنظیمات سرور:
   - **سیستم عامل**: Ubuntu 22.04 LTS
   - **منطقه**: تهران (سرعت بیشتر)
   - **نام سرور**: vitimo-server

5. پرداخت کنید

#### مرحله ۴: دریافت اطلاعات سرور
بعد از خرید، ایمیلی دریافت می‌کنید که شامل:
- **IP Address**: مثال `185.143.232.100`
- **Username**: `root`
- **Password**: رمز عبور موقت

### گزینه ب: DigitalOcean (خارجی)

#### مرحله ۱: ثبت نام
1. به [digitalocean.com](https://digitalocean.com) بروید
2. "Sign up" کنید
3. ایمیل و کارت اعتباری خود را وارد کنید

#### مرحله ۲: ایجاد Droplet
1. روی "Create" → "Droplets" کلیک کنید
2. تنظیمات:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($6/month - 1GB RAM, 1 CPU, 25GB SSD)
   - **Region**: Amsterdam, Netherlands (نزدیک‌ترین به ایران)
   - **Authentication**: Password (رمز قوی انتخاب کنید)
   - **Hostname**: vitimo-server

3. "Create Droplet" کنید

---

## 🔐 اتصال به سرور

### برای ویندوز:

#### روش ۱: استفاده از PuTTY
1. **دانلود PuTTY:**
   - به [putty.org](https://putty.org) بروید
   - "Download PuTTY" کنید
   - فایل `.msi` را دانلود و نصب کنید

2. **اتصال:**
   - PuTTY را باز کنید
   - در قسمت "Host Name": IP سرور را وارد کنید
   - "Port": ۲۲ بگذارید
   - "Connection type": SSH انتخاب کنید
   - "Open" کنید
   - در پنجره باز شده:
     - `login as:` → `root` تایپ کنید
     - `password:` → رمز عبور را وارد کنید (نمایش داده نمی‌شود)

#### روش ۲: Windows Terminal (ویندوز ۱۰+)
1. Windows Terminal را باز کنید
2. دستور زیر را تایپ کنید:
```bash
ssh root@IP_ADDRESS
# مثال: ssh root@185.143.232.100
```

### برای مک:
1. Terminal را باز کنید (`Cmd + Space` → `Terminal`)
2. دستور زیر را تایپ کنید:
```bash
ssh root@IP_ADDRESS
```

### برای لینوکس:
1. Terminal را باز کنید (`Ctrl + Alt + T`)
2. دستور زیر را تایپ کنید:
```bash
ssh root@IP_ADDRESS
```

**نکته مهم:** اولین بار که وصل می‌شوید، پیامی مثل این می‌بینید:
```
The authenticity of host 'IP_ADDRESS' can't be established.
Are you sure you want to continue connecting (yes/no)?
```
`yes` تایپ کنید و Enter بزنید.

---

## 🔧 نصب پیش‌نیازها

### مرحله ۱: به‌روزرسانی سیستم
```bash
# به‌روزرسانی لیست پکیج‌ها
apt update

# به‌روزرسانی سیستم (۵-۱۰ دقیقه طول می‌کشد)
apt upgrade -y
```

**توضیح:** این دستورات سیستم را به آخرین نسخه می‌رسانند.

### مرحله ۲: نصب ابزارهای پایه
```bash
# نصب ابزارهای ضروری
apt install -y curl wget git unzip htop nano ufw
```

**توضیح هر ابزار:**
- `curl`: دانلود فایل از اینترنت
- `wget`: دانلود فایل (جایگزین curl)
- `git`: مدیریت کد
- `unzip`: باز کردن فایل‌های فشرده
- `htop`: مانیتور منابع سیستم
- `nano`: ویرایشگر متن ساده
- `ufw`: فایروال ساده

### مرحله ۳: ایجاد کاربر جدید (امنیت)
```bash
# ایجاد کاربر جدید
adduser vitimo
```

**سیستم از شما می‌پرسد:**
- `New password:` → رمز قوی وارد کنید (مثل: `Vitimo@2024!`)
- `Retype new password:` → همان رمز را دوباره وارد کنید
- `Full Name:` → Enter بزنید (خالی بگذارید)
- `Room Number:` → Enter بزنید
- `Work Phone:` → Enter بزنید
- `Home Phone:` → Enter بزنید
- `Other:` → Enter بزنید
- `Is the information correct?` → `Y` بزنید

```bash
# دادن دسترسی sudo به کاربر جدید
usermod -aG sudo vitimo

# تغییر به کاربر جدید
su - vitimo
```

**توضیح:** از این به بعد با کاربر `vitimo` کار می‌کنیم که امن‌تر است.

---

## 📦 نصب Node.js

### مرحله ۱: اضافه کردن مخزن NodeSource
```bash
# دانلود و اجرای اسکریپت نصب Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
```

**توضیح:** این دستور مخزن رسمی Node.js را به سیستم اضافه می‌کند.

### مرحله ۲: نصب Node.js
```bash
# نصب Node.js و npm
sudo apt-get install -y nodejs
```

### مرحله ۳: بررسی نصب
```bash
# بررسی نسخه Node.js
node --version
# باید چیزی شبیه v18.19.0 نشان دهد

# بررسی نسخه npm
npm --version
# باید چیزی شبیه 10.2.3 نشان دهد
```

**اگر نسخه‌ها نشان داده شد، یعنی نصب موفق بوده! ✅**

---

## 🔄 نصب PM2 (مدیر فرآیندها)

### مرحله ۱: نصب PM2
```bash
# نصب PM2 به صورت سراسری
sudo npm install -g pm2

# نصب serve برای سرو کردن فایل‌های static
sudo npm install -g serve
```

### مرحله ۲: بررسی نصب
```bash
# بررسی نسخه PM2
pm2 --version
# باید شماره نسخه نشان دهد

# بررسی نسخه serve
serve --version
# باید شماره نسخه نشان دهد
```

**توضیح:** PM2 برای مدیریت فرآیندهای Node.js استفاده می‌شود و serve برای سرو کردن فایل‌های ساخته شده.

---

## 📁 نصب و تنظیم پروژه

### مرحله ۱: ایجاد ساختار پوشه‌ها
```bash
# ایجاد پوشه‌های مورد نیاز
mkdir -p /home/vitimo/apps
mkdir -p /home/vitimo/backups
mkdir -p /home/vitimo/logs

# رفتن به پوشه apps
cd /home/vitimo/apps
```

### مرحله ۲: ایجاد پروژه
```bash
# ایجاد پوشه پروژه
mkdir vitimo
cd vitimo
```

### مرحله ۳: ایجاد فایل package.json
```bash
# ایجاد فایل package.json
nano package.json
```

**در ویرایشگر nano، این محتوا را کپی کنید:**
```json
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
```

**نحوه ذخیره در nano:**
1. `Ctrl + X` بزنید
2. `Y` بزنید (برای تأیید ذخیره)
3. `Enter` بزنید (برای تأیید نام فایل)

### مرحله ۴: ایجاد فایل‌های تنظیمات

#### ایجاد index.html:
```bash
nano index.html
```

**محتوا:**
```html
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
```

#### ایجاد vite.config.ts:
```bash
nano vite.config.ts
```

**محتوا:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
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
```

#### ایجاد tailwind.config.js:
```bash
nano tailwind.config.js
```

**محتوا:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Main brand colors
        vitimo: {
          50: '#f8f4ff',
          100: '#f0e6ff',
          200: '#e6d9ff',
          300: '#d1b3ff',
          400: '#b380ff',
          500: '#9966ff',
          600: '#6A0DAD', // Main purple
          700: '#4B0082', // Dark purple
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
          500: '#FFD700', // Main gold
          600: '#e6c200',
          700: '#cc9900',
          800: '#b38600',
          900: '#996600',
        },
        // Dark theme colors
        dark: {
          primary: '#0f0f23',
          secondary: '#1a1a2e',
          tertiary: '#2a2a3e',
          quaternary: '#3a3a4e',
        }
      },
      fontFamily: {
        'fa': ['Vazirmatn', 'sans-serif'],
        'en': ['Inter', 'sans-serif'],
        'sans': ['Inter', 'Vazirmatn', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-custom': 'pulse 2s infinite',
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
};
```

#### ایجاد postcss.config.js:
```bash
nano postcss.config.js
```

**محتوا:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### ایجاد tsconfig.json:
```bash
nano tsconfig.json
```

**محتوا:**
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

#### ایجاد tsconfig.app.json:
```bash
nano tsconfig.app.json
```

**محتوا:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

#### ایجاد tsconfig.node.json:
```bash
nano tsconfig.node.json
```

**محتوا:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

### مرحله ۵: ایجاد پوشه src و فایل‌های React

```bash
# ایجاد پوشه src
mkdir src
cd src
```

#### ایجاد src/main.tsx:
```bash
nano main.tsx
```

**محتوا:**
```typescript
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
```

#### ایجاد src/App.tsx:
```bash
nano App.tsx
```

**محتوا:**
```typescript
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Play, Crown, Users, Video, Wallet, Radio, Mic, Star } from 'lucide-react';

function App() {
  const stats = [
    { icon: Video, label: 'ویدیوهای آپلود شده', value: '1000+', color: 'text-blue-400' },
    { icon: Users, label: 'کاربران فعال', value: '5000+', color: 'text-green-400' },
    { icon: Radio, label: 'پخش زنده', value: '24/7', color: 'text-red-400' },
    { icon: Wallet, label: 'درآمد کاربران', value: '10M+ ریال', color: 'text-gold-400' },
  ];

  const features = [
    { icon: Play, title: 'پخش ویدیو 4K', desc: 'تماشای ویدیو با بالاترین کیفیت' },
    { icon: Crown, title: 'اشتراک ویژه', desc: 'محتوای اختصاصی و بدون تبلیغات' },
    { icon: Radio, title: 'پخش زنده', desc: 'پخش زنده تعاملی با چت' },
    { icon: Mic, title: 'پادکست', desc: 'پادکست‌های صوتی با کیفیت بالا' },
    { icon: Wallet, title: 'کیف پول ریالی', desc: 'کسب درآمد از ویدیوهای خود' },
    { icon: Star, title: 'سیستم پاداش', desc: 'امتیاز جمع کنید و جایزه بگیرید' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
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
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">🎉 ویتیمو با موفقیت نصب شد!</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-yellow-200 bg-clip-text text-transparent mb-6">
              پلتفرم ویدیویی
              <br />
              <span className="text-yellow-400">حرفه‌ای</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              ویتیمو، پلتفرم کاملی برای اشتراک‌گذاری ویدیو با پخش زنده، پادکست، کیف پول ریالی و سیستم پاداش
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl">
                شروع کنید
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-medium transition-all">
                مشاهده دمو
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl">
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-purple-200 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">ویژگی‌های ویتیمو</h2>
            <p className="text-xl text-purple-200">همه چیز که برای یک پلتفرم ویدیویی حرفه‌ای نیاز دارید</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all">
                      <IconComponent className="w-6 h-6 text-white group-hover:text-purple-900 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-purple-200 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-yellow-400/20 backdrop-blur-sm border border-white/20 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-white mb-4">آماده شروع هستید؟</h2>
            <p className="text-xl text-purple-200 mb-8">
              همین الان حساب کاربری خود را ایجاد کنید و از تمام امکانات ویتیمو استفاده کنید
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl">
                شروع رایگان
              </button>
              <button className="text-white hover:text-yellow-400 font-medium transition-colors">
                بیشتر بدانید →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-current" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">ویتیمو</span>
                <p className="text-purple-200 text-sm">نسخه 1.0.0</p>
              </div>
            </div>
            <div className="text-purple-200 text-sm">
              © 2024 ویتیمو. تمام حقوق محفوظ است.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
```

#### ایجاد src/index.css:
```bash
nano index.css
```

**محتوا:**
```css
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
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #1a1a2e;
}

::-webkit-scrollbar-thumb {
  background: #6A0DAD;
  border-radius: 3px;
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

/* Responsive design */
@media (max-width: 768px) {
  .mobile-responsive {
    padding: 1rem;
  }
}
```

#### ایجاد src/vite-env.d.ts:
```bash
nano vite-env.d.ts
```

**محتوا:**
```typescript
/// <reference types="vite/client" />
```

### مرحله ۶: بازگشت به پوشه اصلی و نصب dependencies
```bash
# بازگشت به پوشه اصلی پروژه
cd /home/vitimo/apps/vitimo

# نصب تمام وابستگی‌ها (۵-۱۰ دقیقه طول می‌کشد)
npm install
```

**توضیح:** این دستور تمام کتابخانه‌های مورد نیاز React، TypeScript، Tailwind و غیره را دانلود می‌کند.

### مرحله ۷: ساخت پروژه
```bash
# ساخت پروژه برای production
npm run build
```

**توضیح:** این دستور فایل‌های نهایی و بهینه شده سایت را در پوشه `dist` ایجاد می‌کند.

---

## ⚙️ تنظیم PM2

### مرحله ۱: ایجاد فایل تنظیمات PM2
```bash
# ایجاد فایل ecosystem.config.js
nano ecosystem.config.js
```

**محتوا:**
```javascript
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
    // تنظیمات اضافی برای بهینه‌سازی
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    listen_timeout: 8000,
    shutdown_with_message: true
  }]
}
```

### مرحله ۲: راه‌اندازی PM2
```bash
# شروع پروژه با PM2
pm2 start ecosystem.config.js

# مشاهده وضعیت
pm2 status
```

**خروجی موفق باید شبیه این باشد:**
```
┌─────┬──────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name     │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼──────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ vitimo   │ default     │ 1.0.0   │ fork    │ 12345    │ 0s     │ 0    │ online    │ 0%       │ 25.2mb   │ vitimo   │ disabled │
└─────┴──────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

### مرحله ۳: ذخیره تنظیمات PM2
```bash
# ذخیره تنظیمات فعلی PM2
pm2 save

# تنظیم راه‌اندازی خودکار هنگام بوت سیستم
pm2 startup
```

**PM2 دستوری مثل این به شما می‌دهد:**
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vitimo --hp /home/vitimo
```
**این دستور را کپی کرده و اجرا کنید.**

### مرحله ۴: تست اولیه
```bash
# بررسی اینکه سایت روی پورت 3000 کار می‌کند
curl http://localhost:3000
```

**اگر HTML برگردانده شد، یعنی موفق بوده! ✅**

---

## 🌐 نصب و تنظیم Nginx

### مرحله ۱: نصب Nginx
```bash
# نصب Nginx
sudo apt install nginx -y

# فعال‌سازی Nginx
sudo systemctl enable nginx

# شروع Nginx
sudo systemctl start nginx

# بررسی وضعیت
sudo systemctl status nginx
```

**خروجی موفق:**
```
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2024-01-15 10:30:00 UTC; 5s ago
```

### مرحله ۲: تنظیم Nginx برای ویتیمو
```bash
# ایجاد فایل تنظیمات سایت
sudo nano /etc/nginx/sites-available/vitimo
```

**محتوای کامل فایل:**
```nginx
# تنظیمات Nginx برای ویتیمو
server {
    # پورت‌های گوش دادن
    listen 80;
    listen [::]:80;
    
    # نام سرور (دامنه شما)
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;
    # اگر دامنه ندارید، _ بگذارید
    
    # مسیر فایل‌های static
    root /home/vitimo/apps/vitimo/dist;
    index index.html;
    
    # تنظیمات برای Single Page Application (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # تنظیمات فایل‌های static با cache طولانی
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # فشرده‌سازی
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
    
    # محدودیت اندازه فایل آپلود
    client_max_body_size 100M;
    
    # تنظیمات timeout
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # لاگ‌ها
    access_log /var/log/nginx/vitimo_access.log;
    error_log /var/log/nginx/vitimo_error.log;
}
```

**نکته:** `YOUR_DOMAIN.com` را با دامنه واقعی خود جایگزین کنید. اگر دامنه ندارید، `_` بگذارید.

### مرحله ۳: فعال‌سازی سایت
```bash
# ایجاد symlink برای فعال‌سازی سایت
sudo ln -s /etc/nginx/sites-available/vitimo /etc/nginx/sites-enabled/

# حذف سایت پیش‌فرض nginx
sudo rm -f /etc/nginx/sites-enabled/default

# تست تنظیمات nginx
sudo nginx -t
```

**خروجی موفق:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### مرحله ۴: راه‌اندازی مجدد Nginx
```bash
# راه‌اندازی مجدد nginx
sudo systemctl reload nginx

# بررسی وضعیت
sudo systemctl status nginx
```

### مرحله ۵: تست سایت
```bash
# تست از خود سرور
curl -I http://localhost

# اگر دامنه دارید
curl -I http://YOUR_DOMAIN.com
```

**خروجی موفق:**
```
HTTP/1.1 200 OK
Server: nginx/1.18.0
Content-Type: text/html
```

---

## 🌍 تنظیم دامنه و SSL

### مرحله ۱: اتصال دامنه به سرور

#### اگر دامنه از آروان کلود خریده‌اید:
1. وارد پنل آروان کلود شوید
2. بخش "DNS" را انتخاب کنید
3. دامنه خود را انتخاب کنید
4. رکورد A جدید اضافه کنید:
   - **Name**: `@` (برای domain.com)
   - **Value**: IP سرور شما
   - **TTL**: 300
5. رکورد A دیگری اضافه کنید:
   - **Name**: `www`
   - **Value**: IP سرور شما
   - **TTL**: 300

#### اگر دامنه از جای دیگر خریده‌اید:
1. وارد پنل دامنه خود شوید
2. بخش DNS Management را پیدا کنید
3. رکوردهای A زیر را اضافه کنید:
   - `@` → IP سرور
   - `www` → IP سرور

**نکته:** تغییرات DNS تا ۲۴ ساعت طول می‌کشد تا در همه جا اعمال شود.

### مرحله ۲: نصب SSL Certificate (Let's Encrypt)

#### نصب Certbot:
```bash
# نصب certbot
sudo apt install certbot python3-certbot-nginx -y
```

#### دریافت گواهی SSL:
```bash
# دریافت SSL برای دامنه (جایگزین YOUR_DOMAIN.com کنید)
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

**Certbot چند سوال می‌پرسد:**

1. **Email address**: ایمیل معتبر خود را وارد کنید
2. **Terms of Service**: `A` بزنید (موافقت)
3. **Share email**: `N` بزنید (نمی‌خواهم ایمیل دریافت کنم)

**خروجی موفق:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/YOUR_DOMAIN.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/YOUR_DOMAIN.com/privkey.pem
```

#### تست تمدید خودکار:
```bash
# تست تمدید SSL
sudo certbot renew --dry-run
```

**خروجی موفق:**
```
Congratulations, all simulated renewals succeeded
```

---

## 🔒 تنظیمات امنیتی

### مرحله ۱: تنظیم فایروال UFW
```bash
# فعال‌سازی فایروال
sudo ufw enable

# اجازه دسترسی SSH (پورت 22)
sudo ufw allow ssh

# اجازه دسترسی HTTP (پورت 80)
sudo ufw allow http

# اجازه دسترسی HTTPS (پورت 443)
sudo ufw allow https

# مشاهده وضعیت فایروال
sudo ufw status
```

**خروجی موفق:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

### مرحله ۲: تنظیم SSH امن‌تر
```bash
# ویرایش تنظیمات SSH
sudo nano /etc/ssh/sshd_config
```

**تغییرات پیشنهادی:**
```bash
# پیدا کردن و تغییر این خطوط:
PermitRootLogin no                    # غیرفعال کردن ورود مستقیم root
PasswordAuthentication yes           # فعلاً روشن بگذارید
PubkeyAuthentication yes             # فعال کردن کلید عمومی
MaxAuthTries 3                       # حداکثر 3 بار تلاش ورود
ClientAliveInterval 300              # قطع اتصال بعد از 5 دقیقه بی‌فعالیت
ClientAliveCountMax 2
```

```bash
# راه‌اندازی مجدد SSH
sudo systemctl restart ssh
```

### مرحله ۳: تنظیم Fail2Ban (محافظت از حملات)
```bash
# نصب fail2ban
sudo apt install fail2ban -y

# ایجاد فایل تنظیمات محلی
sudo nano /etc/fail2ban/jail.local
```

**محتوا:**
```ini
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
```

```bash
# راه‌اندازی fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# بررسی وضعیت
sudo fail2ban-client status
```

---

## 📊 مانیتورینگ و نگهداری

### مرحله ۱: ایجاد اسکریپت مانیتورینگ
```bash
# ایجاد اسکریپت monitor
nano /home/vitimo/monitor.sh
```

**محتوا:**
```bash
#!/bin/bash

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# تابع نمایش وضعیت
print_status() {
    local service=$1
    local status=$2
    local color=$3
    printf "%-20s: ${color}%s${NC}\n" "$service" "$status"
}

echo -e "${PURPLE}🖥️  مانیتور سیستم ویتیمو${NC}"
echo -e "${PURPLE}========================${NC}"
echo ""

# اطلاعات سیستم
echo -e "${BLUE}📊 اطلاعات سیستم:${NC}"
echo "   نام سرور: $(hostname)"
echo "   زمان فعالیت: $(uptime -p)"
echo "   بار سیستم: $(uptime | awk -F'load average:' '{print $2}')"
echo "   کاربر فعلی: $(whoami)"
echo ""

# استفاده از منابع
echo -e "${BLUE}💾 استفاده از منابع:${NC}"
echo "   حافظه: $(free -h | awk 'NR==2{printf "%.1f%% (%s/%s)", $3*100/$2, $3, $2}')"
echo "   دیسک: $(df -h /home/vitimo | awk 'NR==2{printf "%s (%s استفاده شده)", $5, $3}')"
echo "   CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)% استفاده"
echo ""

# وضعیت سرویس‌ها
echo -e "${BLUE}🔧 وضعیت سرویس‌ها:${NC}"

# Nginx
if systemctl is-active --quiet nginx; then
    print_status "Nginx" "✅ در حال اجرا" $GREEN
else
    print_status "Nginx" "❌ متوقف" $RED
fi

# PM2
if pm2 describe vitimo | grep -q "online"; then
    print_status "PM2 (ویتیمو)" "✅ در حال اجرا" $GREEN
    PM2_CPU=$(pm2 describe vitimo | grep "cpu:" | awk '{print $2}' || echo "0%")
    PM2_MEM=$(pm2 describe vitimo | grep "memory:" | awk '{print $2}' || echo "0MB")
    echo "   └── CPU: $PM2_CPU, Memory: $PM2_MEM"
else
    print_status "PM2 (ویتیمو)" "❌ متوقف" $RED
fi

# Node.js
if command -v node > /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js" "✅ $NODE_VERSION" $GREEN
else
    print_status "Node.js" "❌ نصب نشده" $RED
fi

echo ""

# بررسی شبکه
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

# آمار ترافیک امروز
if [ -f "/var/log/nginx/vitimo_access.log" ]; then
    echo -e "${BLUE}📈 آمار ترافیک امروز:${NC}"
    TODAY=$(date +%d/%b/%Y)
    REQUESTS=$(sudo grep "$TODAY" /var/log/nginx/vitimo_access.log 2>/dev/null | wc -l || echo "0")
    UNIQUE_IPS=$(sudo grep "$TODAY" /var/log/nginx/vitimo_access.log 2>/dev/null | awk '{print $1}' | sort -u | wc -l || echo "0")
    echo "   درخواست‌ها: $REQUESTS"
    echo "   IP های منحصر به فرد: $UNIQUE_IPS"
    echo ""
fi

# دستورات مفید
echo -e "${BLUE}🔧 دستورات مفید:${NC}"
echo "   pm2 status              - وضعیت PM2"
echo "   pm2 logs vitimo         - لاگ‌های برنامه"
echo "   pm2 restart vitimo      - راه‌اندازی مجدد"
echo "   sudo systemctl status nginx - وضعیت Nginx"
echo "   htop                    - مانیتور منابع"
echo "   ./deploy.sh             - Deploy جدید"
echo "   ./backup.sh             - ایجاد Backup"

echo ""
echo -e "${GREEN}📅 آخرین بررسی: $(date)${NC}"
```

```bash
# اجازه اجرا
chmod +x /home/vitimo/monitor.sh
```

### مرحله ۲: ایجاد اسکریپت Backup
```bash
# ایجاد اسکریپت backup
nano /home/vitimo/backup.sh
```

**محتوا:**
```bash
#!/bin/bash

# تنظیمات
PROJECT_DIR="/home/vitimo/apps/vitimo"
BACKUP_DIR="/home/vitimo/backups"
LOG_FILE="/home/vitimo/logs/backup.log"
DATE=$(date +%Y%m%d_%H%M%S)

# ایجاد پوشه‌های مورد نیاز
mkdir -p $BACKUP_DIR
mkdir -p /home/vitimo/logs

# تابع لاگ
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "💾 شروع فرآیند Backup..."

# بررسی وجود پوشه پروژه
if [ ! -d "$PROJECT_DIR" ]; then
    log "❌ خطا: پوشه پروژه یافت نشد: $PROJECT_DIR"
    exit 1
fi

# ایجاد Backup کامل پروژه
log "📦 ایجاد Backup پروژه..."
BACKUP_FILE="$BACKUP_DIR/vitimo_full_$DATE.tar.gz"
tar -czf $BACKUP_FILE -C $PROJECT_DIR .

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
    log "✅ Backup ایجاد شد: vitimo_full_$DATE.tar.gz ($BACKUP_SIZE)"
else
    log "❌ خطا در ایجاد Backup"
    exit 1
fi

# Backup تنظیمات Nginx
if [ -f "/etc/nginx/sites-available/vitimo" ]; then
    log "🌐 Backup تنظیمات Nginx..."
    sudo cp /etc/nginx/sites-available/vitimo $BACKUP_DIR/nginx_vitimo_$DATE.conf
    log "✅ تنظیمات Nginx backup شد"
fi

# Backup تنظیمات PM2
log "🔄 Backup تنظیمات PM2..."
pm2 save
cp ~/.pm2/dump.pm2 $BACKUP_DIR/pm2_dump_$DATE.pm2 2>/dev/null || true

# ایجاد فایل اطلاعات Backup
INFO_FILE="$BACKUP_DIR/backup_info_$DATE.txt"
cat > $INFO_FILE << EOF
ویتیمو Backup Information
=========================
تاریخ: $(date)
فایل Backup: vitimo_full_$DATE.tar.gz
پوشه پروژه: $PROJECT_DIR
سرور: $(hostname)
کاربر: $(whoami)

اطلاعات سیستم:
- OS: $(lsb_release -d 2>/dev/null | cut -f2 || echo "Ubuntu")
- Node.js: $(node --version 2>/dev/null || echo "نصب نشده")
- PM2: $(pm2 --version 2>/dev/null || echo "نصب نشده")
- Nginx: $(nginx -v 2>&1 | head -1 || echo "نصب نشده")

وضعیت PM2:
$(pm2 status 2>/dev/null || echo "PM2 در حال اجرا نیست")

استفاده از دیسک:
$(df -h $PROJECT_DIR)

فایل‌ها در Backup:
$(tar -tzf $BACKUP_FILE | head -20)
$([ $(tar -tzf $BACKUP_FILE | wc -l) -gt 20 ] && echo "... و $(( $(tar -tzf $BACKUP_FILE | wc -l) - 20 )) فایل دیگر")
EOF

log "📋 فایل اطلاعات ایجاد شد: backup_info_$DATE.txt"

# پاک‌سازی Backup های قدیمی (بیش از 7 روز)
log "🧹 پاک‌سازی Backup های قدیمی..."
OLD_BACKUPS=$(find $BACKUP_DIR -name "vitimo_*.tar.gz" -mtime +7 | wc -l)
find $BACKUP_DIR -name "vitimo_*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "nginx_*.conf" -mtime +7 -delete
find $BACKUP_DIR -name "pm2_dump_*.pm2" -mtime +7 -delete
find $BACKUP_DIR -name "backup_info_*.txt" -mtime +7 -delete

if [ $OLD_BACKUPS -gt 0 ]; then
    log "✅ $OLD_BACKUPS Backup قدیمی پاک شد"
else
    log "ℹ️  Backup قدیمی برای پاک کردن یافت نشد"
fi

# نمایش آمار Backup ها
TOTAL_BACKUPS=$(ls -1 $BACKUP_DIR/vitimo_*.tar.gz 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh $BACKUP_DIR 2>/dev/null | cut -f1)

log "📊 آمار Backup ها:"
log "   - تعداد کل: $TOTAL_BACKUPS"
log "   - حجم کل: $TOTAL_SIZE"
log "   - آخرین Backup: $BACKUP_FILE"

log "✅ فرآیند Backup تکمیل شد!"

echo ""
echo "✅ Backup تکمیل شد!"
echo "📁 مسیر: $BACKUP_FILE"
echo "📊 حجم: $BACKUP_SIZE"
echo "📋 اطلاعات: $INFO_FILE"
```

```bash
# اجازه اجرا
chmod +x /home/vitimo/backup.sh
```

### مرحله ۳: ایجاد اسکریپت Deploy
```bash
# ایجاد اسکریپت deploy
nano /home/vitimo/deploy.sh
```

**محتوا:**
```bash
#!/bin/bash

# تنظیمات
PROJECT_DIR="/home/vitimo/apps/vitimo"
BACKUP_DIR="/home/vitimo/backups"
LOG_FILE="/home/vitimo/logs/deploy.log"

# ایجاد پوشه لاگ
mkdir -p /home/vitimo/logs

# تابع لاگ
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "🚀 شروع فرآیند Deploy..."

# بررسی وجود پوشه پروژه
if [ ! -d "$PROJECT_DIR" ]; then
    log "❌ خطا: پوشه پروژه یافت نشد: $PROJECT_DIR"
    exit 1
fi

cd $PROJECT_DIR

# Backup قبل از Deploy
log "💾 ایجاد Backup..."
/home/vitimo/backup.sh

# دانلود آخرین تغییرات (اگر از Git استفاده می‌کنید)
if [ -d ".git" ]; then
    log "📥 دانلود آخرین تغییرات از Git..."
    git pull origin main
    log "✅ تغییرات Git دانلود شد"
else
    log "⚠️  هشدار: پوشه .git یافت نشد، از Git استفاده نمی‌شود"
fi

# نصب/به‌روزرسانی Dependencies
log "📦 نصب Dependencies..."
npm ci --only=production
log "✅ Dependencies نصب شد"

# ساخت پروژه
log "🔨 ساخت پروژه..."
npm run build
log "✅ پروژه ساخته شد"

# راه‌اندازی مجدد PM2
log "🔄 راه‌اندازی مجدد PM2..."
pm2 restart vitimo
sleep 5

# بررسی وضعیت PM2
if pm2 describe vitimo | grep -q "online"; then
    log "✅ PM2 با موفقیت راه‌اندازی شد"
else
    log "❌ خطا در راه‌اندازی PM2"
    pm2 logs vitimo --lines 20
    exit 1
fi

# تست سایت
log "🧪 تست سایت..."
if curl -f -s http://localhost:3000 > /dev/null; then
    log "✅ سایت در دسترس است"
else
    log "❌ خطا: سایت در دسترس نیست"
    exit 1
fi

# راه‌اندازی مجدد Nginx
log "🔄 راه‌اندازی مجدد Nginx..."
sudo nginx -t && sudo systemctl reload nginx
log "✅ Nginx راه‌اندازی شد"

log "🎉 Deploy با موفقیت تکمیل شد!"
log "📊 وضعیت سرویس‌ها:"
pm2 status | tee -a $LOG_FILE

echo ""
echo "✅ Deploy تکمیل شد!"
echo "📊 برای مشاهده وضعیت: pm2 status"
echo "📋 برای مشاهده لاگ‌ها: pm2 logs vitimo"
echo "🌐 سایت: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_DOMAIN.com')"
```

```bash
# اجازه اجرا
chmod +x /home/vitimo/deploy.sh
```

### مرحله ۴: تنظیم Backup خودکار
```bash
# ویرایش crontab
crontab -e
```

**اگر اولین بار است، سیستم ویرایشگر می‌پرسد. شماره ۱ (nano) را انتخاب کنید.**

**در انتهای فایل این خط را اضافه کنید:**
```bash
# Backup روزانه ساعت 2 شب
0 2 * * * /home/vitimo/backup.sh

# بررسی سلامت سیستم هر 30 دقیقه
*/30 * * * * /home/vitimo/monitor.sh > /dev/null 2>&1
```

---

## 🧪 تست نهایی

### مرحله ۱: بررسی وضعیت سرویس‌ها
```bash
# اجرای اسکریپت مانیتورینگ
/home/vitimo/monitor.sh
```

### مرحله ۲: تست دسترسی
```bash
# تست از خود سرور
curl -I http://localhost

# تست با IP عمومی
curl -I http://$(curl -s ifconfig.me)

# اگر دامنه دارید
curl -I http://YOUR_DOMAIN.com
```

### مرحله ۳: تست در مرورگر
1. مرورگر خود را باز کنید
2. آدرس IP سرور یا دامنه را وارد کنید
3. باید صفحه ویتیمو را ببینید

---

## 🚨 عیب‌یابی

### مشکل ۱: سایت باز نمی‌شود

#### بررسی وضعیت:
```bash
# بررسی PM2
pm2 status

# بررسی Nginx
sudo systemctl status nginx

# بررسی پورت‌ها
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
```

#### راه‌حل:
```bash
# راه‌اندازی مجدد PM2
pm2 restart vitimo

# راه‌اندازی مجدد Nginx
sudo systemctl restart nginx
```

### مشکل ۲: خطای 502 Bad Gateway

#### بررسی:
```bash
# مشاهده لاگ‌های PM2
pm2 logs vitimo --lines 50

# مشاهده لاگ‌های Nginx
sudo tail -f /var/log/nginx/vitimo_error.log
```

#### راه‌حل:
```bash
# ساخت مجدد پروژه
cd /home/vitimo/apps/vitimo
npm run build
pm2 restart vitimo
```

### مشکل ۳: خطای Permission Denied

#### راه‌حل:
```bash
# تنظیم مجوزهای صحیح
sudo chown -R vitimo:vitimo /home/vitimo/apps/vitimo
sudo chmod -R 755 /home/vitimo/apps/vitimo/dist

# تنظیم مجوزهای Nginx
sudo chown -R www-data:www-data /home/vitimo/apps/vitimo/dist
```

### مشکل ۴: کمبود حافظه

#### بررسی:
```bash
# بررسی استفاده از RAM
free -h

# بررسی فرآیندهای پرمصرف
htop
```

#### راه‌حل:
```bash
# ایجاد swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# اضافه کردن به fstab برای دائمی شدن
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### مشکل ۵: دامنه کار نمی‌کند

#### بررسی DNS:
```bash
# بررسی DNS
nslookup YOUR_DOMAIN.com
dig YOUR_DOMAIN.com
```

#### راه‌حل:
1. صبر کنید (تا ۲۴ ساعت)
2. تنظیمات DNS را دوباره بررسی کنید
3. از ابزارهای آنلاین مثل whatsmydns.net استفاده کنید

---

## 📈 بهینه‌سازی عملکرد

### مرحله ۱: تنظیم Nginx برای عملکرد بهتر
```bash
# ویرایش تنظیمات اصلی Nginx
sudo nano /etc/nginx/nginx.conf
```

**تغییرات پیشنهادی:**
```nginx
# در بخش http
worker_processes auto;
worker_connections 1024;

# اضافه کردن این تنظیمات
client_max_body_size 100M;
keepalive_timeout 65;
types_hash_max_size 2048;
server_tokens off;

# تنظیمات gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
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
    font/opentype;
```

### مرحله ۲: تنظیم PM2 برای عملکرد بهتر
```bash
# ویرایش ecosystem.config.js
nano /home/vitimo/apps/vitimo/ecosystem.config.js
```

**تنظیمات بهینه:**
```javascript
module.exports = {
  apps: [{
    name: 'vitimo',
    script: 'serve',
    args: '-s dist -l 3000',
    instances: 'max', // استفاده از تمام CPU ها
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
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
```

---

## 🎉 تبریک! نصب تکمیل شد

### ✅ چه کارهایی انجام دادیم:
1. ✅ سرور اوبونتو را آماده کردیم
2. ✅ Node.js 18 و PM2 را نصب کردیم
3. ✅ پروژه ویتیمو را ایجاد و تنظیم کردیم
4. ✅ PM2 را برای مدیریت فرآیند تنظیم کردیم
5. ✅ Nginx را برای وب سرور نصب کردیم
6. ✅ SSL Certificate نصب کردیم
7. ✅ فایروال و امنیت را تنظیم کردیم
8. ✅ سیستم مانیتورینگ و backup ایجاد کردیم

### 🌐 اطلاعات دسترسی:
- **آدرس سایت**: https://YOUR_DOMAIN.com یا http://YOUR_SERVER_IP
- **حساب ادمین**: admin@vitimo.com / admin
- **حساب کاربر**: user@vitimo.com / user

### 🔧 دستورات مدیریت:

#### مانیتورینگ:
```bash
# مشاهده وضعیت کلی
/home/vitimo/monitor.sh

# مشاهده لاگ‌های PM2
pm2 logs vitimo

# مشاهده استفاده از منابع
htop
```

#### مدیریت:
```bash
# راه‌اندازی مجدد سایت
pm2 restart vitimo

# راه‌اندازی مجدد وب سرور
sudo systemctl restart nginx

# Deploy جدید
/home/vitimo/deploy.sh

# Backup دستی
/home/vitimo/backup.sh
```

#### بررسی سلامت:
```bash
# بررسی فضای دیسک
df -h

# بررسی حافظه
free -h

# بررسی فرآیندها
pm2 monit
```

### 📁 مسیرهای مهم:
- **پروژه**: `/home/vitimo/apps/vitimo`
- **فایل‌های سایت**: `/home/vitimo/apps/vitimo/dist`
- **لاگ‌ها**: `/home/vitimo/logs`
- **Backup ها**: `/home/vitimo/backups`
- **تنظیمات Nginx**: `/etc/nginx/sites-available/vitimo`

### 🔄 به‌روزرسانی آینده:
1. فایل‌های جدید را در `/home/vitimo/apps/vitimo` قرار دهید
2. دستور `/home/vitimo/deploy.sh` را اجرا کنید
3. سایت به‌روزرسانی می‌شود

### 📞 پشتیبانی:
- **لاگ‌های خطا**: `pm2 logs vitimo --err`
- **لاگ‌های Nginx**: `sudo tail -f /var/log/nginx/vitimo_error.log`
- **مانیتورینگ زنده**: `pm2 monit`

---

## 🎊 موفق باشید!

سایت ویتیمو شما اکنون:
- 🌐 در دسترس عموم است
- 🔒 امن و محافظت شده
- 📊 قابل مانیتورینگ است
- 💾 Backup خودکار دارد
- ⚡ عملکرد بهینه دارد

**سایت شما آماده استفاده است! 🚀**