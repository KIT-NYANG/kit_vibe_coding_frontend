interface HeroCarouselBannerProps {
  line: string
  onPrev: () => void
  onNext: () => void
  slideLabel: string
}

export const HeroCarouselBanner = ({
  line,
  onPrev,
  onNext,
  slideLabel,
}: HeroCarouselBannerProps) => {
  return (
    <section aria-roledescription="carousel" aria-label={slideLabel} className="relative">
      <div className="relative min-h-[200px] rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:min-h-[220px] sm:p-8">
        <p className="max-w-2xl text-left text-lg font-medium leading-relaxed text-gray-900 sm:text-xl">
          {line}
        </p>

        <div className="pointer-events-none absolute bottom-4 right-4 flex gap-2 sm:bottom-6 sm:right-6">
          <button
            type="button"
            aria-label="이전 슬라이드"
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            onClick={onPrev}
          >
            <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
          <button
            type="button"
            aria-label="다음 슬라이드"
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            onClick={onNext}
          >
            <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
