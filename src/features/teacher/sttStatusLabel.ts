const STT_STATUS_LABELS: Record<string, string> = {
  PENDING: '준비',
  PROCESSING: '처리중',
  COMPLETED: '완료',
  FAILED: '실패',
}

/** API sttStatus 값 → 한글 라벨 */
export function formatSttStatusLabel(status: string): string {
  const key = status.trim().toUpperCase()
  return STT_STATUS_LABELS[key] ?? status
}

/** 강사 영상 목록 배지용: `자막생성 준비` 형태 */
export function formatSttStatusBadge(status: string): string {
  return `자막생성 ${formatSttStatusLabel(status)}`
}
