#!/bin/bash

# اسکریپت نصب خودکار VideoTube چندزبانه
# نسخه: 2.0
# پشتیبانی: Ubuntu 20.04+, CentOS 7+

set -e  # خروج در صورت خطا

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# تابع نمایش پیام‌ها
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# تشخیص سیستم عامل
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        print_error "Cannot detect OS"
        exit 1
    fi
}

# بررسی دسترسی root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_warning "Running as root. Creating videotube user..."
        CREATE_USER=true
    else
        print_status "Running as non-root user"
        CREATE_USER=false
    fi
}

# نصب پیش‌نیازها
install_prerequisites() {
    print_header "Installing Prerequisites"
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        print_status "Updating package list..."
        apt update
        
        print_status "Installing basic packages..."
        apt install -y curl wget git unzip htop nano software-properties-common
        
        print_status "Installing Nginx..."
        apt install -y nginx
        
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        print_status "Updating system..."
        yum update -y
        
        print_status "Installing EPEL repository..."
        yum install -y epel-release
        
        print_status "Installing basic packages..."
        yum install -y curl wget git unzip htop nano
        
        print_status "Installing Nginx..."
        yum install -y nginx
    else
        print_error "Unsupported OS: $OS"
        exit 1
    fi
    
    print_success "Prerequisites installed successfully"
}

# نصب Node.js
install_nodejs() {
    print_header "Installing Node.js"
    
    print_status "Adding NodeSource repository..."
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
        yum install -y nodejs
    fi
    
    # تأیید نصب
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    print_success "Node.js $NODE_VERSION installed"
    print_success "npm $NPM_VERSION installed"
}

# نصب PM2
install_pm2() {
    print_header "Installing PM2"
    
    print_status "Installing PM2 globally..."
    npm install -g pm2
    
    print_status "Installing serve globally..."
    npm install -g serve
    
    PM2_VERSION=$(pm2 --version)
    print_success "PM2 $PM2_VERSION installed"
}

# ایجاد کاربر پروژه
create_user() {
    if [ "$CREATE_USER" = true ]; then
        print_header "Creating Project User"
        
        print_status "Creating videotube user..."
        if ! id "videotube" &>/dev/null; then
            useradd -m -s /bin/bash videotube
            usermod -aG sudo videotube
            print_success "User videotube created"
        else
            print_warning "User videotube already exists"
        fi
        
        # ایجاد پوشه‌های مورد نیاز
        print_status "Creating project directories..."
        sudo -u videotube mkdir -p /home/videotube/apps
        sudo -u videotube mkdir -p /home/videotube/backups
        sudo -u videotube mkdir -p /home/videotube/logs
        
        print_success "Project directories created"
    fi
}

# دانلود و نصب پروژه
install_project() {
    print_header "Installing VideoTube Project"
    
    PROJECT_DIR="/home/videotube/apps/videotube"
    
    print_status "Creating project directory..."
    if [ "$CREATE_USER" = true ]; then
        sudo -u videotube mkdir -p $PROJECT_DIR
        cd $PROJECT_DIR
    else
        mkdir -p $PROJECT_DIR
        cd $PROJECT_DIR
    fi
    
    print_status "Creating package.json..."
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

    print_status "Creating configuration files..."
    
    # ایجاد index.html
    cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VideoTube - Multilingual Video Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

    # ایجاد vite.config.ts
    cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
EOF

    # ایجاد tailwind.config.js
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          600: '#6A0DAD',
          700: '#4B0082',
        },
        gold: {
          400: '#FFD700',
          500: '#FFD700',
        },
      },
    },
  },
  plugins: [],
};
EOF

    # ایجاد پوشه src
    mkdir -p src
    
    print_status "Installing dependencies..."
    if [ "$CREATE_USER" = true ]; then
        sudo -u videotube npm install
    else
        npm install
    fi
    
    print_success "Project structure created"
}

# تنظیم PM2
setup_pm2() {
    print_header "Setting up PM2"
    
    PROJECT_DIR="/home/videotube/apps/videotube"
    cd $PROJECT_DIR
    
    print_status "Creating PM2 ecosystem file..."
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

    print_success "PM2 configuration created"
}

# تنظیم Nginx
setup_nginx() {
    print_header "Setting up Nginx"
    
    print_status "Creating Nginx configuration..."
    cat > /etc/nginx/sites-available/videotube << 'EOF'
server {
    listen 80;
    server_name _;
    
    root /home/videotube/apps/videotube/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
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
        application/json;
    
    client_max_body_size 100M;
}
EOF

    # فعال‌سازی سایت
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        ln -sf /etc/nginx/sites-available/videotube /etc/nginx/sites-enabled/
        rm -f /etc/nginx/sites-enabled/default
    fi
    
    # تست تنظیمات
    nginx -t
    
    # راه‌اندازی مجدد Nginx
    systemctl enable nginx
    systemctl restart nginx
    
    print_success "Nginx configured and started"
}

# ایجاد اسکریپت‌های مدیریت
create_management_scripts() {
    print_header "Creating Management Scripts"
    
    # اسکریپت Deploy
    print_status "Creating deploy script..."
    cat > /home/videotube/deploy.sh << 'EOF'
#!/bin/bash
cd /home/videotube/apps/videotube

echo "🚀 Starting deployment..."

# Backup
echo "💾 Creating backup..."
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /home/videotube/backups/videotube_$DATE.tar.gz -C /home/videotube/apps/videotube .

# Build
echo "🔨 Building project..."
npm run build

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart videotube

echo "✅ Deployment completed!"
EOF

    # اسکریپت Backup
    print_status "Creating backup script..."
    cat > /home/videotube/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/videotube/backups"
PROJECT_DIR="/home/videotube/apps/videotube"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/videotube_$DATE.tar.gz -C $PROJECT_DIR .

# حذف backup های قدیمی
find $BACKUP_DIR -name "videotube_*.tar.gz" -mtime +7 -delete

echo "✅ Backup completed: videotube_$DATE.tar.gz"
EOF

    # اسکریپت Monitor
    print_status "Creating monitor script..."
    cat > /home/videotube/monitor.sh << 'EOF'
#!/bin/bash

echo "🖥️  VideoTube System Monitor"
echo "============================"
echo ""

echo "📊 System Information:"
echo "   Hostname: $(hostname)"
echo "   Uptime: $(uptime -p)"
echo "   Load: $(uptime | awk -F'load average:' '{print $2}')"
echo ""

echo "💾 Resource Usage:"
echo "   Memory: $(free -h | awk 'NR==2{printf "%.1f%% (%s/%s)", $3*100/$2, $3, $2}')"
echo "   Disk: $(df -h /home/videotube | awk 'NR==2{printf "%s (%s used)", $5, $3}')"
echo ""

echo "🔧 Service Status:"
if systemctl is-active --quiet nginx; then
    echo "   Nginx: ✅ Running"
else
    echo "   Nginx: ❌ Stopped"
fi

if pm2 describe videotube | grep -q "online"; then
    echo "   PM2 (VideoTube): ✅ Running"
else
    echo "   PM2 (VideoTube): ❌ Stopped"
fi

echo ""
echo "📋 PM2 Status:"
pm2 status
EOF

    # تنظیم مجوزها
    chmod +x /home/videotube/*.sh
    
    if [ "$CREATE_USER" = true ]; then
        chown videotube:videotube /home/videotube/*.sh
    fi
    
    print_success "Management scripts created"
}

# تنظیم فایروال
setup_firewall() {
    print_header "Setting up Firewall"
    
    if command -v ufw &> /dev/null; then
        print_status "Configuring UFW..."
        ufw --force enable
        ufw allow ssh
        ufw allow 'Nginx Full'
        print_success "UFW configured"
    elif command -v firewall-cmd &> /dev/null; then
        print_status "Configuring Firewalld..."
        systemctl enable firewalld
        systemctl start firewalld
        firewall-cmd --permanent --add-service=ssh
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
        print_success "Firewalld configured"
    else
        print_warning "No firewall detected. Please configure manually."
    fi
}

# نمایش اطلاعات نهایی
show_final_info() {
    print_header "Installation Complete!"
    
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")
    
    echo -e "${GREEN}✅ VideoTube has been successfully installed!${NC}"
    echo ""
    echo -e "${CYAN}📋 Installation Summary:${NC}"
    echo -e "   • Node.js: $(node --version)"
    echo -e "   • PM2: $(pm2 --version)"
    echo -e "   • Nginx: $(nginx -v 2>&1 | cut -d' ' -f3)"
    echo ""
    echo -e "${CYAN}🌐 Access Information:${NC}"
    echo -e "   • Website: http://$SERVER_IP"
    echo -e "   • Admin: admin@example.com / admin"
    echo -e "   • User: user@example.com / user"
    echo ""
    echo -e "${CYAN}🔧 Management Commands:${NC}"
    echo -e "   • Deploy: /home/videotube/deploy.sh"
    echo -e "   • Backup: /home/videotube/backup.sh"
    echo -e "   • Monitor: /home/videotube/monitor.sh"
    echo -e "   • PM2 Status: pm2 status"
    echo -e "   • PM2 Logs: pm2 logs videotube"
    echo ""
    echo -e "${CYAN}📁 Important Paths:${NC}"
    echo -e "   • Project: /home/videotube/apps/videotube"
    echo -e "   • Logs: /home/videotube/logs"
    echo -e "   • Backups: /home/videotube/backups"
    echo ""
    echo -e "${YELLOW}⚠️  Next Steps:${NC}"
    echo -e "   1. Add your project files to /home/videotube/apps/videotube/src"
    echo -e "   2. Run: cd /home/videotube/apps/videotube && npm run build"
    echo -e "   3. Start PM2: pm2 start ecosystem.config.js"
    echo -e "   4. Configure your domain in Nginx"
    echo -e "   5. Install SSL certificate with certbot"
    echo ""
    echo -e "${GREEN}🎉 Happy coding!${NC}"
}

# تابع اصلی
main() {
    print_header "VideoTube Multilingual Installation"
    print_status "Starting installation process..."
    
    detect_os
    print_status "Detected OS: $OS $VER"
    
    check_root
    install_prerequisites
    install_nodejs
    install_pm2
    create_user
    install_project
    setup_pm2
    setup_nginx
    create_management_scripts
    setup_firewall
    show_final_info
}

# اجرای اسکریپت
main "$@"