import type {
  DubeolsikConsonant,
  DubeolsikVowel,
  TrailingConsonant,
  Vowel,
} from './types'

/**
 * Code point of the first syllable in Hangul Syllables unicode block
 */
export const FIRST_SYLLABLE_CODEPOINT = 0xac00
/**
 * Code point of the last syllable in Hangul Syllables unicode block
 */
export const LAST_SYLLABLE_CODEPOINT = 0xd7a3 // 0xd7a4..0xd7af are unused code points

/**
 * Code point of the first modern Jamo in Hangul Compatibility Jamo unicode block
 */
export const FIRST_JAMO_CODEPOINT = 0x3131 // 0x3130 is unused code point
/**
 * Code point of the last modern Jamo in Hangul Compatibility Jamo unicode block
 */
export const LAST_JAMO_CODEPOINT = 0x3163 // 0x3164..0x318f are not used in modern Korean

export const LEADING_CONSONANTS: readonly DubeolsikConsonant[] = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
] as const

export const VOWELS: readonly Vowel[] = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ',
] as const

export const VOWELS_DECOMPOSED: readonly (readonly DubeolsikVowel[])[] = [
  ['ㅏ'],
  ['ㅐ'],
  ['ㅑ'],
  ['ㅒ'],
  ['ㅓ'],
  ['ㅔ'],
  ['ㅕ'],
  ['ㅖ'],
  ['ㅗ'],
  ['ㅗ', 'ㅏ'],
  ['ㅗ', 'ㅐ'],
  ['ㅗ', 'ㅣ'],
  ['ㅛ'],
  ['ㅜ'],
  ['ㅜ', 'ㅓ'],
  ['ㅜ', 'ㅔ'],
  ['ㅜ', 'ㅣ'],
  ['ㅠ'],
  ['ㅡ'],
  ['ㅡ', 'ㅣ'],
  ['ㅣ'],
] as const

export const TRAILING_CONSONANTS: readonly (TrailingConsonant | '')[] = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
] as const

export const TRAILING_CONSONANTS_DECOMPOSED: readonly (readonly DubeolsikConsonant[])[] =
  [
    [],
    ['ㄱ'],
    ['ㄲ'],
    ['ㄱ', 'ㅅ'],
    ['ㄴ'],
    ['ㄴ', 'ㅈ'],
    ['ㄴ', 'ㅎ'],
    ['ㄷ'],
    ['ㄹ'],
    ['ㄹ', 'ㄱ'],
    ['ㄹ', 'ㅁ'],
    ['ㄹ', 'ㅂ'],
    ['ㄹ', 'ㅅ'],
    ['ㄹ', 'ㅌ'],
    ['ㄹ', 'ㅍ'],
    ['ㄹ', 'ㅎ'],
    ['ㅁ'],
    ['ㅂ'],
    ['ㅂ', 'ㅅ'],
    ['ㅅ'],
    ['ㅆ'],
    ['ㅇ'],
    ['ㅈ'],
    ['ㅊ'],
    ['ㅋ'],
    ['ㅌ'],
    ['ㅍ'],
    ['ㅎ'],
  ] as const
