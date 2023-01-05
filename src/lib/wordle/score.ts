import type { GuessResult, JamoResult } from './types'
import * as Hangul from '@/lib/hangul'

const TOTAL_SYLLABLE_CASES =
  Hangul.LEADING_CONSONANTS.length *
  Hangul.VOWELS_DECOMPOSED.length *
  Hangul.TRAILING_CONSONANTS_DECOMPOSED.length

const VOWEL_COUNT = Hangul.VOWELS_DECOMPOSED.flat().reduce(
  (map, vowel) => map.set(vowel, (map.get(vowel) || 0) + 1),
  new Map<Hangul.DubeolsikVowel, number>()
)

const TRAILING_CONSONANT_COUNT =
  Hangul.TRAILING_CONSONANTS_DECOMPOSED.flat().reduce(
    (map, consonant) => map.set(consonant, (map.get(consonant) || 0) + 1),
    new Map<Hangul.DubeolsikConsonant, number>()
  )

/**
 * Calculate shannon information of a guess for each syllable
 */
function getShannonInformation(guessResult: GuessResult): number[] {
  const presentJamos = new Set<Hangul.DubeolsikJamo>()
  const absentJamos = new Set<Hangul.DubeolsikJamo>()

  const zip: [Hangul.DubeolsikJamo, JamoResult][] =
    guessResult.guess.syllables.flatMap((syllable, i) => {
      const jamos = [
        syllable.leadingConsonant,
        ...syllable.vowels,
        ...syllable.trailingConsonants,
      ]
      const syllableResult = guessResult.result[i]
      const jamoResults = [
        syllableResult.leadingConsonant,
        ...syllableResult.vowels,
        ...syllableResult.trailingConsonants,
      ]
      return jamos.map<[Hangul.DubeolsikJamo, JamoResult]>((jamo, j) => [
        jamo,
        jamoResults[j],
      ])
    })

  for (const [jamo, result] of zip) {
    if (result === 'present') {
      presentJamos.add(jamo)
    } else if (result === 'absent') {
      absentJamos.add(jamo)
    }
  }

  guessResult.result
    .map((syllableResult) => {
      let numCases = 1
      if (syllableResult.exact) {
        return 1
      }

      syllableResult.leadingConsonant

      // TODO
    })
    .map((numCases) => Math.log2(numCases))

  // TODO
  return []
}
