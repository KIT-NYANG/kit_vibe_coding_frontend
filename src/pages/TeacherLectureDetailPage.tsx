import { useCallback, useEffect, useState, useRef } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import type { TeacherLectureCard } from '../entities/teacher/types'
import { useAuthSession } from '../features/auth/useAuthSession'
import { mapLectureClassToCard } from '../features/teacher/mapLectureClassToCard'
import { mapLectureClipToRow, type TeacherLectureClipRow } from '../features/teacher/mapLectureClipToRow'
import {
  deleteLecture,
  deleteLectureClass,
  getLectureClassById,
  getLectureClassLectures,
  postLecture,
} from '../shared/api/lectureApi'
import { AddLectureClipModal } from '../widgets/teacher/AddLectureClipModal'
import { TeacherLectureDetail } from '../widgets/teacher/TeacherLectureDetail'

const CLIP_PAGE_SIZE = 10

export const TeacherLectureDetailPage = () => {
  const { lectureId } = useParams()
  const navigate = useNavigate()
  const { user, isLoggedIn, isHydrated } = useAuthSession()

  const pollingRef = useRef<number | null>(null)

  const [lecture, setLecture] = useState<TeacherLectureCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [deletePending, setDeletePending] = useState(false)

  const [clips, setClips] = useState<TeacherLectureClipRow[]>([])
  const [clipPageIndex, setClipPageIndex] = useState(0)
  const [clipsTotalElements, setClipsTotalElements] = useState(0)
  const [clipsTotalPages, setClipsTotalPages] = useState(0)
  const [clipsFirst, setClipsFirst] = useState(true)
  const [clipsLast, setClipsLast] = useState(true)
  const [clipsLoading, setClipsLoading] = useState(true)
  const [clipsError, setClipsError] = useState<string | null>(null)

  const [addClipOpen, setAddClipOpen] = useState(false)

  const loadClips = useCallback(
    async (pageNum: number, silent = false) => {
      if (!lectureId?.trim()) return

      if (!silent) {
        setClipsLoading(true)
      }

      if (!silent) {
        setClipsError(null)
      }

      try {
        const res = await getLectureClassLectures(lectureId, {
          page: pageNum,
          size: CLIP_PAGE_SIZE,
        })

        setClips(res.content.map(mapLectureClipToRow))
        setClipPageIndex(res.page)
        setClipsTotalElements(res.totalElements)
        setClipsTotalPages(res.totalPages)
        setClipsFirst(res.first)
        setClipsLast(res.last)

        if (!silent) {
          setClipsError(null)
        }
      } catch (e) {
        if (!silent) {
          setClipsError(e instanceof Error ? e.message : '영상 목록을 불러오지 못했습니다.')
        }
      } finally {
        if (!silent) {
          setClipsLoading(false)
        }
      }
    },
    [lectureId],
  )

  useEffect(() => {
    void loadClips(0, false)
  }, [loadClips])

  useEffect(() => {
    const hasProcessingClip = clips.some((clip) => clip.sttStatus === 'PROCESSING')

    if (!hasProcessingClip) {
      if (pollingRef.current !== null) {
        window.clearInterval(pollingRef.current)
        pollingRef.current = null
      }
      return
    }

    if (pollingRef.current !== null) return

    pollingRef.current = window.setInterval(() => {
      void loadClips(clipPageIndex, true)
    }, 5000)

    return () => {
      if (pollingRef.current !== null) {
        window.clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [clips, clipPageIndex, loadClips])

  useEffect(() => {
    return () => {
      if (pollingRef.current !== null) {
        window.clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [])

  const clipsPageRangeStart = clipsTotalElements === 0 ? 0 : clipPageIndex * CLIP_PAGE_SIZE + 1
  const clipsPageRangeEnd = clipPageIndex * CLIP_PAGE_SIZE + clips.length
  const clipsCurrentPageDisplay = clipsTotalElements === 0 ? 0 : clipPageIndex + 1
  const clipsShowPagination = clipsTotalPages > 1
  const clipsCanGoPrev = !clipsFirst
  const clipsCanGoNext = !clipsLast

  const goClipsPrev = () => {
    if (clipsFirst) return
    void loadClips(clipPageIndex - 1, false)
  }

  const goClipsNext = () => {
    if (clipsLast) return
    void loadClips(clipPageIndex + 1, false)
  }

  useEffect(() => {
    if (!lectureId?.trim()) {
      setLoading(false)
      setNotFound(true)
      return
    }

    let cancelled = false

    void (async () => {
      setLoading(true)
      setNotFound(false)

      try {
        const dto = await getLectureClassById(lectureId)
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
  }, [lectureId])

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
        불러오는 중…
      </div>
    )
  }

  if (notFound || !lecture) {
    return (
      <div className="space-y-4 rounded-2xl bg-palette-accent/12 p-8 text-center ring-1 ring-palette-primary/12">
        <p className="text-sm text-fg">강의를 찾을 수 없습니다.</p>
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

  const handleDelete = async () => {
    if (!window.confirm(`「${lecture.title}」 강의를 삭제할까요?`)) return

    setDeletePending(true)
    try {
      await deleteLectureClass(lecture.id)
      navigate('/', { replace: true })
    } catch (e) {
      window.alert(e instanceof Error ? e.message : '삭제에 실패했습니다.')
    } finally {
      setDeletePending(false)
    }
  }

  const handleDeleteFailedClip = async (clip: TeacherLectureClipRow) => {
    if (!window.confirm('AI 분석에 실패한 영상을 삭제할까요?')) return
    try {
      await deleteLecture(clip.id)
      await loadClips(clipPageIndex)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : '영상 삭제에 실패했습니다.')
    }
  }

  const lectureClassIdNumber = Number(lecture.id)

  return (
    <>
      <TeacherLectureDetail
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
        deletePending={deletePending}
        lecture={lecture}
        onAddClipClick={() => setAddClipOpen(true)}
        onBack={() => navigate('/')}
        onClipClick={(clip) => navigate(`/teacher/lecture/${lecture.id}/clip/${clip.id}`)}
        onFailedClipDelete={handleDeleteFailedClip}
        onClipsNext={goClipsNext}
        onClipsPrev={goClipsPrev}
        onDeleteClick={handleDelete}
        onRetryClips={() => void loadClips(clipPageIndex, false)}
      />

      <AddLectureClipModal
        lectureClassId={lectureClassIdNumber}
        open={addClipOpen}
        onClose={() => setAddClipOpen(false)}
        onSubmit={async (payload) => {
          await postLecture(payload)
          await loadClips(0, false)
        }}
      />
    </>
  )
}