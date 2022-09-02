<script lang="ts">
  import Syllable from '@/components/wordle/Syllable.svelte'
  import * as Hangul from '@/lib/hangul'
  import type * as Path from '@/lib/path'
  import { inView } from '@/lib/svelte-actions/inView'

  const colors: Path.SyllableColor = {
    background: undefined,
    leadingConsonant: '#1956B0',
    vowels: ['#60AB9E', '#A6BE54'],
    trailingConsonant: ['#FEDA8B', '#F67E4B'],
  }

  let page = 0
  const loadSize = 1000

  let syllables: Hangul.Syllable[] = []
  function load() {
    const start = Hangul.FIRST_SYLLABLE + page * loadSize
    if (Hangul.LAST_SYLLABLE < start) {
      return
    }

    const codePoints = Array(loadSize)
      .fill(0)
      .map((_, i) => start + i)
    const str = String.fromCodePoint(...codePoints)
    syllables.push(...Hangul.toWord(str).syllables)
    syllables = syllables

    page += 1
  }

  load()
</script>

<div class="tw-flex tw-flex-wrap tw-gap-1 tw-container">
  {#each syllables as syllable}
    <div class="tw-w-12 tw-h-12">
      <Syllable {syllable} {colors} />
    </div>
  {/each}

  <div use:inView on:enter={() => load()} />
</div>
