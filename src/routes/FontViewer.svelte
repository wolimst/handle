<script lang="ts">
  import Syllable from '@/components/wordle/Syllable.svelte'
  import * as Hangul from '@/lib/hangul'
  import * as Path from '@/lib/path'
  import { inView } from '@/lib/svelte-actions/inView'

  let jamoList: Path.DrawableString[] = []
  async function loadJamo() {
    jamoList = await Promise.all(
      Array(Hangul.LAST_JAMO_CODEPOINT - Hangul.FIRST_JAMO_CODEPOINT)
        .fill(0)
        .map((_, i) => Hangul.FIRST_JAMO_CODEPOINT + i)
        .map((codePoint) => String.fromCodePoint(codePoint))
        .map((jamo) => Path.getDrawableString(jamo))
    )
  }
  loadJamo().catch((e) => console.error(e))

  const syllableColors: Path.SyllableColor = {
    background: undefined,
    leadingConsonant: '#1956B0',
    vowels: ['#60AB9E', '#A6BE54'],
    trailingConsonant: ['#FEDA8B', '#F67E4B'],
  }

  let page = 0
  const loadSize = 1000

  let syllableList: Path.DrawableSyllable[] = []
  async function loadSyllables() {
    const start = Hangul.FIRST_SYLLABLE_CODEPOINT + page * loadSize
    if (Hangul.LAST_SYLLABLE_CODEPOINT < start) {
      return
    }

    const codePoints = Array(loadSize)
      .fill(0)
      .map((_, i) => start + i)
    const str = String.fromCodePoint(...codePoints)
    const newSyllables = await Promise.all(
      Hangul.toWord(str).syllables.map(Path.getDrawableSyllable)
    )
    syllableList = syllableList.concat(newSyllables)

    page += 1
  }
  loadSyllables().catch((e) => console.error(e))
</script>

<div class="tw-container tw-mx-auto tw-py-3">
  <div class="tw-flex tw-flex-wrap tw-gap-1">
    {#each jamoList as jamo}
      <div
        class="tw-w-16 tw-h-16 tw-border-2 tw-rounded-lg tw-border-solid tw-border-app-text-secondary"
      >
        <Syllable drawable={jamo} />
      </div>
    {/each}
  </div>
  <div class="tw-mt-3 tw-flex tw-flex-wrap tw-gap-1">
    {#each syllableList as syllable}
      <div
        class="tw-w-16 tw-h-16 tw-border-2 tw-rounded-lg tw-border-solid tw-border-app-text-secondary"
      >
        <Syllable drawable={syllable} {syllableColors} />
      </div>
    {/each}

    <div use:inView on:enter={() => loadSyllables()} />
  </div>
</div>
