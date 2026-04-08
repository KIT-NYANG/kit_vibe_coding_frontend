import { Plus, Trash2 } from 'lucide-react'
import type { TeacherLectureCard } from '../../entities/teacher/types'
import type { TeacherLectureClipRow } from '../../features/teacher/mapLectureClipToRow'

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

interface TeacherLectureDetailProps {
  lecture: TeacherLectureCard
  onBack: () => void
  onDeleteClick: () => void | Promise<void>
  deletePending?: boolean
  clips: TeacherLectureClipRow[]
  clipsLoading: boolean
  clipsError: string | null
  onRetryClips: () => void
  onAddClipClick: () => void
  onClipClick: (clip: TeacherLectureClipRow) => void
}

export const TeacherLectureDetail = ({
  lecture,
  onBack,
  onDeleteClick,
  deletePending = false,
  clips,
  clipsLoading,
  clipsError,
  onRetryClips,
  onAddClipClick,
  onClipClick,
}: TeacherLectureDetailProps) => {
  return (
    <div className="space-y-6">
      <button
        type="button"
        className="text-sm font-medium text-fg-subtle underline-offset-4 transition hover:text-palette-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary"
        onClick={onBack}
      >
        ← 업로드한 강좌 목록
      </button>

      <section className="rounded-2xl bg-palette-accent/12 p-5 ring-1 ring-palette-primary/12 sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">{lecture.title}</h1>
          <button
            type="button"
            aria-busy={deletePending}
            aria-label="강의 삭제"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-xl bg-surface text-fg-subtle shadow-sm ring-1 ring-palette-primary/15 transition hover:bg-red-50 hover:text-red-700 hover:ring-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            disabled={deletePending}
            onClick={() => void onDeleteClick()}
          >
            <Trash2 aria-hidden className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-surface shadow-md ring-1 ring-palette-primary/12">
          <div className="aspect-video w-full overflow-hidden bg-palette-accent/25">
            <img
              alt={lecture.thumbnailAlt}
              className="h-full w-full object-cover"
              decoding="async"
              src={lecture.thumbnailSrc}
              onError={(e) => {
                e.currentTarget.src = '/thumbnail-placeholder.svg'
              }}
            />
          </div>
          <div className="border-t border-palette-primary/10 bg-surface px-4 py-4 sm:px-6">
            <p className="text-center text-lg font-semibold text-fg">{lecture.title}</p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-2xl space-y-3 rounded-xl bg-surface px-5 py-5 ring-1 ring-palette-primary/12 sm:px-6">
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-fg">강의 영상</h2>
            <p className="mt-1 text-xs text-fg-subtle">이 강좌에 등록된 영상 목록입니다.</p>
          </div>
          <button
            type="button"
            aria-label="영상 추가"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-xl bg-surface text-palette-primary shadow-sm ring-1 ring-palette-primary/15 transition hover:bg-palette-accent/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary sm:self-auto"
            onClick={onAddClipClick}
          >
            <Plus aria-hidden className="h-5 w-5" strokeWidth={2} />
          </button>
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
        ) : clips.length === 0 ? (
          <p className="mt-6 text-center text-sm text-fg-subtle">등록된 영상이 없습니다.</p>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {clips.map((clip) => (
              <li key={clip.id}>
                <button
                  type="button"
                  className="flex w-full gap-3 rounded-xl bg-surface p-3 text-left ring-1 ring-palette-primary/12 transition hover:ring-palette-primary/40 focus-visible:outline focus-visible:ring-2 focus-visible:ring-palette-primary"
                  onClick={() => onClipClick(clip)}
                >
                  <div className="relative h-[4.5rem] w-28 shrink-0 overflow-hidden rounded-lg bg-palette-accent/25">
                    <img
                      alt={`${clip.title} 썸네일`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      src={clip.thumbnailSrc}
                      onError={(e) => {
                        e.currentTarget.src = '/thumbnail-placeholder.svg'
                      }}
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-palette-primary/90 px-1.5 py-0.5 text-[10px] font-medium text-palette-white">
                      {clip.durationLabel}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="line-clamp-2 text-sm font-semibold text-fg">{clip.title}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
