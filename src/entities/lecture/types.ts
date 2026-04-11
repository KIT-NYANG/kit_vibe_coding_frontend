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

/** category: API 고정값 BACKEND | FRONTEND | AI | INFRA | DATABASE | DEVOPS | CS */
export interface GetLectureClassesParams {
  page?: number
  size?: number
  category?: string
  keyword?: string
}

/** GET /api/lecture-class/:id/check — 학생 수강 여부 */
export interface LectureClassEnrollmentCheckDto {
  isEnrolled: boolean
  /** 수강 중일 때 — DELETE /api/lecture-list/{lectureListId} (204) */
  lectureListId?: number | null
}

/** POST /api/lecture-list — 학생 수강 신청 */
export interface PostLectureListEnrollmentBody {
  lectureClassId: number
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

/** category: BACKEND, FRONTEND, … 고정 코드 */
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

/** STT 구간 자막 — GET /api/lectures/:lectureId `segments` */
export interface LecturePlaybackSegmentDto {
  startMs: number
  endMs: number
  text: string
}

/** AI 분석(퀴즈·가이드) — GET /api/lectures/:lectureId `analysis` */
export interface LecturePlaybackQuizDto {
  question: string
  answer: string
  explanation: string
  supplementalDescription: string
  quizInsertTimeSec: number
}

export interface LecturePlaybackTeacherGuideDto {
  predictedDifficultSection: string
  predictedReason: string
  improvementSuggestion: string
}

export interface LecturePlaybackAnalysisDto {
  quizzes: LecturePlaybackQuizDto[]
  teacherGuides: LecturePlaybackTeacherGuideDto[]
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
  thumbnailUrl?: string | null
  createdAt: string
  sttStatus?: string | null
  transcriptFullText?: string | null
  transcriptLanguage?: string | null
  /** 요약 본문 — 시청 페이지 설명 하단에 표시 */
  summaryText?: string | null
  /** 쉼표로 구분된 키워드 — 제목·설명 사이 칩으로 표시 */
  summaryKeywords?: string | null
  sttErrorMessage?: string | null
  sttCompletedAt?: string | null
  /** STT 기반 구간 자막 — 플레이어 WebVTT 연동용 */
  segments?: LecturePlaybackSegmentDto[] | null
  /** 퀴즈·난이도 가이드 등 부가 분석 */
  analysis?: LecturePlaybackAnalysisDto | null
}

/** POST /api/lectures/:lectureId/logs — 시청 로그 (단건) */
export interface PostLecturePlaybackLogBody {
  sessionId: string
  eventType: string
  currentTimeSec: number
  fromTimeSec: number
  toTimeSec: number
  /** 현재는 1 고정 */
  playbackRate: number
  occurredAt: string
}

export interface LecturePlaybackLogSavedDto {
  lectureId: number
  sessionId: string
  lastPositionSec: number
  message: string
}
