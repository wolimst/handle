import type { Consonant, Syllable, Vowel, Word } from './types'

// Hangul syllables unicode block range: 0xac00..0xd7af
export const FIRST_SYLLABLE = 0xac00
export const LAST_SYLLABLE = 0xd7a3 // 0xd7a4..0xd7af are unused code points

function isHangulSyllables(str: string): boolean {
  return Array.from(str).every((codePointChar) => {
    const codePoint = codePointChar.codePointAt(0)
    return (
      codePoint && FIRST_SYLLABLE <= codePoint && codePoint <= LAST_SYLLABLE
    )
  })
}

// Hangul Compatibility Jamo unicode block range: 0x3130..0x318f
const FIRST_JAMO = 0x3131 // 0x3130 is unused
const LAST_JAMO = 0x3163 // 0x3164..0x318f are not used in modern Korean

function isHangulJamo(str: string): boolean {
  return Array.from(str).every((codePointChar) => {
    const codePoint = codePointChar.codePointAt(0)
    return codePoint && FIRST_JAMO <= codePoint && codePoint <= LAST_JAMO
  })
}

/**
 * Check whether the given string consists of Hangul Jamo or syllable.
 *
 * Assume the string is typed using Dubeolsik keyboard layout,
 * i.e. Hangul characters that are not used in modern Korean are not counted as
 * Hangul by this function.
 *
 * @returns true if the string is empty or consists of modern Hangul characters, otherwise false
 */
export function isHangul(str: string): boolean {
  return Array.from(str).every(
    (codePointChar) =>
      isHangulSyllables(codePointChar) || isHangulJamo(codePointChar)
  )
}

const leadingConsonants: readonly Consonant[] = [
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
]

const vowels: readonly (readonly Vowel[])[] = [
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
]

const trailingConsonants: readonly (readonly Consonant[])[] = [
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
]

interface DecomposedSyllable {
  readonly leadingConsonant: Consonant
  readonly vowels: readonly Vowel[]
  readonly trailingConsonants: readonly Consonant[]
}

/**
 * Decompose single Hangul syllable to a leading consonant, 1 or 2 vowels and
 * 0-2 trailing consonants.
 *
 * Vowels and trailing consonants are sorted in the keyboard typing order.
 *
 * Input string containing non Hangul syllable might cause undefined behavior.
 *
 * @param str a string consists of single Hangul syllable
 */
function decomposeSyllable(str: string): DecomposedSyllable {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const syllableIndex = str.codePointAt(0)! - FIRST_SYLLABLE
  const syllablesPerLeadingConsonant = vowels.length * trailingConsonants.length
  const l = Math.floor(syllableIndex / syllablesPerLeadingConsonant)
  const v = Math.floor(
    (syllableIndex % syllablesPerLeadingConsonant) / trailingConsonants.length
  )
  const t =
    (syllableIndex % syllablesPerLeadingConsonant) % trailingConsonants.length
  return {
    leadingConsonant: leadingConsonants[l],
    vowels: [...vowels[v]],
    trailingConsonants: [...trailingConsonants[t]],
  }
}

/**
 * Return code points length of the given string
 */
export function getCodePointLength(str: string): number {
  return Array.from(str).length
}

/**
 * Create {@link Word} object from string that contains Hangul syllables.
 *
 * Characters that are not Hangul syllables will be ignored.
 *
 * @param str a string containing Hangul syllables
 */
export function toWord(str: string): Word {
  const syllableList: string[] = Array.from(str).filter(isHangulSyllables)
  const syllableObjects: Syllable[] = syllableList.map((syllableStr) => ({
    value: syllableStr,
    ...decomposeSyllable(syllableStr),
  }))

  return {
    value: syllableList.join(''),
    length: syllableObjects.length,
    syllables: syllableObjects,
  }
}
