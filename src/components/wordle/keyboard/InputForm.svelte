<script lang="ts">
  import { getKeyboardErrorMessage } from '../message'
  import { game, keyboard } from '../store'
  import { notification } from '@/stores/app'

  $: value = $keyboard
  $: {
    const setError = keyboard.setValue(value)
    if (setError !== undefined) {
      value = $keyboard
      $notification = {
        type: 'error',
        message: getKeyboardErrorMessage(setError),
      }
    }
  }
</script>

<form on:submit|preventDefault>
  <label for="guess" />
  <input
    id="guess"
    type="text"
    placeholder="키보드 입력"
    bind:value
    on:focus
    on:blur
    class="tw-w-full tw-px-2 tw-py-1 tw-rounded-lg tw-text-app-text tw-bg-transparent tw-border tw-border-app-text-secondary tw-shadow"
    disabled={$game.status !== 'playing'}
  />
</form>
