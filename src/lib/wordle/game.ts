import { Keyboard } from './keyboard'
import type {
  GameData,
  GameMode,
  GameSaveData,
  GuessError,
  Status,
} from './types'
import { _Wordle } from './wordle'
import { getRandomAnswer, isInWordList } from './words'
import { DAILY_BONUS_GUESS_COUNTS, GAME_MODES } from '@/constants'
import * as Hangul from '@/lib/hangul'
import * as Path from '@/lib/path'
import { time } from '@/lib/utils'
import { savedata, statistics } from '@/stores/wordle'

export class GameConfig {
  readonly id: string
  readonly author: string
  readonly mode: GameMode
  readonly nWordles: number
  readonly answerLength: number
  readonly nGuesses: number
  readonly useWordList: boolean
  readonly useSave: boolean
  readonly useStatistics: boolean

  private constructor(
    id: string,
    author: string,
    mode: GameMode,
    nWordles: number,
    answerLength: number,
    nGuesses: number,
    useWordList: boolean
  ) {
    this.id = id
    this.author = author
    this.mode = mode
    this.nWordles = nWordles
    this.answerLength = answerLength
    this.nGuesses = nGuesses
    this.useWordList = useWordList
    this.useSave =
      GAME_MODES.find((gameMode) => gameMode.id === mode)?.useSave || false
    this.useStatistics =
      GAME_MODES.find((gameMode) => gameMode.id === mode)?.useStatistics ||
      false
  }

  static getGameConfig(
    mode: GameMode,
    nWordles: number,
    answerLength: number,
    nGuesses: number,
    useWordList = true
  ): GameConfig {
    const id = generateConfigId(mode, nWordles, answerLength)
    const author = '한들'
    return new GameConfig(
      id,
      author,
      mode,
      nWordles,
      answerLength,
      nGuesses,
      useWordList
    )
  }

  static getCustomGameConfig(
    id: string,
    author: string,
    nWordles: number,
    answerLength: number,
    nGuesses: number,
    useWordList: boolean
  ): GameConfig {
    const mode: GameMode = 'custom'
    return new GameConfig(
      id,
      author,
      mode,
      nWordles,
      answerLength,
      nGuesses,
      useWordList
    )
  }
}

export class Game {
  readonly #id: string
  readonly #config: GameConfig
  readonly #wordles: readonly _Wordle[]
  readonly #keyboard: Keyboard

  readonly #guesses: Hangul.Word[]

  /**
   * Initialize a game that can contain multiple wordles
   *
   * @param config game configuration
   * @param answers answers of the wordles, if not provided, answers will be randomly selected from the answer list
   * @throws an error if some answers are not valid
   */
  constructor(
    config: GameConfig,
    id: string,
    answers?: readonly Hangul.Word[]
  ) {
    this.#config = config
    this.#id = id

    if (answers) {
      if (answers.length !== config.nWordles) {
        throw new Error(
          'the number of answers are not equal to the number of wordles'
        )
      }

      if (answers.some((answer) => answer.length !== config.answerLength)) {
        throw new Error('answer lengths are not consistent')
      }
    }

    this.#wordles = Array(config.nWordles)
      .fill(0)
      .map((_, i) => {
        const answer =
          answers?.[i] ||
          getRandomAnswer(config.answerLength, `${this.#id}-${i}`)
        return new _Wordle(config.nGuesses, answer)
      })
    this.#keyboard = new Keyboard(config.answerLength)
    this.#guesses = []

    if (config.useSave) {
      const data = savedata.load(this.#id)
      if (data) {
        data.guesses.forEach((guess) => {
          const word = Hangul.toWord(guess.value)
          this.#doSubmit(word)
        })
      } else {
        savedata.save(this.data)
      }
    }
  }

  get keyboard(): Keyboard {
    return this.#keyboard
  }

  get status(): Status {
    const statuses = this.#wordles.map((game) => game.status)
    if (statuses.every((s) => s === 'win')) {
      return 'win'
    } else if (statuses.some((s) => s === 'lose')) {
      return 'lose'
    } else {
      return 'playing'
    }
  }

  /**
   * Return the answers of the wordles if all games are finished, otherwise undefined
   */
  get answers(): readonly string[] | undefined {
    if (this.status === 'playing') {
      return undefined
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.#wordles.map((wordle) => wordle.answer!)
  }

  get data(): GameData {
    return {
      id: this.#id,
      config: this.#config,
      status: this.status,
      guesses: structuredClone(this.#guesses),
      wordleData: this.#wordles.map((wordle) => wordle.data),
    }
  }

  /**
   * Submit the guess that exists in keyboard object, compare the guess against
   * each wordle's answer, update the game status accordingly.
   *
   * If a `GuessError` is returned, the game status is not changed.
   *
   * @returns `undefined` if the submit is successful, otherwise a `GuessError`
   * @see {@link GuessError}
   */
  submitGuess(): GuessError | undefined {
    if (this.status !== 'playing') {
      return 'invalidStatus'
    }

    const guess = this.#keyboard.guess

    if (guess.length !== this.#config.answerLength) {
      return 'wrongLength'
    }

    if (this.#config.useWordList && !isInWordList(guess.value)) {
      return 'notInWordList'
    }

    if (Path.getUndrawableSyllablesInWord(guess) !== '') {
      return 'undrawableSyllable'
    }

    this.#doSubmit(guess)

    this.#keyboard.setValue('')

    if (this.#config.useSave) {
      savedata.save(this.data)
    }

    if (this.status !== 'playing' && this.#config.useStatistics) {
      statistics.update(this.data)
    }

    return undefined
  }

  #doSubmit(guess: Hangul.Word) {
    this.#guesses.push(guess)
    this.#wordles
      .filter((wordle) => wordle.status === 'playing')
      .forEach((wordle) => wordle.submitGuess(guess))
  }
}

export function getGameTypeString(
  mode: GameMode,
  nWordles: number,
  answerLength: number
): string {
  return `${mode.charAt(0)}-${nWordles}-${answerLength}`
}

export function generateConfigId(
  mode: GameMode,
  nWordles: number,
  answerLength: number
): string {
  const gameType = getGameTypeString(mode, nWordles, answerLength)

  switch (mode) {
    case 'daily': {
      const date = time.getShortDateStringInKST()
      return `${gameType}-${date}`
    }
    case 'free': {
      const n = Math.floor(Math.random() * 2 ** 32)
      return `${gameType}-${n}`
    }
    case 'custom':
      throw new Error('should not be reached')
    default: {
      const _exhaustiveCheck: never = mode
      return _exhaustiveCheck
    }
  }
}

export function getGameId(config: GameConfig): string {
  switch (config.mode) {
    case 'daily': {
      return getDailyGameId(config)
    }
    case 'free': {
      return config.id
    }
    case 'custom':
      return config.id
    default: {
      const _exhaustiveCheck: never = config.mode
      return _exhaustiveCheck
    }
  }
}

function getDailyGameId(config: GameConfig): string {
  if (config.mode !== 'daily') {
    return config.id
  }

  const dailyGames = savedata.loadByConfigId(config.id)
  const latestGame = dailyGames.at(-1)
  if (!latestGame) {
    return `${config.id}-000`
  }

  if (isDailyBonusAvailable(latestGame)) {
    const index = String(dailyGames.length).padStart(3, '0')
    return `${config.id}-${index}`
  } else {
    return latestGame.id
  }
}

export function isDailyBonusAvailable(latestGame: GameData | GameSaveData) {
  return (
    latestGame.config.mode === 'daily' &&
    latestGame.status === 'win' &&
    latestGame.guesses.length <=
      DAILY_BONUS_GUESS_COUNTS[latestGame.config.nWordles][
        latestGame.config.answerLength
      ]
  )
}
