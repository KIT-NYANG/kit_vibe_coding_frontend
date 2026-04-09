import type { CategoryLecture } from '../../entities/main/types'
import { THUMBNAIL_PLACEHOLDER } from '../../shared/lib/resolveApiAssetUrl'

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
}: CategoryPreviewGridProps) => {
  return (
    <section
      aria-labelledby="preview-list-heading"
      className="rounded-xl bg-palette-accent/10 p-3 ring-1 ring-palette-primary/15 sm:p-4"
    >
      <h2 id="preview-list-heading" className="mb-3 text-sm font-semibold text-fg">
        {categoryLabel ? `${categoryLabel} 강의` : '강의'}
        {!loading && !error && totalInCategory > 0 ? (
          <span className="ml-2 font-normal text-fg-subtle">({totalInCategory}개)</span>
        ) : null}
      </h2>

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
    </section>
  )
}
