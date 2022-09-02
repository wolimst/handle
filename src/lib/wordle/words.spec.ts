import { getAnswerList, getRandomAnswer, getWordList } from './words'
import { toWord } from '@/lib/hangul'
import { FONT } from '@/lib/path'

const lengths = [1, 2, 3]

describe('getAnswerList(length: number) -> Hangul.Word[]', () => {
  lengths.forEach((length) => {
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
        const syllablesInAnswers = answers.flatMap((answer) => answer.syllables)
        const undrawableSyllables = toWord(FONT.undrawableSyllables).syllables

        undrawableSyllables.forEach((undrawableSyllable) => {
          expect(syllablesInAnswers).not.toContainEqual(undrawableSyllable)
        })
      })
    })
  })
})

describe('getWordList(length: number) -> Hangul.Word[]', () => {
  lengths.forEach((length) => {
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
          expect(words).toContainEqual(answer)
        })
      })

      it('should not contain undrawable syllables', () => {
        const syllablesInWords = words.flatMap((answer) => answer.syllables)
        const undrawableSyllables = toWord(FONT.undrawableSyllables).syllables

        undrawableSyllables.forEach((undrawableSyllable) => {
          expect(syllablesInWords).not.toContainEqual(undrawableSyllable)
        })
      })
    })
  })
})

describe('getRandomAnswer(length: number, seed: string) -> Hangul.Word', () => {
  lengths.forEach((length) => {
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
    expect(() => {
      getRandomAnswer(lengthTooLong, 'randomSeed')
    }).toThrow(Error)
  })
})
