import { useEffect, useRef } from 'react'
import { useMediaPlayer } from '@vidstack/react'
import { postLecturePlaybackLog } from '../../shared/api/lectureApi'
import type { PostLecturePlaybackLogBody } from '../../entities/lecture/types'
import { API_BASE_URL } from '../../shared/config/apiBaseUrl'
import { getAccessToken } from '../../shared/lib/tokenStorage'

const PLAYBACK_RATE_FIXED = 1
const HEARTBEAT_MS = 10_000

const roundSec = (t: number): number => Math.round(Math.max(0, t) * 10) / 10

const buildBody = (
  sessionId: string,
  eventType: string,
  currentTimeSec: number,
  fromTimeSec: number,
  toTimeSec: number,
): PostLecturePlaybackLogBody => ({
  sessionId,
  eventType,
  currentTimeSec: roundSec(currentTimeSec),
  fromTimeSec: roundSec(fromTimeSec),
  toTimeSec: roundSec(toTimeSec),
  playbackRate: PLAYBACK_RATE_FIXED,
  occurredAt: new Date().toISOString(),
})

/**
 * `MediaPlayer` 자식으로 두어야 하며, 내부 `<video>`에 재생/시크 이벤트와 주기(10초) HEARTBEAT 로그를 붙입니다.
 * HEARTBEAT는 재생 중에만 보내고, 일시정지/재생 종료(`ended`) 상태에서는 보내지 않습니다.
 */
export const LecturePlaybackLogBridge = ({ lectureId }: { lectureId: number }) => {
  const player = useMediaPlayer()
  const sessionIdRef = useRef(crypto.randomUUID())
  const lastKnownTimeRef = useRef(0)
  const seekStartRef = useRef<number | null>(null)

  useEffect(() => {
    if (!player) return

    /** 타입 정의에 `querySelector`가 없어 DOM 호스트로 취급 */
    const playerEl = player as unknown as HTMLElement

    const send = (body: PostLecturePlaybackLogBody) => {
      void postLecturePlaybackLog(lectureId, body).catch(() => {})
    }

    let video: HTMLVideoElement | null = null
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null

    const sendExit = () => {
      const v = video
      const t = v ? v.currentTime : lastKnownTimeRef.current
      const body = buildBody(
        sessionIdRef.current,
        'PAGE_EXIT',
        t,
        0,
        0,
      )
      const url = `${API_BASE_URL}/api/lectures/${lectureId}/logs`
      const token = getAccessToken()
      try {
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
          credentials: 'include',
          keepalive: true,
        }).catch(() => {})
      } catch {
        /* ignore */
      }
    }

    const attachToVideo = (el: HTMLVideoElement) => {
      video = el

      const onPlay = () => {
        lastKnownTimeRef.current = el.currentTime
        send(
          buildBody(sessionIdRef.current, 'PLAY', el.currentTime, 0, 0),
        )
      }

      const onPause = () => {
        lastKnownTimeRef.current = el.currentTime
        send(
          buildBody(sessionIdRef.current, 'PAUSE', el.currentTime, 0, 0),
        )
      }

      const onEnded = () => {
        lastKnownTimeRef.current = el.currentTime
        send(
          buildBody(sessionIdRef.current, 'ENDED', el.currentTime, 0, 0),
        )
      }

      const onSeeking = () => {
        seekStartRef.current = roundSec(el.currentTime)
      }

      const onSeeked = () => {
        const fromTime = seekStartRef.current ?? lastKnownTimeRef.current ?? 0
        const toTime = el.currentTime
        send(
          buildBody(sessionIdRef.current, 'SEEK', toTime, fromTime, toTime),
        )
        lastKnownTimeRef.current = toTime
        seekStartRef.current = null
      }

      const onTimeUpdate = () => {
        lastKnownTimeRef.current = el.currentTime
      }

      el.addEventListener('play', onPlay)
      el.addEventListener('pause', onPause)
      el.addEventListener('ended', onEnded)
      el.addEventListener('seeking', onSeeking)
      el.addEventListener('seeked', onSeeked)
      el.addEventListener('timeupdate', onTimeUpdate)

      heartbeatTimer = setInterval(() => {
        if (el.paused || el.ended) return
        lastKnownTimeRef.current = el.currentTime
        send(
          buildBody(
            sessionIdRef.current,
            'HEARTBEAT',
            el.currentTime,
            0,
            0,
          ),
        )
      }, HEARTBEAT_MS)

      return () => {
        el.removeEventListener('play', onPlay)
        el.removeEventListener('pause', onPause)
        el.removeEventListener('ended', onEnded)
        el.removeEventListener('seeking', onSeeking)
        el.removeEventListener('seeked', onSeeked)
        el.removeEventListener('timeupdate', onTimeUpdate)
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer)
          heartbeatTimer = null
        }
      }
    }

    let detachVideo: (() => void) | undefined
    const tryAttach = (): boolean => {
      const el = playerEl.querySelector('video')
      if (!el) return false
      detachVideo = attachToVideo(el)
      return true
    }

    let mo: MutationObserver | null = null
    if (!tryAttach()) {
      mo = new MutationObserver(() => {
        if (tryAttach() && mo) {
          mo.disconnect()
          mo = null
        }
      })
      mo.observe(playerEl, { childList: true, subtree: true })
    }

    window.addEventListener('pagehide', sendExit)

    return () => {
      window.removeEventListener('pagehide', sendExit)
      mo?.disconnect()
      detachVideo?.()
      video = null
    }
  }, [player, lectureId])

  return null
}
