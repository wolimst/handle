import { PRODUCTION } from '@/constants'
import * as Wordle from '@/lib/wordle'
import { base64, plaintext } from '@/stores/encoder'
import { persistentStore } from '@/stores/localStore'
import { get } from 'svelte/store'

export interface SaveStorage {
  [gameId: string]: Wordle.GameSaveData
}

const defaultStorage: SaveStorage = {}

const encoder = PRODUCTION ? base64 : plaintext
const store = persistentStore('savedata', defaultStorage, encoder)

export const savedata = {
  subscribe: store.subscribe,
  export: store.export,
  import: store.import,
  reset: store.reset,
  save: save,
  load: load,
  loadPrevious: loadPrevious,
  loadNext: loadNext,
  loadByConfigId: loadByConfigId,
}

const DAY_MS = 24 * 60 * 60 * 1000
const RETENTION_PERIOD_DAY = 15

function convert(data: Wordle.GameData): Wordle.GameSaveData {
  const { guesses, wordleData, ...savedata } = data
  return {
    ...savedata,
    guesses: data.guesses.map((guess) => ({
      value: guess.value,
      length: guess.length,
    })),
  }
}

function save(data: Wordle.GameData) {
  store.update((storage: SaveStorage): SaveStorage => {
    storage[data.id] = convert(data)
    return storage
  })
}

function load(gameId: string): Wordle.GameSaveData | undefined {
  store.update(removeOldData)
  const data = structuredClone(get(savedata)[gameId])
  if (!data) {
    return undefined
  } else {
    return data
  }
}

function loadNeighbor(
  gameData: Wordle.GameData,
  previous: boolean
): Wordle.GameSaveData | undefined {
  const data = get(savedata)
  if (!data) {
    return undefined
  }

  const gameTypeString = Wordle.getGameTypeString(
    gameData.config.mode,
    gameData.config.nWordles,
    gameData.config.answerLength
  )
  const sortedIds = Object.keys(data)
    .filter((key) => key.startsWith(gameTypeString))
    .toSorted()
  if (!previous) {
    sortedIds.reverse()
  }

  const index = sortedIds.findIndex((key) => key === gameData.id)
  if (index <= 0) {
    return undefined
  }

  const neighborDataId = sortedIds[index - 1]
  return structuredClone(data[neighborDataId])
}

function loadPrevious(
  gameData: Wordle.GameData
): Wordle.GameSaveData | undefined {
  return loadNeighbor(gameData, true)
}

function loadNext(gameData: Wordle.GameData): Wordle.GameSaveData | undefined {
  return loadNeighbor(gameData, false)
}

function loadByConfigId(configId: string): Wordle.GameSaveData[] {
  const data = get(savedata)
  if (!data) {
    return []
  }

  const sortedIds = Object.keys(data)
    .filter((key) => key.startsWith(configId))
    .toSorted()
  const result = sortedIds.map((id) => structuredClone(data[id]))
  return result
}

function removeOldData(storage: SaveStorage): SaveStorage {
  const now = new Date()
  const entries = Object.entries(storage).filter(([, data]) => {
    const gameDate = data.metadata?.lastUpdatedDateISOString
      ? new Date(data.metadata?.lastUpdatedDateISOString)
      : getKSTDate(data.config)
    const dayDiff = Math.round(
      Math.abs(now.getTime() - gameDate.getTime()) / DAY_MS
    )
    return Number.isSafeInteger(dayDiff) && dayDiff < RETENTION_PERIOD_DAY
  })
  return Object.fromEntries(entries)
}

function getKSTDate(config: Wordle.GameConfig): Date {
  if (config.mode !== 'daily') {
    return new Date(0)
  }
  const [year, month, day] = config.id.split('-')[3].split('.')
  const date = new Date(`20${year}-${month}-${day} GMT+0900`)
  return date
}
