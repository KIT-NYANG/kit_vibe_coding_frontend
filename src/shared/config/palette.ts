/**
 * 프로젝트 색상 팔레트 (index.css :root / @theme 과 동일 값)
 * JS·canvas 등에서 참조할 때 사용
 */
export const palette = {
  black: '#000000',
  white: '#FFFFFF',
  primary: '#010F62',
  accent: '#85B2DB',
  muted: '#293447',
} as const

export type PaletteKey = keyof typeof palette
