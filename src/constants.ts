export const PRODUCTION: boolean = import.meta.env.PROD
export const ROUTES = {
  home: '/',
  fontViewer: '/font',
} as const

/**
 * Maximum number of wordles that could be displayed for each row on the screen.
 *
 * Array index corresponds to the answer length of the wordle,
 * i.e. `N_WORDLES_PER_ROW[2]` is #wordles/row when the answer length is 2.
 */
export const N_WORDLES_PER_ROW = [0, 4, 4, 3, 2, 2] as const

export const ALERT_DURATION_MS = 3000
