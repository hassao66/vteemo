#!/bin/bash

# اسکریپت Backup برای VideoTube
# استفاده: ./backup.sh

PROJECT_DIR="/home/videotube/apps/videotube"
BACKUP_DIR="/home/videotube/backups"
LOG_FILE="/home/videotube/logs/backup.log"
DATE=$(date +%Y%m%d_%H%M%S)

# ایجاد پوشه‌های مورد نیاز
mkdir -p $BACKUP_DIR
mkdir -p /home/videotube/logs

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
BACKUP_FILE="$BACKUP_DIR/videotube_full_$DATE.tar.gz"
tar -czf $BACKUP_FILE -C $PROJECT_DIR .

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
    log "✅ Backup ایجاد شد: videotube_full_$DATE.tar.gz ($BACKUP_SIZE)"
else
    log "❌ خطا در ایجاد Backup"
    exit 1
fi

# Backup تنظیمات Nginx
if [ -f "/etc/nginx/sites-available/videotube" ]; then
    log "🌐 Backup تنظیمات Nginx..."
    cp /etc/nginx/sites-available/videotube $BACKUP_DIR/nginx_videotube_$DATE.conf
    log "✅ تنظیمات Nginx backup شد"
fi

# Backup تنظیمات PM2
log "🔄 Backup تنظیمات PM2..."
pm2 save
cp ~/.pm2/dump.pm2 $BACKUP_DIR/pm2_dump_$DATE.pm2 2>/dev/null || true

# ایجاد فایل اطلاعات Backup
INFO_FILE="$BACKUP_DIR/backup_info_$DATE.txt"
cat > $INFO_FILE << EOF
VideoTube Backup Information
===========================
Date: $(date)
Backup File: videotube_full_$DATE.tar.gz
Project Directory: $PROJECT_DIR
Server: $(hostname)
User: $(whoami)

System Information:
- OS: $(lsb_release -d 2>/dev/null | cut -f2 || echo "Unknown")
- Node.js: $(node --version 2>/dev/null || echo "Not installed")
- PM2: $(pm2 --version 2>/dev/null || echo "Not installed")
- Nginx: $(nginx -v 2>&1 | head -1 || echo "Not installed")

PM2 Status:
$(pm2 status 2>/dev/null || echo "PM2 not running")

Disk Usage:
$(df -h $PROJECT_DIR)

Files in Backup:
$(tar -tzf $BACKUP_FILE | head -20)
$([ $(tar -tzf $BACKUP_FILE | wc -l) -gt 20 ] && echo "... and $(( $(tar -tzf $BACKUP_FILE | wc -l) - 20 )) more files")
EOF

log "📋 فایل اطلاعات ایجاد شد: backup_info_$DATE.txt"

# پاک‌سازی Backup های قدیمی (بیش از 30 روز)
log "🧹 پاک‌سازی Backup های قدیمی..."
OLD_BACKUPS=$(find $BACKUP_DIR -name "videotube_*.tar.gz" -mtime +30 | wc -l)
find $BACKUP_DIR -name "videotube_*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "nginx_*.conf" -mtime +30 -delete
find $BACKUP_DIR -name "pm2_dump_*.pm2" -mtime +30 -delete
find $BACKUP_DIR -name "backup_info_*.txt" -mtime +30 -delete

if [ $OLD_BACKUPS -gt 0 ]; then
    log "✅ $OLD_BACKUPS Backup قدیمی پاک شد"
else
    log "ℹ️  Backup قدیمی برای پاک کردن یافت نشد"
fi

# نمایش آمار Backup ها
TOTAL_BACKUPS=$(ls -1 $BACKUP_DIR/videotube_*.tar.gz 2>/dev/null | wc -l)
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