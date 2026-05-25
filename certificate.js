import { supabase } from './supabase.js';

const XCMG_BLUE = '#1B3A6B';
const TEXT_DARK  = '#2C3E50';

// โลโก้ XCMG Thailand (ภาพที่ผู้ใช้แนบมา)
const XCMG_LOGO_B64 = 'data:image/jpeg;base64,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';

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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`โหลดภาพไม่สำเร็จ: ${src.slice(0, 60)}`));
    img.src = src;
  });
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
// Build the full certificate as an HTML Canvas (A4 landscape @2×)
// ─────────────────────────────────────────────────────────────────
async function buildCertCanvas({ fullName, empInfo, certDate, templateUrl, signatureUrl }) {
  await loadCertFonts();

  const W  = 2970;   // 297 mm × 10
  const H  = 2100;   // 210 mm × 10
  const cx = W / 2;

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. Background template
  if (templateUrl) {
    const tpl = await loadImage(templateUrl);
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
  if (signatureUrl) {
    const sig = await loadImage(signatureUrl);
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
