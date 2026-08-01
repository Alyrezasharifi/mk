# Countdown — Recovery Landing Page

این پروژه یک صفحه فرود تک‌صفحه‌ای شمارش معکوس برای دوره بهبودی (مثلاً بعد از عمل بینی) است.

ویژگی‌ها:
- طراحی شیک با تم آبی و سفید
- استایل glassmorphism
- شمارش معکوس روز/ساعت/دقیقه/ثانیه با انیمیشن flip برای ثانیه
- نوار پیشرفت بر اساس تاریخ عمل و تاریخ بهبودی
- تصویر کارتونی دختر فرفری به صورت SVG (بدون تصویر واقعی)
- اشتراک، تولید QR، تمام صفحه، موسیقی اختیاری
- بدون نیاز به سرور — قابل میزبانی روی GitHub Pages

ساختار:
countdown/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── logo.svg
│   ├── curly-girl.svg
│   ├── music.mp3 (اختیاری — قرار دهید خودتان)
└── README.md

چطور اجرا کنم (محلی):
1. فولدر `countdown` را روی سیستم‌تان بسازید و فایل‌ها را همان‌طور که بالا آمده ذخیره کنید.
2. اگر می‌خواهید موسیقی باشد، یک فایل `music.mp3` در پوشه `assets` قرار دهید.
3. فایل `index.html` را در مرورگر باز کنید (دوبار کلیک یا راست → Open with).
4. برای تغییر تاریخ‌ها: در `script.js` متغیرهای `surgeryDate` و `recoveryDate` را تنظیم کنید:
   - مثال: `const surgeryDate = new Date('2026-07-13T09:00:00');`
   - مثال: `const recoveryDate = new Date('2026-09-10T09:00:00');`

منتشر کردن روی GitHub Pages:
1. یک مخزن جدید در GitHub بساز (مثلاً `countdown`).
2. پوشه را گیت‌گیری کن و پوش کن:
   ```bash
   cd countdown
   git init
   git add .
   git commit -m "Initial countdown landing page"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main