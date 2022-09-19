import {
  FIRST_JAMO_CODEPOINT,
  LAST_JAMO_CODEPOINT,
  FIRST_SYLLABLE_CODEPOINT,
  LAST_SYLLABLE_CODEPOINT,
  LEADING_CONSONANTS,
  VOWELS_DECOMPOSED,
  TRAILING_CONSONANTS_DECOMPOSED,
} from './constants'
import type { DubeolsikJamo, DubeolsikSyllable, Word } from './types'

/**
 * Return code points length of the given string
 */
export function getCodePointLength(str: string): number {
  return Array.from(str).length
}

export function isHangulJamo(str: string): boolean {
  return Array.from(str).every((codePointChar) => {
    const codePoint = codePointChar.codePointAt(0)
    return (
      codePoint &&
      FIRST_JAMO_CODEPOINT <= codePoint &&
      codePoint <= LAST_JAMO_CODEPOINT
    )
  })
}

function isHangulSyllables(str: string): boolean {
  return Array.from(str).every((codePointChar) => {
    const codePoint = codePointChar.codePointAt(0)
    return (
      codePoint &&
      FIRST_SYLLABLE_CODEPOINT <= codePoint &&
      codePoint <= LAST_SYLLABLE_CODEPOINT
    )
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

const syllablesPerLeadingConsonant =
  VOWELS_DECOMPOSED.length * TRAILING_CONSONANTS_DECOMPOSED.length

/**
 * Convert a string that consists of one Hangul syllable to
 * {@link DubeolsikSyllable}.
 *
 * Input string containing non Hangul syllable might cause undefined behavior.
 *
 * @param str a string consists of one Hangul syllable
 */
function toDubeolsikSyllable(str: string): DubeolsikSyllable {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const syllableIndex = str.codePointAt(0)! - FIRST_SYLLABLE_CODEPOINT

  const l = Math.floor(syllableIndex / syllablesPerLeadingConsonant)
  const v = Math.floor(
    (syllableIndex % syllablesPerLeadingConsonant) /
      TRAILING_CONSONANTS_DECOMPOSED.length
  )
  const t =
    (syllableIndex % syllablesPerLeadingConsonant) %
    TRAILING_CONSONANTS_DECOMPOSED.length

  return {
    value: str,
    leadingConsonant: LEADING_CONSONANTS[l],
    vowels: [...VOWELS_DECOMPOSED[v]],
    trailingConsonants: [...TRAILING_CONSONANTS_DECOMPOSED[t]],
  }
}

/**
 * Create {@link Word} object from string that contains Hangul syllables.
 *
 * Characters that are not Hangul syllables will be ignored.
 *
 * @param str a string containing Hangul syllables
 */
export function toWord(str: string): Word {
  const syllableList = Array.from(str).filter(isHangulSyllables)
  const syllableObjects = syllableList.map(toDubeolsikSyllable)

  return {
    value: syllableList.join(''),
    length: syllableObjects.length,
    syllables: syllableObjects,
  }
}
