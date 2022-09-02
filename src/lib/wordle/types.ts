import type * as Hangul from '@/lib/hangul'

export type Status = 'playing' | 'win' | 'lose'

/**
 * Result of a guess against the answer.
 *
 * If the guess is not valid, `result` property will be undefined
 */
export interface GuessResult {
  // TODO: make type immutable
  guess: Hangul.Word
  result: SyllableResult[] | undefined
}

export interface SyllableResult {
  /**
   * True if and only if the guessed syllable is equal to the corresponding
   * syllable of the answer.
   *
   * All JamoResults are `correct` if `exact` is true. However, the reverse is not
   * necessarily true, i.e., there are cases where all JamoResults are `correct`
   * while `exact` is false.
   */
  exact: boolean
  leadingConsonant: JamoResult
  vowels: JamoResult[]
  trailingConsonants: JamoResult[]
}

export type JamoResult = 'correct' | 'present' | 'absent'
