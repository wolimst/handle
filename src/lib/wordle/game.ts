import { Keyboard } from './keyboard'
import type { GameData, GameMode, GuessError, Status } from './types'
import { _Wordle } from './wordle'
import { getRandomAnswer, isInWordList } from './words'
import { GAME_MODES } from '@/constants'
import type * as Hangul from '@/lib/hangul'
import * as Path from '@/lib/path'
import { time } from '@/lib/utils'
import { savedata, statistics } from '@/stores/wordle'

export class GameConfig {
  readonly #mode: GameMode
  readonly #nWordles: number
  readonly #answerLength: number
  readonly #nGuesses: number
  readonly #useSave: boolean
  readonly #useStatistics: boolean

  constructor(
    mode: GameMode,
    nWordles: number,
    answerLength: number,
    nGuesses: number
  ) {
    this.#mode = mode
    this.#nWordles = nWordles
    this.#answerLength = answerLength
    this.#nGuesses = nGuesses
    this.#useSave =
      GAME_MODES.find((gameMode) => gameMode.id === mode)?.useSave || false
    this.#useStatistics =
      GAME_MODES.find((gameMode) => gameMode.id === mode)?.useStatistics ||
      false
  }

  get mode(): GameMode {
    return this.#mode
  }

  get nWordles(): number {
    return this.#nWordles
  }

  get answerLength(): number {
    return this.#answerLength
  }

  get nGuesses(): number {
    return this.#nGuesses
  }

  get useSave(): boolean {
    return this.#useSave
  }

  get useStatistics(): boolean {
    return this.#useStatistics
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
  constructor(config: GameConfig, answers?: readonly Hangul.Word[]) {
    this.#id = generateGameId(config.mode, config.nWordles, config.answerLength)
    this.#config = config

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
      data?.guesses.forEach((guess) => this.#doSubmit(guess))
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
      mode: this.#config.mode,
      nWordles: this.#config.nWordles,
      nGuesses: this.#config.nGuesses,
      answerLength: this.#config.answerLength,
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

    if (!isInWordList(guess.value)) {
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

export function generateGameId(
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
      // TODO
      throw new Error('not implemented')
    default: {
      const _exhaustiveCheck: never = mode
      return _exhaustiveCheck
    }
  }
}
