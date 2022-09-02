<script lang="ts">
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import Modal from '@/components/ui/core/Modal.svelte'
  import HelpIcon from '@/components/ui/icons/Help.svelte'

  let open = false

  function handleClick() {
    open = !open
  }
</script>

<ClickButton on:click={handleClick}>
  <HelpIcon />
</ClickButton>

<Modal bind:open title="TODO" widthRem={30} heightRem={30}>TODO</Modal>
