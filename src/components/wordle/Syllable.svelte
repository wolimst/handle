<script lang="ts">
  import * as Color from './color'
  import * as Path from '@/lib/path'
  import { onMount } from 'svelte'

  /**
   * A Hangul syllable or string that contains SVG path information
   *
   * This prop should have one of following three types:
   * - `Path.DrawableSyllable`: for a Hangul syllable
   * - `Path.DrawableString`: for a string consists of single codepoint character
   * - `undefined`: for a empty string
   *
   * Default is `undefined`.
   */
  export let drawable: Path.Drawable | undefined = undefined
  /**
   * Jamo colors of a syllable.
   *
   * Applied when the `drawable` prop is a `Path.DrawableSyllable`
   */
  export let syllableColors: Path.SyllableColor = {
    background: undefined,
    leadingConsonant: Color.baseTextColor,
    vowels: [Color.baseTextColor, Color.baseTextColor],
    trailingConsonant: [Color.baseTextColor, Color.baseTextColor],
  }

  let svgElement: SVGElement

  function isDrawableSyllable(
    obj: Path.Drawable | undefined
  ): obj is Path.DrawableSyllable {
    return (
      obj !== undefined &&
      obj.hasOwnProperty('value') &&
      obj.hasOwnProperty('leadingConsonant') &&
      obj.hasOwnProperty('vowels') &&
      obj.hasOwnProperty('trailingConsonants') &&
      obj.hasOwnProperty('leadingConsonantPath') &&
      obj.hasOwnProperty('vowelPaths') &&
      obj.hasOwnProperty('trailingConsonantPaths') &&
      obj.hasOwnProperty('boundingBox')
    )
  }

  function isDrawableString(
    obj: Path.Drawable | undefined
  ): obj is Path.DrawableString {
    return (
      obj !== undefined &&
      obj.hasOwnProperty('value') &&
      obj.hasOwnProperty('path') &&
      obj.hasOwnProperty('boundingBox')
    )
  }

  function assert() {
    if (isDrawableSyllable(drawable)) {
      const isValidArraySize =
        syllableColors.vowels.length >= drawable.vowels.length &&
        syllableColors.trailingConsonant.length >=
          drawable.trailingConsonants.length
      if (!isValidArraySize) {
        throw new Error('insufficient Jamo syllableColors')
      }
    }
  }

  type Color = string
  type PathAttributes = readonly [Path.DProperty, Color]

  let loaded = false
  let viewBox = '0 0 1 1'
  let paths: readonly PathAttributes[] = []

  async function draw() {
    if (drawable) {
      const bBox = drawable.boundingBox
      const minX = bBox.x1 - (Path.FONT.vboxSize - (bBox.x2 - bBox.x1)) / 2
      const minY = bBox.y1 - (Path.FONT.vboxSize - (bBox.y2 - bBox.y1)) / 2
      viewBox = [minX, minY, Path.FONT.vboxSize, Path.FONT.vboxSize].join(' ')
    }

    if (isDrawableSyllable(drawable)) {
      paths = [
        [drawable.leadingConsonantPath, syllableColors.leadingConsonant],
        ...drawable.vowelPaths.map<PathAttributes>((path, i) => [
          path,
          syllableColors.vowels[i],
        ]),
        ...drawable.trailingConsonantPaths.map<PathAttributes>((path, i) => [
          path,
          syllableColors.trailingConsonant[i],
        ]),
      ]
      svgElement.style.backgroundColor = syllableColors.background || ''
    } else if (isDrawableString(drawable)) {
      paths = [[drawable.path, Color.baseTextColor]]
    }

    loaded = true
  }

  function onChange(..._args: any) {
    assert()
    onMount(() => {
      draw()
    })
  }

  $: onChange(drawable, syllableColors)
</script>

<svg {viewBox} bind:this={svgElement} class="tw-w-full tw-h-full">
  {#if loaded}
    {#each paths as path}
      <path d={path[0]} fill={path[1]} />
    {/each}
  {/if}
</svg>
