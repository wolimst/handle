import {
  getAnswerList,
  getRandomAnswer,
  getWordList,
  isInWordList,
} from './words'
import { FONT } from '@/lib/path'

const LENGTHS = [2]

describe('getAnswerList(length: number) -> string[]', () => {
  LENGTHS.forEach((length) => {
    describe(`answer length: ${length}`, () => {
      const answers = getAnswerList(length)

      it('should contain at least one item', () => {
        expect(answers.length).toBeGreaterThan(0)
      })

      it(`should contain words whose length is ${length}`, () => {
        answers.forEach((answer) => {
          expect(answer).toHaveLength(length)
        })
      })

      it('should not contain undrawable syllables', () => {
        const syllables = answers.flatMap((answer) => Array.from(answer))
        syllables.forEach((syllable) => {
          expect(FONT.undrawableSyllables).not.toContain(syllable)
        })
      })
    })
  })

  it('should throw an error when there is no answer of the given length', () => {
    const lengthTooLong = 10000
    expect(LENGTHS).not.toContain(lengthTooLong)
    expect(() => {
      getAnswerList(lengthTooLong)
    }).toThrow(Error)
  })
})

describe('getWordList(length: number) -> string[]', () => {
  LENGTHS.forEach((length) => {
    describe(`word length: ${length}`, () => {
      const words = getWordList(length)
      const answers = getAnswerList(length)

      it('should contain at least one item', () => {
        expect(words.length).toBeGreaterThan(0)
      })

      it(`should contain words whose length is ${length}`, () => {
        words.forEach((word) => {
          expect(word).toHaveLength(length)
        })
      })

      it('should contain all answers with the same length', () => {
        answers.forEach((answer) => {
          expect(words).toContain(answer)
        })
      })

      it('should not contain undrawable syllables', () => {
        const syllables = words.flatMap((word) => Array.from(word))
        syllables.forEach((syllable) => {
          expect(FONT.undrawableSyllables).not.toContain(syllable)
        })
      })
    })
  })

  it('should throw an error when there is no word of the given length', () => {
    const lengthTooLong = 10000
    expect(LENGTHS).not.toContain(lengthTooLong)
    expect(() => {
      getWordList(lengthTooLong)
    }).toThrow(Error)
  })
})

describe('getRandomAnswer(length: number, seed: string) -> Hangul.Word', () => {
  LENGTHS.forEach((length) => {
    describe(`word length: ${length}`, () => {
      it(`should return an answer whose length is ${length}`, () => {
        const answer = getRandomAnswer(length, 'seed')
        expect(answer).toHaveLength(length)
      })

      it('should return same answer when called with same parameters', () => {
        const answer1 = getRandomAnswer(length, 'randomSeed')
        const answer2 = getRandomAnswer(length, 'randomSeed')
        expect(answer1).toStrictEqual(answer2)
      })
    })
  })

  it('should throw an error when failed to prepare an answer', () => {
    const lengthTooLong = 10000
    expect(LENGTHS).not.toContain(lengthTooLong)
    expect(() => {
      getRandomAnswer(lengthTooLong, 'randomSeed')
    }).toThrow(Error)
  })
})

describe('isInWordList(str: string) -> boolean', () => {
  it('should return true for a string which is in the word list', () => {
    LENGTHS.forEach((length) => {
      const words = getWordList(length)
      words.forEach((word) => {
        expect(isInWordList(word)).toBeTruthy()
      })
    })
  })

  it('should return false for a string which is not in the word list', () => {
    expect(isInWordList('없닭')).toBeFalsy()
  })
})
