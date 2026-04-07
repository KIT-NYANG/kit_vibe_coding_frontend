import { useCallback, useEffect } from 'react'
import type { AuthUser } from '../../entities/auth/types'
import { postLogin } from '../../shared/api/authApi'
import { getAccessToken, getStoredAuthUser } from '../../shared/lib/tokenStorage'
import { useAuthStore } from './authStore'

export const useAuthSession = () => {
  const user = useAuthStore((s) => s.user)
  const setSession = useAuthStore((s) => s.setSession)
  const hydrateUser = useAuthStore((s) => s.hydrateUser)
  const logoutStore = useAuthStore((s) => s.logout)

  useEffect(() => {
    const token = getAccessToken()
    const stored = getStoredAuthUser()
    if (token && stored) {
      hydrateUser(stored)
    }
  }, [hydrateUser])

  const loginWithCredentials = useCallback(
    async (email: string, password: string) => {
      const data = await postLogin({ email, password })
      const nextUser: AuthUser = {
        email: data.email,
        displayName: data.name,
        role: data.role,
      }
      setSession(nextUser, data.accessToken)
    },
    [setSession],
  )

  const logout = useCallback(() => {
    logoutStore()
  }, [logoutStore])

  return {
    user,
    isLoggedIn: user !== null,
    loginWithCredentials,
    logout,
  }
}
