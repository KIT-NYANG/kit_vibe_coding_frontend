export interface TeacherQuickLink {
  id: string
  title: string
  description: string
}

export interface TeacherStatCard {
  id: string
  label: string
  value: string
  hint: string
}

export interface TeacherLectureCard {
  id: string
  title: string
  thumbnailSrc: string
  thumbnailAlt: string
  category: string
  description: string
  createdAt: string
  /** 강사명 (상세 등에서 표시) */
  teacherName?: string
}

export interface TeacherHomeModel {
  uploadedLectures: TeacherLectureCard[]
}

/** POST /api/lecture-class (multipart) 폼 값 */
export interface TeacherLectureCreatePayload {
  title: string
  category: string
  description: string
  thumbnailFile: File
}

