#!/bin/bash

# اسکریپت Deploy برای VideoTube
# استفاده: ./deploy.sh

set -e  # خروج در صورت خطا

PROJECT_DIR="/home/videotube/apps/videotube"
BACKUP_DIR="/home/videotube/backups"
LOG_FILE="/home/videotube/logs/deploy.log"

# ایجاد پوشه لاگ
mkdir -p /home/videotube/logs

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
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/videotube_$DATE.tar.gz -C $PROJECT_DIR .
log "✅ Backup ایجاد شد: videotube_$DATE.tar.gz"

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
pm2 restart videotube
sleep 5

# بررسی وضعیت PM2
if pm2 describe videotube | grep -q "online"; then
    log "✅ PM2 با موفقیت راه‌اندازی شد"
else
    log "❌ خطا در راه‌اندازی PM2"
    pm2 logs videotube --lines 20
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

# پاک‌سازی Backup های قدیمی (بیش از 7 روز)
log "🧹 پاک‌سازی Backup های قدیمی..."
find $BACKUP_DIR -name "videotube_*.tar.gz" -mtime +7 -delete
log "✅ Backup های قدیمی پاک شد"

# راه‌اندازی مجدد Nginx (اختیاری)
if command -v nginx > /dev/null; then
    log "🔄 راه‌اندازی مجدد Nginx..."
    sudo nginx -t && sudo systemctl reload nginx
    log "✅ Nginx راه‌اندازی شد"
fi

log "🎉 Deploy با موفقیت تکمیل شد!"
log "📊 وضعیت سرویس‌ها:"
pm2 status | tee -a $LOG_FILE

echo ""
echo "✅ Deploy تکمیل شد!"
echo "📊 برای مشاهده وضعیت: pm2 status"
echo "📋 برای مشاهده لاگ‌ها: pm2 logs videotube"
echo "🌐 سایت: http://YOUR_DOMAIN.com"