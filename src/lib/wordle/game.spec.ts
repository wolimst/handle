import { Game } from './game'
import type { GameData, GuessError, Status } from './types'
import * as WordsModule from './words'
import { toWord } from '@/lib/hangul'

// Mock structuredClone() because it is not implemented in jsdom
global.structuredClone = vi.fn(<T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
})

const PLAYING: Status = 'playing'
const WIN: Status = 'win'
const LOSS: Status = 'lose'

const ERR_STATUS: GuessError = 'invalidStatus'
const ERR_LENGTH: GuessError = 'wrongLength'
const ERR_SYLLABLE: GuessError = 'invalidSyllable'
const ERR_WORD: GuessError = 'unknownWord'

describe('tests for game class', () => {
  const answerLength = 2
  const answers = ['첫째', '둘째', '셋째', '넷째', '다섯', '여섯', '정답'].map(
    toWord
  )
  function initGame(nWordles: number, nGuesses: number): Game {
    const answerGetterMock = vi.spyOn(WordsModule, 'getRandomAnswer')
    answerGetterMock
      .mockReturnValueOnce(answers[0])
      .mockReturnValueOnce(answers[1])
      .mockReturnValueOnce(answers[2])
      .mockReturnValueOnce(answers[3])
      .mockReturnValueOnce(answers[4])
      .mockReturnValueOnce(answers[5])
      .mockReturnValue(answers[6])
    return new Game(nWordles, nGuesses, answerLength)
  }

  describe('observer methods that return constants', () => {
    const nWordles = 2
    const nGuesses = 4
    const game = initGame(nWordles, nGuesses)

    test('nWordles', () => {
      expect(game.nWordles).toStrictEqual(nWordles)
    })

    test('nGuesses', () => {
      expect(game.nGuesses).toStrictEqual(nGuesses)
    })

    test('answerLength', () => {
      expect(game.answerLength).toStrictEqual(answerLength)
    })
  })

  describe('game play and status checks', () => {
    describe('common status checks', () => {
      const nWordles = 1
      const nGuesses = 3

      test('initial status', () => {
        const game = initGame(nWordles, nGuesses)

        expect(game.remainingGuesses).toStrictEqual(nGuesses)
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.data).toStrictEqual<GameData>({
          nWordles: nWordles,
          nGuesses: nGuesses,
          answerLength: answerLength,
          status: PLAYING,
          guesses: [],
          wordleData: [
            {
              guessResults: [],
              keyHints: {},
              status: PLAYING,
            },
          ],
        })
      })

      test('keyboard value should be reset after submitting valid guess', () => {
        const game = initGame(nWordles, nGuesses)

        game.keyboard.value = '하늘'
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        expect(game.keyboard.value).toStrictEqual('')

        const guessError2 = game.submitGuess()
        expect(guessError2).toStrictEqual(ERR_LENGTH)
      })

      test('keyboard value should not be changed after submitting invalid guess', () => {
        const game = initGame(nWordles, nGuesses)

        game.keyboard.value = '짧'
        const guessError1 = game.submitGuess()
        expect(guessError1).toStrictEqual(ERR_LENGTH)
        expect(game.keyboard.value).toStrictEqual('짧')
      })
    })

    describe('nWordles = 1', () => {
      const nWordles = 1
      const nGuesses = 3

      test('win at first guess', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = ['첫째']

        game.keyboard.value = guesses[0]
        const guessError = game.submitGuess()
        expect(guessError).toBeUndefined()
        expect(game.remainingGuesses).toStrictEqual(nGuesses - 1)
        expect(game.status).toStrictEqual(WIN)
        expect(game.data.status).toStrictEqual(WIN)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 1).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(WIN)
      })

      test('win at second guess', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = ['추측', '첫째']

        game.keyboard.value = guesses[0]
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        expect(game.remainingGuesses).toStrictEqual(nGuesses - 1)
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.data.status).toStrictEqual(PLAYING)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 1).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(PLAYING)

        game.keyboard.value = guesses[1]
        const guessError2 = game.submitGuess()
        expect(guessError2).toBeUndefined()
        expect(game.remainingGuesses).toStrictEqual(nGuesses - 2)
        expect(game.status).toStrictEqual(WIN)
        expect(game.data.status).toStrictEqual(WIN)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 2).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(WIN)
      })

      test('win at last guess', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = ['추측', '추측', '첫째']

        game.keyboard.value = guesses[0]
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        expect(game.remainingGuesses).toStrictEqual(nGuesses - 1)
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.data.status).toStrictEqual(PLAYING)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 1).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(PLAYING)

        game.keyboard.value = guesses[1]
        const guessError2 = game.submitGuess()
        expect(guessError2).toBeUndefined()
        expect(game.remainingGuesses).toStrictEqual(nGuesses - 2)
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.data.status).toStrictEqual(PLAYING)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 2).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(PLAYING)

        game.keyboard.value = guesses[2]
        const guessError3 = game.submitGuess()
        expect(guessError3).toBeUndefined()
        expect(game.remainingGuesses).toStrictEqual(0)
        expect(game.status).toStrictEqual(WIN)
        expect(game.data.status).toStrictEqual(WIN)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 3).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(WIN)
      })

      test('loss at after last guess', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = ['추측', '추측', '추측']

        game.keyboard.value = guesses[0]
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()

        game.keyboard.value = guesses[1]
        const guessError2 = game.submitGuess()
        expect(guessError2).toBeUndefined()

        game.keyboard.value = guesses[2]
        const guessError3 = game.submitGuess()
        expect(guessError3).toBeUndefined()
        expect(game.remainingGuesses).toStrictEqual(0)
        expect(game.status).toStrictEqual(LOSS)
        expect(game.data.status).toStrictEqual(LOSS)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 3).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(LOSS)
      })

      test('submitting guess after a win should return error and cause no status change', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = ['첫째', '추측']

        game.keyboard.value = guesses[0]
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        expect(game.remainingGuesses).toStrictEqual(nGuesses - 1)
        expect(game.status).toStrictEqual(WIN)
        expect(game.data.status).toStrictEqual(WIN)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 1).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(WIN)
        const data = game.data

        game.keyboard.value = guesses[1]
        const guessError2 = game.submitGuess()
        expect(guessError2).toStrictEqual(ERR_STATUS)
        expect(game.remainingGuesses).toStrictEqual(nGuesses - 1)
        expect(game.status).toStrictEqual(WIN)
        expect(game.data).toStrictEqual(data)
      })

      test('submitting guess after a loss should return error and cause no status change', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = ['추측', '추측', '추측', '첫째']

        game.keyboard.value = guesses[0]
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()

        game.keyboard.value = guesses[1]
        const guessError2 = game.submitGuess()
        expect(guessError2).toBeUndefined()

        game.keyboard.value = guesses[2]
        const guessError3 = game.submitGuess()
        expect(guessError3).toBeUndefined()
        expect(game.remainingGuesses).toStrictEqual(0)
        expect(game.status).toStrictEqual(LOSS)
        expect(game.data.status).toStrictEqual(LOSS)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 3).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(LOSS)
        const data = game.data

        game.keyboard.value = guesses[3]
        const guessError4 = game.submitGuess()
        expect(guessError4).toStrictEqual(ERR_STATUS)
        expect(game.remainingGuesses).toStrictEqual(0)
        expect(game.status).toStrictEqual(LOSS)
        expect(game.data).toStrictEqual(data)
      })

      test('submitting invalid guess should return error cause no status change', () => {
        const game = initGame(nWordles, nGuesses)
        const validGuesses = ['추측', '추측', '추측']
        const invalidGuesses = ['', '짧', '없닭', '없닭']
        const guesses = [
          validGuesses[0],
          invalidGuesses[0],
          validGuesses[1],
          invalidGuesses[1],
          invalidGuesses[2],
          validGuesses[2],
          invalidGuesses[3],
        ]

        game.keyboard.value = guesses[0] // 1st valid guess
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        const dataAfterGuess1 = game.data

        game.keyboard.value = guesses[1] // 1st invalid guess
        const guessError2 = game.submitGuess()
        expect(guessError2).toStrictEqual(ERR_LENGTH)
        expect(game.remainingGuesses).toStrictEqual(nGuesses - 1)
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.data).toStrictEqual(dataAfterGuess1)

        game.keyboard.value = guesses[2] // 2nd valid guess
        const guessError3 = game.submitGuess()
        expect(guessError3).toBeUndefined()
        const dataAfterGuess3 = game.data

        game.keyboard.value = guesses[3] // 2nd invalid guess
        const guessError4 = game.submitGuess()
        expect(guessError4).toStrictEqual(ERR_LENGTH)
        expect(game.remainingGuesses).toStrictEqual(nGuesses - 2)
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.data).toStrictEqual(dataAfterGuess3)

        game.keyboard.value = guesses[4] // 3rd invalid guess
        const guessError5 = game.submitGuess()
        expect(guessError5).toStrictEqual(ERR_WORD)
        expect(game.remainingGuesses).toStrictEqual(nGuesses - 2)
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.data).toStrictEqual(dataAfterGuess3)

        game.keyboard.value = guesses[5] // 3rd valid guess, game result is loss
        const guessError6 = game.submitGuess()
        expect(guessError6).toBeUndefined()
        const dataAfterGuess6 = game.data

        game.keyboard.value = guesses[6] // 4rd invalid guess after loss
        const guessError7 = game.submitGuess()
        expect(guessError7).toMatch(new RegExp(`(${ERR_STATUS}|${ERR_WORD})`))
        expect(game.remainingGuesses).toStrictEqual(0)
        expect(game.status).toStrictEqual(LOSS)
        expect(game.data).toStrictEqual(dataAfterGuess6)
      })
    })

    describe.todo('nWordles = 2')
  })
})
