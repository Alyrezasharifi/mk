/* script.js
   تنظیمات:
   - تاریخ عمل و تاریخ بهبودی در همین فایل تنظیم شده‌اند.
   - رفتار:
     * قبل از عمل -> شمارش معکوس تا عمل
     * بعد از عمل تا بهبودی -> شمارش معکوس تا بهبودی + نوار پیشرفت
     * بعد از بهبودی -> نمایش پیام تکمیل و نوار 100%
*/

/* ========== تنظیم تاریخ ========== */
/* تاریخ عمل: 9 آگوست 2026 ساعت 09:00 (فرمت ISO) */
const surgeryDate = new Date('2026-08-09T08:08:08');

/* تاریخ بهبودی: دقیقاً 6 ماه بعد از تاریخ عمل */
const recoveryDate = new Date(surgeryDate);
recoveryDate.setMonth(recoveryDate.getMonth() + 6);

/* ========== المنت‌ها ========== */
const el = {
  title: document.querySelector('.title'),
  subtitle: document.querySelector('.subtitle'),
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
  progressBar: document.getElementById('progressBar'),
  progressPercent: document.getElementById('progressPercent'),
  motivText: document.getElementById('motivText'),
  countdownUntil: document.getElementById('countdownUntil'),
  qrBtn: document.getElementById('qrBtn'),
  qrModal: document.getElementById('qrModal'),
  qrImg: document.getElementById('qrImg'),
  qrClose: document.getElementById('qrClose'),
  shareBtn: document.getElementById('shareBtn'),
  fsBtn: document.getElementById('fsBtn'),
  musicBtn: document.getElementById('musicBtn'),
  bgMusic: document.getElementById('bgMusic'),
};

/* util */
function pad(n){ return String(n).padStart(2,'0') }
function calcPercent(now, start, end){
  if(end <= start) return 100;
  return Math.max(0, Math.min(100, (now - start) / (end - start) * 100));
}

/* flip helper for seconds (adds flip class when value changes) */
function animateDigits(elm, value){
  const old = elm.textContent;
  if(old === value) return;
  const span = document.createElement('span');
  span.className = 'flip';
  span.textContent = value;
  elm.textContent = '';
  elm.appendChild(span);
  span.addEventListener('animationend', ()=>{
    elm.textContent = value;
  }, {once:true});
}

/* update loop with phases */
function update(){
  const now = new Date();

  if(now < surgeryDate){
    // Pre-surgery: countdown to surgery
    const ms = Math.max(0, surgeryDate - now);
    const days = Math.floor(ms / (1000*60*60*24));
    const hours = Math.floor(ms / (1000*60*60) % 24);
    const minutes = Math.floor(ms / (1000*60) % 60);
    const seconds = Math.floor(ms / 1000 % 60);

    el.title.textContent = '🔪Time Remaining Until Mahaks Nose Replacement🩸';
    el.subtitle.textContent = '✨Forward to a better nose and beyond⚡️';
    el.days.textContent = pad(days);
    el.hours.textContent = pad(hours);
    el.minutes.textContent = pad(minutes);
    animateDigits(el.seconds, pad(seconds));

    // progress: قبل از عمل نوار را صفر نشان می‌دهیم
    el.progressBar.style.width = `0%`;
    el.progressPercent.textContent = `0%`;

    el.countdownUntil.textContent = `${days} روز • ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    el.motivText.textContent = "☘️ wish you best 🤍";

  } else if(now >= surgeryDate && now < recoveryDate){
    // Between surgery and recovery: countdown to recovery + progress
    const ms = Math.max(0, recoveryDate - now);
    const days = Math.floor(ms / (1000*60*60*24));
    const hours = Math.floor(ms / (1000*60*60) % 24);
    const minutes = Math.floor(ms / (1000*60) % 60);
    const seconds = Math.floor(ms / 1000 % 60);

    el.title.textContent = 'Time Until Recovery';
    el.subtitle.textContent = 'You are stronger than you know';
    el.days.textContent = pad(days);
    el.hours.textContent = pad(hours);
    el.minutes.textContent = pad(minutes);
    animateDigits(el.seconds, pad(seconds));

    const elapsedPercent = calcPercent(now, surgeryDate, recoveryDate);
    el.progressBar.style.width = `${elapsedPercent.toFixed(1)}%`;
    el.progressPercent.textContent = `${Math.round(elapsedPercent)}%`;

    el.countdownUntil.textContent = `${days} days • ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    if(elapsedPercent >= 90) el.motivText.textContent = "تقریباً تا لبخندت آماده‌ای! 🤍";
    else if(elapsedPercent >= 50) el.motivText.textContent = "نیمی از راه را آمده‌ای — عالیه!";
    else el.motivText.textContent = "هر طلوع خورشید، یک قدم نزدیک‌تر. 🤍";

  } else {
    // After recovery: completed
    el.title.textContent = 'Recovery Complete';
    el.subtitle.textContent = 'now we can celebrate. You can breathe now. ';
    el.days.textContent = pad(0);
    el.hours.textContent = pad(0);
    el.minutes.textContent = pad(0);
    animateDigits(el.seconds, pad(0));

    el.progressBar.style.width = `100%`;
    el.progressPercent.textContent = `100%`;

    el.countdownUntil.textContent = `0 روز • 00:00:00`;
    el.motivText.textContent = "تبریک! ریکاوری کامل شد — به خودت افتخار کن. 💙";
  }
}

/* start updates */
update();
setInterval(update, 900); // ~ هر 0.9 ثانیه

/* بقیه دکمه‌ها (مثل قبل) */

/* buttons: share */
el.shareBtn.addEventListener('click', async ()=>{
  const shareData = {
    title: document.title,
    text: 'Countdown to recovery',
    url: location.href
  };
  try{
    if(navigator.share){
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(location.href);
      alert('لینک در کلیپ‌بورد کپی شد — آن را با دوستانتان به اشتراک بگذارید.');
    }
  }catch(e){
    console.warn(e);
    alert('اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود، لینک کپی شد.');
  }
});

/* QR modal */
el.qrBtn.addEventListener('click', ()=>{
  const url = encodeURIComponent(location.href);
  el.qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}`;
  el.qrModal.classList.remove('hidden');
});
el.qrClose.addEventListener('click', ()=> el.qrModal.classList.add('hidden'));

/* fullscreen */
el.fsBtn.addEventListener('click', async ()=>{
  try{
    if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }catch(e){console.warn(e)}
});

/* music toggle — جایگزین قبلی */
const audio = el.bgMusic;
audio.preload = 'auto';
audio.volume = 0.85;
audio.muted = false;

audio.addEventListener('error', (ev)=>{
  console.error('Audio load error', audio.error, ev);
  alert('خطا در بارگذاری فایل صوتی. بررسی کن که فایل assets/music.mp3 وجود داشته باشد.');
});

let musicOn = false;
el.musicBtn.addEventListener('click', async () => {
  const src = audio.getAttribute('src');
  if (!src) {
    alert('فایل music.mp3 در پوشه assets وجود ندارد. آن را اضافه کن یا مسیر را اصلاح کن.');
    return;
  }

  try {
    // play() ممکن است Promise برگرداند — منتظر باشیم تا شکست یا موفقیت آن مشخص شود
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      await playPromise;
    }
    // اگر رسیدیم اینجا یعنی پخش شروع شد
    musicOn = true;
    el.musicBtn.textContent = '⏸';
  } catch (err) {
    // play() رد شده — معمولاً سیاست‌های autoplay یا خطای CORS/محتوا
    console.error('Audio play() rejected:', err);
    alert('مرورگر اجازهٔ پخش صدا را نداد یا خطایی رخ داد. جزئیات در Console.');
    // برای دیباگ: نمایش کنترل‌ها برای تست دستی
    audio.setAttribute('controls', '');
  }
});

/* accessibility: close modal with Escape */
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape') el.qrModal.classList.add('hidden');
});