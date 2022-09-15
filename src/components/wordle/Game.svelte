<script lang="ts">
  import Alert from './Alert.svelte'
  import Guess from './Guess.svelte'
  import Keyboard from './Keyboard.svelte'
  import { getAlertMessage } from './message'
  import { alert, game, keyboard, ui } from './store'

  function assert() {
    if (game === undefined || keyboard === undefined || ui === undefined) {
      throw new Error('stores not initialized')
    }
  }

  function submitGuess() {
    const guessError = game.submitGuess()
    if (guessError) {
      $alert = getAlertMessage(guessError)
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
              <Guess guess={wordle.guessResults[guessIndex]} />
            {:else if wordle.status === 'playing' && guessIndex === wordle.guessResults.length}
              <Guess guess={$keyboard} />
            {:else}
              <Guess />
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  {/each}
</div>

<Keyboard on:submit={submitGuess} />
