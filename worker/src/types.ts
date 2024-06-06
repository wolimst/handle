import type { RouterType } from 'itty-router'

export interface Env {
  KV: KVNamespace
  router?: RouterType
}

export interface Leaderboard {
  [key: string]: LeaderboardItem[]
}

export interface LeaderboardItem {
  configId: string
  gameId: string
  user: {
    id?: string
    name: string
  }
  guesses: string[]
  duration: number
}
