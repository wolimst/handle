<script lang="ts">
  import { getKeyboardErrorMessage } from '../message'
  import { alert, keyboard } from '../store'

  $: value = $keyboard
  $: {
    const setError = keyboard.setValue(value)
    if (setError !== undefined) {
      value = $keyboard
      $alert = getKeyboardErrorMessage(setError)
    }
  }
</script>

<form on:submit|preventDefault>
  <input type="text" bind:value on:focus on:blur />
</form>
