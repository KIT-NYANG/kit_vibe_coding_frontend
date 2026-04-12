import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { HeroSlide } from '../../entities/main/types'

interface HeroCarouselBannerProps {
  onPrev: () => void
  onNext: () => void
  badgeText: string
}

// 배너에 보여줄 카드 데이터 목록
const defaultSlides: HeroSlide[] = [
  {
    id: 'backend',
    title: '백엔드 개발자 로드맵',
    description: 'Java → Spring Boot → DB → JPA → 배포까지',
    imageUrl: '/assets/images/backend.jpg',
    steps: ['Java', 'Spring Boot', 'DB', 'JPA', '배포'],
  },
  {
    id: 'frontend',
    title: '프론트엔드 개발자 로드맵',
    description: 'HTML/CSS → JavaScript → React → 상태관리 → 배포까지',
    imageUrl: '/assets/images/frontend.jpg',
    steps: ['HTML/CSS', 'JavaScript', 'React', '상태관리', '배포'],
  },
  {
    id: 'ai',
    title: 'AI 엔지니어 로드맵',
    description: 'Python → 데이터 분석 → 머신러닝 → 딥러닝 → 프로젝트까지',
    imageUrl: '/assets/images/ai.jpg',
    steps: ['Python', '데이터 분석', '머신러닝', '딥러닝', '프로젝트'],
  },
]

const iconBtnClass =
  'pointer-events-auto inline-flex items-center justify-center rounded-md border-0 bg-transparent p-1.5 text-fg-subtle shadow-none transition-colors hover:bg-palette-accent/30 hover:text-palette-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary active:bg-palette-accent/40'

const fallbackGradients = [
  'from-sky-100 via-blue-50 to-indigo-100',
  'from-blue-100 via-slate-50 to-cyan-100',
  'from-cyan-100 via-sky-50 to-blue-100',
]

export const HeroCarouselBanner = ({
  onPrev,
  onNext,
  badgeText,
}: HeroCarouselBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [displayedBadge, setDisplayedBadge] = useState('')

  const currentSlide = useMemo(() => defaultSlides[currentIndex], [currentIndex])
  const fallbackGradient = fallbackGradients[currentIndex % fallbackGradients.length]

  useEffect(() => {
    setDisplayedBadge('')
    let index = 0

    const slideLabel = currentSlide.description

    const timer = window.setInterval(() => {
      index += 1
      setDisplayedBadge(slideLabel.slice(0, index))

      if (index >= slideLabel.length) {
        window.clearInterval(timer)
      }
    }, 45)

    return () => window.clearInterval(timer)
  }, [currentIndex])

  const handlePrev = () => {
    setDirection('left')
    setCurrentIndex((prev) => (prev === 0 ? defaultSlides.length - 1 : prev - 1))
    onPrev()
  }

  const handleNext = () => {
    setDirection('right')
    setCurrentIndex((prev) => (prev === defaultSlides.length - 1 ? 0 : prev + 1))
    onNext()
  }

  return (
    <section aria-roledescription="carousel" aria-label={badgeText} className="relative">
      <div className="relative overflow-hidden rounded-xl bg-surface shadow-sm ring-1 ring-palette-primary/12">
        <div
          key={currentSlide.id}
          className={`relative min-h-[280px] sm:min-h-[320px] ${
            direction === 'right'
              ? 'animate-[heroSlideInRight_0.45s_ease]'
              : 'animate-[heroSlideInLeft_0.45s_ease]'
          }`}
        >
          {currentSlide.imageUrl ? (
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient}`}
              aria-hidden="true"
            />
          )}

          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1.5px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/100 via-white/50 to-white/30" />

          <div className="relative z-10 flex min-h-[280px] flex-col justify-center px-6 py-7 sm:min-h-[320px] sm:px-8 sm:py-8 md:max-w-[72%]">
            <div key={currentSlide.id} className="hero-focus-wrap">
              <h2 className="hero-focus-title hero-focus-title--blur">
                {currentSlide.title}
              </h2>

              <h2 className="hero-focus-title hero-focus-title--sharp" aria-hidden="true">
                {currentSlide.title}
              </h2>

              <div className="hero-focus-frame" aria-hidden="true" />
            </div>
            <span className="mb-3 inline-flex w-fit rounded-full border border-white/50 bg-white/45 px-3 py-1 text-xs font-semibold text-transparent shadow-sm backdrop-blur-sm bg-clip-text bg-[length:200%_200%] bg-gradient-to-r from-blue-900 via-blue-500 to-cyan-600 animate-[heroBadgeIn_0.7s_ease,heroGradientFlow_5s_ease-in-out_infinite] sm:text-sm">
              {displayedBadge}
              <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-palette-primary align-middle" />
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 right-4 flex gap-1 sm:bottom-6 sm:right-6 sm:gap-0.5">
          <button
            type="button"
            aria-label="이전 슬라이드"
            className={iconBtnClass}
            onClick={handlePrev}
          >
            <ChevronLeft aria-hidden className="h-5 w-5 shrink-0" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="다음 슬라이드"
            className={iconBtnClass}
            onClick={handleNext}
          >
            <ChevronRight aria-hidden className="h-5 w-5 shrink-0" strokeWidth={2} />
          </button>
        </div>

        <div className="absolute bottom-4 left-6 z-20 flex gap-2 sm:bottom-6 sm:left-8">
            {defaultSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`${index + 1}번 슬라이드`}
                onClick={() => {
                  setDirection(index > currentIndex ? 'right' : 'left')
                  setCurrentIndex(index)
                }}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-palette-primary'
                    : 'w-2.5 bg-palette-primary/25 hover:bg-palette-primary/45'
                }`}
              />
            ))}
          </div>
        </div>

        <style>
          {`
            @keyframes heroSlideInRight {
              from {
                opacity: 0;
                transform: translateX(40px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes heroSlideInLeft {
              from {
                opacity: 0;
                transform: translateX(-40px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes heroFadeUp {
              from {
                opacity: 0;
                transform: translateY(8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes heroDrawLine {
              from {
                width: 0;
                opacity: 0.35;
              }
              to {
                width: 34px;
                opacity: 1;
              }
            }

            @media (min-width: 640px) {
              @keyframes heroDrawLine {
                from {
                  width: 0;
                  opacity: 0.35;
                }
                to {
                  width: 42px;
                  opacity: 1;
                }
              }
            }

            @keyframes heroTitleReveal {
              0% {
                opacity: 0;
                transform: translateY(18px) scale(0.985);
                letter-spacing: -0.02em;
                filter: blur(4px);
              }
              60% {
                opacity: 1;
                transform: translateY(0) scale(1.01);
                filter: blur(0);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                letter-spacing: 0;
                filter: blur(0);
              }
            }

            @keyframes heroTitleImpact {
              0% {
                opacity: 0;
                transform: translateY(36px) scale(0.92) rotateX(12deg);
                filter: blur(10px);
                letter-spacing: -0.04em;
              }
              55% {
                opacity: 1;
                transform: translateY(-4px) scale(1.03) rotateX(0deg);
                filter: blur(0);
                letter-spacing: -0.01em;
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
                letter-spacing: 0;
              }
            }

            @keyframes heroTitleGradientIn {
              0% {
                opacity: 0;
                transform: translateY(28px) scale(0.9);
                filter: blur(10px);
              }
              60% {
                opacity: 1;
                transform: translateY(-4px) scale(1.03);
                filter: blur(0);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
              }
            }
          `}

          {`
          .hero-focus-wrap {
            --focus-width: 200px;
            --focus-height: 72px;

            position: relative;
            display: inline-block;
            width: max-content;
            min-height: 76px;
          }

          .hero-focus-title {
            margin: 0;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -0.02em;
            white-space: nowrap;
            font-size: clamp(1.8rem, 3.2vw, 3rem);
          }

          .hero-focus-title--blur {
            color: rgba(15, 23, 42, 0.4);
            filter: blur(2px);
            opacity: 1;
          }

          .hero-focus-title--sharp {
            position: absolute;
            inset: 0;
            margin: 0;
            color: transparent;
            background-image: linear-gradient(to right, #172554, #2563eb, #22d3ee);
            background-size: 200% 200%;
            background-clip: text;
            -webkit-background-clip: text;
            white-space: nowrap;
            pointer-events: none;
            animation:
              heroFocusReveal 3.5s ease-in-out infinite alternate,
              heroGradientFlow 4s ease-in-out infinite;
          }

          .hero-focus-frame {
            position: absolute;
            top: 30%;
            left: 0;
            width: var(--focus-width);
            height: var(--focus-height);
            transform: translateY(-50%);
            pointer-events: none;
            animation: heroFocusFrameMove 3.5s ease-in-out infinite alternate;
            filter: drop-shadow(0 0 10px rgba(255,255,255,0.35));
          }

          .hero-focus-frame::before,
          .hero-focus-frame::after {
            content: '';
            position: absolute;
            inset: 0;
            background-repeat: no-repeat;
          }

          .hero-focus-frame::before {
            background-image:
              linear-gradient(#fff, #fff),
              linear-gradient(#fff, #fff),
              linear-gradient(#fff, #fff),
              linear-gradient(#fff, #fff);
            background-size:
              16px 2px,
              2px 16px,
              16px 2px,
              2px 16px;
            background-position:
              left top,
              left top,
              right top,
              right top;
          }

          .hero-focus-frame::after {
            background-image:
              linear-gradient(#fff, #fff),
              linear-gradient(#fff, #fff),
              linear-gradient(#fff, #fff),
              linear-gradient(#fff, #fff);
            background-size:
              2px 16px,
              16px 2px,
              2px 16px,
              16px 2px;
            background-position:
              left bottom,
              left bottom,
              right bottom,
              right bottom;
          }

          @keyframes heroFocusFrameMove {
            from {
              left: 0;
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            to {
              left: calc(100% - var(--focus-width));
              opacity: 1;
            }
          }

          @keyframes heroFocusReveal {
            from {
              clip-path: inset(-12px calc(100% - var(--focus-width)) -12px 0);
            }
            to {
              clip-path: inset(-12px 0 -12px calc(100% - var(--focus-width)));
            }
          }

          @keyframes heroGradientFlow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
        </style>
    </section>
  )
}