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
