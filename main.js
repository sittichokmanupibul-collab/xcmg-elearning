import { supabase } from './supabase.js'

// ════════════════════════════════════════════════════════════════════════════
// ██  CONFIG  ██
// ════════════════════════════════════════════════════════════════════════════

const CERT_TEMPLATE_URL = '/assets/cert-template.png';
const SIGNATURE_URL     = '/assets/signature.png';
const XCMG_LOGO_B64 = 'data:image/jpeg;base64,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';


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
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  const date = dateString ? new Date(dateString) : new Date();
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear();
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
      <div class="cert-preview-label">Certificate of Completion</div>

      <div class="certificate">
        <div class="cert-corner cert-corner-tl"></div>
        <div class="cert-corner cert-corner-tr"></div>
        <div class="cert-corner cert-corner-bl"></div>
        <div class="cert-corner cert-corner-br"></div>
        <div class="cert-watermark">XCMG</div>

        <div class="cert-logo-row">
          <div class="cert-logo-icon">🏗️</div>
          <div>
            <div class="cert-org-name">XCMG Thailand</div>
            <div class="cert-org-sub">XCMG KNOWLEDGE ACADEMY</div>
          </div>
        </div>

        <div class="cert-divider-gold"></div>

        <div class="cert-headline">CERTIFICATE</div>
        <div class="cert-subheadline">CERTIFICATE OF COMPLETION</div>

        <div class="cert-body">
          <div class="cert-declare">
            This is to certify that
          </div>

          <div class="cert-name-field">${name}</div>

          <div class="cert-emp-info">
            Employee ID: ${empId} &nbsp;|&nbsp; Department: ${dept}
          </div>

          <div class="cert-course-box">
            <div class="cert-course-label">COURSE</div>
            <div class="cert-course-name">
              XCMG Product Knowledge<br>
              <span style="font-size:.85em;font-weight:600;opacity:.75">XCMG Product Knowledge E-Learning</span>
            </div>
          </div>

          <div class="cert-reason">
            has successfully completed the above course with diligence and dedication,
            demonstrating a comprehensive understanding of XCMG product standards
            and operational practices as required.
          </div>
        </div>

        <div class="cert-footer">
          <div class="cert-date-block">
            <div class="cert-date-label">DATE OF ISSUE</div>
            <div class="cert-date-value">${dateStr}</div>
          </div>
          <div class="cert-seal">
            <div class="cert-seal-icon">🏅</div>
            <div class="cert-seal-text">CERTIFIED<br>XCMG</div>
          </div>
          <div class="cert-sig-block">
            <div class="cert-sig-line"></div>
            <div class="cert-sig-name">Training Director</div>
            <div class="cert-sig-title">XCMG Thailand Co., Ltd.</div>
          </div>
        </div>

        <div class="cert-number">Certificate No.: ${certNum}</div>
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
  if (!state.user)               { alert('User not found. Please refresh and try again.'); return }
  if (!state.lastResult?.passed) { alert('You must pass the test before downloading the certificate.'); return }

  const dlBtn = document.getElementById('downloadCertBtn');
  if (dlBtn) { dlBtn.disabled = true; dlBtn.textContent = '⏳ Generating file...'; }
  showToast('⏳ Preparing certificate...');

  try {
    // ── 1. build canvas ─────────────────────────────────────────────────────
    await loadCertificateFonts();

    const W = 2970, H = 2100, cx = W / 2;
    const certCanvas = document.createElement('canvas');
    certCanvas.width = W; certCanvas.height = H;
    const ctx = certCanvas.getContext('2d');

    const name    = normalizeName(state.user.full_name ?? '-') || '-';
    const empId   = state.user.emp_id    || '-';
    const dept    = state.user.department || '-';
    const dateStr = formatThaiDate(new Date().toISOString());

    // Background template or draw fallback
    try {
      const tpl = await loadImageSafe(CERT_TEMPLATE_URL);
      ctx.drawImage(tpl, 0, 0, W, H);
    } catch {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#f8f4e8'); grad.addColorStop(1, '#fdf9f0');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#C9A84C';
      ctx.lineWidth = 18; ctx.strokeRect(50, 50, W-100, H-100);
      ctx.lineWidth = 6;  ctx.strokeRect(80, 80, W-160, H-160);
    }

    // Watermark: XCMG logo 45% opacity
    try {
      const wm = await loadImageSafe(XCMG_LOGO_B64);
      const wmW = W * 0.50, wmH = wmW * (wm.naturalHeight / wm.naturalWidth);
      ctx.save(); ctx.globalAlpha = 0.45;
      ctx.drawImage(wm, (W-wmW)/2, (H-wmH)/2, wmW, wmH);
      ctx.restore();
    } catch {}

    // Top logo
    try {
      const logo = await loadImageSafe(XCMG_LOGO_B64);
      const lW = 420, lH = lW * (logo.naturalHeight / logo.naturalWidth);
      ctx.drawImage(logo, cx - lW/2, 60, lW, lH);
    } catch {}

    // Recipient name
    const nameImg = await loadImageSafe(renderTextImage(name, {
      width: 2400, height: 300, initialFontSize: 96, color: XCMG_BLUE, fontWeight: 'bold'
    }));
    ctx.drawImage(nameImg, cx - 1800, 1070, 3600, 420);

    // Employee info
    const empInfoTxt = 'Employee ID: ' + empId + '  |  Department: ' + dept;
    const infoImg = await loadImageSafe(renderTextImage(empInfoTxt, {
      width: 2400, height: 180, initialFontSize: 42, color: TEXT_DARK, fontWeight: 'normal'
    }));
    ctx.drawImage(infoImg, cx - 1500, 1330, 3000, 210);

    // Date
    const dateImg = await loadImageSafe(renderTextImage('Issued on ' + dateStr, {
      width: 2400, height: 180, initialFontSize: 44, color: TEXT_DARK, fontWeight: 'normal'
    }));
    ctx.drawImage(dateImg, cx - 1350, 1520, 2700, 195);

    // Signature
    try {
      const sig = await loadImageSafe(SIGNATURE_URL);
      ctx.drawImage(sig, 2050, 1580, 650, 240);
    } catch {}

    // ── 2. Export file ────────────────────────────────────────────────────────
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isAnd = /android/i.test(navigator.userAgent);
    const isSaf = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    const openAsImage = () => {
      const dataUrl = certCanvas.toDataURL('image/png');
      const win = window.open('', '_blank');
      if (!win) {
        // pop-up blocked → blob download
        certCanvas.toBlob(blob => {
          const u = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = u;
          a.download = 'XCMG-Certificate-' + state.user.id + '.png';
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(u), 5000);
        }, 'image/png');
        return;
      }
      win.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>XCMG Certificate</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#111;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:12px}img{max-width:100%;height:auto;border-radius:6px;box-shadow:0 4px 20px rgba(0,0,0,.6)}a{display:block;margin-top:12px;padding:10px 24px;background:#1B3A6B;color:#fff;text-decoration:none;border-radius:6px;font-family:sans-serif;font-size:14px;text-align:center}</style></head><body><img src="' + dataUrl + '" alt="Certificate"><a href="' + dataUrl + '" download="XCMG-Certificate.png">⬇ Save PNG</a></body></html>');
      win.document.close();
    };

    if (isIOS || isAnd) {
      openAsImage();
    } else {
      // Desktop: PDF first, fallback PNG
      const jsPDFLib = window.jspdf?.jsPDF ?? window.jsPDF;
      if (jsPDFLib) {
        try {
          const imgData = certCanvas.toDataURL('image/jpeg', 0.92);
          const doc = new jsPDFLib({ orientation: 'landscape', unit: 'mm', format: 'a4' });
          doc.addImage(imgData, 'JPEG', 0, 0, 297, 210);
          doc.save('XCMG-Certificate-' + state.user.id + '.pdf');
        } catch {
          openAsImage();
        }
      } else if (isSaf) {
        openAsImage();
      } else {
        certCanvas.toBlob(blob => {
          const u = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = u;
          a.download = 'XCMG-Certificate-' + state.user.id + '.png';
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(u), 5000);
        }, 'image/png');
      }
    }

    showToast('📥 Certificate downloaded successfully!');

  } catch (error) {
    console.error('Certificate generation failed:', error);
    alert('Error: ' + error.message);
  } finally {
    if (dlBtn) { dlBtn.disabled = false; dlBtn.textContent = '📥 Download Certificate (PDF)'; }
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
