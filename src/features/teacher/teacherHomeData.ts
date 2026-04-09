import type { TeacherHomeModel } from '../../entities/teacher/types'

const placeholderMeta = {
  category: 'BACKEND',
  description: '',
  createdAt: '2026-01-01T00:00:00',
} as const

export const teacherHomeData: TeacherHomeModel = {
  uploadedLectures: [
    {
      id: 'tlec-1',
      title: 'Spring Boot 입문',
      thumbnailSrc: '/thumbnail-placeholder.svg',
      thumbnailAlt: 'Spring Boot 입문 썸네일',
      ...placeholderMeta,
    },
    {
      id: 'tlec-2',
      title: 'REST API 설계',
      thumbnailSrc: '/thumbnail-placeholder.svg',
      thumbnailAlt: 'REST API 설계 썸네일',
      ...placeholderMeta,
    },
    {
      id: 'tlec-3',
      title: 'JPA·Hibernate',
      thumbnailSrc: '/thumbnail-placeholder.svg',
      thumbnailAlt: 'JPA·Hibernate 썸네일',
      ...placeholderMeta,
    },
    {
      id: 'tlec-4',
      title: 'MSA 기초',
      thumbnailSrc: '/thumbnail-placeholder.svg',
      thumbnailAlt: 'MSA 기초 썸네일',
      ...placeholderMeta,
    },
    {
      id: 'tlec-5',
      title: 'Redis 캐싱',
      thumbnailSrc: '/thumbnail-placeholder.svg',
      thumbnailAlt: 'Redis 캐싱 썸네일',
      ...placeholderMeta,
    },
    {
      id: 'tlec-6',
      title: 'Kafka 입문',
      thumbnailSrc: '/thumbnail-placeholder.svg',
      thumbnailAlt: 'Kafka 입문 썸네일',
      ...placeholderMeta,
    },
    {
      id: 'tlec-7',
      title: '보안·OAuth2',
      thumbnailSrc: '/thumbnail-placeholder.svg',
      thumbnailAlt: '보안·OAuth2 썸네일',
      ...placeholderMeta,
    },
    {
      id: 'tlec-8',
      title: '배포·Docker',
      thumbnailSrc: '/thumbnail-placeholder.svg',
      thumbnailAlt: '배포·Docker 썸네일',
      ...placeholderMeta,
    },
  ],
}
