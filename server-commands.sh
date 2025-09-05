#!/bin/bash

# اسکریپت نصب خودکار VideoTube روی سرور Ubuntu

echo "🚀 شروع نصب VideoTube..."

# به‌روزرسانی سیستم
echo "📦 به‌روزرسانی سیستم..."
sudo apt update && sudo apt upgrade -y

# نصب پیش‌نیازها
echo "🔧 نصب پیش‌نیازها..."
sudo apt install -y curl wget git nginx

# نصب Node.js
echo "📦 نصب Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تأیید نصب Node.js
echo "✅ بررسی نسخه Node.js:"
node --version
npm --version

# نصب PM2
echo "🔄 نصب PM2..."
sudo npm install -g pm2 serve

# ایجاد کاربر پروژه
echo "👤 ایجاد کاربر videotube..."
sudo adduser --disabled-password --gecos "" videotube
sudo usermod -aG sudo videotube

# ایجاد پوشه‌های پروژه
echo "📁 ایجاد پوشه‌های پروژه..."
sudo -u videotube mkdir -p /home/videotube/apps
sudo -u videotube mkdir -p /home/videotube/backups

# تنظیم مجوزها
sudo chown -R videotube:videotube /home/videotube

echo "✅ نصب پایه تکمیل شد!"
echo ""
echo "🔄 مراحل بعدی:"
echo "1. فایل‌های پروژه را در /home/videotube/apps/videotube قرار دهید"
echo "2. دستورات زیر را اجرا کنید:"
echo ""
echo "   cd /home/videotube/apps/videotube"
echo "   npm install"
echo "   npm run build"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "3. Nginx را تنظیم کنید"
echo "4. SSL Certificate نصب کنید"
echo ""
echo "📖 برای راهنمای کامل، فایل server-setup.md را مطالعه کنید"