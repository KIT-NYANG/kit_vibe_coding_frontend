import type { CategoryLecture } from '../../entities/main/types'

interface CategoryPreviewGridProps {
  lectures: CategoryLecture[]
  categoryLabel: string
  totalInCategory: number
  showArrows: boolean
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
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
}: CategoryPreviewGridProps) => {
  return (
    <section aria-labelledby="preview-list-heading" className="rounded-lg bg-gray-100/80 p-3 ring-1 ring-gray-300/80 sm:p-4">
      <h2
        id="preview-list-heading"
        className="mb-3 text-sm font-semibold text-gray-800"
      >
        {categoryLabel ? `${categoryLabel} 강의` : '강의'}
        {totalInCategory > 0 ? (
          <span className="ml-2 font-normal text-gray-500">({totalInCategory}개)</span>
        ) : null}
      </h2>

      {totalInCategory === 0 ? (
        <p className="rounded-lg bg-white px-4 py-8 text-center text-sm text-gray-500 ring-1 ring-gray-200">
          이 카테고리에 등록된 강의가 없습니다.
        </p>
      ) : (
        <div
          className="relative px-9 sm:px-11"
          role="region"
          aria-label={`${categoryLabel} 강의 목록`}
        >
          {showArrows ? (
            <>
              <button
                type="button"
                aria-label="이전 강의 보기"
                className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
                disabled={!canGoPrev}
                onClick={onPrev}
              >
                <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </button>
              <button
                type="button"
                aria-label="다음 강의 보기"
                className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
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
                <article className="flex w-full min-w-0 flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 transition hover:ring-gray-300">
                  <div className="aspect-video w-full shrink-0 overflow-hidden bg-gray-100">
                    <img
                      alt={card.thumbnailAlt}
                      className="h-full w-full object-cover"
                      decoding="async"
                      loading="lazy"
                      src={card.thumbnailSrc}
                    />
                  </div>
                  <div className="flex min-h-[3rem] w-full flex-1 items-center justify-center px-1.5 py-2 sm:px-2">
                    <h3 className="line-clamp-2 w-full text-center text-[11px] font-semibold leading-snug text-gray-900 sm:text-xs">
                      {card.title}
                    </h3>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
