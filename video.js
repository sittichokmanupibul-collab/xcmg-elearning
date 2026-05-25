import { supabase } from './supabase.js'

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

export async function hasCompletedAllVideos(userId) {
  const { data, error } = await supabase
    .from('video_progress')
    .select('episode, completed')
    .eq('user_id', userId)
    .eq('completed', true)

  if (error || !data) return false
  return data.length >= 4
}

export function initYouTubePlayer(videoId, userId, episode, onComplete) {
  let player
  let maxWatched = 0          
  let saveInterval = null

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('yt-player', {
      videoId: videoId,
      playerVars: {
        rel: 0,          
        modestbranding: 1,
        disablekb: 1,    
      },
      events: {
        onReady: () => {
          saveInterval = setInterval(async () => {
            if (!player || typeof player.getPlayerState !== 'function') return
            if (player.getPlayerState() !== YT.PlayerState.PLAYING) return

            const current = Math.floor(player.getCurrentTime())
            if (current > maxWatched) {
              maxWatched = current
              await saveVideoProgress(userId, episode, maxWatched)
            }

            if (current > maxWatched + 3) {
              player.seekTo(maxWatched, true)
            }
          }, 5000)
        },
        onStateChange: async (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            if (saveInterval) clearInterval(saveInterval)
            await markEpisodeComplete(userId, episode)
            if (typeof onComplete === 'function') {
              onComplete(episode)
            }
          }
        }
      }
    })
  }

  if (window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady()
  }

  return () => {
    if (saveInterval) clearInterval(saveInterval)
  }
}
