import type { LecturePlaybackSegmentDto } from '../../entities/lecture/types'

/** WebVTT cue 텍스트에서 `&`, `<` 이스케이프 */
const escapeCueText = (raw: string): string =>
  raw.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const msToVttTimestamp = (ms: number): string => {
  const totalSeconds = Math.max(0, ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const intSec = Math.floor(seconds)
  const fracMs = Math.round((seconds - intSec) * 1000)
  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  const ss = `${String(intSec).padStart(2, '0')}.${String(fracMs).padStart(3, '0')}`
  return `${hh}:${mm}:${ss}`
}

/**
 * GET /api/lectures/:id 의 `segments`(ms 구간 + 문장)를 WebVTT 문자열로 변환합니다.
 * Vidstack `textTracks[].content` + `type: 'vtt'` 로 넘기면 자막으로 재생됩니다.
 */
export const segmentsToWebVttContent = (
  segments: LecturePlaybackSegmentDto[] | null | undefined,
): string | null => {
  if (segments == null || segments.length === 0) return null

  const lines: string[] = ['WEBVTT', '']

  for (const seg of segments) {
    const start = Math.min(seg.startMs, seg.endMs)
    const end = Math.max(seg.startMs, seg.endMs)
    const text = escapeCueText(seg.text.trim())
    if (text.length === 0) continue

    lines.push(
      `${msToVttTimestamp(start)} --> ${msToVttTimestamp(end)}`,
      text,
      '',
    )
  }

  if (lines.length <= 2) return null
  return lines.join('\n')
}
