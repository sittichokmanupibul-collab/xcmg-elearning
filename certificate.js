import { supabase } from './supabase.js';

const XCMG_BLUE = '#1B3A6B';
const TEXT_DARK  = '#2C3E50';

// โลโก้ XCMG Thailand (ภาพที่ผู้ใช้แนบมา)
const XCMG_LOGO_B64 = 'data:image/webp;base64,UklGRuwEAABXRUJQVlA4IOAEAAAQHQCdASo7ADgAPhUIg0EhBz6dqgQAUS2AFiSoL8A/ADrGHwcR/Fz9ZP850NerncT9qv87inH177O/dX/M/sA7QD9B/0u/kXsq9AD9bv6h/APfA/gHUAfqb///3/7gD9gPYA8or9dPgj/tn+A9In//3mp9A+lXp9fWP9gMuV9P4Qdpr7Vfxmy5LTJfzL+2/l5zAxzX9r/xP3Ieyb8g/tn+X/Lv6BP41/O/8j+af9g7+f66ewn+qR/v639ucMYnBcmxyhNOIP6kfY9jbQCdI47+2zNJQDPPibEgmwCvYbGvNO8zeiIb2KP3IHi9OCPEIcEAAP7/GlpiP12sSZtHaVf5O/zb0S3PAtHizWIB/vurR3Ybw+c61uBCH69ue1sfzlOADwjQWeZnY0fnB0jaXoKC+Emi+gcFXZXTJht/8JXl9+PSj8DgL9hMYJCy3ZN9DqMs0boZ8A3UA2HgZXY34cHjl9eX747DSq2EdicjI+UwqB9N81PoFYK9Kyi6b2xKi/wRO0Z4o8l712ZWent3u2945E5LOLQe96iJXtFIUe0L7NZg1tF+ih0OIb0yatz/AsDUjf6erv/+vf8txsC2Ou2Dn9IZj//TEQzPw2SZD2Iba7yHgqVJYv2yFNiR/Co0lJ1EMZlH/6ByVHBKVEBMSRhO+5ie6OFxJe7Pv3R4/N7ZHvq09o140v4+afcttQ1AtK/AtrOVsq55P52Rpg7wMoKE2INh2f5sbsZYgsOMypSIoyhO2fEtNuZpoqnibeMO5M31I7P0CEHxn2TpKRTJc5nrKxvhTB8pGNpzHUgup2D9CnmW/MTUbbYDO9HQUp/516nMVOL8nqwCNn9xOtyzLq1bN5r31n0ah/FaGU6Rg3iWauEQ6swfraW7GeLZTr5MUFRwKe/HdpnU14Yqrup2NxtINav13StnciMAgVDm0fWzDB8osrnWYeMoYW4gSawiLaVdU5tpNx3uis5X5fHk4HzNUGiIGguOkMHKeeFnmCZmYcq4iICH8RAnxnd3BBDNQxMyGAcBx9sc2IICgoju5LtxNUoa7+Lzn2aO/8QBydw6YG5YKF/uGNVTWG0dff4JRgoXbuOPNzSUFxTS1aBDattZcxlvd8jrFV4oEJWhj6EqT54sgv9snFKMrHv8f2U3GWSZx2P5eZsBq1DHUKBIooeOvS9cDDzC1wLizg+pX5PFzHfqcNaesPwbCNLKHsMTMeExpCzu/WhzJvfAdMfbpqzCBKEoxZOoxYclhjy0LpO6TNpg+LeOOgC8PJbrnUI8eIMqc107C+MdPUS4KdzSPyT42Izs2Aox8oio/7f/4m34ejpRxMjjRhzeBnS6/TAht5skDLi8ZUe7BCdv//epLCXaTwVnLoe5//8M69MTxAVdCbsUFkmQoo7vR1cP//5UI0fSwWCZ7h6cXvRYSds9RcvmwHY2dW/ntWjSotmobmk1bAOA5KJ/U+Mjpn8hD716JqgHu0DlCuTDpQqa/vIDiPaeSGkuWymu8Qs0BHUBtWw/v3v8D8c8MJU8Nbvw2sVCrzsaf39mjVf//1eIsTU6DdQEAW878/Lp/6pyv5jyavSVoKY0Vr//pLnSD7+v1uXyU+1ALUp7XLeLf2umtgcEJ2zFbAwiogvNiEbPu+58I0GXTH1Ro8JryocZqap3iZMAAAA=';

function formatThaiDate(dateString) {
  const thaiMonths = [
    'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน',
    'พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม',
    'กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
  ];
  const date = dateString ? new Date(dateString) : new Date();
  return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
}

const CERT_FONT_FAMILY = 'Sarabun, Noto Sans Thai, Arial, sans-serif';

async function loadCertFonts() {
  if (!window.document?.fonts?.ready) return;
  await document.fonts.ready;
  if (document.fonts.load) {
    await Promise.all([
      document.fonts.load('400 16px Sarabun'),
      document.fonts.load('700 16px Sarabun'),
      document.fonts.load('400 16px Noto Sans Thai'),
      document.fonts.load('700 16px Noto Sans Thai'),
    ]).catch(() => {});
  }
}

// loadImage — รองรับทั้ง base64 data URL และ URL ภายนอก (Supabase Storage)
// กรณี URL ภายนอก: fetch เป็น blob ก่อนเพื่อหลีกเลี่ยงปัญหา CORS canvas taint
async function loadImage(src) {
  // data URL (base64) — โหลดตรงได้เลย ไม่มีปัญหา CORS
  if (src.startsWith('data:')) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = () => reject(new Error('โหลด base64 image ไม่สำเร็จ'));
      img.src = src;
    });
  }

  // URL ภายนอก — fetch เป็น blob ก่อน แล้วสร้าง object URL
  // วิธีนี้หลีกเลี่ยง canvas taint และ CORS error ได้ในกรณีที่ server อนุญาต
  try {
    const resp = await fetch(src);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const blob    = await resp.blob();
    const objUrl  = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(objUrl);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        reject(new Error(`โหลดภาพไม่สำเร็จ: ${src.slice(0, 80)}`));
      };
      img.src = objUrl;
    });
  } catch (fetchErr) {
    // fetch ไม่สำเร็จ (เช่น CORS block fetch ด้วย) → fallback crossOrigin img tag
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload  = () => resolve(img);
      img.onerror = () => reject(new Error(
        `โหลดภาพแม่แบบไม่สำเร็จ กรุณาตรวจสอบ CORS ใน Supabase Storage: ${src.slice(0, 80)}`
      ));
      img.src = src + (src.includes('?') ? '&' : '?') + 't=' + Date.now();
    });
  }
}

function renderTextToDataUrl(text, options = {}) {
  const {
    width = 1800, height = 200,
    fontFamily = CERT_FONT_FAMILY,
    fontWeight = 'bold',
    color = XCMG_BLUE,
    maxLineWidth = 1700,
    initialFontSize = 72,
  } = options;

  const dpr = 2;
  const canvas = document.createElement('canvas');
  canvas.width  = width  * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle    = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign    = 'center';

  let fontSize = initialFontSize;
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  while (ctx.measureText(text).width > maxLineWidth && fontSize > 24) {
    fontSize -= 2;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  }
  ctx.fillText(text, width / 2, height / 2);
  return canvas.toDataURL('image/png');
}

// ─────────────────────────────────────────────────────────────────
// แปลง Supabase Storage public URL → signed URL (60 วินาที)
// แก้ปัญหา CORS ที่ทำให้ canvas ถูก taint และ toDataURL() ล้มเหลว
// ─────────────────────────────────────────────────────────────────
async function toSignedUrl(publicUrl) {
  if (!publicUrl) return null;
  try {
    const url   = new URL(publicUrl);
    const parts = url.pathname.split('/');
    // Supabase public URL: /storage/v1/object/public/<bucket>/<path>
    const bucketIdx = parts.indexOf('public');
    if (bucketIdx === -1) return publicUrl;
    const bucket   = parts[bucketIdx + 1];
    const filePath = parts.slice(bucketIdx + 2).join('/');
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 60);
    if (error || !data?.signedUrl) return publicUrl;
    return data.signedUrl;
  } catch {
    return publicUrl;
  }
}

// ─────────────────────────────────────────────────────────────────
// Build the full certificate as an HTML Canvas (A4 landscape @2×)
// ─────────────────────────────────────────────────────────────────
async function buildCertCanvas({ fullName, empInfo, certDate, templateUrl, signatureUrl }) {
  await loadCertFonts();

  // แปลงเป็น signed URL เพื่อหลีกเลี่ยง CORS (canvas taint)
  const resolvedTemplateUrl  = await toSignedUrl(templateUrl);
  const resolvedSignatureUrl = await toSignedUrl(signatureUrl);

  const W  = 2970;   // 297 mm × 10
  const H  = 2100;   // 210 mm × 10
  const cx = W / 2;

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. Background template
  if (resolvedTemplateUrl) {
    const tpl = await loadImage(resolvedTemplateUrl);
    ctx.drawImage(tpl, 0, 0, W, H);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
  }

  // 2. Watermark — XCMG logo, 45 % opacity, centred
  {
    const logo = await loadImage(XCMG_LOGO_B64);
    const wmW  = W * 0.55;
    const wmH  = wmW * (logo.naturalHeight / logo.naturalWidth);
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.drawImage(logo, (W - wmW) / 2, (H - wmH) / 2, wmW, wmH);
    ctx.restore();
  }

  // 3. Logo top area — new XCMG Thailand logo
  {
    const logo = await loadImage(XCMG_LOGO_B64);
    const lW   = 380;
    const lH   = lW * (logo.naturalHeight / logo.naturalWidth);
    ctx.drawImage(logo, cx - lW / 2, 55, lW, lH);
  }

  // 4. Full name
  if (fullName) {
    const nameImg = await loadImage(renderTextToDataUrl(fullName, {
      width: 2400, height: 300, initialFontSize: 96,
      color: XCMG_BLUE, fontWeight: 'bold',
    }));
    const nW = 3600, nH = 450;
    ctx.drawImage(nameImg, cx - nW / 2, 1080, nW, nH);
  }

  // 5. Employee info
  if (empInfo) {
    const infoImg = await loadImage(renderTextToDataUrl(empInfo, {
      width: 2400, height: 180, initialFontSize: 42,
      color: TEXT_DARK, fontWeight: 'normal',
    }));
    ctx.drawImage(infoImg, cx - 1500, 1340, 3000, 225);
  }

  // 6. Date
  const dateImg = await loadImage(renderTextToDataUrl(
    `ให้ไว้ ณ วันที่ ${formatThaiDate(certDate)}`,
    { width: 2400, height: 180, initialFontSize: 45, color: TEXT_DARK, fontWeight: 'normal' }
  ));
  ctx.drawImage(dateImg, cx - 1350, 1530, 2700, 195);

  // 7. Signature
  if (resolvedSignatureUrl) {
    const sig = await loadImage(resolvedSignatureUrl);
    ctx.drawImage(sig, 2050, 1590, 675, 270);
  }

  return canvas;
}

// ─────────────────────────────────────────────────────────────────
// Cross-platform download
// ─────────────────────────────────────────────────────────────────
function triggerDownload(blob, filename) {
  const url      = URL.createObjectURL(blob);
  const isIOS    = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isIOS || isSafari) {
    // iOS Safari: open blob in new tab — user presses long-tap → Save
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } else {
    const a = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

// PNG path — works on every platform
async function exportAsPNG(userId, params) {
  const canvas = await buildCertCanvas(params);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) return reject(new Error('สร้าง PNG ไม่สำเร็จ'));
      triggerDownload(blob, `XCMG-Certificate-${userId}.png`);
      resolve();
    }, 'image/png');
  });
}

// PDF path — desktop with jsPDF loaded; falls back to PNG
async function exportAsPDF(userId, params) {
  const jsPDFLib = window.jspdf?.jsPDF ?? window.jsPDF;
  if (!jsPDFLib) return exportAsPNG(userId, params);

  const canvas  = await buildCertCanvas(params);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const doc     = new jsPDFLib({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  doc.addImage(imgData, 'JPEG', 0, 0, 297, 210);

  const isAndroid = /android/i.test(navigator.userAgent);
  const isIOS     = /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (isIOS || isAndroid) {
    window.open(doc.output('bloburl'), '_blank');
  } else {
    doc.save(`XCMG-Certificate-${userId}.pdf`);
  }
}

// ─────────────────────────────────────────────────────────────────
// Public exports
// ─────────────────────────────────────────────────────────────────

/**
 * downloadCertPDF — ดาวน์โหลดใบประกาศ
 *   Desktop      → PDF (หรือ PNG ถ้าไม่มี jsPDF)
 *   iOS/Android  → PNG เปิดใน tab ใหม่ (กดค้าง → บันทึก)
 */
export async function downloadCertPDF(userId, fullName, empInfo, certDate, templateUrl, signatureUrl) {
  try {
    const params   = { fullName, empInfo, certDate, templateUrl, signatureUrl };
    const isIOS    = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isAndroid = /android/i.test(navigator.userAgent);

    if (isIOS || isAndroid) {
      await exportAsPNG(userId, params);
    } else {
      await exportAsPDF(userId, params);
    }
  } catch (err) {
    console.error(err);
    alert('เกิดข้อผิดพลาดในการดาวน์โหลด: ' + err.message);
  }
}

/**
 * previewCertPDF — เปิดพรีวิวในแท็บใหม่ (ทุกแพลตฟอร์ม)
 */
export async function previewCertPDF(userId, fullName, empInfo, certDate, templateUrl, signatureUrl) {
  try {
    const params  = { fullName, empInfo, certDate, templateUrl, signatureUrl };
    const canvas  = await buildCertCanvas(params);
    const imgData = canvas.toDataURL('image/png');
    const win     = window.open('', '_blank');
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
      color:#fff;text-decoration:none;border-radius:6px;font-family:sans-serif;font-size:15px}
  </style>
</head><body>
  <img src="${imgData}" alt="ใบประกาศ">
  <a href="${imgData}" download="XCMG-Certificate-${userId}.png">⬇ ดาวน์โหลด PNG</a>
</body></html>`);
    win.document.close();
  } catch (err) {
    console.error(err);
    alert('ไม่สามารถเปิดพรีวิวได้: ' + err.message);
  }
}
