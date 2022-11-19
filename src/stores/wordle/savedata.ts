import type * as Wordle from '@/lib/wordle'
import { base64 } from '@/stores/encoder'
import { persistentStore } from '@/stores/localStore'
import { get } from 'svelte/store'

export interface SaveStorage {
  [gameId: string]: SaveData
}

export interface SaveData extends Wordle.GameData {
  lastUpdatedDateISOString: string
}

const defaultStorage: SaveStorage = {}

const store = persistentStore('savedata', defaultStorage, base64)

export const savedata = {
  subscribe: store.subscribe,
  save: save,
  load: load,
}

const DAY_MS = 24 * 60 * 60 * 1000
const RETENTION_PERIOD_DAY = 3

function save(data: Wordle.GameData) {
  store.update((storage: SaveStorage): SaveStorage => {
    storage[data.id] = {
      ...data,
      lastUpdatedDateISOString: new Date().toISOString(),
    }
    return storage
  })
}

function load(gameId: string): Wordle.GameData | undefined {
  store.update(removeOldData)
  const data = structuredClone(get(savedata)[gameId])
  if (!data) {
    return undefined
  } else {
    return {
      id: data.id,
      config: data.config,
      guesses: data.guesses,
      status: data.status,
      wordleData: data.wordleData,
    }
  }
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
