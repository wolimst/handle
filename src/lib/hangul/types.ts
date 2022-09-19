export type Jamo = LeadingConsonant | Vowel | TrailingConsonant

export type LeadingConsonant =
  | 'ㄱ'
  | 'ㄲ'
  | 'ㄴ'
  | 'ㄷ'
  | 'ㄸ'
  | 'ㄹ'
  | 'ㅁ'
  | 'ㅂ'
  | 'ㅃ'
  | 'ㅅ'
  | 'ㅆ'
  | 'ㅇ'
  | 'ㅈ'
  | 'ㅉ'
  | 'ㅊ'
  | 'ㅋ'
  | 'ㅌ'
  | 'ㅍ'
  | 'ㅎ'

export type Vowel =
  | 'ㅏ'
  | 'ㅐ'
  | 'ㅑ'
  | 'ㅒ'
  | 'ㅓ'
  | 'ㅔ'
  | 'ㅕ'
  | 'ㅖ'
  | 'ㅗ'
  | 'ㅘ'
  | 'ㅙ'
  | 'ㅚ'
  | 'ㅛ'
  | 'ㅜ'
  | 'ㅝ'
  | 'ㅞ'
  | 'ㅟ'
  | 'ㅠ'
  | 'ㅡ'
  | 'ㅢ'
  | 'ㅣ'

export type TrailingConsonant =
  | 'ㄱ'
  | 'ㄲ'
  | 'ㄳ'
  | 'ㄴ'
  | 'ㄵ'
  | 'ㄶ'
  | 'ㄷ'
  | 'ㄹ'
  | 'ㄺ'
  | 'ㄻ'
  | 'ㄼ'
  | 'ㄽ'
  | 'ㄾ'
  | 'ㄿ'
  | 'ㅀ'
  | 'ㅁ'
  | 'ㅂ'
  | 'ㅄ'
  | 'ㅅ'
  | 'ㅆ'
  | 'ㅇ'
  | 'ㅈ'
  | 'ㅊ'
  | 'ㅋ'
  | 'ㅌ'
  | 'ㅍ'
  | 'ㅎ'

/**
 * Hangul Jamo that can be typed in by a Jamo key in dubeolsik keyboard layout
 *
 * @see {@link DubeolsikConsonant} and {@link DubeolsikVowel}
 */
export type DubeolsikJamo = DubeolsikConsonant | DubeolsikVowel

/**
 * Hangul consonants that can be typed in by a Jamo key in dubeolsik keyboard
 * layout
 *
 * # Example
 *
 * - 'ㄱ' is a DubeolsikConsonant, because it require 1 key to type in
 * - 'ㄲ' is a DubeolsikConsonant, because it require 1 key to type in \
 *   (shift key does not count, because it is not Hangul Jamo)
 * - 'ㄳ' is not a DubeolsikConsonant, because it require 2 keys to type in
 */
export type DubeolsikConsonant =
  | 'ㄱ'
  | 'ㄲ'
  | 'ㄴ'
  | 'ㄷ'
  | 'ㄸ'
  | 'ㄹ'
  | 'ㅁ'
  | 'ㅂ'
  | 'ㅃ'
  | 'ㅅ'
  | 'ㅆ'
  | 'ㅇ'
  | 'ㅈ'
  | 'ㅉ'
  | 'ㅊ'
  | 'ㅋ'
  | 'ㅌ'
  | 'ㅍ'
  | 'ㅎ'

/**
 * Hangul vowels that can be typed in by a Jamo key in dubeolsik keyboard layout
 *
 * # Example
 *
 * - 'ㅐ' is a DubeolsikVowel, because it require 1 key to type in
 * - 'ㅒ' is a DubeolsikVowel, because it require 1 key to type in \
 *   (shift key does not count, because it is not Hangul Jamo)
 * - 'ㅙ' is not a DubeolsikVowel, because it require 2 keys to type in
 */
export type DubeolsikVowel =
  | 'ㅏ'
  | 'ㅐ'
  | 'ㅑ'
  | 'ㅒ'
  | 'ㅓ'
  | 'ㅔ'
  | 'ㅕ'
  | 'ㅖ'
  | 'ㅗ'
  | 'ㅛ'
  | 'ㅜ'
  | 'ㅠ'
  | 'ㅡ'
  | 'ㅣ'

/**
 * Hangul syllable with its Jamo information when each Jamo is typed in using
 * dubeolsik keyboard layout, i.e. a leading consonant, 1 or 2 vowels, and
 * 0-2 trailing consonants.
 *
 * Vowels and trailing consonants should be sorted in the keyboard typing order.
 *
 * # Example
 *
 * - 평
 *   - value: '평'
 *   - leadingConsonant: 'ㅍ'
 *   - vowels: ['ㅕ']
 *   - trailingConsonants: ['ㅇ']
 * - 화
 *   - value: '화'
 *   - leadingConsonant: 'ㅎ'
 *   - vowels: ['ㅗ', 'ㅏ']
 *   - trailingConsonants: []
 *
 * @see {@link DubeolsikConsonant} and {@link DubeolsikVowel}
 */
export interface DubeolsikSyllable {
  readonly value: string
  readonly leadingConsonant: DubeolsikConsonant
  readonly vowels: readonly DubeolsikVowel[]
  readonly trailingConsonants: readonly DubeolsikConsonant[]
}

/**
 * Hangul word that consists of {@link DubeolsikSyllable}
 */
export interface Word {
  readonly value: string
  /**
   * number of syllables in the word
   */
  readonly length: number
  readonly syllables: readonly DubeolsikSyllable[]
}
