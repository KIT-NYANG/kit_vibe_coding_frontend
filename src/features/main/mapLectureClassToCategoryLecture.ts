import type { LectureClassDto } from '../../entities/lecture/types'
import type { CategoryLecture } from '../../entities/main/types'
import { resolveThumbnailSrc } from '../../shared/lib/resolveApiAssetUrl'

export function mapLectureClassToCategoryLecture(
  dto: LectureClassDto,
  categoryChipId: string,
): CategoryLecture {
  return {
    id: String(dto.lectureClassId),
    categoryId: categoryChipId,
    thumbnailSrc: resolveThumbnailSrc(dto.thumbnailUrl),
    thumbnailAlt: `${dto.title} 썸네일`,
    title: dto.title,
  }
}
