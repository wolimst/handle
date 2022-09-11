<script lang="ts">
  import Guess from './Guess.svelte'
  import Keyboard from './Keyboard.svelte'
  import { N_WORDLES_PER_ROW } from '@/constants'
  import * as Wordle from '@/lib/wordle'

  export let nWordles: number
  export let nGuesses: number
  export let answerLength: number

  let game: Wordle.Game = new Wordle.Game(nWordles, nGuesses, answerLength)
  let keyboardValue = game.keyboard.value

  const nWordlesPerRow = N_WORDLES_PER_ROW[answerLength]
  const nRows = Math.ceil(game.nWordles / nWordlesPerRow)

  function nWordlesThisRow(rowIndex: number): number {
    const nWordlesRemaining = game.nWordles - rowIndex * nWordlesPerRow
    if (nWordlesRemaining > nWordlesPerRow) {
      return nWordlesPerRow
    } else {
      return nWordlesRemaining
    }
  }

  function onInput() {
    keyboardValue = game.keyboard.value
  }

  function submitGuess() {
    game.submitGuess()
    keyboardValue = game.keyboard.value
    game = game
  }
</script>

<div class="tw-container tw-mb-12">
  {#each { length: nRows } as _, rowIndex}
    <div class="tw-mb-6">
      {#each { length: game.nGuesses } as _, guessIndex}
        <div
          class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-4 tw-mx-2 tw-my-1"
        >
          {#each { length: nWordlesThisRow(rowIndex) } as _, colIndex}
            {@const wordleIndex = nWordlesPerRow * rowIndex + colIndex}
            {@const wordle = game.data.wordleData[wordleIndex]}

            {#if guessIndex < wordle.guessResults.length}
              <Guess
                guess={wordle.guessResults[guessIndex]}
                answerLength={game.answerLength}
              />
            {:else if wordle.status === 'playing' && guessIndex === wordle.guessResults.length}
              <Guess guess={keyboardValue} answerLength={game.answerLength} />
            {:else}
              <Guess answerLength={game.answerLength} />
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  {/each}
</div>

<Keyboard keyboard={game.keyboard} on:submit={submitGuess} on:input={onInput} />
