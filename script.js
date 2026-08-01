/* script.js
   تنظیمات:
   - اگر می‌خواهید تاریخ عمل و تاریخ بهبودی را مشخص کنید، مقدار surgeryDate و recoveryDate را تغییر دهید.
   - فرمت: new Date('2026-08-20T09:00:00') یا می‌توانید از new Date() و setDate استفاده کنید.
*/

/* ========== تنظیم تاریخ ========== */
/* مثال: اگر عمل قبلاً انجام شده، surgeryDate باید تاریخ عمل باشد. */
const surgeryDate = new Date(); // به طور پیش‌فرض: همین الان (قابل تغییر)
const recoveryDate = new Date(); recoveryDate.setDate(recoveryDate.getDate() + 19); // به طور پیش‌فرض: 19 روز بعد

/* ========== المنت‌ها ========== */
const el = {
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
  // create a temporary span to animate
  const span = document.createElement('span');
  span.className = 'flip';
  span.textContent = value;
  // clear and append
  elm.textContent = '';
  elm.appendChild(span);
  // when animation ends, set plain text
  span.addEventListener('animationend', ()=>{
    elm.textContent = value;
  }, {once:true});
}

/* update loop */
function update(){
  const now = new Date();
  const totalMs = recoveryDate - surgeryDate;
  const remainingMs = recoveryDate - now;
  const elapsedPercent = calcPercent(now, surgeryDate, recoveryDate);

  // compute days/hours/min/sec remaining (clamped at 0)
  const ms = Math.max(0, remainingMs);
  const days = Math.floor(ms / (1000*60*60*24));
  const hours = Math.floor(ms / (1000*60*60) % 24);
  const minutes = Math.floor(ms / (1000*60) % 60);
  const seconds = Math.floor(ms / 1000 % 60);

  el.days.textContent = pad(days);
  el.hours.textContent = pad(hours);
  el.minutes.textContent = pad(minutes);
  // animate seconds with flip
  animateDigits(el.seconds, pad(seconds));

  // progress bar
  el.progressBar.style.width = `${elapsedPercent.toFixed(1)}%`;
  el.progressPercent.textContent = `${Math.round(elapsedPercent)}%`;

  // small meta text
  const remainingStr = `${days} روز • ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  el.countdownUntil.textContent = remainingStr;

  // motivational text change near end
  if(elapsedPercent >= 90) el.motivText.textContent = "تقریباً تا لبخندت آماده‌ای! 🤍";
  else if(elapsedPercent >= 50) el.motivText.textContent = "نیمی از راه را آمده‌ای — عالیه!";
  else el.motivText.textContent = "هر طلوع خورشید، یک قدم نزدیک‌تر. 🤍";
}

/* start updates */
update();
setInterval(update, 900); // ~ هر 0.9 ثانیه

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
  // use the free qrserver API to generate a QR image
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

/* music toggle */
let musicOn = false;
el.musicBtn.addEventListener('click', ()=>{
  if(!el.bgMusic.getAttribute('src')) { alert('فایل music.mp3 در پوشه assets وجود ندارد. اگر می‌خواهید موسیقی باشد آن را اضافه کنید.'); return; }
  if(musicOn){ el.bgMusic.pause(); el.musicBtn.textContent = '♪'; musicOn=false }
  else{ el.bgMusic.play().catch(()=>{}); el.musicBtn.textContent = '⏸'; musicOn=true }
});

/* accessibility: close modal with Escape */
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape') el.qrModal.classList.add('hidden');
});