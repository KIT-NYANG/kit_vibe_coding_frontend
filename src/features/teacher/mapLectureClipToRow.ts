import type { LectureClipDto } from '../../entities/lecture/types'
import { resolveThumbnailSrc } from '../../shared/lib/resolveApiAssetUrl'

export interface TeacherLectureClipRow {
  id: number
  title: string
  description: string
  thumbnailSrc: string
  durationLabel: string
  sttStatus?: string
}

const formatDuration = (seconds: number): string => {
  const s = Math.max(0, Math.floor(seconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

export function mapLectureClipToRow(dto: LectureClipDto): TeacherLectureClipRow {
  return {
    id: dto.lectureId,
    title: dto.title,
    description: (dto.description ?? '').trim(),
    thumbnailSrc: resolveThumbnailSrc(dto.thumbnailUrl),
    durationLabel: formatDuration(dto.durationSeconds),
    sttStatus: dto.sttStatus,
  }
}
