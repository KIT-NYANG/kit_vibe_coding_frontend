import axios from 'axios'
import { useAuthStore } from '../../features/auth/authStore'
import { API_BASE_URL } from '../config/apiBaseUrl'
import { getAccessToken } from '../lib/tokenStorage'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
})

const isAuthCredentialRequest = (url: string | undefined): boolean => {
  if (!url) return false
  return url.includes('/api/user/login') || url.includes('/api/user/signup')
}

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type')
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error)
    const status = error.response?.status
    if (status !== 401 && status !== 403) return Promise.reject(error)
    if (isAuthCredentialRequest(error.config?.url)) return Promise.reject(error)
    if (!getAccessToken()) return Promise.reject(error)
    useAuthStore.getState().logoutAndPromptRelogin()
    return Promise.reject(error)
  },
)
