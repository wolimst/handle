const KST_OFFSET_HOURS = -9
const SECOND_MS = 1_000
const MINUTE_MS = 60_000
const HOUR_MS = 3_600_000

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

export function getShortDateStringInKST(): string {
  return new Date()
    .toLocaleDateString('ko', {
      timeZone: 'Asia/Seoul',
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\s+/g, '')
}
