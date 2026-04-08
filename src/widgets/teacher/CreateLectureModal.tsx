import { useEffect, useId, useRef, useState, type SubmitEvent } from 'react'
import type { TeacherLectureCreatePayload } from '../../entities/teacher/types'

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
      setError('강의 제목을 입력해 주세요.')
      return
    }
    if (!trimmedCategory) {
      setError('카테고리를 입력해 주세요.')
      return
    }
    if (!trimmedDescription) {
      setError('강의 설명을 입력해 주세요.')
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
      setError(err instanceof Error ? err.message : '강의를 등록하지 못했습니다.')
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
        className="absolute inset-0 bg-palette-primary/40"
        onClick={handleClose}
      />
      <div className="relative z-10 max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl ring-1 ring-palette-primary/15">
        <h2 id={titleId} className="text-lg font-semibold text-fg">
          강의 등록
        </h2>
        <p className="mt-1 text-sm text-fg-subtle">강의 정보와 썸네일 이미지를 등록해 주세요.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-fg-subtle" htmlFor="lecture-title">
              강의 제목 <span className="text-red-600">*</span>
            </label>
            <input
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-palette-primary/20 px-3 py-2 text-sm text-fg shadow-sm focus:border-palette-primary focus:outline-none focus:ring-1 focus:ring-palette-primary"
              id="lecture-title"
              name="title"
              placeholder="예: Spring Boot 입문"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fg-subtle" htmlFor="lecture-category">
              카테고리 <span className="text-red-600">*</span>
            </label>
            <input
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-palette-primary/20 px-3 py-2 text-sm text-fg shadow-sm focus:border-palette-primary focus:outline-none focus:ring-1 focus:ring-palette-primary"
              id="lecture-category"
              name="category"
              placeholder="예: 백엔드"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fg-subtle" htmlFor="lecture-description">
              강의 설명 <span className="text-red-600">*</span>
            </label>
            <textarea
              className="mt-1 min-h-[120px] w-full resize-y rounded-lg border border-palette-primary/20 px-3 py-2 text-sm text-fg shadow-sm focus:border-palette-primary focus:outline-none focus:ring-1 focus:ring-palette-primary"
              id="lecture-description"
              name="description"
              placeholder="강의 목표, 대상 수강생, 커리큘럼 요약 등을 적어 주세요."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-fg-subtle" id={thumbnailLabelId}>
              썸네일 이미지 <span className="text-red-600">*</span>
            </span>
            <p className="mt-0.5 text-xs text-fg-subtle">JPEG, PNG 등 이미지 파일을 선택해 주세요.</p>
            <input
              ref={fileInputRef}
              accept="image/*"
              aria-labelledby={thumbnailLabelId}
              className="mt-2 block w-full cursor-pointer text-sm text-fg file:mr-3 file:rounded-lg file:border-0 file:bg-palette-accent/30 file:px-3 file:py-2 file:text-sm file:font-medium file:text-fg hover:file:bg-palette-accent/45"
              name="thumbnailFile"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setThumbnailFile(file)
              }}
            />
            {thumbnailFile ? (
              <p className="mt-1 text-xs text-fg-subtle">선택됨: {thumbnailFile.name}</p>
            ) : null}
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-lg border border-palette-primary/25 bg-surface px-4 py-2 text-sm font-medium text-fg hover:bg-palette-accent/15"
              disabled={pending}
              onClick={handleClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg bg-palette-primary px-4 py-2 text-sm font-medium text-palette-white hover:bg-palette-primary/90 disabled:opacity-60"
              disabled={pending}
            >
              {pending ? '등록 중…' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
