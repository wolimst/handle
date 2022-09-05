<script lang="ts">
  import * as Wordle from '@/lib/wordle'

  export let keyboard: Wordle.Keyboard
</script>

<form on:submit|preventDefault on:input>
  <input type="text" bind:value={keyboard.value} />
</form>
