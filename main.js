import { supabase } from './supabase.js'

// ════════════════════════════════════════════════════════════════════════════
// ██  CONFIG  ██
// ════════════════════════════════════════════════════════════════════════════

const CERT_TEMPLATE_URL = '/assets/cert-template.png';
const SIGNATURE_URL     = '/assets/signature.png';

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
    img.onerror = () => reject(new Error('ไม่สามารถโหลดภาพแม่แบบได้'));
    img.src = url;
  });
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
          <div class="cert-logo-icon">🏗️</div>
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
  if (!state.user) { alert('ไม่พบข้อมูลผู้ใช้ กรุณารีเฟรชหน้าแล้วลองใหม่'); return }
  if (!state.lastResult?.passed) { alert('ต้องผ่านการทดสอบก่อนดาวน์โหลดใบประกาศ'); return }

  const jsPDFLib = window.jspdf?.jsPDF ?? window.jsPDF
  if (!jsPDFLib) { alert('jsPDF ยังไม่โหลด กรุณารอสักครู่แล้วลองใหม่'); return }

  showToast('⏳ กำลังจัดเตรียมใบประกาศนียบัตร...')
  await loadCertificateFonts()

  try {
    const doc = new jsPDFLib({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const canvasWidth = 297;
    const centerX = canvasWidth / 2;

    const name    = normalizeName(state.user.full_name ?? '-') || '-'
    const empId   = state.user.emp_id || '-'
    const dept    = state.user.department || '-'
    const dateStr = formatThaiDate(new Date().toISOString())

    const imgData = await fetchImageAsBase64(CERT_TEMPLATE_URL);
    doc.addImage(imgData, 'PNG', 0, 0, 297, 210);

    const nameImage = renderTextImage(name, {
      width: 1600, height: 200,
      initialFontSize: 64, color: XCMG_BLUE, fontWeight: 'bold'
    });
    doc.addImage(nameImage, 'PNG', centerX - 120, 108, 240, 30);

    const empInfo = `รหัสพนักงาน ${empId}  |  แผนก ${dept}`;
    const infoImage = renderTextImage(empInfo, {
      width: 1600, height: 120,
      initialFontSize: 28, color: TEXT_DARK, fontWeight: 'normal'
    });
    doc.addImage(infoImage, 'PNG', centerX - 100, 133, 200, 15);

    const fullDateText = `ให้ไว้ ณ วันที่ ${dateStr}`;
    const dateImage = renderTextImage(fullDateText, {
      width: 1600, height: 120,
      initialFontSize: 30, color: TEXT_DARK, fontWeight: 'normal'
    });
    doc.addImage(dateImage, 'PNG', centerX - 90, 152, 180, 13);

    const sigData = await fetchImageAsBase64(SIGNATURE_URL);
    doc.addImage(sigData, 'PNG', 205, 158, 45, 18);

    doc.save(`XCMG-Certificate-${state.user.id}.pdf`);
    showToast('📥 ดาวน์โหลดใบประกาศนียบัตรเสร็จสมบูรณ์!')
  } catch (error) {
    console.error('PDF Generation failed:', error);
    alert('เกิดข้อผิดพลาดในการสร้าง PDF: ' + error.message);
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
