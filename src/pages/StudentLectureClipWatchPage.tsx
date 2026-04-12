import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import type { LecturePlaybackDto } from '../entities/lecture/types'
import { useAuthSession } from '../features/auth/useAuthSession'
import { getLecturePlayback } from '../shared/api/lectureApi'
import { resolveApiAssetUrl } from '../shared/lib/resolveApiAssetUrl'
import { StudentLectureVideoPlayer } from '../widgets/student/StudentLectureVideoPlayer'
import type { StudentLectureLocationState } from './studentLectureLocationState'
import { BookType, AlarmClock, Star, BotMessageSquare, FileText } from 'lucide-react'

const formatDuration = (seconds: number): string => {
  const s = Math.max(0, Math.floor(seconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

const parseSummaryKeywords = (raw: string | null | undefined): string[] => {
  if (raw == null || !String(raw).trim()) return []
  return String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export const StudentLectureClipWatchPage = () => {
  const { lectureClassId, clipId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuthSession()
  const fromMyPage = Boolean(
    (location.state as StudentLectureLocationState | null)?.fromMyPage,
  )

  const [data, setData] = useState<LecturePlaybackDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!clipId?.trim()) {
      setLoading(false)
      setNotFound(true)
      return
    }
    let cancelled = false
    void (async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const dto = await getLecturePlayback(clipId)
        if (cancelled) return
        setData(dto)
      } catch {
        if (!cancelled) {
          setData(null)
          setNotFound(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [clipId])

  if (!isLoggedIn) {
    return <Navigate replace to="/" />
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-palette-accent/12 p-10 text-center text-sm text-fg-subtle ring-1 ring-palette-primary/12">
        영상을 불러오는 중…
      </div>
    )
  }

  if (notFound || !data) {
    return (
      <div className="space-y-4 rounded-2xl bg-palette-accent/12 p-8 text-center ring-1 ring-palette-primary/12">
        <p className="text-sm text-fg">영상을 찾을 수 없습니다.</p>
        <button
          type="button"
          className="rounded-lg bg-palette-primary px-4 py-2 text-sm font-medium text-palette-white hover:bg-palette-primary/90"
          onClick={() =>
            navigate(
              lectureClassId
                ? `/lecture/${lectureClassId}`
                : '/',
              {
                replace: true,
                state: fromMyPage ? ({ fromMyPage: true } satisfies StudentLectureLocationState) : undefined,
              },
            )
          }
        >
          {lectureClassId ? '강좌 상세로' : '홈으로'}
        </button>
      </div>
    )
  }

  const videoSrc = resolveApiAssetUrl(data.videoUrl)
  const lectureDetailPath = lectureClassId ? `/lecture/${lectureClassId}` : '/'
  const backState: StudentLectureLocationState | undefined = fromMyPage
    ? { fromMyPage: true }
    : undefined

  const keywordList = parseSummaryKeywords(data.summaryKeywords)
  const descriptionText = (data.description ?? '').trim()
  const summaryTextTrimmed = (data.summaryText ?? '').trim()

  return (
    <div className="space-y-6">
      <button
        type="button"
        className="inline-flex self-start gap-2 text-sm font-medium text-fg-subtle underline-offset-4 transition hover:text-palette-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary sm:self-auto"
        onClick={() => navigate(lectureDetailPath, { state: backState })}
      >
        ← 강좌 상세
        <BookType aria-hidden className="h-5 w-6" strokeWidth={2} />
      </button>

      <section className="rounded-3xl border border-palette-primary/10 bg-gradient-to-br from-palette-accent/20 via-white to-palette-primary/5 p-5 shadow-sm backdrop-blur-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">{data.title}</h1>
            </div>

            <div className="shrink-0">
              <div className="inline-flex items-center gap-2 rounded-xl border border-palette-primary/12 bg-white/80 px-3 py-2 text-sm font-medium text-fg shadow-sm ring-1 ring-palette-primary/8">
                <span className="flex h-8 w-15 items-center justify-center rounded-lg bg-palette-primary/10 text-palette-primary">
                  <AlarmClock className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold tracking-wide text-fg-subtle">
                    영상 길이
                  </span>
                  <span className="text-sm font-semibold text-fg">
                    {formatDuration(data.durationSeconds)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {keywordList.length > 0 ? (
          <div className="mb-4 rounded-2xl border border-amber-200/50 bg-amber-50/80 p-4 shadow-sm ring-1 ring-amber-100">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-200 text-amber-600">
                <Star className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-fg">핵심 키워드</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywordList.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex rounded-full border border-amber-200 bg-amber-200/60 px-3 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-100"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mb-4 rounded-2xl border border-palette-primary/12 bg-white/75 p-4 shadow-sm ring-1 ring-palette-primary/8">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-palette-primary/10 text-palette-primary">
            <FileText className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold text-fg">설명</p>
        </div>

        <p className="text-sm leading-7 text-fg">
          {descriptionText ? descriptionText : '설명이 없습니다.'}
        </p>
      </div>

        {summaryTextTrimmed ? (
          <div className="mb-6 rounded-2xl border border-violet-300/60 bg-violet-50/70 p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <BotMessageSquare className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-fg">AI 요약</p>
            </div>

            <p className="text-sm leading-7 text-fg">{summaryTextTrimmed}</p>
          </div>
        ) : null}

        <StudentLectureVideoPlayer
          lectureId={data.lectureId}
          durationSeconds={data.durationSeconds}
          src={videoSrc}
          title={data.title}
          segments={data.segments}
          transcriptLanguage={data.transcriptLanguage}
          quizzes={data.analysis?.quizzes}
        />
      </section>
    </div>
  )
}
