import axios from 'axios'
import type { ApiEnvelope } from '../../entities/auth/types'
import type {
  GetLectureClassesParams,
  GetLectureClassLecturesParams,
  GetMyLectureListParams,
  LectureClassDto,
  LectureClassEnrollmentCheckDto,
  LectureClassPageDto,
  PostLectureListEnrollmentBody,
  LectureClipDto,
  LectureClipPageDto,
  LecturePlaybackDto,
  LecturePlaybackLogSavedDto,
  MyLectureListPageDto,
  PostLecturePlaybackLogBody,
  PostLecturePayload,
} from '../../entities/lecture/types'
import type { TeacherLectureCreatePayload } from '../../entities/teacher/types'
import { axiosInstance } from './axiosInstance'
import { isApiSuccessCode } from './apiSuccess'

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (isRecord(data) && typeof data.message === 'string') {
      return data.message
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return '요청에 실패했습니다.'
}

/**
 * GET /api/lecture-class
 * 로그인한 강사 본인이 업로드한 강좌 목록(페이지네이션)입니다.
 * `category` 쿼리는 고정 코드만 허용: BACKEND, FRONTEND, AI, INFRA, DATABASE, DEVOPS, CS
 */
export const getLectureClasses = async (
  params: GetLectureClassesParams = {},
): Promise<LectureClassPageDto> => {
  const search = new URLSearchParams()
  if (params.page !== undefined) search.set('page', String(params.page))
  if (params.size !== undefined) search.set('size', String(params.size))
  const cat = params.category?.trim()
  const kw = params.keyword?.trim()
  if (cat) search.set('category', cat)
  if (kw) search.set('keyword', kw)
  const qs = search.toString()
  const url = qs ? `/api/lecture-class?${qs}` : '/api/lecture-class'
  try {
    const { data } = await axiosInstance.get<ApiEnvelope<LectureClassPageDto>>(url)
    if (!isApiSuccessCode(data.code) || data.data === null) {
      throw new Error(data.message || '강좌 목록을 불러오지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('강좌 목록을 불러오지 못했습니다.')
  }
}

/**
 * GET /api/lecture-list/my
 * 학생 본인의 강좌 목록(페이지네이션). category·keyword는 선택.
 * category는 BACKEND, FRONTEND, … 고정 코드.
 */
export const getMyLectureList = async (
  params: GetMyLectureListParams = {},
): Promise<MyLectureListPageDto> => {
  const search = new URLSearchParams()
  if (params.page !== undefined) search.set('page', String(params.page))
  if (params.size !== undefined) search.set('size', String(params.size))
  const cat = params.category?.trim()
  const kw = params.keyword?.trim()
  if (cat) search.set('category', cat)
  if (kw) search.set('keyword', kw)
  const qs = search.toString()
  const url = qs ? `/api/lecture-list/my?${qs}` : '/api/lecture-list/my'
  try {
    const { data } = await axiosInstance.get<ApiEnvelope<MyLectureListPageDto>>(url)
    if (!isApiSuccessCode(data.code) || data.data === null) {
      throw new Error(data.message || '내 강좌 목록을 불러오지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('내 강좌 목록을 불러오지 못했습니다.')
  }
}

/**
 * GET /api/lecture-class/:lectureClassId
 * 경로의 숫자는 lectureClassId입니다.
 */
export const getLectureClassById = async (
  lectureClassId: string | number,
): Promise<LectureClassDto> => {
  const id =
    typeof lectureClassId === 'string' ? encodeURIComponent(lectureClassId) : String(lectureClassId)
  try {
    const { data } = await axiosInstance.get<ApiEnvelope<LectureClassDto>>(
      `/api/lecture-class/${id}`,
    )
    if (!isApiSuccessCode(data.code) || data.data === null) {
      throw new Error(data.message || '강좌 정보를 불러오지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('강좌 정보를 불러오지 못했습니다.')
  }
}

/**
 * GET /api/lecture-class/:lectureClassId/check
 * 학생 로그인 시 수강 여부. (Authorization Bearer 필요)
 */
export const checkLectureClassEnrollment = async (
  lectureClassId: string | number,
): Promise<LectureClassEnrollmentCheckDto> => {
  const id =
    typeof lectureClassId === 'string' ? encodeURIComponent(lectureClassId) : String(lectureClassId)
  try {
    const { data } = await axiosInstance.get<ApiEnvelope<LectureClassEnrollmentCheckDto>>(
      `/api/lecture-class/${id}/check`,
    )
    if (!isApiSuccessCode(data.code) || data.data === null) {
      throw new Error(data.message || '수강 여부를 확인하지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('수강 여부를 확인하지 못했습니다.')
  }
}

/**
 * POST /api/lecture-list
 * 학생 수강 신청. 응답 code는 CREATED 등.
 */
export const postLectureListEnrollment = async (
  body: PostLectureListEnrollmentBody,
): Promise<void> => {
  try {
    const { data } = await axiosInstance.post<ApiEnvelope<string | null>>(
      '/api/lecture-list',
      body,
    )
    if (!isApiSuccessCode(data.code)) {
      throw new Error(data.message || '수강 신청에 실패했습니다.')
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('수강 신청에 실패했습니다.')
  }
}

/**
 * DELETE /api/lecture-list/:lectureListId
 * 학생 수강 취소. 204 No Content.
 */
export const deleteLectureListEnrollment = async (
  lectureListId: string | number,
): Promise<void> => {
  const id =
    typeof lectureListId === 'string' ? encodeURIComponent(lectureListId) : String(lectureListId)
  try {
    await axiosInstance.delete(`/api/lecture-list/${id}`)
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('수강 취소에 실패했습니다.')
  }
}

/**
 * 내 강좌 목록에서 lectureClassId에 해당하는 lectureListId 조회 (check 응답에 id가 없을 때)
 */
export const findLectureListIdForClass = async (
  lectureClassId: number,
): Promise<number | null> => {
  let page = 0
  const size = 50
  for (;;) {
    const res = await getMyLectureList({ page, size })
    const hit = res.content.find((c) => c.lectureClassId === lectureClassId)
    if (hit) return hit.lectureListId
    if (res.last) return null
    page += 1
  }
}

/**
 * GET /api/lecture-class/:lectureClassId/lectures
 * 강좌에 등록된 개별 영상(회차) 목록(페이지네이션)
 */
export const getLectureClassLectures = async (
  lectureClassId: string | number,
  params: GetLectureClassLecturesParams = {},
): Promise<LectureClipPageDto> => {
  const id =
    typeof lectureClassId === 'string' ? encodeURIComponent(lectureClassId) : String(lectureClassId)
  const search = new URLSearchParams()
  if (params.page !== undefined) search.set('page', String(params.page))
  if (params.size !== undefined) search.set('size', String(params.size))
  const qs = search.toString()
  const url = qs
    ? `/api/lecture-class/${id}/lectures?${qs}`
    : `/api/lecture-class/${id}/lectures`
  try {
    const { data } = await axiosInstance.get<ApiEnvelope<LectureClipPageDto>>(url)
    if (!isApiSuccessCode(data.code) || data.data === null) {
      throw new Error(data.message || '영상 목록을 불러오지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('영상 목록을 불러오지 못했습니다.')
  }
}

/**
 * GET /api/lectures/:lectureId
 * 단일 영상 재생 정보 (스트리밍 URL 등)
 */
export const getLecturePlayback = async (lectureId: string | number): Promise<LecturePlaybackDto> => {
  const id = typeof lectureId === 'string' ? encodeURIComponent(lectureId) : String(lectureId)
  try {
    const { data } = await axiosInstance.get<ApiEnvelope<LecturePlaybackDto>>(`/api/lectures/${id}`)
    if (!isApiSuccessCode(data.code) || data.data === null) {
      throw new Error(data.message || '영상 정보를 불러오지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('영상 정보를 불러오지 못했습니다.')
  }
}

/**
 * POST /api/lectures/:lectureId/logs
 * 시청 로그 1건. 201 및 code OK/CREATED 등.
 */
export const postLecturePlaybackLog = async (
  lectureId: string | number,
  body: PostLecturePlaybackLogBody,
): Promise<LecturePlaybackLogSavedDto> => {
  const id = typeof lectureId === 'string' ? encodeURIComponent(lectureId) : String(lectureId)
  try {
    const { data } = await axiosInstance.post<ApiEnvelope<LecturePlaybackLogSavedDto>>(
      `/api/lectures/${id}/logs`,
      body,
    )
    if (!isApiSuccessCode(data.code) || data.data === null) {
      throw new Error(data.message || '시청 로그를 저장하지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('시청 로그를 저장하지 못했습니다.')
  }
}

const defaultDeleteLectureSuccessMessage = '영상이 삭제되었습니다.'

/**
 * DELETE /api/lectures/:lectureId
 * 성공 시 204 No Content
 */
export const deleteLecture = async (lectureId: string | number): Promise<string> => {
  const id = typeof lectureId === 'string' ? encodeURIComponent(lectureId) : String(lectureId)
  try {
    const res = await axiosInstance.delete<unknown>(`/api/lectures/${id}`)
    const { status, data } = res

    if (status === 204) {
      return defaultDeleteLectureSuccessMessage
    }

    if (data === '' || data === null || data === undefined) {
      if (status >= 200 && status < 300) {
        return defaultDeleteLectureSuccessMessage
      }
      throw new Error('영상을 삭제하지 못했습니다.')
    }

    if (isRecord(data) && typeof data.code === 'string') {
      const envelope = data as unknown as ApiEnvelope<string>
      if (!isApiSuccessCode(envelope.code) || envelope.data === null) {
        throw new Error(
          typeof envelope.message === 'string' ? envelope.message : '영상을 삭제하지 못했습니다.',
        )
      }
      return envelope.data
    }

    throw new Error('영상을 삭제하지 못했습니다.')
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('영상을 삭제하지 못했습니다.')
  }
}

const defaultDeleteSuccessMessage = '강좌가 삭제되었습니다.'

/**
 * DELETE /api/lecture-class/:lectureClassId
 */
export const deleteLectureClass = async (lectureClassId: string | number): Promise<string> => {
  const id =
    typeof lectureClassId === 'string' ? encodeURIComponent(lectureClassId) : String(lectureClassId)
  try {
    const res = await axiosInstance.delete<unknown>(`/api/lecture-class/${id}`)
    const { status, data } = res

    if (status === 204) {
      return defaultDeleteSuccessMessage
    }

    if (data === '' || data === null || data === undefined) {
      if (status >= 200 && status < 300) {
        return defaultDeleteSuccessMessage
      }
      throw new Error('강좌를 삭제하지 못했습니다.')
    }

    if (isRecord(data) && typeof data.code === 'string') {
      const envelope = data as unknown as ApiEnvelope<string>
      if (!isApiSuccessCode(envelope.code) || envelope.data === null) {
        throw new Error(
          typeof envelope.message === 'string' ? envelope.message : '강좌를 삭제하지 못했습니다.',
        )
      }
      return envelope.data
    }

    throw new Error('강좌를 삭제하지 못했습니다.')
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('강좌를 삭제하지 못했습니다.')
  }
}

/**
 * POST /api/lecture-class (multipart/form-data)
 * 필드: title, category, description, thumbnailFile
 */
export const postLectureClass = async (body: TeacherLectureCreatePayload): Promise<LectureClassDto> => {
  const formData = new FormData()
  formData.append('title', body.title)
  formData.append('category', body.category)
  formData.append('description', body.description)
  formData.append('thumbnailFile', body.thumbnailFile)

  try {
    const { data } = await axiosInstance.post<ApiEnvelope<LectureClassDto>>(
      '/api/lecture-class',
      formData,
    )
    if (!isApiSuccessCode(data.code) || data.data === null) {
      throw new Error(data.message || '강좌를 등록하지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('강좌를 등록하지 못했습니다.')
  }
}

/**
 * POST /api/lectures (multipart/form-data)
 * 필드: lectureClassId, title, description, videoFile, thumbnailFile
 */
export const postLecture = async (body: PostLecturePayload): Promise<LectureClipDto> => {
  const formData = new FormData()
  formData.append('lectureClassId', String(body.lectureClassId))
  formData.append('title', body.title)
  formData.append('description', body.description)
  formData.append('videoFile', body.videoFile)
  formData.append('thumbnailFile', body.thumbnailFile)

  try {
    const { data } = await axiosInstance.post<ApiEnvelope<LectureClipDto>>('/api/lectures', formData)
    if (!isApiSuccessCode(data.code) || data.data === null) {
      throw new Error(data.message || '영상을 등록하지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('영상을 등록하지 못했습니다.')
  }
}
