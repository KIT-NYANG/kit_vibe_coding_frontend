import type { CategoryLecture } from '../../entities/main/types'
import { THUMBNAIL_PLACEHOLDER } from '../../shared/lib/resolveApiAssetUrl'
import { NotebookTabs, RefreshCw, Search } from 'lucide-react'

interface CategoryPreviewGridProps {
  lectures: CategoryLecture[]
  categoryLabel: string
  totalInCategory: number
  showArrows: boolean
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  /** 지정 시 카드 클릭으로 강좌 상세 이동 등 */
  onLectureClick?: (lecture: CategoryLecture) => void
  // 검색창 props
  filterKeywordDraft?: string
  onFilterKeywordDraftChange?: (value: string) => void
  onApplyFilters?: () => void
  onResetFilters?: () => void

  // /mypage에서는 검색창, 문구가 안 보이게 설정하기 위해 추가
  showSubtitle?: boolean
  showSearchBar?: boolean
  showLectureCount?: boolean
}

export const CategoryPreviewGrid = ({
  lectures,
  categoryLabel,
  totalInCategory,
  showArrows,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  loading = false,
  error = null,
  onRetry,
  onLectureClick,
  filterKeywordDraft = '',
  onFilterKeywordDraftChange,
  onApplyFilters,
  onResetFilters,
  showSubtitle = true,
  showSearchBar = true,
  showLectureCount = true,
}: CategoryPreviewGridProps) => {
  return (
    <section
      aria-labelledby="preview-list-heading"
      className="rounded-3xl border border-palette-primary/10 bg-gradient-to-br from-palette-accent/20 via-white to-palette-primary/5 p-5 shadow-sm backdrop-blur-sm sm:p-6"
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 id="preview-list-heading" className="text-lg font-bold text-fg sm:text-xl">
            {categoryLabel ? `${categoryLabel} 강좌` : '강좌'}
          </h2>
        {showSubtitle ? (
          <p className="preview-bounce-text mt-1 text-sm font-medium text-palette-primary/90"
            aria-label={categoryLabel === '전체'
                ? '전체 강좌를 확인해보세요'
                : categoryLabel
                  ? `${categoryLabel} 관련 강좌를 추천해요`
                  : '추천 강좌를 확인해보세요'}
              >

              {(categoryLabel === '전체'
                ? '전체 강좌를 확인해보세요'
                : categoryLabel
                ? `${categoryLabel} 관련 강좌를 추천해요`
                : '추천 강좌를 확인해보세요'
              ).split('').map((char, index) => (
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
        ) : null}
        </div>

          <div className="flex shrink-0 items-center gap-3">
            {showSearchBar ? (
            <div className="flex items-center gap-2 rounded-lg border border-palette-primary/12 bg-white/80 px-3 py-1 shadow-sm">
              <input
                type="text"
                value={filterKeywordDraft}
                onChange={(e) => onFilterKeywordDraftChange?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onApplyFilters?.()
                  }
                }}
                placeholder="검색어를 입력해주세요"
                className="w-64 bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none sm:w-80"
              />

              <button
                type="button"
                aria-label="검색"
                onClick={onApplyFilters}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-palette-primary/12 bg-palette-primary text-white transition hover:bg-palette-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary"
              >
                <Search aria-hidden className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label="검색 초기화"
                onClick={onResetFilters}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-palette-primary/12 bg-white text-palette-primary transition hover:bg-palette-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary"
              >
                <RefreshCw aria-hidden className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ) : null}
            {showLectureCount && !loading && !error && totalInCategory > 0 ? (
              <div className="inline-flex items-center gap-2 rounded-lg bg-palette-accent/20 px-3 py-2 text-sm font-semibold text-palette-primary">
                <NotebookTabs aria-hidden className="h-6 w-4" strokeWidth={2} />
                <span>{totalInCategory}개의 강좌</span>
              </div>
            ) : null}
          </div>
      </div>

      {loading ? (
        <p className="rounded-lg bg-surface px-4 py-10 text-center text-sm text-fg-subtle ring-1 ring-palette-primary/10">
          강좌 목록을 불러오는 중…
        </p>
      ) : error ? (
        <div className="rounded-lg bg-red-50 px-4 py-6 text-center text-sm text-red-800 ring-1 ring-red-200">
          <p>{error}</p>
          {onRetry ? (
            <button
              type="button"
              className="mt-3 rounded-lg bg-palette-primary px-3 py-1.5 text-xs font-medium text-palette-white hover:bg-palette-primary/90"
              onClick={() => void onRetry()}
            >
              다시 시도
            </button>
          ) : null}
        </div>
      ) : totalInCategory === 0 ? (
        <p className="rounded-lg bg-surface px-4 py-8 text-center text-sm text-fg-subtle ring-1 ring-palette-primary/10">
          이 카테고리에 등록된 강좌가 없습니다.
        </p>
      ) : (
        <div
          className="relative px-9 sm:px-11"
          role="region"
          aria-label={`${categoryLabel} 강좌 목록`}
        >
          {showArrows ? (
            <>
              <button
                type="button"
                aria-label="이전 강좌 보기"
                className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-palette-primary transition hover:bg-palette-accent/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary disabled:pointer-events-none disabled:opacity-40"
                disabled={!canGoPrev}
                onClick={onPrev}
              >
                <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </button>
              <button
                type="button"
                aria-label="다음 강좌 보기"
                className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-palette-primary transition hover:bg-palette-accent/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary disabled:pointer-events-none disabled:opacity-40"
                disabled={!canGoNext}
                onClick={onNext}
              >
                <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </button>
            </>
          ) : null}

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
            {lectures.map((card) => (
              <li key={card.id} className="flex min-h-0 min-w-0">
                {onLectureClick ? (
                  <button
                    type="button"
                    className="group flex w-full min-w-0 flex-col overflow-hidden rounded-lg bg-surface text-left shadow-sm ring-1 ring-palette-primary/12 transition hover:ring-palette-primary/40 focus-visible:outline focus-visible:ring-2 focus-visible:ring-palette-primary"
                    onClick={() => onLectureClick(card)}
                  >
                    <div className="aspect-video w-full shrink-0 overflow-hidden bg-palette-accent/25">
                      <img
                        alt={card.thumbnailAlt}
                        className="h-full w-full object-cover transition group-hover:opacity-95"
                        decoding="async"
                        loading="lazy"
                        src={card.thumbnailSrc}
                        onError={(e) => {
                          e.currentTarget.src = THUMBNAIL_PLACEHOLDER
                        }}
                      />
                    </div>
                    <div className="flex min-h-[3rem] w-full flex-1 items-center justify-center px-1.5 py-2 sm:px-2">
                      <h3 className="line-clamp-2 w-full text-center text-[11px] font-semibold leading-snug text-fg group-hover:text-palette-primary sm:text-xs">
                        {card.title}
                      </h3>
                    </div>
                  </button>
                ) : (
                  <article className="flex w-full min-w-0 flex-col overflow-hidden rounded-lg bg-surface shadow-sm ring-1 ring-palette-primary/12 transition hover:ring-palette-primary/30">
                    <div className="aspect-video w-full shrink-0 overflow-hidden bg-palette-accent/25">
                      <img
                        alt={card.thumbnailAlt}
                        className="h-full w-full object-cover"
                        decoding="async"
                        loading="lazy"
                        src={card.thumbnailSrc}
                        onError={(e) => {
                          e.currentTarget.src = THUMBNAIL_PLACEHOLDER
                        }}
                      />
                    </div>
                    <div className="flex min-h-[3rem] w-full flex-1 items-center justify-center px-1.5 py-2 sm:px-2">
                      <h3 className="line-clamp-2 w-full text-center text-[11px] font-semibold leading-snug text-fg sm:text-xs">
                        {card.title}
                      </h3>
                    </div>
                  </article>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

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