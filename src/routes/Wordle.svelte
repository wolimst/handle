<script lang="ts">
  import Game from '@/components/wordle/Game.svelte'
  import { initializeWordleStores } from '@/components/wordle/store'
  import { GAMES, N_GUESSES } from '@/constants'

  export let path: string

  function initialize() {
    const game = GAMES.find((game) => game.link === path)
    if (game === undefined) {
      throw new Error('invalid game page')
    }

    initializeWordleStores(
      game.mode,
      game.nWordles,
      game.answerLength,
      N_GUESSES[game.nWordles][game.answerLength]
    )
  }

  initialize()
</script>

<Game />
