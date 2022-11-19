<script lang="ts">
  import Guess from './Guess.svelte'
  import Notification from './Notification.svelte'
  import { openStatsModal } from './Statistics.svelte'
  import Keyboard from './keyboard/Keyboard.svelte'
  import {
    getGuessErrorMessage,
    getLossMessage,
    getWinMessage,
  } from './message'
  import { game, keyboard, notification, ui } from './store'
  import { WAIT_DURATION_TO_SHOW_STATS_MS } from '@/constants'

  function assert() {
    if (game === undefined || keyboard === undefined || ui === undefined) {
      throw new Error('stores not initialized')
    }
  }

  function submitGuess() {
    const guessError = game.submitGuess()

    if ($game.status === 'win') {
      $notification = {
        type: 'win',
        message: getWinMessage(),
      }
    } else if ($game.status === 'lose') {
      $notification = {
        type: 'loss',
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
        setTimeout(openStatsModal, WAIT_DURATION_TO_SHOW_STATS_MS)
      }
    }
  }

  assert()
</script>

<div
  class="tw-container tw-min-h-full tw-mx-auto tw-flex tw-flex-nowrap tw-flex-col"
>
  <div class="tw-my-auto tw-py-1.5 md:tw-py-3 tw-mx-2">
    {#each { length: $ui.nRows } as _, rowIndex}
      <div class={$ui.nRows > 1 ? 'tw-mb-4 md:tw-mb-6' : ''}>
        {#each { length: $game.config.nGuesses } as _, guessIndex}
          <div
            class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-4 tw-my-1"
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
                <Guess answerLength={$game.config.answerLength} />
              {/if}
            {/each}
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <div class="tw-sticky tw-bottom-0 tw-mx-2 tw-bg-app-bg">
    <Keyboard on:submit={submitGuess} />
  </div>
</div>

<div
  class="tw-w-full tw-fixed tw-top-7 tw-flex tw-flex-nowrap tw-justify-center"
>
  <Notification />
</div>
