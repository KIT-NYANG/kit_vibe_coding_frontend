import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthSession } from '../features/auth/useAuthSession'
import { useStudentMyPage } from '../features/student/useStudentMyPage'
import { LECTURE_CATEGORY_OPTIONS } from '../shared/lib/lectureCategories'
import { CategoryPreviewGrid } from '../widgets/main/CategoryPreviewGrid'
import { House } from 'lucide-react'

export const StudentMyPage = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuthSession()

  const {
    displayedLectures,
    totalLectures,
    showArrows,
    canGoPrev,
    canGoNext,
    goPrev,
    goNext,
    filterCategoryDraft,
    filterKeywordDraft,
    setFilterCategoryDraft,
    setFilterKeywordDraft,
    applyFilters,
    loading,
    error,
    refetch,
  } = useStudentMyPage()

  if (!isLoggedIn) {
    return <Navigate replace to="/" />
  }

  if (user?.role !== 'STUDENT') {
    return <Navigate replace to="/" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-fg sm:text-2xl">마이페이지</h1>
          <p className="mt-1 text-sm text-fg-subtle">나의 강좌 목록입니다.</p>
        </div>
        <button
          type="button"
          className="inline-flex self-start gap-2 text-sm font-medium text-fg-subtle underline-offset-4 transition hover:text-palette-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary sm:self-auto"
          onClick={() => navigate('/')}
        >
          ← 홈
          <House aria-hidden className="h-5 w-6" strokeWidth={2} />
        </button>
      </div>

      <section className="rounded-2xl bg-palette-accent/12 p-5 ring-1 ring-palette-primary/12 sm:p-6">
        <h2 className="text-sm font-semibold text-fg">
          내 강좌{' '}
          <span className="font-normal text-fg-subtle">
            ({loading ? '…' : `${totalLectures}개`})
          </span>
        </h2>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-xs text-fg-subtle">
            카테고리
            <select
              value={filterCategoryDraft}
              onChange={(e) => setFilterCategoryDraft(e.target.value)}
              className="rounded-lg border border-palette-primary/20 bg-surface px-3 py-2 text-sm text-fg focus-visible:outline focus-visible:ring-2 focus-visible:ring-palette-primary"
            >
              <option value="">전체</option>
              {LECTURE_CATEGORY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-xs text-fg-subtle">
            검색어
            <input
              type="text"
              value={filterKeywordDraft}
              onChange={(e) => setFilterKeywordDraft(e.target.value)}
              placeholder="제목 등"
              className="rounded-lg border border-palette-primary/20 bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle/70 focus-visible:outline focus-visible:ring-2 focus-visible:ring-palette-primary"
            />
          </label>
          <button
            type="button"
            className="rounded-lg bg-palette-primary px-4 py-2 text-xs font-medium text-palette-white transition hover:bg-palette-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-palette-primary"
            onClick={applyFilters}
          >
            검색
          </button>
        </div>
      </section>

      <CategoryPreviewGrid
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        categoryLabel="수강 중인"
        error={error}
        lectures={displayedLectures}
        loading={loading}
        onLectureClick={(lecture) =>
          navigate(`/lecture/${lecture.id}`, {
            state: { fromMyPage: true },
          })
        }
        onNext={goNext}
        onPrev={goPrev}
        onRetry={() => void refetch()}
        showArrows={showArrows}
        totalInCategory={totalLectures}
        showSubtitle={false}
        showSearchBar={false}
        showLectureCount={false}
      />
    </div>
  )
}
