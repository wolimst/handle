<script lang="ts">
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import Modal from '@/components/ui/core/Modal.svelte'
  import Toggle from '@/components/ui/core/Toggle.svelte'
  import ConfigIcon from '@/components/ui/icons/Config.svelte'

  let open = false

  function handleClick() {
    open = !open
  }
</script>

<ClickButton on:click={handleClick}>
  <ConfigIcon />
</ClickButton>

<Modal bind:open title="TODO" widthRem={30} heightRem={30}>
  <Toggle>Hello</Toggle>
</Modal>
