# 🔗 راهنمای کامل اتصال بک‌اند به فرانت‌اند ویتیمو

## 📋 فهرست مطالب
1. [معماری سیستم](#معماری-سیستم)
2. [نصب و راه‌اندازی بک‌اند](#نصب-و-راه‌اندازی-بک‌اند)
3. [اتصال فرانت‌اند به بک‌اند](#اتصال-فرانت‌اند-به-بک‌اند)
4. [API Endpoints](#api-endpoints)
5. [احراز هویت و امنیت](#احراز-هویت-و-امنیت)
6. [مدیریت فایل‌ها](#مدیریت-فایل‌ها)
7. [تست و عیب‌یابی](#تست-و-عیب‌یابی)
8. [استقرار در production](#استقرار-در-production)

---

## 🏗️ معماری سیستم

### ساختار کلی:
```
ویتیمو پلتفرم
├── Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/api.ts
│   │   └── hooks/useApi.ts
│   └── dist/ (فایل‌های ساخته شده)
├── Backend (Node.js + Express)
│   ├── server.js
│   ├── routes/
│   ├── middleware/
│   ├── data/
│   └── uploads/
└── Database (اختیاری)
    ├── PostgreSQL
    └── MongoDB
```

### جریان داده:
```
Frontend → API Client → Backend Routes → Database → Response → Frontend
```

---

## 🚀 نصب و راه‌اندازی بک‌اند

### مرحله ۱: ایجاد پوشه بک‌اند
```bash
# در پوشه اصلی پروژه
mkdir backend
cd backend
```

### مرحله ۲: نصب dependencies
```bash
# نصب وابستگی‌های اصلی
npm install express cors helmet morgan bcryptjs jsonwebtoken
npm install multer express-rate-limit express-validator compression
npm install dotenv uuid sharp ffmpeg-static fluent-ffmpeg

# نصب dev dependencies
npm install --save-dev nodemon jest @types/jest
```

### مرحله ۳: ایجاد ساختار پوشه‌ها
```bash
mkdir routes middleware data uploads
mkdir uploads/videos uploads/thumbnails uploads/avatars
```

### مرحله ۴: راه‌اندازی بک‌اند
```bash
# شروع بک‌اند در حالت development
npm run dev

# یا برای production
npm start
```

**بک‌اند روی پورت 3001 اجرا می‌شود**

---

## 🔗 اتصال فرانت‌اند به بک‌اند

### مرحله ۱: تنظیم متغیر محیطی
```bash
# ایجاد فایل .env در پوشه اصلی
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

### مرحله ۲: تست اتصال
```bash
# تست health check
curl http://localhost:3001/health

# خروجی موفق:
# {"status":"OK","timestamp":"2024-01-15T10:30:00.000Z","uptime":123.45}
```

### مرحله ۳: تست API endpoints
```bash
# تست دریافت ویدیوها
curl http://localhost:3001/api/videos

# تست ثبت نام
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'
```

---

## 📡 API Endpoints

### 🔐 احراز هویت (Authentication)
```typescript
// ثبت نام
POST /api/auth/register
Body: { username, email, password }
Response: { success, message, data: { user, token } }

// ورود
POST /api/auth/login  
Body: { email, password }
Response: { success, message, data: { user, token } }

// دریافت اطلاعات کاربر فعلی
GET /api/auth/me
Headers: { Authorization: "Bearer TOKEN" }
Response: { success, data: { user } }

// خروج
POST /api/auth/logout
Headers: { Authorization: "Bearer TOKEN" }
Response: { success, message }
```

### 🎥 ویدیوها (Videos)
```typescript
// دریافت لیست ویدیوها
GET /api/videos?page=1&limit=12&category=Technology&search=react
Response: { success, data: { videos, pagination } }

// دریافت ویدیو خاص
GET /api/videos/:id
Response: { success, data: { video } }

// آپلود ویدیو
POST /api/videos
Headers: { Authorization: "Bearer TOKEN" }
Body: FormData { video, thumbnail, title, description, category, tags }
Response: { success, message, data: { video } }

// لایک ویدیو
POST /api/videos/:id/like
Headers: { Authorization: "Bearer TOKEN" }
Response: { success, message, data: { likes, dislikes } }

// دیسلایک ویدیو
POST /api/videos/:id/dislike
Headers: { Authorization: "Bearer TOKEN" }
Response: { success, message, data: { likes, dislikes } }
```

### 👤 کاربران (Users)
```typescript
// دریافت پروفایل کاربر
GET /api/users/:id
Response: { success, data: { user, videos } }

// به‌روزرسانی پروفایل
PUT /api/users/profile
Headers: { Authorization: "Bearer TOKEN" }
Body: { username?, email?, bio? }
Response: { success, message, data: { user } }

// دنبال کردن/لغو دنبال کردن
POST /api/users/:id/subscribe
Headers: { Authorization: "Bearer TOKEN" }
Response: { success, message, data: { isSubscribed, subscriberCount } }
```

### 💰 کیف پول (Wallet)
```typescript
// دریافت موجودی
GET /api/wallet/balance
Headers: { Authorization: "Bearer TOKEN" }
Response: { success, data: { balance, currency } }

// دریافت تاریخچه تراکنش‌ها
GET /api/wallet/transactions
Headers: { Authorization: "Bearer TOKEN" }
Response: { success, data: { transactions } }

// واریز
POST /api/wallet/deposit
Headers: { Authorization: "Bearer TOKEN" }
Body: { amount, paymentMethod }
Response: { success, message, data: { transaction } }

// برداشت
POST /api/wallet/withdraw
Headers: { Authorization: "Bearer TOKEN" }
Body: { amount, bankAccount }
Response: { success, message, data: { transaction, newBalance } }
```

### 📺 پخش زنده (Live Streaming)
```typescript
// دریافت پخش‌های زنده فعال
GET /api/live/streams
Response: { success, data: { streams } }

// ایجاد پخش زنده
POST /api/live/streams
Headers: { Authorization: "Bearer TOKEN" }
Body: { title, description, category, tags }
Response: { success, message, data: { stream } }

// پایان پخش زنده
PUT /api/live/streams/:id/end
Headers: { Authorization: "Bearer TOKEN" }
Response: { success, message, data: { stream } }

// ارسال پیام چت
POST /api/live/streams/:id/chat
Headers: { Authorization: "Bearer TOKEN" }
Body: { message }
Response: { success, message, data: { message } }
```

### 🛡️ پنل مدیریت (Admin)
```typescript
// داشبورد مدیریت
GET /api/admin/dashboard
Headers: { Authorization: "Bearer ADMIN_TOKEN" }
Response: { success, data: { overview, growth, monthlyData, recentActivity } }

// مدیریت کاربران
GET /api/admin/users
PUT /api/admin/users/:id/status
Body: { status: 'active'|'suspended'|'banned', reason? }

// مدیریت ویدیوها
PUT /api/admin/videos/:id/status
Body: { status: 'published'|'rejected', reason? }

// آمار و تحلیل
GET /api/admin/analytics
Response: { success, data: { userAnalytics, videoAnalytics, revenueAnalytics } }
```

---

## 🔒 احراز هویت و امنیت

### JWT Token Management:
```typescript
// در فرانت‌اند
const token = localStorage.getItem('authToken');

// ارسال با هر درخواست
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### Middleware امنیتی:
```javascript
// Rate Limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true
}));

// Security Headers
app.use(helmet());
```

---

## 📁 مدیریت فایل‌ها

### آپلود ویدیو:
```typescript
// Frontend
const formData = new FormData();
formData.append('video', videoFile);
formData.append('thumbnail', thumbnailFile);
formData.append('title', title);
formData.append('description', description);

const response = await videosAPI.uploadVideo(formData);
```

### پردازش ویدیو (Backend):
```javascript
// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
```

---

## 🧪 تست و عیب‌یابی

### تست API با curl:
```bash
# تست ثبت نام
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"123456"}'

# تست ورود
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vitimo.com","password":"admin"}'

# تست دریافت ویدیوها
curl http://localhost:3001/api/videos

# تست با token
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/auth/me
```

### مشاهده لاگ‌ها:
```bash
# لاگ‌های بک‌اند
npm run dev

# لاگ‌های فرانت‌اند
npm run dev

# لاگ‌های شبکه در مرورگر
F12 → Network Tab
```

### عیب‌یابی رایج:

#### خطای CORS:
```javascript
// در backend/server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

#### خطای 401 Unauthorized:
```typescript
// بررسی token در localStorage
console.log(localStorage.getItem('authToken'));

// بررسی header
const headers = {
  'Authorization': `Bearer ${token}`
};
```

#### خطای 404:
```bash
# بررسی route در backend
console.log('Route registered:', '/api/videos');

# بررسی URL در frontend
console.log('API URL:', import.meta.env.VITE_API_URL);
```

---

## 🌐 استقرار در Production

### مرحله ۱: تنظیم متغیرهای محیطی

#### Backend (.env):
```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-key-here
DATABASE_URL=postgresql://user:pass@localhost:5432/vitimo
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### Frontend (.env):
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=ویتیمو
```

### مرحله ۲: ساخت و استقرار

#### Frontend:
```bash
# ساخت برای production
npm run build

# استقرار فایل‌های dist
# آپلود به سرور یا CDN
```

#### Backend:
```bash
# استقرار بک‌اند
pm2 start server.js --name vitimo-backend
pm2 save
pm2 startup
```

### مرحله ۳: تنظیم Nginx

#### Reverse Proxy:
```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/frontend/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Backend (اختیاری - subdomain)
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 💻 نحوه استفاده در کامپوننت‌ها

### مثال ۱: ورود کاربر
```typescript
// در کامپوننت Login
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* فرم ورود */}
      <button disabled={loading}>
        {loading ? 'در حال ورود...' : 'ورود'}
      </button>
    </form>
  );
};
```

### مثال ۲: نمایش ویدیوها
```typescript
// در کامپوننت Home
import { useVideo } from '../contexts/VideoContext';

const Home = () => {
  const { videos, loading, error, fetchVideos } = useVideo();
  
  useEffect(() => {
    fetchVideos({ page: 1, limit: 12 });
  }, []);
  
  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {error}</div>;
  
  return (
    <div className="grid grid-cols-4 gap-6">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};
```

### مثال ۳: آپلود ویدیو
```typescript
// در کامپوننت Upload
import { useUpload } from '../hooks/useApi';

const Upload = () => {
  const { uploadVideo, uploadProgress, isUploading } = useUpload();
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbnailFile);
    formData.append('title', title);
    formData.append('description', description);
    
    try {
      await uploadVideo(formData);
      alert('ویدیو با موفقیت آپلود شد!');
    } catch (error) {
      alert('خطا در آپلود ویدیو');
    }
  };
  
  return (
    <form onSubmit={handleUpload}>
      {/* فرم آپلود */}
      {isUploading && (
        <div className="progress-bar">
          <div style={{ width: `${uploadProgress}%` }}></div>
        </div>
      )}
    </form>
  );
};
```

---

## 🔧 تنظیمات پیشرفته

### WebSocket برای پخش زنده:
```javascript
// Backend - WebSocket setup
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // پردازش پیام‌های چت زنده
    broadcast(message);
  });
});
```

### Redis برای Cache:
```javascript
// Backend - Redis setup
import redis from 'redis';

const client = redis.createClient();

// Cache ویدیوهای پربازدید
app.get('/api/videos/trending', async (req, res) => {
  const cached = await client.get('trending_videos');
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // دریافت از دیتابیس و cache کردن
  const videos = await getTrendingVideos();
  await client.setex('trending_videos', 300, JSON.stringify(videos));
  res.json(videos);
});
```

### Database Integration:
```javascript
// PostgreSQL با Prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// MongoDB با Mongoose
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);
```

---

## 📊 مانیتورینگ و لاگ‌گیری

### Winston Logger:
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Check:
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  });
});
```

---

## 🚀 دستورات راه‌اندازی کامل

### Development:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### Production:
```bash
# Backend
cd backend
npm start
pm2 start server.js --name vitimo-backend

# Frontend
npm run build
serve -s dist -l 3000
pm2 start "serve -s dist -l 3000" --name vitimo-frontend
```

### Docker (اختیاری):
```bash
# ساخت و اجرای کانتینرها
docker-compose up -d

# مشاهده لاگ‌ها
docker-compose logs -f
```

---

## ✅ چک‌لیست تست

### تست‌های اساسی:
- [ ] بک‌اند روی پورت 3001 اجرا می‌شود
- [ ] فرانت‌اند روی پورت 5173 اجرا می‌شود
- [ ] API health check پاسخ می‌دهد
- [ ] ثبت نام و ورود کار می‌کند
- [ ] دریافت ویدیوها کار می‌کند
- [ ] آپلود ویدیو کار می‌کند
- [ ] کیف پول کار می‌کند
- [ ] پنل ادمین در دسترس است

### تست‌های امنیتی:
- [ ] CORS تنظیم شده
- [ ] Rate limiting فعال است
- [ ] JWT tokens معتبر هستند
- [ ] فایل‌های آپلودی محدود شده‌اند
- [ ] SQL injection محافظت شده

---

## 🎯 نکات مهم

### بهینه‌سازی عملکرد:
- استفاده از Redis برای cache
- فشرده‌سازی response ها
- بهینه‌سازی تصاویر با Sharp
- CDN برای فایل‌های static

### امنیت:
- Hash کردن رمزهای عبور
- Validation ورودی‌ها
- Rate limiting
- HTTPS در production

### مقیاس‌پذیری:
- Load balancing
- Database clustering  
- Microservices architecture
- Container orchestration

---

**بک‌اند ویتیمو آماده است! 🚀**

حالا می‌توانید:
- ✅ کاربران ثبت نام و ورود کنند
- ✅ ویدیوها آپلود و مشاهده شوند  
- ✅ کیف پول مدیریت شود
- ✅ پخش زنده انجام شود
- ✅ پنل ادمین استفاده شود

برای راه‌اندازی کامل، ابتدا بک‌اند را اجرا کنید، سپس فرانت‌اند را. همه چیز خودکار متصل می‌شود!