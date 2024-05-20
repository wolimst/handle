import { Game, GameConfig, generateConfigId, getGameTypeString } from './game'
import type { GameData, GameMode, GuessError, Status } from './types'
import { GAME_MODES } from '@/constants'
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
const ERR_WORD: GuessError = 'notInWordList'
const ERR_UNDRAWABLE: GuessError = 'undrawableSyllable'

describe('tests for GameConfig class', () => {
  const nWordles = 1
  const answerLength = 2
  const nGuesses = 3

  test('game mode: daily', () => {
    const mode: GameMode = 'daily'
    const gameConfig = GameConfig.getGameConfig(
      mode,
      nWordles,
      answerLength,
      nGuesses
    )
    expect(gameConfig.id).toBeTruthy()
    expect(gameConfig.author).toBeTruthy()
    expect(gameConfig.mode).toStrictEqual(mode)
    expect(gameConfig.nWordles).toStrictEqual(nWordles)
    expect(gameConfig.answerLength).toStrictEqual(answerLength)
    expect(gameConfig.nGuesses).toStrictEqual(nGuesses)
    expect(gameConfig.useSave).toBeTruthy()
    expect(gameConfig.useStatistics).toBeTruthy()
  })

  test('game mode: free', () => {
    const mode: GameMode = 'free'
    const gameConfig = GameConfig.getGameConfig(
      mode,
      nWordles,
      answerLength,
      nGuesses
    )
    expect(gameConfig.id).toBeTruthy()
    expect(gameConfig.author).toBeTruthy()
    expect(gameConfig.mode).toStrictEqual(mode)
    expect(gameConfig.nWordles).toStrictEqual(nWordles)
    expect(gameConfig.answerLength).toStrictEqual(answerLength)
    expect(gameConfig.nGuesses).toStrictEqual(nGuesses)
    expect(gameConfig.useSave).toBeFalsy()
    expect(gameConfig.useStatistics).toBeTruthy()
  })

  test('game mode: custom', () => {
    const id = 'id'
    const author = 'author'
    const mode: GameMode = 'custom'
    for (const useWordList of [true, false]) {
      for (const useSave of [true, false]) {
        const gameConfig = GameConfig.getCustomGameConfig(
          id,
          author,
          nWordles,
          answerLength,
          nGuesses,
          useWordList,
          useSave
        )
        expect(gameConfig.id).toStrictEqual(id)
        expect(gameConfig.author).toStrictEqual(author)
        expect(gameConfig.mode).toStrictEqual(mode)
        expect(gameConfig.nWordles).toStrictEqual(nWordles)
        expect(gameConfig.answerLength).toStrictEqual(answerLength)
        expect(gameConfig.nGuesses).toStrictEqual(nGuesses)
        expect(gameConfig.useWordList).toStrictEqual(useWordList)
        expect(gameConfig.useSave).toStrictEqual(useSave)
        expect(gameConfig.useStatistics).toBeFalsy()
      }
    }
  })
})

describe('tests for Game class', () => {
  const answerLength = 2
  const gameMode: GameMode = 'free'

  const ANSWER1 = '첫째'
  const ANSWER2 = '둘째'
  const ANSWER3 = '셋째'
  const ANSWER4 = '넷째'
  const ANSWER5 = '다섯'
  const ANSWER6 = '여섯'
  const ANSWER7_OR_HIGHER = '정답'

  function initGame(
    nWordles: number,
    nGuesses: number,
    useWordList = true
  ): Game {
    const config = GameConfig.getGameConfig(
      gameMode,
      nWordles,
      answerLength,
      nGuesses,
      useWordList
    )
    // Mock some getters in config to disable local storage usage
    vi.spyOn(config, 'useSave', 'get').mockReturnValue(false)
    vi.spyOn(config, 'useStatistics', 'get').mockReturnValue(false)

    const answers = [ANSWER1, ANSWER2, ANSWER3, ANSWER4, ANSWER5, ANSWER6]
      .concat(Array(config.nWordles).fill(ANSWER7_OR_HIGHER))
      .slice(0, config.nWordles)
      .map(toWord)
    return new Game(config, 'id', answers)
  }

  describe('game play and status checks using word list', () => {
    describe('common status checks', () => {
      const nWordles = 1
      const nGuesses = 3

      test('initial status', () => {
        const game = initGame(nWordles, nGuesses)

        expect(game.status).toStrictEqual(PLAYING)
        expect(game.answers).toBeUndefined()
        expect(game.data).toStrictEqual<GameData>({
          id: game.data.id,
          config: game.data.config,
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

        game.keyboard.setValue('하늘')
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        expect(game.keyboard.value).toStrictEqual('')

        const guessError2 = game.submitGuess()
        expect(guessError2).toStrictEqual(ERR_LENGTH)
      })

      test('keyboard value should not be changed after submitting invalid guess', () => {
        const game = initGame(nWordles, nGuesses)

        game.keyboard.setValue('짧')
        const guessError1 = game.submitGuess()
        expect(guessError1).toStrictEqual(ERR_LENGTH)
        expect(game.keyboard.value).toStrictEqual('짧')
      })

      test('constructor should throw an error if the answers are not valid', () => {
        const config = GameConfig.getGameConfig(
          gameMode,
          nWordles,
          answerLength,
          nGuesses
        )
        expect(() => {
          new Game(config, 'id', [ANSWER1, ANSWER2].map(toWord))
        }).toThrowError()
        expect(() => {
          new Game(config, 'id', ['짧'].map(toWord))
        }).toThrowError()
      })
    })

    describe('nWordles = 1', () => {
      const nWordles = 1
      const nGuesses = 3

      test('win at first guess', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = [ANSWER1]

        game.keyboard.setValue(guesses[0])
        const guessError = game.submitGuess()
        expect(guessError).toBeUndefined()
        expect(game.status).toStrictEqual(WIN)
        expect(game.answers).toStrictEqual([ANSWER1])
        expect(game.data.status).toStrictEqual(WIN)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 1).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(WIN)
      })

      test('win at second guess', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = ['추측', ANSWER1]

        game.keyboard.setValue(guesses[0])
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.answers).toBeUndefined()
        expect(game.data.status).toStrictEqual(PLAYING)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 1).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(PLAYING)

        game.keyboard.setValue(guesses[1])
        const guessError2 = game.submitGuess()
        expect(guessError2).toBeUndefined()
        expect(game.status).toStrictEqual(WIN)
        expect(game.answers).toStrictEqual([ANSWER1])
        expect(game.data.status).toStrictEqual(WIN)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 2).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(WIN)
      })

      test('win at last guess', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = ['추측', '추측', ANSWER1]

        game.keyboard.setValue(guesses[0])
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.answers).toBeUndefined()
        expect(game.data.status).toStrictEqual(PLAYING)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 1).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(PLAYING)

        game.keyboard.setValue(guesses[1])
        const guessError2 = game.submitGuess()
        expect(guessError2).toBeUndefined()
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.answers).toBeUndefined()
        expect(game.data.status).toStrictEqual(PLAYING)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 2).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(PLAYING)

        game.keyboard.setValue(guesses[2])
        const guessError3 = game.submitGuess()
        expect(guessError3).toBeUndefined()
        expect(game.status).toStrictEqual(WIN)
        expect(game.answers).toStrictEqual([ANSWER1])
        expect(game.data.status).toStrictEqual(WIN)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 3).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(WIN)
      })

      test('loss at after last guess', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = ['추측', '추측', '추측']

        game.keyboard.setValue(guesses[0])
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()

        game.keyboard.setValue(guesses[1])
        const guessError2 = game.submitGuess()
        expect(guessError2).toBeUndefined()

        game.keyboard.setValue(guesses[2])
        const guessError3 = game.submitGuess()
        expect(guessError3).toBeUndefined()
        expect(game.status).toStrictEqual(LOSS)
        expect(game.answers).toStrictEqual([ANSWER1])
        expect(game.data.status).toStrictEqual(LOSS)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 3).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(LOSS)
      })

      test('submitting guess after a win should return error and cause no status change', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = ['첫째', '추측']

        game.keyboard.setValue(guesses[0])
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        expect(game.status).toStrictEqual(WIN)
        expect(game.answers).toStrictEqual([ANSWER1])
        expect(game.data.status).toStrictEqual(WIN)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 1).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(WIN)
        const data = game.data

        game.keyboard.setValue(guesses[1])
        const guessError2 = game.submitGuess()
        expect(guessError2).toStrictEqual(ERR_STATUS)
        expect(game.status).toStrictEqual(WIN)
        expect(game.answers).toStrictEqual([ANSWER1])
        expect(game.data).toStrictEqual(data)
      })

      test('submitting guess after a loss should return error and cause no status change', () => {
        const game = initGame(nWordles, nGuesses)
        const guesses = ['추측', '추측', '추측', ANSWER1]

        game.keyboard.setValue(guesses[0])
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()

        game.keyboard.setValue(guesses[1])
        const guessError2 = game.submitGuess()
        expect(guessError2).toBeUndefined()

        game.keyboard.setValue(guesses[2])
        const guessError3 = game.submitGuess()
        expect(guessError3).toBeUndefined()
        expect(game.status).toStrictEqual(LOSS)
        expect(game.answers).toStrictEqual([ANSWER1])
        expect(game.data.status).toStrictEqual(LOSS)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 3).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(LOSS)
        const data = game.data

        game.keyboard.setValue(guesses[3])
        const guessError4 = game.submitGuess()
        expect(guessError4).toStrictEqual(ERR_STATUS)
        expect(game.status).toStrictEqual(LOSS)
        expect(game.answers).toStrictEqual([ANSWER1])
        expect(game.data).toStrictEqual(data)
      })

      test('submitting invalid guess should return error and cause no status change', () => {
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

        game.keyboard.setValue(guesses[0]) // 1st valid guess
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        const dataAfterGuess1 = game.data

        game.keyboard.setValue(guesses[1]) // 1st invalid guess
        const guessError2 = game.submitGuess()
        expect(guessError2).toStrictEqual(ERR_LENGTH)
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.answers).toBeUndefined()
        expect(game.data).toStrictEqual(dataAfterGuess1)

        game.keyboard.setValue(guesses[2]) // 2nd valid guess
        const guessError3 = game.submitGuess()
        expect(guessError3).toBeUndefined()
        const dataAfterGuess3 = game.data

        game.keyboard.setValue(guesses[3]) // 2nd invalid guess
        const guessError4 = game.submitGuess()
        expect(guessError4).toStrictEqual(ERR_LENGTH)
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.answers).toBeUndefined()
        expect(game.data).toStrictEqual(dataAfterGuess3)

        game.keyboard.setValue(guesses[4]) // 3rd invalid guess
        const guessError5 = game.submitGuess()
        expect(guessError5).toStrictEqual(ERR_WORD)
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.answers).toBeUndefined()
        expect(game.data).toStrictEqual(dataAfterGuess3)

        game.keyboard.setValue(guesses[5]) // 3rd valid guess, game result is loss
        const guessError6 = game.submitGuess()
        expect(guessError6).toBeUndefined()
        const dataAfterGuess6 = game.data

        game.keyboard.setValue(guesses[6]) // 4rd invalid guess after loss
        const guessError7 = game.submitGuess()
        expect(guessError7).toMatch(new RegExp(`(${ERR_STATUS}|${ERR_WORD})`))
        expect(game.status).toStrictEqual(LOSS)
        expect(game.answers).toStrictEqual([ANSWER1])
        expect(game.data).toStrictEqual(dataAfterGuess6)
      })
    })

    describe.todo('nWordles >= 2')
  })

  describe('game play and status checks without using word list', () => {
    describe('nWordles = 1', () => {
      const nWordles = 1
      const nGuesses = 3
      const useWordList = false

      test('submitting guess that is not in the word list should be accepted', () => {
        const game = initGame(nWordles, nGuesses, useWordList)
        const guesses = ['없닭']

        game.keyboard.setValue(guesses[0])
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        expect(game.status).toStrictEqual(PLAYING)
        expect(game.answers).toBeUndefined()
        expect(game.data.status).toStrictEqual(PLAYING)
        expect(game.data.guesses).toStrictEqual(guesses.slice(0, 1).map(toWord))
        expect(game.data.wordleData[0].status).toStrictEqual(PLAYING)
      })

      test('submitting guess that contains undrawable syllable should return error and cause no status change', () => {
        const game = initGame(nWordles, nGuesses, useWordList)
        const validGuesses = ['없닭']
        const invalidGuesses = [
          '가쓚',
          '졀가',
          '졁졂',
          '졃졄',
          '졅졆',
          '졇졏',
          '졑졓',
        ]

        game.keyboard.setValue(validGuesses[0])
        const guessError1 = game.submitGuess()
        expect(guessError1).toBeUndefined()
        const dataAfterGuess1 = game.data

        for (const invalidGuess of invalidGuesses) {
          game.keyboard.setValue(invalidGuess)
          const guessError = game.submitGuess()
          expect(guessError).toStrictEqual(ERR_UNDRAWABLE)
          expect(game.status).toStrictEqual(PLAYING)
          expect(game.answers).toBeUndefined()
          expect(game.data).toStrictEqual(dataAfterGuess1)
        }
      })
    })
  })
})

describe('tests for getGameTypeString()', () => {
  const nWordles = 1
  const answerLength = 2
  it('should return an unique string for each game modes', () => {
    const gameTypes = GAME_MODES.map((mode) => mode.id).map((mode) =>
      getGameTypeString(mode, nWordles, answerLength)
    )
    expect(gameTypes).toHaveLength(new Set(gameTypes).size)
  })
})

describe('tests for generateConfigId()', () => {
  const nWordles = 1
  const answerLength = 2

  describe('game mode: daily', () => {
    afterAll(() => {
      vi.useRealTimers()
    })

    it('should return same ids when the date is not changed', () => {
      vi.useFakeTimers().setSystemTime(new Date().setUTCHours(0))
      const id1 = generateConfigId('daily', nWordles, answerLength)
      const id2 = generateConfigId('daily', nWordles, answerLength)
      expect(id1).toStrictEqual(id2)
    })

    it('should return different ids if the date is changed', () => {
      vi.useFakeTimers().setSystemTime(new Date().setUTCHours(0))
      const id1 = generateConfigId('daily', nWordles, answerLength)
      vi.useFakeTimers().setSystemTime(new Date().setUTCHours(24))
      const id2 = generateConfigId('daily', nWordles, answerLength)
      expect(id1).not.toStrictEqual(id2)
    })
  })

  describe('game mode: free', () => {
    it('should return different ids for each calls', () => {
      const id1 = generateConfigId('free', nWordles, answerLength)
      const id2 = generateConfigId('free', nWordles, answerLength)
      expect(id1).not.toStrictEqual(id2)
    })
  })

  describe.todo('game mode: custom')
})
