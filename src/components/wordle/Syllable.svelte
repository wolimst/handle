<script lang="ts">
  import type * as Hangul from '@/lib/hangul'
  import * as Path from '@/lib/path'
  import { onMount } from 'svelte'

  export let syllable: Hangul.Syllable | undefined = undefined
  // Default colors to distinguish Jamo
  export let colors: Path.SyllableColor = {
    background: undefined,
    leadingConsonant: '#1956B0',
    vowels: ['#60AB9E', '#A6BE54'],
    trailingConsonant: ['#FEDA8B', '#F67E4B'],
  }

  let svgElement: SVGElement

  function assert() {
    const isValidHexString = [
      colors.leadingConsonant,
      ...colors.vowels,
      ...colors.trailingConsonant,
    ].every((color) => /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color))
    if (!isValidHexString) {
      throw new Error('invalid hexidecimal color values')
    }

    const isValidArraySize =
      syllable === undefined ||
      (colors.vowels.length >= syllable.vowels.length &&
        colors.trailingConsonant.length >= syllable.trailingConsonants.length)
    if (!isValidArraySize) {
      throw new Error('insufficient Jamo colors')
    }
  }

  type Color = string
  type PathAttributes = readonly [Path.DProperty, Color]

  let loaded = false
  let viewBox = '0 0 1 1'
  let paths: readonly PathAttributes[] = []

  async function draw() {
    if (syllable) {
      const drawableSyllable = await Path.getDrawableSyllable(syllable)

      const bBox = drawableSyllable.boundingBox
      const minX = bBox.x1 - (Path.FONT.vboxSize - (bBox.x2 - bBox.x1)) / 2
      const minY = bBox.y1 - (Path.FONT.vboxSize - (bBox.y2 - bBox.y1)) / 2
      viewBox = [minX, minY, Path.FONT.vboxSize, Path.FONT.vboxSize].join(' ')

      paths = [
        [drawableSyllable.leadingConsonantPath, colors.leadingConsonant],
        ...drawableSyllable.vowelPaths.map<PathAttributes>((path, i) => [
          path,
          colors.vowels[i],
        ]),
        ...drawableSyllable.trailingConsonantPaths.map<PathAttributes>(
          (path, i) => [path, colors.trailingConsonant[i]]
        ),
      ]
      svgElement.style.backgroundColor = colors.background || ''
    }

    loaded = true
  }

  function onChange(...args: any) {
    assert()
    onMount(() => {
      draw()
    })
  }

  $: onChange(syllable, colors)
</script>

<svg {viewBox} bind:this={svgElement}>
  {#if loaded}
    {#each paths as path}
      <path d={path[0]} fill={path[1]} />
    {/each}
  {/if}
</svg>

<style>
  svg {
    border: 0.2rem solid var(--text-color-secondary);
    border-radius: 0.5rem;
    width: 100%;
    height: 100%;
  }
</style>
