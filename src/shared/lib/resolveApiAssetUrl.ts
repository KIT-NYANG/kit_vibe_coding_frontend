import { API_BASE_URL } from '../config/apiBaseUrl'

/** 상대 경로(`/uploads/...`)를 API 호스트 기준 절대 URL로 만듭니다. */
export function resolveApiAssetUrl(pathOrUrl: string): string {
  const trimmed = pathOrUrl.trim()
  if (!trimmed) return '/thumbnail-placeholder.svg'
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${API_BASE_URL}${path}`
}
