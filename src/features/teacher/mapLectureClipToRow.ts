import type { LectureClipDto } from '../../entities/lecture/types'
import { resolveApiAssetUrl } from '../../shared/lib/resolveApiAssetUrl'

export interface TeacherLectureClipRow {
  id: number
  title: string
  thumbnailSrc: string
  durationLabel: string
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
    thumbnailSrc: resolveApiAssetUrl(dto.thumbnailUrl),
    durationLabel: formatDuration(dto.durationSeconds),
  }
}
