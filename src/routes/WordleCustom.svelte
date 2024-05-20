<script lang="ts">
  import CustomGameGenerator from './custom-game/CustomGameGenerator.svelte'
  import PageNotFound from '@/NotFound.svelte'
  import SpinnerIcon from '@/components/ui/icons/Spinner.svelte'
  import Game from '@/components/wordle/Game.svelte'
  import {
    deactivateWordleStores,
    initializeWordleStores,
  } from '@/components/wordle/store'
  import * as Wordle from '@/lib/wordle'
  import { onDestroy } from 'svelte'

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

    initializeWordleStores(
      parseResult.config,
      parseResult.config.id,
      parseResult.answers,
      parseResult.guesses
    )
    pageStatus = 'success'
  }

  $: parse(params.code)

  onDestroy(() => {
    deactivateWordleStores()
  })
</script>

{#if params.code}
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
{:else}
  <CustomGameGenerator />
{/if}
