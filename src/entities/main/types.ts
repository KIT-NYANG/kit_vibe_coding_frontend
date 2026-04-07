export interface BrandLogo {
  /** 접근성용 대체 텍스트 */
  alt: string
  /** 로고 옆/아래 표시 이름 */
  title: string
  subtitle: string
}

export interface HeroSlide {
  id: string
  /** 히어로 배너에 표시할 한 줄 문구 */
  line: string
}

export interface CategoryChip {
  id: string
  label: string
}

/** 카테고리별 강의 카드 (썸네일 상단 · 제목 하단) */
export interface CategoryLecture {
  id: string
  categoryId: string
  thumbnailSrc: string
  thumbnailAlt: string
  title: string
}

export interface MainHomeModel {
  brand: BrandLogo
  heroSlides: HeroSlide[]
  categories: CategoryChip[]
  lectures: CategoryLecture[]
}
