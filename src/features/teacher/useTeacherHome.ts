import { useCallback, useEffect, useMemo, useState } from 'react'
import type { TeacherHomeModel, TeacherLectureCard, TeacherLectureCreatePayload } from '../../entities/teacher/types'
import { getLectureClasses, postLectureClass } from '../../shared/api/lectureApi'
import { mapLectureClassToCard } from './mapLectureClassToCard'

const VISIBLE_TEACHER_LECTURES = 10

export interface UseTeacherHomeResult {
  model: TeacherHomeModel
  displayedLectures: TeacherHomeModel['uploadedLectures']
  totalLectures: number
  showArrows: boolean
  canGoPrev: boolean
  canGoNext: boolean
  goPrev: () => void
  goNext: () => void
  /** 하단 페이지 안내 (1-based, 전체 0이면 0) */
  pageRangeStart: number
  pageRangeEnd: number
  currentPage: number
  totalPages: number
  addLecture: (payload: TeacherLectureCreatePayload) => Promise<void>
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useTeacherHome = (): UseTeacherHomeResult => {
  const [uploadedLectures, setUploadedLectures] = useState<TeacherLectureCard[]>([])
  const [start, setStart] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const items = await getLectureClasses()
      setUploadedLectures(items.map(mapLectureClassToCard))
      setStart(0)
    } catch (e) {
      setError(e instanceof Error ? e.message : '강의 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const model = useMemo<TeacherHomeModel>(() => ({ uploadedLectures }), [uploadedLectures])

  const totalLectures = uploadedLectures.length
  const maxStart =
    totalLectures <= VISIBLE_TEACHER_LECTURES
      ? 0
      : VISIBLE_TEACHER_LECTURES * Math.floor((totalLectures - 1) / VISIBLE_TEACHER_LECTURES)

  const displayedLectures = useMemo(
    () => uploadedLectures.slice(start, start + VISIBLE_TEACHER_LECTURES),
    [uploadedLectures, start],
  )

  const addLecture = useCallback(async (payload: TeacherLectureCreatePayload) => {
    const created = await postLectureClass(payload)
    setUploadedLectures((prev) => [...prev, mapLectureClassToCard(created)])
  }, [])

  const showArrows = totalLectures > VISIBLE_TEACHER_LECTURES
  const canGoPrev = start > 0
  const canGoNext = start + VISIBLE_TEACHER_LECTURES < totalLectures

  const goPrev = useCallback(() => {
    setStart((s) => Math.max(0, s - VISIBLE_TEACHER_LECTURES))
  }, [])

  const goNext = useCallback(() => {
    setStart((s) => Math.min(maxStart, s + VISIBLE_TEACHER_LECTURES))
  }, [maxStart])

  const pageRangeStart = totalLectures === 0 ? 0 : start + 1
  const pageRangeEnd = Math.min(start + VISIBLE_TEACHER_LECTURES, totalLectures)
  const currentPage = totalLectures === 0 ? 0 : Math.floor(start / VISIBLE_TEACHER_LECTURES) + 1
  const totalPages = totalLectures === 0 ? 0 : Math.ceil(totalLectures / VISIBLE_TEACHER_LECTURES)

  return {
    model,
    displayedLectures,
    totalLectures,
    showArrows,
    canGoPrev,
    canGoNext,
    goPrev,
    goNext,
    pageRangeStart,
    pageRangeEnd,
    currentPage,
    totalPages,
    addLecture,
    loading,
    error,
    refetch,
  }
}
