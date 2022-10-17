<script lang="ts">
  import Guess from './Guess.svelte'
  import Alert from './Notification.svelte'
  import { openStatsModal } from './Statistics.svelte'
  import Keyboard from './keyboard/Keyboard.svelte'
  import {
    getGuessErrorMessage,
    getLossMessage,
    getWinMessage,
  } from './message'
  import { game, keyboard, notification, ui } from './store'
  import { GAME_MODES, WAIT_DURATION_TO_SHOW_STATS_MS } from '@/constants'

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
      const showStats =
        GAME_MODES.find((mode) => mode.id === $game.mode)?.useStatistics ||
        false
      if (showStats) {
        setTimeout(openStatsModal, WAIT_DURATION_TO_SHOW_STATS_MS)
      }
    }
  }

  assert()
</script>

<div class="tw-flex tw-flex-nowrap tw-justify-center">
  <Alert />
</div>

<div class="tw-container tw-mb-12">
  {#each { length: $ui.nRows } as _, rowIndex}
    <div class="tw-mb-6">
      {#each { length: $game.nGuesses } as _, guessIndex}
        <div
          class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-4 tw-mx-2 tw-my-1"
        >
          {#each { length: ui.nWordlesAtRow(rowIndex) } as _, colIndex}
            {@const wordleIndex = $ui.nWordlesPerRow * rowIndex + colIndex}
            {@const wordle = $game.wordleData[wordleIndex]}

            {#if guessIndex < wordle.guessResults.length}
              <Guess
                guess={wordle.guessResults[guessIndex]}
                answerLength={$game.answerLength}
              />
            {:else if wordle.status === 'playing' && guessIndex === wordle.guessResults.length}
              <Guess guess={$keyboard} answerLength={$game.answerLength} />
            {:else}
              <Guess answerLength={$game.answerLength} />
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  {/each}
</div>

<Keyboard on:submit={submitGuess} />
