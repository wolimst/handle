import type * as Wordle from '@/lib/wordle'

export const baseTextColor = 'var(--text-color)'
export const invertedTextColor = 'var(--text-color-invert)'

export const correctTextColor = 'var(--wordle-correct-color)'
export const presentTextColor = 'var(--wordle-present-color'
export const absentTextColor = 'var(--wordle-absent-color)'

export const exactTextColor = 'var(--wordle-exact-color)'
export const exactBackgroundColor = 'var(--wordle-exact-background-color)'

export function getColorFromJamoResult(result: Wordle.JamoResult): string {
  switch (result) {
    case 'correct':
      return correctTextColor
    case 'present':
      return presentTextColor
    case 'absent':
      return absentTextColor
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = result
      return _exhaustiveCheck
  }
}
