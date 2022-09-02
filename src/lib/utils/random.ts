import seedrandom from 'seedrandom'

/**
 * Return a random integer N such that `low <= N < high`
 *
 * @param low lower limit (inclusive)
 * @param high upper limit (exclusive)
 * @param seed a random seed
 */
export function randint(low: number, high: number, seed: string): number {
  const diff = high - low
  const prng: seedrandom.PRNG = seedrandom(seed)
  return Math.floor(prng() * diff) + low
}
