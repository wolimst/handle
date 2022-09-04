// Syllable representation using Jamo types in test cases
// L: leading consonant
// V: vowel
// T: trailing consonant
// *: any combination of LVT
// Example: '환경' -> LVVT/LVT
import type { JamoResult, Status } from './types'
import { _Wordle } from './wordle'
import * as WordsModule from './words'
import { toWord } from '@/lib/hangul'

// Mock structuredClone() because it is not implemented in jsdom
global.structuredClone = vi.fn(<T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
})

const CORRECT: JamoResult = 'correct'
const PRESENT: JamoResult = 'present'
const ABSENT: JamoResult = 'absent'

const PLAYING: Status = 'playing'
const WIN: Status = 'win'
const LOSS: Status = 'lose'

describe('tests for wordle class', () => {
  const answerGetterMock = vi.spyOn(WordsModule, 'getRandomAnswer')
  function initWordle(nGuesses: number, answer: string): _Wordle {
    answerGetterMock.mockReturnValueOnce(toWord(answer))
    const dummyAnswerLength = 0
    return new _Wordle(nGuesses, dummyAnswerLength, 'dummySeed')
  }

  describe('submitGuess(Hangul.Word) -> GuessResult', () => {
    const nGuesses = 1_000_000_000

    test('GuessResult.guess should be equal to the guess', () => {
      const answer = '정답'
      const wordle = initWordle(nGuesses, answer)

      const guess1 = toWord('하늘')
      expect(wordle.submitGuess(guess1).guess).toStrictEqual(guess1)

      const guess2 = toWord('바람')
      expect(wordle.submitGuess(guess2).guess).toStrictEqual(guess2)
    })

    describe('GuessResult.result should have same number of Jamo as in the guess', () => {
      const answer = '정답'
      const wordle = initWordle(nGuesses, answer)

      test('guess: "쇄신" (LVV/LVT)', () => {
        const res1 = wordle.submitGuess(toWord('쇄신'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toBeDefined()
        expect(res1.result[0].vowels).toHaveLength(2)
        expect(res1.result[0].trailingConsonants).toHaveLength(0)
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toBeDefined()
        expect(res1.result[1].vowels).toHaveLength(1)
        expect(res1.result[1].trailingConsonants).toHaveLength(1)
      })

      test('guess: "원주" (LVVT/LV)', () => {
        const res1 = wordle.submitGuess(toWord('원주'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toBeDefined()
        expect(res1.result[0].vowels).toHaveLength(2)
        expect(res1.result[0].trailingConsonants).toHaveLength(1)
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toBeDefined()
        expect(res1.result[1].vowels).toHaveLength(1)
        expect(res1.result[1].trailingConsonants).toHaveLength(0)
      })

      test('guess: "찰흙" (LVT/LVTT)', () => {
        const res1 = wordle.submitGuess(toWord('찰흙'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toBeDefined()
        expect(res1.result[0].vowels).toHaveLength(1)
        expect(res1.result[0].trailingConsonants).toHaveLength(1)
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toBeDefined()
        expect(res1.result[1].vowels).toHaveLength(1)
        expect(res1.result[1].trailingConsonants).toHaveLength(2)
      })

      test.todo('guess: "?" (LVVTT/LVVTT)', () => {
        // TODO: find a valid word containing LVVTT syllable
        const res1 = wordle.submitGuess(toWord('?'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toBeDefined()
        expect(res1.result[0].vowels).toHaveLength(2)
        expect(res1.result[0].trailingConsonants).toHaveLength(2)
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toBeDefined()
        expect(res1.result[1].vowels).toHaveLength(2)
        expect(res1.result[1].trailingConsonants).toHaveLength(2)
      })

      test('number of the Jamo in the answer should have no effect', () => {
        const answer = '찰흙'
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord('시계'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toBeDefined()
        expect(res1.result[0].vowels).toHaveLength(1)
        expect(res1.result[0].trailingConsonants).toHaveLength(0)
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toBeDefined()
        expect(res1.result[1].vowels).toHaveLength(1)
        expect(res1.result[1].trailingConsonants).toHaveLength(0)
      })
    })

    describe('check JamoResult for leading consonant', () => {
      const answer = '가치'
      const wordle = initWordle(nGuesses, answer)

      test('correct position', () => {
        const res1 = wordle.submitGuess(toWord('곤충'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([ABSENT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([ABSENT])
      })

      test('wrong position', () => {
        const res1 = wordle.submitGuess(toWord('충고'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(PRESENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([ABSENT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(PRESENT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([])
      })

      test('wrong position from trailing consonant', () => {
        const res1 = wordle.submitGuess(toWord('꽃길'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([PRESENT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(PRESENT)
        expect(res1.result[1].vowels).toStrictEqual([CORRECT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([ABSENT])
      })

      test('not in word', () => {
        const res1 = wordle.submitGuess(toWord('들깨'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([ABSENT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([])
      })
    })

    describe('check JamoResult for vowels', () => {
      const answer = '진화'
      const wordle = initWordle(nGuesses, answer)

      test('correct position', () => {
        const res1 = wordle.submitGuess(toWord('미화'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([CORRECT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([])
        expect(res1.result[1].exact).toBeTruthy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[1].vowels).toStrictEqual([CORRECT, CORRECT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([])
      })

      test('wrong position', () => {
        const res1 = wordle.submitGuess(toWord('화기'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(PRESENT)
        expect(res1.result[0].vowels).toStrictEqual([PRESENT, PRESENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([PRESENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([])
      })

      test('not in word', () => {
        const res1 = wordle.submitGuess(toWord('원래'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT, ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([CORRECT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([])
      })
    })

    describe('check JamoResult for trailing consonants', () => {
      const answer = '진흙'
      const wordle = initWordle(nGuesses, answer)

      test('correct position', () => {
        const res1 = wordle.submitGuess(toWord('찰흙'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([ABSENT])
        expect(res1.result[1].exact).toBeTruthy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[1].vowels).toStrictEqual([CORRECT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([
          CORRECT,
          CORRECT,
        ])
      })

      test('wrong position', () => {
        const res1 = wordle.submitGuess(toWord('출전'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([PRESENT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(PRESENT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([PRESENT])
      })

      test('wrong position from leading consonant', () => {
        const res1 = wordle.submitGuess(toWord('가람'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(PRESENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(PRESENT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([ABSENT])
      })

      test('not in word', () => {
        const res1 = wordle.submitGuess(toWord('붕대'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([ABSENT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([])
      })
    })

    describe('check JamoResult when there are multiple vowels or trailing consonants', () => {
      test('correct vowel regardless of the order (answer: LV/*, guess: LVV/*)', () => {
        const answer = '나비'
        const wordle = initWordle(nGuesses, answer)

        // 'ㅏ' in the guess should be correct even if it is the second vowel in '화'
        const res1 = wordle.submitGuess(toWord('화분'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT, CORRECT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([PRESENT])
      })

      test('correct vowel regardless of the order (answer: LVV/*, guess: LV/*)', () => {
        // reverse of above test
        const answer = '화분'
        const wordle = initWordle(nGuesses, answer)

        // 'ㅏ' in the guess should be correct even if it is the first and only vowel in '나'
        const res1 = wordle.submitGuess(toWord('나비'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(PRESENT)
        expect(res1.result[0].vowels).toStrictEqual([CORRECT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([])
      })

      test('correct trailing consonant regardless of the order (answer: LVT/*, guess: LVTT/*)', () => {
        const answer = '생각'
        const wordle = initWordle(nGuesses, answer)

        // trailing consonant 'ㄱ' in the guess should be correct
        // even if it is the second trialing consonant in '흙'
        const res1 = wordle.submitGuess(toWord('찰흙'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([PRESENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([ABSENT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([
          ABSENT,
          CORRECT,
        ])
      })

      test('correct trailing consonant regardless of the order (answer: LVTT/*, guess: LVT/*)', () => {
        // reverse of above test
        const answer = '찰흙'
        const wordle = initWordle(nGuesses, answer)

        // trailing consonant 'ㄱ' in the guess should be correct
        // even if it is the first and only trialing consonant in '각'
        const res1 = wordle.submitGuess(toWord('생각'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([ABSENT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([PRESENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([CORRECT])
      })
    })

    describe('check JamoResult when a Jamo appears twice in the answer', () => {
      // Consonant 'ㄱ' appears twice in the answer
      const answer = '공간'
      const wordle = initWordle(nGuesses, answer)

      test('the duplicated Jamo appears once in guess, in correct position', () => {
        const res1 = wordle.submitGuess(toWord('기차'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([CORRECT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([])
      })

      test('the duplicated Jamo appears twice in guess, both in correct position', () => {
        const res1 = wordle.submitGuess(toWord('고기'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[0].vowels).toStrictEqual([CORRECT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([])
      })

      test('the duplicated Jamo appears twice in guess, only one in correct position', () => {
        const res1 = wordle.submitGuess(toWord('국밥'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([PRESENT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([CORRECT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([ABSENT])
      })

      test('the duplicated Jamo appears twice in guess, both in wrong position', () => {
        const res1 = wordle.submitGuess(toWord('학칙'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([PRESENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([PRESENT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([PRESENT])
      })

      test('the duplicated Jamo appears three times in guess, two in correct position', () => {
        const res1 = wordle.submitGuess(toWord('간격'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[0].vowels).toStrictEqual([PRESENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([PRESENT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        // JamoResult for remaining 'ㄱ' should be 'absent'
        expect(res1.result[1].trailingConsonants).toStrictEqual([ABSENT])
      })

      test('the duplicated Jamo appears three times in guess, only one in correct position', () => {
        const res1 = wordle.submitGuess(toWord('직각'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        // JamoResult for first non-correct 'ㄱ' should be 'present'
        expect(res1.result[0].trailingConsonants).toStrictEqual([PRESENT])
        expect(res1.result[1].exact).toBeFalsy()
        // Leading consonant 'ㄱ' is in correct position
        expect(res1.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[1].vowels).toStrictEqual([CORRECT])
        // JamoResult for remaining 'ㄱ' should be 'absent'
        expect(res1.result[1].trailingConsonants).toStrictEqual([ABSENT])
      })
    })

    describe('check SyllableResult.exact', () => {
      test('equal syllable', () => {
        const answer = '봉화'
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord('수화'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([])
        expect(res1.result[1].exact).toBeTruthy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[1].vowels).toStrictEqual([CORRECT, CORRECT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([])
      })

      test('non-equal syllable, while all JamoResult of the syllable are correct (answer: LVVT/*, guess: LVT/*)', () => {
        const answer = '완두'
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord('온수'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[0].vowels).toStrictEqual([CORRECT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([CORRECT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([CORRECT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([])

        const res2 = wordle.submitGuess(toWord('안녕'))
        expect(res2.result).toHaveLength(2)
        expect(res2.result[0].exact).toBeFalsy()
        expect(res2.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res2.result[0].vowels).toStrictEqual([CORRECT])
        expect(res2.result[0].trailingConsonants).toStrictEqual([CORRECT])
        expect(res2.result[1].exact).toBeFalsy()
        expect(res2.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res2.result[1].vowels).toStrictEqual([ABSENT])
        expect(res2.result[1].trailingConsonants).toStrictEqual([ABSENT])
      })

      test('non-equal syllable, while all JamoResult of the syllable are correct (answer: */LVTT, guess: */LVT)', () => {
        const answer = '암탉'
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord('이탈'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[0].vowels).toStrictEqual([ABSENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[1].vowels).toStrictEqual([CORRECT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([CORRECT])

        const res2 = wordle.submitGuess(toWord('부탁'))
        expect(res2.result).toHaveLength(2)
        expect(res2.result[0].exact).toBeFalsy()
        expect(res2.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res2.result[0].vowels).toStrictEqual([ABSENT])
        expect(res2.result[0].trailingConsonants).toStrictEqual([])
        expect(res2.result[1].exact).toBeFalsy()
        expect(res2.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res2.result[1].vowels).toStrictEqual([CORRECT])
        expect(res2.result[1].trailingConsonants).toStrictEqual([CORRECT])
      })
    })

    describe('should throw if the guess is invalid', () => {
      const answer = '정답'
      const wordle = initWordle(nGuesses, answer)

      test('guess is shorter than the answer', () => {
        const shortGuess = toWord('강')
        expect(() => wordle.submitGuess(shortGuess)).toThrowError()
      })

      test('guess is longer than the answer', () => {
        const longGuess = toWord('다람쥐')
        expect(() => wordle.submitGuess(longGuess).result).toThrowError()
      })
    })
  })

  describe('wordle game play and status checks', () => {
    describe('nGuesses: 4, answer: "정답"', () => {
      const nGuesses = 4
      const answer = '정답'

      test('win at first guess', () => {
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord('정답'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeTruthy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[0].vowels).toStrictEqual([CORRECT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([CORRECT])
        expect(res1.result[1].exact).toBeTruthy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[1].vowels).toStrictEqual([CORRECT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([CORRECT])
        expect(wordle.guessResults).toStrictEqual([res1])
        expect(wordle.status).toStrictEqual(WIN)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1],
          status: WIN,
        })
      })

      test('win at second guess', () => {
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord('정확'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeTruthy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res1.result[0].vowels).toStrictEqual([CORRECT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([CORRECT])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT, CORRECT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([ABSENT])
        expect(wordle.guessResults).toStrictEqual([res1])
        expect(wordle.status).toStrictEqual(PLAYING)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1],
          status: PLAYING,
        })

        const res2 = wordle.submitGuess(toWord('정답'))
        expect(res2.result).toHaveLength(2)
        expect(res2.result[0].exact).toBeTruthy()
        expect(res2.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res2.result[0].vowels).toStrictEqual([CORRECT])
        expect(res2.result[0].trailingConsonants).toStrictEqual([CORRECT])
        expect(res2.result[1].exact).toBeTruthy()
        expect(res2.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res2.result[1].vowels).toStrictEqual([CORRECT])
        expect(res2.result[1].trailingConsonants).toStrictEqual([CORRECT])
        expect(wordle.guessResults).toStrictEqual([res1, res2])
        expect(wordle.status).toStrictEqual(WIN)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1, res2],
          status: WIN,
        })
      })

      test('win at last guess', () => {
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord('하늘'))
        expect(res1.result).toHaveLength(2)
        expect(res1.result[0].exact).toBeFalsy()
        expect(res1.result[0].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[0].vowels).toStrictEqual([PRESENT])
        expect(res1.result[0].trailingConsonants).toStrictEqual([])
        expect(res1.result[1].exact).toBeFalsy()
        expect(res1.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res1.result[1].vowels).toStrictEqual([ABSENT])
        expect(res1.result[1].trailingConsonants).toStrictEqual([ABSENT])
        expect(wordle.guessResults).toStrictEqual([res1])
        expect(wordle.status).toStrictEqual(PLAYING)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1],
          status: PLAYING,
        })

        const res2 = wordle.submitGuess(toWord('바람'))
        expect(res2.result).toHaveLength(2)
        expect(res2.result[0].exact).toBeFalsy()
        expect(res2.result[0].leadingConsonant).toStrictEqual(PRESENT)
        expect(res2.result[0].vowels).toStrictEqual([ABSENT])
        expect(res2.result[0].trailingConsonants).toStrictEqual([])
        expect(res2.result[1].exact).toBeFalsy()
        expect(res2.result[1].leadingConsonant).toStrictEqual(ABSENT)
        expect(res2.result[1].vowels).toStrictEqual([CORRECT])
        expect(res2.result[1].trailingConsonants).toStrictEqual([ABSENT])
        expect(wordle.guessResults).toStrictEqual([res1, res2])
        expect(wordle.status).toStrictEqual(PLAYING)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1, res2],
          status: PLAYING,
        })

        const res3 = wordle.submitGuess(toWord('바다'))
        expect(res3.result).toHaveLength(2)
        expect(res3.result[0].exact).toBeFalsy()
        expect(res3.result[0].leadingConsonant).toStrictEqual(PRESENT)
        expect(res3.result[0].vowels).toStrictEqual([ABSENT])
        expect(res3.result[0].trailingConsonants).toStrictEqual([])
        expect(res3.result[1].exact).toBeFalsy()
        expect(res3.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res3.result[1].vowels).toStrictEqual([CORRECT])
        expect(res3.result[1].trailingConsonants).toStrictEqual([])
        expect(wordle.guessResults).toStrictEqual([res1, res2, res3])
        expect(wordle.status).toStrictEqual(PLAYING)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1, res2, res3],
          status: PLAYING,
        })

        const res4 = wordle.submitGuess(toWord(answer))
        expect(res4.result).toHaveLength(2)
        expect(res4.result[0].exact).toBeTruthy()
        expect(res4.result[0].leadingConsonant).toStrictEqual(CORRECT)
        expect(res4.result[0].vowels).toStrictEqual([CORRECT])
        expect(res4.result[0].trailingConsonants).toStrictEqual([CORRECT])
        expect(res4.result[1].exact).toBeTruthy()
        expect(res4.result[1].leadingConsonant).toStrictEqual(CORRECT)
        expect(res4.result[1].vowels).toStrictEqual([CORRECT])
        expect(res4.result[1].trailingConsonants).toStrictEqual([CORRECT])
        expect(wordle.guessResults).toStrictEqual([res1, res2, res3, res4])
        expect(wordle.status).toStrictEqual(WIN)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1, res2, res3, res4],
          status: WIN,
        })
      })

      test('loss after last guess', () => {
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord('하늘'))
        const res2 = wordle.submitGuess(toWord('바람'))
        const res3 = wordle.submitGuess(toWord('바다'))
        const res4 = wordle.submitGuess(toWord('구름'))
        expect(wordle.guessResults).toStrictEqual([res1, res2, res3, res4])
        expect(wordle.status).toStrictEqual(LOSS)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1, res2, res3, res4],
          status: LOSS,
        })
      })

      test('submitting guess after a win should throw and cause no status change', () => {
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord(answer))
        expect(wordle.guessResults).toStrictEqual([res1])
        expect(wordle.status).toStrictEqual(WIN)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1],
          status: WIN,
        })

        expect(() => wordle.submitGuess(toWord(answer))).toThrowError()
        expect(wordle.guessResults).toStrictEqual([res1])
        expect(wordle.status).toStrictEqual(WIN)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1],
          status: WIN,
        })

        expect(() => wordle.submitGuess(toWord('언덕'))).toThrowError()
        expect(wordle.guessResults).toStrictEqual([res1])
        expect(wordle.status).toStrictEqual(WIN)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1],
          status: WIN,
        })
      })

      test('submitting guess after a loss should throw and cause no status change', () => {
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord('하늘'))
        const res2 = wordle.submitGuess(toWord('바람'))
        const res3 = wordle.submitGuess(toWord('바다'))
        const res4 = wordle.submitGuess(toWord('구름'))
        expect(wordle.guessResults).toStrictEqual([res1, res2, res3, res4])
        expect(wordle.status).toStrictEqual(LOSS)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1, res2, res3, res4],
          status: LOSS,
        })

        expect(() => wordle.submitGuess(toWord('언덕'))).toThrowError()
        expect(wordle.guessResults).toStrictEqual([res1, res2, res3, res4])
        expect(wordle.status).toStrictEqual(LOSS)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1, res2, res3, res4],
          status: LOSS,
        })

        expect(() => wordle.submitGuess(toWord(answer))).toThrowError()
        expect(wordle.guessResults).toStrictEqual([res1, res2, res3, res4])
        expect(wordle.status).toStrictEqual(LOSS)
        expect(wordle.data).toStrictEqual({
          guessResults: [res1, res2, res3, res4],
          status: LOSS,
        })
      })
    })
  })

  describe('invariants', () => {
    const nGuesses = 4
    const answer = '정답'

    describe('getters should return cloned data instead of references', () => {
      test('guessResults', () => {
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord('하늘'))
        const guessResults = wordle.guessResults
        expect(guessResults).toStrictEqual([res1])
        expect(guessResults).not.toBe(wordle.guessResults)
        guessResults.forEach((result, i) => {
          expect(result).not.toBe(wordle.guessResults[i])
        })

        wordle.submitGuess(toWord('바다'))
        expect(guessResults).not.toStrictEqual(wordle.guessResults)
      })

      test('data', () => {
        const wordle = initWordle(nGuesses, answer)

        const res1 = wordle.submitGuess(toWord('하늘'))
        const data = wordle.data
        expect(data).toStrictEqual({
          status: PLAYING,
          guessResults: [res1],
        })
        expect(data).not.toBe(wordle.data)
        expect(data.guessResults).not.toBe(wordle.guessResults)

        wordle.submitGuess(toWord('바다'))
        expect(data).not.toStrictEqual(wordle.data)
      })
    })
  })
})
