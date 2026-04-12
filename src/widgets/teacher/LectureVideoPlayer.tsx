import { MediaCaptions, MediaCommunitySkin, MediaOutlet, MediaPlayer } from '@vidstack/react'

import 'vidstack/styles/base.css'
import 'vidstack/styles/defaults.css'
import 'vidstack/styles/ui/captions.css'
import 'vidstack/styles/community-skin/video.css'

import type { LecturePlaybackTeacherGuideDto } from '../../entities/lecture/types'

interface LectureVideoPlayerProps {
  title: string
  /** 절대 URL (resolveApiAssetUrl 적용 후) */
  src: string
  /** GET /api/lectures/:id `analysis.teacherGuides` — 영상 하단 안내 */
  teacherGuides?: LecturePlaybackTeacherGuideDto[] | null
}

/**
 * Vidstack 기반 플레이어 — WebVTT 자막 트랙은 추후 `MediaPlayer`에 트랙 추가로 연동 가능합니다.
 * @see https://vidstack.io/docs/react/player/core-concepts/loading#text-tracks
 */
export const LectureVideoPlayer = ({ title, src, teacherGuides }: LectureVideoPlayerProps) => {
  const guides = teacherGuides?.filter(Boolean) ?? []

  return (
    <div className="w-full space-y-4">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-palette-primary/12 [&_[data-media-player]]:h-full [&_[data-media-player]]:w-full">
        <MediaPlayer className="h-full w-full" crossOrigin="" playsInline src={src} title={title}>
          <MediaOutlet>
            <MediaCaptions />
          </MediaOutlet>
          <MediaCommunitySkin />
        </MediaPlayer>
      </div>

      {guides.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-fg">AI 추천 난이도 예상 구간. 개선 제안</h2>
          <ul className="space-y-3">
            {guides.map((guide, index) => (
              <li
                key={`${guide.predictedDifficultSection}-${index}`}
                className="rounded-xl border border-palette-primary/15 bg-surface/90 px-4 py-3 ring-1 ring-palette-primary/10"
              >
                <p className="inline-flex items-center rounded-md bg-palette-accent/30 px-2 py-0.5 font-mono text-xs font-semibold text-palette-primary">
                  {guide.predictedDifficultSection}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg">{guide.predictedReason}</p>
                <div className="mt-3 border-t border-palette-primary/10 pt-3">
                  <p className="text-xs font-semibold text-fg-subtle">개선 제안</p>
                  <p className="mt-1 text-sm leading-relaxed text-fg">{guide.improvementSuggestion}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
