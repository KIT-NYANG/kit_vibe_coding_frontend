import type { LectureClassDto } from '../../entities/lecture/types'
import type { TeacherLectureCard } from '../../entities/teacher/types'
import { resolveApiAssetUrl } from '../../shared/lib/resolveApiAssetUrl'

export function mapLectureClassToCard(dto: LectureClassDto): TeacherLectureCard {
  return {
    id: String(dto.lectureClassId),
    title: dto.title,
    thumbnailSrc: resolveApiAssetUrl(dto.thumbnailUrl),
    thumbnailAlt: `${dto.title} 썸네일`,
    category: dto.category,
    description: dto.description ?? '',
    createdAt: dto.createdAt,
  }
}
