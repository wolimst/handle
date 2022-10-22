<script lang="ts">
  import Select from '@/components/ui/core/Select.svelte'
  import * as Hangul from '@/lib/hangul'
  import { inView } from '@/lib/svelte-actions/inView'
  import * as Wordle from '@/lib/wordle'

  const lengths = [2, 3]
  let length = lengths[0]
  let search = ''

  let answerPage = 1
  let wordPage = 1
  const loadSize = 1000

  function loadAnswers() {
    if (answerPage * loadSize < answers.length) {
      answerPage += 1
    }
  }

  function loadWords() {
    if (wordPage * loadSize < words.length) {
      wordPage += 1
    }
  }

  function filterByChars(
    words: readonly string[],
    search: string
  ): readonly string[] {
    answerPage = 1
    wordPage = 1

    if (search === '') {
      return words
    }

    const chars = Array.from(search)
    return words.filter((word) => {
      for (const char of chars) {
        if (Hangul.isHangulJamo(char)) {
          const jamos = Hangul.toWord(word)
            .syllables.flatMap((syllable) => [
              syllable.leadingConsonant,
              Hangul.toJamo(syllable.vowels),
              Hangul.toJamo(syllable.trailingConsonants),
            ])
            .filter((jamo) => jamo !== undefined)

          if (jamos.includes(char as Hangul.Jamo)) {
            return true
          }
        }

        if (Hangul.isHangulSyllables(char)) {
          if (word.includes(char)) {
            return true
          }
        }
      }
      return false
    })
  }

  $: answers = filterByChars(Wordle.getAnswerList(length), search)
  $: words = filterByChars(Wordle.getWordList(length), search)
</script>

<div class="tw-container tw-mx-auto tw-py-3">
  <form
    on:submit|preventDefault
    class="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center"
  >
    <Select
      title="Word Length"
      options={lengths.map((length) => {
        return { id: length, text: length.toString() }
      })}
      on:select={(event) => (length = event.detail.id)}
    />

    <div>
      <label for="search" class="tw-block tw-mb-1 tw-text-sm tw-font-medium">
        Filter (OR search for each char)
      </label>
      <input
        id="search"
        type="text"
        bind:value={search}
        class="tw-block tw-px-2 tw-py-0.5 tw-rounded-lg tw-bg-app-bg tw-border tw-border-app-text-secondary"
      />
    </div>
  </form>

  <div class="tw-mt-3 tw-flex tw-gap-6">
    <div
      class="tw-w-1/2 tw-text-center tw-border tw-border-app-text-secondary tw-rounded-lg"
    >
      <div
        class="tw-p-1 tw-font-medium tw-border-b tw-border-app-text-secondary"
      >
        Answers
      </div>
      <div class="tw-p-1 tw-flex tw-flex-wrap tw-text-sm">
        {#each answers.slice(0, answerPage * loadSize) as answer}
          <span class="tw-m-1">{answer}</span>
        {/each}

        <div use:inView on:enter={() => loadAnswers()} />
      </div>
    </div>

    <div
      class="tw-w-1/2 tw-text-center tw-border tw-border-app-text-secondary tw-rounded-lg"
    >
      <div
        class="tw-p-1 tw-font-medium tw-border-b tw-border-app-text-secondary"
      >
        Words
      </div>
      <div class="tw-p-1 tw-flex tw-flex-wrap tw-text-sm">
        {#each words.slice(0, wordPage * loadSize) as word}
          <span class="tw-m-1">{word}</span>
        {/each}

        <div use:inView on:enter={() => loadWords()} />
      </div>
    </div>
  </div>
</div>
