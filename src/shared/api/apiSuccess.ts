/**
 * 백엔드 공통 응답 code
 * - SUCCESS / OK: 일반 성공
 * - CREATED: POST 등 생성 성공 (예: 강의 등록)
 */
export const isApiSuccessCode = (code: string): boolean =>
  code === 'SUCCESS' || code === 'OK' || code === 'CREATED'
