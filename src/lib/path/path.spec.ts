import { getDrawableSyllable, FONT } from '.'
import * as Hangul from '@/lib/hangul'

const itIf = (condition: boolean) => (condition ? it : it.skip)

describe('getDrawableSyllable()', () => {
  describe('should create valid Jamo paths except for known undrawable syllables', () => {
    const hangulCodePoints = Array(Hangul.LAST_SYLLABLE - Hangul.FIRST_SYLLABLE)
      .fill(0)
      .map((_, i) => Hangul.FIRST_SYLLABLE + i)
    const str = String.fromCodePoint(...hangulCodePoints)
    const syllables = Hangul.toWord(str).syllables

    for (const syllable of syllables) {
      // Skip testing for known undrawable syllables
      const doTest = !FONT.undrawableSyllables.includes(syllable.value)

      // This will fail if the glyph consist of connected Jamo paths, assuming
      // number of paths for each Jamo (FONT.jamoClosedPathCount) are correct
      // and consistent for all glyphs
      itIf(doTest)(`${syllable.value}`, async () => {
        const drawableSyllable = await getDrawableSyllable(syllable)

        // Each Jamo path should not be empty
        expect(drawableSyllable.leadingConsonantPath).toBeTruthy()
        drawableSyllable.vowelPaths.map((dProperty) =>
          expect(dProperty).toBeTruthy()
        )
        drawableSyllable.trailingConsonantPaths.map((dProperty) =>
          expect(dProperty).toBeTruthy()
        )

        // Number of Jamo should not be changed
        expect(drawableSyllable.vowelPaths).toHaveLength(syllable.vowels.length)
        expect(drawableSyllable.trailingConsonantPaths).toHaveLength(
          syllable.trailingConsonants.length
        )
      })
    }
  })
})
