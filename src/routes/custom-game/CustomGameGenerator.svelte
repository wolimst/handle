<script lang="ts">
  import Toggle from '@/components/ui/core/Toggle.svelte'
  import { CUSTOM_PAGE_RELATIVE_URL } from '@/constants'
  import * as Hangul from '@/lib/hangul'
  import * as Wordle from '@/lib/wordle'
  import { getAbsoluteUrl } from '@/routes/page'
  import { notification } from '@/stores/app'

  const ANSWER_LENGTHS = [
    {
      title: '2글자',
      value: 2,
      wordListDisabled: false,
    },
    {
      title: '3글자 (단어 리스트 미사용)',
      value: 3,
      wordListDisabled: true,
    },
    {
      title: '4글자 (단어 리스트 미사용)',
      value: 4,
      wordListDisabled: true,
    },
  ] as const

  let author = ''
  let nWordles: number
  let nGuesses: number
  let answerLength = Wordle.MIN_WORD_LIST_ANSWER_LEN
  let answers = new Array<string>(Wordle.MAX_N_WORDLES)
  let useWordList = true

  let useWordListToggleDisabled = false
  let formElement: HTMLFormElement

  $: onAnswerLengthUpdate(answerLength)
  $: validateAnswers(answerLength, useWordList)

  function onAnswerLengthUpdate(answerLength: number) {
    const answerLengthElem = ANSWER_LENGTHS.find(
      (elem) => elem.value === answerLength
    )
    if (!answerLengthElem) {
      return
    }
    useWordListToggleDisabled = answerLengthElem.wordListDisabled
    useWordList = !answerLengthElem.wordListDisabled
  }

  function validateAnswers(..._args: unknown[]) {
    if (!formElement) {
      return
    }

    for (const inputElement of formElement.querySelectorAll('input')) {
      if (/^answer\d+$/.test(inputElement.id)) {
        validateAnswer(inputElement)
      }
    }
  }

  function validateAnswer(inputElement: EventTarget | HTMLInputElement | null) {
    if (!inputElement || !(inputElement instanceof HTMLInputElement)) {
      return
    }

    const word = Hangul.toWord(inputElement.value)
    if (word.length !== answerLength) {
      inputElement.setCustomValidity(
        `한글 ${answerLength}글자 단어를 입력해주세요.`
      )
    } else if (useWordList && !Wordle.isInWordList(word.value)) {
      inputElement.setCustomValidity(
        `앗, '${word.value}'는 단어 리스트에 포함되어 있지 않아요.`
      )
    } else {
      inputElement.setCustomValidity('')
    }
  }

  function submit() {
    validateAnswers()
    if (!formElement.checkValidity()) {
      formElement.reportValidity()
      return
    }

    const ans = answers.slice(0, nWordles).map(Hangul.toWord)
    const code = Wordle.generateCode(
      author,
      nWordles,
      answerLength,
      nGuesses,
      useWordList,
      ans
    )

    if (!code) {
      $notification = {
        type: 'error',
        message: '앗, 문제 만들기를 실패했어요.',
      }
      return
    }

    const url = getAbsoluteUrl(CUSTOM_PAGE_RELATIVE_URL + '/' + code)
    navigator.clipboard.writeText(url.toString()).then(
      () => {
        $notification = {
          type: 'success',
          message: '문제 주소를 클립보드에 복사했어요.',
        }
      },
      () => {
        $notification = {
          type: 'error',
          message: `앗, 문제 주소를 클립보드에 복사하지 못했어요.`,
        }
      }
    )
  }
</script>

<div class="tw-max-w-sm tw-mx-auto tw-py-3">
  <div class="tw-w-full tw-text-center tw-mt-3">
    나만의 문제를 만들어 공유해보세요!
  </div>

  <form
    bind:this={formElement}
    on:submit|preventDefault={submit}
    class="tw-flex tw-flex-col tw-gap-3 tw-mt-5"
  >
    <div class="">
      <label for="author" class="tw-block tw-mb-2 tw-font-medium">
        출제자
      </label>
      <input
        id="author"
        name="author"
        bind:value={author}
        type="text"
        class="tw-w-full tw-px-2 tw-py-1 tw-rounded-lg tw-text-app-text tw-bg-transparent tw-border tw-border-app-text-secondary tw-shadow"
        placeholder={`${Wordle.MAX_AUTHOR_LEN}글자 이내`}
        minlength={Wordle.MIN_AUTHOR_LEN}
        maxlength={Wordle.MAX_AUTHOR_LEN}
      />
    </div>

    <div class="">
      <label for="nWordles" class="tw-block tw-mb-2 tw-font-medium">
        워들 수
      </label>
      <input
        id="nWordles"
        name="nWordles"
        bind:value={nWordles}
        type="number"
        class="tw-w-full tw-px-2 tw-py-1 tw-rounded-lg tw-text-app-text tw-bg-transparent tw-border tw-border-app-text-secondary tw-shadow"
        placeholder={`${Wordle.MIN_N_WORDLES}-${Wordle.MAX_N_WORDLES} 사이`}
        min={Wordle.MIN_N_WORDLES}
        max={Wordle.MAX_N_WORDLES}
        required
      />
    </div>

    <div class="">
      <label for="nGuesses" class="tw-block tw-mb-2 tw-font-medium">
        추측 횟수
      </label>
      <input
        id="nGuesses"
        name="nGuesses"
        bind:value={nGuesses}
        type="number"
        class="tw-w-full tw-px-2 tw-py-1 tw-rounded-lg tw-text-app-text tw-bg-transparent tw-border tw-border-app-text-secondary tw-shadow"
        placeholder={`${
          Math.min(Math.max(nWordles, 1), Wordle.MAX_N_WORDLES) ||
          Wordle.MIN_N_GUESSES
        }-${Wordle.MAX_N_GUESSES} 사이`}
        min={nWordles || Wordle.MIN_N_GUESSES}
        max={Wordle.MAX_N_GUESSES}
        required
      />
    </div>

    <div class="">
      <label for="answerLength" class="tw-block tw-mb-2 tw-font-medium">
        정답 글자 수
      </label>
      <select
        id="answerLength"
        name="answerLength"
        bind:value={answerLength}
        class="tw-w-full tw-px-2 tw-py-1 tw-rounded-lg tw-text-app-text tw-bg-transparent tw-border tw-border-app-text-secondary tw-shadow"
        on:input={validateAnswers}
        required
      >
        {#each ANSWER_LENGTHS as answerLength}
          <option value={answerLength.value}>
            {answerLength.title}
          </option>
        {/each}
      </select>
    </div>

    {#each { length: Math.min(Math.max(nWordles, 1), Wordle.MAX_N_WORDLES) || 1 } as _, i}
      <div class="">
        <label for="answers" class="tw-block tw-mb-2 tw-font-medium">
          정답 {i + 1}
        </label>
        <input
          id={`answer${i}`}
          name={`answer${i}`}
          bind:value={answers[i]}
          type="text"
          class="tw-w-full tw-px-2 tw-py-1 tw-rounded-lg tw-text-app-text tw-bg-transparent tw-border tw-border-app-text-secondary tw-shadow"
          minlength={answerLength}
          maxlength={answerLength}
          on:input={(e) => {
            validateAnswer(e.target)
          }}
          required
        />
      </div>
    {/each}

    <Toggle
      bind:checked={useWordList}
      on:toggle={validateAnswers}
      disabled={useWordListToggleDisabled}
    >
      <span class="tw-font-medium"> 단어 리스트에 있는 단어만 허용 </span>
    </Toggle>

    <div>
      <button
        type="submit"
        class="btn tw-w-full tw-my-4 tw-p-1.5 tw-rounded-lg tw-bg-app-primary"
      >
        <span class="tw-text-gray-100 tw-font-bold"> 문제 주소 복사 </span>
      </button>
    </div>
  </form>
</div>
