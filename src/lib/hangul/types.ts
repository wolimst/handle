/**
 * Hangul word that consists of Hangul syllables
 * @see {@link Syllable}
 */
export interface Word {
  readonly value: string
  /**
   * number of syllables in the word
   */
  readonly length: number
  readonly syllables: readonly Syllable[]
}

/**
 * Hangul syllable with its Jamo information, i.e. a leading consonant,
 * 1 or 2 vowels, and 0-2 trailing consonants.
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
 * @see {@link Consonant} and {@link Vowel}
 */
export interface Syllable {
  readonly value: string
  readonly leadingConsonant: Consonant
  readonly vowels: readonly Vowel[]
  readonly trailingConsonants: readonly Consonant[]
}

/**
 * Hangul Jamo that can be typed in by single keyboard key in
 * Dubeolsik keyboard layout
 *
 * @see {@link Consonant} and {@link Vowel}
 */
export type Jamo = Consonant | Vowel

/**
 * Hangul consonants that can be typed in by single keyboard key in
 * Dubeolsik keyboard layout
 *
 * # Example
 *
 * - 'ㄱ' is a Consonant, because it require 1 key to type in
 * - 'ㄲ' is a Consonant, because it require 1 key to type in \
 *   (shift key does not count, because it is not Hangul Jamo)
 * - 'ㄳ' is not a Consonant, because it require 2 keys to type in
 */
export type Consonant =
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
 * Hangul vowels that can be typed in by single keyboard key in
 * Dubeolsik keyboard layout
 *
 * # Example
 *
 * - 'ㅐ' is a Vowel, because it require 1 key to type in
 * - 'ㅒ' is a Vowel, because it require 1 key to type in \
 *   (shift key does not count, because it is not Hangul Jamo)
 * - 'ㅙ' is not a Vowel, because it require 2 keys to type in
 */
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
  | 'ㅛ'
  | 'ㅜ'
  | 'ㅠ'
  | 'ㅡ'
  | 'ㅣ'
