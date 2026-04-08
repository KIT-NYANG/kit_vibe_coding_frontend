/** 학생 강좌 상세·시청 이동 시 `navigate(..., { state })` */
export interface StudentLectureLocationState {
  /** 마이페이지에서 강좌를 연 경우 — 영상 시청 허용·뒤로가기 등에 사용 */
  fromMyPage?: boolean
}
