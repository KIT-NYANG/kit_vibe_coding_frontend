import { useEffect, useId, useRef, useState, type SubmitEvent } from 'react'
import type { PostLecturePayload } from '../../entities/lecture/types'
import { Clapperboard, Type, FileText, Video, ImagePlus, X } from 'lucide-react'

interface AddLectureClipModalProps {
  open: boolean
  lectureClassId: number
  onClose: () => void
  onSubmit: (payload: PostLecturePayload) => Promise<void>
}

export const AddLectureClipModal = ({
  open,
  lectureClassId,
  onClose,
  onSubmit,
}: AddLectureClipModalProps) => {
  const titleId = useId()
  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!open) return
    setTitle('')
    setDescription('')
    setVideoFile(null)
    setThumbnailFile(null)
    setError(null)
    if (videoInputRef.current) videoInputRef.current.value = ''
    if (thumbInputRef.current) thumbInputRef.current.value = ''
  }, [open])

  if (!open) return null

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedDesc = description.trim()
    if (!trimmedTitle) {
      setError('영상 제목을 입력해 주세요.')
      return
    }
    if (!trimmedDesc) {
      setError('영상 설명을 입력해 주세요.')
      return
    }
    if (!videoFile) {
      setError('영상 파일을 선택해 주세요.')
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
        lectureClassId,
        title: trimmedTitle,
        description: trimmedDesc,
        videoFile,
        thumbnailFile,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '영상을 등록하지 못했습니다.')
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
                <Clapperboard className="h-5 w-5" />
              </div>
              <div>
                <h2 id={titleId} className="text-xl font-bold tracking-tight text-fg">
                  영상 추가
                </h2>
                <p className="mt-1 text-sm text-fg-subtle">
                  영상 파일과 썸네일을 함께 등록해 주세요.
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
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg" htmlFor="clip-title">
                <Type className="h-4 w-4 text-palette-primary" />
                영상 제목 <span className="text-red-600">*</span>
              </label>
              <input
                autoComplete="off"
                className="h-12 w-full rounded-2xl border border-palette-primary/15 bg-surface px-4 text-sm text-fg shadow-sm outline-none transition placeholder:text-fg-subtle/70 hover:border-palette-primary/30 focus:border-palette-primary focus:ring-4 focus:ring-palette-primary/10"
                id="clip-title"
                name="title"
                placeholder="예: 3강"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="rounded-2xl border border-palette-primary/10 bg-white/80 p-4 shadow-sm ring-1 ring-palette-primary/6">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg" htmlFor="clip-description">
                <FileText className="h-4 w-4 text-palette-primary" />
                영상 설명 <span className="text-red-600">*</span>
              </label>
              <textarea
                className="min-h-[120px] w-full resize-y rounded-2xl border border-palette-primary/15 bg-surface px-4 py-3 text-sm leading-6 text-fg shadow-sm outline-none transition placeholder:text-fg-subtle/70 hover:border-palette-primary/30 focus:border-palette-primary focus:ring-4 focus:ring-palette-primary/10"
                id="clip-description"
                name="description"
                placeholder="이 영상에서 다루는 내용을 적어 주세요."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-palette-primary/10 bg-white/80 p-4 shadow-sm ring-1 ring-palette-primary/6">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg" id="clip-video-label">
                  <Video className="h-4 w-4 text-palette-primary" />
                  영상 파일 <span className="text-red-600">*</span>
                </div>
                <p className="text-xs text-fg-subtle">mp4 등 동영상 파일을 업로드해 주세요.</p>

                <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-palette-primary/20 bg-palette-accent/10 px-4 py-6 text-center transition hover:border-palette-primary/35 hover:bg-palette-accent/20">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-palette-primary/10 text-palette-primary">
                    <Video className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-fg">
                    영상 파일 선택
                  </p>
                  <p className="mt-1 text-xs text-fg-subtle">
                    클릭해서 업로드하세요
                  </p>
                  <input
                    ref={videoInputRef}
                    accept="video/*"
                    aria-labelledby="clip-video-label"
                    className="sr-only"
                    name="videoFile"
                    type="file"
                    onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                {videoFile ? (
                  <div className="mt-3 rounded-xl border border-palette-primary/12 bg-surface px-3 py-2 text-sm text-fg">
                    선택됨: <span className="font-medium">{videoFile.name}</span>
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-palette-primary/10 bg-white/80 p-4 shadow-sm ring-1 ring-palette-primary/6">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg" id="clip-thumb-label">
                  <ImagePlus className="h-4 w-4 text-palette-primary" />
                  썸네일 이미지 <span className="text-red-600">*</span>
                </div>
                <p className="text-xs text-fg-subtle">목록에 표시될 이미지를 선택해 주세요.</p>

                <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-palette-primary/20 bg-palette-accent/10 px-4 py-6 text-center transition hover:border-palette-primary/35 hover:bg-palette-accent/20">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-palette-primary/10 text-palette-primary">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-fg">
                    썸네일 선택
                  </p>
                  <p className="mt-1 text-xs text-fg-subtle">
                    클릭해서 이미지를 업로드하세요
                  </p>
                  <input
                    ref={thumbInputRef}
                    accept="image/*"
                    aria-labelledby="clip-thumb-label"
                    className="sr-only"
                    name="thumbnailFile"
                    type="file"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                {thumbnailFile ? (
                  <div className="mt-3 rounded-xl border border-palette-primary/12 bg-surface px-3 py-2 text-sm text-fg">
                    선택됨: <span className="font-medium">{thumbnailFile.name}</span>
                  </div>
                ) : null}
              </div>
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
              {pending ? '업로드 중…' : '등록'}
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
