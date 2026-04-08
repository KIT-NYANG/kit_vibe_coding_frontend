/** GET/POST /api/lecture-class 응답 항목 */
export interface LectureClassDto {
  lectureClassId: number
  teacherName: string
  title: string
  category: string
  description?: string
  thumbnailUrl: string
  createdAt: string
}

/** GET /api/lecture-class/:id/lectures — 강좌에 속한 개별 영상(회차) */
export interface LectureClipDto {
  lectureId: number
  teacherName: string
  lectureClassId: number
  title: string
  thumbnailUrl: string
  durationSeconds: number
  createdAt: string
  description?: string
  videoUrl?: string
}

/** POST /api/lectures (multipart) */
export interface PostLecturePayload {
  lectureClassId: number
  title: string
  description: string
  videoFile: File
  thumbnailFile: File
}

/** GET /api/lectures/:lectureId — 단일 영상 재생 정보 */
export interface LecturePlaybackDto {
  lectureId: number
  teacherName: string
  lectureClassId: number
  title: string
  description: string
  durationSeconds: number
  videoUrl: string
  thumbnailUrl: string
  createdAt: string
}
