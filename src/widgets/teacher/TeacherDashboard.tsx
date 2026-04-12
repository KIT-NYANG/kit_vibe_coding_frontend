import { ChevronLeft, ChevronRight, Upload, BookType, ChevronDown, RotateCcw, Search, SlidersHorizontal, } from 'lucide-react'
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
  onResetFilters: () => void
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
  onResetFilters,
}: TeacherDashboardProps) => {
  const paddedLectures = Array.from({ length: 10 }, (_, idx) => lectures[idx] ?? null)

  return (
    <section className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <section className="rounded-3xl border border-palette-primary/10 bg-gradient-to-br from-palette-accent/20 via-white to-palette-primary/5 p-5 shadow-sm backdrop-blur-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-palette-primary/10 text-palette-primary">
                    <BookType className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-fg">
                  업로드한 강좌{' '}
                  <span className="ml-1 font-medium text-palette-primary">
                    ({loading ? '…' : `${totalLectures}개`})
                  </span>
              </h2>
              <p
                    className="preview-bounce-text mt-0.5 text-sm font-medium text-palette-primary/90"
                    aria-label="업로드한 강좌를 조건별로 찾아보세요!"
                  >
                    {'업로드한 강좌를 조건별로 찾아보세요!'.split('').map((char, index) => (
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
                onChange={(e) => onFilterCategoryDraftChange(e.target.value)}
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
                      onChange={(e) => onFilterKeywordDraftChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onApplyFilters()
                      }}
                      placeholder="강좌 제목을 검색해 보세요"
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-fg outline-none placeholder:text-fg-subtle/70"
                    />
                  </div>
                </label>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-palette-primary px-5 text-sm font-semibold text-palette-white shadow-sm transition hover:-translate-y-0.5 hover:bg-palette-primary/90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-palette-primary/20"
              onClick={onApplyFilters}
            >
              <Search className="h-4 w-4" />
              검색
            </button>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-fg shadow-sm transition hover:bg-slate-50 hover:border-palette-primary/25"
              onClick={onResetFilters}
            >
              <RotateCcw className="h-4 w-4" />
              초기화
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
    </section>
  )
}
