# 🚀 نصب سریع ویتیمو روی اوبونتو

## دستور نصب یک خطی:

```bash
curl -sSL https://raw.githubusercontent.com/your-repo/auto-install-vitimo.sh | sudo bash
```

## یا دانلود و اجرای دستی:

```bash
# دانلود اسکریپت
wget https://raw.githubusercontent.com/your-repo/auto-install-vitimo.sh

# اجازه اجرا
chmod +x auto-install-vitimo.sh

# اجرای اسکریپت
sudo ./auto-install-vitimo.sh
```

## اطلاعات مورد نیاز:

اسکریپت از شما می‌پرسد:
- **نام دامنه**: مثال `vitimo.com`
- **ایمیل**: برای SSL Certificate
- **نام کاربری**: پیش‌فرض `vitimo`

## مدت زمان نصب:
- **سرور سریع**: 5-10 دقیقه
- **سرور معمولی**: 10-15 دقیقه
- **سرور کند**: 15-20 دقیقه

## بعد از نصب:
- سایت در آدرس دامنه شما فعال می‌شود
- SSL Certificate خودکار نصب می‌شود
- Backup روزانه تنظیم می‌شود
- اسکریپت‌های مدیریت ایجاد می‌شوند

## پشتیبانی:
اگر مشکلی پیش آمد:
```bash
# بررسی وضعیت
/home/vitimo/monitor.sh

# مشاهده لاگ‌ها
pm2 logs vitimo
sudo tail -f /var/log/nginx/error.log
```