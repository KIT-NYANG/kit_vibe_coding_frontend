import { useEffect, useId, useRef, useState, type SubmitEvent } from 'react'
import type { TeacherLectureCreatePayload } from '../../entities/teacher/types'
import { LECTURE_CATEGORY_OPTIONS } from '../../shared/lib/lectureCategories'
import { BookPlus, ImagePlus, Type, FolderKanban, FileText, X, ChevronDown } from 'lucide-react'

interface CreateLectureModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: TeacherLectureCreatePayload) => Promise<void>
}

export const CreateLectureModal = ({ open, onClose, onSubmit }: CreateLectureModalProps) => {
  const titleId = useId()
  const thumbnailLabelId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!open) return
    setTitle('')
    setDescription('')
    setCategory('')
    setThumbnailFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [open])

  if (!open) return null

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedCategory = category.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      setError('강좌 제목을 입력해 주세요.')
      return
    }
    if (!trimmedCategory) {
      setError('카테고리를 입력해 주세요.')
      return
    }
    if (!trimmedDescription) {
      setError('강좌의 설명을 입력해 주세요.')
      return
    }
    if (!thumbnailFile) {
      setError('썸네일 이미지를 선택해 주세요.')
      return
    }

    setError(null)
    setPending(true)
    try {
      await onSubmit({
        title: trimmedTitle,
        category: trimmedCategory,
        description: trimmedDescription,
        thumbnailFile,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '강좌를 등록하지 못했습니다.')
    } finally {
      setPending(false)
    }
  }

  const handleClose = () => {
    if (pending) return
    setError(null)
    onClose()
  }

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
    >
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
        onClick={handleClose}
      />
      <div className="modal-scrollbar-hidden relative z-10 max-h-[min(90vh,760px)] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-palette-primary/12 bg-white/95 shadow-[0_28px_80px_rgba(15,23,42,0.2)] ring-1 ring-palette-primary/10">
      <div className="sticky top-0 z-10 border-b border-palette-primary/10 bg-gradient-to-r from-palette-accent/35 via-white to-palette-primary/5 px-6 py-5 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-palette-primary/10 text-palette-primary">
              <BookPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 id={titleId} className="text-xl font-bold tracking-tight text-fg">
                강좌 등록
              </h2>
              <p className="mt-1 text-sm text-fg-subtle">
                강좌 정보와 썸네일 이미지를 등록해 주세요.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="닫기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-fg-subtle shadow-sm ring-1 ring-palette-primary/10 transition hover:bg-red-50 hover:text-red-600 hover:ring-red-200"
            disabled={pending}
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <form className="space-y-5 px-6 py-6 sm:px-7" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5">
          <div className="rounded-2xl border border-palette-primary/10 bg-white/80 p-4 shadow-sm ring-1 ring-palette-primary/6">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg" htmlFor="lecture-title">
              <Type className="h-4 w-4 text-palette-primary" />
              강좌 제목 <span className="text-red-600">*</span>
            </label>
            <input
              autoComplete="off"
              className="h-12 w-full rounded-2xl border border-palette-primary/15 bg-surface px-4 text-sm text-fg shadow-sm outline-none transition placeholder:text-fg-subtle/70 hover:border-palette-primary/30 focus:border-palette-primary focus:ring-4 focus:ring-palette-primary/10"
              id="lecture-title"
              name="title"
              placeholder="예: Spring Boot 입문"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-palette-primary/10 bg-white/80 p-4 shadow-sm ring-1 ring-palette-primary/6">
            <label
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg"
              htmlFor="lecture-category"
            >
              <FolderKanban className="h-4 w-4 text-palette-primary" />
              카테고리 <span className="text-red-600">*</span>
            </label>

            <div className="relative">
              <select
                className="h-12 w-full appearance-none rounded-2xl border border-palette-primary/15 bg-surface pl-4 pr-9 text-sm text-fg shadow-sm outline-none transition hover:border-palette-primary/30 focus:border-palette-primary focus:ring-4 focus:ring-palette-primary/10"
                id="lecture-category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">선택해 주세요</option>
                {LECTURE_CATEGORY_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
            </div>
          </div>

          <div className="rounded-2xl border border-palette-primary/10 bg-white/80 p-4 shadow-sm ring-1 ring-palette-primary/6">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg" htmlFor="lecture-description">
              <FileText className="h-4 w-4 text-palette-primary" />
              강좌 설명 <span className="text-red-600">*</span>
            </label>
            <textarea
              className="min-h-[140px] w-full resize-y rounded-2xl border border-palette-primary/15 bg-surface px-4 py-3 text-sm leading-6 text-fg shadow-sm outline-none transition placeholder:text-fg-subtle/70 hover:border-palette-primary/30 focus:border-palette-primary focus:ring-4 focus:ring-palette-primary/10"
              id="lecture-description"
              name="description"
              placeholder="강좌 목표, 대상 수강생, 커리큘럼 요약 등을 적어 주세요."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-palette-primary/10 bg-white/80 p-4 shadow-sm ring-1 ring-palette-primary/6">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg" id={thumbnailLabelId}>
              <ImagePlus className="h-4 w-4 text-palette-primary" />
              썸네일 이미지 <span className="text-red-600">*</span>
            </div>
            <p className="text-xs text-fg-subtle">
              JPEG, PNG 등 이미지 파일을 선택해 주세요.
            </p>

            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-palette-primary/20 bg-palette-accent/10 px-4 py-6 text-center transition hover:border-palette-primary/35 hover:bg-palette-accent/20">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-palette-primary/10 text-palette-primary">
                <ImagePlus className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-fg">
                파일 선택
              </p>
              <p className="mt-1 text-xs text-fg-subtle">
                클릭해서 썸네일 이미지를 업로드하세요
              </p>
              <input
                ref={fileInputRef}
                accept="image/*"
                aria-labelledby={thumbnailLabelId}
                className="sr-only"
                name="thumbnailFile"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  setThumbnailFile(file)
                }}
              />
            </label>
            {thumbnailFile ? (
              <div className="mt-3 rounded-xl border border-palette-primary/12 bg-surface px-3 py-2 text-sm text-fg">
                선택됨: <span className="font-medium">{thumbnailFile.name}</span>
              </div>
            ) : null}
          </div>
        </div>

          {error ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 border-t border-palette-primary/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="submit"
              className="rounded-2xl bg-palette-primary px-5 py-3 text-sm font-semibold text-palette-white shadow-sm transition hover:bg-palette-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={pending}
            >
              {pending ? '등록 중…' : '등록'}
            </button>
          </div>
        </form>
      </div>
      <style>
        {`
          .modal-scrollbar-hidden {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .modal-scrollbar-hidden::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  )
}
