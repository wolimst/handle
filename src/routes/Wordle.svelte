<script lang="ts">
  import Game from '@/components/wordle/Game.svelte'
  import { initializeWordleStores } from '@/components/wordle/store'
  import { N_GUESSES } from '@/constants'
  import type * as Wordle from '@/lib/wordle'

  export let path: string

  const supportedGameTypes: readonly Wordle.GameType[] = [
    'daily',
    'free',
    'custom',
  ] as const

  function isGameType(str: string): str is Wordle.GameType {
    return supportedGameTypes.some((gameType) => gameType === str)
  }

  function initialize() {
    const parts = path.split('/').filter((elem) => elem !== '')

    const gameType = parts[0]
    if (!isGameType(gameType)) {
      throw new Error('invalid game type')
    }
    const nWordles = Number(parts[1].split('x')[0])
    const answerLength = Number(parts[1].split('x')[1])
    const nGuesses = N_GUESSES[nWordles][answerLength]

    initializeWordleStores(gameType, nWordles, answerLength, nGuesses)
  }

  initialize()
</script>

<Game />
