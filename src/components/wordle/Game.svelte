<script lang="ts">
  import Guess from './Guess.svelte'
  import Keyboard from './Keyboard.svelte'
  import * as Wordle from '@/lib/wordle'

  export let nWordles: number
  export let nGuesses: number
  export let answerLength: number

  let game: Wordle.Game = new Wordle.Game(nWordles, nGuesses, answerLength)
  let keyboardValue = game.keyboard.value

  function onInput() {
    keyboardValue = game.keyboard.value
  }

  function submitGuess() {
    game.submitGuess()
    keyboardValue = game.keyboard.value
    game = game
  }
</script>

<div
  class="tw-container tw-inline-flex tw-flex-col tw-items-center tw-justify-between"
>
  <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-8 tw-justify-center">
    {#each game.data.wordleData as wordle}
      <div class="tw-inline-flex tw-flex-col tw-gap-2 tw-items-center">
        {#each wordle.guessResults as guessResult}
          <Guess guess={guessResult} answerLength={game.answerLength} />
        {/each}
        {#if wordle.status === 'playing'}
          {#if game.remainingGuesses > 0}
            <Guess guess={keyboardValue} answerLength={game.answerLength} />
          {/if}
          {#if game.remainingGuesses > 1}
            {#each { length: game.remainingGuesses - 1 } as _}
              <Guess answerLength={game.answerLength} />
            {/each}
          {/if}
        {/if}
      </div>
    {/each}
  </div>

  <div class="tw-my-4">
    <Keyboard
      keyboard={game.keyboard}
      on:submit={submitGuess}
      on:input={onInput}
    />
  </div>
</div>
