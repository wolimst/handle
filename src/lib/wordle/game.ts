import { Keyboard } from './keyboard'
import type { GameData, GameMode, GuessError, Status } from './types'
import { _Wordle } from './wordle'
import { isInWordList } from './words'
import { GAME_MODES } from '@/constants'
import type * as Hangul from '@/lib/hangul'
import * as Path from '@/lib/path'
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
   */
  constructor(config: GameConfig) {
    this.#id = generateGameId(config)
    this.#config = config

    this.#wordles = Array(config.nWordles)
      .fill(0)
      .map(
        (_, i) =>
          new _Wordle(config.answerLength, config.nGuesses, `${this.#id}-${i}`)
      )
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

function generateGameId(config: GameConfig): string {
  const gameType = getGameTypeString(
    config.mode,
    config.nWordles,
    config.answerLength
  )

  switch (config.mode) {
    case 'daily': {
      const date = new Date()
        .toLocaleDateString('ko', {
          timeZone: 'Asia/Seoul',
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\s+/g, '')
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
      const _exhaustiveCheck: never = config.mode
      return _exhaustiveCheck
    }
  }
}
