/** GET/POST /api/lecture-class 응답 항목 */
export interface LectureClassDto {
  lectureClassId: number
  teacherName: string
  title: string
  category: string
  description?: string
  /** 없을 수 있음 — UI는 플레이스홀더 사용 */
  thumbnailUrl?: string | null
  createdAt: string
}

/** GET /api/lecture-class — 페이지 단위 목록(data) */
export interface LectureClassPageDto {
  content: LectureClassDto[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface GetLectureClassesParams {
  page?: number
  size?: number
  category?: string
  keyword?: string
}

/** GET /api/lecture-class/:id/lectures — 강좌에 속한 개별 영상(회차) */
export interface LectureClipDto {
  lectureId: number
  teacherName: string
  lectureClassId: number
  title: string
  thumbnailUrl?: string | null
  durationSeconds: number
  createdAt: string
  description?: string
  videoUrl?: string
  /** 자막 생성 상태: PENDING | PROCESSING | COMPLETED | FAILED */
  sttStatus?: string
}

/** GET /api/lecture-class/:id/lectures — 페이지 단위 목록(data) */
export interface LectureClipPageDto {
  content: LectureClipDto[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface GetLectureClassLecturesParams {
  page?: number
  size?: number
}

/** GET /api/lecture-list/my — 학생 본인 강좌 목록 항목 */
export interface MyLectureListItemDto {
  lectureListId: number
  lectureClassId: number
  title: string
  category: string
  description?: string
  thumbnailUrl?: string | null
  createdAt: string
}

/** GET /api/lecture-list/my — 페이지 단위(data) */
export interface MyLectureListPageDto {
  content: MyLectureListItemDto[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface GetMyLectureListParams {
  page?: number
  size?: number
  category?: string
  keyword?: string
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
