import { FONT, getUndrawableSyllablesInWord, getDrawableSyllable } from '.'
import * as Hangul from '@/lib/hangul'
import * as opentype from 'opentype.js'

describe('getUndrawableSyllablesInWord()', () => {
  const drawableSyllable = '가'
  const undrawableSyllables = FONT.undrawableSyllables

  test('should return empty string for empty input', () => {
    const word = ''
    expect(getUndrawableSyllablesInWord(Hangul.toWord(word))).toStrictEqual('')
  })

  test('no undrawable syllable exists in input', () => {
    const word1 = drawableSyllable
    expect(getUndrawableSyllablesInWord(Hangul.toWord(word1))).toStrictEqual('')

    const word2 = drawableSyllable + drawableSyllable
    expect(getUndrawableSyllablesInWord(Hangul.toWord(word2))).toStrictEqual('')
  })

  test('one undrawable syllable exists in input ', () => {
    const word = Array.from(undrawableSyllables)[0]
    const result = getUndrawableSyllablesInWord(Hangul.toWord(word))
    expect(result).toStrictEqual(word)
  })

  test('multiple undrawable syllable exist in input', () => {
    const word = drawableSyllable + undrawableSyllables
    const result = getUndrawableSyllablesInWord(Hangul.toWord(word))
    expect(result).toContain(undrawableSyllables)
    expect(result).toHaveLength(undrawableSyllables.length)
  })

  test('result should not contain duplicates', () => {
    const word = undrawableSyllables + drawableSyllable + undrawableSyllables
    const result = getUndrawableSyllablesInWord(Hangul.toWord(word))
    expect(result).toContain(undrawableSyllables)
    expect(result).toHaveLength(undrawableSyllables.length)
  })
})

// Skipped because it's a simple wrapper around opentype.Glyph.getPath()
describe.skip('getDrawableString()')

describe('getDrawableSyllable()', () => {
  const LOCAL_FONT_PATH = `${process.cwd()}/public/resources/fonts/Binggrae.otf`
  vi.spyOn(opentype, 'load').mockReturnValue(
    Promise.resolve(opentype.loadSync(LOCAL_FONT_PATH))
  )

  describe('should create valid Jamo paths except for known undrawable syllables', () => {
    const hangulCodePoints = Array(
      Hangul.LAST_SYLLABLE_CODEPOINT - Hangul.FIRST_SYLLABLE_CODEPOINT
    )
      .fill(0)
      .map((_, i) => Hangul.FIRST_SYLLABLE_CODEPOINT + i)
    const str = String.fromCodePoint(...hangulCodePoints)
    const syllables = Hangul.toWord(str).syllables

    for (const syllable of syllables) {
      // Skip testing for known undrawable syllables
      const doTest = !FONT.undrawableSyllables.includes(syllable.value)

      // This will fail if the glyph consist of connected Jamo paths, assuming
      // number of paths for each Jamo (FONT.jamoClosedPathCount) are correct
      // and consistent for all glyphs
      it.runIf(doTest)(`${syllable.value}`, async () => {
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
