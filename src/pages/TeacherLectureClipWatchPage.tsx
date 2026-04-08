import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import type { LecturePlaybackDto } from '../entities/lecture/types'
import { useAuthSession } from '../features/auth/useAuthSession'
import { getLecturePlayback } from '../shared/api/lectureApi'
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
  const { user, isLoggedIn } = useAuthSession()

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

  return (
    <div className="space-y-6">
      <button
        type="button"
        className="text-sm font-medium text-fg-subtle underline-offset-4 transition hover:text-palette-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary"
        onClick={() => navigate(backPath)}
      >
        ← 강좌 상세
      </button>

      <section className="rounded-2xl bg-palette-accent/12 p-5 ring-1 ring-palette-primary/12 sm:p-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="text-xl font-bold text-fg sm:text-2xl">{data.title}</h1>
          <p className="text-xs text-fg-subtle sm:text-sm">
            재생 시간 {formatDuration(data.durationSeconds)}
          </p>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-fg">
          {data.description.trim() ? data.description : '설명이 없습니다.'}
        </p>

        <LectureVideoPlayer src={videoSrc} title={data.title} />
      </section>
    </div>
  )
}
