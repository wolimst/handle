<script lang="ts">
  import Key from './Key.svelte'
  import { keyboard } from './store'
  import BackspaceIcon from '@/components/ui/icons/Backspace.svelte'

  const row1Left = ['ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ']
  const row1Right = ['ㅒ', 'ㅖ']
  const row2 = ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ']
  const row3 = ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ']
  const row4 = ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ']

  $: value = $keyboard
  $: {
    const setResult = keyboard.setValue(value)
    if (!setResult) {
      value = $keyboard
    }
  }
</script>

<div class="tw-container">
  <div class="tw-flex tw-flex-nowrap tw-justify-center tw-mb-4">
    <form on:submit|preventDefault>
      <input type="text" bind:value />
    </form>
  </div>

  <div
    class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-1.5 tw-mx-2 tw-my-1.5"
  >
    {#each row1Left as key}
      <Key {key} />
    {/each}
    {#each { length: row2.length - row1Left.length - row1Right.length } as _}
      <Key key="dummy" disabled />
    {/each}
    {#each row1Right as key}
      <Key {key} />
    {/each}
  </div>

  <div
    class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-1.5 tw-mx-2 tw-my-1.5"
  >
    {#each row2 as key}
      <Key {key} />
    {/each}
  </div>

  <div
    class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-1.5 tw-mx-2 tw-my-1.5"
  >
    <Key key="dummy" size="compact" disabled />
    {#each row3 as key}
      <Key {key} />
    {/each}
    <Key key="dummy" size="compact" disabled />
  </div>

  <div
    class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-1.5 tw-mx-2 tw-my-1.5"
  >
    <Key key="Enter" size="wide">입력</Key>
    {#each row4 as key}
      <Key {key} />
    {/each}
    <Key key="Backspace" size="wide"><BackspaceIcon /></Key>
  </div>
</div>
