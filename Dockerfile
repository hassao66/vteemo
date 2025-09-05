# استفاده از Node.js به عنوان base image
FROM node:18-alpine

# تنظیم working directory
WORKDIR /app

# کپی کردن package files
COPY package*.json ./

# نصب dependencies
RUN npm ci --only=production

# کپی کردن کد منبع
COPY . .

# ساخت پروژه
RUN npm run build

# نصب serve برای سرو کردن فایل‌های static
RUN npm install -g serve

# تنظیم port
EXPOSE 3000

# اجرای برنامه
CMD ["serve", "-s", "dist", "-l", "3000"]