import { N_WORDLES_PER_ROW } from '@/constants'
import * as Wordle from '@/lib/wordle'
import { readable, writable, type Readable } from 'svelte/store'

interface GameStore extends Readable<Wordle.GameData> {
  submitGuess(): Wordle.GuessError | undefined
}

interface KeyboardStore extends Readable<string> {
  setValue(value: string): Wordle.KeyboardError | undefined
}

interface UIConstants {
  nWordlesPerRow: number
  nRows: number
}

interface UIStore extends Readable<UIConstants> {
  nWordlesAtRow: (rowIndex: number) => number
}

export let game: GameStore
export let keyboard: KeyboardStore
export let ui: UIStore
export const alert = writable('')

export function initStores(
  nWordles: number,
  nGuesses: number,
  answerLength: number
) {
  const gameImpl = new Wordle.Game(nWordles, nGuesses, answerLength)
  const keyboardImpl = gameImpl.keyboard

  const gameStore = writable(gameImpl.data)
  const keyboardStore = writable(keyboardImpl.value)

  game = {
    subscribe: gameStore.subscribe,
    submitGuess: (): Wordle.GuessError | undefined => {
      const result = gameImpl.submitGuess()
      gameStore.set(gameImpl.data)
      keyboardStore.set(keyboardImpl.value)
      return result
    },
  }

  keyboard = {
    subscribe: keyboardStore.subscribe,
    setValue: (value: string): Wordle.KeyboardError | undefined => {
      const setError = keyboardImpl.setValue(value)
      if (setError === undefined) {
        keyboardStore.set(value)
      }
      return setError
    },
  }

  const nWordlesPerRow = N_WORDLES_PER_ROW[answerLength]
  ui = {
    ...readable({
      nWordlesPerRow,
      nRows: Math.ceil(nWordles / nWordlesPerRow),
    }),
    nWordlesAtRow: (rowIndex: number): number => {
      const nWordlesRemaining = nWordles - rowIndex * nWordlesPerRow
      if (nWordlesRemaining > nWordlesPerRow) {
        return nWordlesPerRow
      } else {
        return nWordlesRemaining
      }
    },
  }
}
