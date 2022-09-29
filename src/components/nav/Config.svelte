<script lang="ts">
  import Copyright from './Copyright.svelte'
  import Badge from '@/components/ui/core/Badge.svelte'
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import Modal from '@/components/ui/core/Modal.svelte'
  import Toggle from '@/components/ui/core/Toggle.svelte'
  import ConfigIcon from '@/components/ui/icons/Config.svelte'
  import { config } from '@/stores/app'

  let open = false

  function handleClick() {
    open = !open
  }
</script>

<ClickButton on:click={handleClick}>
  <ConfigIcon />
</ClickButton>

<Modal bind:open title="설정" widthRem={25} heightRem={30}>
  <div class="tw-w-full tw-h-full tw-inline-flex tw-flex-col tw-gap-4">
    <Toggle checked={$config.darkTheme} on:toggle={config.toggleTheme}>
      다크 모드
    </Toggle>
    <Toggle bind:checked={$config.showInputForm}>키보드 입력 상자 표시</Toggle>
    <Toggle bind:checked={$config.switchEnterAndBackspacePosition}>
      <Badge>입력</Badge> 과 <Badge>삭제</Badge> 키 위치 바꾸기
    </Toggle>

    <div class="tw-mt-auto">
      <Copyright />
    </div>
  </div>
</Modal>
