<script lang="ts">
  import Syllable from './Syllable.svelte'
  import * as Color from './color'
  import * as Path from '@/lib/path'
  import type * as Wordle from '@/lib/wordle'

  /**
   * A guess data to dispay and color the syllables.
   *
   * This prop should have one of following three types:
   * - `Wordle.GuessResult`: for a submitted guess.
   *   Jamo will be colored using the guess result.
   * - `string`: for a guess that is currently being input.
   *   Jamo will not be colored since the guess result is not available yet.
   * - `undefined`: for a remaining guess
   *
   * Default is `undefined`.
   */
  export let guess: Wordle.GuessResult | string | undefined = undefined
  export let answerLength: number

  type Guess = Wordle.GuessResult | string | undefined

  function isSubmittedGuess(guess: Guess): guess is Wordle.GuessResult {
    return (
      guess !== undefined &&
      guess.hasOwnProperty('guess') &&
      guess.hasOwnProperty('result')
    )
  }

  function isOngoingGuess(guess: Guess): guess is string {
    return typeof guess === 'string'
  }

  async function getDrawables(guess: Guess): Promise<Path.Drawable[]> {
    if (isSubmittedGuess(guess)) {
      return await Promise.all(
        guess.guess.syllables.map(Path.getDrawableSyllable)
      )
    } else if (isOngoingGuess(guess)) {
      return await Promise.all(Array.from(guess).map(Path.getDrawableString))
    } else {
      return []
    }
  }

  function getColors(guess: Guess): readonly Path.SyllableColor[] {
    if (isSubmittedGuess(guess)) {
      return guess.result.map((result) => {
        if (result.exact) {
          return {
            background: Color.exactBackgroundColor,
            leadingConsonant: Color.exactTextColor,
            vowels: [Color.exactTextColor, Color.exactTextColor],
            trailingConsonant: [Color.exactTextColor, Color.exactTextColor],
          }
        } else {
          return {
            background: undefined,
            leadingConsonant: Color.getColorFromJamoResult(
              result.leadingConsonant
            ),
            vowels: result.vowels.map(Color.getColorFromJamoResult),
            trailingConsonant: result.trailingConsonants.map(
              Color.getColorFromJamoResult
            ),
          }
        }
      })
    } else {
      return []
    }
  }

  $: drawables = getDrawables(guess)
  $: syllableColors = getColors(guess)
</script>

<div class="tw-inline-flex tw-gap-1 tw-min-w-0 tw-min-h-0">
  {#each { length: answerLength } as _, i}
    <div
      class="tw-w-14 md:tw-w-16 tw-aspect-square tw-border-2 tw-rounded-lg tw-border-solid tw-border-app-text-secondary tw-overflow-hidden"
    >
      {#await drawables then d}
        {#if i < d.length}
          <Syllable drawable={d[i]} syllableColors={syllableColors[i]} />
        {:else}
          <Syllable />
        {/if}
      {/await}
    </div>
  {/each}
</div>
