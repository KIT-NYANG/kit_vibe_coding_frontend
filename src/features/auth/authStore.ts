import { create } from 'zustand'
import type { AuthUser } from '../../entities/auth/types'
import { clearAuthStorage, setAccessToken, setStoredAuthUser } from '../../shared/lib/tokenStorage'

interface AuthState {
  user: AuthUser | null
  /** API에서 세션 무효(401/403) 후 로그인 모달에 표시할 안내 */
  sessionExpiredHint: string | null
  /** 로그인 성공 후 토큰·사용자 저장 */
  setSession: (user: AuthUser, accessToken: string) => void
  /** 새로고침 후 localStorage에서 복원 */
  hydrateUser: (user: AuthUser) => void
  logout: () => void
  clearSessionExpiredHint: () => void
  /** 만료·거절 응답 시 로컬 세션 제거 + 재로그인 유도 */
  logoutAndPromptRelogin: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  sessionExpiredHint: null,
  setSession: (user, accessToken) => {
    setAccessToken(accessToken)
    setStoredAuthUser(user)
    set({ user, sessionExpiredHint: null })
  },
  hydrateUser: (user) => set({ user }),
  logout: () => {
    clearAuthStorage()
    set({ user: null, sessionExpiredHint: null })
  },
  clearSessionExpiredHint: () => set({ sessionExpiredHint: null }),
  logoutAndPromptRelogin: () => {
    clearAuthStorage()
    set({
      user: null,
      sessionExpiredHint: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
    })
  },
}))
