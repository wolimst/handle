<script lang="ts">
  import Badge from '@/components/ui/core/Badge.svelte'
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import LinkButton from '@/components/ui/core/LinkButton.svelte'
  import Wordle1Icon from '@/components/ui/icons/Wordle1.svelte'
  import Wordle2Icon from '@/components/ui/icons/Wordle2.svelte'
  import Wordle3Icon from '@/components/ui/icons/Wordle3.svelte'
  import { GAMES, GAME_MODES } from '@/constants'
  import type * as Wordle from '@/lib/wordle'

  let gameMode: Wordle.GameMode = 'daily'

  const icons = [undefined, Wordle1Icon, Wordle2Icon, Wordle3Icon] as const

  const descriptions = [
    'invalid',
    '일반적인 워들 게임입니다.',
    '워들 2문제를 동시에 풀어보세요.',
    '워들 3문제를 동시에 풀어보세요.',
  ] as const
</script>

<div
  class="tw-container tw-flex tw-flex-col tw-flex-nowrap tw-items-center tw-gap-8"
>
  <div
    class="tw-flex tw-flex-nowrap tw-justify-center tw-text-lg tw-font-medium"
  >
    <div
      class="tw-inline-flex tw-gap-8 tw-px-2 tw-border-b tw-border-app-text-secondary"
    >
      {#each GAME_MODES as mode}
        <ClickButton
          on:click={() => (gameMode = mode.id)}
          disabled={mode.disabled}
        >
          <div class="tab-button" class:selected={gameMode === mode.id}>
            {mode.name}
          </div>
        </ClickButton>
      {/each}
    </div>
  </div>

  <div class="tw-flex tw-flex-wrap tw-justify-center tw-items-stretch tw-gap-3">
    {#if gameMode !== 'custom'}
      {#each GAMES.filter((game) => game.mode === gameMode) as game}
        <LinkButton url={game.link} useRouter underline={false}>
          <div class="card tw-shadow-md">
            <div class="tw-inline-flex tw-items-end tw-gap-2 tw-mb-4">
              <svelte:component this={icons[game.nWordles]} />
              <Badge rounded="lg">{game.answerLength}글자</Badge>
            </div>
            <span class="tw-text-sm">{descriptions[game.nWordles]}</span>
          </div>
        </LinkButton>
      {/each}
    {/if}
  </div>
</div>

<style>
  .tab-button {
    padding: 0.5rem;
    border-bottom: 2px solid;
    border-color: transparent;
  }

  .tab-button:not(:disabled):not(.selected):hover {
    border-color: var(--neutral-color);
  }

  .tab-button.selected {
    border-color: var(--primary-color);
  }

  .card {
    max-width: 13rem;
    height: 100%;

    overflow: hidden;
    padding: 1.4rem;

    text-align: left;
    word-break: keep-all;

    border: 1px solid;
    border-color: var(--text-color-secondary);
    border-radius: 0.5rem;
  }
</style>
