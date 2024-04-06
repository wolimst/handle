<script lang="ts">
  import confetti from 'canvas-confetti'
  import Guess from './Guess.svelte'
  import { openStatsModal } from './Statistics.svelte'
  import Keyboard from './keyboard/Keyboard.svelte'
  import {
    getGuessErrorMessage,
    getLossMessage,
    getWinMessage,
  } from './message'
  import { game, keyboard, ui } from './store'
  import {
    DOM_ID_GAME_CONTAINER,
    WAIT_DURATION_TO_SHOW_STATS_MS,
  } from '@/constants'
  import { config, notification } from '@/stores/app'

  function assert() {
    if (game === undefined || keyboard === undefined || ui === undefined) {
      throw new Error('stores not initialized')
    }
  }

  function submitGuess() {
    const guessError = game.submitGuess()

    if ($game.status === 'win') {
      $notification = {
        type: 'wordle-win',
        message: getWinMessage(),
      }
    } else if ($game.status === 'lose') {
      $notification = {
        type: 'wordle-loss',
        message: getLossMessage(game.getAnswers()!),
      }
    } else {
      if (guessError) {
        $notification = {
          type: 'error',
          message: getGuessErrorMessage(guessError),
        }
      }
    }

    if ($game.status !== 'playing') {
      if ($game.config.useStatistics) {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-argument
        window.setTimeout(openStatsModal, WAIT_DURATION_TO_SHOW_STATS_MS)
      }
    }

    const initDate = 1712502000000
    if ($game.status === 'win' && new Date().valueOf() - initDate >= 0) {
      const count = 200
      const defaults: confetti.Options = {
        origin: { y: 0.85 },
        gravity: 0.95,
        zIndex: 10001,
      }

      const fire = (particleRatio: number, opts: confetti.Options) =>
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        })

      void fire(0.25, {
        spread: 26,
        startVelocity: 60,
      })
      void fire(0.2, {
        spread: 35,
        startVelocity: 50,
      })
      void fire(0.35, {
        spread: 60,
        startVelocity: 50,
        decay: 0.91,
        scalar: 0.8,
      })
      void fire(0.1, {
        spread: 80,
        startVelocity: 30,
        decay: 0.92,
        scalar: 1.2,
      })
      void fire(0.1, {
        spread: 80,
        startVelocity: 50,
      })
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
        {#each { length: $game.config.nGuesses } as _, guessIndex}
          <div
            class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-3 md:tw-gap-4 tw-my-1"
          >
            {#each { length: ui.nWordlesAtRow(rowIndex) } as _, colIndex}
              {@const wordleIndex = $ui.nWordlesPerRow * rowIndex + colIndex}
              {@const wordle = $game.wordleData[wordleIndex]}

              {#if guessIndex < wordle.guessResults.length}
                <Guess
                  guess={wordle.guessResults[guessIndex]}
                  answerLength={$game.config.answerLength}
                />
              {:else if wordle.status === 'playing' && guessIndex === wordle.guessResults.length}
                <Guess
                  guess={$keyboard}
                  answerLength={$game.config.answerLength}
                />
              {:else}
                <Guess
                  answerLength={$game.config.answerLength}
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
