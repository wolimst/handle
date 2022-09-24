import type { KeyboardError } from './types'
import * as Hangul from '@/lib/hangul'
import { DubeolsikIME, type DubeolsikJamo } from '@/lib/hangul'

export class Keyboard {
  readonly #answerLength: number
  #ime: DubeolsikIME

  constructor(answerLength: number) {
    this.#answerLength = answerLength
    this.#ime = new DubeolsikIME()
  }

  get value(): string {
    return this.#ime.value
  }

  /**
   * Set the given string if it consists of modern Hangul characters and its
   * length is equal or shorter than the length of the answer
   */
  setValue(str: string): KeyboardError | undefined {
    if (Hangul.getCodePointLength(str) > this.#answerLength) {
      return 'lengthExceeded'
    }

    const setResult = this.#ime.setValue(str)
    return setResult ? undefined : 'nonHangul'
  }

  /**
   * Type in a Jamo using dubeolsik keyboard layout.
   *
   * If the length of the input value become longer than the answer length,
   * a {@link KeyboardError} is returned and the typing is cancelled.
   *
   * Otherwise, `undefined` is returned.
   */
  type(jamo: DubeolsikJamo): KeyboardError | undefined {
    const prevValue = this.#ime.value
    this.#ime.type(jamo)

    if (this.codePointLength() > this.#answerLength) {
      this.#ime.setValue(prevValue)
      return 'lengthExceeded'
    }

    return undefined
  }

  /**
   * Delete the last jamo from the input value
   */
  delete() {
    this.#ime.delete()
  }

  /**
   * Convert the keyboard input value to {@link Hangul.Word} object.
   */
  get guess(): Hangul.Word {
    return Hangul.toWord(this.#ime.value)
  }

  codePointLength(): number {
    return Hangul.getCodePointLength(this.#ime.value)
  }
}
