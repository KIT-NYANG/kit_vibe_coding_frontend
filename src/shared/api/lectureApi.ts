import axios from 'axios'
import type { ApiEnvelope } from '../../entities/auth/types'
import type { LectureClassDto } from '../../entities/lecture/types'
import type { TeacherLectureCreatePayload } from '../../entities/teacher/types'
import { axiosInstance } from './axiosInstance'

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
 * 로그인한 강사 본인이 업로드한 강의 목록입니다.
 */
export const getLectureClasses = async (): Promise<LectureClassDto[]> => {
  try {
    const { data } = await axiosInstance.get<ApiEnvelope<LectureClassDto[]>>('/api/lecture-class')
    if (data.code !== 'SUCCESS' || data.data === null) {
      throw new Error(data.message || '강의 목록을 불러오지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('강의 목록을 불러오지 못했습니다.')
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
    if (data.code !== 'SUCCESS' || data.data === null) {
      throw new Error(data.message || '강의 정보를 불러오지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('강의 정보를 불러오지 못했습니다.')
  }
}

/**
 * DELETE /api/lecture-class/:lectureClassId
 * 성공 시 data에 안내 문구 문자열이 옵니다.
 */
export const deleteLectureClass = async (lectureClassId: string | number): Promise<string> => {
  const id =
    typeof lectureClassId === 'string' ? encodeURIComponent(lectureClassId) : String(lectureClassId)
  try {
    const { data } = await axiosInstance.delete<ApiEnvelope<string>>(`/api/lecture-class/${id}`)
    if (data.code !== 'SUCCESS' || data.data === null) {
      throw new Error(data.message || '강의를 삭제하지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('강의를 삭제하지 못했습니다.')
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
    if (data.code !== 'SUCCESS' || data.data === null) {
      throw new Error(data.message || '강의를 등록하지 못했습니다.')
    }
    return data.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error))
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('강의를 등록하지 못했습니다.')
  }
}
