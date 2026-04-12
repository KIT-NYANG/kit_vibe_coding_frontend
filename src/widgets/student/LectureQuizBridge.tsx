import type { MouseEvent as ReactMouseEvent } from 'react'
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMediaPlayer, useMediaRemote, useMediaStore } from '@vidstack/react'

import type { LecturePlaybackQuizDto } from '../../entities/lecture/types'

/** Vidstack remote.play() 만으로는 재개가 막히는 경우가 있어 네이티브 video.play() 로 보강 */
const playNativeVideoIfPaused = (player: ReturnType<typeof useMediaPlayer>) => {
  const root = player as unknown as HTMLElement | null
  const vid = root?.querySelector?.('video') as HTMLVideoElement | undefined
  if (vid && vid.paused) {
    void vid.play().catch(() => {})
  }
}

type QuizPhase = 'pick' | 'wrongExplain'

/** 이미 이 초 이내면 seek 생략 — 동일 위치 시크로 SEEK 로그만 나오는 것 방지 */
const QUIZ_SEEK_EPS_SEC = 0.35

const parseOx = (answer: string): 'O' | 'X' => {
  const a = answer.trim().toUpperCase()
  if (a === 'X') return 'X'
  return 'O'
}

/**
 * `analysis.quizzes` — `quizInsertTimeSec`에 재생을 멈추고 O/X 퀴즈 표시.
 * `MediaPlayer` 자식으로 둡니다.
 */
export const LectureQuizBridge = ({ quizzes }: { quizzes: LecturePlaybackQuizDto[] }) => {
  const player = useMediaPlayer()
  const remote = useMediaRemote()
  const { currentTime } = useMediaStore()
  const prevTimeRef = useRef(0)
  const shownIndicesRef = useRef<Set<number>>(new Set())

  const [active, setActive] = useState<LecturePlaybackQuizDto | null>(null)
  const [phase, setPhase] = useState<QuizPhase>('pick')

  const sorted = useMemo(
    () => [...quizzes].sort((a, b) => a.quizInsertTimeSec - b.quizInsertTimeSec),
    [quizzes],
  )

  useEffect(() => {
    if (sorted.length === 0 || active) return

    const prev = prevTimeRef.current
    const curr = currentTime

    for (let i = 0; i < sorted.length; i++) {
      if (shownIndicesRef.current.has(i)) continue
      const t = sorted[i].quizInsertTimeSec
      if (prev < t && curr >= t) {
        shownIndicesRef.current.add(i)
        remote.pause()
        if (Math.abs(curr - t) > QUIZ_SEEK_EPS_SEC) {
          remote.seek(t)
        }
        startTransition(() => {
          setActive(sorted[i])
          setPhase('pick')
        })
        prevTimeRef.current = curr
        return
      }
    }

    prevTimeRef.current = curr
  }, [currentTime, sorted, active, remote])

  const resumeAfterDismiss = useCallback(
    (e?: ReactMouseEvent<HTMLButtonElement>) => {
      const trigger = e?.nativeEvent
      // 사용자 클릭과 같은 태스크에서 먼저 재생 시도 (브라우저 자동재생 정책)
      if (trigger) remote.play(trigger)
      else remote.play()
      playNativeVideoIfPaused(player)

      setActive(null)
      setPhase('pick')
    },
    [player, remote],
  )

  const handleChoice = (choice: 'O' | 'X', e: ReactMouseEvent<HTMLButtonElement>) => {
    if (!active) return
    const correct = parseOx(active.answer)
    if (choice === correct) {
      resumeAfterDismiss(e)
      return
    }
    setPhase('wrongExplain')
  }

  if (!active) return null

  return (
    <div
      className="absolute inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lecture-quiz-title"
    >
      <div className="max-h-[min(90vh,32rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-palette-primary/20 bg-surface px-5 py-5 shadow-xl ring-1 ring-palette-primary/15">
        {phase === 'pick' ? (
          <>
            <p id="lecture-quiz-title" className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
              퀴즈
            </p>
            <p className="mt-2 text-base font-medium leading-snug text-fg">{active.question}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-xl border-2 border-palette-primary/30 bg-palette-accent/15 py-4 text-lg font-bold text-fg transition hover:border-palette-primary hover:bg-palette-accent/25"
                onClick={(ev) => handleChoice('O', ev)}
              >
                O
              </button>
              <button
                type="button"
                className="rounded-xl border-2 border-palette-primary/30 bg-palette-accent/15 py-4 text-lg font-bold text-fg transition hover:border-palette-primary hover:bg-palette-accent/25"
                onClick={(ev) => handleChoice('X', ev)}
              >
                X
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-palette-primary">오답</p>
            <p className="mt-2 text-sm leading-relaxed text-fg">{active.explanation}</p>
            {active.supplementalDescription ? (
              <p className="mt-3 text-sm leading-relaxed text-fg-subtle">{active.supplementalDescription}</p>
            ) : null}
            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-palette-primary px-4 py-2.5 text-sm font-medium text-palette-white transition hover:bg-palette-primary/90"
              onClick={resumeAfterDismiss}
            >
              확인
            </button>
          </>
        )}
      </div>
    </div>
  )
}
