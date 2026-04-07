import axios from 'axios'
import { API_BASE_URL } from '../config/apiBaseUrl'
import { getAccessToken } from '../lib/tokenStorage'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
