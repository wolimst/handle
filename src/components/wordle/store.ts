import { N_WORDLES_PER_ROW } from '@/constants'
import type { DubeolsikJamo } from '@/lib/hangul'
import * as Wordle from '@/lib/wordle'
import { readable, writable, type Readable } from 'svelte/store'

interface GameStore extends Readable<Wordle.GameData> {
  getGameType(): string
  submitGuess(): Wordle.GuessError | undefined
  getAnswers(): readonly string[] | undefined
}

interface KeyboardStore extends Readable<string> {
  setValue(value: string): Wordle.KeyboardError | undefined
  type(jamo: DubeolsikJamo): Wordle.KeyboardError | undefined
  delete(): void
}

interface UIConstants {
  nWordlesPerRow: number
  nRows: number
}

interface UIStore extends Readable<UIConstants> {
  nWordlesAtRow: (rowIndex: number) => number
}

interface Notification {
  type?: 'win' | 'loss' | 'error'
  message: string
}

export let game: GameStore
export let keyboard: KeyboardStore
export let ui: UIStore
export const notification = writable<Notification>({ message: '' })

export function initializeWordleStores(gameInstance: Wordle.Game) {
  const keyboardInstance = gameInstance.keyboard

  const gameStore = writable<Wordle.GameData>(gameInstance.data)
  const keyboardStore = writable(keyboardInstance.value)

  game = {
    subscribe: gameStore.subscribe,
    getGameType: (): string => {
      return Wordle.getGameTypeString(
        gameInstance.data.config.mode,
        gameInstance.data.config.nWordles,
        gameInstance.data.config.answerLength
      )
    },
    submitGuess: (): Wordle.GuessError | undefined => {
      const result = gameInstance.submitGuess()
      gameStore.set(gameInstance.data)
      keyboardStore.set(keyboardInstance.value)
      return result
    },
    getAnswers: (): readonly string[] | undefined => {
      return gameInstance.answers
    },
  }

  keyboard = {
    subscribe: keyboardStore.subscribe,
    setValue: (value: string): Wordle.KeyboardError | undefined => {
      const setError = keyboardInstance.setValue(value)
      if (setError === undefined) {
        keyboardStore.set(value)
      }
      return setError
    },
    type: (jamo: DubeolsikJamo): Wordle.KeyboardError | undefined => {
      const setError = keyboardInstance.type(jamo)
      if (setError === undefined) {
        keyboardStore.set(keyboardInstance.value)
      }
      return setError
    },
    delete() {
      keyboardInstance.delete()
      keyboardStore.set(keyboardInstance.value)
    },
  }

  const nWordlesPerRow =
    N_WORDLES_PER_ROW[gameInstance.data.config.answerLength]
  ui = {
    ...readable({
      nWordlesPerRow,
      nRows: Math.ceil(gameInstance.data.config.nWordles / nWordlesPerRow),
    }),
    nWordlesAtRow: (rowIndex: number): number => {
      const nWordlesRemaining =
        gameInstance.data.config.nWordles - rowIndex * nWordlesPerRow
      if (nWordlesRemaining > nWordlesPerRow) {
        return nWordlesPerRow
      } else {
        return nWordlesRemaining
      }
    },
  }
}
