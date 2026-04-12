/** 클라이언트에 보관하는 로그인 사용자 */
export interface AuthUser {
  email: string
  displayName: string
  role: string
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface LoginResponseData {
  accessToken: string
  tokenType: string
  email: string
  name: string
  role: string
}

export interface ApiEnvelope<T> {
  code: string
  message: string
  data: T | null
}

export type UserRole = 'STUDENT' | 'TEACHER'

export interface SignupRequestBody {
  email: string
  password: string
  passwordConfirm: string
  name: string
  age: number
  phone: string
  role: UserRole
}
