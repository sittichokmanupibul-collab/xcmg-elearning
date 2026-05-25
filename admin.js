// admin.js — ดึงข้อมูลสำหรับ Admin panel
import { supabase } from './supabase.js'

// ── ตรวจสอบ role ก่อนเข้าหน้า Admin ─────────────────────────────────────────
export async function requireAdmin() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return window.location.href = '/login.html'

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (data?.role !== 'admin') return window.location.href = '/'
  return user
}

// ── ภาพรวม dashboard ─────────────────────────────────────────────────────────
//
// return: { totalUsers, passedUsers, passRate, avgScore, certsIssued }

export async function getDashboardStats() {
  const [
    { count: totalUsers },
    { count: passedUsers },
    { count: certsIssued },
    { data: scores }
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user'),
    supabase.from('quiz_attempts').select('*', { count: 'exact', head: true }).eq('quiz_type', 'post').eq('passed', true),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
    supabase.from('quiz_attempts').select('score, total_questions').eq('quiz_type', 'post')
  ])

  const avgScore = scores?.length
    ? Math.round(scores.reduce((s, r) => s + (r.score / r.total_questions) * 100, 0) / scores.length)
    : 0

  return {
    totalUsers: totalUsers ?? 0,
    passedUsers: passedUsers ?? 0,
    passRate: totalUsers ? Math.round((passedUsers / totalUsers) * 100) : 0,
    avgScore,
    certsIssued: certsIssued ?? 0,
  }
}

// ── รายชื่อผู้เรียนทั้งหมดพร้อมสถานะ ─────────────────────────────────────────
export async function getAllUsers() {
  const { data } = await supabase
    .from('users')
    .select(`
      id, full_name, emp_id, email, department, created_at,
      quiz_attempts ( quiz_type, score, total_questions, passed, completed_at ),
      certificates ( cert_number, post_score, email_sent, issued_at ),
      video_progress ( episode, completed )
    `)
    .eq('role', 'user')
    .order('created_at', { ascending: false })

  return (data ?? []).map(u => {
    const preTest  = u.quiz_attempts.find(a => a.quiz_type === 'pre')
    const postTests = u.quiz_attempts.filter(a => a.quiz_type === 'post')
    const bestPost = postTests.sort((a, b) => b.score - a.score)[0]
    const videosWatched = u.video_progress.filter(v => v.completed).length

    return {
      id: u.id,
      name: u.full_name,
      empId: u.emp_id,
      email: u.email,
      department: u.department,
      registeredAt: u.created_at,
      didPreTest: !!preTest,
      videosWatched,
      postAttempts: postTests.length,
      bestPostScore: bestPost ? Math.round((bestPost.score / bestPost.total_questions) * 100) : null,
      passed: bestPost?.passed ?? false,
      certNumber: u.certificates[0]?.cert_number ?? null,
      certEmailSent: u.certificates[0]?.email_sent ?? false,
    }
  })
}

// ── Export รายงานเป็น CSV ─────────────────────────────────────────────────────
export async function exportCSV() {
  const users = await getAllUsers()

  const headers = [
    'ชื่อ-นามสกุล', 'รหัสพนักงาน', 'อีเมล', 'แผนก',
    'วันที่ลงทะเบียน', 'Pre-Test', 'วิดีโอที่ดู', 'จำนวนครั้งสอบ',
    'คะแนนสูงสุด (%)', 'ผ่าน/ไม่ผ่าน', 'เลขใบเซอร์ฯ'
  ]

  const rows = users.map(u => [
    u.name, u.empId, u.email, u.department ?? '',
    new Date(u.registeredAt).toLocaleDateString('th-TH'),
    u.didPreTest ? 'ทำแล้ว' : 'ยังไม่ทำ',
    `${u.videosWatched}/4`,
    u.postAttempts,
    u.bestPostScore ?? '-',
    u.passed ? 'ผ่าน' : 'ไม่ผ่าน',
    u.certNumber ?? '-'
  ])

  const csv = '\uFEFF' + [headers, ...rows]  // \uFEFF = BOM สำหรับ Excel ภาษาไทย
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `XCMG-Report-${new Date().toISOString().slice(0,10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// ── จัดการคำถาม (CRUD) ───────────────────────────────────────────────────────
export async function addQuestion({ quizType, questionText, options, correctIndex, orderNum }) {
  const { error } = await supabase.from('questions').insert({
    quiz_type: quizType,
    question_text: questionText,
    options,           // array เช่น ['ตัวเลือก A', 'B', 'C', 'D']
    correct_index: correctIndex,
    order_num: orderNum,
  })
  return !error
}

export async function deleteQuestion(questionId) {
  const { error } = await supabase.from('questions').delete().eq('id', questionId)
  return !error
}
