import { Keyboard } from './keyboard'
import type { Status } from './types'
import { _Wordle } from './wordle'

export class Game {
  readonly #nWordles: number
  readonly #nGuesses: number
  readonly #answerLength: number

  readonly #wordles: readonly _Wordle[]
  readonly #keyboard: Keyboard

  constructor(nWordles: number, nGuesses: number, answerLength: number) {
    this.#nWordles = nWordles
    this.#nGuesses = nGuesses
    this.#answerLength = answerLength

    const date = new Date().toLocaleDateString('UTC', {
      timeZone: 'Asia/Seoul',
    })
    this.#wordles = Array(nWordles)
      .fill(0)
      .map((_, i) => {
        const seed = `${date}-${i}`
        return new _Wordle(nGuesses, answerLength, seed)
      })
    this.#keyboard = new Keyboard(answerLength)
  }

  get wordles(): readonly Wordle[] {
    return this.#wordles
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

  submitGuess() {
    if (this.status !== 'playing' || this.#keyboard.isInvalidGuess()) {
      // TODO handle invalid status
    }

    this.#wordles.map((game) => game.submitGuess(this.#keyboard.guess))

    // TODO save data in local storage
  }
}
