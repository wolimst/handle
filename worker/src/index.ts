import { Env, Leaderboard, LeaderboardItem } from './types'
import { Router, cors, error } from 'itty-router'
import { z } from 'zod'

const LEADERBOARD_KEY = 'leaderboard'
const LEADERBOARD_ITEM_MAX_LENGTH = 5
const RETENTION_PERIOD_DAY = 15
const DAY_MS = 24 * 60 * 60 * 1000

function validate(obj: unknown): obj is LeaderboardItem {
  const _validate = (obj: unknown): obj is LeaderboardItem => {
    const leaderboardItemSchema = z.object({
      configId: z.string(),
      gameId: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string().max(8),
        streak: z.number().min(0).safe(),
      }),
      guesses: z.array(z.string()),
      duration: z.number().min(0).safe(),
    })
    return leaderboardItemSchema.safeParse(obj).success
  }

  if (!_validate(obj)) {
    return false
  }

  const mode = obj.configId.split('-')[0]
  const [nWordles, answerLength] = obj.configId
    .split('-')
    .slice(1, 3)
    .map(Number)
  const date = getKSTDate(obj.configId)
  const now = getCurrentKSTDate()

  return (
    obj.gameId.startsWith(obj.configId) &&
    mode === 'd' &&
    !isNaN(nWordles) &&
    !isNaN(answerLength) &&
    obj.guesses.length >= nWordles &&
    obj.guesses.every((guess) => guess.length === answerLength) &&
    date.getTime() === now.getTime()
  )
}

function isRecentData(configId: string): boolean {
  const now = new Date()
  const date = getKSTDate(configId)
  const dayDiff = Math.round(Math.abs(now.getTime() - date.getTime()) / DAY_MS)
  return Number.isSafeInteger(dayDiff) && dayDiff < RETENTION_PERIOD_DAY
}

function getCurrentKSTDate(): Date {
  return new Date(
    new Date().toLocaleDateString('ko', {
      timeZone: 'Asia/Seoul',
    }) + ' GMT+0900'
  )
}

function getKSTDate(configId: string): Date {
  const [year, month, day] = configId.split('-')[3].split('.')
  const date = new Date(`20${year}-${month}-${day} GMT+0900`)
  return date
}

function sortLeaderboardItems(a: LeaderboardItem, b: LeaderboardItem): number {
  const guessCount = a.guesses.length - b.guesses.length
  if (guessCount !== 0) {
    return guessCount
  }
  return a.duration - b.duration
}

function removeUserId(leaderboard: Leaderboard): Leaderboard {
  return Object.fromEntries(
    Object.entries(leaderboard).map(([key, items]) => [
      key,
      items.map((item) => ({
        ...item,
        user: {
          name: item.user.name,
          streak: item.user.streak,
        },
      })),
    ])
  )
}

const { preflight, corsify } = cors({
  origin: ['https://handle.wolim.net', 'https://wolimst.github.io'],
  credentials: true,
})

const router = Router({
  before: [preflight],
  catch: error,
  finally: [corsify],
})

router.get('/leaderboard', async (_request, env: Env) => {
  try {
    const leaderboard = JSON.parse(
      (await env.KV.get(LEADERBOARD_KEY)) || '{}'
    ) as Leaderboard
    if (!leaderboard) {
      return new Response('500, internal error', { status: 500 })
    }
    return Response.json(removeUserId(leaderboard))
  } catch {
    return new Response('500, internal error', { status: 500 })
  }
})

router.post('/result', async (request, env: Env) => {
  try {
    const data: unknown = request.json ? await request.json() : null
    if (!validate(data)) {
      return new Response('400, bad request', { status: 400 })
    }

    let leaderboard = JSON.parse(
      (await env.KV.get(LEADERBOARD_KEY)) || '{}'
    ) as Leaderboard
    if (!leaderboard) {
      return new Response('500, internal error', { status: 500 })
    }

    leaderboard = Object.fromEntries(
      Object.entries(leaderboard).filter(([key, _value]) => isRecentData(key))
    )

    leaderboard[data.configId] = (leaderboard[data.configId] || [])
      .concat(data)
      .sort(sortLeaderboardItems)
      .slice(0, LEADERBOARD_ITEM_MAX_LENGTH)

    await env.KV.put(LEADERBOARD_KEY, JSON.stringify(leaderboard, null, 0))

    return Response.json(removeUserId(leaderboard))
  } catch {
    return new Response('500, internal error', { status: 500 })
  }
})

router.all('*', () => new Response('404, not found', { status: 404 }))

export default { ...router }
