import { supabase } from './supabase.js'

function calcScore(answers, questions) {
  let score = 0
  questions.forEach((q, index) => {
    if (answers[index] !== undefined && parseInt(answers[index]) === q.correct_index) {
      score++
    }
  })
  return score
}

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

export async function savePreTest(userId, answers, questions) {
  const score = calcScore(answers, questions)

  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_type: 'pre',
      score: score,
      total_questions: questions.length,
      passed: false
    })

  if (error) console.error('savePreTest error:', error.message)
}

export async function savePostTest(userId, answers, questions) {
  const score = calcScore(answers, questions)
  const passed = score / questions.length >= 0.6

  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_type: 'post',
      score: score,
      total_questions: questions.length,
      passed: passed
    })

  if (error) console.error('savePostTest error:', error.message)

  return {
    score,
    total: questions.length,
    percent: Math.round((score / questions.length) * 100),
    passed
  }
}

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

export async function hasPassedPostTest(userId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('passed')
    .eq('user_id', userId)
    .eq('quiz_type', 'post')
    .eq('passed', true)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("hasPassedPostTest error:", error.message)
    return false
  }
  
  return !!data
}
