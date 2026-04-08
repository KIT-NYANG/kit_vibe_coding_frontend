import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { TeacherLectureCard } from '../../entities/teacher/types'
import type { TeacherLectureClipRow } from '../../features/teacher/mapLectureClipToRow'
import { THUMBNAIL_PLACEHOLDER } from '../../shared/lib/resolveApiAssetUrl'

const formatUploadDate = (iso: string): string => {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return new Intl.DateTimeFormat('ko-KR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d)
  } catch {
    return iso
  }
}

interface StudentLectureClassDetailProps {
  lecture: TeacherLectureCard
  onBack: () => void
  backLabel?: string
  clips: TeacherLectureClipRow[]
  clipsLoading: boolean
  clipsError: string | null
  onRetryClips: () => void
  clipsTotalElements: number
  clipsPageRangeStart: number
  clipsPageRangeEnd: number
  clipsCurrentPageDisplay: number
  clipsTotalPages: number
  clipsShowPagination: boolean
  clipsCanGoPrev: boolean
  clipsCanGoNext: boolean
  onClipsPrev: () => void
  onClipsNext: () => void
  /** 마이페이지 경로로 들어온 경우에만 전달 — 영상 클릭 시 시청 이동 */
  onClipWatch?: (clip: TeacherLectureClipRow) => void
}

export const StudentLectureClassDetail = ({
  lecture,
  onBack,
  backLabel = '← 홈',
  clips,
  clipsLoading,
  clipsError,
  onRetryClips,
  clipsTotalElements,
  clipsPageRangeStart,
  clipsPageRangeEnd,
  clipsCurrentPageDisplay,
  clipsTotalPages,
  clipsShowPagination,
  clipsCanGoPrev,
  clipsCanGoNext,
  onClipsPrev,
  onClipsNext,
  onClipWatch,
}: StudentLectureClassDetailProps) => {
  const iconBtnClass =
    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-transparent text-palette-primary transition hover:bg-palette-accent/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary disabled:pointer-events-none disabled:opacity-40'

  return (
    <div className="space-y-6">
      <button
        type="button"
        className="text-sm font-medium text-fg-subtle underline-offset-4 transition hover:text-palette-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary"
        onClick={onBack}
      >
        {backLabel}
      </button>

      <section className="rounded-2xl bg-palette-accent/12 p-5 ring-1 ring-palette-primary/12 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-fg sm:text-3xl">{lecture.title}</h1>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-surface shadow-md ring-1 ring-palette-primary/12">
          <div className="aspect-video w-full overflow-hidden bg-palette-accent/25">
            <img
              alt={lecture.thumbnailAlt}
              className="h-full w-full object-cover"
              decoding="async"
              src={lecture.thumbnailSrc}
              onError={(e) => {
                e.currentTarget.src = THUMBNAIL_PLACEHOLDER
              }}
            />
          </div>
          <div className="border-t border-palette-primary/10 bg-surface px-4 py-4 sm:px-6">
            <p className="text-center text-lg font-semibold text-fg">{lecture.title}</p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-2xl space-y-3 rounded-xl bg-surface px-5 py-5 ring-1 ring-palette-primary/12 sm:px-6">
          {lecture.teacherName ? (
            <p className="text-sm leading-relaxed text-fg">
              <span className="font-semibold text-fg">강사</span>
              <span className="text-fg-subtle">: </span>
              {lecture.teacherName}
            </p>
          ) : null}
          <p className="text-sm leading-relaxed text-fg">
            <span className="font-semibold text-fg">카테고리</span>
            <span className="text-fg-subtle">: </span>
            {lecture.category}
          </p>
          <p className="text-sm leading-relaxed text-fg">
            <span className="font-semibold text-fg">설명</span>
            <span className="text-fg-subtle">: </span>
            {lecture.description.trim() ? lecture.description : '등록된 설명이 없습니다.'}
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-right text-xs text-fg-subtle sm:text-sm">
          업로드일: {formatUploadDate(lecture.createdAt)}
        </p>
      </section>

      <section className="rounded-2xl bg-palette-accent/12 p-5 ring-1 ring-palette-primary/12 sm:p-8">
        <div>
          <h2 className="text-base font-semibold text-fg">강의 영상</h2>
          <p className="mt-1 text-xs text-fg-subtle">이 강좌에 등록된 영상 목록입니다.</p>
        </div>

        {clipsLoading ? (
          <p className="mt-6 text-center text-sm text-fg-subtle">영상 목록을 불러오는 중…</p>
        ) : clipsError ? (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
            <p>{clipsError}</p>
            <button
              type="button"
              className="mt-2 rounded-lg bg-palette-primary px-3 py-1.5 text-xs font-medium text-palette-white hover:bg-palette-primary/90"
              onClick={onRetryClips}
            >
              다시 시도
            </button>
          </div>
        ) : clipsTotalElements === 0 ? (
          <p className="mt-6 text-center text-sm text-fg-subtle">등록된 영상이 없습니다.</p>
        ) : (
          <div className="mt-6 space-y-4">
            <div className={clipsShowPagination ? 'relative px-10 sm:px-12' : undefined}>
              {clipsShowPagination ? (
                <>
                  <button
                    type="button"
                    aria-label="이전 영상 페이지"
                    className={`absolute left-0 top-1/2 z-[1] -translate-y-1/2 ${iconBtnClass}`}
                    disabled={!clipsCanGoPrev}
                    onClick={onClipsPrev}
                  >
                    <ChevronLeft aria-hidden className="h-5 w-5" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    aria-label="다음 영상 페이지"
                    className={`absolute right-0 top-1/2 z-[1] -translate-y-1/2 ${iconBtnClass}`}
                    disabled={!clipsCanGoNext}
                    onClick={onClipsNext}
                  >
                    <ChevronRight aria-hidden className="h-5 w-5" strokeWidth={2} />
                  </button>
                </>
              ) : null}
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {clips.map((clip) => (
                  <li key={clip.id}>
                    {onClipWatch ? (
                      <button
                        type="button"
                        className="flex w-full gap-3 rounded-xl bg-surface p-3 text-left ring-1 ring-palette-primary/12 transition hover:ring-palette-primary/40 focus-visible:outline focus-visible:ring-2 focus-visible:ring-palette-primary"
                        onClick={() => onClipWatch(clip)}
                      >
                        <div className="relative h-[4.5rem] w-28 shrink-0 overflow-hidden rounded-lg bg-palette-accent/25">
                          <img
                            alt={`${clip.title} 썸네일`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            src={clip.thumbnailSrc}
                            onError={(e) => {
                              e.currentTarget.src = THUMBNAIL_PLACEHOLDER
                            }}
                          />
                          <span className="absolute bottom-1 right-1 rounded bg-palette-primary/90 px-1.5 py-0.5 text-[10px] font-medium text-palette-white">
                            {clip.durationLabel}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                          <p className="line-clamp-2 text-sm font-semibold text-fg">{clip.title}</p>
                          {clip.description ? (
                            <p className="line-clamp-2 text-xs leading-snug text-fg-subtle">
                              {clip.description}
                            </p>
                          ) : null}
                        </div>
                      </button>
                    ) : (
                      <article className="flex gap-3 rounded-xl bg-surface p-3 ring-1 ring-palette-primary/12">
                        <div className="relative h-[4.5rem] w-28 shrink-0 overflow-hidden rounded-lg bg-palette-accent/25">
                          <img
                            alt={`${clip.title} 썸네일`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            src={clip.thumbnailSrc}
                            onError={(e) => {
                              e.currentTarget.src = THUMBNAIL_PLACEHOLDER
                            }}
                          />
                          <span className="absolute bottom-1 right-1 rounded bg-palette-primary/90 px-1.5 py-0.5 text-[10px] font-medium text-palette-white">
                            {clip.durationLabel}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                          <p className="line-clamp-2 text-sm font-semibold text-fg">{clip.title}</p>
                          {clip.description ? (
                            <p className="line-clamp-2 text-xs leading-snug text-fg-subtle">
                              {clip.description}
                            </p>
                          ) : null}
                        </div>
                      </article>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {clipsShowPagination && !clipsLoading && !clipsError ? (
              <div className="mt-4 flex flex-col items-center gap-3 border-t border-palette-primary/12 pt-4">
                <p className="text-center text-xs text-fg-subtle">
                  <span className="font-medium text-fg">
                    {clipsPageRangeStart}–{clipsPageRangeEnd}번째
                  </span>
                  {' · '}
                  전체 {clipsTotalElements}개
                  <span className="mx-1.5 text-palette-primary/35">|</span>
                  {clipsCurrentPageDisplay} / {clipsTotalPages} 페이지
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-palette-primary/25 bg-surface px-3 py-1.5 text-xs font-medium text-fg transition hover:bg-palette-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!clipsCanGoPrev}
                    onClick={onClipsPrev}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-palette-primary/25 bg-surface px-3 py-1.5 text-xs font-medium text-fg transition hover:bg-palette-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!clipsCanGoNext}
                    onClick={onClipsNext}
                  >
                    다음
                  </button>
                </div>
                <p className="text-center text-[11px] text-fg-subtle">
                  한 페이지에 최대 10개까지 표시됩니다.
                </p>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  )
}
