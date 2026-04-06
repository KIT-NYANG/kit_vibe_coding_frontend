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
    <header className="border-b border-gray-300/80 bg-gray-100 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="sr-only">{brand.alt}</span>
          <div
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-200"
          >
            <span className="select-none text-xl leading-none">🐐🐐</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900">{brand.title}</p>
            <p className="truncate text-xs text-gray-500">{brand.subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              <p className="max-w-[9rem] truncate text-xs text-gray-800 sm:max-w-xs sm:text-sm">
                <span className="font-medium text-gray-900">{welcomeName ?? '회원'}</span>님 환영합니다.
              </p>
              <button
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 sm:px-4 sm:text-sm"
                onClick={onLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 sm:px-4 sm:text-sm"
                onClick={onOpenLogin}
              >
                로그인
              </button>
              <button
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 sm:px-4 sm:text-sm"
                onClick={onOpenSignup}
              >
                회원가입
              </button>
            </>
          )}
          <button
            type="button"
            aria-label="메뉴 열기"
            className="rounded-md p-2 text-gray-800 ring-1 ring-gray-300 bg-white hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            onClick={onMenuClick}
          >
            <svg aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
