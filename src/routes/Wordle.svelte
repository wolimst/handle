<script lang="ts">
  import Game from '@/components/wordle/Game.svelte'
  import { initializeWordleStores } from '@/components/wordle/store'
  import { GAMES, N_GUESSES } from '@/constants'
  import * as Wordle from '@/lib/wordle'

  export let path: string

  function initialize() {
    const game = GAMES.find((game) => game.link === path)
    if (game === undefined) {
      throw new Error('invalid game page')
    }

    const config = Wordle.GameConfig.getGameConfig(
      game.mode,
      game.nWordles,
      game.answerLength,
      N_GUESSES[game.nWordles][game.answerLength]
    )
    const gameInstance = new Wordle.Game(config)
    initializeWordleStores(gameInstance)
  }

  initialize()
</script>

<Game />
