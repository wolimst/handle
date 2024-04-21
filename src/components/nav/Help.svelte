<script lang="ts">
  import Badge from '@/components/ui/core/Badge.svelte'
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import Modal from '@/components/ui/core/Modal.svelte'
  import HelpIcon from '@/components/ui/icons/Help.svelte'
  import Guess from '@/components/wordle/Guess.svelte'
  import * as Hangul from '@/lib/hangul'
  import * as Wordle from '@/lib/wordle'
  import { config } from '@/stores/app'

  let open = $config.showHelpOnLaunch

  function handleClick() {
    open = !open
  }

  function onClose() {
    $config.showHelpOnLaunch = false
  }

  const word1: Wordle.GuessResult = {
    guess: Hangul.toWord('화살'),
    result: [
      {
        exact: false,
        leadingConsonant: 'correct',
        vowels: ['absent', 'absent'],
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

  const word2: Wordle.GuessResult = {
    guess: Hangul.toWord('햇볓'),
    result: [
      {
        exact: true,
        leadingConsonant: 'correct',
        vowels: ['correct'],
        trailingConsonants: ['correct'],
      },
      {
        exact: false,
        leadingConsonant: 'correct',
        vowels: ['absent'],
        trailingConsonants: ['correct'],
      },
    ],
  }

  const word3: Wordle.GuessResult = {
    guess: Hangul.toWord('따듯'),
    result: [
      {
        exact: false,
        leadingConsonant: 'correct',
        vowels: ['absent'],
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

  const word4: Wordle.GuessResult = {
    guess: Hangul.toWord('흙'),
    result: [
      {
        exact: false,
        leadingConsonant: 'absent',
        vowels: ['absent'],
        trailingConsonants: ['correct', 'present'],
      },
    ],
  }

  const word5: Wordle.GuessResult = {
    guess: Hangul.toWord('뇌'),
    result: [
      {
        exact: false,
        leadingConsonant: 'absent',
        vowels: ['correct', 'present'],
        trailingConsonants: [],
      },
    ],
  }
</script>

<ClickButton on:click={handleClick}>
  <HelpIcon width={22} />
</ClickButton>

<Modal bind:open title="어떻게 하나요?" widthCss="30rem" on:close={onClose}>
  <div class="tw-text-sm">
    <p class="tw-mb-1">한글 단어를 정해진 횟수 안에 맞춰보세요!</p>
    <p>단어를 입력하면 정답과 비교하여 자모 혹은 입력 칸의 색이 바뀌어요.</p>
  </div>

  <div class="tw-mt-5 tw-text-center">
    <Guess guess={word1} answerLength={word1.guess.length} />
  </div>

  <ul class="tw-mt-0.5 tw-pl-4 tw-text-sm tw-leading-loose tw-list-disc">
    <li>
      자음 <Badge>ㅎ</Badge> 은
      <span class="tw-text-app-wordle-correct tw-font-medium">올바른 위치</span
      >에 있어요.
    </li>
    <li>
      자음 <Badge>ㅅ</Badge> 은 정답에 포함되지만
      <span class="tw-text-app-wordle-present tw-font-medium">잘못된 위치</span
      >에 있어요.
    </li>
    <li>
      나머지 자음과 모음은 정답에
      <span class="tw-text-app-wordle-absent tw-font-medium">
        포함되지 않아요.
      </span>
    </li>
  </ul>

  <div class="tw-mt-5 tw-text-center">
    <Guess guess={word2} answerLength={word2.guess.length} />
  </div>

  <ul class="tw-mt-0.5 tw-pl-4 tw-text-sm tw-leading-loose tw-list-disc">
    <li>
      첫번째 글자 <Badge>햇</Badge> 은 정답과
      <span
        class="tw-bg-app-wordle-exact-bg tw-text-app-wordle-exact tw-font-medium tw-px-0.5"
        >정확히 일치</span
      >해요.
    </li>
  </ul>

  <div class="tw-mt-5 tw-w-full tw-inline-flex tw-justify-evenly tw-gap-4">
    <Guess guess={word3} answerLength={word3.guess.length} />
    <Guess guess={word4} answerLength={word4.guess.length} />
    <Guess guess={word5} answerLength={word5.guess.length} />
  </div>

  <ul class="tw-mt-0.5 tw-pl-4 tw-text-sm tw-leading-loose tw-list-disc">
    <li>
      자모는
      <a
        href="https://ko.wikipedia.org/wiki/%EB%91%90%EB%B2%8C%EC%8B%9D_%EC%9E%90%ED%8C%90"
        target="_blank"
        class="tw-underline tw-underline-offset-1 tw-text-app-text"
        >두벌식 키보드</a
      >의 키 입력 횟수에 따라 구분되어요.
    </li>
    <li>
      입력에 1개의 키만 필요한 자모,
      <Badge>Shift</Badge> 키로 입력하는 쌍자음
      <Badge>ㄲ</Badge>
      <Badge>ㄸ</Badge>
      <Badge>ㅃ</Badge>
      <Badge>ㅆ</Badge>
      <Badge>ㅉ</Badge>
      과 모음
      <Badge>ㅒ</Badge>
      <Badge>ㅖ</Badge>
      은 하나의 문자로 취급해요.
    </li>
    <li>
      입력에 2개의 키가 필요한
      <Badge>ㄳ</Badge>
      <Badge>ㄶ</Badge>
      <Badge>ㄺ</Badge>
      <Badge>ㅘ</Badge>
      <Badge>ㅝ</Badge>
      <Badge>ㅢ</Badge>
      등의 자모는 2개의 개별 문자로 취급해요.
    </li>
  </ul>

  <div class="tw-mt-5 tw-text-sm tw-text-app-text-secondary">
    오리지널 워들(영문)은
    <a
      href="https://www.nytimes.com/games/wordle/index.html"
      target="_blank"
      class="tw-underline tw-underline-offset-1 tw-text-app-text-secondary"
      >여기</a
    >에서 플레이 할 수 있어요.
  </div>
</Modal>
