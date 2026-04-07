import { create } from 'zustand'
import type { AuthUser } from '../../entities/auth/types'
import { clearAuthStorage, setAccessToken, setStoredAuthUser } from '../../shared/lib/tokenStorage'

interface AuthState {
  user: AuthUser | null
  /** 로그인 성공 후 토큰·사용자 저장 */
  setSession: (user: AuthUser, accessToken: string) => void
  /** 새로고침 후 localStorage에서 복원 */
  hydrateUser: (user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setSession: (user, accessToken) => {
    setAccessToken(accessToken)
    setStoredAuthUser(user)
    set({ user })
  },
  hydrateUser: (user) => set({ user }),
  logout: () => {
    clearAuthStorage()
    set({ user: null })
  },
}))
