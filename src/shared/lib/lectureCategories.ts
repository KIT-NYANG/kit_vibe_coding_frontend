/** GET/POST 등 API에 넣는 강좌 카테고리 코드 (백엔드 enum과 동일) */
export const LECTURE_CATEGORY_CODES = [
  'BACKEND',
  'FRONTEND',
  'AI',
  'INFRA',
  'DATABASE',
  'DEVOPS',
  'CS',
] as const

export type LectureCategoryCode = (typeof LECTURE_CATEGORY_CODES)[number]

/** 코드 → 화면 표시명 */
export const LECTURE_CATEGORY_LABEL: Record<LectureCategoryCode, string> = {
  BACKEND: '백엔드',
  FRONTEND: '프론트엔드',
  AI: 'AI',
  INFRA: '인프라',
  DATABASE: '데이터베이스',
  DEVOPS: '데브옵스',
  CS: '컴퓨터 공학',
}

export const LECTURE_CATEGORY_OPTIONS: { value: LectureCategoryCode; label: string }[] =
  LECTURE_CATEGORY_CODES.map((value) => ({
    value,
    label: LECTURE_CATEGORY_LABEL[value],
  }))

export function getLectureCategoryLabel(code: string): string {
  return (LECTURE_CATEGORY_LABEL as Record<string, string>)[code] ?? code
}

export function isLectureCategoryCode(value: string): value is LectureCategoryCode {
  return (LECTURE_CATEGORY_CODES as readonly string[]).includes(value)
}
