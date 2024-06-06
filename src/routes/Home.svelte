<script context="module" lang="ts">
  import type * as Wordle from '@/lib/wordle'
  import { writable } from 'svelte/store'

  const gameMode = writable<Wordle.GameMode>('daily')
</script>

<script lang="ts">
  import Badge from '@/components/ui/core/Badge.svelte'
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import LinkButton from '@/components/ui/core/LinkButton.svelte'
  import Wordle1Icon from '@/components/ui/icons/Wordle1.svelte'
  import Wordle2Icon from '@/components/ui/icons/Wordle2.svelte'
  import Wordle3Icon from '@/components/ui/icons/Wordle3.svelte'
  import { GAMES, GAME_MODES } from '@/constants'
  import CustomGameGenerator from '@/routes/CustomGameGenerator.svelte'

  const icons = [undefined, Wordle1Icon, Wordle2Icon, Wordle3Icon] as const

  const gameDescriptions = [
    'invalid',
    '일반적인 워들 게임입니다.',
    '워들 2문제를 동시에 풀어보세요.',
    '워들 3문제를 동시에 풀어보세요.',
  ] as const
</script>

<div
  class="tw-max-w-sm tw-min-h-full tw-mx-auto tw-p-3 tw-flex tw-flex-col tw-flex-nowrap tw-items-center"
>
  <div
    class="tw-w-full tw-mb-6 tw-inline-flex tw-justify-evenly tw-gap-2 tw-border-b tw-border-app-text-secondary md:tw-text-lg tw-font-medium"
  >
    {#each GAME_MODES as mode}
      <ClickButton
        on:click={() => ($gameMode = mode.id)}
        disabled={mode.disabled}
      >
        <div class="tab-button" class:selected={$gameMode === mode.id}>
          {mode.name}
        </div>
      </ClickButton>
    {/each}
  </div>

  {#if $gameMode === 'custom'}
    <CustomGameGenerator />
  {:else}
    <div class="tw-w-full tw-flex tw-flex-col tw-gap-3">
      {#each GAMES.filter((game) => game.mode === $gameMode) as game}
        <LinkButton url={game.link} useRouter underline={false}>
          <div
            class="tw-w-full tw-px-2.5 tw-py-5 tw-flex tw-gap-1.5 tw-border tw-border-app-text-secondary tw-rounded-lg tw-shadow-md"
          >
            <svelte:component this={icons[game.nWordles]} />
            <div
              class="tw-flex tw-flex-col tw-justify-evenly tw-items-start tw-gap-1"
            >
              <Badge>{game.answerLength}글자</Badge>
              <span class="tw-text-sm tw-break-keep"
                >{gameDescriptions[game.nWordles]}</span
              >
            </div>
          </div>
        </LinkButton>
      {/each}
    </div>
  {/if}
</div>

<style>
  .tab-button {
    padding: 0.5rem 0;
    border-bottom: 2px solid;
    border-color: transparent;
  }

  .tab-button:not(:disabled):not(.selected):hover {
    border-color: var(--neutral-color);
  }

  .tab-button.selected {
    border-color: var(--primary-color);
  }
</style>
