import { API_BASE_URL } from '../config/apiBaseUrl'

/** public 폴더의 기본 썸네일 (강의·클립 썸네일 없음·로드 실패 시) */
export const THUMBNAIL_PLACEHOLDER = '/thumbnail-placeholder.svg'

/** 상대 경로(`/uploads/...`)를 API 호스트 기준 절대 URL로 만듭니다. 비어 있으면 빈 문자열(비디오 등). */
export function resolveApiAssetUrl(pathOrUrl: string | null | undefined): string {
  if (pathOrUrl == null) return ''
  const trimmed = pathOrUrl.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${API_BASE_URL}${path}`
}

/** 강좌·클립 썸네일 URL. 없거나 공백이면 플레이스홀더 SVG 경로를 반환합니다. */
export function resolveThumbnailSrc(pathOrUrl: string | null | undefined): string {
  if (pathOrUrl == null) return THUMBNAIL_PLACEHOLDER
  const trimmed = pathOrUrl.trim()
  if (!trimmed) return THUMBNAIL_PLACEHOLDER
  return resolveApiAssetUrl(trimmed)
}
