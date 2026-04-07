import { PanelRightClose } from 'lucide-react'
import type { BrandLogo } from '../../entities/main/types'

interface MainWireHeaderProps {
  brand: BrandLogo
  onMenuClick?: () => void
  isLoggedIn: boolean
  /** 로그인 시 환영 문구에 사용 */
  welcomeName?: string
  onOpenLogin: () => void
  onOpenSignup: () => void
  onLogout: () => void
}

const textActionClass =
  'cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-fg underline-offset-4 transition hover:text-palette-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary'

export const MainWireHeader = ({
  brand,
  onMenuClick,
  isLoggedIn,
  welcomeName,
  onOpenLogin,
  onOpenSignup,
  onLogout,
}: MainWireHeaderProps) => {
  return (
    <header className="border-b border-palette-primary/15 bg-surface/95 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <img
            alt={brand.alt}
            className="h-9 w-auto max-h-10 max-w-[min(200px,55vw)] shrink-0 object-contain object-left sm:h-11 sm:max-h-12 sm:max-w-[220px]"
            decoding="async"
            src="/nacom-logo.png"
          />
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {isLoggedIn ? (
            <>
              <p className="max-w-[9rem] truncate text-xs text-fg-subtle sm:max-w-xs sm:text-sm">
                <span className="font-medium text-fg">{welcomeName ?? '회원'}</span>님 환영합니다.
              </p>
              <button className={textActionClass} type="button" onClick={onLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className={textActionClass} type="button" onClick={onOpenLogin}>
                로그인
              </button>
              <button className={textActionClass} type="button" onClick={onOpenSignup}>
                회원가입
              </button>
            </>
          )}
          <button
            type="button"
            aria-label="메뉴 열기"
            className="rounded-md bg-transparent p-1.5 text-palette-primary transition hover:bg-palette-accent/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary"
            onClick={onMenuClick}
          >
            <PanelRightClose aria-hidden className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  )
}
