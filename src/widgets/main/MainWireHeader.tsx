import { LogOut, User, UserLock, UserPlus } from 'lucide-react'
import type { BrandLogo } from '../../entities/main/types'

interface MainWireHeaderProps {
  brand: BrandLogo
  isLoggedIn: boolean
  /** 로그인 시 환영 문구에 사용 */
  welcomeName?: string
  /** 학생 등: 환영 이름 클릭 시 (예: 마이페이지) */
  onWelcomeNameClick?: () => void
  isTeacher?: boolean
  onOpenLogin: () => void
  onOpenSignup: () => void
  onLogout: () => void
}

const actionButtonClass =
  'inline-flex items-center gap-2 rounded-full border border-palette-primary/12 bg-white/70 px-3 py-2 text-sm font-medium text-fg transition hover:border-palette-primary/25 hover:bg-palette-accent/20 hover:text-palette-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary'

const primaryActionButtonClass =
  'inline-flex items-center gap-2 rounded-full bg-palette-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary'

const disabledButtonClass =
  'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-400 cursor-not-allowed'

export const MainWireHeader = ({
  brand,
  isLoggedIn,
  welcomeName,
  onWelcomeNameClick,
  isTeacher = false,
  onOpenLogin,
  onOpenSignup,
  onLogout,
}: MainWireHeaderProps) => {
  const canMoveToMypage = !isTeacher && !!onWelcomeNameClick

  return (
    <header className="border-b border-palette-primary/15 bg-surface/95 py-3 backdrop-blur-sm">
      <div className="mx-auto flex w-full items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
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
              <div className="inline-flex items-center gap-2 text-sm font-medium text-fg">
                <UserLock aria-hidden className="h-4 w-4 text-palette-primary" strokeWidth={1.9} />
                <span>{welcomeName ?? '회원'}님 환영합니다!</span>
              </div>

              <button
                type="button"
                className={canMoveToMypage ? actionButtonClass : disabledButtonClass}
                onClick={canMoveToMypage ? onWelcomeNameClick : undefined}
                disabled={!canMoveToMypage}
              >
                <User aria-hidden className="h-4 w-4" strokeWidth={1.9} />
                <span>마이페이지</span>
              </button>

              <button className={primaryActionButtonClass} type="button" onClick={onLogout}>
                <LogOut aria-hidden className="h-4 w-4" strokeWidth={1.9} />
                <span>로그아웃</span>
              </button>
            </>
          ) : (
            <>
              <button className={actionButtonClass} type="button" onClick={onOpenLogin}>
                <User aria-hidden className="h-4 w-4" strokeWidth={1.9} />
                <span>로그인</span>
              </button>
              <button className={primaryActionButtonClass} type="button" onClick={onOpenSignup}>
                <UserPlus aria-hidden className="h-4 w-4" strokeWidth={1.9} />
                <span>회원가입</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
