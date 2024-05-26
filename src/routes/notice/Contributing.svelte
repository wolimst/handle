<script lang="ts">
  import Guess from '@/components/wordle/Guess.svelte'
  import type * as Wordle from '@/lib/wordle'
  import * as Hangul from '@/lib/hangul'

  const opinion: Wordle.GuessResult = {
    guess: Hangul.toWord('의견'),
    result: [
      {
        exact: false,
        leadingConsonant: 'present',
        vowels: ['absent', 'absent'],
        trailingConsonants: [],
      },
      {
        exact: false,
        leadingConsonant: 'present',
        vowels: ['absent'],
        trailingConsonants: ['correct'],
      },
    ],
  }

  const question: Wordle.GuessResult = {
    guess: Hangul.toWord('질문'),
    result: [
      {
        exact: false,
        leadingConsonant: 'absent',
        vowels: ['absent'],
        trailingConsonants: ['absent'],
      },
      {
        exact: false,
        leadingConsonant: 'absent',
        vowels: ['absent'],
        trailingConsonants: ['correct'],
      },
    ],
  }

  const help: Wordle.GuessResult = {
    guess: Hangul.toWord('도움'),
    result: [
      {
        exact: false,
        leadingConsonant: 'absent',
        vowels: ['correct'],
        trailingConsonants: [],
      },
      {
        exact: false,
        leadingConsonant: 'present',
        vowels: ['absent'],
        trailingConsonants: ['absent'],
      },
    ],
  }
</script>

<div class="tw-max-w-sm tw-text-sm tw-text-center">
  <div>
    <Guess guess={opinion} answerLength={2} /> /
    <Guess guess={question} answerLength={2} />
  </div>
  <div class="tw-font-bold">혹은, 하고싶은 말이 있으신가요?</div>

  <p class="tw-mt-4">
    <a
      href="https://forms.gle/iApSG3nJg9V17j1A7"
      target="_blank"
      class="tw-underline tw-text-app-text">📝설문지</a
    >에 하고싶은 말을 남겨주세요!
  </p>

  <div class="tw-mt-10">
    <Guess guess={help} answerLength={2} />
    <span class="tw-font-bold">주신 분들</span>
  </div>
  <p class="tw-mt-4">
    한울님, 새하얗고하얀님, 최고잘해님, 교토최고미남님, <br />
    보향성님
  </p>
</div>
