import { useCallback, useEffect, useMemo, useState } from 'react'
import type { MainHomeModel } from '../../entities/main/types'
import { getLectureClasses } from '../../shared/api/lectureApi'
import { mainHomeData } from './mainHomeData'
import { mapLectureClassToCategoryLecture } from './mapLectureClassToCategoryLecture'

/** GET /api/lecture-class — 페이지 크기 (강좌 목록과 동일) */
const LECTURE_LIST_PAGE_SIZE = 10

export interface UseMainHomeResult {
  model: MainHomeModel
  currentSlideDescription: string
  goPrevSlide: () => void
  goNextSlide: () => void
  selectedCategoryId: string
  selectCategory: (id: string) => void
  displayedLectures: MainHomeModel['lectures']
  totalLecturesInCategory: number
  showLectureArrows: boolean
  canGoPrevLectures: boolean
  canGoNextLectures: boolean
  goPrevLectures: () => void
  goNextLectures: () => void
  selectedCategoryLabel: string
  lecturesLoading: boolean
  lecturesError: string | null
  refetchLectures: () => Promise<void>
  filterKeywordDraft: string
  setFilterKeywordDraft: (value: string) => void
  applyFilters: () => void
  resetFilters: () => void
}

export const useMainHome = (): UseMainHomeResult => {
  const staticModel = useMemo(() => mainHomeData, [])
  const [currentSlideIndex, setSlideIndex] = useState(0)
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    () => staticModel.categories[0]?.id ?? '',
  )

  const [keywordFilter, setKeywordFilter] = useState('')
  const [filterKeywordDraft, setFilterKeywordDraft] = useState('')

  const [lecturePageIndex, setLecturePageIndex] = useState(0)
  const [displayedLectures, setDisplayedLectures] = useState<MainHomeModel['lectures']>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [first, setFirst] = useState(true)
  const [last, setLast] = useState(true)
  const [lecturesLoading, setLecturesLoading] = useState(true)
  const [lecturesError, setLecturesError] = useState<string | null>(null)

  const slideCount = staticModel.heroSlides.length

  const goPrevSlide = useCallback(() => {
    if (slideCount === 0) return
    setSlideIndex((i) => (i - 1 + slideCount) % slideCount)
  }, [slideCount])

  const goNextSlide = useCallback(() => {
    if (slideCount === 0) return
    setSlideIndex((i) => (i + 1) % slideCount)
  }, [slideCount])

  const currentSlideDescription = staticModel.heroSlides[currentSlideIndex]?.description ?? ''

  const selectedCategoryLabel = useMemo(() => {
    const found = staticModel.categories.find((c) => c.id === selectedCategoryId)
    return found?.label ?? ''
  }, [staticModel.categories, selectedCategoryId])

  const selectCategory = useCallback((id: string) => {
    setSelectedCategoryId(id)
    setLecturePageIndex(0)
  }, [])

  const applyFilters = useCallback(() => {
    setKeywordFilter(filterKeywordDraft)
    setLecturePageIndex(0)
  }, [filterKeywordDraft])

  const resetFilters = useCallback(() => {
    setFilterKeywordDraft('')
    setKeywordFilter('')
    setLecturePageIndex(0)
  }, [])

  const fetchLecturePage = useCallback(
    async (pageNum: number) => {
      setLecturesLoading(true)
      setLecturesError(null)
      try {
        const res = await getLectureClasses({
          page: pageNum,
          size: LECTURE_LIST_PAGE_SIZE,
          category: selectedCategoryId.trim() || undefined,
          keyword: keywordFilter.trim() || undefined,
        })
        setLecturePageIndex(res.page)
        setDisplayedLectures(
          res.content.map((dto) => mapLectureClassToCategoryLecture(dto, selectedCategoryId)),
        )
        setTotalElements(res.totalElements)
        setTotalPages(res.totalPages)
        setFirst(res.first)
        setLast(res.last)
      } catch (e) {
        setDisplayedLectures([])
        setTotalElements(0)
        setTotalPages(0)
        setFirst(true)
        setLast(true)
        setLecturesError(
          e instanceof Error ? e.message : '강의 목록을 불러오지 못했습니다.',
        )
      } finally {
        setLecturesLoading(false)
      }
    },
    [selectedCategoryId, keywordFilter],
  )

  useEffect(() => {
    void fetchLecturePage(0)
  }, [fetchLecturePage])

  const refetchLectures = useCallback(async () => {
    await fetchLecturePage(lecturePageIndex)
  }, [fetchLecturePage, lecturePageIndex])

  const totalLecturesInCategory = totalElements
  const showLectureArrows = totalPages > 1
  const canGoPrevLectures = !first
  const canGoNextLectures = !last

  const goPrevLectures = useCallback(() => {
    if (first) return
    void fetchLecturePage(lecturePageIndex - 1)
  }, [fetchLecturePage, first, lecturePageIndex])

  const goNextLectures = useCallback(() => {
    if (last) return
    void fetchLecturePage(lecturePageIndex + 1)
  }, [fetchLecturePage, last, lecturePageIndex])

  const model = useMemo<MainHomeModel>(
    () => ({ ...staticModel, lectures: displayedLectures }),
    [staticModel, displayedLectures],
  )

  return {
    model,
    currentSlideDescription,
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
    lecturesLoading,
    lecturesError,
    refetchLectures,
    filterKeywordDraft,
    setFilterKeywordDraft,
    applyFilters,
    resetFilters,
  }
}
