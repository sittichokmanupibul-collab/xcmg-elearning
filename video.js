// video.js — บันทึก progress วิดีโอ + YouTube IFrame API
import { supabase } from './supabase.js'

// ── 1. บันทึกความคืบหน้าวิดีโอ (เรียกทุก 5 วินาที) ────────────────────────────────
export async function saveVideoProgress(userId, episode, watchedSeconds) {
  const { error } = await supabase
    .from('video_progress')
    .upsert(
      {
        user_id: userId,
        episode,
        max_watched_sec: watchedSeconds,
        completed: false,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: 'user_id,episode',
        ignoreDuplicates: false
      }
    )

  if (error) console.error('saveVideoProgress error:', error.message)
}

// ── 2. บันทึกว่าดูวิดีโอจบแล้ว ──────────────────────────────────────────────────
export async function markEpisodeComplete(userId, episode) {
  const { error } = await supabase
    .from('video_progress')
    .upsert(
      {
        user_id: userId,
        episode,
        completed: true,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,episode' }
    )

  if (error) console.error('markEpisodeComplete error:', error.message)
}

// ── 3. ตรวจสอบว่าดูจบครบทุกคลิปหรือยัง ──────────────────────────────────────────
export async function hasCompletedAllVideos(userId) {
  const { data, error } = await supabase
    .from('video_progress')
    .select('episode, completed')
    .eq('user_id', userId)
    .eq('completed', true)

  if (error || !data) return false
  return data.length >= 4
}

// ── 4. ฟังก์ชันหลักในการเล่นวิดีโอ (แก้ไขรวมฟังก์ชันแก้ปัญหา undefined) ───
export function initYouTubePlayer(videoId, userId, episode, onComplete) {
  let player
  let maxWatched = 0           // วินาทีที่ดูไปแล้ว (ห้ามกรอกลับไปข้างหน้าเกินนี้)
  let saveInterval = null

  // กำหนดฟังก์ชันเซ็ตอัปเข้ากับ window เพื่อให้ YouTube API เรียกใช้งาน
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('yt-player', {
      videoId: videoId,
      playerVars: {
        rel: 0,           // ไม่แสดงวิดีโอแนะนำตอนจบ
        modestbranding: 1, // ซ่อนโลโก้ขนาดใหญ่
        disablekb: 1,     // บล็อกปุ่มกด Keyboard ลัดเพื่อโกงข้ามคลิป
      },
      events: {
        onReady: () => {
          // เริ่มลูปแอบเช็คและเซฟ Progress ลงฐานข้อมูลทุกๆ 5 วินาที
          saveInterval = setInterval(async () => {
            if (!player || typeof player.getPlayerState !== 'function') return
            if (player.getPlayerState() !== YT.PlayerState.PLAYING) return

            const current = Math.floor(player.getCurrentTime())
            if (current > maxWatched) {
              maxWatched = current
              await saveVideoProgress(userId, episode, maxWatched)
            }

            // 🛡️ ระบบล็อกความปลอดภัย: ถ้าลักไก่กด Seek ไปข้างหน้าเกินคลิปที่ดูจริง จะโดนดีดกลับมาที่เดิม
            if (current > maxWatched + 3) {
              player.seekTo(maxWatched, true)
            }
          }, 5000)
        },
        onStateChange: async (event) => {
          // ดักจับจังหวะที่วิดีโอเล่นจบพอดี (ENDED)
          if (event.data === YT.PlayerState.ENDED) {
            if (saveInterval) clearInterval(saveInterval)
            await markEpisodeComplete(userId, episode)
            if (typeof onComplete === 'function') {
              onComplete(episode) // ปลดล็อก Ep. ถัดไป หรือปุ่มถัดไป
            }
          }
        }
      }
    })
  }

  // เผื่อกรณีที่สคริปต์ของ YouTube API โหลดเสร็จรอก่อนแล้ว ให้สั่งรันงานทันที
  if (window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady()
  }

  // คืนค่าฟังก์ชันใช้เคลียร์ลูปเวลาเปลี่ยนตอน (Clean up)
  return () => {
    if (saveInterval) clearInterval(saveInterval)
  }
}