import { getWordList } from './words'
import * as Hangul from '@/lib/hangul'

export class Keyboard {
  #value: string
  readonly #answerLength: number

  constructor(answerLength: number) {
    this.#value = ''
    this.#answerLength = answerLength
  }

  get value(): string {
    return this.#value
  }

  set value(str: string) {
    if (Hangul.getCodePointLength(str) <= this.#answerLength) {
      this.#value = str
    }
  }

  get guess(): Hangul.Word {
    return Hangul.toWord(this.#value)
  }

  codePointLength(): number {
    return Hangul.getCodePointLength(this.#value)
  }

  isInvalidGuess(): boolean {
    const guess = this.guess
    return (
      guess.length !== this.#answerLength ||
      // TODO: improve word list check performance if it affects UX.
      //       The performance can be improved using hash set or bisect.
      //       If bisect is chosen, add word list test that checks whether
      //       the word list is sorted.
      // TODO: remove duplicated word list check in wordle impl
      getWordList(guess.length).every((word) => word.value !== guess.value)
    )
  }
}
