<script lang="ts">
  import { keyboard } from './store'

  $: value = $keyboard
  $: {
    const setResult = keyboard.setValue(value)
    if (!setResult) {
      value = $keyboard
    }
  }
</script>

<div class="tw-container">
  <div class="tw-flex tw-flex-nowrap tw-justify-center">
    <form on:submit|preventDefault>
      <input type="text" bind:value />
    </form>
  </div>
</div>
