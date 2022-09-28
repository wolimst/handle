import { Keyboard } from './keyboard'
import type { Status, GameData, GuessError } from './types'
import { _Wordle } from './wordle'
import { getWordList } from './words'
import type * as Hangul from '@/lib/hangul'
import * as Path from '@/lib/path'
import { savedata } from '@/stores/wordle'

export class Game {
  readonly #id: string

  readonly #nWordles: number
  readonly #answerLength: number
  readonly #nGuesses: number
  readonly #useSave: boolean

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
   * @param id a unique string for the game
   * @param nWordles number of wordles in the game. It should be a positive integer.
   * @param answerLength number of syllables in the answer
   * @param nGuesses number of guesses that the player has. It should be a positive integer.
   * @param useSave a flag whether to load data at initialization and save on state change
   */
  constructor(
    id: string,
    nWordles: number,
    answerLength: number,
    nGuesses: number,
    useSave: boolean
  ) {
    this.#id = id
    this.#nWordles = nWordles
    this.#answerLength = answerLength
    this.#nGuesses = nGuesses
    this.#useSave = useSave

    this.#wordles = Array(nWordles)
      .fill(0)
      .map((_, i) => new _Wordle(answerLength, nGuesses, `${id}-${i}`))
    this.#keyboard = new Keyboard(answerLength)
    this.#guesses = []

    if (useSave) {
      const data = savedata.load(id)
      data?.guesses.forEach((guess) => this.#doSubmit(guess))
    }
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

  get remainingGuesses(): number {
    return this.#nGuesses - this.#guesses.length
  }

  get data(): GameData {
    return {
      id: this.#id,
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

    if (guess.length !== this.#answerLength) {
      return 'wrongLength'
    }

    if (isGuessNotInWordList(guess)) {
      return 'notInWordList'
    }

    if (Path.getUndrawableSyllablesInWord(guess) !== '') {
      return 'undrawableSyllable'
    }

    this.#doSubmit(guess)

    this.#keyboard.setValue('')

    if (this.#useSave) {
      savedata.save(this.data)
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

function isGuessNotInWordList(guess: Hangul.Word): boolean {
  // TODO: improve word list check performance if it affects UX.
  //       The performance can be improved using hash set or bisect.
  //       If bisect is chosen, add word list test that checks whether
  //       the word list is sorted.
  return getWordList(guess.length).every((word) => word.value !== guess.value)
}
