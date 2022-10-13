import * as Wordle from '@/lib/wordle'
import { base64 } from '@/stores/encoder'
import { persistentStore } from '@/stores/localStore'
import { get } from 'svelte/store'

export type StatisticsStorage = {
  [key: string]: Statistics
}

export interface Statistics {
  nGamesPlayed: number
  nGamesWon: number
  guesses: {
    [key: number]: number
    fail?: number
  }
  winStreak: number
  maxWinStreak: number
}

const defaultStorage: StatisticsStorage = {}

const store = persistentStore('statistics', defaultStorage, base64)

export const statistics = {
  subscribe: store.subscribe,
  getStats: getStats,
  update: update,
}

const defaultStats: Statistics = {
  nGamesPlayed: 0,
  nGamesWon: 0,
  guesses: {},
  winStreak: 0,
  maxWinStreak: 0,
} as const

function getStatsId(gameId: string): string {
  return gameId.split('-').slice(0, 3).join('-')
}

function getStats(gameId: string): Statistics {
  const id = getStatsId(gameId)
  const stats = get(store)[id] || defaultStats
  return structuredClone(stats)
}

function update(gameData: Wordle.GameData) {
  if (gameData.status === 'playing') {
    return
  }

  const id = getStatsId(gameData.id)
  store.update((storage: StatisticsStorage): StatisticsStorage => {
    const stats = storage[id] || structuredClone(defaultStats)

    stats.nGamesPlayed += 1
    if (gameData.status === 'win') {
      stats.nGamesWon += 1
      stats.winStreak += 1
      stats.guesses[gameData.guesses.length] =
        (stats.guesses[gameData.guesses.length] || 0) + 1
    } else {
      stats.winStreak = 0
      stats.guesses.fail = (stats.guesses.fail || 0) + 1
    }
    stats.maxWinStreak = Math.max(stats.winStreak, stats.maxWinStreak)

    storage[id] = stats
    return storage
  })
}
