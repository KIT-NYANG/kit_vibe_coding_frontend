import { ChevronLeft, ChevronRight, Plus, Trash2, CalendarClock, FileText, Tag } from 'lucide-react'
import type { TeacherLectureCard } from '../../entities/teacher/types'
import type { TeacherLectureClipRow } from '../../features/teacher/mapLectureClipToRow'
import { formatSttStatusBadge } from '../../features/teacher/sttStatusLabel'
import { getLectureCategoryLabel } from '../../shared/lib/lectureCategories'
import { LibraryBig } from 'lucide-react'

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

const getSttStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'PROCESSING':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'FAILED':
      return 'border-red-200 bg-red-50 text-red-700'
    default:
      return 'border-palette-primary/12 bg-palette-accent/35 text-fg-subtle'
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
  onFailedClipDelete: (clip: TeacherLectureClipRow) => void | Promise<void>
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
  onFailedClipDelete,
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
}: TeacherLectureDetailProps) => {
  const iconBtnClass =
    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-transparent text-palette-primary transition hover:bg-palette-accent/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary disabled:pointer-events-none disabled:opacity-40'

    const handleClipCardClick = (clip: TeacherLectureClipRow) => {
      if (clip.sttStatus === 'COMPLETED') {
        onClipClick(clip)
        return
      }

      if (clip.sttStatus === 'PROCESSING') {
        alert('AI 분석 중이니 완료될 때까지 기다려주세요.')
        return
      }

      if (clip.sttStatus === 'FAILED') {
        void onFailedClipDelete(clip)
        return
      }

      alert('아직 분석 상태를 확인할 수 없습니다.')
    }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <button
        type="button"
        className="inline-flex self-start gap-2 text-base font-medium text-fg-subtle underline-offset-4 transition hover:text-palette-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary sm:self-auto"
        onClick={onBack}
      >
        ← 업로드한 강좌 목록
        <LibraryBig aria-hidden className="h-6 w-7" strokeWidth={2} />
      </button>

      <section className="rounded-3xl border border-palette-primary/10 bg-gradient-to-br from-palette-accent/20 via-white to-palette-primary/5 p-5 shadow-sm backdrop-blur-sm sm:p-6">
        <div className="mx-auto max-w-6xl mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-surface shadow-md ring-1 ring-palette-primary/12">
          <div className="group relative aspect-video w-full overflow-hidden bg-gradient-to-br from-palette-accent/30 via-white to-palette-primary/10">
            <img
              alt={lecture.thumbnailAlt}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              decoding="async"
              src={lecture.thumbnailSrc}
              onError={(e) => {
                e.currentTarget.src = '/thumbnail-placeholder.svg'
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20" />
          </div>
        </div>

        <div className="mx-auto max-w-6xl rounded-[24px] border border-palette-primary/12 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-palette-primary/5 bg-palette-accent/20 px-4 py-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-palette-primary/10 text-palette-primary">
                <Tag className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold tracking-wide text-fg-subtle">
                  카테고리
                </p>
                <p className="mt-1 text-medium font-medium text-fg">
                  {getLectureCategoryLabel(lecture.category)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-palette-primary/10 bg-slate-50/100 px-4 py-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-palette-primary/10 text-palette-primary">
                <CalendarClock className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold tracking-wide text-fg-subtle">
                  업로드일
                </p>
                <p className="mt-1 text-medium font-medium text-fg">
                  {formatUploadDate(lecture.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-palette-primary/5 bg-palette-accent/14 px-4 py-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-palette-primary/10 text-palette-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold tracking-wide text-fg-subtle">
                설명
              </p>
              <p className="mt-1 text-medium leading-relaxed text-fg">
                {lecture.description.trim()
                  ? lecture.description
                  : '등록된 설명이 없습니다.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-palette-primary/10 bg-gradient-to-br from-palette-accent/20 via-white to-palette-primary/5 p-5 shadow-sm backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-fg">강의 영상</h2>
            <p 
              className="preview-bounce-text mt-0.5 text-medium font-medium text-palette-primary/90"
              aria-label="이 강좌에 등록된 강의 영상 목록입니다."
            >
              {'이 강좌에 등록된 강의 영상 목록입니다.'.split('').map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  className="preview-bounce-letter"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  aria-hidden="true"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </p>
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
        ) : clipsTotalElements === 0 ? (
          <p className="mt-6 text-center text-sm text-fg-subtle">등록된 영상이 없습니다.</p>
        ) : (
          <div className="mt-6 space-y-4">
            <div
              className={
                clipsShowPagination ? 'relative px-10 sm:px-12' : undefined
              }
            >
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
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {clips.map((clip) => (
                <li key={clip.id}>
                  <button
                    type="button"
                    className="group flex w-full gap-3 rounded-2xl border border-palette-primary/10 bg-white/85 p-3.5 text-left shadow-sm ring-1 ring-palette-primary/8 transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-palette-primary/25 focus-visible:outline focus-visible:ring-2 focus-visible:ring-palette-primary"
                    onClick={() => handleClipCardClick(clip)}
                  >
                    <div className="relative h-[5rem] w-32 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-palette-accent/35 via-white to-palette-primary/10">
                      <img
                        alt={`${clip.title} 썸네일`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                        src={clip.thumbnailSrc}
                        onError={(e) => {
                          e.currentTarget.src = '/thumbnail-placeholder.svg'
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                      <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                        {clip.durationLabel}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <div className="flex w-full min-w-0 items-center justify-between gap-3">
                        <p className="truncate min-w-0 flex-1 text-sm font-semibold leading-5 text-fg">
                          {clip.title}
                        </p>
                        {clip.sttStatus ? (
                          <span
                            className={`shrink-0 rounded-lg border px-4 py-1.5 text-[12px] font-semibold ${getSttStatusBadgeClass(clip.sttStatus)}`}
                          >
                            {formatSttStatusBadge(clip.sttStatus)}
                          </span>
                        ) : null}
                      </div>
                      {clip.description ? (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-fg-subtle">
                          {clip.description}
                        </p>
                      ) : (
                        <p className="mt-1.5 text-xs text-fg-subtle/70">
                          설명이 없습니다.
                        </p>
                      )}
                    </div>
                  </button>
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

      <style>
        {`
          .preview-bounce-text {
            line-height: 1.5;
          }

          .preview-bounce-letter {
            position: relative;
            top: 0;
            display: inline-block;
            animation: previewBounce 0.7s ease-in-out infinite alternate;
            text-shadow:
              0 1px 0 rgba(203, 213, 225, 0.55),
              0 4px 10px rgba(15, 23, 42, 0.08);
          }

          @keyframes previewBounce {
            0% {
              top: 0;
            }
            100% {
              top: -3px;
              text-shadow:
                0 1px 0 rgba(203, 213, 225, 0.6),
                0 8px 12px rgba(15, 23, 42, 0.12);
            }
          }
        `}
      </style>
    </div>
  )
}
