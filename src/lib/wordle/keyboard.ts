import type { KeyboardError } from './types'
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

  /**
   * Set the given string if it consists of modern Hangul characters and its
   * length is equal or shorter than the length of the answer
   */
  setValue(str: string): KeyboardError | undefined {
    if (Hangul.getCodePointLength(str) > this.#answerLength) {
      return 'lengthExceeded'
    }

    if (!Hangul.isHangul(str)) {
      return 'nonHangul'
    }

    this.#value = str
    return undefined
  }

  /**
   * Convert the keyboard input value to {@link Hangul.Word} object.
   */
  get guess(): Hangul.Word {
    return Hangul.toWord(this.#value)
  }

  codePointLength(): number {
    return Hangul.getCodePointLength(this.#value)
  }
}
