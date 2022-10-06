export const APP_NAME = '한들'

export const BASE_URL: string = import.meta.env.BASE_URL.replace(/\/+$/g, '')
export const PRODUCTION: boolean = import.meta.env.PROD

export const ROUTES = {
  home: '/',
  fontViewer: '/font',
  game: {
    d1x2: '/daily/1x2',
    d2x2: '/daily/2x2',
    d3x2: '/daily/3x2',
    f1x2: '/free/1x2',
    f2x2: '/free/2x2',
    f3x2: '/free/3x2',
  },
} as const

/**
 * A lookup table for the number of guesses of a game.
 *
 * Row index represents the number of wordles in a game, and column index
 * represents the answer length, e.g. if `nWordles = 2`, `answerLength = 1`
 * then `nGuesses = N_GUESSES[2][1]`
 */
export const N_GUESSES: readonly (readonly number[])[] = [
  [],
  [-1, -1, 6],
  [-1, -1, 8],
  [-1, -1, 10],
] as const

/**
 * Maximum number of wordles that could be displayed for each row on the screen.
 *
 * Array index corresponds to the answer length of the wordle,
 * i.e. `N_WORDLES_PER_ROW[2]` is #wordles/row when the answer length is 2.
 */
export const N_WORDLES_PER_ROW = [-1, 4, 4, 3] as const

export const ALERT_DURATION_MS = 3000
