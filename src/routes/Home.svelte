<script lang="ts">
  import Badge from '@/components/ui/core/Badge.svelte'
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import LinkButton from '@/components/ui/core/LinkButton.svelte'
  import Wordle1x2Icon from '@/components/ui/icons/Wordle1x2.svelte'
  import Wordle2x2Icon from '@/components/ui/icons/Wordle2x2.svelte'
  import Wordle3x2Icon from '@/components/ui/icons/Wordle3x2.svelte'
  import { ROUTES } from '@/constants'
  import type * as Wordle from '@/lib/wordle'

  type IconComponent = any

  interface Game {
    readonly link: string
    readonly type: Wordle.GameType
    readonly answerLength: number
    readonly icon: IconComponent
    readonly description: string
    readonly disabled?: boolean
  }

  let gameType: Wordle.GameType = 'daily'

  const games: readonly Game[] = [
    {
      link: ROUTES.game.d1x2,
      type: 'daily',
      answerLength: 2,
      icon: Wordle1x2Icon,
      description: '일반적인 워들 게임입니다.',
    },
    {
      link: ROUTES.game.d2x2,
      type: 'daily',
      answerLength: 2,
      icon: Wordle2x2Icon,
      description: '워들 두 문제를 동시에 풀어보세요.',
    },
    {
      link: ROUTES.game.d3x2,
      type: 'daily',
      answerLength: 2,
      icon: Wordle3x2Icon,
      description: '워들 세 문제를 동시에 풀어보세요.',
    },
    {
      link: ROUTES.game.f1x2,
      type: 'free',
      answerLength: 2,
      icon: Wordle1x2Icon,
      description: '일반적인 워들 게임입니다.',
    },
    {
      link: ROUTES.game.f2x2,
      type: 'free',
      answerLength: 2,
      icon: Wordle2x2Icon,
      description: '워들 두 문제를 동시에 풀어보세요.',
    },
    {
      link: ROUTES.game.f3x2,
      type: 'free',
      answerLength: 2,
      icon: Wordle3x2Icon,
      description: '워들 세 문제를 동시에 풀어보세요.',
    },
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
      <ClickButton on:click={() => (gameType = 'daily')}>
        <div class="tab-button" class:selected={gameType === 'daily'}>
          오늘의 문제
        </div>
      </ClickButton>
      <ClickButton on:click={() => (gameType = 'free')}>
        <div class="tab-button" class:selected={gameType === 'free'}>
          자유 도전
        </div>
      </ClickButton>
      <ClickButton on:click={() => (gameType = 'custom')} disabled>
        <div class="tab-button" class:selected={gameType === 'custom'}>
          커스텀 게임
        </div>
      </ClickButton>
    </div>
  </div>

  <div class="tw-flex tw-flex-wrap tw-justify-center tw-items-stretch tw-gap-3">
    {#if gameType !== 'custom'}
      {#each games.filter((game) => game.type === gameType) as game}
        <LinkButton
          url={game.link}
          useRouter
          underline={false}
          disabled={game.disabled}
        >
          <div class="card tw-shadow-md">
            <div class="tw-inline-flex tw-items-end tw-gap-2 tw-mb-4">
              <svelte:component this={game.icon} />
              <Badge rounded="lg">{game.answerLength}글자</Badge>
            </div>
            <span class="tw-text-sm">{game.description}</span>
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
