import type { MyLectureListItemDto } from '../../entities/lecture/types'
import type { CategoryLecture } from '../../entities/main/types'
import { resolveThumbnailSrc } from '../../shared/lib/resolveApiAssetUrl'

export function mapMyLectureItemToCategoryLecture(dto: MyLectureListItemDto): CategoryLecture {
  return {
    id: String(dto.lectureClassId),
    categoryId: dto.category,
    thumbnailSrc: resolveThumbnailSrc(dto.thumbnailUrl),
    thumbnailAlt: `${dto.title} 썸네일`,
    title: dto.title,
  }
}
