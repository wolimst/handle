import { N_WORDLES_PER_ROW } from '@/constants'
import type { DubeolsikJamo } from '@/lib/hangul'
import * as Wordle from '@/lib/wordle'
import { readable, writable, type Readable } from 'svelte/store'

interface GameData extends Wordle.GameData {
  gameType: Wordle.GameType
}

interface GameStore extends Readable<GameData> {
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

export function initializeWordleStores(
  gameType: Wordle.GameType,
  nWordles: number,
  answerLength: number,
  nGuesses: number
) {
  const gameImpl = createGameInstance(
    gameType,
    nWordles,
    answerLength,
    nGuesses
  )
  const keyboardImpl = gameImpl.keyboard

  const gameStore = writable<GameData>({ gameType, ...gameImpl.data })
  const keyboardStore = writable(keyboardImpl.value)

  game = {
    subscribe: gameStore.subscribe,
    submitGuess: (): Wordle.GuessError | undefined => {
      const result = gameImpl.submitGuess()
      gameStore.set({ gameType, ...gameImpl.data })
      keyboardStore.set(keyboardImpl.value)
      return result
    },
    getAnswers: (): readonly string[] | undefined => {
      return gameImpl.answers
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
    type: (jamo: DubeolsikJamo): Wordle.KeyboardError | undefined => {
      const setError = keyboardImpl.type(jamo)
      if (setError === undefined) {
        keyboardStore.set(keyboardImpl.value)
      }
      return setError
    },
    delete() {
      keyboardImpl.delete()
      keyboardStore.set(keyboardImpl.value)
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

function createGameInstance(
  gameType: Wordle.GameType,
  nWordles: number,
  answerLength: number,
  nGuesses: number
): Wordle.Game {
  switch (gameType) {
    case 'daily': {
      const date = new Date()
        .toLocaleDateString('ko', {
          timeZone: 'Asia/Seoul',
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\s+/g, '')
      const id = `d-${nWordles}-${answerLength}-${nGuesses}-${date}`
      return new Wordle.Game(id, nWordles, answerLength, nGuesses, true)
    }
    case 'free': {
      const n = Math.floor(Math.random() * 2 ** 32)
      const id = `i-${nWordles}-${answerLength}-${nGuesses}-${n}`
      return new Wordle.Game(id, nWordles, answerLength, nGuesses, false)
    }
    case 'custom':
      // TODO
      throw new Error('not implemented')
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = gameType
      return _exhaustiveCheck
  }
}
