#!/bin/bash

# اسکریپت مانیتورینگ VideoTube
# استفاده: ./monitor.sh

LOG_FILE="/home/videotube/logs/monitor.log"
PROJECT_DIR="/home/videotube/apps/videotube"

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# تابع لاگ
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# تابع نمایش وضعیت
print_status() {
    local service=$1
    local status=$2
    local color=$3
    
    printf "%-20s: ${color}%s${NC}\n" "$service" "$status"
}

echo "🖥️  VideoTube System Monitor"
echo "============================"
echo ""

# بررسی وضعیت سیستم
echo "📊 System Information:"
echo "   Hostname: $(hostname)"
echo "   Uptime: $(uptime -p)"
echo "   Load Average: $(uptime | awk -F'load average:' '{print $2}')"
echo ""

# بررسی استفاده از منابع
echo "💾 Resource Usage:"
echo "   Memory: $(free -h | awk 'NR==2{printf "%.1f%% (%s/%s)", $3*100/$2, $3, $2}')"
echo "   Disk: $(df -h $PROJECT_DIR | awk 'NR==2{printf "%s (%s used)", $5, $3}')"
echo "   CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)% used"
echo ""

# بررسی وضعیت سرویس‌ها
echo "🔧 Service Status:"

# PM2
if command -v pm2 > /dev/null; then
    if pm2 describe videotube | grep -q "online"; then
        print_status "PM2 (VideoTube)" "✅ Running" $GREEN
        PM2_CPU=$(pm2 describe videotube | grep "cpu:" | awk '{print $2}')
        PM2_MEM=$(pm2 describe videotube | grep "memory:" | awk '{print $2}')
        echo "   └── CPU: $PM2_CPU, Memory: $PM2_MEM"
    else
        print_status "PM2 (VideoTube)" "❌ Stopped" $RED
    fi
else
    print_status "PM2" "❌ Not Installed" $RED
fi

# Nginx
if command -v nginx > /dev/null; then
    if systemctl is-active --quiet nginx; then
        print_status "Nginx" "✅ Running" $GREEN
    else
        print_status "Nginx" "❌ Stopped" $RED
    fi
else
    print_status "Nginx" "❌ Not Installed" $RED
fi

# Node.js
if command -v node > /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js" "✅ $NODE_VERSION" $GREEN
else
    print_status "Node.js" "❌ Not Installed" $RED
fi

echo ""

# بررسی وضعیت شبکه
echo "🌐 Network Status:"
if curl -f -s http://localhost:3000 > /dev/null; then
    print_status "Local App (3000)" "✅ Accessible" $GREEN
else
    print_status "Local App (3000)" "❌ Not Accessible" $RED
fi

if curl -f -s http://localhost > /dev/null; then
    print_status "Nginx (80)" "✅ Accessible" $GREEN
else
    print_status "Nginx (80)" "❌ Not Accessible" $RED
fi

echo ""

# بررسی لاگ‌های خطا
echo "📋 Recent Errors:"
ERROR_COUNT=0

# خطاهای PM2
if [ -f "/home/videotube/logs/err.log" ]; then
    PM2_ERRORS=$(tail -n 50 /home/videotube/logs/err.log 2>/dev/null | grep -c "$(date +%Y-%m-%d)" || echo "0")
    if [ $PM2_ERRORS -gt 0 ]; then
        echo "   ⚠️  PM2 Errors today: $PM2_ERRORS"
        ERROR_COUNT=$((ERROR_COUNT + PM2_ERRORS))
    fi
fi

# خطاهای Nginx
if [ -f "/var/log/nginx/error.log" ]; then
    NGINX_ERRORS=$(sudo tail -n 50 /var/log/nginx/error.log 2>/dev/null | grep -c "$(date +%Y/%m/%d)" || echo "0")
    if [ $NGINX_ERRORS -gt 0 ]; then
        echo "   ⚠️  Nginx Errors today: $NGINX_ERRORS"
        ERROR_COUNT=$((ERROR_COUNT + NGINX_ERRORS))
    fi
fi

if [ $ERROR_COUNT -eq 0 ]; then
    echo "   ✅ No recent errors found"
fi

echo ""

# آمار ترافیک (اگر لاگ Nginx در دسترس باشد)
if [ -f "/var/log/nginx/access.log" ]; then
    echo "📈 Traffic Stats (Today):"
    TODAY=$(date +%d/%b/%Y)
    REQUESTS=$(sudo grep "$TODAY" /var/log/nginx/access.log 2>/dev/null | wc -l || echo "0")
    UNIQUE_IPS=$(sudo grep "$TODAY" /var/log/nginx/access.log 2>/dev/null | awk '{print $1}' | sort -u | wc -l || echo "0")
    echo "   Requests: $REQUESTS"
    echo "   Unique IPs: $UNIQUE_IPS"
    echo ""
fi

# بررسی فضای دیسک
echo "💿 Disk Usage:"
DISK_USAGE=$(df -h $PROJECT_DIR | awk 'NR==2{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    print_status "Disk Space" "⚠️  ${DISK_USAGE}% (Critical)" $RED
elif [ $DISK_USAGE -gt 80 ]; then
    print_status "Disk Space" "⚠️  ${DISK_USAGE}% (Warning)" $YELLOW
else
    print_status "Disk Space" "✅ ${DISK_USAGE}% (OK)" $GREEN
fi

echo ""

# دستورات مفید
echo "🔧 Useful Commands:"
echo "   pm2 status              - وضعیت PM2"
echo "   pm2 logs videotube      - لاگ‌های برنامه"
echo "   pm2 restart videotube   - راه‌اندازی مجدد"
echo "   sudo systemctl status nginx - وضعیت Nginx"
echo "   htop                    - مانیتور منابع"
echo "   ./deploy.sh             - Deploy جدید"
echo "   ./backup.sh             - ایجاد Backup"

echo ""
echo "📅 Last updated: $(date)"

# ذخیره وضعیت در لاگ
log "System check completed - Errors: $ERROR_COUNT, Disk: ${DISK_USAGE}%"