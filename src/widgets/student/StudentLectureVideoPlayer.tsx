import { useMemo } from 'react'
import { MediaCaptions, MediaCommunitySkin, MediaOutlet, MediaPlayer } from '@vidstack/react'
import type { TextTrackInit } from 'vidstack'

import 'vidstack/styles/base.css'
import 'vidstack/styles/defaults.css'
import 'vidstack/styles/ui/captions.css'
import 'vidstack/styles/community-skin/video.css'

import type { LecturePlaybackQuizDto, LecturePlaybackSegmentDto } from '../../entities/lecture/types'
import { segmentsToWebVttContent } from '../../shared/lib/segmentsToWebVtt'
import { LecturePlaybackLogBridge } from './LecturePlaybackLogBridge'
import { LectureQuizBridge } from './LectureQuizBridge'
import { LectureResumePlaybackBridge } from './LectureResumePlaybackBridge'

interface StudentLectureVideoPlayerProps {
  lectureId: number
  /** 강의 길이(초) — 이어 보기 완료 여부 판단용 */
  durationSeconds: number
  title: string
  /** 절대 URL (resolveApiAssetUrl 적용 후) */
  src: string
  /** STT 구간 자막 — 있으면 WebVTT로 플레이어에 연동 */
  segments?: LecturePlaybackSegmentDto[] | null
  /** 자막 트랙 `srclang` (BCP 47) */
  transcriptLanguage?: string | null
  /** 분석 퀴즈 — `quizInsertTimeSec`에 O/X 퀴즈 표시 */
  quizzes?: LecturePlaybackQuizDto[] | null
}

/**
 * 학생 시청 전용 — `LectureVideoPlayer`와 동일 UI에 재생 로그 브리지를 포함합니다.
 */
export const StudentLectureVideoPlayer = ({
  lectureId,
  durationSeconds,
  title,
  src,
  segments,
  transcriptLanguage,
  quizzes,
}: StudentLectureVideoPlayerProps) => {
  const textTracks = useMemo((): TextTrackInit[] => {
    const vtt = segmentsToWebVttContent(segments ?? undefined)
    if (!vtt) return []
    const lang = (transcriptLanguage ?? 'ko').trim() || 'ko'
    return [
      {
        kind: 'subtitles',
        label: '자막 (STT)',
        language: lang,
        type: 'vtt',
        content: vtt,
        default: true,
      },
    ]
  }, [segments, transcriptLanguage])

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-palette-primary/12 [&_[data-media-player]]:h-full [&_[data-media-player]]:w-full">
      <MediaPlayer
        className="relative h-full w-full"
        crossOrigin=""
        playsInline
        src={src}
        title={title}
        textTracks={textTracks}
      >
        <MediaOutlet>
          <MediaCaptions />
        </MediaOutlet>
        <LecturePlaybackLogBridge lectureId={lectureId} />
        <LectureResumePlaybackBridge lectureId={lectureId} durationSeconds={durationSeconds} />
        <LectureQuizBridge key={lectureId} quizzes={quizzes ?? []} />
        <MediaCommunitySkin />
      </MediaPlayer>
    </div>
  )
}
