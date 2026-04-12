import { useEffect, useState } from 'react'
import { useMediaRemote } from '@vidstack/react'

import { getLectureLastPosition } from '../../shared/api/lectureApi'

const formatPositionLabel = (totalSec: number): string => {
  const s = Math.max(0, Math.floor(totalSec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}분 ${String(r).padStart(2, '0')}초`
}

/**
 * 끝나기 이 초 안에 있으면 시청 완료로 간주 (로그·재생 시점 오차 대비, 기존 0.5초 → 여유 확대).
 * 남은 재생 시간 `durationSec - lastSec` 기준.
 */
const RESUME_COMPLETED_MARGIN_SEC = 5

const isWatchCompleted = (lastSec: number, durationSec: number): boolean => {
  if (durationSec <= 0) return false
  if (lastSec >= durationSec) return true
  const remaining = durationSec - lastSec
  return remaining <= RESUME_COMPLETED_MARGIN_SEC
}

const shouldOfferResume = (
  lastSec: number,
  sessionId: string | null,
  durationSec: number,
): boolean => {
  if (durationSec <= 0 || sessionId == null || lastSec <= 0) return false
  if (isWatchCompleted(lastSec, durationSec)) return false
  return true
}

type Phase = 'loading' | 'idle' | 'prompt'

/**
 * `MediaPlayer` 자식으로 두며, 마지막 시청 위치가 있으면 이어 보기 확인 UI를 띄웁니다.
 */
export const LectureResumePlaybackBridge = ({
  lectureId,
  durationSeconds,
}: {
  lectureId: number
  durationSeconds: number
}) => {
  const remote = useMediaRemote()
  const [phase, setPhase] = useState<Phase>('loading')
  const [lastSec, setLastSec] = useState(0)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const data = await getLectureLastPosition(lectureId)
        if (cancelled) return
        if (shouldOfferResume(data.lastPositionSec, data.sessionId, durationSeconds)) {
          setLastSec(data.lastPositionSec)
          setPhase('prompt')
        } else {
          setPhase('idle')
        }
      } catch {
        if (!cancelled) setPhase('idle')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [lectureId, durationSeconds])

  useEffect(() => {
    if (phase === 'prompt') {
      remote.pause()
    }
  }, [phase, remote])

  const handleResume = () => {
    remote.seek(lastSec)
    remote.play()
    setPhase('idle')
  }

  const handleStartOver = () => {
    remote.seek(0)
    setPhase('idle')
  }

  if (phase !== 'prompt') return null

  return (
    <div
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-playback-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-palette-primary/20 bg-surface px-5 py-5 shadow-xl ring-1 ring-palette-primary/15">
        <h2 id="resume-playback-title" className="text-base font-semibold text-fg">
          이전 시청 위치
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-subtle">
          <span className="font-medium text-fg">{formatPositionLabel(lastSec)}</span>까지 시청하셨습니다.
          <br />
          이 지점부터 재생할까요?
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="rounded-lg border border-palette-primary/25 bg-surface px-4 py-2.5 text-sm font-medium text-fg transition hover:bg-palette-accent/20"
            onClick={handleStartOver}
          >
            처음부터
          </button>
          <button
            type="button"
            className="rounded-lg bg-palette-primary px-4 py-2.5 text-sm font-medium text-palette-white transition hover:bg-palette-primary/90"
            onClick={handleResume}
          >
            이어서 보기
          </button>
        </div>
      </div>
    </div>
  )
}
