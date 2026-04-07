import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroCarouselBannerProps {
  line: string
  onPrev: () => void
  onNext: () => void
  slideLabel: string
}

const iconBtnClass =
  'pointer-events-auto inline-flex items-center justify-center rounded-md border-0 bg-transparent p-1.5 text-fg-subtle shadow-none transition-colors hover:bg-palette-accent/30 hover:text-palette-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary active:bg-palette-accent/40'

export const HeroCarouselBanner = ({
  line,
  onPrev,
  onNext,
  slideLabel,
}: HeroCarouselBannerProps) => {
  return (
    <section aria-roledescription="carousel" aria-label={slideLabel} className="relative">
      <div className="relative min-h-[200px] rounded-xl bg-surface p-6 shadow-sm ring-1 ring-palette-primary/12 sm:min-h-[220px] sm:p-8">
        <p className="max-w-2xl text-left text-lg font-medium leading-relaxed text-fg sm:text-xl">
          {line}
        </p>

        <div className="pointer-events-none absolute bottom-4 right-4 flex gap-1 sm:bottom-6 sm:right-6 sm:gap-0.5">
          <button
            type="button"
            aria-label="이전 슬라이드"
            className={iconBtnClass}
            onClick={onPrev}
          >
            <ChevronLeft aria-hidden className="h-5 w-5 shrink-0" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="다음 슬라이드"
            className={iconBtnClass}
            onClick={onNext}
          >
            <ChevronRight aria-hidden className="h-5 w-5 shrink-0" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  )
}
