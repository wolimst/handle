<script lang="ts">
  import Copyright from './Copyright.svelte'
  import Badge from '@/components/ui/core/Badge.svelte'
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import Modal from '@/components/ui/core/Modal.svelte'
  import Toggle from '@/components/ui/core/Toggle.svelte'
  import ConfigIcon from '@/components/ui/icons/Config.svelte'
  import { share } from '@/lib/utils'
  import { getAbsoluteUrl } from '@/routes/page'
  import { config, notification } from '@/stores/app'
  import { savedata, statistics } from '@/stores/wordle'
  import * as lzString from 'lz-string'

  let open = false
  let inputUsername = false
  let usernameForm: HTMLFormElement
  let inputImportData = false
  let importDataForm: HTMLFormElement

  function handleClick() {
    open = !open

    if (open) {
      closeForms()
    }
  }

  function closeForms() {
    inputUsername = false
    usernameForm?.reset()
    inputImportData = false
    importDataForm?.reset()
  }

  interface Data {
    config: string | undefined
    savedata: string | undefined
    statistics: string | undefined
  }

  async function exportData() {
    const data = {
      config: config.export(),
      savedata: savedata.export(),
      statistics: statistics.export(),
    }
    const exportString = lzString.compressToUTF16(JSON.stringify(data, null, 0))
    await share.copy(exportString)
  }

  function updateUsername() {
    const username = new FormData(usernameForm).get('username')?.toString()
    if (!username) {
      return
    }
    $config.userName = username
    closeForms()
  }

  function importData() {
    const data = new FormData(importDataForm).get('importData')?.toString()
    if (!data) {
      return
    }

    let parsedData: Data | undefined = undefined
    try {
      parsedData = JSON.parse(lzString.decompressFromUTF16(data)) as Data
      if (
        !parsedData ||
        !Object.prototype.hasOwnProperty.call(parsedData, 'config') ||
        !Object.prototype.hasOwnProperty.call(parsedData, 'savedata') ||
        !Object.prototype.hasOwnProperty.call(parsedData, 'statistics')
      ) {
        throw new Error('invalid import data')
      }
    } catch (_error) {
      $notification = {
        type: 'error',
        message: '앗, 데이터가 올바르지 않아요.',
      }
      return
    }

    const answer = confirm(
      '정말로 데이터를 덮어쓸까요? 잘못된 형식의 데이터가 포함되어 있을 경우, 데이터가 사라질 수 있어요.'
    )
    if (answer) {
      parsedData.config && config.import(parsedData.config)
      parsedData.savedata && savedata.import(parsedData.savedata)
      parsedData.statistics && statistics.import(parsedData.statistics)

      closeForms()
      alert('데이터를 가져왔어요! 페이지를 새로고침 할게요.')
      window.location.href = getAbsoluteUrl('/').href
    }
  }

  function cleanData() {
    const answer = confirm('정말로 데이터를 초기화할까요? 되돌릴 수 없어요!')
    if (answer) {
      config.reset()
      savedata.reset()
      statistics.reset()

      alert('데이터를 초기화했어요! 페이지를 새로고침 할게요.')
      window.location.href = getAbsoluteUrl('/').href
    }
  }
</script>

<ClickButton on:click={handleClick}>
  <ConfigIcon width={22} />
</ClickButton>

<Modal bind:open title="설정" widthCss="25rem" heightCss="32rem">
  <div class="tw-w-full tw-h-full tw-inline-flex tw-flex-col tw-gap-4">
    <div class="tw-w-full tw-inline-flex tw-justify-between tw-gap-2">
      <span>닉네임</span>
      {#if inputUsername}
        <form
          bind:this={usernameForm}
          on:submit|preventDefault={updateUsername}
          class="tw-inline-flex tw-justify-between tw-gap-1"
        >
          <!-- svelte-ignore a11y-autofocus -->
          <input
            id="username"
            name="username"
            type="text"
            class="tw-w-32 tw-px-2 tw-text-sm tw-text-app-text tw-bg-transparent tw-border tw-rounded-lg tw-border-app-text-secondary tw-shadow"
            maxlength="8"
            placeholder="8글자 이내"
            autofocus
            required
          />
          <button type="submit" class="btn">
            <Badge>입력</Badge>
          </button>
          <button class="btn" on:click={closeForms}>
            <Badge>취소</Badge>
          </button>
        </form>
      {:else}
        <span class="tw-grow"><Badge>{$config.userName}</Badge></span>
        <div class="tw-inline-flex tw-justify-between tw-gap-1">
          <ClickButton on:click={() => (inputUsername = true)}>
            <Badge>변경</Badge>
          </ClickButton>
        </div>
      {/if}
    </div>
    <Toggle checked={$config.submitResult}>오늘의 기록 송신</Toggle>
    <Toggle checked={$config.darkTheme} on:toggle={config.toggleTheme}>
      다크 모드
    </Toggle>
    <Toggle bind:checked={$config.switchEnterAndBackspacePosition}>
      <Badge>입력</Badge> 과 <Badge>삭제</Badge> 키 위치 바꾸기
    </Toggle>
    <Toggle bind:checked={$config.useShorterBox}>
      미입력 상자를 작게 표시
    </Toggle>
    <div class="tw-w-full tw-inline-flex tw-justify-between">
      <span>데이터</span>
      {#if inputImportData}
        <form
          bind:this={importDataForm}
          on:submit|preventDefault={importData}
          class="tw-inline-flex tw-justify-between tw-gap-1"
        >
          <!-- svelte-ignore a11y-autofocus -->
          <input
            id="importData"
            name="importData"
            type="text"
            class="tw-w-28 tw-px-2 tw-text-sm tw-text-app-text tw-bg-transparent tw-border tw-rounded-lg tw-border-app-text-secondary tw-shadow"
            autofocus
            required
          />
          <button type="submit" class="btn">
            <Badge>입력</Badge>
          </button>
          <button class="btn" on:click={closeForms}>
            <Badge>취소</Badge>
          </button>
        </form>
      {:else}
        <div class="tw-inline-flex tw-justify-between tw-gap-1">
          <ClickButton on:click={exportData}>
            <Badge>내보내기</Badge>
          </ClickButton>
          <ClickButton on:click={() => (inputImportData = true)}>
            <Badge>가져오기</Badge>
          </ClickButton>
          <ClickButton on:click={cleanData}><Badge>초기화</Badge></ClickButton>
        </div>
      {/if}
    </div>

    <div class="tw-mt-auto">
      <Copyright />
    </div>
  </div>
</Modal>
