# VideoTube - پلتفرم ویدیویی مشابه یوتیوب

پلتفرم کاملی برای اشتراک‌گذاری ویدیو با پنل مدیریت جامع

## ویژگی‌ها

- 🎥 پخش و مشاهده ویدیو
- 👤 مدیریت کاربران و احراز هویت
- 📤 آپلود و مدیریت ویدیو
- 💬 سیستم نظرات
- 📊 پنل مدیریت با آمار و نمودار
- 🔍 جستجو و دسته‌بندی
- 📱 طراحی ریسپانسیو

## نصب و راه‌اندازی

### پیش‌نیازها

- Node.js 18 یا بالاتر
- npm یا yarn

### مراحل نصب

1. **کلون کردن پروژه**

```bash
git clone [repository-url]
cd videotube
```

2. **نصب وابستگی‌ها**

```bash
npm install
```

3. **تنظیم متغیرهای محیطی**

```bash
cp .env.example .env
# ویرایش فایل .env با تنظیمات مورد نظر
```

4. **اجرای پروژه**

```bash
# حالت توسعه
npm run dev

# ساخت برای production
npm run build

# پیش‌نمایش build
npm run preview
```

## حساب‌های آزمایشی

- **ادمین**: admin@example.com / admin
- **کاربر عادی**: user@example.com / user

## استقرار

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Vercel

```bash
vercel --prod
```

### Docker

```bash
docker-compose up -d
```

## ساختار پروژه

```
src/
├── components/          # کامپوننت‌های قابل استفاده مجدد
├── pages/              # صفحات اصلی
├── contexts/           # Context های React
├── hooks/              # Custom hooks
├── utils/              # توابع کمکی
└── styles/             # فایل‌های CSS

public/                 # فایل‌های استاتیک
```

## تکنولوژی‌های استفاده شده

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

## مشارکت

1. Fork کردن پروژه
2. ایجاد branch جدید (`git checkout -b feature/amazing-feature`)
3. Commit کردن تغییرات (`git commit -m 'Add amazing feature'`)
4. Push کردن به branch (`git push origin feature/amazing-feature`)
5. ایجاد Pull Request

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.
