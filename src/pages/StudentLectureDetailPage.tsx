import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import type { TeacherLectureCard } from '../entities/teacher/types'
import { useAuthSession } from '../features/auth/useAuthSession'
import { mapLectureClassToCard } from '../features/teacher/mapLectureClassToCard'
import { mapLectureClipToRow, type TeacherLectureClipRow } from '../features/teacher/mapLectureClipToRow'
import type { MainLayoutOutletContext } from '../layouts/mainLayoutContext'
import {
  checkLectureClassEnrollment,
  deleteLectureListEnrollment,
  findLectureListIdForClass,
  getLectureClassById,
  getLectureClassLectures,
  postLectureListEnrollment,
} from '../shared/api/lectureApi'
import { StudentLectureClassDetail } from '../widgets/main/StudentLectureClassDetail'
import type { StudentLectureLocationState } from './studentLectureLocationState'

const CLIP_PAGE_SIZE = 10

export const StudentLectureDetailPage = () => {
  const { lectureClassId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { openLoginModal } = useOutletContext<MainLayoutOutletContext>()
  const { user, isLoggedIn, isHydrated } = useAuthSession()
  const fromMyPage = Boolean(
    (location.state as StudentLectureLocationState | null)?.fromMyPage,
  )

  const isStudent = user?.role === 'STUDENT'
  const showEnrollmentCta = !isLoggedIn || isStudent

  /** 학생만 조회: null = 확인 중, true/false = 결과 */
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null)
  const [lectureListId, setLectureListId] = useState<number | null>(null)
  const [enrollSubmitting, setEnrollSubmitting] = useState(false)
  const [cancelSubmitting, setCancelSubmitting] = useState(false)
  const [enrollError, setEnrollError] = useState<string | null>(null)

  useEffect(() => {
    setEnrollError(null)
  }, [lectureClassId])

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

  useEffect(() => {
    if (!lectureClassId?.trim() || !isLoggedIn || !isStudent) {
      setIsEnrolled(null)
      setLectureListId(null)
      return
    }
    let cancelled = false
    setIsEnrolled(null)
    setLectureListId(null)
    void (async () => {
      try {
        const res = await checkLectureClassEnrollment(lectureClassId)
        if (cancelled) return
        setIsEnrolled(res.isEnrolled)
        let listId = res.lectureListId ?? null
        const classNum = Number(lectureClassId)
        if (res.isEnrolled && listId == null && Number.isFinite(classNum)) {
          listId = await findLectureListIdForClass(classNum)
        }
        if (!cancelled) setLectureListId(listId)
      } catch {
        if (!cancelled) {
          setIsEnrolled(false)
          setLectureListId(null)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [lectureClassId, isLoggedIn, isStudent])

  const handleEnroll = useCallback(async () => {
    if (!lectureClassId?.trim()) return
    const id = Number(lectureClassId)
    if (!Number.isFinite(id)) {
      setEnrollError('강좌 정보가 올바르지 않습니다.')
      return
    }
    setEnrollSubmitting(true)
    setEnrollError(null)
    try {
      await postLectureListEnrollment({ lectureClassId: id })
      const check = await checkLectureClassEnrollment(lectureClassId)
      setIsEnrolled(check.isEnrolled)
      let listId = check.lectureListId ?? null
      if (check.isEnrolled && listId == null) {
        listId = await findLectureListIdForClass(id)
      }
      setLectureListId(listId)
    } catch (e) {
      setEnrollError(e instanceof Error ? e.message : '수강 신청에 실패했습니다.')
    } finally {
      setEnrollSubmitting(false)
    }
  }, [lectureClassId])

  const handleCancelEnrollment = useCallback(async () => {
    if (!lectureClassId?.trim()) return
    const classId = Number(lectureClassId)
    if (!Number.isFinite(classId)) {
      setEnrollError('강좌 정보가 올바르지 않습니다.')
      return
    }
    setCancelSubmitting(true)
    setEnrollError(null)
    try {
      let id = lectureListId
      if (id == null) {
        id = await findLectureListIdForClass(classId)
        if (id != null) setLectureListId(id)
      }
      if (id == null) {
        setEnrollError('수강 취소에 필요한 정보를 찾지 못했습니다.')
        return
      }
      await deleteLectureListEnrollment(id)
      setIsEnrolled(false)
      setLectureListId(null)
    } catch (e) {
      setEnrollError(e instanceof Error ? e.message : '수강 취소에 실패했습니다.')
    } finally {
      setCancelSubmitting(false)
    }
  }, [lectureClassId, lectureListId])

  const enrollmentCta = useMemo(() => {
    if (!showEnrollmentCta) return undefined
    if (!isLoggedIn) {
      return {
        phase: 'guest' as const,
        onClick: () => openLoginModal(),
      }
    }
    if (isStudent && isEnrolled === null) {
      return {
        phase: 'loading' as const,
        onClick: () => {},
      }
    }
    if (isEnrolled) {
      return {
        phase: 'enrolled' as const,
        onClick: () => {},
        onCancelEnrollment: () => {
          void handleCancelEnrollment()
        },
        cancelSubmitting,
      }
    }
    return {
      phase: 'enroll' as const,
      onClick: () => {
        void handleEnroll()
      },
      submitting: enrollSubmitting,
    }
  }, [
    showEnrollmentCta,
    isLoggedIn,
    isStudent,
    isEnrolled,
    openLoginModal,
    handleEnroll,
    enrollSubmitting,
    handleCancelEnrollment,
    cancelSubmitting,
  ])

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
      enrollmentCta={enrollmentCta}
      enrollmentError={enrollError}
      onClipWatch={(clip) => {
        if (!isEnrolled) {
          alert('수강 중인 강좌가 아닙니다. 먼저 수강 신청을 해주세요.')
          return
        }

        navigate(`/lecture/${lecture.id}/clip/${clip.id}/watch`, {
          state: fromMyPage
            ? ({ fromMyPage: true } satisfies StudentLectureLocationState)
            : undefined,
        })
      }}
      onClipsNext={goClipsNext}
      onClipsPrev={goClipsPrev}
      onRetryClips={() => void loadClips(clipPageIndex)}
    />
  )
}
