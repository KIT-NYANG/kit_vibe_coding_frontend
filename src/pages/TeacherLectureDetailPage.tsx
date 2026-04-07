import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import type { TeacherLectureCard } from '../entities/teacher/types'
import { useAuthSession } from '../features/auth/useAuthSession'
import { mapLectureClassToCard } from '../features/teacher/mapLectureClassToCard'
import { deleteLectureClass, getLectureClassById } from '../shared/api/lectureApi'
import { TeacherLectureDetail } from '../widgets/teacher/TeacherLectureDetail'

export const TeacherLectureDetailPage = () => {
  const { lectureId } = useParams()
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuthSession()

  const [lecture, setLecture] = useState<TeacherLectureCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [deletePending, setDeletePending] = useState(false)

  useEffect(() => {
    if (!lectureId?.trim()) {
      setLoading(false)
      setNotFound(true)
      return
    }
    let cancelled = false
    void (async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const dto = await getLectureClassById(lectureId)
        if (cancelled) return
        setLecture(mapLectureClassToCard(dto))
      } catch {
        if (!cancelled) {
          setLecture(null)
          setNotFound(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [lectureId])

  if (!isLoggedIn || user?.role !== 'TEACHER') {
    return <Navigate replace to="/" />
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-palette-accent/12 p-10 text-center text-sm text-fg-subtle ring-1 ring-palette-primary/12">
        불러오는 중…
      </div>
    )
  }

  if (notFound || !lecture) {
    return (
      <div className="space-y-4 rounded-2xl bg-palette-accent/12 p-8 text-center ring-1 ring-palette-primary/12">
        <p className="text-sm text-fg">강의를 찾을 수 없습니다.</p>
        <button
          type="button"
          className="rounded-lg bg-palette-primary px-4 py-2 text-sm font-medium text-palette-white hover:bg-palette-primary/90"
          onClick={() => navigate('/', { replace: true })}
        >
          홈으로
        </button>
      </div>
    )
  }

  const handleDelete = async () => {
    if (!window.confirm(`「${lecture.title}」 강의를 삭제할까요?`)) return
    setDeletePending(true)
    try {
      await deleteLectureClass(lecture.id)
      navigate('/', { replace: true })
    } catch (e) {
      window.alert(e instanceof Error ? e.message : '삭제에 실패했습니다.')
    } finally {
      setDeletePending(false)
    }
  }

  return (
    <TeacherLectureDetail
      deletePending={deletePending}
      lecture={lecture}
      onBack={() => navigate('/')}
      onDeleteClick={handleDelete}
    />
  )
}
