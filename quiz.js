// quiz.js — ดึงคำถาม + บันทึกผลข้อสอบ
import { supabase } from './supabase.js'

// ── ฟังก์ชันคำนวณคะแนน ───────────────────────────────────────────────────
function calcScore(answers, questions) {
  let score = 0
  questions.forEach((q, index) => {
    // ถ้าข้อที่ตอบ ตรงกับ correct_index ในฐานข้อมูล จะได้ 1 คะแนน
    if (answers[index] !== undefined && parseInt(answers[index]) === q.correct_index) {
      score++
    }
  })
  return score
}

// ── ดึงคำถามจาก Supabase ──────────────────────────────────────────────────
export async function fetchQuestions(quizType) {
  const { data, error } = await supabase
    .from('questions')
    .select('id, question_text, options, correct_index, order_num')
    .eq('quiz_type', quizType)
    .order('order_num')

  if (error) {
    console.error('fetchQuestions error:', error.message)
    return []
  }
  return data
}

// ── บันทึกผล Pre-Test ─────────────────────────────────────────────────────────
export async function savePreTest(userId, answers, questions) {
  const score = calcScore(answers, questions)

  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_type: 'pre',
      score: score,
      total_questions: questions.length,
      passed: false // ใส่ไว้กันเหนียว กรณี DB บังคับว่าห้ามเป็นค่าว่าง
    })

  if (error) console.error('savePreTest error:', error.message)
}

// ── บันทึกผล Post-Test ────────────────────────────────────────────────────────
export async function savePostTest(userId, answers, questions) {
  const score = calcScore(answers, questions)
  const passed = score / questions.length >= 0.6 // เกณฑ์ผ่าน 60%

  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_type: 'post',
      score: score,
      total_questions: questions.length,
      passed: passed // [แก้แล้ว] เพิ่มตัวแปร passed ส่งเข้าไปใน Database ด้วย
    })

  if (error) console.error('savePostTest error:', error.message)

  return {
    score,
    total: questions.length,
    percent: Math.round((score / questions.length) * 100),
    passed
  }
}

// ── ดึงประวัติการสอบ ─────────────────────────────────────────────────────────
export async function getAttemptHistory(userId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('quiz_type, score, total_questions, passed, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  if (error) {
    console.error("getAttemptHistory error:", error.message)
    return []
  }
  return data ?? []
}

// ── ตรวจสอบว่า Post-Test ผ่านแล้วหรือยัง ─────────────────────────────────────
export async function hasPassedPostTest(userId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('passed')
    .eq('user_id', userId)
    .eq('quiz_type', 'post')
    .eq('passed', true)
    .limit(1)
    .maybeSingle() // [แก้แล้ว] เปลี่ยนจาก single() เป็น maybeSingle() ป้องกันเว็บพังถ้าไม่เคยสอบ

  if (error) {
    console.error("hasPassedPostTest error:", error.message)
    return false
  }
  
  return !!data
}