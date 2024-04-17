import { PRODUCTION } from '@/constants'
import * as Wordle from '@/lib/wordle'
import { base64, plaintext } from '@/stores/encoder'
import { persistentStore } from '@/stores/localStore'
import { get } from 'svelte/store'

export interface SaveStorage {
  [gameId: string]: SaveData
}

export interface SaveData extends Wordle.GameData {
  lastUpdatedDateISOString: string
}

const defaultStorage: SaveStorage = {}

const encoder = PRODUCTION ? base64 : plaintext
const store = persistentStore('savedata', defaultStorage, encoder)

export const savedata = {
  subscribe: store.subscribe,
  save: save,
  load: load,
  loadPrevious: loadPrevious,
  loadNext: loadNext,
  loadByConfigId: loadByConfigId,
}

const DAY_MS = 24 * 60 * 60 * 1000
const RETENTION_PERIOD_DAY = 8

function save(data: Wordle.GameData) {
  store.update(removeOldData)
  store.update((storage: SaveStorage): SaveStorage => {
    storage[data.id] = {
      ...data,
      lastUpdatedDateISOString: new Date().toISOString(),
    }
    return storage
  })
}

function load(gameId: string): Wordle.GameData | undefined {
  const data = structuredClone(get(savedata)[gameId])
  if (!data) {
    return undefined
  } else {
    const { lastUpdatedDateISOString, ...result } = data
    return result
  }
}

function loadNeighbor(
  gameData: Wordle.GameData,
  previous: boolean
): Wordle.GameData | undefined {
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
  const { lastUpdatedDateISOString, ...neighborData } = structuredClone(
    data[neighborDataId]
  )
  return neighborData
}

function loadPrevious(gameData: Wordle.GameData): Wordle.GameData | undefined {
  return loadNeighbor(gameData, true)
}

function loadNext(gameData: Wordle.GameData): Wordle.GameData | undefined {
  return loadNeighbor(gameData, false)
}

function loadByConfigId(configId: string): Wordle.GameData[] {
  const data = get(savedata)
  if (!data) {
    return []
  }

  const sortedIds = Object.keys(data)
    .filter((key) => key.startsWith(configId))
    .toSorted()
  const result = sortedIds.map((id) => {
    const { lastUpdatedDateISOString, ...result } = structuredClone(data[id])
    return result
  })
  return result
}

function removeOldData(storage: SaveStorage): SaveStorage {
  const now = new Date()
  const entries = Object.entries(storage).filter(([, data]) => {
    const lastUpdated = new Date(data.lastUpdatedDateISOString)
    const dayDiff = Math.round(
      Math.abs(now.getTime() - lastUpdated.getTime()) / DAY_MS
    )
    return Number.isSafeInteger(dayDiff) && dayDiff < RETENTION_PERIOD_DAY
  })
  return Object.fromEntries(entries)
}
