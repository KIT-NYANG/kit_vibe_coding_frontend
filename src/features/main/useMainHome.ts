import { useCallback, useMemo, useState } from 'react'
import type { MainHomeModel } from '../../entities/main/types'
import { mainHomeData } from './mainHomeData'

/** 한 번에 보이는 강의 카드 수 (와이어프레임 5열) */
export const VISIBLE_LECTURE_COUNT = 5

export interface UseMainHomeResult {
  model: MainHomeModel
  currentSlideLine: string
  goPrevSlide: () => void
  goNextSlide: () => void
  selectedCategoryId: string
  /** 칩 선택 시 강의 슬라이드 시작 위치도 0으로 맞춤 */
  selectCategory: (id: string) => void
  /** 현재 윈도우에 보이는 강의 (최대 5개) */
  displayedLectures: MainHomeModel['lectures']
  /** 선택된 카테고리의 강의 총 개수 */
  totalLecturesInCategory: number
  /** 총 개수가 5 초과일 때만 화살표 표시 */
  showLectureArrows: boolean
  canGoPrevLectures: boolean
  canGoNextLectures: boolean
  goPrevLectures: () => void
  goNextLectures: () => void
  selectedCategoryLabel: string
}

export const useMainHome = (): UseMainHomeResult => {
  const model = useMemo(() => mainHomeData, [])
  const [slideIndex, setSlideIndex] = useState(0)
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    () => model.categories[0]?.id ?? '',
  )
  const [lectureWindowStart, setLectureWindowStart] = useState(0)

  const slideCount = model.heroSlides.length

  const goPrevSlide = useCallback(() => {
    if (slideCount === 0) return
    setSlideIndex((i) => (i - 1 + slideCount) % slideCount)
  }, [slideCount])

  const goNextSlide = useCallback(() => {
    if (slideCount === 0) return
    setSlideIndex((i) => (i + 1) % slideCount)
  }, [slideCount])

  const currentSlideLine = model.heroSlides[slideIndex]?.line ?? ''

  const lecturesForCategory = useMemo(
    () => model.lectures.filter((l) => l.categoryId === selectedCategoryId),
    [model.lectures, selectedCategoryId],
  )

  const totalLecturesInCategory = lecturesForCategory.length
  /** 5개씩 넘길 때 마지막 페이지 시작 인덱스 (8개 → 0, 5 / 11개 → 0, 5, 10) */
  const maxLectureStart =
    totalLecturesInCategory <= VISIBLE_LECTURE_COUNT
      ? 0
      : VISIBLE_LECTURE_COUNT *
        Math.floor((totalLecturesInCategory - 1) / VISIBLE_LECTURE_COUNT)

  const selectCategory = useCallback((id: string) => {
    setSelectedCategoryId(id)
    setLectureWindowStart(0)
  }, [])

  const displayedLectures = useMemo(
    () =>
      lecturesForCategory.slice(
        lectureWindowStart,
        lectureWindowStart + VISIBLE_LECTURE_COUNT,
      ),
    [lecturesForCategory, lectureWindowStart],
  )

  const showLectureArrows = totalLecturesInCategory > VISIBLE_LECTURE_COUNT
  const canGoPrevLectures = lectureWindowStart > 0
  const canGoNextLectures = lectureWindowStart + VISIBLE_LECTURE_COUNT < totalLecturesInCategory

  const goPrevLectures = useCallback(() => {
    setLectureWindowStart((s) => Math.max(0, s - VISIBLE_LECTURE_COUNT))
  }, [])

  const goNextLectures = useCallback(() => {
    setLectureWindowStart((s) => Math.min(maxLectureStart, s + VISIBLE_LECTURE_COUNT))
  }, [maxLectureStart])

  const selectedCategoryLabel = useMemo(() => {
    const found = model.categories.find((c) => c.id === selectedCategoryId)
    return found?.label ?? ''
  }, [model.categories, selectedCategoryId])

  return {
    model,
    currentSlideLine,
    goPrevSlide,
    goNextSlide,
    selectedCategoryId,
    selectCategory,
    displayedLectures,
    totalLecturesInCategory,
    showLectureArrows,
    canGoPrevLectures,
    canGoNextLectures,
    goPrevLectures,
    goNextLectures,
    selectedCategoryLabel,
  }
}
