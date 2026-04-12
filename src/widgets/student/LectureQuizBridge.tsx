import type { MouseEvent as ReactMouseEvent } from 'react'
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMediaPlayer, useMediaRemote, useMediaStore } from '@vidstack/react'

import type { LecturePlaybackQuizDto } from '../../entities/lecture/types'
import { Bot, BotMessageSquare } from 'lucide-react'

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
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-palette-primary/15 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)] ring-1 ring-palette-primary/10">
        {phase === 'pick' ? (
          <>
          <div className="border-b border-palette-primary/10 bg-palette-primary/20 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-palette-primary/10 text-palette-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p id="lecture-quiz-title"
                  className="text-s font-semibold text-fg-subtle"
                >
                  돌발 QUIZ
                </p>
                <p className="mt-0.5 text-xs font-medium text-fg-subtle">
                영상을 잠시 멈추고 정답을 골라보세요
              </p>
            </div>
          </div>
        </div>

          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="rounded-2xl border border-palette-primary/10 bg-palette-accent/10 px-4 py-4">
              <p className="text-base font-semibold leading-7 text-fg sm:text-lg">
                {active.question}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="group rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-center transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                onClick={(ev) => handleChoice('O', ev)}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl font-extrabold text-emerald-700">O</span>
                  <span className="text-xs font-medium text-emerald-700/80">맞다고 생각해요</span>
                </div>
              </button>

              <button
                type="button"
                className="group rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-center transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
                onClick={(ev) => handleChoice('X', ev)}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl font-extrabold text-rose-700">X</span>
                  <span className="text-xs font-medium text-rose-700/80">틀렸다고 생각해요</span>
                </div>
              </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-rose-200/70 bg-rose-50/100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-s font-semibold text-rose-500">오답</p>
                  <p className="mt-0.5 text-xs font-medium text-fg-subtle">
                      해설을 확인하고 다시 이어서 시청해보세요
                    </p>
                  </div>
                </div>
              </div>
            
              <div className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="rounded-2xl border border-rose-100 bg-rose-100 px-4 py-4 text-center">
                  <p className="text-sm leading-7 text-fg">{active.explanation}</p>
                </div>

            {active.supplementalDescription ? (
              <div className="mt-3 rounded-2xl border border-palette-primary/10 bg-white px-4 py-4 ring-1 ring-palette-primary/6">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-palette-primary/10 text-palette-primary">
                    <BotMessageSquare className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold tracking-wide text-fg-subtle">
                    추가 설명
                  </p>
                </div>
                <p className="text-sm leading-7 text-fg-subtle">
                  {active.supplementalDescription}
                </p>
              </div>
            ) : null}

            <button
              type="button"
              className="mt-6 w-full rounded-2xl bg-palette-primary px-4 py-3 text-sm font-semibold text-palette-white shadow-sm transition hover:bg-palette-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary"
              onClick={resumeAfterDismiss}
            >
              확인하고 계속 보기
            </button>
          </div>
          </>
        )}
      </div>
    </div>
  )
}
