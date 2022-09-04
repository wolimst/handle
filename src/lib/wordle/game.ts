import { Keyboard } from './keyboard'
import type { Status, GameData, GuessError } from './types'
import { _Wordle } from './wordle'
import { getWordList } from './words'
import type * as Hangul from '@/lib/hangul'

export class Game {
  readonly #nWordles: number
  readonly #nGuesses: number
  readonly #answerLength: number

  readonly #wordles: readonly _Wordle[]
  readonly #keyboard: Keyboard

  readonly #guesses: Hangul.Word[]

  // TODO: persist data on status change and load data if it exist during object
  //       initialization

  /**
   * Initialize a game that can contain multiple wordles.
   *
   * Each wordle will have a random answer for the day.
   *
   * @param nWordles number of wordles in the game. It should be a positive integer.
   * @param nGuesses number of guesses that the player has. It should be a positive integer.
   * @param answerLength number of syllables in the answer
   */
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

    this.#guesses = []
  }

  get nWordles(): number {
    return this.#nWordles
  }

  get nGuesses(): number {
    return this.#nGuesses
  }

  get answerLength(): number {
    return this.#answerLength
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

  get remainingGuesses(): number {
    return this.#nGuesses - this.#guesses.length
  }

  get data(): GameData {
    return {
      nWordles: this.#nWordles,
      nGuesses: this.#nGuesses,
      answerLength: this.#answerLength,
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

    if (guess.length !== this.answerLength) {
      return 'wrongLength'
    }

    // TODO: handle GuessError 'invalidSyllable' if necessary.
    //       Currently it is not possible to happen, because `Hangul.Word` type
    //       only contains valid syllables.

    if (isGuessNotInWordList(guess)) {
      return 'unknownWord'
    }

    this.#guesses.push(guess)
    this.#wordles
      .filter((wordle) => wordle.status === 'playing')
      .forEach((wordle) => wordle.submitGuess(guess))
    this.#keyboard.value = ''

    return undefined
  }
}

function isGuessNotInWordList(guess: Hangul.Word): boolean {
  // TODO: improve word list check performance if it affects UX.
  //       The performance can be improved using hash set or bisect.
  //       If bisect is chosen, add word list test that checks whether
  //       the word list is sorted.
  return getWordList(guess.length).every((word) => word.value !== guess.value)
}
