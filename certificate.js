// certificate.js — สร้าง PDF ใบเซอร์จากภาพต้นฉบับ
import { supabase } from './supabase.js';

// ── สีโลโก้ XCMG (น้ำเงินเข้ม) ─────────────────────────────────────────────
const XCMG_BLUE = '#1B3A6B';

// ── แปลงวันที่เป็นรูปแบบไทย เช่น "22 พฤษภาคม 2568" ─────────────────────────
function formatThaiDate(date = new Date()) {
  const thaiMonths = [
    'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน',
    'พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม',
    'กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'
  ];
  const d = date.getDate();
  const m = thaiMonths[date.getMonth()];
  const y = date.getFullYear() + 543; // ค.ศ. → พ.ศ.
  return `${d} ${m} ${y}`;
}

const CERT_FONT_FAMILY = 'Noto Sans Thai, Sarabun, Arial, sans-serif';

async function loadCertFonts() {
  if (!window.document?.fonts?.ready) return
  await document.fonts.ready
  if (document.fonts.load) {
    await Promise.all([
      document.fonts.load('400 16px Noto Sans Thai'),
      document.fonts.load('700 16px Noto Sans Thai'),
      document.fonts.load('400 16px Sarabun'),
      document.fonts.load('700 16px Sarabun'),
    ]).catch(() => {})
  }
}

function renderTextToDataUrl(text, options = {}) {
  const {
    width = 1600,
    height = 220,
    fontFamily = CERT_FONT_FAMILY,
    fontWeight = 'bold',
    color = XCMG_BLUE,
    maxLineWidth = 1480,
    initialFontSize = 72,
    minFontSize = 28,
    lineHeightFactor = 1.2,
  } = options;

  const canvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  let fontSize = initialFontSize;
  const setFont = () => { ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`; };
  setFont();

  const wrapText = (value) => {
    const lines = [''];
    const chunks = value.split(/(\s+)/);

    for (const chunk of chunks) {
      const testLine = lines[lines.length - 1] + chunk;
      if (ctx.measureText(testLine).width <= maxLineWidth) {
        lines[lines.length - 1] = testLine;
      } else {
        const currentLine = lines[lines.length - 1].trim();
        if (currentLine) lines[lines.length - 1] = currentLine;
        if (ctx.measureText(chunk.trim()).width <= maxLineWidth) {
          lines.push(chunk.trim());
        } else {
          let buffer = '';
          for (const char of chunk) {
            const testBuffer = buffer + char;
            if (ctx.measureText(testBuffer).width <= maxLineWidth) {
              buffer = testBuffer;
            } else {
              if (buffer) lines.push(buffer);
              buffer = char;
            }
          }
          if (buffer) lines.push(buffer.trim());
        }
      }
    }

    return lines.filter((line) => line.length > 0);
  };

  let lines = wrapText(text);
  while ((lines.length > 2 || lines.some(line => ctx.measureText(line).width > maxLineWidth)) && fontSize > minFontSize) {
    fontSize -= 2;
    setFont();
    lines = wrapText(text);
  }

  const lineHeight = fontSize * lineHeightFactor;
  const totalHeight = lineHeight * lines.length;
  const startY = height / 2 - totalHeight / 2 + lineHeight / 2;

  setFont();
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });

  return canvas.toDataURL('image/png');
}

// ── ฟังก์ชันหลัก: สร้าง PDF โดยวางภาพใบเซอร์เป็น background ───────────────
async function generateCertPDF({ fullName, certDate, templateUrl }) {
  const jsPDFLib = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  if (!jsPDFLib) throw new Error('jsPDF ไม่ได้โหลด');
  await loadCertFonts()

  const doc = new jsPDFLib({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',   // 297 × 210 mm
  });

  // ── โหลดภาพ template แล้วแปลงเป็น base64 ─────────────────────────────────
  if (templateUrl) {
    const imgData = await fetchImageAsBase64(templateUrl);
    // วางภาพเต็มหน้า (297 × 210 mm)
    doc.addImage(imgData, 'PNG', 0, 0, 297, 210);
  }

  // ── วางชื่อ-นามสกุล ──────────────────────────────────────────────────────
  // ตำแหน่ง Y ≈ 103 mm (ช่องว่างกลางใบเซอร์ ระหว่างบรรทัด "ขอมอบ..." กับ "ได้ผ่านการอบรม...")
  if (fullName) {
    const nameImage = renderTextToDataUrl(fullName, {
      width: 1600,
      height: 260,
      fontFamily: CERT_FONT_FAMILY,
      fontWeight: 'bold',
      color: XCMG_BLUE,
      maxLineWidth: 1400,
      initialFontSize: 72,
      minFontSize: 26,
    });
    const imageWidthMm = 220;
    const imageHeightMm = 30;
    const imageX = (297 - imageWidthMm) / 2;
    const imageY = 92;
    doc.addImage(nameImage, 'PNG', imageX, imageY, imageWidthMm, imageHeightMm);
  } else {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(XCMG_BLUE);
    doc.text('-', 148.5, 103, { align: 'center' });
  }

  // ── วางวันที่ ─────────────────────────────────────────────────────────────
  // ตำแหน่ง Y ≈ 148 mm (หลังบรรทัด "ให้ไว้ ณ วันที่")
  const dateText = certDate
    ? formatThaiDate(new Date(certDate))
    : formatThaiDate();

  const dateImage = renderTextToDataUrl(dateText, {
    width: 1600,
    height: 120,
    fontFamily: CERT_FONT_FAMILY,
    fontWeight: 'normal',
    color: XCMG_BLUE,
    maxLineWidth: 1480,
    initialFontSize: 16,
    minFontSize: 10,
    lineHeightFactor: 1.2,
  });
  doc.addImage(dateImage, 'PNG', 18.5, 143, 260, 10);

  return doc;
}

// ── helper: โหลดภาพ URL → base64 string ────────────────────────────────────
function fetchImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('โหลดภาพ template ไม่สำเร็จ'));
    img.src = url;
  });
}

// ── export: ดาวน์โหลด PDF ──────────────────────────────────────────────────
// params:
//   userId      — uuid ของผู้ใช้
//   fullName    — ชื่อ-นามสกุล (ไทยหรืออังกฤษ)
//   certDate    — วันที่ออกใบเซอร์ (ISO string) ถ้าไม่ส่งจะใช้วันนี้
//   templateUrl — URL หรือ path ของภาพใบเซอร์ต้นฉบับ
export async function downloadCertPDF(userId, fullName, certDate, templateUrl) {
  try {
    const doc = await generateCertPDF({ fullName, certDate, templateUrl });
    const fileName = `XCMG-Certificate-${userId}.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error('PDF Download Error:', err);
    alert('ไม่สามารถสร้าง PDF ได้: ' + err.message);
  }
}

// ── export: เปิด PDF ใน tab ใหม่ (preview) ─────────────────────────────────
export async function previewCertPDF(userId, fullName, certDate, templateUrl) {
  try {
    const doc = await generateCertPDF({ fullName, certDate, templateUrl });
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  } catch (err) {
    console.error('PDF Preview Error:', err);
    alert('ไม่สามารถแสดงตัวอย่าง PDF ได้: ' + err.message);
  }
}

// ── export: คืนค่า Blob URL (สำหรับ embed ใน <iframe>) ─────────────────────
export async function getCertBlobUrl(userId, fullName, certDate, templateUrl) {
  const doc = await generateCertPDF({ fullName, certDate, templateUrl });
  return doc.output('bloburl');
}

// ── ตัวอย่างการเรียกใช้ใน main.js ─────────────────────────────────────────
//
// import { downloadCertPDF } from './certificate.js';
//
// const CERT_TEMPLATE_URL = '/assets/cert-template.png'; // ← เปลี่ยนเป็น path ที่แท้จริง
//
// // เรียกหลังจาก Post-Test ผ่าน
// const { data: { user } } = await supabase.auth.getUser();
// const { data: profile }  = await supabase
//   .from('users').select('full_name, certificates(issued_at)')
//   .eq('id', user.id).single();
//
// await downloadCertPDF(
//   user.id,
//   profile.full_name,
//   profile.certificates?.[0]?.issued_at,  // วันที่ออกใบเซอร์จากฐานข้อมูล
//   CERT_TEMPLATE_URL
// );
