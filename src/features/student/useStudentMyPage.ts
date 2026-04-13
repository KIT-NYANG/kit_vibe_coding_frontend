import { useCallback, useEffect, useRef, useState } from 'react'
import type { CategoryLecture } from '../../entities/main/types'
import { getMyLectureList } from '../../shared/api/lectureApi'
import { mapMyLectureItemToCategoryLecture } from './mapMyLectureItemToCategoryLecture'

const PAGE_SIZE = 10

export interface UseStudentMyPageResult {
  displayedLectures: CategoryLecture[]
  totalLectures: number
  showArrows: boolean
  canGoPrev: boolean
  canGoNext: boolean
  goPrev: () => void
  goNext: () => void
  pageRangeStart: number
  pageRangeEnd: number
  currentPage: number
  totalPages: number
  filterCategoryDraft: string
  filterKeywordDraft: string
  setFilterCategoryDraft: (value: string) => void
  setFilterKeywordDraft: (value: string) => void
  applyFilters: () => void
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  resetFilters: () => void // 필터 초기화
}

export const useStudentMyPage = (): UseStudentMyPageResult => {
  const [displayedLectures, setDisplayedLectures] = useState<CategoryLecture[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [first, setFirst] = useState(true)
  const [last, setLast] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [keywordFilter, setKeywordFilter] = useState('')
  const [filterCategoryDraft, setFilterCategoryDraft] = useState('')
  const [filterKeywordDraft, setFilterKeywordDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filterRef = useRef({ category: '', keyword: '' })
  filterRef.current = { category: categoryFilter, keyword: keywordFilter }

  const applyFilters = useCallback(() => {
    setCategoryFilter(filterCategoryDraft)
    setKeywordFilter(filterKeywordDraft)
  }, [filterCategoryDraft, filterKeywordDraft])

  const resetFilters = useCallback(() => {
    setFilterCategoryDraft('')
    setFilterKeywordDraft('')
    setCategoryFilter('')
    setKeywordFilter('')
  }, [])

  const fetchPage = useCallback(async (nextPage: number) => {
    const { category, keyword } = filterRef.current
    setLoading(true)
    setError(null)
    try {
      const res = await getMyLectureList({
        page: nextPage,
        size: PAGE_SIZE,
        category: category.trim() || undefined,
        keyword: keyword.trim() || undefined,
      })
      setPageIndex(res.page)
      setDisplayedLectures(res.content.map(mapMyLectureItemToCategoryLecture))
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
      setError(e instanceof Error ? e.message : '내 강좌 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    await fetchPage(pageIndex)
  }, [fetchPage, pageIndex])

  useEffect(() => {
    void fetchPage(0)
  }, [categoryFilter, keywordFilter, fetchPage])

  const totalLectures = totalElements
  const showArrows = totalPages > 1
  const canGoPrev = !first
  const canGoNext = !last

  const goPrev = useCallback(() => {
    if (first) return
    void fetchPage(pageIndex - 1)
  }, [fetchPage, first, pageIndex])

  const goNext = useCallback(() => {
    if (last) return
    void fetchPage(pageIndex + 1)
  }, [fetchPage, last, pageIndex])

  const pageRangeStart =
    totalElements === 0 ? 0 : pageIndex * PAGE_SIZE + 1
  const pageRangeEnd = pageIndex * PAGE_SIZE + displayedLectures.length
  const currentPage = totalElements === 0 ? 0 : pageIndex + 1

  return {
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
    filterCategoryDraft,
    filterKeywordDraft,
    setFilterCategoryDraft,
    setFilterKeywordDraft,
    applyFilters,
    loading,
    error,
    refetch,
    resetFilters,
  }
}
