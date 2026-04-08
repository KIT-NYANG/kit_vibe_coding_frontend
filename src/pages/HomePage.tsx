import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TeacherLectureCard } from '../entities/teacher/types'
import { useAuthSession } from '../features/auth/useAuthSession'
import { useMainHome } from '../features/main/useMainHome'
import { useTeacherHome } from '../features/teacher/useTeacherHome'
import { CategoryChipRow } from '../widgets/main/CategoryChipRow'
import { CategoryPreviewGrid } from '../widgets/main/CategoryPreviewGrid'
import { HeroCarouselBanner } from '../widgets/main/HeroCarouselBanner'
import { CreateLectureModal } from '../widgets/teacher/CreateLectureModal'
import { TeacherDashboard } from '../widgets/teacher/TeacherDashboard'

export const HomePage = () => {
  const { user, isLoggedIn } = useAuthSession()
  const isTeacher = isLoggedIn && user?.role === 'TEACHER'

  return isTeacher ? <TeacherHomeContent /> : <StudentHomeContent />
}

const StudentHomeContent = () => {
  const navigate = useNavigate()
  const {
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
    lecturesLoading,
    lecturesError,
    refetchLectures,
  } = useMainHome()

  const slideLabel = `히어로 배너 ${model.heroSlides.length}장 중 표시`

  return (
    <div className="space-y-6">
      <HeroCarouselBanner
        line={currentSlideLine}
        onNext={goNextSlide}
        onPrev={goPrevSlide}
        slideLabel={slideLabel}
      />
      <CategoryChipRow
        categories={model.categories}
        selectedId={selectedCategoryId}
        onSelect={selectCategory}
      />
      <CategoryPreviewGrid
        canGoNext={canGoNextLectures}
        canGoPrev={canGoPrevLectures}
        categoryLabel={selectedCategoryLabel}
        error={lecturesError}
        lectures={displayedLectures}
        loading={lecturesLoading}
        onLectureClick={(lecture) => navigate(`/lecture/${lecture.id}`)}
        onNext={goNextLectures}
        onPrev={goPrevLectures}
        onRetry={() => void refetchLectures()}
        showArrows={showLectureArrows}
        totalInCategory={totalLecturesInCategory}
      />
    </div>
  )
}

const TeacherHomeContent = () => {
  const navigate = useNavigate()
  const [createLectureOpen, setCreateLectureOpen] = useState(false)
  const {
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
    filterCategoryDraft,
    filterKeywordDraft,
    setFilterCategoryDraft,
    setFilterKeywordDraft,
    applyFilters,
  } = useTeacherHome()

  const goToLectureDetail = (lecture: TeacherLectureCard) => {
    navigate(`/teacher/lecture/${lecture.id}`)
  }

  return (
    <>
      <TeacherDashboard
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        currentPage={currentPage}
        error={error}
        filterCategoryDraft={filterCategoryDraft}
        filterKeywordDraft={filterKeywordDraft}
        onApplyFilters={applyFilters}
        onFilterCategoryDraftChange={setFilterCategoryDraft}
        onFilterKeywordDraftChange={setFilterKeywordDraft}
        lectures={displayedLectures}
        loading={loading}
        onLectureClick={goToLectureDetail}
        onNext={goNext}
        onPrev={goPrev}
        onRetry={() => void refetch()}
        onUploadClick={() => setCreateLectureOpen(true)}
        pageRangeEnd={pageRangeEnd}
        pageRangeStart={pageRangeStart}
        showArrows={showArrows}
        totalLectures={totalLectures}
        totalPages={totalPages}
      />
      <CreateLectureModal
        open={createLectureOpen}
        onClose={() => setCreateLectureOpen(false)}
        onSubmit={async (payload) => {
          await addLecture(payload)
        }}
      />
    </>
  )
}
