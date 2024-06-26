import { GameConfig } from './game'
import type * as Hangul from '@/lib/hangul'

export type GameMode = 'daily' | 'free' | 'custom'

export type Status = 'playing' | 'win' | 'lose'

/**
 * Result of a guess against the answer.
 */
export interface GuessResult {
  readonly guess: Hangul.Word
  readonly result: readonly SyllableResult[]
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
  readonly exact: boolean
  readonly leadingConsonant: JamoResult
  readonly vowels: readonly JamoResult[]
  readonly trailingConsonants: readonly JamoResult[]
}

export type JamoResult = 'correct' | 'present' | 'absent'

export type KeyHints = {
  [key in Hangul.DubeolsikJamo]?: JamoResult
}

export type GuessError =
  | 'invalidStatus'
  | 'wrongLength'
  | 'notInWordList'
  | 'undrawableSyllable'

export type KeyboardError = 'lengthExceeded' | 'nonHangul'

export interface WordleData {
  readonly guessResults: readonly GuessResult[]
  readonly keyHints: KeyHints
  readonly status: Status
}

export interface Metadata {
  firstGuessDateISOString: string
  lastUpdatedDateISOString: string
}

export interface GameData {
  readonly id: string
  readonly config: GameConfig
  readonly guesses: readonly Hangul.Word[]
  readonly status: Status
  readonly wordleData: readonly WordleData[]
  readonly metadata: Metadata
}

export interface GameSaveData {
  readonly id: string
  readonly config: GameConfig
  readonly guesses: readonly Omit<Hangul.Word, 'syllables'>[]
  readonly status: Status
  readonly metadata: Metadata
}

export interface Leaderboard {
  nextUpdateDate: Date
  data: LeaderboardData
}

export interface LeaderboardData {
  [key: string]: LeaderboardItem[]
}

export interface LeaderboardItem {
  configId: string
  gameId: string
  user: {
    id?: string
    name: string
  }
  guesses: string[]
  duration: number
}
