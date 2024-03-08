<script lang="ts">
  import { game, ui } from '../store'
  import * as Hangul from '@/lib/hangul'
  import type * as Wordle from '@/lib/wordle'

  export let key: string
  export let size: 'compact' | 'normal' | 'wide' = 'normal'
  export let disabled = false

  let textColor = 'tw-text-app-text'

  const width = getWidth()

  function getWidth(): string {
    if (size === 'compact') {
      return 'tw-w-5 md:tw-w-5 lg:tw-w-6'
    } else if (size === 'wide') {
      return 'tw-w-12 md:tw-w-14 lg:tw-w-16'
    } else {
      return 'tw-w-10 md:tw-w-10 lg:tw-w-12'
    }
  }

  function isJamoKey(key: string): key is Hangul.DubeolsikJamo {
    return Hangul.getCodePointLength(key) === 1 && Hangul.isHangulJamo(key)
  }

  function getKeyHintColor(result?: Wordle.JamoResult): string {
    textColor = 'tw-text-app-text-invert'
    switch (result) {
      case 'correct':
        return 'tw-bg-app-wordle-correct'
      case 'present':
        return 'tw-bg-app-wordle-present'
      case 'absent':
        return 'tw-bg-app-wordle-absent'
      default:
        textColor = 'tw-text-app-text'
        return 'tw-bg-transparent'
    }
  }
</script>

<button
  class="{width} tw-h-11 md:tw-h-12 lg:tw-h-14 tw-rounded tw-bg-app-keyboard-bg tw-relative tw-overflow-hidden"
  on:click
  {disabled}
>
  <div
    class="tw-w-full tw-h-full tw-absolute tw-top-0 md:tw-text-lg tw-font-bold {textColor} tw-bg-transparent tw-flex tw-flex-nowrap tw-justify-center tw-items-center"
  >
    <slot>{key}</slot>
  </div>
  {#if isJamoKey(key)}
    <div class="tw-w-full tw-h-full tw-flex tw-flex-nowrap tw-flex-col">
      {#each { length: $ui.nRows } as _, rowIndex}
        <div class="tw-flex tw-flex-nowrap tw-justify-center tw-flex-auto">
          {#each { length: ui.nWordlesAtRow(rowIndex) } as _, colIndex}
            {@const wordleIndex = $ui.nWordlesPerRow * rowIndex + colIndex}
            {@const wordle = $game.wordleData[wordleIndex]}
            <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-argument -->
            <div class="tw-flex-auto {getKeyHintColor(wordle.keyHints[key])}" />
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</button>

<style>
  button:disabled {
    visibility: hidden;
  }
</style>
