<script lang="ts">
  import PageNotFound from '@/NotFound.svelte'
  import Game from '@/components/wordle/Game.svelte'
  import {
    deactivateWordleStores,
    initializeWordleStores,
  } from '@/components/wordle/store'
  import { GAMES, N_GUESSES } from '@/constants'
  import * as Wordle from '@/lib/wordle'
  import { onDestroy } from 'svelte'

  export let path: string

  type PageStatus = 'loading' | 'success' | 'fail'
  let pageStatus: PageStatus = 'loading'

  function initialize(path: string) {
    pageStatus = 'loading'

    const game = GAMES.find((game) => game.link === path)
    if (game === undefined) {
      pageStatus = 'fail'
      return
    }

    const config = Wordle.GameConfig.getGameConfig(
      game.mode,
      game.nWordles,
      game.answerLength,
      N_GUESSES[game.nWordles][game.answerLength]
    )
    const gameInstance = new Wordle.Game(config)
    initializeWordleStores(gameInstance)
    pageStatus = 'success'
  }

  $: initialize(path)

  onDestroy(() => {
    deactivateWordleStores()
  })
</script>

{#if pageStatus === 'loading'}
  Loading
{:else if pageStatus === 'success'}
  <Game />
{:else}
  <PageNotFound />
{/if}
