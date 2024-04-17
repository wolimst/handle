import { N_WORDLES_PER_ROW } from '@/constants'
import type { DubeolsikJamo, Word } from '@/lib/hangul'
import * as Wordle from '@/lib/wordle'
import { readable, writable, type Readable } from 'svelte/store'

export interface GameStore {
  active: boolean
  data: Wordle.GameData
  getGameType(): string
  submitGuess(): Wordle.GuessError | undefined
  getAnswers(): readonly string[] | undefined
}

export interface KeyboardStore {
  active: boolean
  value: string
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

export const game = writable<GameStore>()
export const keyboard = writable<KeyboardStore>()
export let ui: UIStore

export function initializeWordleStores(
  config: Wordle.GameConfig,
  gameId: string,
  answers?: readonly Word[]
) {
  const gameInstance = new Wordle.Game(config, gameId, answers)
  const keyboardInstance = gameInstance.keyboard

  game.set({
    active: true,
    data: gameInstance.data,
    getGameType: (): string => {
      return Wordle.getGameTypeString(
        gameInstance.data.config.mode,
        gameInstance.data.config.nWordles,
        gameInstance.data.config.answerLength
      )
    },
    submitGuess: (): Wordle.GuessError | undefined => {
      const result = gameInstance.submitGuess()
      game.update((store) => {
        store.data = gameInstance.data
        return store
      })
      keyboard.update((store) => {
        store.value = keyboardInstance.value
        return store
      })
      return result
    },
    getAnswers: (): readonly string[] | undefined => {
      return gameInstance.answers
    },
  })

  keyboard.set({
    active: true,
    value: keyboardInstance.value,
    setValue: (value: string): Wordle.KeyboardError | undefined => {
      const setError = keyboardInstance.setValue(value)
      if (setError === undefined) {
        keyboard.update((store) => {
          store.value = keyboardInstance.value
          return store
        })
      }
      return setError
    },
    type: (jamo: DubeolsikJamo): Wordle.KeyboardError | undefined => {
      const setError = keyboardInstance.type(jamo)
      if (setError === undefined) {
        keyboard.update((store) => {
          store.value = keyboardInstance.value
          return store
        })
      }
      return setError
    },
    delete: () => {
      keyboardInstance.delete()
      keyboard.update((store) => {
        store.value = keyboardInstance.value
        return store
      })
    },
  })

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

export function deactivateWordleStores() {
  game.update((store) => {
    store.active = false
    store.getGameType = (): string => {
      return ''
    }
    store.submitGuess = (): Wordle.GuessError | undefined => {
      return undefined
    }
    store.getAnswers = (): readonly string[] | undefined => {
      return undefined
    }
    return store
  })

  keyboard.set({
    active: false,
    value: '',
    setValue: (_value: string): Wordle.KeyboardError | undefined => {
      return undefined
    },
    type: (_jamo: DubeolsikJamo): Wordle.KeyboardError | undefined => {
      return undefined
    },
    delete() {},
  })

  ui = {
    ...readable(),
    nWordlesAtRow: (_rowIndex: number): number => {
      return NaN
    },
  }
}
