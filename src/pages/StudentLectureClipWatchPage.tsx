import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import type { LecturePlaybackDto } from '../entities/lecture/types'
import { useAuthSession } from '../features/auth/useAuthSession'
import { getLecturePlayback } from '../shared/api/lectureApi'
import { resolveApiAssetUrl } from '../shared/lib/resolveApiAssetUrl'
import { StudentLectureVideoPlayer } from '../widgets/student/StudentLectureVideoPlayer'
import type { StudentLectureLocationState } from './studentLectureLocationState'

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
        className="text-sm font-medium text-fg-subtle underline-offset-4 transition hover:text-palette-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary"
        onClick={() => navigate(lectureDetailPath, { state: backState })}
      >
        ← 강좌 상세
      </button>

      <section className="rounded-2xl bg-palette-accent/12 p-5 ring-1 ring-palette-primary/12 sm:p-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-row flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="min-w-0 text-xl font-bold text-fg sm:text-2xl">{data.title}</h1>
            <p className="shrink-0 text-xs text-fg-subtle sm:text-sm">
              재생 시간 {formatDuration(data.durationSeconds)}
            </p>
          </div>
        </div>

        {keywordList.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {keywordList.map((kw) => (
              <span
                key={kw}
                className="inline-flex rounded-full border border-palette-primary/25 bg-surface px-2.5 py-1 text-xs font-medium text-fg ring-1 ring-palette-primary/10"
              >
                {kw}
              </span>
            ))}
          </div>
        ) : null}

        <p className="mb-4 text-sm leading-relaxed text-fg">
          {descriptionText ? descriptionText : '설명이 없습니다.'}
        </p>

        {summaryTextTrimmed ? (
          <div className="mb-6 rounded-xl border border-palette-primary/15 bg-surface/80 px-4 py-3 ring-1 ring-palette-primary/10">
            <p className="mb-1 text-xs font-semibold text-fg-subtle">요약</p>
            <p className="text-sm leading-relaxed text-fg">{summaryTextTrimmed}</p>
          </div>
        ) : null}

        <StudentLectureVideoPlayer
          lectureId={data.lectureId}
          durationSeconds={data.durationSeconds}
          src={videoSrc}
          title={data.title}
          segments={data.segments}
          transcriptLanguage={data.transcriptLanguage}
        />
      </section>
    </div>
  )
}
