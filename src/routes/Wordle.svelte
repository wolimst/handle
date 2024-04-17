<script lang="ts">
  import PageNotFound from '@/NotFound.svelte'
  import SpinnerIcon from '@/components/ui/icons/Spinner.svelte'
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
    initializeWordleStores(config, config.id)
    pageStatus = 'success'
  }

  $: initialize(path)

  onDestroy(() => {
    deactivateWordleStores()
  })
</script>

{#if pageStatus === 'loading'}
  <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
    <SpinnerIcon />
    <span class="tw-font-bold tw-ml-2">로딩 중...</span>
  </div>
{:else if pageStatus === 'success'}
  <Game />
{:else}
  <PageNotFound />
{/if}
