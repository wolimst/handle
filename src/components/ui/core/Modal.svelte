<script lang="ts">
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import CloseIcon from '@/components/ui/icons/Close.svelte'
  import { fly } from 'svelte/transition'

  export let open = false
  export let title = ''
  export let widthRem = 50
  export let heightRem = 50
  export let closeOnOuterclick = true
  // TODO: export let closeOnEsc = true

  function close() {
    open = false
  }
</script>

{#if open}
  <div class="modal-outer" on:click={() => closeOnOuterclick && close()}>
    <div
      class="modal"
      style="--width: {widthRem}rem; --height: {heightRem}rem"
      on:click|stopPropagation={() => {}}
      transition:fly={{ y: 150, duration: 200 }}
    >
      <div class="modal-header">
        <div class="modal-title">
          {title}
        </div>

        <ClickButton on:click={() => close()}><CloseIcon /></ClickButton>
      </div>

      <div class="modal-content">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-outer {
    background-color: var(--modal-background-color);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .modal {
    background-color: var(--background-color);
    width: var(--width);
    height: var(--height);
    max-width: 90%;
    max-height: 90%;

    margin: auto;
    padding: 2rem;
    border: 1px solid var(--text-color-secondary);
    border-radius: 2rem;

    overflow: auto;

    display: inline-flex;
    flex-direction: column;
  }

  .modal-header {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 2.5rem;
  }

  .modal-title {
    margin: auto;
    font-size: 1.2em;
    font-weight: bold;
  }

  .modal-content {
    width: 100%;
    flex-grow: 1;
  }
</style>
