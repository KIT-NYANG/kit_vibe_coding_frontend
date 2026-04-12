import { MediaCaptions, MediaCommunitySkin, MediaOutlet, MediaPlayer } from '@vidstack/react'

import 'vidstack/styles/base.css'
import 'vidstack/styles/defaults.css'
import 'vidstack/styles/ui/captions.css'
import 'vidstack/styles/community-skin/video.css'

import type { LecturePlaybackTeacherGuideDto } from '../../entities/lecture/types'
import { TriangleAlert, WandSparkles, Clock3 } from 'lucide-react'

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
          <div className="flex items-center justify-between gap-3">
          <div>
          <h2 className="text-base font-semibold text-fg">AI 추천 난이도 예상 구간 • 개선 제안</h2>
          <p className="mt-1 text-sm text-fg-subtle">
              학생이 이해하기 어려울 수 있는 구간과 강의 보완 아이디어를 확인해보세요
            </p>
          </div>

          <div className="hidden rounded-lg border border-palette-primary/15 bg-white/70 px-3 py-1 text-xs font-medium text-palette-primary sm:block">
            총 {guides.length}개 구간
          </div>
        </div>

          <ul className="space-y-3">
            {guides.map((guide, index) => (
              <li
                key={`${guide.predictedDifficultSection}-${index}`}
                className="group overflow-hidden rounded-2xl border border-palette-primary/15 bg-surface/95 shadow-sm ring-1 ring-palette-primary/8 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="border-b border-palette-primary/10 bg-palette-accent/12 px-4 py-3 sm:px-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-palette-accent/20 px-2.5 py-1 text-xs font-semibold text-fg-subtle">
                        AI 분석 구간 {index + 1}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-palette-primary/10 px-3 py-1 font-mono text-xs font-semibold text-palette-primary ring-1 ring-palette-primary/10">
                        <Clock3 className="h-3.5 w-3.5" />
                      {guide.predictedDifficultSection}
                    </span>
                  </div>
                </div>

                  <div className="space-y-3 px-4 py-4 sm:px-5">
                  <div className="rounded-xl border border-amber-200/100 bg-amber-50/70 p-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <TriangleAlert className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold tracking-wide text-amber-700">
                          이해 어려움이 예상되는 이유
                        </p>
                        <p className="mt-1 text-sm leading-7 text-fg">
                          {guide.predictedReason}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  
                  <div className="rounded-xl border border-violet-200/100 bg-violet-50/70 p-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                        <WandSparkles className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold tracking-wide text-violet-700">
                          개선 제안
                        </p>
                        <p className="mt-1 text-sm leading-7 text-fg">
                          {guide.improvementSuggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
