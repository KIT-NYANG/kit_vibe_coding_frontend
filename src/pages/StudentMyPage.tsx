import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthSession } from '../features/auth/useAuthSession'
import { useStudentMyPage } from '../features/student/useStudentMyPage'
import { LECTURE_CATEGORY_OPTIONS } from '../shared/lib/lectureCategories'
import { CategoryPreviewGrid } from '../widgets/main/CategoryPreviewGrid'
import { House, NotepadText, Search, SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react'

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
    resetFilters,
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
          <p className="mt-1 text-base text-fg-subtle">나의 강좌 목록입니다.</p>
        </div>
        <button
          type="button"
          className="inline-flex self-start gap-2 text-base font-medium text-fg-subtle underline-offset-4 transition hover:text-palette-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary sm:self-auto"
          onClick={() => navigate('/')}
        >
          ← 홈
          <House aria-hidden className="h-6 w-7" strokeWidth={2} />
        </button>
      </div>

      <section className="rounded-3xl border border-palette-primary/10 bg-gradient-to-br from-palette-accent/20 via-white to-palette-primary/5 p-5 shadow-sm backdrop-blur-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-palette-primary/10 text-palette-primary">
                <NotepadText className="h-6 w-6" />
          </div>

              <div>
                <h2 className="text-medium font-semibold text-fg">강좌 목록{' '}
                  <span className="ml-1 font-medium text-palette-primary">
                      ({loading ? '…' : `${totalLectures}개의 강좌 수강 중`})
                    </span>
                </h2>
                  <p
                    className="preview-bounce-text mt-0.5 text-sm font-medium text-palette-primary/90"
                    aria-label="수강 중인 강좌를 조건별로 찾아보세요!"
                  >
                    {'수강 중인 강좌를 조건별로 찾아보세요!'.split('').map((char, index) => (
                      <span
                        key={`${char}-${index}`}
                        className="preview-bounce-letter"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        aria-hidden="true"
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
          
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end">
          <label className="flex w-full flex-col gap-1.5 lg:w-[220px]">
            <div className="relative">
              <select
                value={filterCategoryDraft}
                onChange={(e) => setFilterCategoryDraft(e.target.value)}
                className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-sm text-fg shadow-sm outline-none transition hover:border-palette-primary/30 focus:border-palette-primary focus:ring-4 focus:ring-palette-primary/10"
              >
                <option value="">전체</option>
                {LECTURE_CATEGORY_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          </div>
        </label>

          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex h-11 w-full items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-palette-primary/30 focus-within:border-palette-primary focus-within:ring-4 focus-within:ring-palette-primary/10">
              <div className="flex h-full w-11 shrink-0 items-center justify-center border-r border-slate-200 text-palette-primary">
                <Search className="h-4 w-4" />
                  </div>
                    <input
                      type="text"
                      value={filterKeywordDraft}
                      onChange={(e) => setFilterKeywordDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') applyFilters()
                      }}
                      placeholder="강좌 제목을 검색해 보세요"
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-fg outline-none placeholder:text-fg-subtle/70"
                    />
                  </div>
                </label>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-palette-primary px-5 text-sm font-semibold text-palette-white shadow-sm transition hover:-translate-y-0.5 hover:bg-palette-primary/90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-palette-primary/20"
              onClick={applyFilters}
            >
              <Search className="h-4 w-4" />
              검색
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-fg shadow-sm transition hover:bg-slate-50 hover:border-palette-primary/25"
            >
              <RotateCcw className="h-4 w-4" />
              초기화
            </button>
        </div>
      </section>

      <style>
        {`
          .preview-bounce-text {
            line-height: 1.5;
          }

          .preview-bounce-letter {
            position: relative;
            top: 0;
            display: inline-block;
            animation: previewBounce 0.7s ease-in-out infinite alternate;
            text-shadow:
              0 1px 0 rgba(203, 213, 225, 0.55),
              0 4px 10px rgba(15, 23, 42, 0.08);
          }

          @keyframes previewBounce {
            0% {
              top: 0;
            }
            100% {
              top: -3px;
              text-shadow:
                0 1px 0 rgba(203, 213, 225, 0.6),
                0 8px 12px rgba(15, 23, 42, 0.12);
            }
          }
        `}
      </style>

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
