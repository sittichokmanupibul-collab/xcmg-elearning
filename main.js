import { supabase } from './supabase.js'

// ════════════════════════════════════════════════════════════════════════════
// ██  CONFIG  ██
// ════════════════════════════════════════════════════════════════════════════

const CERT_TEMPLATE_URL = '/assets/cert-template.png';
const SIGNATURE_URL     = '/assets/signature.png';
const XCMG_LOGO_B64 = 'data:image/webp;base64,UklGRuwEAABXRUJQVlA4IOAEAAAQHQCdASo7ADgAPhUIg0EhBz6dqgQAUS2AFiSoL8A/ADrGHwcR/Fz9ZP850NerncT9qv87inH177O/dX/M/sA7QD9B/0u/kXsq9AD9bv6h/APfA/gHUAfqb///3/7gD9gPYA8or9dPgj/tn+A9In//3mp9A+lXp9fWP9gMuV9P4Qdpr7Vfxmy5LTJfzL+2/l5zAxzX9r/xP3Ieyb8g/tn+X/Lv6BP41/O/8j+af9g7+f66ewn+qR/v639ucMYnBcmxyhNOIP6kfY9jbQCdI47+2zNJQDPPibEgmwCvYbGvNO8zeiIb2KP3IHi9OCPEIcEAAP7/GlpiP12sSZtHaVf5O/zb0S3PAtHizWIB/vurR3Ybw+c61uBCH69ue1sfzlOADwjQWeZnY0fnB0jaXoKC+Emi+gcFXZXTJht/8JXl9+PSj8DgL9hMYJCy3ZN9DqMs0boZ8A3UA2HgZXY34cHjl9eX747DSq2EdicjI+UwqB9N81PoFYK9Kyi6b2xKi/wRO0Z4o8l712ZWent3u2945E5LOLQe96iJXtFIUe0L7NZg1tF+ih0OIb0yatz/AsDUjf6erv/+vf8txsC2Ou2Dn9IZj//TEQzPw2SZD2Iba7yHgqVJYv2yFNiR/Co0lJ1EMZlH/6ByVHBKVEBMSRhO+5ie6OFxJe7Pv3R4/N7ZHvq09o140v4+afcttQ1AtK/AtrOVsq55P52Rpg7wMoKE2INh2f5sbsZYgsOMypSIoyhO2fEtNuZpoqnibeMO5M31I7P0CEHxn2TpKRTJc5nrKxvhTB8pGNpzHUgup2D9CnmW/MTUbbYDO9HQUp/516nMVOL8nqwCNn9xOtyzLq1bN5r31n0ah/FaGU6Rg3iWauEQ6swfraW7GeLZTr5MUFRwKe/HdpnU14Yqrup2NxtINav13StnciMAgVDm0fWzDB8osrnWYeMoYW4gSawiLaVdU5tpNx3uis5X5fHk4HzNUGiIGguOkMHKeeFnmCZmYcq4iICH8RAnxnd3BBDNQxMyGAcBx9sc2IICgoju5LtxNUoa7+Lzn2aO/8QBydw6YG5YKF/uGNVTWG0dff4JRgoXbuOPNzSUFxTS1aBDattZcxlvd8jrFV4oEJWhj6EqT54sgv9snFKMrHv8f2U3GWSZx2P5eZsBq1DHUKBIooeOvS9cDDzC1wLizg+pX5PFzHfqcNaesPwbCNLKHsMTMeExpCzu/WhzJvfAdMfbpqzCBKEoxZOoxYclhjy0LpO6TNpg+LeOOgC8PJbrnUI8eIMqc107C+MdPUS4KdzSPyT42Izs2Aox8oio/7f/4m34ejpRxMjjRhzeBnS6/TAht5skDLi8ZUe7BCdv//epLCXaTwVnLoe5//8M69MTxAVdCbsUFkmQoo7vR1cP//5UI0fSwWCZ7h6cXvRYSds9RcvmwHY2dW/ntWjSotmobmk1bAOA5KJ/U+Mjpn8hD716JqgHu0DlCuTDpQqa/vIDiPaeSGkuWymu8Qs0BHUBtWw/v3v8D8c8MJU8Nbvw2sVCrzsaf39mjVf//1eIsTU6DdQEAW878/Lp/6pyv5jyavSVoKY0Vr//pLnSD7+v1uXyU+1ALUp7XLeLf2umtgcEJ2zFbAwiogvNiEbPu+58I0GXTH1Ro8JryocZqap3iZMAAAA=';


const XCMG_BLUE = '#1B3A6B';
const TEXT_DARK = '#2C3E50';

function extractYouTubeId(input) {
  if (!input) return ''
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /embed\/([^?&#]+)/,
  ]
  for (const re of patterns) {
    const m = input.match(re)
    if (m) return m[1]
  }
  return input.trim()
}

const EPISODE_VIDEO_IDS = {
  1: 'VJkImB3ZC2Y',
  2: 'VJkImB3ZC2Y',
  3: 'VJkImB3ZC2Y',
  4: 'VJkImB3ZC2Y'
};

const EPISODE_TITLES = {
  1: '100 XCMG Autonomous Electric Mining Trucks',
  2: 'ตอนที่ 2',
  3: 'ตอนที่ 3',
  4: 'ตอนที่ 4'
};

const PRE_QUESTIONS = [
  {
    question_text: 'XCMG ก่อตั้งขึ้นในปีใด?',
    options: ['พ.ศ. 2532 (ค.ศ. 1989)', 'พ.ศ. 2513 (ค.ศ. 1970)', 'พ.ศ. 2543 (ค.ศ. 2000)', 'พ.ศ. 2523 (ค.ศ. 1980)'],
    correct_index: 0,
  },
  {
    question_text: 'XCMG ย่อมาจากอะไร?',
    options: ['Xuzhou Construction Machinery Group', 'Xinhua Civil Machine Group', 'Xian Construction Motor Group', 'Xuzhou China Motor Group'],
    correct_index: 0,
  },
  {
    question_text: 'ผลิตภัณฑ์หลักของ XCMG อยู่ในกลุ่มใด?',
    options: ['เครื่องใช้ไฟฟ้า', 'เครื่องจักรก่อสร้าง', 'ยานยนต์นั่งส่วนบุคคล', 'อุปกรณ์อิเล็กทรอนิกส์'],
    correct_index: 1,
  },
  {
    question_text: 'XCMG อยู่ในอันดับที่เท่าไหร่ของผู้ผลิตเครื่องจักรก่อสร้างระดับโลก?',
    options: ['อันดับ 1', 'อันดับ 3', 'อันดับ 5', 'อันดับ 10'],
    correct_index: 1,
  },
  {
    question_text: 'สำนักงานใหญ่ของ XCMG ตั้งอยู่ที่เมืองใด?',
    options: ['ปักกิ่ง', 'เซี่ยงไฮ้', 'ซูโจว', 'กวางโจว'],
    correct_index: 2,
  },
  {
    question_text: 'ก่อนรับชมบทเรียน คุณเคยใช้งานเครื่องจักร XCMG มาก่อนหรือไม่?',
    options: ['ใช้งานประจำ', 'เคยใช้บ้าง', 'เคยเห็นแต่ไม่เคยใช้', 'ไม่เคยเลย'],
    correct_index: 3,
  },
  {
    question_text: 'ข้อใดเป็นสิ่งสำคัญที่สุดก่อนเริ่มใช้งานเครื่องจักร?',
    options: ['เติมน้ำมันเชื้อเพลิงให้เต็ม', 'อ่านคู่มือและตรวจสอบความปลอดภัย', 'สตาร์ทเครื่องทดสอบ', 'โทรแจ้งหัวหน้างาน'],
    correct_index: 1,
  },
  {
    question_text: 'ระบบไฮดรอลิกในเครื่องจักรก่อสร้างทำหน้าที่อะไร?',
    options: ['ระบายความร้อนเครื่องยนต์', 'ส่งกำลังและควบคุมการเคลื่อนที่', 'กรองอากาศเข้าเครื่องยนต์', 'ลดการสั่นสะเทือน'],
    correct_index: 1,
  },
  {
    question_text: 'ควรตรวจสอบระดับน้ำมันไฮดรอลิกเมื่อใด?',
    options: ['ทุก 6 เดือน', 'ทุกปี', 'ก่อนและหลังการใช้งานทุกครั้ง', 'เฉพาะเมื่อเกิดปัญหา'],
    correct_index: 2,
  },
  {
    question_text: 'เมื่อเกิดเหตุฉุกเฉินกับเครื่องจักร ควรทำอะไรเป็นอันดับแรก?',
    options: ['โทรหาช่าง', 'ดับเครื่องและออกจากพื้นที่อันตราย', 'พยายามแก้ไขด้วยตนเอง', 'แจ้งประกันภัย'],
    correct_index: 1,
  },
]

const POST_QUESTIONS = [
  {
    question_text: 'XCMG มีจำนวนพนักงานทั่วโลกประมาณเท่าใด?',
    options: ['มากกว่า 5,000 คน', 'มากกว่า 20,000 คน', 'มากกว่า 50,000 คน', 'มากกว่า 100,000 คน'],
    correct_index: 2,
  },
  {
    question_text: 'เทคโนโลยี Intelligent Construction ของ XCMG ช่วยในด้านใด?',
    options: ['ลดราคาเครื่องจักร', 'เพิ่มประสิทธิภาพและความปลอดภัยในการทำงาน', 'ลดขนาดเครื่องจักร', 'เพิ่มความเร็วสูงสุด'],
    correct_index: 1,
  },
  {
    question_text: 'การตรวจสอบประจำวัน (Daily Inspection) ควรทำเมื่อใด?',
    options: ['หลังเลิกงานทุกวัน', 'ก่อนเริ่มงานทุกวัน', 'สัปดาห์ละครั้ง', 'เดือนละครั้ง'],
    correct_index: 1,
  },
  {
    question_text: 'ระยะห่างความปลอดภัยรอบเครื่องจักรขณะทำงานควรเป็นเท่าใด?',
    options: ['อย่างน้อย 1 เมตร', 'อย่างน้อย 3 เมตร', 'อย่างน้อย 5 เมตร', 'อย่างน้อย 10 เมตร'],
    correct_index: 2,
  },
  {
    question_text: 'น้ำมันเครื่องควรเปลี่ยนทุกกี่ชั่วโมงการทำงาน (ตามมาตรฐาน XCMG)?',
    options: ['ทุก 100 ชั่วโมง', 'ทุก 250 ชั่วโมง', 'ทุก 500 ชั่วโมง', 'ทุก 1,000 ชั่วโมง'],
    correct_index: 2,
  },
  {
    question_text: 'อุณหภูมิน้ำมันไฮดรอลิกที่เหมาะสมในการทำงานคือช่วงใด?',
    options: ['20–40°C', '40–80°C', '80–100°C', '100–120°C'],
    correct_index: 1,
  },
  {
    question_text: 'สัญลักษณ์ใดบนหน้าจอเครื่องจักรบ่งบอกถึงแรงดันน้ำมันต่ำ?',
    options: ['ไฟสีเขียว', 'ไฟสีน้ำเงิน', 'ไฟสีเหลืองหรือแดง', 'ไม่มีสัญลักษณ์'],
    correct_index: 2,
  },
  {
    question_text: 'การจอดเครื่องจักรบนทางลาดควรปฏิบัติอย่างไร?',
    options: ['ดับเครื่องทันที', 'ใช้เกียร์ว่างและดับเครื่อง', 'ดับเครื่อง วางแขนบนพื้น และใส่ล้อกล้อ', 'ไม่ต้องทำอะไรพิเศษ'],
    correct_index: 2,
  },
  {
    question_text: 'หากพบรอยรั่วของน้ำมันไฮดรอลิก ควรทำอย่างไร?',
    options: ['ทำงานต่อไปก่อนแล้วค่อยแจ้ง', 'หยุดเครื่องทันทีและแจ้งช่างซ่อม', 'เติมน้ำมันเพิ่มแล้วทำงานต่อ', 'ใช้เทปพันสายยางชั่วคราว'],
    correct_index: 1,
  },
  {
    question_text: 'ช่องทางใดที่ถูกต้องในการติดต่อ XCMG Thailand เมื่อต้องการอะไหล่?',
    options: ['ซื้อจากตลาดนัดทั่วไป', 'ติดต่อตัวแทนจำหน่ายและศูนย์บริการ XCMG ที่ได้รับการรับรอง', 'สั่งจากต่างประเทศโดยตรง', 'ใช้อะไหล่ทดแทนยี่ห้ออื่นแทน'],
    correct_index: 1,
  },
]

// ════════════════════════════════════════════════════════════════════════════
// ██  STATE  ██
// ════════════════════════════════════════════════════════════════════════════
const state = {
  user: null,
  preAnswers:    {},
  postAnswers:   {},
  episodesDone:  new Set(),
  currentEp:     null,
  ytPlayer:      null,
  ytReady:       false,
  maxWatched:    0,
  saveTimer:     null,
  lastResult:    null,
  certNumber:    null,
}

// ════════════════════════════════════════════════════════════════════════════
// ██  PROGRESS STEPS  ██
// ════════════════════════════════════════════════════════════════════════════
const SCREEN_ORDER = ['screen-register','screen-1','screen-2','screen-3','screen-4']
const STEP_IDS     = ['step-register','step-pre','step-video','step-post','step-cert']

function updateSteps(activeId) {
  const ai = SCREEN_ORDER.indexOf(activeId)
  STEP_IDS.forEach((id, i) => {
    const el = document.getElementById(id)
    if (!el) return
    el.className = 'step' + (i < ai ? ' done' : i === ai ? ' active' : '')
  })
}

window.showScreen = function(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  document.getElementById(id).classList.add('active')
  updateSteps(id)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ════════════════════════════════════════════════════════════════════════════
// ██  HELPERS  ██
// ════════════════════════════════════════════════════════════════════════════
function btn(id)            { return document.getElementById(id) }
function setDisabled(id, v) { const b = btn(id); if (b) b.disabled = v }

function setLoading(id, loading, label) {
  const b = btn(id)
  if (!b) return
  b.disabled = loading
  b.innerHTML = loading ? '<span class="spinner-inline"></span> กำลังดำเนินการ...' : label
}

function normalizeName(name) {
  return name ? name.replace(/\s+/g, ' ').trim() : ''
}

function formatThaiDate(dateString) {
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const date = dateString ? new Date(dateString) : new Date();
  const d = date.getDate();
  const m = thaiMonths[date.getMonth()];
  const y = date.getFullYear() + 543;
  return `${d} ${m} ${y}`;
}

function renderTextImage(text, options = {}) {
  const {
    width = 1800,
    height = 200,
    fontFamily = 'Sarabun, Noto Sans Thai, Helvetica, Arial, sans-serif',
    fontWeight = 'bold',
    color = XCMG_BLUE,
    maxLineWidth = 1700,
    initialFontSize = 64,
  } = options;

  const canvas = document.createElement('canvas');
  const dpr = 2;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  let fontSize = initialFontSize;
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  while (ctx.measureText(text).width > maxLineWidth && fontSize > 20) {
    fontSize -= 2;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  }

  ctx.fillText(text, width / 2, height / 2);
  return canvas.toDataURL('image/png');
}

async function loadCertificateFonts() {
  if (!window.document?.fonts?.ready) return
  await document.fonts.ready
  if (document.fonts.load) {
    await Promise.all([
      document.fonts.load('400 16px Sarabun'),
      document.fonts.load('700 16px Sarabun'),
      document.fonts.load('400 16px Noto Sans Thai'),
      document.fonts.load('700 16px Noto Sans Thai'),
    ]).catch(() => {})
  }
}

// loadImageSafe — รองรับ base64, local path, และ Supabase URL (หลีกเลี่ยง CORS/taint)
async function loadImageSafe(src) {
  if (!src) throw new Error('ไม่มี URL ภาพ');
  // base64 data URL: โหลดตรงได้เลย
  if (src.startsWith('data:')) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('โหลด base64 ไม่สำเร็จ'));
      img.src = src;
    });
  }
  // URL ภายนอก: fetch เป็น blob ก่อนเพื่อหลีกเลี่ยง canvas taint
  try {
    const resp = await fetch(src);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const blob   = await resp.blob();
    const objUrl = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(objUrl); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(objUrl); reject(new Error('โหลดภาพไม่สำเร็จ: ' + src.slice(0,80))); };
      img.src = objUrl;
    });
  } catch (e) {
    // fallback: img tag crossOrigin
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('โหลดภาพไม่สำเร็จ (CORS): ' + src.slice(0,80)));
      img.src = src + (src.includes('?') ? '&' : '?') + '_t=' + Date.now();
    });
  }
}

// fetchImageAsBase64 — kept for compatibility but now uses loadImageSafe
async function fetchImageAsBase64(url) {
  const img = await loadImageSafe(url);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  canvas.getContext('2d').drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
}

function renderQuiz(questions, containerId, storeKey, submitBtnId) {
  const el = document.getElementById(containerId)
  if (!el) return
  el.innerHTML = questions.map((q, i) => `
    <div class="quiz-question">
      <p><span class="quiz-q-num">${i + 1}</span>${q.question_text}</p>
      <div class="quiz-options">
        ${q.options.map((opt, j) => `
          <label>
            <input type="radio" name="q${storeKey}${i}" value="${j}"
              onchange="window._answer('${storeKey}',${i},${j},'${submitBtnId}',${questions.length})">
            <span class="opt-letter">${['A','B','C','D'][j]}</span>
            <span>${opt}</span>
          </label>`).join('')}
      </div>
    </div>`).join('')
}

window._answer = function(storeKey, qi, val, submitId, total) {
  if (storeKey === 'pre') state.preAnswers[qi] = val
  else                    state.postAnswers[qi] = val
  const ans = storeKey === 'pre' ? state.preAnswers : state.postAnswers
  setDisabled(submitId, Object.keys(ans).length < total)
}

// ════════════════════════════════════════════════════════════════════════════
// ██  1. REGISTER  ██
// ════════════════════════════════════════════════════════════════════════════
window.handleRegister = async function() {
  const nameInput = document.getElementById('regName').value
  const name      = normalizeName(nameInput)
  const empId     = document.getElementById('regId').value.trim()
  const email     = document.getElementById('regEmail').value.trim()
  const dept      = document.getElementById('regDept').value.trim()

  if (!name || !email) { alert('กรุณากรอกชื่อและอีเมลให้ครบ'); return }

  setLoading('registerBtn', true, 'เริ่มต้นเรียน →')
  try {
    let userId, userEmail
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email, password: 'XCMGlearn2024!',
      options: { data: { full_name: name } }
    })

    if (signUpErr) {
      if (signUpErr.message.includes('already registered') || signUpErr.message.includes('User already registered')) {
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email, password: 'XCMGlearn2024!'
        })
        if (signInErr) { alert('อีเมลนี้ลงทะเบียนแล้ว กรุณาติดต่อผู้ดูแลระบบ'); return }
        userId    = signInData.user.id
        userEmail = signInData.user.email
      } else {
        alert('สมัครสมาชิกไม่สำเร็จ: ' + signUpErr.message); return
      }
    } else {
      userId    = signUpData.user.id
      userEmail = signUpData.user.email
    }

    await supabase.from('users').upsert({
      id: userId, full_name: name, emp_id: empId,
      email: userEmail, department: dept, role: 'user'
    }, { onConflict: 'id' })

    state.user = { id: userId, email: userEmail, full_name: name, emp_id: empId, department: dept }

    renderQuiz(PRE_QUESTIONS, 'preTestContainer', 'pre', 'preSubmitBtn')
    window.showScreen('screen-1')

  } catch (err) {
    console.error(err)
    alert('เกิดข้อผิดพลาด: ' + err.message)
  } finally {
    setLoading('registerBtn', false, 'เริ่มต้นเรียน →')
  }
}

// ════════════════════════════════════════════════════════════════════════════
// ██  2. PRE-TEST SUBMIT  ██
// ════════════════════════════════════════════════════════════════════════════
window.handlePreTestSubmit = async function() {
  setLoading('preSubmitBtn', true, 'ส่งคำตอบและเริ่มดูวิดีโอ →')
  try {
    let score = 0
    PRE_QUESTIONS.forEach((q, i) => {
      if (parseInt(state.preAnswers[i]) === q.correct_index) score++
    })

    alert(`บันทึกคำตอบ Pre-Test เรียบร้อยแล้ว!\n\nคุณได้คะแนน: ${score} จากทั้งหมด ${PRE_QUESTIONS.length} ข้อ\n(กด ตกลง เพื่อเข้าสู่หน้าบทเรียนวิดีโอ)`)

    if (state.user?.id) {
      const { error } = await supabase.from('quiz_attempts').insert({
        user_id: state.user.id, quiz_type: 'pre',
        score, total_questions: PRE_QUESTIONS.length, passed: false
      })
      if (error) console.warn('pre-test insert:', error.message)
    }

    window.showScreen('screen-2')
    initVideoScreen()

  } catch (err) {
    console.error(err)
    window.showScreen('screen-2')
    initVideoScreen()
  } finally {
    setLoading('preSubmitBtn', false, 'ส่งคำตอบและเริ่มดูวิดีโอ →')
  }
}

// ════════════════════════════════════════════════════════════════════════════
// ██  3. VIDEO  ██
// ════════════════════════════════════════════════════════════════════════════
function initVideoScreen() {
  updateEpButtons()
  loadEpisode(1)
}

function updateEpButtons() {
  for (let i = 1; i <= 4; i++) {
    const b = btn(`ep${i}`)
    if (!b) continue
    const done = state.episodesDone.has(i)
    b.disabled  = false
    b.className = 'ep-btn' + (done ? ' watched' : '') + (state.currentEp === i ? ' current' : '')
    b.innerHTML = (done ? '✅ ' : '▶ ') + `EP ${i}<span class="ep-ep-num">ตอนที่ ${i}</span>`
  }
  setDisabled('videoNextBtn', false)
}

window.onYouTubeIframeAPIReady = function() {
  state.ytReady = true
  if (state.pendingVideoId != null) {
    createPlayer(state.pendingVideoId, state.pendingEp)
    state.pendingVideoId = null
    state.pendingEp = null
  }
}

;(function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) { window.onYouTubeIframeAPIReady(); return }
  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(tag)
})()

function loadEpisode(ep) {
  if (ep > 1 && !state.episodesDone.has(ep - 1)) return
  state.currentEp = ep
  state.maxWatched = 0
  if (state.saveTimer) { clearInterval(state.saveTimer); state.saveTimer = null }

  const titleEl = document.getElementById('epTitle')
  if (titleEl) titleEl.textContent = '🎥 ' + (EPISODE_TITLES[ep] || `ตอนที่ ${ep}`)

  updateEpButtons()
  const videoId = extractYouTubeId(EPISODE_VIDEO_IDS[ep])

  if (state.ytReady) {
    createPlayer(videoId, ep)
  } else {
    state.pendingVideoId = videoId
    state.pendingEp = ep
  }
}

function createPlayer(videoId, ep) {
  if (state.ytPlayer && typeof state.ytPlayer.destroy === 'function') {
    try { state.ytPlayer.destroy() } catch(e) {}
    state.ytPlayer = null
  }
  const container = document.getElementById('yt-player')
  if (!container) return
  container.innerHTML = '<div id="yt-inner"></div>'

  state.ytPlayer = new YT.Player('yt-inner', {
    videoId,
    width: '100%', height: '100%',
    playerVars: { rel: 0, modestbranding: 1, disablekb: 0, fs: 1 },
    events: {
      onReady: () => {
        if (state.saveTimer) clearInterval(state.saveTimer)
        state.saveTimer = setInterval(async () => {
          if (!state.ytPlayer || typeof state.ytPlayer.getPlayerState !== 'function') return
          if (state.ytPlayer.getPlayerState() !== YT.PlayerState.PLAYING) return
          const cur = Math.floor(state.ytPlayer.getCurrentTime())
          if (cur > state.maxWatched) {
            state.maxWatched = cur
            supabase.from('video_progress').upsert({
              user_id: state.user?.id, episode: ep,
              max_watched_sec: state.maxWatched, completed: false,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,episode' }).then(null, () => {})
          }
          if (cur > state.maxWatched + 5) {
            state.ytPlayer.seekTo(state.maxWatched, true)
          }
        }, 5000)
      },
      onStateChange: async (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          if (state.saveTimer) { clearInterval(state.saveTimer); state.saveTimer = null }
          state.episodesDone.add(ep)
          const { error: vpErr } = await supabase.from('video_progress').upsert({
            user_id: state.user?.id, episode: ep,
            completed: true, updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,episode' })
          if (vpErr) console.warn('video_progress upsert:', vpErr.message)
          updateEpButtons()
          if (ep < 4) {
            setTimeout(() => loadEpisode(ep + 1), 800)
          } else {
            showToast('🎉 ดูวิดีโอครบทุกตอนแล้ว! กดปุ่มด้านล่างเพื่อทำแบบทดสอบ')
          }
        }
      }
    }
  })
}

window.selectEpisode = function(ep) { loadEpisode(ep) }

window.handleVideoStepComplete = async function() {
  renderQuiz(POST_QUESTIONS, 'postTestContainer', 'post', 'postSubmitBtn')
  window.showScreen('screen-3')
}

// ════════════════════════════════════════════════════════════════════════════
// ██  4. POST-TEST SUBMIT  ██
// ════════════════════════════════════════════════════════════════════════════
window.handlePostTestSubmit = async function() {
  setLoading('postSubmitBtn', true, 'ส่งคำตอบและดูผลการทดสอบ →')
  try {
    let score = 0
    POST_QUESTIONS.forEach((q, i) => {
      if (parseInt(state.postAnswers[i]) === q.correct_index) score++
    })
    const total   = POST_QUESTIONS.length
    const percent = Math.round((score / total) * 100)
    const passed  = percent >= 60

    state.lastResult = { score, total, percent, passed }

    const { error: postErr } = await supabase.from('quiz_attempts').insert({
      user_id: state.user.id, quiz_type: 'post',
      score, total_questions: total, passed
    })
    if (postErr) console.warn('savePostTest:', postErr.message)

    if (passed) await issueCertificate(percent)

    renderResult(state.lastResult)
    window.showScreen('screen-4')

  } catch (err) {
    console.error(err)
    alert('เกิดข้อผิดพลาด: ' + err.message)
  } finally {
    setLoading('postSubmitBtn', false, 'ส่งคำตอบและดูผลการทดสอบ →')
  }
}

// ════════════════════════════════════════════════════════════════════════════
// ██  RESULT  ██
// ════════════════════════════════════════════════════════════════════════════
function renderResult(result) {
  const el = document.getElementById('scoreResult')
  if (!el) return

  el.innerHTML = `
    <div class="result-card">
      <div class="score-ring ${result.passed ? 'pass' : 'fail'}">
        <div class="score-pct">${result.percent}%</div>
        <div class="score-label">คะแนน</div>
      </div>
      <div class="result-status ${result.passed ? 'pass' : 'fail'}">
        ${result.passed ? '🎉 ผ่านการทดสอบ!' : '❌ ยังไม่ผ่าน — ลองใหม่ได้เลย'}
      </div>
      <div class="result-detail">
        ได้ <strong>${result.score}</strong> คะแนน จากทั้งหมด <strong>${result.total}</strong> ข้อ
        ${!result.passed ? '<br><small style="opacity:.75">(เกณฑ์ผ่าน 60% = 6 ข้อขึ้นไป)</small>' : ''}
      </div>
    </div>`

  const dlBtn = document.getElementById('downloadCertBtn')
  if (dlBtn) dlBtn.style.display = result.passed ? 'flex' : 'none'

  const retryBox = document.getElementById('retryContainer')
  if (retryBox) {
    retryBox.innerHTML = !result.passed
      ? `<button class="btn btn-outline" onclick="window.retakePost()">🔄 ทำแบบทดสอบใหม่อีกครั้ง</button>`
      : ''
  }

  if (result.passed) {
    renderCertPreview()
  } else {
    const cp = document.getElementById('certPreviewContainer')
    if (cp) cp.innerHTML = ''
  }
}

window.retakePost = async function() {
  state.postAnswers = {}
  renderQuiz(POST_QUESTIONS, 'postTestContainer', 'post', 'postSubmitBtn')
  window.showScreen('screen-3')
}

// ════════════════════════════════════════════════════════════════════════════
// ██  CERTIFICATE PREVIEW (HTML)  ██
// ════════════════════════════════════════════════════════════════════════════
function renderCertPreview() {
  const container = document.getElementById('certPreviewContainer')
  if (!container) return

  const name     = normalizeName(state.user?.full_name ?? '') || '___________________________'
  const empId    = state.user?.emp_id    || '-'
  const dept     = state.user?.department || '-'
  const dateStr  = formatThaiDate(new Date().toISOString())
  const certNum  = state.certNumber || '-'

  container.innerHTML = `
    <div class="cert-preview-wrap">
      <div class="cert-preview-label">ใบประกาศนียบัตร</div>

      <div class="certificate">
        <div class="cert-corner cert-corner-tl"></div>
        <div class="cert-corner cert-corner-tr"></div>
        <div class="cert-corner cert-corner-bl"></div>
        <div class="cert-corner cert-corner-br"></div>
        <div class="cert-watermark">XCMG</div>

        <div class="cert-logo-row">
          <div class="cert-logo-icon"><img src="logo-new.webp" alt="XCMG" style="width:48px;height:48px;object-fit:contain;border-radius:10px;display:block;"></div>
          <div>
            <div class="cert-org-name">XCMG Thailand</div>
            <div class="cert-org-sub">XCMG KNOWLEDGE ACADEMY</div>
          </div>
        </div>

        <div class="cert-divider-gold"></div>

        <div class="cert-headline">ประกาศนียบัตร</div>
        <div class="cert-subheadline">CERTIFICATE OF COMPLETION</div>

        <div class="cert-body">
          <div class="cert-declare">
            ขอมอบเกียรติบัตรฉบับนี้เพื่อรับรองว่า
          </div>

          <div class="cert-name-field">${name}</div>

          <div class="cert-emp-info">
            รหัสพนักงาน ${empId} &nbsp;|&nbsp; แผนก ${dept}
          </div>

          <div class="cert-course-box">
            <div class="cert-course-label">หลักสูตร</div>
            <div class="cert-course-name">
              ความรู้ผลิตภัณฑ์ XCMG<br>
              <span style="font-size:.85em;font-weight:600;opacity:.75">XCMG Product Knowledge E-Learning</span>
            </div>
          </div>

          <div class="cert-reason">
            ได้ผ่านการศึกษาและประเมินผลหลักสูตรดังกล่าวเป็นที่เรียบร้อยแล้ว ด้วยความวิริยะอุตสาหะ
            และได้แสดงให้เห็นถึงความรู้ความเข้าใจในมาตรฐานผลิตภัณฑ์และการปฏิบัติงานของ XCMG
            ตามเกณฑ์ที่กำหนดไว้อย่างครบถ้วน
          </div>
        </div>

        <div class="cert-footer">
          <div class="cert-date-block">
            <div class="cert-date-label">วันที่ออกใบประกาศ</div>
            <div class="cert-date-value">${dateStr}</div>
          </div>
          <div class="cert-seal">
            <div class="cert-seal-icon">🏅</div>
            <div class="cert-seal-text">CERTIFIED<br>XCMG</div>
          </div>
          <div class="cert-sig-block">
            <div class="cert-sig-line"></div>
            <div class="cert-sig-name">ผู้อำนวยการฝ่ายฝึกอบรม</div>
            <div class="cert-sig-title">XCMG Thailand Co., Ltd.</div>
          </div>
        </div>

        <div class="cert-number">เลขที่ใบประกาศ: ${certNum}</div>
      </div>
    </div>`
}

// ════════════════════════════════════════════════════════════════════════════
// ██  5. CERTIFICATE PDF  ██
// ════════════════════════════════════════════════════════════════════════════
async function issueCertificate(percent) {
  try {
    state.certNumber = `XCMG-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`
    const { error: certErr } = await supabase.from('certificates').insert({
      user_id:     state.user.id,
      cert_number: state.certNumber,
      post_score:  percent,
      email_sent:  false,
      issued_at:   new Date().toISOString(),
    })
    if (certErr) console.warn('cert insert:', certErr.message)
  } catch (err) {
    console.error('issueCertificate error:', err)
  }
}

window.handleDownloadCert = async function() {
  if (!state.user)               { alert('ไม่พบข้อมูลผู้ใช้ กรุณารีเฟรชหน้าแล้วลองใหม่'); return }
  if (!state.lastResult?.passed) { alert('ต้องผ่านการทดสอบก่อนดาวน์โหลดใบประกาศ'); return }

  const dlBtn = document.getElementById('downloadCertBtn');
  if (dlBtn) { dlBtn.disabled = true; dlBtn.textContent = '⏳ กำลังสร้างไฟล์...'; }
  showToast('⏳ กำลังจัดเตรียมใบประกาศนียบัตร...');

  try {
    await loadCertificateFonts();

    // ── Canvas size: A4 landscape @3× for crisp output ─────────────────────
    const SCALE = 3;
    const PW = 297, PH = 210; // mm
    // We work in "pt" at 2.8346 pt/mm → A4 = 841.9 × 595.3 but let's keep px
    // Work at 1200 × 849 px (≈ A4 landscape at 102 dpi) × SCALE
    const W = 1200 * SCALE, H = 849 * SCALE;
    const s = SCALE; // scale factor shorthand

    const cvs = document.createElement('canvas');
    cvs.width = W; cvs.height = H;
    const ctx = cvs.getContext('2d');

    const name   = normalizeName(state.user.full_name ?? '-') || '-';
    const empId  = state.user.emp_id    || '-';
    const dept   = state.user.department || '-';
    const dateStr = formatThaiDate(new Date().toISOString());
    const certNum = state.certNumber || '-';

    // ── Helper: fill centred text with auto font-size ───────────────────────
    function drawCentredText(text, y, { font, size, color, maxW, weight = 'normal', italic = false } = {}) {
      let fs = size * s;
      const style = `${italic ? 'italic ' : ''}${weight} ${fs}px ${font || 'Sarabun,sans-serif'}`;
      ctx.font = style;
      ctx.fillStyle = color || '#111827';
      // shrink if too wide
      while (maxW && ctx.measureText(text).width > maxW * s && fs > 10) {
        fs -= 1;
        ctx.font = `${italic ? 'italic ' : ''}${weight} ${fs}px ${font || 'Sarabun,sans-serif'}`;
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, W / 2, y * s);
    }

    function drawLeftText(text, x, y, { font, size, color, weight = 'normal' } = {}) {
      ctx.font = `${weight} ${size * s}px ${font || 'Sarabun,sans-serif'}`;
      ctx.fillStyle = color || '#111827';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x * s, y * s);
    }

    function drawRightText(text, x, y, { font, size, color, weight = 'normal' } = {}) {
      ctx.font = `${weight} ${size * s}px ${font || 'Sarabun,sans-serif'}`;
      ctx.fillStyle = color || '#111827';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x * s, y * s);
    }

    // ── 1. White background ─────────────────────────────────────────────────
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    // ── 2. Outer gold border ────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(196,146,42,0.5)';
    ctx.lineWidth = 3 * s;
    roundRect(ctx, 24 * s, 24 * s, (1200 - 48) * s, (849 - 48) * s, 12 * s);
    ctx.stroke();

    // inner thin border
    ctx.strokeStyle = 'rgba(196,146,42,0.2)';
    ctx.lineWidth = 1 * s;
    roundRect(ctx, 34 * s, 34 * s, (1200 - 68) * s, (849 - 68) * s, 8 * s);
    ctx.stroke();

    // ── 3. Gold corner decorations ──────────────────────────────────────────
    const cSize = 60 * s, cOff = 12 * s, cLine = 3 * s;
    ctx.strokeStyle = 'rgba(196,146,42,0.4)';
    ctx.lineWidth = cLine;
    // TL
    ctx.beginPath(); ctx.moveTo(cOff + cSize, cOff); ctx.lineTo(cOff, cOff); ctx.lineTo(cOff, cOff + cSize); ctx.stroke();
    // TR
    ctx.beginPath(); ctx.moveTo(W - cOff - cSize, cOff); ctx.lineTo(W - cOff, cOff); ctx.lineTo(W - cOff, cOff + cSize); ctx.stroke();
    // BL
    ctx.beginPath(); ctx.moveTo(cOff + cSize, H - cOff); ctx.lineTo(cOff, H - cOff); ctx.lineTo(cOff, H - cOff - cSize); ctx.stroke();
    // BR
    ctx.beginPath(); ctx.moveTo(W - cOff - cSize, H - cOff); ctx.lineTo(W - cOff, H - cOff); ctx.lineTo(W - cOff, H - cOff - cSize); ctx.stroke();

    // ── 4. "XCMG" watermark text ────────────────────────────────────────────
    ctx.save();
    ctx.font = `800 ${200 * s}px 'Barlow Condensed',sans-serif`;
    ctx.fillStyle = 'rgba(26,74,138,0.025)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('XCMG', W / 2, H / 2);
    ctx.restore();

    // ── 5. Logo icon box ────────────────────────────────────────────────────
    const iconSize = 56 * s;
    const iconX = (W / 2) - iconSize - (12 * s);  // logo left of text row
    const iconY = 72 * s;

    // Draw rounded-rect background for logo
    ctx.save();
    const logoGrad = ctx.createLinearGradient(iconX, iconY, iconX + iconSize, iconY + iconSize);
    logoGrad.addColorStop(0, '#0B2545');
    logoGrad.addColorStop(1, '#1A4A8A');
    ctx.fillStyle = logoGrad;
    roundRect(ctx, iconX, iconY, iconSize, iconSize, 12 * s);
    ctx.fill();

    // Shadow under logo box
    ctx.shadowColor = 'rgba(11,37,69,0.2)';
    ctx.shadowBlur = 12 * s;
    ctx.shadowOffsetY = 4 * s;
    roundRect(ctx, iconX, iconY, iconSize, iconSize, 12 * s);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.restore();

    // Draw logo image inside the box
    try {
      const logoImg = await loadImageSafe(XCMG_LOGO_B64);
      const pad = 6 * s;
      ctx.drawImage(logoImg, iconX + pad, iconY + pad, iconSize - pad * 2, iconSize - pad * 2);
    } catch {}

    // Org name text next to logo
    const textX = (W / 2) + (4 * s);
    ctx.font = `700 ${22 * s}px 'Barlow Condensed',sans-serif`;
    ctx.fillStyle = '#0B2545';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('XCMG Thailand', textX, (72 + 8) * s);

    ctx.font = `normal ${11 * s}px Sarabun,sans-serif`;
    ctx.fillStyle = '#4B5563';
    ctx.textBaseline = 'top';
    ctx.fillText('XCMG KNOWLEDGE ACADEMY', textX, (72 + 34) * s);

    // ── 6. Gold divider line ────────────────────────────────────────────────
    const divY = 148 * s;
    const divGrad = ctx.createLinearGradient(0, 0, W, 0);
    divGrad.addColorStop(0, 'transparent');
    divGrad.addColorStop(0.5, '#C4922A');
    divGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(80 * s, divY);
    ctx.lineTo((1200 - 80) * s, divY);
    ctx.stroke();

    // ── 7. "ประกาศนียบัตร" headline ─────────────────────────────────────────
    drawCentredText('ประกาศนียบัตร', 182, {
      font: "'Noto Serif Thai',serif", size: 38, color: '#0B2545', weight: '700', maxW: 900
    });

    // ── 8. "CERTIFICATE OF COMPLETION" ──────────────────────────────────────
    drawCentredText('CERTIFICATE OF COMPLETION', 222, {
      font: 'Sarabun,sans-serif', size: 13, color: '#4B5563', weight: 'normal', maxW: 900
    });

    // ── 9. "ขอมอบเกียรติบัตร..." ────────────────────────────────────────────
    drawCentredText('ขอมอบเกียรติบัตรฉบับนี้เพื่อรับรองว่า', 264, {
      font: 'Sarabun,sans-serif', size: 15, color: '#4B5563', weight: 'normal', maxW: 900
    });

    // ── 10. Recipient name ──────────────────────────────────────────────────
    drawCentredText(name, 315, {
      font: "'Noto Serif Thai',serif", size: 44, color: '#0B2545', weight: '700', maxW: 1000
    });

    // ── 11. Employee info ───────────────────────────────────────────────────
    drawCentredText('รหัสพนักงาน ' + empId + '  |  แผนก ' + dept, 362, {
      font: 'Sarabun,sans-serif', size: 14, color: '#4B5563', weight: 'normal', maxW: 900
    });

    // ── 12. Course box ──────────────────────────────────────────────────────
    const boxX = 280 * s, boxY = 385 * s, boxW = 640 * s, boxH = 88 * s;
    // Background gradient
    const boxGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
    boxGrad.addColorStop(0, '#EBF2FC');
    boxGrad.addColorStop(1, '#DDE8FA');
    ctx.fillStyle = boxGrad;
    roundRect(ctx, boxX, boxY, boxW, boxH, 10 * s);
    ctx.fill();
    // Border
    ctx.strokeStyle = 'rgba(37,99,176,0.2)';
    ctx.lineWidth = 1 * s;
    roundRect(ctx, boxX, boxY, boxW, boxH, 10 * s);
    ctx.stroke();

    // "หลักสูตร" label
    ctx.font = `700 ${11 * s}px Sarabun,sans-serif`;
    ctx.fillStyle = '#2563B0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('หลักสูตร', W / 2, (385 + 18) * s);

    // course name Thai
    ctx.font = `700 ${17 * s}px 'Barlow Condensed','Sarabun',sans-serif`;
    ctx.fillStyle = '#0B2545';
    ctx.fillText('ความรู้ผลิตภัณฑ์ XCMG', W / 2, (385 + 42) * s);

    // course name English
    ctx.font = `600 ${13 * s}px Sarabun,sans-serif`;
    ctx.fillStyle = 'rgba(11,37,69,0.6)';
    ctx.fillText('XCMG Product Knowledge E-Learning', W / 2, (385 + 65) * s);

    // ── 13. Reason text ─────────────────────────────────────────────────────
    ctx.font = `normal ${13 * s}px Sarabun,sans-serif`;
    ctx.fillStyle = '#4B5563';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const line1 = 'ได้ผ่านการศึกษาและประเมินผลหลักสูตรดังกล่าวเป็นที่เรียบร้อยแล้ว ด้วยความวิริยะอุตสาหะ';
    const line2 = 'และได้แสดงให้เห็นถึงความรู้ความเข้าใจในมาตรฐานผลิตภัณฑ์และการปฏิบัติงานของ XCMG ตามเกณฑ์ที่กำหนดไว้อย่างครบถ้วน';
    ctx.fillText(line1, W / 2, 520 * s);
    ctx.fillText(line2, W / 2, 540 * s);

    // ── 14. Footer: Date | Seal | Signature ─────────────────────────────────
    const footY = 620;

    // Date (left)
    ctx.font = `normal ${10 * s}px Sarabun,sans-serif`;
    ctx.fillStyle = '#4B5563';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('วันที่ออกใบประกาศ', 100 * s, footY * s);

    ctx.font = `600 ${16 * s}px 'Noto Serif Thai',serif`;
    ctx.fillStyle = '#0B2545';
    ctx.fillText(dateStr, 100 * s, (footY + 26) * s);

    // Seal (centre)
    const sealCx = W / 2, sealCy = (footY + 10) * s, sealR = 42 * s;
    // Outer ring
    ctx.strokeStyle = 'rgba(196,146,42,0.4)';
    ctx.lineWidth = 2 * s;
    ctx.beginPath(); ctx.arc(sealCx, sealCy, sealR, 0, Math.PI * 2); ctx.stroke();
    // Glow ring
    ctx.strokeStyle = 'rgba(196,146,42,0.1)';
    ctx.lineWidth = 4 * s;
    ctx.beginPath(); ctx.arc(sealCx, sealCy, sealR + 4 * s, 0, Math.PI * 2); ctx.stroke();
    // Fill
    const sealGrad = ctx.createRadialGradient(sealCx - sealR * 0.3, sealCy - sealR * 0.3, 0, sealCx, sealCy, sealR);
    sealGrad.addColorStop(0, '#FFF8EC');
    sealGrad.addColorStop(1, '#FDF0D0');
    ctx.fillStyle = sealGrad;
    ctx.beginPath(); ctx.arc(sealCx, sealCy, sealR, 0, Math.PI * 2); ctx.fill();
    // 🏅 medal emoji
    ctx.font = `${26 * s}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏅', sealCx, sealCy - 6 * s);
    ctx.font = `700 ${8 * s}px Sarabun,sans-serif`;
    ctx.fillStyle = '#C4922A';
    ctx.fillText('CERTIFIED', sealCx, sealCy + 20 * s);
    ctx.fillText('XCMG', sealCx, sealCy + 31 * s);

    // Signature block (right)
    const sigX = 1100 * s;
    // signature line
    ctx.strokeStyle = '#D1D9E6';
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(sigX - 120 * s, (footY - 8) * s);
    ctx.lineTo(sigX, (footY - 8) * s);
    ctx.stroke();

    // Try to load real signature image
    try {
      const sig = await loadImageSafe(SIGNATURE_URL);
      ctx.drawImage(sig, sigX - 130 * s, (footY - 45) * s, 130 * s, 40 * s);
    } catch {}

    ctx.font = `700 ${12 * s}px Sarabun,sans-serif`;
    ctx.fillStyle = '#0B2545';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('ผู้อำนวยการฝ่ายฝึกอบรม', sigX, footY * s);

    ctx.font = `normal ${11 * s}px Sarabun,sans-serif`;
    ctx.fillStyle = '#4B5563';
    ctx.fillText('XCMG Thailand Co., Ltd.', sigX, (footY + 18) * s);

    // ── 15. Dashed divider above cert number ────────────────────────────────
    ctx.setLineDash([6 * s, 4 * s]);
    ctx.strokeStyle = 'rgba(196,146,42,0.3)';
    ctx.lineWidth = 1 * s;
    ctx.beginPath();
    ctx.moveTo(80 * s, 695 * s);
    ctx.lineTo((1200 - 80) * s, 695 * s);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── 16. Certificate number ──────────────────────────────────────────────
    drawCentredText('เลขที่ใบประกาศ: ' + certNum, 717, {
      font: 'Sarabun,sans-serif', size: 11, color: '#A0AEC0', weight: 'normal'
    });

    // ── Helper: roundRect polyfill ───────────────────────────────────────────
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

    // ── 17. Export ───────────────────────────────────────────────────────────
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isAnd = /android/i.test(navigator.userAgent);
    const isSaf = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    const openAsImage = () => {
      const dataUrl = cvs.toDataURL('image/png');
      const win = window.open('', '_blank');
      if (!win) {
        cvs.toBlob(blob => {
          const u = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = u;
          a.download = 'XCMG-Certificate-' + state.user.id + '.png';
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(u), 5000);
        }, 'image/png');
        return;
      }
      win.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ใบประกาศ XCMG</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#111;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:12px}img{max-width:100%;height:auto;border-radius:6px;box-shadow:0 4px 20px rgba(0,0,0,.6)}a{display:block;margin-top:12px;padding:10px 24px;background:#1B3A6B;color:#fff;text-decoration:none;border-radius:6px;font-family:sans-serif;font-size:14px;text-align:center}</style></head><body><img src="' + dataUrl + '" alt="ใบประกาศ"><a href="' + dataUrl + '" download="XCMG-Certificate.png">⬇ บันทึกภาพ PNG</a></body></html>');
      win.document.close();
    };

    if (isIOS || isAnd) {
      openAsImage();
    } else {
      const jsPDFLib = window.jspdf?.jsPDF ?? window.jsPDF;
      if (jsPDFLib) {
        try {
          const imgData = cvs.toDataURL('image/jpeg', 0.95);
          const doc = new jsPDFLib({ orientation: 'landscape', unit: 'mm', format: 'a4' });
          doc.addImage(imgData, 'JPEG', 0, 0, 297, 210);
          doc.save('XCMG-Certificate-' + state.user.id + '.pdf');
        } catch { openAsImage(); }
      } else if (isSaf) {
        openAsImage();
      } else {
        cvs.toBlob(blob => {
          const u = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = u;
          a.download = 'XCMG-Certificate-' + state.user.id + '.png';
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(u), 5000);
        }, 'image/png');
      }
    }

    showToast('📥 ดาวน์โหลดใบประกาศนียบัตรเสร็จสมบูรณ์!');

  } catch (error) {
    console.error('Certificate generation failed:', error);
    alert('เกิดข้อผิดพลาด: ' + error.message);
  } finally {
    if (dlBtn) { dlBtn.disabled = false; dlBtn.textContent = '📥 ดาวน์โหลดใบประกาศนียบัตร (PDF)'; }
  }
}

// ════════════════════════════════════════════════════════════════════════════
// ██  TOAST  ██
// ════════════════════════════════════════════════════════════════════════════
function showToast(msg) {
  let t = document.getElementById('toast')
  if (!t) {
    t = document.createElement('div'); t.id = 'toast'
    document.body.appendChild(t)
  }
  t.textContent = msg; t.style.opacity = '1'
  clearTimeout(t._timer)
  t._timer = setTimeout(() => { t.style.opacity = '0' }, 3500)
}

// ════════════════════════════════════════════════════════════════════════════
// ██  RESTORE SESSION  ██
// ════════════════════════════════════════════════════════════════════════════
async function restoreSession() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('users').select('full_name,emp_id,department').eq('id', user.id).maybeSingle()

    const profileName = profile?.full_name ?? user.user_metadata?.full_name ?? ''
    state.user = {
      id: user.id, email: user.email,
      full_name: normalizeName(profileName),
      emp_id: profile?.emp_id ?? '',
      department: profile?.department ?? '',
    }

    const { data: cert } = await supabase
      .from('certificates').select('cert_number,post_score')
      .eq('user_id', user.id).order('issued_at', { ascending: false }).limit(1).maybeSingle()
    if (cert) {
      state.certNumber = cert.cert_number
      state.lastResult = { passed: true, percent: cert.post_score, score: '-', total: '-' }
      renderResult(state.lastResult)
      window.showScreen('screen-4'); return
    }

    const { data: vp } = await supabase
      .from('video_progress').select('episode,completed').eq('user_id', user.id)
    ;(vp ?? []).filter(v => v.completed).forEach(v => state.episodesDone.add(Number(v.episode)))
    if (state.episodesDone.size >= 4) {
      renderQuiz(POST_QUESTIONS, 'postTestContainer', 'post', 'postSubmitBtn')
      window.showScreen('screen-3'); return
    }

    const { data: pre } = await supabase
      .from('quiz_attempts').select('id').eq('user_id', user.id)
      .eq('quiz_type','pre').limit(1).maybeSingle()
    if (pre) {
      window.showScreen('screen-2')
      initVideoScreen(); return
    }

  } catch (err) {
    console.warn('restoreSession:', err.message)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  restoreSession()
})
