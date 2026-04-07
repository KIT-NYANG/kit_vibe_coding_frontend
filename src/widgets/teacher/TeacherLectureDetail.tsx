import { Trash2 } from 'lucide-react'
import type { TeacherLectureCard } from '../../entities/teacher/types'

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
}

export const TeacherLectureDetail = ({
  lecture,
  onBack,
  onDeleteClick,
  deletePending = false,
}: TeacherLectureDetailProps) => {
  return (
    <div className="space-y-6">
      <button
        type="button"
        className="text-sm font-medium text-fg-subtle underline-offset-4 transition hover:text-palette-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary"
        onClick={onBack}
      >
        ← 업로드한 강의 목록
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
    </div>
  )
}
