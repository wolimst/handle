export const KST_OFFSET_HOURS = -9
export const SECOND_MS = 1_000
export const MINUTE_MS = SECOND_MS * 60
export const HOUR_MS = MINUTE_MS * 60
export const DAY_MS = HOUR_MS * 24

export function getMillisecondsToMidnightInKST(): number {
  const midnight = new Date().setUTCHours(24 + KST_OFFSET_HOURS, 0, 0, 0)
  const now = new Date().getTime()
  const diff = midnight - now
  return diff >= 0 ? diff : diff + 24 * HOUR_MS
}

export function millisecondsToHHMMSS(milliseconds: number): string {
  const hours = Math.floor(milliseconds / HOUR_MS)
  const minutes = Math.floor(milliseconds / MINUTE_MS) % 60
  const seconds = Math.floor(milliseconds / SECOND_MS) % 60

  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export function getCurrentKSTDate(): Date {
  return new Date(
    new Date().toLocaleDateString('ko', {
      timeZone: 'Asia/Seoul',
    }) + ' GMT+0900'
  )
}

export function getShortDateStringInKST(date?: Date): string {
  const _date = date || new Date()
  return _date
    .toLocaleDateString('ko', {
      timeZone: 'Asia/Seoul',
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\s+/g, '')
}
