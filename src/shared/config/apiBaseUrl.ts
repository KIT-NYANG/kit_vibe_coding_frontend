/**
 * API 베이스 URL — `.env`의 `VITE_API_BASE_URL`로 덮어씁니다.
 * 예: VITE_API_BASE_URL=http://localhost:8080
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? ''
