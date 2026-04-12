import type { AuthUser } from '../../entities/auth/types'

const ACCESS_TOKEN_KEY = 'kit_access_token'
const AUTH_USER_KEY = 'kit_auth_user'

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const setStoredAuthUser = (user: AuthUser): void => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export const getStoredAuthUser = (): AuthUser | null => {
  const raw = localStorage.getItem(AUTH_USER_KEY)
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'email' in parsed &&
      'displayName' in parsed &&
      'role' in parsed &&
      typeof (parsed as AuthUser).email === 'string' &&
      typeof (parsed as AuthUser).displayName === 'string' &&
      typeof (parsed as AuthUser).role === 'string'
    ) {
      return parsed as AuthUser
    }
    return null
  } catch {
    return null
  }
}

export const clearAuthStorage = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}
