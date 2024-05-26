import { WORKER_URL_GET_LEADERBOARD, WORKER_URL_POST_RESULT } from '@/constants'
import * as Wordle from '@/lib/wordle'
import { config } from '@/stores/app'
import { statistics } from '@/stores/wordle'
import { get, writable } from 'svelte/store'

const store = writable<Wordle.Leaderboard>({
  nextUpdateDate: new Date(0),
  data: {},
})

export const leaderboard = {
  ...store,
  refresh: async () => {
    const response = await fetch(WORKER_URL_GET_LEADERBOARD)
    if (response.ok) {
      const data = (await response.json()) as Wordle.LeaderboardData
      store.set({
        nextUpdateDate: new Date(Date.now() + 1000 * 60 * 5),
        data,
      })
      return true
    }
    return false
  },
  submitResult: async (gameData: Wordle.GameData) => {
    const response = await fetch(WORKER_URL_POST_RESULT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createLeaderboardItem(gameData)),
    })
    if (response.ok) {
      const data = (await response.json()) as Wordle.LeaderboardData
      store.set({
        nextUpdateDate: new Date(Date.now() + 1000 * 60 * 5),
        data,
      })
      return true
    }
    return false
  },
}

function createLeaderboardItem(
  gameData: Wordle.GameData
): Wordle.LeaderboardItem {
  const { userId, userName } = get(config)

  const gameTypeString = Wordle.getGameTypeString(
    gameData.config.mode,
    gameData.config.nWordles,
    gameData.config.answerLength
  )
  const streak = statistics.getStats(gameTypeString).winStreak

  return {
    configId: gameData.config.id,
    gameId: gameData.id,
    user: {
      id: userId,
      name: userName,
      streak,
    },
    guesses: gameData.guesses.map((guess) => guess.value),
    duration:
      new Date(gameData.metadata.lastUpdatedDateISOString).getTime() -
      new Date(gameData.metadata.firstGuessDateISOString).getTime(),
  }
}
