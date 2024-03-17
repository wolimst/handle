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
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import LinkButton from '@/components/ui/core/LinkButton.svelte'
  import Modal from '@/components/ui/core/Modal.svelte'
  import Select, { type Option } from '@/components/ui/core/Select.svelte'
  import ClipboardIcon from '@/components/ui/icons/Clipboard.svelte'
  import ClockIcon from '@/components/ui/icons/Clock.svelte'
  import RefreshIcon from '@/components/ui/icons/Refresh.svelte'
  import ShareIcon from '@/components/ui/icons/Share.svelte'
  import StatisticsIcon from '@/components/ui/icons/Statistics.svelte'
  import { GAMES, GAME_MODES, N_GUESSES, WORDLE_NAMES } from '@/constants'
  import { browser, time } from '@/lib/utils'
  import * as Wordle from '@/lib/wordle'
  import { isInGamePage, refreshIfAlreadyInPage } from '@/routes/page'
  import { defaultStats, savedata, statistics } from '@/stores/wordle'
  import { onDestroy } from 'svelte'
  import { get } from 'svelte/store'

  function toggleModal() {
    $open = !$open
  }

  interface GameModeOption extends Option {}
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

  function countdownByOneSecond() {
    nextGameCountdownMillis -= 1000
    if (nextGameCountdownMillis <= 0) {
      window.clearInterval(countdownIntervalId)
    }
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
      const gameId = Wordle.generateGameId(
        gameMode.id as Wordle.GameMode,
        gameType.nWordles,
        gameType.answerLength
      )
      const data = savedata.load(gameId)
      if (data !== undefined && data.status !== 'playing') {
        nextGameCountdownMillis = time.getMillisecondsToMidnightInKST()
        countdownIntervalId = window.setInterval(countdownByOneSecond, 1000)
      }
    }
  }

  function onOpen() {
    if (isInGamePage()) {
      const data = get(game)
      gameMode =
        gameModeOptions.find((option) => option.id === data.config.mode) ||
        gameMode
      gameType =
        gameTypeOptions.find(
          (option) =>
            option.nWordles === data.config.nWordles &&
            option.answerLength === data.config.answerLength
        ) || gameType
    }
  }

  function shareGameAsEmoji() {
    const text = Wordle.getGameShareString(get(game))
    void Wordle.shareResult({ text }).then(() => ($open = false))
  }

  function copyGameAsEmoji() {
    const text = Wordle.getGameShareString(get(game))
    void Wordle.copyResult(text).then(() => ($open = false))
  }

  onDestroy(() => {
    window.clearInterval(countdownIntervalId)
  })
</script>

<ClickButton on:click={toggleModal}>
  <StatisticsIcon />
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
      title="워들 타입"
      options={gameTypeOptions}
      bind:selected={gameType}
      on:select={updateStatistics}
    />
  </div>

  <div class="tw-w-full tw-mt-6 tw-inline-flex tw-justify-evenly">
    <div class="tw-w-1/4 tw-text-center">
      <div class="tw-text-sm">플레이 횟수</div>
      <div class="tw-text-2xl tw-font-bold">{stats.nGamesPlayed}</div>
    </div>
    <div class="tw-w-1/4 tw-text-center">
      <div class="tw-text-sm">정답률</div>
      <div class="tw-text-2xl tw-font-bold">
        {Math.round((stats.nGamesWon / stats.nGamesPlayed) * 100) || 0}%
      </div>
    </div>
    <div class="tw-w-1/4 tw-text-center">
      <div class="tw-text-sm">연속 정답</div>
      <div class="tw-text-2xl tw-font-bold">{stats.winStreak}</div>
    </div>
    <div class="tw-w-1/4 tw-text-center">
      <div class="tw-text-sm">최다 연속 정답</div>
      <div class="tw-text-2xl tw-font-bold">{stats.maxWinStreak}</div>
    </div>
  </div>

  <div
    class="tw-w-full tw-mt-4 tw-px-2 tw-inline-flex tw-flex-col tw-items-center"
  >
    <div class="tw-font-medium">추측 횟수 분포</div>
    {#each { length: N_GUESSES[gameType.nWordles][gameType.answerLength] } as _, i}
      {@const guess = stats.guesses[i + 1] || 0}
      {@const percentage = (guess / maxGuess) * 100 || 0}
      <div class="tw-text-sm tw-w-full tw-mt-1 tw-inline-flex tw-items-center">
        <div class="tw-w-6 tw-text-center tw-mr-1">{i + 1}</div>
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

  {#if gameMode.id === 'daily' || gameMode.id === 'free'}
    <div
      class="tw-mt-4 tw-w-full tw-inline-flex tw-justify-around tw-items-center"
    >
      {#if nextGameCountdownMillis > 0}
        <ClockIcon width={22} />
        <span class="tw-ml-1.5 tw-text-sm tw-font-medium">다음 문제까지</span>
        <span class="tw-ml-1 tw-font-medium tw-tabular-nums">
          {time.millisecondsToHHMMSS(nextGameCountdownMillis)}
        </span>
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
          <RefreshIcon width={22} />
          <span class="tw-ml-1 tw-font-medium">
            {gameMode.id === 'daily' ? '오늘의' : '새로운'} 문제 풀기
          </span>
        </LinkButton>
      {/if}

      {#if isInGamePage()}
        {#if browser.isMobileChromeOrSafari()}
          <ClickButton on:click={shareGameAsEmoji}>
            <ShareIcon width={22} />
            <span class="tw-ml-1.5 tw-font-medium"> 결과 공유 </span>
          </ClickButton>
        {:else}
          <ClickButton on:click={copyGameAsEmoji}>
            <ClipboardIcon width={22} />
            <span class="tw-ml-1.5 tw-font-medium"> 결과 복사 </span>
          </ClickButton>
        {/if}
      {/if}
    </div>
  {/if}
</Modal>
