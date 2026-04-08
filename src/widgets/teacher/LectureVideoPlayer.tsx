import { MediaCaptions, MediaCommunitySkin, MediaOutlet, MediaPlayer } from '@vidstack/react'

import 'vidstack/styles/base.css'
import 'vidstack/styles/defaults.css'
import 'vidstack/styles/ui/captions.css'
import 'vidstack/styles/community-skin/video.css'

interface LectureVideoPlayerProps {
  title: string
  /** 절대 URL (resolveApiAssetUrl 적용 후) */
  src: string
}

/**
 * Vidstack 기반 플레이어 — WebVTT 자막 트랙은 추후 `MediaPlayer`에 트랙 추가로 연동 가능합니다.
 * @see https://vidstack.io/docs/react/player/core-concepts/loading#text-tracks
 */
export const LectureVideoPlayer = ({ title, src }: LectureVideoPlayerProps) => {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-palette-primary/12 [&_[data-media-player]]:h-full [&_[data-media-player]]:w-full">
      <MediaPlayer className="h-full w-full" crossOrigin="" playsInline src={src} title={title}>
        <MediaOutlet>
          <MediaCaptions />
        </MediaOutlet>
        <MediaCommunitySkin />
      </MediaPlayer>
    </div>
  )
}
