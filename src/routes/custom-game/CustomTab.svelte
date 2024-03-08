<script lang="ts">
  import LinkButton from '@/components/ui/core/LinkButton.svelte'
  import EditIcon from '@/components/ui/icons/Edit.svelte'
  import RightArrow from '@/components/ui/icons/RightArrow.svelte'
  import { CUSTOM_PAGE_RELATIVE_URL } from '@/constants'
  import * as Wordle from '@/lib/wordle'
  import { notification } from '@/stores/app'
  import { push } from 'svelte-spa-router'

  let code: string

  function validate(event: Event) {
    const inputElement = event.target as HTMLInputElement
    if (Wordle.parseCode(code)) {
      inputElement.setCustomValidity('')
    } else {
      inputElement.setCustomValidity('앗, 코드가 올바르지 않아요.')
    }
  }

  function submit() {
    push(`${CUSTOM_PAGE_RELATIVE_URL}/${code}`).catch((e) => {
      $notification = {
        type: 'error',
        message: '앗, 문제 표시에 실패했어요.',
      }
      console.error(e)
    })
  }
</script>

<div
  class="tw-mt-6 tw-flex tw-flex-nowrap tw-flex-col tw-items-center tw-gap-4"
>
  <div class="tw-w-full tw-max-w-sm tw-flex tw-justify-between tw-items-center">
    <div>문제 만들기</div>
    <LinkButton url={CUSTOM_PAGE_RELATIVE_URL} useRouter underline={false}>
      <div class="tw-p-2 tw-rounded-lg tw-bg-app-primary tw-text-gray-100">
        <EditIcon width={18} />
      </div>
    </LinkButton>
  </div>

  <form on:submit|preventDefault={submit} class="tw-w-full tw-max-w-sm">
    <label for="code" class="tw-block tw-mb-2 tw-font-medium">
      문제 풀기
    </label>
    <div class="tw-flex">
      <input
        bind:value={code}
        on:input={validate}
        id="code"
        type="text"
        placeholder="코드 입력"
        class="tw-w-full tw-px-2 tw-py-1 tw-rounded-lg tw-text-app-text tw-bg-transparent tw-border tw-border-app-text-secondary tw-shadow"
        required
      />
      <button
        type="submit"
        class="btn tw-ml-1.5 tw-px-2 tw-rounded-lg tw-bg-app-primary"
      >
        <span class="tw-text-gray-100">
          <RightArrow width={18} />
        </span>
      </button>
    </div>
  </form>
</div>
