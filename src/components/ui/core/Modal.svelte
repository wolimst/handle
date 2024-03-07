<script lang="ts">
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import CloseIcon from '@/components/ui/icons/Close.svelte'
  import { createEventDispatcher } from 'svelte'
  import { fly } from 'svelte/transition'

  export let open = false
  export let title = ''
  export let widthCss = '30rem'
  export let minWidthCss = '0'
  export let heightCss = 'auto'
  export let minHeightCss = '0'
  export let closeOnOuterclick = true
  export let closeOnEsc = true

  let modalOuterElement: HTMLDivElement

  const dispatch = createEventDispatcher()

  function onOpen() {
    document.body.classList.add('modal-open')
    dispatch('open')
  }

  function close() {
    open = false
    document.body.classList.remove('modal-open')
    dispatch('close')
  }

  $: open && onOpen()
  $: modalOuterElement && modalOuterElement.focus()

  function handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event)
    if (closeOnEsc && event.key === 'Escape') {
      close()
    }
  }
</script>

{#if open}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    bind:this={modalOuterElement}
    class="modal-outer"
    role="dialog"
    tabindex="-1"
    on:click={() => closeOnOuterclick && close()}
    on:keydown={handleKeyboardEvent}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="modal"
      style="--width: {widthCss}; --minWidth: {minWidthCss}; --height: {heightCss}; --minHeight: {minHeightCss};"
      role="dialog"
      aria-modal="true"
      on:click|stopPropagation={() => {}}
      transition:fly={{ y: 150, duration: 200 }}
    >
      <div class="modal-header">
        <div class="modal-title">
          {title}
        </div>

        <div class="tw-float-right tw-inline-flex tw-items-center">
          <ClickButton on:click={() => close()}><CloseIcon /></ClickButton>
        </div>
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
    max-width: 90%;
    min-width: var(--minWidth);

    height: var(--height);
    max-height: 90%;
    min-height: var(--minHeight);

    margin: auto;
    padding-bottom: 1.5rem;

    border: 1px solid var(--text-color-secondary);
    border-radius: 1.5rem;

    display: inline-flex;
    flex-direction: column;
  }

  .modal-header {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1.25rem;
  }

  .modal-title {
    margin: auto;
    font-size: 1.2em;
    font-weight: bold;
  }

  .modal-content {
    width: 100%;
    flex-grow: 1;
    padding: 1.25rem;
    padding-top: 0;
    padding-bottom: 0;
    overflow-y: auto;
  }
</style>
