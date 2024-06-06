<script context="module" lang="ts">
  import { writable } from 'svelte/store'

  const open = writable(false)

  export function openStatsModal() {
    open.set(true)
  }

  export function closeStatsModal() {
    open.set(false)
  }
</script>

<script lang="ts">
  import { game } from './store'
  import { openShareModal } from './Share.svelte'
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import LinkButton from '@/components/ui/core/LinkButton.svelte'
  import Modal from '@/components/ui/core/Modal.svelte'
  import Select, { type Option } from '@/components/ui/core/Select.svelte'
  import ArrowLeftIcon from '@/components/ui/icons/ArrowLeft.svelte'
  import ArrowRightIcon from '@/components/ui/icons/ArrowRight.svelte'
  import ArrowRightCircleIcon from '@/components/ui/icons/ArrowRightCircle.svelte'
  import ClockIcon from '@/components/ui/icons/Clock.svelte'
  import RefreshIcon from '@/components/ui/icons/Refresh.svelte'
  import ShareIcon from '@/components/ui/icons/Share.svelte'
  import SpinnerIcon from '@/components/ui/icons/Spinner.svelte'
  import StatisticsIcon from '@/components/ui/icons/Statistics.svelte'
  import {
    GAMES,
    GAME_MODES,
    N_GUESSES,
    RETENTION_PERIOD_DAY,
    WORDLE_NAMES,
  } from '@/constants'
  import { time } from '@/lib/utils'
  import * as Wordle from '@/lib/wordle'
  import { isInGamePage, refreshIfAlreadyInPage } from '@/routes/page'
  import { notification } from '@/stores/app'
  import {
    defaultStats,
    leaderboard,
    savedata,
    statistics,
  } from '@/stores/wordle'
  import { onDestroy } from 'svelte'
  import { get } from 'svelte/store'

  function toggleModal() {
    $open = !$open
  }

  interface GameModeOption extends Option {
    id: string | number
  }
  interface GameTypeOption extends Option {
    nWordles: number
    answerLength: number
  }

  const gameModeOptions: GameModeOption[] = GAME_MODES.filter(
    (mode) => mode.useStatistics
  ).map((mode) => {
    return {
      id: mode.id,
      text: mode.name,
    }
  })

  // Assume game modes that use statistics have same game types (nWordles & answerLength)
  const gameTypeOptions: GameTypeOption[] = GAMES.filter(
    (game) => game.mode === gameModeOptions[0].id
  ).map((game) => {
    return {
      id: game.link,
      text: `${WORDLE_NAMES[game.nWordles]} (${game.answerLength}글자)`,
      nWordles: game.nWordles,
      answerLength: game.answerLength,
    }
  })

  let gameMode = gameModeOptions[0]
  let gameType = gameTypeOptions[0]

  let stats = defaultStats
  let maxGuess = 0

  let nextGameCountdownMillis = 0
  let countdownIntervalId: number

  let leaderboardDate = time.getCurrentKSTDate()
  let refreshingLeaderboard = false

  function countdownByOneSecond() {
    nextGameCountdownMillis -= 1000
    if (nextGameCountdownMillis <= 0) {
      window.clearInterval(countdownIntervalId)
    }
  }

  function decreaseLeaderboardDate() {
    leaderboardDate = new Date(leaderboardDate.getTime() - time.DAY_MS)
  }

  function increaseLeaderboardDate() {
    leaderboardDate = new Date(leaderboardDate.getTime() + time.DAY_MS)
  }

  function updateStatistics() {
    stats = statistics.getStats(
      Wordle.getGameTypeString(
        gameMode.id as Wordle.GameMode,
        gameType.nWordles,
        gameType.answerLength
      )
    )

    maxGuess = 0
    for (const [key, value] of Object.entries(stats.guesses)) {
      if (key === 'fail') {
        continue
      }
      maxGuess = Math.max(maxGuess, value)
    }

    window.clearInterval(countdownIntervalId)
    nextGameCountdownMillis = 0
    if (gameMode.id === 'daily') {
      if ($leaderboard.nextUpdateDate < new Date()) {
        void refreshLeaderboard()
      }

      const configId = Wordle.generateConfigId(
        gameMode.id as Wordle.GameMode,
        gameType.nWordles,
        gameType.answerLength
      )
      const data = savedata.loadByConfigId(configId).at(-1)
      if (
        data === undefined ||
        (data.status === 'win' && Wordle.isDailyBonusAvailable(data)) ||
        data.status === 'playing'
      ) {
        return
      }

      nextGameCountdownMillis = time.getMillisecondsToMidnightInKST()
      countdownIntervalId = window.setInterval(countdownByOneSecond, 1000)
    }
  }

  async function refreshLeaderboard() {
    refreshingLeaderboard = true
    const result = await leaderboard.refresh()
    if (!result) {
      $notification = {
        type: 'error',
        message: '오늘의 기록을 불러오지 못했어요.',
      }
    }
    refreshingLeaderboard = false
  }

  function onOpen() {
    if (isInGamePage()) {
      const store = get(game)
      gameMode =
        gameModeOptions.find(
          (option) => option.id === store.data.config.mode
        ) || gameMode
      gameType =
        gameTypeOptions.find(
          (option) =>
            option.nWordles === store.data.config.nWordles &&
            option.answerLength === store.data.config.answerLength
        ) || gameType
    }
  }

  function getNextGameTypeString(
    gameMode: GameModeOption,
    gameType: GameTypeOption
  ): string {
    if (gameMode.id === 'daily') {
      const configId = Wordle.generateConfigId(
        gameMode.id as Wordle.GameMode,
        gameType.nWordles,
        gameType.answerLength
      )
      const dailyGames = savedata.loadByConfigId(configId)
      const latestGame = dailyGames.at(-1)
      if (
        dailyGames.length > 1 ||
        (latestGame && Wordle.isDailyBonusAvailable(latestGame))
      ) {
        return '🔥보너스'
      } else {
        return '오늘의'
      }
    } else {
      return '새로운'
    }
  }

  onDestroy(() => {
    window.clearInterval(countdownIntervalId)
  })
</script>

<ClickButton on:click={toggleModal}>
  <StatisticsIcon width={22} />
</ClickButton>

<Modal bind:open={$open} title="통계" widthCss="25rem" on:open={onOpen}>
  <div class="tw-w-full tw-inline-flex tw-justify-evenly">
    <Select
      title="게임 모드"
      options={gameModeOptions}
      bind:selected={gameMode}
      on:select={updateStatistics}
    />

    <Select
      title="게임 종류"
      options={gameTypeOptions}
      bind:selected={gameType}
      on:select={updateStatistics}
    />
  </div>

  <div class="tw-w-full tw-mt-6 tw-inline-flex tw-justify-evenly tw-gap-0.5">
    <div class="tw-grow tw-basis-0 tw-text-center">
      <div class="tw-text-sm tw-whitespace-nowrap">플레이</div>
      <div class="tw-text-2xl tw-font-bold">{stats.nGamesPlayed}</div>
    </div>
    <div class="tw-grow tw-basis-0 tw-text-center">
      <div class="tw-text-sm tw-whitespace-nowrap">정답률</div>
      <div class="tw-text-2xl tw-font-bold">
        {Math.round((stats.nGamesWon / stats.nGamesPlayed) * 100) || 0}%
      </div>
    </div>
    <div class="tw-grow tw-basis-0 tw-text-center">
      <div class="tw-text-sm tw-whitespace-nowrap">연속</div>
      <div class="tw-text-2xl tw-font-bold">{stats.winStreak}</div>
    </div>
    <div class="tw-grow tw-basis-0 tw-text-center">
      <div class="tw-text-sm tw-tracking-tighter tw-whitespace-nowrap">
        최다 연속
      </div>
      <div class="tw-text-2xl tw-font-bold">{stats.maxWinStreak}</div>
    </div>
  </div>

  <div
    class="tw-w-full tw-mt-4 tw-px-2 tw-inline-flex tw-flex-col tw-items-center"
  >
    <div class="tw-font-medium">
      <span class="tw-mr-0.5">✅</span><span>추측 횟수 분포</span>
    </div>
    {#each { length: N_GUESSES[gameType.nWordles][gameType.answerLength] - gameType.nWordles + 1 } as _, i}
      {@const n = i + gameType.nWordles}
      {@const guess = stats.guesses[n] || 0}
      {@const percentage = (guess / maxGuess) * 100 || 0}
      <div class="tw-text-sm tw-w-full tw-mt-1 tw-inline-flex tw-items-center">
        <div class="tw-w-6 tw-text-center tw-mr-1">{n}</div>
        <div class="tw-w-full">
          <div
            class="tw-px-1 tw-text-right tw-text-gray-100 tw-rounded tw-bg-app-primary"
            style={`width: ${percentage}%; min-width: 1rem;`}
          >
            {guess}
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#if gameMode.id === 'daily'}
    <div
      class="tw-w-full tw-mt-4 tw-px-2 tw-inline-flex tw-flex-col tw-items-center"
    >
      {#if leaderboard}
        {@const configId = Wordle.generateConfigId(
          gameMode.id,
          gameType.nWordles,
          gameType.answerLength,
          leaderboardDate
        )}
        <div
          class="tw-w-full tw-relative tw-inline-flex tw-items-center tw-justify-center tw-gap-1.5"
        >
          <ClickButton
            on:click={decreaseLeaderboardDate}
            disabled={time.getCurrentKSTDate().getTime() -
              leaderboardDate.getTime() >=
              RETENTION_PERIOD_DAY * time.DAY_MS}
          >
            <ArrowLeftIcon width={16} />
          </ClickButton>
          <div class="tw-font-medium">
            <span class="tw-mr-0.5">✨</span><span>
              {#if leaderboardDate.getTime() !== time
                  .getCurrentKSTDate()
                  .getTime()}{`${leaderboardDate.getMonth() + 1}월${leaderboardDate.getDate()}일`}{:else}오늘{/if}의
              기록</span
            >
          </div>
          <ClickButton
            on:click={increaseLeaderboardDate}
            disabled={leaderboardDate.getTime() ===
              time.getCurrentKSTDate().getTime()}
          >
            <ArrowRightIcon width={16} />
          </ClickButton>
          <div
            class="tw-absolute tw-right-0 tw-inline-flex tw-items-center tw-gap-1"
          >
            {#if refreshingLeaderboard}
              <SpinnerIcon width={16} />
            {/if}
            <ClickButton on:click={refreshLeaderboard}>
              <RefreshIcon width={16} />
            </ClickButton>
          </div>
        </div>
        {#if !$leaderboard.data[configId] || $leaderboard.data[configId].length === 0}
          <div class="tw-text-sm tw-mt-1">
            {#if leaderboardDate.getTime() === time
                .getCurrentKSTDate()
                .getTime()}
              첫 도전자가 되어보세요!
            {:else}
              앗, 플레이 기록이 없어요
            {/if}
          </div>
        {:else}
          <div
            class="leaderboard tw-items-center tw-w-full tw-mt-1 tw-text-sm tw-gap-0.5"
          >
            {#each $leaderboard.data[configId] as item, i}
              {@const bonusCount = Number(item.gameId.split('-').at(-1))}
              <div>
                {#if i === 0}
                  🥇
                {:else if i === 1}
                  🥈
                {:else if i === 2}
                  🥉
                {/if}
              </div>
              <div class="tw-justify-self-start">
                {item.user.name}
              </div>
              <div class="tw-ml-1">
                {#if bonusCount && bonusCount > 0}
                  🔥<span data-tooltip="보너스"
                    >+{Number(item.gameId.split('-').at(-1))}
                  </span>
                {/if}
              </div>
              <div class="tw-ml-1">✅</div>
              <div>{item.guesses.length}</div>
            {/each}
          </div>
        {/if}
      {/if}
    </div>
  {/if}

  {#if gameMode.id === 'daily' || gameMode.id === 'free'}
    <div
      class="tw-mt-5 tw-w-full tw-inline-flex tw-justify-around tw-items-center"
    >
      {#if nextGameCountdownMillis > 0}
        <div class="tw-inline-flex tw-items-center">
          <ClockIcon width={18} />
          <span class="tw-ml-1.5 tw-font-medium">다음 문제까지</span>
          <span class="tw-ml-1 tw-font-medium tw-tabular-nums tw-text-sm">
            {time.millisecondsToHHMMSS(nextGameCountdownMillis)}
          </span>
        </div>
      {:else}
        {@const path = GAMES.find(
          (game) =>
            game.mode === gameMode.id &&
            game.nWordles === gameType.nWordles &&
            game.answerLength === gameType.answerLength
        )?.link}
        <LinkButton
          url={path}
          useRouter
          on:click={() => {
            closeStatsModal()
            path && refreshIfAlreadyInPage(path)
          }}
        >
          <ArrowRightCircleIcon width={18} />
          <span class="tw-ml-1 tw-font-medium">
            {getNextGameTypeString(gameMode, gameType)} 문제 풀기
          </span>
        </LinkButton>
      {/if}

      {#if isInGamePage()}
        <ClickButton
          on:click={() => {
            closeStatsModal()
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            openShareModal()
          }}
        >
          <ShareIcon width={18} />
          <span class="tw-ml-1.5 tw-font-medium">공유하기</span>
        </ClickButton>
      {/if}
    </div>
  {/if}
</Modal>

<style>
  .leaderboard {
    display: grid;
    grid-template-columns: max-content auto max-content max-content max-content;
  }
</style>
