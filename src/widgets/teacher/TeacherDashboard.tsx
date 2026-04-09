import { ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import type { TeacherLectureCard } from '../../entities/teacher/types'
import { LECTURE_CATEGORY_OPTIONS } from '../../shared/lib/lectureCategories'

interface TeacherDashboardProps {
  lectures: TeacherLectureCard[]
  totalLectures: number
  showArrows: boolean
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
  onUploadClick: () => void
  loading: boolean
  error: string | null
  onRetry: () => void
  /** 10개 초과 시 하단 페이지 안내 (useTeacherHome과 동일) */
  pageRangeStart: number
  pageRangeEnd: number
  currentPage: number
  totalPages: number
  onLectureClick: (lecture: TeacherLectureCard) => void
  filterCategoryDraft: string
  filterKeywordDraft: string
  onFilterCategoryDraftChange: (value: string) => void
  onFilterKeywordDraftChange: (value: string) => void
  onApplyFilters: () => void
}

const iconBtnClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-palette-primary transition hover:bg-palette-accent/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary disabled:pointer-events-none disabled:opacity-40'

export const TeacherDashboard = ({
  lectures,
  totalLectures,
  showArrows,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onUploadClick,
  loading,
  error,
  onRetry,
  pageRangeStart,
  pageRangeEnd,
  currentPage,
  totalPages,
  onLectureClick,
  filterCategoryDraft,
  filterKeywordDraft,
  onFilterCategoryDraftChange,
  onFilterKeywordDraftChange,
  onApplyFilters,
}: TeacherDashboardProps) => {
  const paddedLectures = Array.from({ length: 10 }, (_, idx) => lectures[idx] ?? null)

  return (
    <section className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <section className="min-w-0 flex-1 rounded-2xl bg-palette-accent/12 p-5 ring-1 ring-palette-primary/12 sm:p-6">
          <header className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">
              업로드한 강좌{' '}
              <span className="font-normal text-fg-subtle">
                ({loading ? '…' : `${totalLectures}개`})
              </span>
            </h2>
          </header>

          <div className="mt-3 flex flex-wrap items-end gap-2">
            <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-xs text-fg-subtle">
              카테고리
              <select
                value={filterCategoryDraft}
                onChange={(e) => onFilterCategoryDraftChange(e.target.value)}
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
                onChange={(e) => onFilterKeywordDraftChange(e.target.value)}
                placeholder="제목 등"
                className="rounded-lg border border-palette-primary/20 bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle/70 focus-visible:outline focus-visible:ring-2 focus-visible:ring-palette-primary"
              />
            </label>
            <button
              type="button"
              className="rounded-lg bg-palette-primary px-4 py-2 text-xs font-medium text-palette-white transition hover:bg-palette-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-palette-primary"
              onClick={onApplyFilters}
            >
              검색
            </button>
          </div>

          {error ? (
            <div
              className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200"
              role="alert"
            >
              <p>{error}</p>
              <button
                type="button"
                className="mt-2 rounded-lg bg-palette-primary px-3 py-1.5 text-xs font-medium text-palette-white hover:bg-palette-primary/90"
                onClick={onRetry}
              >
                다시 시도
              </button>
            </div>
          ) : null}

          {loading ? (
            <div className="mt-4 px-10 sm:px-12">
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
                {Array.from({ length: 10 }, (_, idx) => (
                  <li key={`sk-${idx}`} className="min-w-0">
                    <div className="overflow-hidden rounded-xl bg-surface ring-1 ring-palette-primary/12">
                      <div className="aspect-video w-full animate-pulse bg-palette-accent/30" />
                      <div className="flex min-h-[3rem] items-center justify-center px-2 py-2">
                        <div className="h-3 w-3/4 animate-pulse rounded bg-palette-accent/40" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className={`relative mt-4 px-10 sm:px-12 ${loading || error ? 'hidden' : ''}`}>
            {showArrows ? (
              <>
                <button
                  type="button"
                  aria-label="이전 강의"
                  className={`absolute left-0 top-1/2 -translate-y-1/2 ${iconBtnClass}`}
                  disabled={!canGoPrev}
                  onClick={onPrev}
                >
                  <ChevronLeft aria-hidden className="h-5 w-5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  aria-label="다음 강의"
                  className={`absolute right-0 top-1/2 -translate-y-1/2 ${iconBtnClass}`}
                  disabled={!canGoNext}
                  onClick={onNext}
                >
                  <ChevronRight aria-hidden className="h-5 w-5" strokeWidth={2} />
                </button>
              </>
            ) : null}

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
              {paddedLectures.map((card, idx) => (
                <li key={card?.id ?? `empty-${idx}`} className="min-w-0">
                  {card ? (
                    <button
                      type="button"
                      className="group w-full overflow-hidden rounded-xl bg-surface text-left ring-1 ring-palette-primary/12 transition hover:ring-palette-primary/40 focus-visible:outline focus-visible:ring-2 focus-visible:ring-palette-primary"
                      onClick={() => onLectureClick(card)}
                    >
                      <div className="aspect-video w-full overflow-hidden bg-palette-accent/25">
                        <img
                          alt={card.thumbnailAlt}
                          className="h-full w-full object-cover transition group-hover:opacity-95"
                          loading="lazy"
                          src={card.thumbnailSrc}
                          onError={(e) => {
                            e.currentTarget.src = '/thumbnail-placeholder.svg'
                          }}
                        />
                      </div>
                      <div className="flex min-h-[3rem] items-center justify-center px-2 py-2">
                        <p className="line-clamp-2 w-full text-center text-xs font-semibold text-fg group-hover:text-palette-primary">
                          {card.title}
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="overflow-hidden rounded-xl bg-surface ring-1 ring-palette-primary/12">
                      <div className="aspect-video w-full bg-palette-accent/25" />
                      <div className="flex min-h-[3rem] items-center justify-center px-2 py-2">
                        <p className="line-clamp-2 w-full text-center text-xs font-semibold text-fg">
                          {'\u00A0'}
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {!loading && totalLectures === 0 && !error ? (
              <p className="mt-4 text-center text-sm text-fg-subtle">등록된 강의가 없습니다.</p>
            ) : null}

            {showArrows && !loading && !error ? (
              <div className="mt-4 flex flex-col items-center gap-3 border-t border-palette-primary/12 pt-4">
                <p className="text-center text-xs text-fg-subtle">
                  <span className="font-medium text-fg">
                    {pageRangeStart}–{pageRangeEnd}번째
                  </span>
                  {' · '}
                  전체 {totalLectures}개
                  <span className="mx-1.5 text-palette-primary/35">|</span>
                  {currentPage} / {totalPages} 페이지
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-palette-primary/25 bg-surface px-3 py-1.5 text-xs font-medium text-fg transition hover:bg-palette-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!canGoPrev}
                    onClick={onPrev}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-palette-primary/25 bg-surface px-3 py-1.5 text-xs font-medium text-fg transition hover:bg-palette-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!canGoNext}
                    onClick={onNext}
                  >
                    다음
                  </button>
                </div>
                <p className="text-center text-[11px] text-fg-subtle">
                  한 페이지에 최대 10개까지 표시됩니다. 좌우 화살표로도 넘길 수 있어요.
                </p>
              </div>
            ) : null}
          </div>
        </section>

        <div className="flex shrink-0 justify-end sm:items-end sm:pb-1">
          <button
            type="button"
            aria-label="강의 업로드"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-palette-primary shadow-sm ring-1 ring-palette-primary/15 transition hover:bg-palette-accent/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary"
            onClick={onUploadClick}
          >
            <Upload aria-hidden className="h-6 w-6" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  )
}
