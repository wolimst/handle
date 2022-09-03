import type * as Hangul from '@/lib/hangul'

/**
 * Font to draw Hangul syllables and decompose syllables into paths of Jamo.
 *
 * It is highly recommended to choose a font where most of its glyphs are made
 * of non-connected Jamo paths.
 * For example, in many korean fonts, '호' is drawn with a single closed path,
 * i.e., the two Jamo 'ㅎ' and 'ㅗ' are connected.
 * Glyphs like this cannot be decomposed into paths of Jamo, since we perform
 * the decomposition by detecting closed paths for each Jamo.
 */
export interface Font {
  readonly name: string
  /**
   * URLs of the font, from highest priority to lowest
   */
  readonly urls: readonly string[]
  readonly fontSize: number
  /**
   * viewBox size of svg path
   */
  readonly vboxSize: number
  /**
   * Hangul syllables that cannot be decomposed to paths of Jamo.
   */
  readonly undrawableSyllables: string
  /**
   * Number of closed paths to draw each Jamo using the font
   *
   * For example, 'ㅔ' requires 2 closed paths.
   */
  readonly jamoClosedPathCount: JamoClosedPathCount
}

export interface DrawableSyllable extends Hangul.Syllable {
  readonly leadingConsonantPath: DProperty
  readonly vowelPaths: readonly DProperty[]
  readonly trailingConsonantPaths: readonly DProperty[]
  readonly boundingBox: {
    readonly x1: number
    readonly y1: number
    readonly x2: number
    readonly y2: number
  }
}

/**
 * Jamo colors of a syllable. Each color should be represented as a valid hex
 * string.
 *
 * Colors of vowels and trailing consonants should be sorted in the keyboard
 * typing order of the syllable, as same as in {@link Hangul.Syllable}
 */
export interface SyllableColor {
  /**
   * `undefined` is for transparent background, since RGBA colors might not be
   * supported in some old browsers
   */
  readonly background: string | undefined
  readonly leadingConsonant: string
  readonly vowels: readonly string[]
  readonly trailingConsonant: readonly string[]
}

/**
 * Number of closed paths to draw each Jamo using the font
 */
export type JamoClosedPathCount = {
  readonly [key in Hangul.Jamo]: number
}

/**
 * SVG Path element's d property
 */
export type DProperty = string
