# 🐧 راهنمای کامل نصب VideoTube روی سرور لینوکس

## 📋 فهرست مطالب
1. [پیش‌نیازها](#پیش-نیازها)
2. [آماده‌سازی سرور](#آماده-سازی-سرور)
3. [نصب Node.js](#نصب-nodejs)
4. [نصب و تنظیم پروژه](#نصب-و-تنظیم-پروژه)
5. [تنظیم PM2](#تنظیم-pm2)
6. [نصب و تنظیم Nginx](#نصب-و-تنظیم-nginx)
7. [تنظیم SSL](#تنظیم-ssl)
8. [مانیتورینگ و نگهداری](#مانیتورینگ-و-نگهداری)
9. [عیب‌یابی](#عیب-یابی)

---

## 🔧 پیش‌نیازها

### مشخصات سرور:
- **OS**: Ubuntu 20.04+ یا CentOS 7+
- **RAM**: حداقل 2GB (توصیه: 4GB)
- **CPU**: حداقل 1 Core (توصیه: 2 Core)
- **Storage**: حداقل 20GB SSD
- **Network**: اتصال اینترنت پایدار

### دسترسی‌های مورد نیاز:
- دسترسی SSH به سرور
- دسترسی sudo یا root
- دامنه (اختیاری)

---

## 🚀 آماده‌سازی سرور

### مرحله ۱: اتصال به سرور
```bash
# اتصال SSH
ssh root@YOUR_SERVER_IP
# یا با کاربر غیر root:
ssh username@YOUR_SERVER_IP
```

### مرحله ۲: به‌روزرسانی سیستم
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
# یا برای CentOS 8+:
sudo dnf update -y
```

### مرحله ۳: نصب ابزارهای پایه
```bash
# Ubuntu/Debian
sudo apt install -y curl wget git unzip htop nano

# CentOS/RHEL
sudo yum install -y curl wget git unzip htop nano
```

---

## 📦 نصب Node.js

### روش ۱: نصب از NodeSource (توصیه شده)
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### روش ۲: نصب با NVM
```bash
# نصب NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# نصب Node.js
nvm install 18
nvm use 18
nvm alias default 18
```

### تأیید نصب
```bash
node --version  # باید v18.x.x نشان دهد
npm --version   # باید 9.x.x یا بالاتر نشان دهد
```

---

## 🔄 نصب PM2

```bash
# نصب PM2 به صورت global
sudo npm install -g pm2

# تأیید نصب
pm2 --version
```

---

## 📁 نصب و تنظیم پروژه

### مرحله ۱: ایجاد کاربر پروژه
```bash
# ایجاد کاربر جدید
sudo adduser videotube
sudo usermod -aG sudo videotube

# تغییر به کاربر جدید
su - videotube
```

### مرحله ۲: ایجاد پوشه پروژه
```bash
# ایجاد پوشه‌های مورد نیاز
mkdir -p /home/videotube/apps
mkdir -p /home/videotube/backups
mkdir -p /home/videotube/logs
cd /home/videotube/apps
```

### مرحله ۳: دانلود پروژه

#### گزینه الف: از طریق Git
```bash
git clone https://github.com/YOUR_USERNAME/videotube.git
cd videotube
```

#### گزینه ب: آپلود دستی
```bash
# از کامپیوتر محلی:
scp -r ./videotube/* videotube@server-ip:/home/videotube/apps/videotube/
```

#### گزینه ج: ایجاد پروژه از ابتدا
```bash
# ایجاد پوشه پروژه
mkdir videotube
cd videotube

# ایجاد package.json
cat > package.json << 'EOF'
{
  "name": "videotube-multilingual",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
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
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
EOF

# ایجاد فایل‌های تنظیمات
# [سایر فایل‌ها را از پروژه کپی کنید]
```

### مرحله ۴: نصب dependencies
```bash
cd /home/videotube/apps/videotube
npm install
```

### مرحله ۵: ساخت پروژه
```bash
npm run build
```

---

## ⚙️ تنظیم PM2

### مرحله ۱: نصب serve
```bash
sudo npm install -g serve
```

### مرحله ۲: ایجاد فایل تنظیمات PM2
```bash
cd /home/videotube/apps/videotube
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'videotube',
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
    error_file: '/home/videotube/logs/err.log',
    out_file: '/home/videotube/logs/out.log',
    log_file: '/home/videotube/logs/combined.log',
    time: true
  }]
}
EOF
```

### مرحله ۳: راه‌اندازی با PM2
```bash
# شروع پروژه
pm2 start ecosystem.config.js

# مشاهده وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs videotube

# ذخیره تنظیمات
pm2 save

# تنظیم startup script
pm2 startup
# دستور خروجی را اجرا کنید
```

---

## 🌐 نصب و تنظیم Nginx

### مرحله ۱: نصب Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y

# فعال‌سازی و شروع
sudo systemctl enable nginx
sudo systemctl start nginx
```

### مرحله ۲: تنظیم Nginx
```bash
# ایجاد فایل تنظیمات سایت
sudo nano /etc/nginx/sites-available/videotube
```

محتوای فایل:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;
    
    # مسیر فایل‌های static
    root /home/videotube/apps/videotube/dist;
    index index.html;
    
    # تنظیمات برای SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # تنظیمات فایل‌های static با cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # تنظیمات امنیتی
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # فشرده‌سازی
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml;
    
    # محدودیت اندازه فایل آپلود
    client_max_body_size 100M;
}
```

### مرحله ۳: فعال‌سازی سایت
```bash
# ایجاد symlink
sudo ln -s /etc/nginx/sites-available/videotube /etc/nginx/sites-enabled/

# حذف سایت پیش‌فرض (اختیاری)
sudo rm /etc/nginx/sites-enabled/default

# تست تنظیمات
sudo nginx -t

# راه‌اندازی مجدد
sudo systemctl reload nginx
```

---

## 🔒 تنظیم SSL

### نصب Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

### دریافت SSL Certificate
```bash
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

### تست تمدید خودکار
```bash
sudo certbot renew --dry-run
```

---

## 🔥 تنظیمات فایروال

### Ubuntu (UFW)
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw status
```

### CentOS (Firewalld)
```bash
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

## 📊 مانیتورینگ و نگهداری

### نصب htop
```bash
sudo apt install htop -y  # Ubuntu
sudo yum install htop -y  # CentOS
```

### اسکریپت Backup
```bash
cat > /home/videotube/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/videotube/backups"
PROJECT_DIR="/home/videotube/apps/videotube"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/videotube_$DATE.tar.gz -C $PROJECT_DIR .

# حذف backup های قدیمی (بیش از 7 روز)
find $BACKUP_DIR -name "videotube_*.tar.gz" -mtime +7 -delete

echo "Backup completed: videotube_$DATE.tar.gz"
EOF

chmod +x /home/videotube/backup.sh
```

### تنظیم Cron برای Backup روزانه
```bash
crontab -e
# اضافه کردن خط زیر:
0 2 * * * /home/videotube/backup.sh
```

### اسکریپت Deploy
```bash
cat > /home/videotube/deploy.sh << 'EOF'
#!/bin/bash
cd /home/videotube/apps/videotube

echo "🚀 Starting deployment..."

# Backup قبل از deploy
/home/videotube/backup.sh

# دانلود آخرین تغییرات (اگر از Git استفاده می‌کنید)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
fi

# نصب dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# ساخت پروژه
echo "🔨 Building project..."
npm run build

# راه‌اندازی مجدد PM2
echo "🔄 Restarting PM2..."
pm2 restart videotube

echo "✅ Deployment completed!"
EOF

chmod +x /home/videotube/deploy.sh
```

---

## 🔍 عیب‌یابی

### بررسی وضعیت سرویس‌ها
```bash
# وضعیت Nginx
sudo systemctl status nginx

# وضعیت PM2
pm2 status

# مشاهده لاگ‌های PM2
pm2 logs videotube

# مشاهده لاگ‌های Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### مشکلات رایج و راه‌حل

#### ۱. خطای 502 Bad Gateway
```bash
# بررسی وضعیت PM2
pm2 status
pm2 restart videotube

# بررسی پورت
sudo netstat -tlnp | grep :3000
```

#### ۲. خطای Permission Denied
```bash
# تنظیم مجوزها
sudo chown -R videotube:videotube /home/videotube/apps/videotube
sudo chmod -R 755 /home/videotube/apps/videotube/dist
```

#### ۳. خطای Out of Memory
```bash
# افزایش swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

#### ۴. مشکل در نمایش فونت‌های فارسی
```bash
# نصب فونت‌های فارسی
sudo apt install fonts-farsiweb -y
```

---

## ✅ تست نهایی

### بررسی سایت
```bash
# تست از خود سرور
curl -I http://localhost
curl -I http://YOUR_DOMAIN.com

# بررسی SSL
curl -I https://YOUR_DOMAIN.com
```

### مشاهده منابع سیستم
```bash
# استفاده از CPU و RAM
htop

# فضای دیسک
df -h

# وضعیت شبکه
sudo netstat -tlnp
```

---

## 🎉 تبریک!

سایت VideoTube چندزبانه شما با موفقیت نصب شد!

### اطلاعات دسترسی:
- **آدرس سایت**: https://YOUR_DOMAIN.com
- **حساب ادمین**: admin@example.com / admin
- **حساب کاربر**: user@example.com / user

### ویژگی‌های نصب شده:
- ✅ پشتیبانی از ۳ زبان (فارسی، انگلیسی، عربی)
- ✅ رنگ‌بندی بنفش و طلایی
- ✅ بخش Premium و Rewards
- ✅ پنل مدیریت کامل
- ✅ SSL Certificate
- ✅ Backup خودکار
- ✅ مانیتورینگ سیستم

### دستورات مفید:
```bash
# مشاهده وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs videotube

# راه‌اندازی مجدد
pm2 restart videotube

# Deploy جدید
./deploy.sh

# Backup دستی
./backup.sh
```

برای پشتیبانی بیشتر، لاگ‌ها را بررسی کنید و در صورت نیاز با تیم پشتیبانی تماس بگیرید.