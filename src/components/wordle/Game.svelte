<script lang="ts">
  import confetti from 'canvas-confetti'
  import Guess from './Guess.svelte'
  import { openStatsModal } from './Statistics.svelte'
  import Keyboard from './keyboard/Keyboard.svelte'
  import {
    getGuessErrorMessage,
    getDailyBonusWinMessage,
    getLossMessage,
    getWinMessage,
  } from './message'
  import { game, keyboard, ui } from './store'
  import {
    DOM_ID_GAME_CONTAINER,
    WAIT_DURATION_TO_SHOW_STATS_MS,
  } from '@/constants'
  import * as Wordle from '@/lib/wordle'
  import { config, notification } from '@/stores/app'
  import { leaderboard } from '@/stores/wordle'

  function assert() {
    if (game === undefined || keyboard === undefined || ui === undefined) {
      throw new Error('stores not initialized')
    }
  }

  function submitGuess() {
    const statusBeforeSubmit = $game.data.status

    const guessError = $game.submitGuess()

    if (Wordle.isDailyBonusAvailable($game.data)) {
      $notification = {
        type: 'wordle-bonus-win',
        message: getDailyBonusWinMessage(),
      }
    } else if ($game.data.status === 'win') {
      $notification = {
        type: 'wordle-win',
        message: getWinMessage(),
      }
    } else if ($game.data.status === 'lose') {
      $notification = {
        type: 'wordle-loss',
        message: getLossMessage($game.getAnswers()!),
      }
    } else {
      if (guessError) {
        $notification = {
          type: 'error',
          message: getGuessErrorMessage(guessError),
        }
      }
    }

    if (
      statusBeforeSubmit === 'playing' &&
      $game.data.status === 'win' &&
      $config.submitResult
    ) {
      // TODO?: handle submit error
      void leaderboard.submitResult($game.data)
    }

    if ($game.data.status !== 'playing') {
      if ($game.data.config.useStatistics) {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-argument
        window.setTimeout(openStatsModal, WAIT_DURATION_TO_SHOW_STATS_MS)
      }
    }

    if ($game.data.status === 'win') {
      const count = 200
      const defaults: confetti.Options = {
        origin: { y: 0.92 },
        gravity: 0.95,
        zIndex: 10001,
      }

      const fire = (particleRatio: number, opts: confetti.Options) =>
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        })

      const fireFromBottom = (velocity = 1) => {
        void fire(0.25, {
          spread: 26,
          startVelocity: 60 * velocity,
        })
        void fire(0.2, {
          spread: 35,
          startVelocity: 50 * velocity,
        })
        void fire(0.35, {
          spread: 60,
          startVelocity: 50 * velocity,
          decay: 0.91,
          scalar: 0.8,
        })
        void fire(0.1, {
          spread: 80,
          startVelocity: 30 * velocity,
          decay: 0.92,
          scalar: 1.2,
        })
        void fire(0.1, {
          spread: 80,
          startVelocity: 50 * velocity,
        })
      }

      const fireFromLeft = () => {
        void confetti({
          ...defaults,
          origin: {
            x: 0.05,
            y: 0.7,
          },
          angle: 70,
        })
      }

      const fireFromRight = () => {
        void confetti({
          ...defaults,
          origin: {
            x: 0.95,
            y: 0.7,
          },
          angle: 110,
        })
      }

      fireFromBottom()

      if (Wordle.isDailyBonusAvailable($game.data)) {
        window.setTimeout(fireFromLeft, 500)
        window.setTimeout(fireFromRight, 750)
        window.setTimeout(fireFromLeft, 1445)
        window.setTimeout(fireFromRight, 1445)
        window.setTimeout(() => fireFromBottom(1.4), 1445)
      }
    }
  }

  assert()
</script>

<div
  class="tw-container tw-min-h-full tw-mx-auto tw-flex tw-flex-nowrap tw-flex-col tw-items-center"
>
  <div
    id={DOM_ID_GAME_CONTAINER}
    class="tw-max-w-full tw-my-auto tw-py-1.5 md:tw-py-3 tw-px-1.5 md:tw-px-3"
  >
    {#each { length: $ui.nRows } as _, rowIndex}
      <div class={$ui.nRows > 1 ? 'tw-mb-4 md:tw-mb-6' : ''}>
        {#each { length: $game.data.config.nGuesses } as _, guessIndex}
          <div
            class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-3 md:tw-gap-4 tw-my-1"
          >
            {#each { length: ui.nWordlesAtRow(rowIndex) } as _, colIndex}
              {@const wordleIndex = $ui.nWordlesPerRow * rowIndex + colIndex}
              {@const wordle = $game.data.wordleData[wordleIndex]}

              {#if guessIndex < wordle.guessResults.length}
                <Guess
                  guess={wordle.guessResults[guessIndex]}
                  answerLength={$game.data.config.answerLength}
                />
              {:else if wordle.status === 'playing' && guessIndex === wordle.guessResults.length}
                <Guess
                  guess={$keyboard.value}
                  answerLength={$game.data.config.answerLength}
                />
              {:else}
                <Guess
                  answerLength={$game.data.config.answerLength}
                  shorterBox={$config.useShorterBox}
                />
              {/if}
            {/each}
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <div
    class="tw-max-w-full tw-sticky tw-bottom-0 tw-px-1.5 md:tw-px-3 tw-bg-app-bg"
  >
    <Keyboard on:submit={submitGuess} />
  </div>
</div>
