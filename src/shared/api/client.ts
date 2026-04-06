/**
 * API 호출은 shared/api에서만 수행합니다 (frontend_rules.md).
 * 컴포넌트에서 직접 fetch/axios 호출하지 마세요.
 */

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
}

export const getJson = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url, { headers: defaultHeaders })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return (await response.json()) as T
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(message)
  }
}
