import type { MainHomeModel } from '../../entities/main/types'
import { brandData } from '../brand/brandData'

/** 브랜드·히어로·카테고리 칩만 유지. 강좌 목록은 `useMainHome`에서 API로 채웁니다. */
export const mainHomeData: MainHomeModel = {
  brand: brandData,
  heroSlides: [],
  categories: [
    { id: 'BACKEND', label: '백엔드' },
    { id: 'FRONTEND', label: '프론트엔드' },
    { id: 'AI', label: 'AI' },
    { id: 'INFRA', label: '인프라' },
    { id: 'DATABASE', label: '데이터베이스' },
    { id: 'DEVOPS', label: '데브옵스' },
    { id: 'CS', label: '컴퓨터 공학' },
  ],
  lectures: [],
}
