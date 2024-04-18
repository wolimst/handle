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
  import { base64 } from '@/stores/encoder'
  import { savedata, statistics } from '@/stores/wordle'

  let open = false

  function handleClick() {
    open = !open
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
    const exportString = base64.encode(JSON.stringify(data, null, 2))
    await share.copy(exportString)
  }

  function importData() {
    const data = prompt('가져올 데이터를 입력해주세요.')
    if (!data) {
      return
    }
    let parsedData: Data | undefined = undefined
    try {
      parsedData = JSON.parse(base64.decode(data)) as Data
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
    }
    window.location.href = getAbsoluteUrl('/').href
  }
</script>

<ClickButton on:click={handleClick}>
  <ConfigIcon />
</ClickButton>

<Modal bind:open title="설정" widthCss="25rem" heightCss="30rem">
  <div class="tw-w-full tw-h-full tw-inline-flex tw-flex-col tw-gap-4">
    <Toggle checked={$config.darkTheme} on:toggle={config.toggleTheme}>
      다크 모드
    </Toggle>
    <Toggle bind:checked={$config.showInputForm}>키보드 입력 상자 표시</Toggle>
    <Toggle bind:checked={$config.switchEnterAndBackspacePosition}>
      <Badge>입력</Badge> 과 <Badge>삭제</Badge> 키 위치 바꾸기
    </Toggle>
    <Toggle bind:checked={$config.useShorterBox}>
      미입력 상자를 작게 표시
    </Toggle>
    <div class="tw-w-full tw-inline-flex tw-justify-between">
      데이터
      <div class="tw-inline-flex tw-justify-between tw-gap-4">
        <Badge><ClickButton on:click={exportData}>내보내기</ClickButton></Badge>
        <Badge><ClickButton on:click={importData}>가져오기</ClickButton></Badge>
      </div>
    </div>

    <div class="tw-mt-auto">
      <Copyright />
    </div>
  </div>
</Modal>
