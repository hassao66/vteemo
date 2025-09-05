#!/bin/bash

# اسکریپت دانلود کامل پروژه VideoTube

echo "📥 دانلود پروژه VideoTube..."

# ایجاد پوشه پروژه
mkdir -p /home/videotube/apps/videotube
cd /home/videotube/apps/videotube

# دانلود فایل‌های اصلی از GitHub (فرضی)
echo "📦 دانلود فایل‌های پروژه..."

# اگر پروژه در GitHub است:
# git clone https://github.com/username/videotube.git .

# یا دانلود به صورت ZIP:
# wget https://github.com/username/videotube/archive/main.zip
# unzip main.zip
# mv videotube-main/* .
# rm -rf videotube-main main.zip

# برای الان، فایل‌های نمونه ایجاد می‌کنیم:
echo "🔧 ایجاد فایل‌های نمونه..."

# package.json
curl -o package.json https://raw.githubusercontent.com/example/videotube/main/package.json 2>/dev/null || {
    echo "⚠️  نمی‌توان فایل را دانلود کرد. فایل نمونه ایجاد می‌شود..."
    cat > package.json << 'EOF'
{
  "name": "videotube",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.8.0",
    "lucide-react": "^0.344.0",
    "recharts": "^3.1.2",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35"
  }
}
EOF
}

echo "✅ پروژه آماده شد!"
echo ""
echo "🔄 مراحل بعدی:"
echo "   1. cd /home/videotube/apps/videotube"
echo "   2. npm install"
echo "   3. npm run build"
echo "   4. pm2 start ecosystem.config.js"
echo ""
echo "🌐 پس از راه‌اندازی، سایت در آدرس زیر در دسترس خواهد بود:"
echo "   http://YOUR_SERVER_IP"