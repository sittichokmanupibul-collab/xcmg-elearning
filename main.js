// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  main.js — XCMG Knowledge Academy                                       ║
// ║  แก้ไขส่วน CONFIG ด้านล่างเพียงจุดเดียวเพื่อเปลี่ยนเนื้อหา            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { supabase } from './supabase.js'

// ════════════════════════════════════════════════════════════════════════════
// ██  CONFIG — แก้ตรงนี้เพียงจุดเดียว  ██
// ════════════════════════════════════════════════════════════════════════════

// ══ วิธีใส่ลิงก์วิดีโอ ══
// ใส่ได้ทั้ง YouTube URL เต็ม หรือแค่ Video ID
// เช่น 'https://www.youtube.com/watch?v=VJkImB3ZC2Y'
//      'https://youtu.be/VJkImB3ZC2Y'
//      'VJkImB3ZC2Y'
function extractYouTubeId(input) {
  if (!input) return ''
  // ถ้าเป็น URL — ดึง ID ออกมา
  const patterns = [
    /[?&]v=([^&#]+)/,          // youtube.com/watch?v=ID
    /youtu\.be\/([^?&#]+)/,    // youtu.be/ID
    /embed\/([^?&#]+)/,        // youtube.com/embed/ID
  ]
  for (const re of patterns) {
    const m = input.match(re)
    if (m) return m[1]
  }
  // ถ้าไม่ match pattern ไหนเลย ถือว่าเป็น ID โดยตรง
  return input.trim()
}

// ══ แก้ตรงนี้เพียงจุดเดียว — ใส่ URL หรือ ID ก็ได้ ══
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

// คำถาม Pre-Test (10 ข้อ) — แก้ข้อความและตัวเลือกได้ตามต้องการ
// correct_index: 0=A, 1=B, 2=C, 3=D
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

// คำถาม Post-Test (10 ข้อ) — แก้ข้อความและตัวเลือกได้ตามต้องการ
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
function btn(id)         { return document.getElementById(id) }
function setDisabled(id, v) { const b = btn(id); if (b) b.disabled = v }

function setLoading(id, loading, label) {
  const b = btn(id)
  if (!b) return
  b.disabled = loading
  b.innerHTML = loading ? '<span class="spinner-inline"></span> กำลังดำเนินการ...' : label
}

function normalizeName(name) {
  return name.replace(/\s+/g, ' ').trim()
}

function renderTextImage(text, options = {}) {
  const {
    width = 1600,
    height = 220,
    fontFamily = 'Noto Sans Thai, Sarabun, Helvetica, Arial, sans-serif',
    fontWeight = 'bold',
    color = XCMG_BLUE,
    alpha = 1,
    maxLineWidth = 1480,
    initialFontSize = 72,
    minFontSize = 20,
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
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  let fontSize = initialFontSize;
  const setFont = () => { ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`; };
  setFont();

  const wrapText = (value) => {
    const words = value.split(' ');
    const lines = [''];
    for (const word of words) {
      const testLine = lines[lines.length - 1] ? `${lines[lines.length - 1]} ${word}` : word;
      if (ctx.measureText(testLine).width <= maxLineWidth) {
        lines[lines.length - 1] = testLine;
      } else {
        lines.push(word);
      }
    }
    return lines;
  };

  let lines = wrapText(text);
  while ((lines.length > 2 || ctx.measureText(lines[0]).width > maxLineWidth) && fontSize > minFontSize) {
    fontSize -= 2;
    setFont();
    lines = wrapText(text);
  }

  const lineHeight = fontSize * lineHeightFactor;
  const totalHeight = lineHeight * lines.length;
  const startY = height / 2 - totalHeight / 2 + lineHeight / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });

  return canvas.toDataURL('image/png');
}

async function loadCertificateFonts() {
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

function renderQuiz(questions, containerId, storeKey, submitBtnId) {
  const el = document.getElementById(containerId)
  if (!el) return
  el.innerHTML = questions.map((q, i) => `
    <div class="quiz-question">
      <p><strong>ข้อ ${i + 1}.</strong> ${q.question_text}</p>
      <div class="quiz-options">
        ${q.options.map((opt, j) => `
          <label>
            <input type="radio" name="q${storeKey}${i}" value="${j}"
              onchange="window._answer('${storeKey}',${i},${j},'${submitBtnId}',${questions.length})">
            <span class="opt-letter">${['A','B','C','D'][j]}</span> ${opt}
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
  const nameInput  = document.getElementById('regName').value
  const name       = normalizeName(nameInput)
  const empId      = document.getElementById('regId').value.trim()
  const email      = document.getElementById('regEmail').value.trim()
  const dept       = document.getElementById('regDept').value.trim()

  if (!name || !email) { alert('กรุณากรอกชื่อและอีเมลให้ครบ'); return }

  setLoading('registerBtn', true, 'เริ่มต้นเรียน →')
  try {
    // Sign up (ถ้าอีเมลซ้ำ → sign in แทน)
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
        userId = signInData.user.id
        userEmail = signInData.user.email
      } else {
        alert('สมัครสมาชิกไม่สำเร็จ: ' + signUpErr.message); return
      }
    } else {
      userId = signUpData.user.id
      userEmail = signUpData.user.email
    }

    // upsert โปรไฟล์
    await supabase.from('users').upsert({
      id: userId, full_name: name, emp_id: empId,
      email: userEmail, department: dept, role: 'user'
    }, { onConflict: 'id' })

    state.user = { id: userId, email: userEmail, full_name: name, emp_id: empId, department: dept }

    // render pre-test แล้วเปลี่ยนหน้า
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
    // 1. คำนวณคะแนน Pre-Test
    let score = 0
    PRE_QUESTIONS.forEach((q, i) => {
      if (parseInt(state.preAnswers[i]) === q.correct_index) score++
    })

    // 2. แสดงผลคะแนนให้ผู้เรียนรับทราบทันทีตามที่ต้องการ
    alert(`บันทึกคำตอบ Pre-Test เรียบร้อยแล้ว!\n\nคุณได้คะแนน: ${score} จากทั้งหมด ${PRE_QUESTIONS.length} ข้อ\n(กด ตกลง เพื่อเข้าสู่หน้าบทเรียนวิดีโอ)`);

    // 3. บันทึกคำตอบลงฐานข้อมูลด้วยโครงสร้างที่ถูกต้อง (ไม่มี .catch ต่อท้ายตัวเมธอดตรงๆ)
    if (state.user && state.user.id) {
      const { error } = await supabase.from('quiz_attempts').insert({
        user_id: state.user.id, 
        quiz_type: 'pre',
        score: score, 
        total_questions: PRE_QUESTIONS.length, 
        passed: false
      })
      if (error) console.warn('Supabase insert pre-test error:', error.message)
    }

    // 4. เปลี่ยนหน้าไปยังขั้นตอนรับชมวิดีโอ
    window.showScreen('screen-2')
    initVideoScreen()

  } catch (err) {
    console.error('Pre-test submission process error:', err)
    // หากส่วนการบันทึกพัง จะสลับหน้าจอไปที่วิดีโอทันทีเพื่อไม่ให้ระบบล็อก
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
    b.disabled  = false  // ปลดล็อกทุก EP ให้กดได้
    b.className = 'ep-btn' + (done ? ' watched' : '') + (state.currentEp === i ? ' current' : '')
    b.innerHTML = (done ? '✅ ' : '▶ ') + `EP ${i}`
  }
  // ปุ่ม "ทำแบบทดสอบ" เปิดตลอด (ไม่บังคับดูครบ)
  setDisabled('videoNextBtn', false)
}

// YouTube IFrame API
// ⚠️ ต้องประกาศ window.onYouTubeIframeAPIReady ก่อน inject <script> เสมอ
//    เพราะ ES Module โหลด async — YouTube อาจ fire callback ก่อน module พร้อม
window.onYouTubeIframeAPIReady = function() {
  state.ytReady = true
  if (state.pendingVideoId != null) {
    createPlayer(state.pendingVideoId, state.pendingEp)
    state.pendingVideoId = null
    state.pendingEp = null
  }
}

// Inject YouTube script หลังจาก callback ลงทะเบียนแล้ว
;(function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) {
    // API โหลดอยู่แล้ว — fire callback ทันที
    window.onYouTubeIframeAPIReady()
    return
  }
  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(tag)
})()

function loadEpisode(ep) {
  if (ep > 1 && !state.episodesDone.has(ep - 1)) return
  state.currentEp = ep
  state.maxWatched = 0
  if (state.saveTimer) { clearInterval(state.saveTimer); state.saveTimer = null }

  // อัปเดตชื่อตอน
  const titleEl = document.getElementById('epTitle')
  if (titleEl) titleEl.textContent = EPISODE_TITLES[ep] || `ตอนที่ ${ep}`

  updateEpButtons()

  const videoId = extractYouTubeId(EPISODE_VIDEO_IDS[ep])

  if (state.ytReady) {
    createPlayer(videoId, ep)
  } else {
    // เก็บไว้รอ onYouTubeIframeAPIReady
    state.pendingVideoId = videoId
    state.pendingEp = ep
  }
}

function createPlayer(videoId, ep) {
  // ทำลาย player เก่า
  if (state.ytPlayer && typeof state.ytPlayer.destroy === 'function') {
    try { state.ytPlayer.destroy() } catch(e) {}
    state.ytPlayer = null
  }
  // รีเซ็ต div
  const container = document.getElementById('yt-player')
  if (!container) return
  container.innerHTML = '<div id="yt-inner"></div>'

  state.ytPlayer = new YT.Player('yt-inner', {
    videoId,
    width: '100%',
    height: '100%',
    playerVars: { rel: 0, modestbranding: 1, disablekb: 0, fs: 1 },
    events: {
      onReady: () => {
        // บันทึก progress ทุก 5 วินาที
        if (state.saveTimer) clearInterval(state.saveTimer)
        state.saveTimer = setInterval(async () => {
          if (!state.ytPlayer || typeof state.ytPlayer.getPlayerState !== 'function') return
          if (state.ytPlayer.getPlayerState() !== YT.PlayerState.PLAYING) return
          const cur = Math.floor(state.ytPlayer.getCurrentTime())
          if (cur > state.maxWatched) {
            state.maxWatched = cur
            // บันทึก DB (non-blocking)
            supabase.from('video_progress').upsert({
              user_id: state.user?.id, episode: ep,
              max_watched_sec: state.maxWatched, completed: false,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,episode' }).then(null, () => {})
          }
          // Anti-skip: ถ้ากระโดดข้ามไปมากกว่า 5 วินาที ดีดกลับ
          if (cur > state.maxWatched + 5) {
            state.ytPlayer.seekTo(state.maxWatched, true)
          }
        }, 5000)
      },
      onStateChange: async (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          if (state.saveTimer) { clearInterval(state.saveTimer); state.saveTimer = null }
          state.episodesDone.add(ep)
          // บันทึก completed
          const { error: vpErr } = await supabase.from('video_progress').upsert({
            user_id: state.user?.id, episode: ep,
            completed: true, updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,episode' })
          if (vpErr) console.warn('video_progress upsert skipped:', vpErr.message)
          updateEpButtons()
          // auto โหลด ep ถัดไป
          if (ep < 4) {
            setTimeout(() => loadEpisode(ep + 1), 800)
          } else {
            // ดูครบ 4 ตอน
            showToast('🎉 ดูวิดีโอครบทุกตอนแล้ว! กดปุ่มด้านล่างเพื่อทำแบบทดสอบ')
          }
        }
      }
    }
  })
}

window.selectEpisode = function(ep) { loadEpisode(ep) }

window.handleVideoStepComplete = async function() {
  // หมายเหตุ: ถ้าต้องการบังคับดูครบ ให้เปิด comment บรรทัดด้านล่าง
  // if (state.episodesDone.size < 4) { alert('กรุณารับชมวิดีโอให้ครบทุก 4 ตอนก่อน'); return }
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

    // บันทึก DB
    const { error: postErr } = await supabase.from('quiz_attempts').insert({
      user_id: state.user.id, quiz_type: 'post',
      score, total_questions: total, passed
    })
    if (postErr) console.warn('savePostTest skipped:', postErr.message)

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
    <div class="score-big">${result.percent}%</div>
    <span class="score-badge ${result.passed ? 'pass' : 'fail'}">
      ${result.passed ? '🎉 ผ่านการทดสอบ!' : '❌ ไม่ผ่าน — ลองใหม่ได้เลย'}
    </span>
    <p style="text-align:center;margin-top:12px;color:#666;">
      ได้คะแนน <strong>${result.score}</strong> จาก <strong>${result.total}</strong> ข้อ
      ${!result.passed ? '<br><small>(เกณฑ์ผ่าน 60% = 6 ข้อขึ้นไป)</small>' : ''}
    </p>`

  const dlBtn = document.getElementById('downloadCertBtn')
  if (dlBtn) dlBtn.style.display = result.passed ? 'block' : 'none'

  const retryBox = document.getElementById('retryContainer')
  if (retryBox) {
    retryBox.innerHTML = !result.passed
      ? `<button onclick="window.retakePost()" style="background:#e65100;">🔄 ทำแบบทดสอบใหม่อีกครั้ง</button>`
      : ''
  }
}

window.retakePost = async function() {
  state.postAnswers = {}
  renderQuiz(POST_QUESTIONS, 'postTestContainer', 'post', 'postSubmitBtn')
  window.showScreen('screen-3')
}

// ════════════════════════════════════════════════════════════════════════════
// ██  5. CERTIFICATE  ██
// ════════════════════════════════════════════════════════════════════════════
async function issueCertificate(percent) {
  try {
    state.certNumber = `XCMG-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`
    const { error: certErr } = await supabase.from('certificates').insert({
      user_id:    state.user.id,
      cert_number: state.certNumber,
      post_score: percent,
      email_sent: false,
      issued_at:  new Date().toISOString(),
    })
    if (certErr) console.warn('cert insert skipped:', certErr.message)
  } catch (err) {
    console.error('issueCertificate:', err)
  }
}

window.handleDownloadCert = async function() {
  if (!state.user) { alert('ไม่พบข้อมูลผู้ใช้ กรุณารีเฟรชหน้าแล้วลองใหม่'); return }
  if (!state.lastResult?.passed) { alert('ต้องผ่านการทดสอบก่อนดาวน์โหลดใบประกาศ'); return }

  const jsPDFLib = window.jspdf?.jsPDF ?? window.jsPDF
  if (!jsPDFLib) { alert('jsPDF ยังไม่โหลด กรุณารอสักครู่แล้วลองใหม่'); return }
  await loadCertificateFonts()

  const doc     = new jsPDFLib({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const W = 297, H = 210
  const name    = normalizeName(state.user.full_name ?? '-') || '-'
  const empId   = state.user.emp_id || '-'
  const dept    = state.user.department || '-'
  const cert    = state.certNumber ?? 'N/A'
  const score   = state.lastResult?.percent ?? '-'
  const dateStr = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' })

  // Modern blue-gold background
  doc.setFillColor(245, 248, 253); doc.rect(0, 0, W, H, 'F')
  doc.setFillColor(14, 56, 114); doc.rect(0, 0, W, 30, 'F')
  doc.setFillColor(255, 255, 255); doc.roundedRect(18, 28, W - 36, H - 52, 14, 14, 'F')

  // Gold accent shapes
  doc.setFillColor(196, 157, 69); doc.rect(20, 34, 8, 60, 'F')
  doc.setFillColor(245, 232, 156); doc.roundedRect(W - 62, 36, 36, 8, 3, 3, 'F')
  doc.setDrawColor(196, 157, 69); doc.setLineWidth(1.5); doc.roundedRect(18, 28, W - 36, H - 52, 14, 14)

  // Header text
  doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.setTextColor(255,255,255)
  doc.text('XCMG KNOWLEDGE ACADEMY', W/2, 16, { align:'center' })

  const watermarkImage = renderTextImage('XCMG', {
    width: 1800,
    height: 260,
    fontWeight: 'bold',
    color: 'rgba(196,157,69,0.12)',
    alpha: 0.12,
    initialFontSize: 220,
    minFontSize: 120,
    maxLineWidth: 1700,
    lineHeightFactor: 1,
  })
  doc.addImage(watermarkImage, 'PNG', W/2 - 130, 72, 260, 90)

  // Main title
  const titleImage = renderTextImage('ประกาศนียบัตร', {
    width: 1200,
    height: 120,
    fontWeight: 'bold',
    color: '#0f3d6e',
    initialFontSize: 82,
    minFontSize: 44,
  })
  doc.addImage(titleImage, 'PNG', W/2 - 135, 52, 270, 36)
  doc.setDrawColor(196, 157, 69); doc.setLineWidth(2)
  doc.line(W/2 - 75, 94, W/2 + 75, 94)

  // Subtitle and name
  const introImage = renderTextImage('มอบให้กับ', {
    width: 1200,
    height: 90,
    fontWeight: 'normal',
    color: '#4d5f7f',
    initialFontSize: 22,
    minFontSize: 16,
  })
  doc.addImage(introImage, 'PNG', W/2 - 70, 102, 140, 12)

  const nameImage = renderTextImage(name, {
    width: 1400,
    height: 140,
    fontWeight: 'bold',
    color: '#102d57',
    initialFontSize: 62,
    minFontSize: 32,
  })
  doc.addImage(nameImage, 'PNG', W/2 - 145, 114, 290, 40)

  const detailImage = renderTextImage(`รหัสพนักงาน ${empId}   |   แผนก ${dept}`, {
    width: 1400,
    height: 90,
    fontWeight: 'normal',
    color: '#5c708d',
    initialFontSize: 18,
    minFontSize: 12,
  })
  doc.addImage(detailImage, 'PNG', W/2 - 145, 156, 290, 12)

  // Achievement statement
  const statement1 = renderTextImage('ด้วยการผ่านหลักสูตรความรู้ผลิตภัณฑ์ XCMG', {
    width: 1400,
    height: 90,
    fontWeight: 'normal',
    color: '#3c4f6e',
    initialFontSize: 20,
    minFontSize: 14,
    maxLineWidth: 1320,
  })
  doc.addImage(statement1, 'PNG', W/2 - 145, 170, 290, 14)

  const statement2 = renderTextImage('และทำแบบทดสอบตามเกณฑ์ที่กำหนด', {
    width: 1400,
    height: 80,
    fontWeight: 'normal',
    color: '#3c4f6e',
    initialFontSize: 20,
    minFontSize: 14,
    maxLineWidth: 1320,
  })
  doc.addImage(statement2, 'PNG', W/2 - 145, 184, 290, 14)

  const scoreImage = renderTextImage(`คะแนนร้อยละ ${score} จากการประเมิน`, {
    width: 1400,
    height: 80,
    fontWeight: 'bold',
    color: '#0d2d52',
    initialFontSize: 24,
    minFontSize: 16,
  })
  doc.addImage(scoreImage, 'PNG', W/2 - 125, 198, 250, 16)

  const dateImage = renderTextImage(`ออกให้ ณ วันที่ ${dateStr}`, {
    width: 1400,
    height: 80,
    fontWeight: 'normal',
    color: '#0d2d52',
    initialFontSize: 18,
    minFontSize: 12,
  })
  doc.addImage(dateImage, 'PNG', W/2 - 75, 212, 150, 12)

  // Signature area
  doc.setDrawColor(19, 74, 142)
  doc.setLineWidth(0.4)
  doc.line(W - 118, 170, W - 38, 170)
  const signTitle = renderTextImage('ผู้มีอำนาจลงนาม', {
    width: 1000,
    height: 70,
    fontWeight: 'normal',
    color: '#4e6078',
    initialFontSize: 12,
    minFontSize: 10,
  })
  doc.addImage(signTitle, 'PNG', W - 110, 173, 72, 8)
  const signName = renderTextImage('XCMG ประเทศไทย', {
    width: 1000,
    height: 70,
    fontWeight: 'bold',
    color: '#102d57',
    initialFontSize: 14,
    minFontSize: 10,
  })
  doc.addImage(signName, 'PNG', W - 110, 181, 72, 9)

  // Footer band
  doc.setFillColor(19, 74, 142); doc.rect(0, H - 16, W, 16, 'F')
  const footerInfoText = renderTextImage('www.xcmg.com  |  บริษัท XCMG (ประเทศไทย) จำกัด', {
    width: 1600,
    height: 80,
    fontWeight: 'normal',
    color: '#f5e0a7',
    initialFontSize: 9,
    minFontSize: 7,
    maxLineWidth: 1460,
    lineHeightFactor: 1,
  })
  doc.addImage(footerInfoText, 'PNG', W/2 - 80, H - 12.5, 160, 5)

  const footerCertText = renderTextImage(`ใบประกาศเลขที่ ${cert}`, {
    width: 900,
    height: 70,
    fontWeight: 'normal',
    color: '#ffffff',
    initialFontSize: 9,
    minFontSize: 7,
    maxLineWidth: 860,
    lineHeightFactor: 1,
  })
  doc.addImage(footerCertText, 'PNG', 18, H - 12.5, 70, 5)

  const footerDateText = renderTextImage(`ออกเมื่อ ${dateStr}`, {
    width: 900,
    height: 70,
    fontWeight: 'normal',
    color: '#ffffff',
    initialFontSize: 9,
    minFontSize: 7,
    maxLineWidth: 860,
    lineHeightFactor: 1,
  })
  doc.addImage(footerDateText, 'PNG', W - 88, H - 12.5, 70, 5)

  doc.save(`XCMG-Certificate-${cert}.pdf`)
  showToast('📥 ดาวน์โหลดใบประกาศนียบัตรสำเร็จ!')
}

// ════════════════════════════════════════════════════════════════════════════
// ██  TOAST  ██
// ════════════════════════════════════════════════════════════════════════════
function showToast(msg) {
  let t = document.getElementById('toast')
  if (!t) {
    t = document.createElement('div'); t.id = 'toast'
    t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#185fa5;color:#fff;padding:12px 24px;border-radius:8px;font-size:0.95rem;box-shadow:0 4px 20px rgba(0,0,0,.25);z-index:999;transition:opacity .4s'
    document.body.appendChild(t)
  }
  t.textContent = msg; t.style.opacity = '1'
  clearTimeout(t._timer)
  t._timer = setTimeout(() => { t.style.opacity = '0' }, 3500)
}

// ════════════════════════════════════════════════════════════════════════════
// ██  RESTORE SESSION (Refresh)  ██
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

    // ผ่านแล้ว?
    const { data: cert } = await supabase
      .from('certificates').select('cert_number,post_score')
      .eq('user_id', user.id).order('issued_at', { ascending: false }).limit(1).maybeSingle()
    if (cert) {
      state.certNumber = cert.cert_number
      state.lastResult = { passed: true, percent: cert.post_score, score: '-', total: '-' }
      renderResult(state.lastResult)
      window.showScreen('screen-4'); return
    }

    // ดูวิดีโอครบ?
    const { data: vp } = await supabase
      .from('video_progress').select('episode,completed').eq('user_id', user.id)
    ;(vp ?? []).filter(v => v.completed).forEach(v => state.episodesDone.add(Number(v.episode)))
    if (state.episodesDone.size >= 4) {
      renderQuiz(POST_QUESTIONS, 'postTestContainer', 'post', 'postSubmitBtn')
      window.showScreen('screen-3'); return
    }

    // ทำ pre-test แล้ว?
    const { data: pre } = await supabase
      .from('quiz_attempts').select('id').eq('user_id', user.id)
      .eq('quiz_type','pre').limit(1).maybeSingle()
    if (pre) {
      window.showScreen('screen-2')
      initVideoScreen(); return
    }

  } catch (err) {
    console.warn('restoreSession error (non-critical):', err.message)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  restoreSession()
})
