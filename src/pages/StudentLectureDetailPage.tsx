import { useCallback, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import type { TeacherLectureCard } from '../entities/teacher/types'
import { useAuthSession } from '../features/auth/useAuthSession'
import { mapLectureClassToCard } from '../features/teacher/mapLectureClassToCard'
import { mapLectureClipToRow, type TeacherLectureClipRow } from '../features/teacher/mapLectureClipToRow'
import { getLectureClassById, getLectureClassLectures } from '../shared/api/lectureApi'
import { StudentLectureClassDetail } from '../widgets/main/StudentLectureClassDetail'
import type { StudentLectureLocationState } from './studentLectureLocationState'

const CLIP_PAGE_SIZE = 10

export const StudentLectureDetailPage = () => {
  const { lectureClassId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuthSession()
  const fromMyPage = Boolean(
    (location.state as StudentLectureLocationState | null)?.fromMyPage,
  )

  const [lecture, setLecture] = useState<TeacherLectureCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [clips, setClips] = useState<TeacherLectureClipRow[]>([])
  const [clipPageIndex, setClipPageIndex] = useState(0)
  const [clipsTotalElements, setClipsTotalElements] = useState(0)
  const [clipsTotalPages, setClipsTotalPages] = useState(0)
  const [clipsFirst, setClipsFirst] = useState(true)
  const [clipsLast, setClipsLast] = useState(true)
  const [clipsLoading, setClipsLoading] = useState(true)
  const [clipsError, setClipsError] = useState<string | null>(null)

  const loadClips = useCallback(
    async (pageNum: number) => {
      if (!lectureClassId?.trim()) return
      setClipsLoading(true)
      setClipsError(null)
      try {
        const res = await getLectureClassLectures(lectureClassId, {
          page: pageNum,
          size: CLIP_PAGE_SIZE,
        })
        setClips(res.content.map(mapLectureClipToRow))
        setClipPageIndex(res.page)
        setClipsTotalElements(res.totalElements)
        setClipsTotalPages(res.totalPages)
        setClipsFirst(res.first)
        setClipsLast(res.last)
      } catch (e) {
        setClipsError(e instanceof Error ? e.message : '영상 목록을 불러오지 못했습니다.')
      } finally {
        setClipsLoading(false)
      }
    },
    [lectureClassId],
  )

  useEffect(() => {
    void loadClips(0)
  }, [loadClips])

  const clipsPageRangeStart =
    clipsTotalElements === 0 ? 0 : clipPageIndex * CLIP_PAGE_SIZE + 1
  const clipsPageRangeEnd = clipPageIndex * CLIP_PAGE_SIZE + clips.length
  const clipsCurrentPageDisplay =
    clipsTotalElements === 0 ? 0 : clipPageIndex + 1
  const clipsShowPagination = clipsTotalPages > 1
  const clipsCanGoPrev = !clipsFirst
  const clipsCanGoNext = !clipsLast

  const goClipsPrev = () => {
    if (clipsFirst) return
    void loadClips(clipPageIndex - 1)
  }

  const goClipsNext = () => {
    if (clipsLast) return
    void loadClips(clipPageIndex + 1)
  }

  useEffect(() => {
    if (!lectureClassId?.trim()) {
      setLoading(false)
      setNotFound(true)
      return
    }
    let cancelled = false
    void (async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const dto = await getLectureClassById(lectureClassId)
        if (cancelled) return
        setLecture(mapLectureClassToCard(dto))
      } catch {
        if (!cancelled) {
          setLecture(null)
          setNotFound(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [lectureClassId])

  if (!isLoggedIn) {
    return <Navigate replace to="/" />
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-palette-accent/12 p-10 text-center text-sm text-fg-subtle ring-1 ring-palette-primary/12">
        불러오는 중…
      </div>
    )
  }

  if (notFound || !lecture) {
    return (
      <div className="space-y-4 rounded-2xl bg-palette-accent/12 p-8 text-center ring-1 ring-palette-primary/12">
        <p className="text-sm text-fg">강좌를 찾을 수 없습니다.</p>
        <button
          type="button"
          className="rounded-lg bg-palette-primary px-4 py-2 text-sm font-medium text-palette-white hover:bg-palette-primary/90"
          onClick={() => navigate('/', { replace: true })}
        >
          홈으로
        </button>
      </div>
    )
  }

  return (
    <StudentLectureClassDetail
      clips={clips}
      clipsCanGoNext={clipsCanGoNext}
      clipsCanGoPrev={clipsCanGoPrev}
      clipsCurrentPageDisplay={clipsCurrentPageDisplay}
      clipsError={clipsError}
      clipsLoading={clipsLoading}
      clipsPageRangeEnd={clipsPageRangeEnd}
      clipsPageRangeStart={clipsPageRangeStart}
      clipsShowPagination={clipsShowPagination}
      clipsTotalElements={clipsTotalElements}
      clipsTotalPages={clipsTotalPages}
      backLabel={fromMyPage ? '← 마이페이지' : '← 홈'}
      lecture={lecture}
      onBack={() => navigate(fromMyPage ? '/mypage' : '/')}
      onClipWatch={
        fromMyPage
          ? (clip) =>
              navigate(`/lecture/${lecture.id}/clip/${clip.id}/watch`, {
                state: { fromMyPage: true } satisfies StudentLectureLocationState,
              })
          : undefined
      }
      onClipsNext={goClipsNext}
      onClipsPrev={goClipsPrev}
      onRetryClips={() => void loadClips(clipPageIndex)}
    />
  )
}
