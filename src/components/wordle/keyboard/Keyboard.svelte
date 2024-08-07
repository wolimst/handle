<script lang="ts">
  import { getKeyboardErrorMessage } from '../message'
  import { game, keyboard } from '../store'
  import Key from './Key.svelte'
  import BackspaceIcon from '@/components/ui/icons/Backspace.svelte'
  import * as Hangul from '@/lib/hangul'
  import { config, notification } from '@/stores/app'
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'

  const dispatch = createEventDispatcher()

  const row1Left = ['ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ']
  const row1Right = ['ㅒ', 'ㅖ']
  const row2 = ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ']
  const row3 = ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ']
  const row4 = ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ']

  const ENTER_KEY = 'Enter'
  const BACKSPACE_KEY = 'Backspace'

  function isJamoKey(key: string): key is Hangul.DubeolsikJamo {
    return Hangul.getCodePointLength(key) === 1 && Hangul.isHangulJamo(key)
  }

  function onClick(key: string) {
    if (!$keyboard.active) {
      return
    }

    if (key === ENTER_KEY) {
      dispatch('submit')
      return
    }

    if ($game.data?.status === 'playing') {
      if (isJamoKey(key)) {
        const error = $keyboard.type(key)
        if (error) {
          $notification = {
            type: 'error',
            message: getKeyboardErrorMessage(error),
          }
        }
      } else if (key === BACKSPACE_KEY) {
        $keyboard.delete()
      }
    }
  }

  function handleKeyboardInputOutsideForm(event: KeyboardEvent) {
    const key: string =
      Hangul.ALPHABET_JAMO_MAP_DUBEOLSIK[event.key] || event.key
    onClick(key)
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeyboardInputOutsideForm)
  })

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeyboardInputOutsideForm)
  })
</script>

<div
  class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-1.5 tw-my-1.5 md:tw-mt-3"
>
  {#each row1Left as key}
    <Key {key} on:click={() => onClick(key)} />
  {/each}
  {#each { length: row2.length - row1Left.length - row1Right.length } as _}
    <Key key="dummy" disabled />
  {/each}
  {#each row1Right as key}
    <Key {key} on:click={() => onClick(key)} />
  {/each}
</div>

<div class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-1.5 tw-my-1.5">
  {#each row2 as key}
    <Key {key} on:click={() => onClick(key)} />
  {/each}
</div>

<div class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-1.5 tw-my-1.5">
  <Key key="dummy" size="compact" disabled />
  {#each row3 as key}
    <Key {key} on:click={() => onClick(key)} />
  {/each}
  <Key key="dummy" size="compact" disabled />
</div>

<div class="tw-flex tw-flex-nowrap tw-justify-center tw-gap-1.5 tw-my-1.5">
  {#if !$config.switchEnterAndBackspacePosition}
    <Key
      key={ENTER_KEY}
      size="wide"
      on:click={() => onClick(ENTER_KEY)}
      on:submit
    >
      {#if $game.data?.status === 'win'}
        🎉
      {:else}
        입력
      {/if}
    </Key>
    {#each row4 as key}
      <Key {key} on:click={() => onClick(key)} />
    {/each}
    <Key
      key={BACKSPACE_KEY}
      size="wide"
      on:click={() => onClick(BACKSPACE_KEY)}
    >
      <BackspaceIcon />
    </Key>
  {:else}
    <Key
      key={BACKSPACE_KEY}
      size="wide"
      on:click={() => onClick(BACKSPACE_KEY)}
    >
      <BackspaceIcon />
    </Key>
    {#each row4 as key}
      <Key {key} on:click={() => onClick(key)} />
    {/each}
    <Key
      key={ENTER_KEY}
      size="wide"
      on:click={() => onClick(ENTER_KEY)}
      on:submit
    >
      {#if $game.data?.status === 'win'}
        🎉
      {:else}
        입력
      {/if}
    </Key>
  {/if}
</div>
