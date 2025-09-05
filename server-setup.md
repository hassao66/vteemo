# راهنمای کامل نصب VideoTube روی سرور شخصی

## 🖥️ پیش‌نیازهای سرور

### مشخصات حداقلی سرور:
- **RAM**: حداقل 1GB (توصیه: 2GB+)
- **CPU**: 1 Core (توصیه: 2 Core+)
- **Storage**: حداقل 10GB فضای خالی
- **OS**: Ubuntu 20.04+ یا CentOS 7+
- **Network**: اتصال اینترنت پایدار

## 🔧 مرحله ۱: آماده‌سازی سرور

### اتصال به سرور:
```bash
# اتصال SSH به سرور
ssh root@YOUR_SERVER_IP
# یا با کاربر غیر root:
ssh username@YOUR_SERVER_IP
```

### به‌روزرسانی سیستم:
```bash
# Ubuntu/Debian:
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL:
sudo yum update -y
# یا برای CentOS 8+:
sudo dnf update -y
```

## 📦 مرحله ۲: نصب Node.js

### روش ۱: نصب از NodeSource (توصیه شده):
```bash
# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL:
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### روش ۲: نصب با NVM:
```bash
# نصب NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# نصب Node.js
nvm install 18
nvm use 18
nvm alias default 18
```

### تأیید نصب:
```bash
node --version  # باید v18.x.x نشان دهد
npm --version   # باید 9.x.x یا بالاتر نشان دهد
```

## 🔄 مرحله ۳: نصب PM2 (Process Manager)

```bash
# نصب PM2 به صورت global
sudo npm install -g pm2

# تأیید نصب
pm2 --version
```

## 📁 مرحله ۴: آماده‌سازی پروژه

### ایجاد کاربر برای پروژه:
```bash
# ایجاد کاربر جدید
sudo adduser videotube
sudo usermod -aG sudo videotube

# تغییر به کاربر جدید
su - videotube
```

### ایجاد پوشه پروژه:
```bash
# ایجاد پوشه‌های مورد نیاز
mkdir -p /home/videotube/apps
cd /home/videotube/apps
```

## 📥 مرحله ۵: دانلود و نصب پروژه

### روش ۱: از طریق Git (اگر پروژه در GitHub است):
```bash
# نصب Git
sudo apt install git -y  # Ubuntu
sudo yum install git -y  # CentOS

# کلون پروژه
git clone https://github.com/YOUR_USERNAME/videotube.git
cd videotube
```

### روش ۲: آپلود دستی فایل‌ها:
```bash
# ایجاد پوشه پروژه
mkdir videotube
cd videotube

# آپلود فایل‌ها با scp از کامپیوتر محلی:
# scp -r ./project-files/* username@server-ip:/home/videotube/apps/videotube/
```

### نصب dependencies:
```bash
# نصب وابستگی‌ها
npm install

# ساخت پروژه برای production
npm run build
```

## 🌐 مرحله ۶: نصب و تنظیم Nginx

### نصب Nginx:
```bash
# Ubuntu/Debian:
sudo apt install nginx -y

# CentOS/RHEL:
sudo yum install nginx -y
# یا برای CentOS 8+:
sudo dnf install nginx -y

# فعال‌سازی و شروع Nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### تنظیم Nginx:
```bash
# ایجاد فایل تنظیمات سایت
sudo nano /etc/nginx/sites-available/videotube

# محتوای فایل:
```

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;  # یا IP سرور
    
    # مسیر فایل‌های static
    root /home/videotube/apps/videotube/dist;
    index index.html;
    
    # تنظیمات برای SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # تنظیمات فایل‌های static
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # تنظیمات امنیتی
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # فشرده‌سازی
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### فعال‌سازی سایت:
```bash
# ایجاد symlink
sudo ln -s /etc/nginx/sites-available/videotube /etc/nginx/sites-enabled/

# حذف سایت پیش‌فرض (اختیاری)
sudo rm /etc/nginx/sites-enabled/default

# تست تنظیمات
sudo nginx -t

# راه‌اندازی مجدد Nginx
sudo systemctl reload nginx
```

## 🔥 مرحله ۷: راه‌اندازی با PM2

### نصب serve:
```bash
sudo npm install -g serve
```

### راه‌اندازی با PM2:
```bash
cd /home/videotube/apps/videotube

# ایجاد فایل تنظیمات PM2
nano ecosystem.config.js
```

محتوای فایل `ecosystem.config.js`:
```javascript
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
      NODE_ENV: 'production'
    }
  }]
}
```

### اجرای پروژه:
```bash
# شروع پروژه
pm2 start ecosystem.config.js

# مشاهده وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs videotube

# ذخیره تنظیمات PM2
pm2 save

# تنظیم startup script
pm2 startup
# دستور خروجی را اجرا کنید
```

## 🔒 مرحله ۸: تنظیمات امنیتی

### تنظیم Firewall:
```bash
# Ubuntu (UFW):
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw status

# CentOS (Firewalld):
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### نصب SSL Certificate (Let's Encrypt):
```bash
# نصب Certbot
sudo apt install certbot python3-certbot-nginx -y  # Ubuntu
sudo yum install certbot python3-certbot-nginx -y  # CentOS

# دریافت SSL Certificate
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com

# تست تمدید خودکار
sudo certbot renew --dry-run
```

## 📊 مرحله ۹: مانیتورینگ و نگهداری

### نصب htop برای مانیتورینگ:
```bash
sudo apt install htop -y  # Ubuntu
sudo yum install htop -y  # CentOS
```

### اسکریپت backup:
```bash
# ایجاد اسکریپت backup
nano /home/videotube/backup.sh
```

محتوای اسکریپت:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/videotube/backups"
PROJECT_DIR="/home/videotube/apps/videotube"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/videotube_$DATE.tar.gz -C $PROJECT_DIR .

# حذف backup های قدیمی (بیش از 7 روز)
find $BACKUP_DIR -name "videotube_*.tar.gz" -mtime +7 -delete
```

```bash
# اجازه اجرا
chmod +x /home/videotube/backup.sh

# اضافه کردن به crontab برای backup روزانه
crontab -e
# اضافه کردن خط زیر:
# 0 2 * * * /home/videotube/backup.sh
```

## 🔄 مرحله ۱۰: به‌روزرسانی پروژه

### اسکریپت deploy:
```bash
nano /home/videotube/deploy.sh
```

محتوای اسکریپت:
```bash
#!/bin/bash
cd /home/videotube/apps/videotube

# Backup قبل از به‌روزرسانی
/home/videotube/backup.sh

# دانلود آخرین تغییرات
git pull origin main

# نصب dependencies جدید
npm install

# ساخت مجدد پروژه
npm run build

# راه‌اندازی مجدد PM2
pm2 restart videotube

echo "Deploy completed successfully!"
```

```bash
chmod +x /home/videotube/deploy.sh
```

## ✅ تست نهایی

### بررسی وضعیت سرویس‌ها:
```bash
# وضعیت Nginx
sudo systemctl status nginx

# وضعیت PM2
pm2 status

# بررسی پورت‌ها
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
```

### تست سایت:
```bash
# تست از خود سرور
curl -I http://localhost
curl -I http://YOUR_DOMAIN.com

# مشاهده لاگ‌های Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🚨 عیب‌یابی رایج

### مشکلات رایج و راه‌حل:

1. **خطای 502 Bad Gateway**:
```bash
# بررسی وضعیت PM2
pm2 status
pm2 restart videotube
```

2. **خطای Permission Denied**:
```bash
# تنظیم مجوزها
sudo chown -R videotube:videotube /home/videotube/apps/videotube
sudo chmod -R 755 /home/videotube/apps/videotube/dist
```

3. **خطای Out of Memory**:
```bash
# افزایش swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 📞 دستورات مفید

```bash
# مشاهده لاگ‌های PM2
pm2 logs videotube --lines 100

# راه‌اندازی مجدد Nginx
sudo systemctl restart nginx

# مشاهده استفاده از منابع
htop

# بررسی فضای دیسک
df -h

# بررسی استفاده از RAM
free -h
```

## 🎉 تبریک!

سایت شما اکنون روی سرور شخصی نصب شده و آماده استفاده است!

**آدرس سایت**: http://YOUR_DOMAIN.com یا http://YOUR_SERVER_IP
**حساب ادمین**: admin@example.com / admin
**حساب کاربر**: user@example.com / user

برای پشتیبانی بیشتر، لاگ‌ها را بررسی کنید و در صورت نیاز با تیم پشتیبانی تماس بگیرید.