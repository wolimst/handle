<script lang="ts">
  import GameGenerator from './custom-game/CustomGameGenerator.svelte'
  import PageNotFound from '@/NotFound.svelte'
  import Game from '@/components/wordle/Game.svelte'
  import { initializeWordleStores } from '@/components/wordle/store'
  import * as Wordle from '@/lib/wordle'

  interface Param {
    code?: string
  }

  export let params: Param = {}

  type PageStatus = 'loading' | 'success' | 'fail'
  let pageStatus: PageStatus = 'loading'

  function parse(code?: string) {
    pageStatus = 'loading'

    if (!code) {
      pageStatus = 'fail'
      return
    }

    const parseResult = Wordle.parseCode(code)
    if (!parseResult) {
      pageStatus = 'fail'
      return
    }

    const gameInstance = new Wordle.Game(
      parseResult.config,
      parseResult.answers
    )
    initializeWordleStores(gameInstance)
    pageStatus = 'success'
  }

  $: parse(params.code)
</script>

{#if params.code}
  {#if pageStatus === 'loading'}
    Loading
  {:else if pageStatus === 'success'}
    <Game />
  {:else}
    <PageNotFound />
  {/if}
{:else}
  <GameGenerator />
{/if}
