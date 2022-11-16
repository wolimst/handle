import type * as Wordle from '@/lib/wordle'

export const APP_NAME = '한들'

export const BASE_URL: string = import.meta.env.BASE_URL.replace(/\/+$/g, '')
export const PRODUCTION: boolean = import.meta.env.PROD

interface GameMode {
  readonly id: Wordle.GameMode
  readonly name: string
  readonly useSave: boolean
  readonly useStatistics: boolean
  readonly disabled?: boolean
}

export const GAME_MODES: readonly GameMode[] = [
  {
    id: 'daily',
    name: '오늘의 문제',
    useSave: true,
    useStatistics: true,
  },
  {
    id: 'free',
    name: '자유 도전',
    useSave: false,
    useStatistics: true,
  },
  {
    id: 'custom',
    name: '커스텀 게임',
    useSave: true,
    useStatistics: false,
    disabled: true,
  },
] as const

export const GAMES = [
  {
    link: '/daily/1x2',
    mode: 'daily',
    nWordles: 1,
    answerLength: 2,
  },
  {
    link: '/daily/2x2',
    mode: 'daily',
    nWordles: 2,
    answerLength: 2,
  },
  {
    link: '/daily/3x2',
    mode: 'daily',
    nWordles: 3,
    answerLength: 2,
  },
  {
    link: '/free/1x2',
    mode: 'free',
    nWordles: 1,
    answerLength: 2,
  },
  {
    link: '/free/2x2',
    mode: 'free',
    nWordles: 2,
    answerLength: 2,
  },
  {
    link: '/free/3x2',
    mode: 'free',
    nWordles: 3,
    answerLength: 2,
  },
] as const

export const ROUTES = {
  home: '/',
  fontViewer: '/font',
  wordViewer: '/words',
  game: GAMES.map((game) => game.link),
  custom: '/custom/:code?',
} as const

export const WORDLE_NAMES = ['invalid', '한들', '두들', '세들']

/**
 * A lookup table for the number of guesses of a game.
 *
 * Row index represents the number of wordles in a game, and column index
 * represents the answer length, e.g. if `nWordles = 2`, `answerLength = 1`
 * then `nGuesses = N_GUESSES[2][1]`
 */
export const N_GUESSES: readonly (readonly number[])[] = [
  [],
  [NaN, NaN, 6],
  [NaN, NaN, 8],
  [NaN, NaN, 10],
] as const

/**
 * Maximum number of wordles that could be displayed for each row on the screen.
 *
 * Array index corresponds to the answer length of the wordle,
 * i.e. `N_WORDLES_PER_ROW[2]` is #wordles/row when the answer length is 2.
 */
export const N_WORDLES_PER_ROW = [NaN, 4, 4, 3] as const

export const ALERT_DURATION_MS = 3000
export const WAIT_DURATION_TO_SHOW_STATS_MS = 1500
