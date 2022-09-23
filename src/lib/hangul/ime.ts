import {
  LEADING_CONSONANTS,
  TRAILING_CONSONANTS_DECOMPOSED,
  VOWELS_DECOMPOSED,
} from './constants'
import {
  compose,
  getCodePointLength,
  isHangul,
  isHangulJamo,
  _toDubeolsikSyllable,
} from './hangul'
import type {
  DubeolsikConsonant,
  DubeolsikJamo,
  DubeolsikVowel,
  Jamo,
  LeadingConsonant,
  TrailingConsonant,
  Vowel,
} from './types'

/**
 * Simple korean input method editor for dubeolsik keyboard layout.
 *
 * - Only {@link DubeolsikJamo} can be typed in
 * - Cursor is always placed at the end of the input
 * - Syllables are always in composing mode
 *   - Example
 *     1. '가나다' + Backspace -> '가나ㄷ'
 *     2. '가나ㄷ' + Backspace -> '가나' (note that '나' is in composing mode)
 *     3. '가나' + 'ㄷ' -> '가낟' (not '가나ㄷ' because '나' is in composing mode)
 *   - This behavior is different from that of most system IDE that supports
 *     cursor movement, input focus off (cursor off), etc. In most system IDE,
 *     a syllable become out of composing mode when the cursor have left the
 *     composing syllable. In this case, a syllable not in composing mode won't
 *     be affected by following inputs and could be deleted by a backspace key,
 *     e.g.
 *     - '가' (not in composing mode) + 'ㄱ' -> '가ㄱ' (not '각')
 *     - '가나다' (not in composing mode) + Backspace -> '가나' (not '가나ㄷ')
 */
export class DubeolsikIME {
  #value: ComposingSyllable[]

  constructor() {
    this.#value = []
  }

  get value(): string {
    return this.#value.reduce((prev, curr) => prev + curr.toString(), '')
  }

  /**
   * Update IME input value to the given string if the string consists of Hangul
   *
   * @param str a string to update input value of the IME
   * @returns true if the string consists of Hangul and the value is updated, otherwise false
   */
  setValue(str: string): boolean {
    if (!isHangul(str)) {
      return false
    }

    this.#value = Array.from(str).map((char) => new ComposingSyllable(char))
    return true
  }

  type(jamo: DubeolsikJamo) {
    const length = this.#value.length
    if (length === 0) {
      this.#value.push(new ComposingSyllable(jamo))
      return
    }

    const lastSyllable = this.#value[length - 1]
    const newSyllable = lastSyllable.addJamo(jamo)
    if (newSyllable !== undefined) {
      this.#value.push(newSyllable)
    }
  }

  /**
   * Delete the last {@link DubeolsikJamo} from the IME input value
   */
  delete() {
    const length = this.#value.length
    if (length === 0) {
      return
    }

    const lastSyllable = this.#value[length - 1]
    lastSyllable.popJamo()
    if (lastSyllable.isEmpty()) {
      this.#value.pop()
    }
  }
}

type ComposableJamo = 'V' | 'T'

class ComposingSyllable {
  leadingConsonant: DubeolsikConsonant | undefined
  vowels: DubeolsikVowel[]
  trailingConsonants: DubeolsikConsonant[]

  constructor(char: string) {
    if (!(getCodePointLength(char) === 1 && isHangul(char))) {
      throw new Error('expected one Hangul letter')
    }

    this.leadingConsonant = undefined
    this.vowels = []
    this.trailingConsonants = []

    if (isJamo(char)) {
      if (isLeadingConsonant(char)) {
        this.leadingConsonant = char
      } else if (isVowel(char)) {
        this.vowels = toDubeolsikJamo(char) as DubeolsikVowel[]
      } else {
        this.trailingConsonants = toDubeolsikJamo(char) as DubeolsikConsonant[]
      }
    } else {
      // char is a syllable
      const syllable = _toDubeolsikSyllable(char)
      this.leadingConsonant = syllable.leadingConsonant
      this.vowels = [...syllable.vowels]
      this.trailingConsonants = [...syllable.trailingConsonants]
    }
  }

  getComposableJamo(): ReadonlySet<ComposableJamo> {
    if (this.isEmpty()) {
      return new Set()
    } else if (this.leadingConsonant === undefined) {
      if (this.vowels.length === 2) {
        return new Set()
      } else {
        // V or TT
        return new Set(['V'])
      }
    }

    const result: Set<ComposableJamo> = new Set()
    if (this.vowels.length < 2 && this.trailingConsonants.length === 0) {
      result.add('V')
    }
    if (this.trailingConsonants.length < 2) {
      result.add('T')
    }
    if (this.trailingConsonants.length > 0) {
      result.add('V')
    }
    return result
  }

  flat(): DubeolsikJamo[] {
    return [
      this.leadingConsonant,
      ...this.vowels,
      ...this.trailingConsonants,
    ].filter((elem): elem is DubeolsikJamo => elem !== undefined)
  }

  /**
   * Add a Jamo to the syllable in a way that a syllable is typed in
   * in dubeolsik keyboard layout.
   *
   * If the Jamo is added in the current syllable, undefined is returned.
   * Otherwise, if a new syllable is needed to add the Jamo, a new
   * {@link ComposingSyllable} is returned.
   *
   * # Example
   *
   * Assuming an existing syllable `s1` is '가'
   * 1. `s2 = s1.addJamo('ㄴ')`, `s1` is now '간', `s2 === undefined`
   * 2. `s2 = s1.addJamo('ㅏ')`, `s1` is now '가', `s2` is '나'
   */
  addJamo(jamo: DubeolsikJamo): ComposingSyllable | undefined {
    if (isLeadingConsonant(jamo)) {
      return this.addConsonant(jamo)
    } else {
      return this.addVowel(jamo)
    }
  }

  addConsonant(consonant: DubeolsikConsonant): ComposingSyllable | undefined {
    if (this.isEmpty()) {
      this.leadingConsonant = consonant
      return undefined
    }

    const isValidCandidate = (
      candidate: readonly DubeolsikConsonant[]
    ): boolean => {
      return TRAILING_CONSONANTS_DECOMPOSED.some((elem) =>
        isArrayEqual(elem, candidate)
      )
    }

    const composableJamo = this.getComposableJamo()
    if (composableJamo.has('T')) {
      if (this.vowels.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const candidate = [this.leadingConsonant!, consonant]
        if (isValidCandidate(candidate)) {
          this.leadingConsonant = undefined
          this.trailingConsonants = candidate
          return undefined
        }
      } else {
        const candidate = [...this.trailingConsonants, consonant]
        if (isValidCandidate(candidate)) {
          this.trailingConsonants = candidate
          return undefined
        }
      }
    }

    return new ComposingSyllable(consonant)
  }

  addVowel(vowel: DubeolsikVowel): ComposingSyllable | undefined {
    if (this.isEmpty()) {
      this.vowels = [vowel]
      return undefined
    }

    const composableJamo = this.getComposableJamo()
    if (composableJamo.has('V')) {
      if (this.trailingConsonants.length === 0) {
        const candidate = [...this.vowels, vowel]
        const isValidCandidate = VOWELS_DECOMPOSED.some((elem) =>
          isArrayEqual(elem, candidate)
        )
        if (isValidCandidate) {
          this.vowels = candidate
          return undefined
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lastTrailingConsonant = this.trailingConsonants.pop()!
        const newSyllable = new ComposingSyllable(lastTrailingConsonant)
        newSyllable.addJamo(vowel)

        // If the remaining is only T, move T to L
        if (
          this.leadingConsonant === undefined &&
          this.trailingConsonants.length === 1
        ) {
          this.leadingConsonant = this.trailingConsonants.pop()
        }

        return newSyllable
      }
    }

    return new ComposingSyllable(vowel)
  }

  /**
   * Remove the last Jamo from the syllable and return it. If there is no Jamo
   * in the syllable, undefined is returned and the syllable is not modified.
   */
  popJamo(): DubeolsikJamo | undefined {
    let popped = this.trailingConsonants.pop() || this.vowels.pop()
    if (!popped) {
      popped = this.leadingConsonant
      this.leadingConsonant = undefined
    }

    // If the remaining is only T, move T to L
    if (
      this.leadingConsonant === undefined &&
      this.trailingConsonants.length === 1
    ) {
      this.leadingConsonant = this.trailingConsonants.pop()
    }

    return popped
  }

  isEmpty(): boolean {
    return (
      this.leadingConsonant === undefined &&
      this.vowels.length === 0 &&
      this.trailingConsonants.length === 0
    )
  }

  toString(): string {
    const vowel = toJamo(this.vowels) as Vowel | undefined
    const trailingConsonant = toJamo(this.trailingConsonants) as
      | TrailingConsonant
      | undefined

    if (this.leadingConsonant !== undefined && vowel !== undefined) {
      return compose(this.leadingConsonant, vowel, trailingConsonant)
    }

    return this.leadingConsonant || vowel || trailingConsonant || ''
  }
}

const jamoToDubeolsikJamoMap: {
  readonly [key in Jamo]?: readonly DubeolsikJamo[]
} = {
  ㅘ: ['ㅗ', 'ㅏ'],
  ㅙ: ['ㅗ', 'ㅐ'],
  ㅚ: ['ㅗ', 'ㅣ'],
  ㅝ: ['ㅜ', 'ㅓ'],
  ㅞ: ['ㅜ', 'ㅔ'],
  ㅟ: ['ㅜ', 'ㅣ'],
  ㅢ: ['ㅡ', 'ㅣ'],
  ㄳ: ['ㄱ', 'ㅅ'],
  ㄵ: ['ㄴ', 'ㅈ'],
  ㄶ: ['ㄴ', 'ㅎ'],
  ㄺ: ['ㄹ', 'ㄱ'],
  ㄻ: ['ㄹ', 'ㅁ'],
  ㄼ: ['ㄹ', 'ㅂ'],
  ㄽ: ['ㄹ', 'ㅅ'],
  ㄾ: ['ㄹ', 'ㅌ'],
  ㄿ: ['ㄹ', 'ㅍ'],
  ㅀ: ['ㄹ', 'ㅎ'],
  ㅄ: ['ㅂ', 'ㅅ'],
} as const

function toDubeolsikJamo(jamo: Jamo): DubeolsikJamo[] {
  const dubeolsikJamo = jamoToDubeolsikJamoMap[jamo]
  if (dubeolsikJamo) {
    return [...dubeolsikJamo]
  } else {
    return [jamo as DubeolsikJamo]
  }
}

type TwoDubeolsikJamo =
  | `${DubeolsikJamo}${DubeolsikJamo}`
  | `${DubeolsikVowel}${DubeolsikVowel}`

const dubeolsikJamoToJamoMap: {
  readonly [key in TwoDubeolsikJamo]?: Jamo
} = {
  ㅗㅏ: 'ㅘ',
  ㅗㅐ: 'ㅙ',
  ㅗㅣ: 'ㅚ',
  ㅜㅓ: 'ㅝ',
  ㅜㅔ: 'ㅞ',
  ㅜㅣ: 'ㅟ',
  ㅡㅣ: 'ㅢ',
  ㄱㅅ: 'ㄳ',
  ㄴㅈ: 'ㄵ',
  ㄴㅎ: 'ㄶ',
  ㄹㄱ: 'ㄺ',
  ㄹㅁ: 'ㄻ',
  ㄹㅂ: 'ㄼ',
  ㄹㅅ: 'ㄽ',
  ㄹㅌ: 'ㄾ',
  ㄹㅍ: 'ㄿ',
  ㄹㅎ: 'ㅀ',
  ㅂㅅ: 'ㅄ',
} as const

function toJamo(jamo: readonly DubeolsikJamo[]): Jamo | undefined {
  if (jamo.length === 0) {
    return undefined
  } else if (jamo.length === 1) {
    return jamo[0]
  } else {
    const j = jamo.join('') as TwoDubeolsikJamo
    return dubeolsikJamoToJamoMap[j]
  }
}

function isJamo(char: string): char is Jamo {
  return getCodePointLength(char) === 1 && isHangulJamo(char)
}

function isLeadingConsonant(jamo: Jamo): jamo is LeadingConsonant {
  return LEADING_CONSONANTS.some((consonant) => consonant === jamo)
}

function isVowel(jamo: Jamo): jamo is Vowel {
  const dubeolsikJamo = toDubeolsikJamo(jamo)
  return VOWELS_DECOMPOSED.some((vowel) => isArrayEqual(vowel, dubeolsikJamo))
}

// function isTrailingConsonant(jamo: Jamo): jamo is TrailingConsonant {
//   const dubeolsikJamo = toDubeolsikJamo(jamo)
//   return TRAILING_CONSONANTS_DECOMPOSED.some((consonant) =>
//     isArrayEqual(consonant, dubeolsikJamo)
//   )
// }

function isArrayEqual<T>(a1: readonly T[], a2: readonly T[]): boolean {
  return a1.length === a2.length && a1.every((elem, i) => elem === a2[i])
}
