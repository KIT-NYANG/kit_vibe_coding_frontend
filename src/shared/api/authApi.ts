import axios from 'axios'
import type {
  ApiEnvelope,
  LoginRequestBody,
  LoginResponseData,
  SignupRequestBody,
} from '../../entities/auth/types'
import { axiosInstance } from './axiosInstance'

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (isRecord(data) && typeof data.message === 'string') {
      return data.message
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return '요청에 실패했습니다.'
}

/**
 * POST /api/user/login
 */
export const postLogin = async (body: LoginRequestBody): Promise<LoginResponseData> => {
  try {
    const { data } = await axiosInstance.post<ApiEnvelope<LoginResponseData>>(
      '/api/user/login',
      body,
    )
    if (data.code !== 'SUCCESS' || data.data === null) {
      throw new Error(data.message || '로그인에 실패했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('로그인에 실패했습니다.')
  }
}

/**
 * POST /api/user/signup
 */
export const postSignup = async (body: SignupRequestBody): Promise<string> => {
  try {
    const { data } = await axiosInstance.post<ApiEnvelope<string>>('/api/user/signup', body)
    if (data.code !== 'SUCCESS' || data.data === null) {
      throw new Error(data.message || '회원가입에 실패했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('회원가입에 실패했습니다.')
  }
}
