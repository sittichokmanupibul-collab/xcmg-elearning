import { supabase } from './supabase.js';

// ─── Brand colours ───────────────────────────────────────────────
const XCMG_BLUE   = '#1B3A6B';
const GOLD        = '#B8973A';
const LIGHT_GOLD  = '#D4AF55';
const TEXT_DARK   = '#2C3E50';
const TEXT_MID    = '#4A5568';
const BG_CREAM    = '#FBF8F0';
const BORDER_GOLD = '#C9A84C';

// ─── Embedded XCMG logo (webp → base64) ──────────────────────────
const XCMG_LOGO_B64 = 'data:image/webp;base64,UklGRuwEAABXRUJQVlA4IOAEAAAQHQCdASo7ADgAPhUIg0EhBz6dqgQAUS2AFiSoL8A/ADrGHwcR/Fz9ZP850NerncT9qv87inH177O/dX/M/sA7QD9B/0u/kXsq9AD9bv6h/APfA/gHUAfqb///3/7gD9gPYA8or9dPgj/tn+A9In//3mp9A+lXp9fWP9gMuV9P4Qdpr7Vfxmy5LTJfzL+2/l5zAxzX9r/xP3Ieyb8g/tn+X/Lv6BP41/O/8j+af9g7+f66ewn+qR/v639ucMYnBcmxyhNOIP6kfY9jbQCdI47+2zNJQDPPibEgmwCvYbGvNO8zeiIb2KP3IHi9OCPEIcEAAP7/GlpiP12sSZtHaVf5O/zb0S3PAtHizWIB/vurR3Ybw+c61uBCH69ue1sfzlOADwjQWeZnY0fnB0jaXoKC+Emi+gcFXZXTJht/8JXl9+PSj8DgL9hMYJCy3ZN9DqMs0boZ8A3UA2HgZXY34cHjl9eX747DSq2EdicjI+UwqB9N81PoFYK9Kyi6b2xKi/wRO0Z4o8l712ZWent3u2945E5LOLQe96iJXtFIUe0L7NZg1tF+ih0OIb0yatz/AsDUjf6erv/+vf8txsC2Ou2Dn9IZj//TEQzPw2SZD2Iba7yHgqVJYv2yFNiR/Co0lJ1EMZlH/6ByVHBKVEBMSRhO+5ie6OFxJe7Pv3R4/N7ZHvq09o140v4+afcttQ1AtK/AtrOVsq55P52Rpg7wMoKE2INh2f5sbsZYgsOMypSIoyhO2fEtNuZpoqnibeMO5M31I7P0CEHxn2TpKRTJc5nrKxvhTB8pGNpzHUgup2D9CnmW/MTUbbYDO9HQUp/516nMVOL8nqwCNn9xOtyzLq1bN5r31n0ah/FaGU6Rg3iWauEQ6swfraW7GeLZTr5MUFRwKe/HdpnU14Yqrup2NxtINav13StnciMAgVDm0fWzDB8osrnWYeMoYW4gSawiLaVdU5tpNx3uis5X5fHk4HzNUGiIGguOkMHKeeFnmCZmYcq4iICH8RAnxnd3BBDNQxMyGAcBx9sc2IICgoju5LtxNUoa7+Lzn2aO/8QBydw6YG5YKF/uGNVTWG0dff4JRgoXbuOPNzSUFxTS1aBDattZcxlvd8jrFV4oEJWhj6EqT54sgv9snFKMrHv8f2U3GWSZx2P5eZsBq1DHUKBIooeOvS9cDDzC1wLizg+pX5PFzHfqcNaesPwbCNLKHsMTMeExpCzu/WhzJvfAdMfbpqzCBKEoxZOoxYclhjy0LpO6TNpg+LeOOgC8PJbrnUI8eIMqc107C+MdPUS4KdzSPyT42Izs2Aox8oio/7f/4m34ejpRxMjjRhzeBnS6/TAht5skDLi8ZUe7BCdv//epLCXaTwVnLoe5//8M69MTxAVdCbsUFkmQoo7vR1cP//5UI0fSwWCZ7h6cXvRYSds9RcvmwHY2dW/ntWjSotmobmk1bAOA5KJ/U+Mjpn8hD716JqgHu0DlCuTDpQqa/vIDiPaeSGkuWymu8Qs0BHUBtWw/v3v8D8c8MJU8Nbvw2sVCrzsaf39mjVf//1eIsTU6DdQEAW878/Lp/6pyv5jyavSVoKY0Vr//pLnSD7+v1uXyU+1ALUp7XLeLf2umtgcEJ2zFbAwiogvNiEbPu+58I0GXTH1Ro8JryocZqap3iZMAAAA=';

// ─── Thai date formatter ──────────────────────────────────────────
function formatThaiDate(dateString) {
  const months = [
    'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน',
    'พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม',
    'กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
  ];
  const d = dateString ? new Date(dateString) : new Date();
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
}

// ─── Load image from src (base64 or URL) ─────────────────────────
async function loadImage(src) {
  if (!src) return null;
  if (src.startsWith('data:')) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload  = () => res(img);
      img.onerror = () => rej(new Error('โหลด base64 image ไม่สำเร็จ'));
      img.src = src;
    });
  }
  try {
    const resp   = await fetch(src);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const blob   = await resp.blob();
    const objUrl = URL.createObjectURL(blob);
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload  = () => { URL.revokeObjectURL(objUrl); res(img); };
      img.onerror = () => { URL.revokeObjectURL(objUrl); rej(new Error('load failed')); };
      img.src = objUrl;
    });
  } catch {
    return new Promise((res, rej) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload  = () => res(img);
      img.onerror = () => rej(new Error('CORS load failed: ' + src.slice(0, 60)));
      img.src = src + (src.includes('?') ? '&' : '?') + '_t=' + Date.now();
    });
  }
}

// ─── Convert Supabase public URL to signed URL (60 s) ────────────
async function toSignedUrl(publicUrl) {
  if (!publicUrl) return null;
  try {
    const url   = new URL(publicUrl);
    const parts = url.pathname.split('/');
    const idx   = parts.indexOf('public');
    if (idx === -1) return publicUrl;
    const bucket   = parts[idx + 1];
    const filePath = parts.slice(idx + 2).join('/');
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filePath, 60);
    return (error || !data?.signedUrl) ? publicUrl : data.signedUrl;
  } catch { return publicUrl; }
}

// ─── Font injection + loading (รองรับ Thai & Eng บน Canvas) ────────
// วิธีนี้ inject <link> + <style> @font-face เพื่อบังคับให้ browser
// โหลด Sarabun / Noto Sans Thai จริง ก่อนที่ canvas จะ render ข้อความ
let _fontsLoaded = false;
async function loadFonts() {
  if (_fontsLoaded) return;
  _fontsLoaded = true;

  // 1. Inject Google Fonts link (Sarabun รองรับทั้งไทยและ Latin)
  if (!document.getElementById('cert-gfonts')) {
    const link = document.createElement('link');
    link.id   = 'cert-gfonts';
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&family=Noto+Sans+Thai:wght@400;700&display=swap';
    document.head.appendChild(link);
  }

  // 2. ใช้ FontFace API โหลดตรงจาก Google Fonts CDN (ไม่ผ่าน CSS)
  //    เพื่อให้แน่ใจว่า canvas สามารถเข้าถึง font ได้ทันที
  const variants = [
    { family: 'Sarabun',        weight: '400', url: 'https://fonts.gstatic.com/s/sarabun/v13/DtVjJx26TKEr37c9YLlr6Q.woff2' },
    { family: 'Sarabun',        weight: '700', url: 'https://fonts.gstatic.com/s/sarabun/v13/DtVmJx26TKEr37c9YBVzpKlr.woff2' },
    { family: 'Noto Sans Thai', weight: '400', url: 'https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofpTBiO_GQ.woff2' },
    { family: 'Noto Sans Thai', weight: '700', url: 'https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofpTBiO_GQ.woff2' },
  ];

  const loads = variants.map(async ({ family, weight, url }) => {
    try {
      // ตรวจสอบก่อนว่า font โหลดแล้วหรือยัง
      const alreadyLoaded = [...document.fonts].some(
        f => f.family === family && f.weight === weight && f.status === 'loaded'
      );
      if (alreadyLoaded) return;

      const ff = new FontFace(family, `url(${url})`, { weight, style: 'normal' });
      const loaded = await ff.load();
      document.fonts.add(loaded);
    } catch {
      // ถ้าโหลด woff2 ไม่ได้ → ข้ามไป ใช้ fallback
    }
  });

  await Promise.allSettled(loads);

  // 3. รอให้ document.fonts พร้อมทั้งหมด
  if (document.fonts?.ready) await document.fonts.ready;

  // 4. "warm-up" render: วาดอักขระไทยลง off-screen canvas ตัวเล็กก่อน
  //    เพื่อบังคับให้ browser shape ตัวอักษรก่อน canvas หลัก render
  const warmup = document.createElement('canvas');
  warmup.width = warmup.height = 2;
  const wCtx = warmup.getContext('2d');
  wCtx.font = '700 1px Sarabun, Noto Sans Thai, Arial';
  wCtx.fillText('กขคงจชซ', 0, 1);
  wCtx.font = '400 1px Sarabun, Noto Sans Thai, Arial';
  wCtx.fillText('abcdefg', 0, 1);
}

// ─── Helper: draw rounded rectangle path ─────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Helper: centred text with auto font-size shrink ─────────────
function drawTextCentered(ctx, text, x, y, maxWidth, fontSize, weight, color, font) {
  let fs = fontSize;
  ctx.font = `${weight} ${fs}px ${font}`;
  while (ctx.measureText(text).width > maxWidth && fs > 20) {
    fs -= 2;
    ctx.font = `${weight} ${fs}px ${font}`;
  }
  ctx.fillStyle    = color;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

// ─── Draw "CERTIFIED XCMG" medal seal ────────────────────────────
function drawMedalSeal(ctx, cx, cy, r) {
  // Outer gold ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#F5E6B8';
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 6;
  ctx.stroke();

  // Inner cream circle
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
  ctx.fillStyle = '#FDF5DC';
  ctx.fill();
  ctx.strokeStyle = LIGHT_GOLD;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Top arc decoration
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.60, Math.PI, 0);
  ctx.strokeStyle = '#C9943A';
  ctx.lineWidth = 5;
  ctx.stroke();

  // 8-pointed star emblem
  const starPoints = 8;
  const outerR = r * 0.30;
  const innerR = r * 0.14;
  ctx.beginPath();
  for (let i = 0; i < starPoints * 2; i++) {
    const angle = (i * Math.PI) / starPoints - Math.PI / 2;
    const rad   = i % 2 === 0 ? outerR : innerR;
    const px    = cx + Math.cos(angle) * rad;
    const py    = cy + Math.sin(angle) * rad - r * 0.10;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = GOLD;
  ctx.fill();

  // "CERTIFIED" text
  ctx.font         = `700 ${Math.round(r * 0.165)}px "Sarabun", "Noto Sans Thai", Arial`;
  ctx.fillStyle    = XCMG_BLUE;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CERTIFIED', cx, cy + r * 0.40);

  // "XCMG" text
  ctx.font      = `700 ${Math.round(r * 0.195)}px "Sarabun", "Noto Sans Thai", Arial`;
  ctx.fillStyle = XCMG_BLUE;
  ctx.fillText('XCMG', cx, cy + r * 0.60);
}

// ─── Build the full certificate canvas ───────────────────────────
async function buildCertCanvas({ fullName, empInfo, certNumber, certDate, signatureUrl }, scaleFactor = 1) {
  await loadFonts();

  const signedSigUrl = await toSignedUrl(signatureUrl);

  // A4 landscape — ลดขนาดสำหรับ mobile เพื่อหลีกเลี่ยง memory limit
  const W  = Math.round(3508 * scaleFactor);
  const H  = Math.round(2480 * scaleFactor);
  const cx = W / 2;

  const canvas  = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx     = canvas.getContext('2d');

  // Scale ทุกอย่างตาม scaleFactor โดยไม่ต้องแก้ค่าพิกัดทีละจุด
  ctx.scale(scaleFactor, scaleFactor);

  const FONT = '"Sarabun", "Noto Sans Thai", Arial, sans-serif';

  // 1. Cream background
  ctx.fillStyle = BG_CREAM;
  ctx.fillRect(0, 0, W, H);

  // 2. Outer gold double border
  const PAD = 60;
  ctx.strokeStyle = BORDER_GOLD;
  ctx.lineWidth   = 14;
  roundRect(ctx, PAD, PAD, W - PAD * 2, H - PAD * 2, 28);
  ctx.stroke();

  ctx.strokeStyle = BORDER_GOLD;
  ctx.lineWidth   = 4;
  roundRect(ctx, PAD + 32, PAD + 32, W - (PAD + 32) * 2, H - (PAD + 32) * 2, 18);
  ctx.stroke();

  // 3. Inner white card
  const CP = 120;   // card padding
  ctx.fillStyle   = '#FFFFFF';
  roundRect(ctx, CP, CP, W - CP * 2, H - CP * 2, 40);
  ctx.fill();
  ctx.strokeStyle = '#E8E0D0';
  ctx.lineWidth   = 4;
  ctx.stroke();

  // 4. Gold top banner "CERTIFICATE OF COMPLETION"
  const BH = 132;  // banner height
  const BY = CP;
  ctx.beginPath();
  ctx.moveTo(CP + 40, BY);
  ctx.lineTo(W - CP - 40, BY);
  ctx.quadraticCurveTo(W - CP, BY, W - CP, BY + 40);
  ctx.lineTo(W - CP, BY + BH);
  ctx.lineTo(CP, BY + BH);
  ctx.lineTo(CP, BY + 40);
  ctx.quadraticCurveTo(CP, BY, CP + 40, BY);
  ctx.closePath();
  ctx.fillStyle = GOLD;
  ctx.fill();

  ctx.font          = `700 64px ${FONT}`;
  ctx.fillStyle     = '#FFFFFF';
  ctx.textAlign     = 'center';
  ctx.textBaseline  = 'middle';
  ctx.fillText('CERTIFICATE OF COMPLETION', cx, BY + BH / 2);

  // 5. Logo + brand name row
  const LY = BY + BH + 110;
  const LH = 230;
  const LW = LH;

  const logoImg = await loadImage(XCMG_LOGO_B64);
  if (logoImg) {
    ctx.drawImage(logoImg, cx - LW / 2 - 370, LY, LW, LH);
  }

  ctx.textAlign    = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = XCMG_BLUE;
  ctx.font         = `700 96px ${FONT}`;
  ctx.fillText('XCMG Thailand', cx - LW / 2 - 95, LY + LH * 0.34);

  ctx.font      = `400 56px ${FONT}`;
  ctx.fillStyle = TEXT_MID;
  ctx.fillText('XCMG KNOWLEDGE ACADEMY', cx - LW / 2 - 95, LY + LH * 0.72);

  // 6. "CERTIFICATE" heading
  const HY = LY + LH + 150;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = XCMG_BLUE;
  ctx.font         = `700 185px ${FONT}`;
  ctx.fillText('CERTIFICATE', cx, HY);

  ctx.font      = `400 70px ${FONT}`;
  ctx.fillStyle = TEXT_MID;
  ctx.fillText('CERTIFICATE OF COMPLETION', cx, HY + 148);

  // 7. "This is to certify that"
  const CY = HY + 295;
  ctx.font      = `400 66px ${FONT}`;
  ctx.fillStyle = TEXT_DARK;
  ctx.fillText('This is to certify that', cx, CY);

  // 8. Recipient name — large, XCMG blue, bold; supports Thai & English
  const NY = CY + 185;
  drawTextCentered(ctx, fullName || 'ชื่อผู้รับใบประกาศ', cx, NY, W - CP * 2 - 200, 205, '700', XCMG_BLUE, FONT);

  // 9. Employee ID | Department line
  const IY = NY + 195;
  ctx.font      = `400 62px ${FONT}`;
  ctx.fillStyle = TEXT_MID;
  ctx.textAlign = 'center';
  ctx.fillText(empInfo || '', cx, IY);

  // 10. Course info box (light blue)
  const BW = 1950;
  const BXH = 318;
  const BX  = cx - BW / 2;
  const BXY = IY + 135;

  roundRect(ctx, BX, BXY, BW, BXH, 26);
  ctx.fillStyle   = '#EBF3FC';
  ctx.fill();
  ctx.strokeStyle = '#B5D4F4';
  ctx.lineWidth   = 3;
  ctx.stroke();

  ctx.font         = `700 52px ${FONT}`;
  ctx.fillStyle    = '#185FA5';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('COURSE', cx, BXY + 88);

  ctx.font      = `700 72px ${FONT}`;
  ctx.fillStyle = XCMG_BLUE;
  ctx.fillText('XCMG Product Knowledge', cx, BXY + 190);

  ctx.font      = `400 52px ${FONT}`;
  ctx.fillStyle = TEXT_MID;
  ctx.fillText('XCMG Product Knowledge E-Learning', cx, BXY + 268);

  // 11. Body text
  const TY = BXY + BXH + 125;
  ctx.font      = `400 57px ${FONT}`;
  ctx.fillStyle = TEXT_DARK;
  ctx.fillText('has successfully completed the above course with diligence and dedication, demonstrating a', cx, TY);
  ctx.fillText('comprehensive understanding of XCMG product standards and operational practices as required.', cx, TY + 88);

  // 12. Bottom: Date | Medal | Signature
  const BOT = TY + 270;

  // Date of issue (left)
  ctx.textAlign    = 'left';
  ctx.textBaseline = 'top';
  ctx.font         = `700 46px ${FONT}`;
  ctx.fillStyle    = TEXT_MID;
  ctx.fillText('DATE OF ISSUE', CP + 200, BOT);

  ctx.font      = `700 80px ${FONT}`;
  ctx.fillStyle = XCMG_BLUE;
  ctx.fillText(formatThaiDate(certDate), CP + 200, BOT + 72);

  // Medal seal (centre)
  drawMedalSeal(ctx, cx, BOT + 135, 190);

  // Signature (right)
  const SX = W - CP - 200;
  if (signedSigUrl) {
    try {
      const sigImg = await loadImage(signedSigUrl);
      if (sigImg) {
        const SW = 490;
        const SH = 185;
        ctx.drawImage(sigImg, SX - SW, BOT - 20, SW, SH);
      }
    } catch { /* skip */ }
  }

  ctx.beginPath();
  ctx.moveTo(SX - 580, BOT + 180);
  ctx.lineTo(SX, BOT + 180);
  ctx.strokeStyle = '#CBD5E0';
  ctx.lineWidth   = 3;
  ctx.stroke();

  ctx.textAlign    = 'right';
  ctx.textBaseline = 'top';
  ctx.font         = `700 52px ${FONT}`;
  ctx.fillStyle    = TEXT_DARK;
  ctx.fillText('Training Director', SX, BOT + 196);

  ctx.font      = `400 46px ${FONT}`;
  ctx.fillStyle = TEXT_MID;
  ctx.fillText('XCMG Thailand Co., Ltd.', SX, BOT + 262);

  // 13. Divider + cert number
  const CNY = H - CP - 135;
  ctx.beginPath();
  ctx.moveTo(CP + 100, CNY - 28);
  ctx.lineTo(W - CP - 100, CNY - 28);
  ctx.strokeStyle = '#E2D9C8';
  ctx.lineWidth   = 2;
  ctx.stroke();

  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.font         = `400 50px ${FONT}`;
  ctx.fillStyle    = TEXT_MID;
  ctx.fillText(`Certificate No.: ${certNumber || '-'}`, cx, CNY + 28);

  return canvas;
}

// ─── Device detection helpers ─────────────────────────────────────
function isIOS()     { return /iphone|ipad|ipod/i.test(navigator.userAgent); }
function isAndroid() { return /android/i.test(navigator.userAgent); }
function isMobile()  { return isIOS() || isAndroid(); }
// scaleFactor สำหรับ mobile: ลดเหลือ 50% (~150 dpi) เพื่อประหยัด memory
// desktop ยังคง 100% (300 dpi)
function getScaleFactor() { return isMobile() ? 0.5 : 1; }

// ─── Canvas → Blob (Promise wrapper) ─────────────────────────────
function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      blob ? resolve(blob) : reject(new Error('สร้าง image blob ไม่สำเร็จ'));
    }, type, quality);
  });
}

// ─── Platform-aware download / share ─────────────────────────────
async function triggerDownload(blob, filename) {
  // 1. Web Share API — รองรับ iOS Safari, Android Chrome (แนะนำสำหรับ mobile)
  if (isMobile() && navigator.canShare?.({ files: [new File([blob], filename, { type: blob.type })] })) {
    try {
      await navigator.share({
        files: [new File([blob], filename, { type: blob.type })],
        title: 'ใบประกาศ XCMG',
      });
      return;
    } catch (err) {
      // ถ้า user ยกเลิก share หรือ error → fall through ไป method ถัดไป
      if (err.name === 'AbortError') return;
    }
  }

  // 2. Standard anchor download — ใช้ได้บน desktop และ Android Chrome
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
}

// ─── Export as PNG (ใช้ JPEG บน mobile เพื่อลดขนาดไฟล์) ─────────
async function exportAsPNG(userId, params) {
  const scale  = getScaleFactor();
  const canvas = await buildCertCanvas(params, scale);
  // mobile → JPEG (เล็กกว่า, load ไวกว่า), desktop → PNG (คมชัดกว่า)
  const [mimeType, ext, quality] = isMobile()
    ? ['image/jpeg', 'jpg', 0.90]
    : ['image/png',  'png', 1];
  const blob = await canvasToBlob(canvas, mimeType, quality);
  await triggerDownload(blob, `XCMG-Certificate-${userId}.${ext}`);
}

// ─── Export as PDF ────────────────────────────────────────────────
async function exportAsPDF(userId, params) {
  // mobile ใช้ PNG/JPEG แทน PDF เพราะ jsPDF หนักและ mobile browser เปิด PDF ได้ยาก
  if (isMobile()) return exportAsPNG(userId, params);

  const jsPDFLib = window.jspdf?.jsPDF ?? window.jsPDF;
  if (!jsPDFLib) return exportAsPNG(userId, params);

  const canvas  = await buildCertCanvas(params, 1);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const doc     = new jsPDFLib({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  doc.addImage(imgData, 'JPEG', 0, 0, 297, 210);
  doc.save(`XCMG-Certificate-${userId}.pdf`);
}

// ─── Public exports ───────────────────────────────────────────────

/**
 * downloadCertPDF
 * @param {string} userId
 * @param {string} fullName     — ชื่อ-นามสกุล (รองรับทั้งไทยและ Eng)
 * @param {string} empInfo      — "Employee ID: xxx | Department: yyy"
 * @param {string} certNumber   — เลขใบเซอร์ฯ
 * @param {string} certDate     — ISO date string
 * @param {string} signatureUrl — Supabase Storage URL ของลายเซ็น (optional)
 */
export async function downloadCertPDF(userId, fullName, empInfo, certNumber, certDate, signatureUrl) {
  try {
    const params = { fullName, empInfo, certNumber, certDate, signatureUrl };
    await exportAsPDF(userId, params);
  } catch (err) {
    console.error(err);
    alert('เกิดข้อผิดพลาดในการดาวน์โหลด: ' + err.message);
  }
}

/**
 * previewCertPDF — แสดงพรีวิวใบประกาศ
 * - Desktop: เปิด popup tab พร้อมปุ่มดาวน์โหลด
 * - Mobile:  แสดง inline ในหน้าเดิม (overlay) เพราะ popup ถูกบล็อก
 */
export async function previewCertPDF(userId, fullName, empInfo, certNumber, certDate, signatureUrl) {
  try {
    const params = { fullName, empInfo, certNumber, certDate, signatureUrl };
    const scale  = getScaleFactor();
    const canvas = await buildCertCanvas(params, scale);

    if (isMobile()) {
      // ── Mobile: แสดง overlay ในหน้าเดิม ──────────────────────────
      const existingOverlay = document.getElementById('cert-preview-overlay');
      if (existingOverlay) existingOverlay.remove();

      const imgData = canvas.toDataURL('image/jpeg', 0.88);

      const overlay = document.createElement('div');
      overlay.id = 'cert-preview-overlay';
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.85);
        display:flex;flex-direction:column;align-items:center;
        justify-content:flex-start;padding:16px;overflow-y:auto;
      `;

      overlay.innerHTML = `
        <div style="width:100%;max-width:700px;padding-top:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <span style="color:#fff;font-family:sans-serif;font-size:16px;font-weight:700">ใบประกาศ XCMG</span>
            <button id="cert-close-btn" style="background:rgba(255,255,255,.15);border:none;color:#fff;
              padding:8px 16px;border-radius:6px;font-size:14px;cursor:pointer">✕ ปิด</button>
          </div>
          <img src="${imgData}" alt="ใบประกาศ XCMG"
               style="width:100%;border-radius:6px;box-shadow:0 4px 24px rgba(0,0,0,.6);display:block">
          <button id="cert-dl-btn" style="width:100%;margin-top:14px;padding:14px;
            background:#1B3A6B;color:#fff;border:none;border-radius:8px;
            font-size:16px;font-family:sans-serif;cursor:pointer">
            ⬇ บันทึกรูปภาพ / แชร์
          </button>
        </div>
      `;

      document.body.appendChild(overlay);

      document.getElementById('cert-close-btn').onclick = () => overlay.remove();
      document.getElementById('cert-dl-btn').onclick = async () => {
        try {
          const blob = await canvasToBlob(canvas, 'image/jpeg', 0.90);
          await triggerDownload(blob, `XCMG-Certificate-${userId}.jpg`);
        } catch (e) { alert('ไม่สามารถบันทึกได้: ' + e.message); }
      };

    } else {
      // ── Desktop: เปิด popup tab ────────────────────────────────────
      const imgData = canvas.toDataURL('image/png');
      const win = window.open('', '_blank');
      if (!win) { alert('กรุณาอนุญาต Pop-up แล้วลองใหม่'); return; }
      win.document.write(`<!DOCTYPE html>
<html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>ใบประกาศ XCMG</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#111;display:flex;flex-direction:column;
         align-items:center;justify-content:center;min-height:100vh;padding:16px}
    img{max-width:100%;height:auto;border-radius:4px;box-shadow:0 4px 24px rgba(0,0,0,.6)}
    a{display:block;margin-top:14px;padding:10px 28px;background:#1B3A6B;
      color:#fff;text-decoration:none;border-radius:6px;font-family:sans-serif;
      font-size:15px;text-align:center}
  </style>
</head><body>
  <img src="${imgData}" alt="ใบประกาศ XCMG">
  <a href="${imgData}" download="XCMG-Certificate-${userId}.png">⬇ ดาวน์โหลด PNG</a>
</body></html>`);
      win.document.close();
    }
  } catch (err) {
    console.error(err);
    alert('ไม่สามารถเปิดพรีวิวได้: ' + err.message);
  }
}
