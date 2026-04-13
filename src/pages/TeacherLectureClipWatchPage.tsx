import { Trash2, BookType } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import type { LecturePlaybackDto } from '../entities/lecture/types'
import { useAuthSession } from '../features/auth/useAuthSession'
import { deleteLecture, getLecturePlayback } from '../shared/api/lectureApi'
import { resolveApiAssetUrl } from '../shared/lib/resolveApiAssetUrl'
import { LectureVideoPlayer } from '../widgets/teacher/LectureVideoPlayer'

const formatDuration = (seconds: number): string => {
  const s = Math.max(0, Math.floor(seconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

export const TeacherLectureClipWatchPage = () => {
  const { lectureClassId, clipId } = useParams()
  const navigate = useNavigate()
  const { user, isLoggedIn, isHydrated } = useAuthSession()

  const [data, setData] = useState<LecturePlaybackDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [deletePending, setDeletePending] = useState(false)

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

  if (!isHydrated) {
    return (
      <div className="rounded-2xl bg-palette-accent/12 p-10 text-center text-sm text-fg-subtle ring-1 ring-palette-primary/12">
        불러오는 중…
      </div>
    )
  }

  if (!isLoggedIn || user?.role !== 'TEACHER') {
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
          onClick={() => navigate(lectureClassId ? `/teacher/lecture/${lectureClassId}` : '/')}
        >
          {lectureClassId ? '강좌로 돌아가기' : '홈으로'}
        </button>
      </div>
    )
  }

  const videoSrc = resolveApiAssetUrl(data.videoUrl)
  
  const backPath = lectureClassId ? `/teacher/lecture/${lectureClassId}` : '/'

  const handleDelete = async () => {
    if (!clipId?.trim()) return
    if (!window.confirm(`「${data.title}」 영상을 삭제할까요?`)) return
    setDeletePending(true)
    try {
      await deleteLecture(clipId)
      navigate(backPath)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : '삭제에 실패했습니다.')
    } finally {
      setDeletePending(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <button
        type="button"
        className="inline-flex self-start gap-2 text-base font-medium text-fg-subtle underline-offset-4 transition hover:text-palette-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary sm:self-auto"
        onClick={() => navigate(backPath)}
      >
        ← 강좌 상세
        <BookType aria-hidden className="h-6 w-7" strokeWidth={2} />
      </button>

      <section className="rounded-3xl border border-palette-primary/10 bg-gradient-to-br from-palette-accent/20 via-white to-palette-primary/5 p-5 shadow-sm backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-lg bg-palette-primary/10 px-2.5 py-1 text-xs font-semibold text-palette-primary">
                  강의 영상
                </span>
                <span className="inline-flex items-center rounded-lg bg-white/80 px-2.5 py-1 text-xs font-bold text-fg-subtle ring-1 ring-palette-primary/10">
                  영상 길이 {formatDuration(data.durationSeconds)}
                </span>
              </div>

              <h1 className="mt-3 break-words text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                {data.title}
              </h1>
            </div>

            <button
              type="button"
              aria-busy={deletePending}
              disabled={deletePending}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-xl border border-red-200 bg-surface px-3 py-2 text-sm font-medium text-red-700 shadow-sm transition hover:bg-red-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => void handleDelete()}
            >
              <Trash2 aria-hidden className="h-4 w-4 shrink-0" strokeWidth={2} />
              삭제
            </button>
          </div>

          <div className="rounded-2xl border border-palette-primary/10 bg-white/70 px-4 py-3">
            <p className="mb-1 text-medium font-semibold uppercase tracking-wide text-fg-subtle">
              설명
            </p>
            <p className="text-sm leading-7 text-fg">
              {(data.description ?? '').trim() ? data.description : '설명이 없습니다.'}
            </p>
          </div>

          <LectureVideoPlayer
            src={videoSrc}
            title={data.title}
            teacherGuides={data.analysis?.teacherGuides}
            logAnalysis={data.logAnalysis}
          />
        </div>
      </section>
    </div>
  )
}
