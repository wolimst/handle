import * as Wordle from '@/lib/wordle'
import { base64 } from '@/stores/encoder'
import { persistentStore } from '@/stores/localStore'
import { get, type Readable } from 'svelte/store'

interface StatisticsStore extends Readable<StatisticsStorage> {
  getStats(gameType: string): Statistics
  update(gameData: Wordle.GameData): void
}

type StatisticsStorage = {
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

export const statistics: StatisticsStore = {
  subscribe: store.subscribe,
  getStats: getStats,
  update: update,
}

export const defaultStats: Statistics = {
  nGamesPlayed: 0,
  nGamesWon: 0,
  guesses: {},
  winStreak: 0,
  maxWinStreak: 0,
} as const

function getStats(gameType: string): Statistics {
  const stats = get(store)[gameType] || defaultStats
  return structuredClone(stats)
}

function update(gameData: Wordle.GameData) {
  if (gameData.status === 'playing') {
    return
  }

  const gameType = Wordle.getGameTypeString(
    gameData.mode,
    gameData.nWordles,
    gameData.answerLength
  )
  store.update((storage: StatisticsStorage): StatisticsStorage => {
    const stats = storage[gameType] || structuredClone(defaultStats)

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

    storage[gameType] = stats
    return storage
  })
}
