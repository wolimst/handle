<script lang="ts">
  import SuccessIcon from './components/ui/icons/Success.svelte'
  import EmojiDizzyIcon from '@/components/ui/icons/EmojiDizzy.svelte'
  import TrophyIcon from '@/components/ui/icons/Trophy.svelte'
  import WarningIcon from '@/components/ui/icons/Warning.svelte'
  import { ALERT_DURATION_MS } from '@/constants'
  import { notification } from '@/stores/app'
  import { onDestroy } from 'svelte'

  type NotificationType = typeof $notification.type

  let type: NotificationType
  let message = ''
  let prevTimeout: number

  function onChange(..._args: unknown[]) {
    if (!$notification) {
      return
    }

    window.clearTimeout(prevTimeout)
    type = $notification.type
    message = $notification.message
    $notification.message = ''
    prevTimeout = window.setTimeout(() => {
      type = undefined
      message = ''
    }, ALERT_DURATION_MS)
  }

  $: onChange($notification)

  onDestroy(() => {
    type = undefined
    message = ''
    $notification = { message: '' }
    window.clearTimeout(prevTimeout)
  })
</script>

{#if message}
  <div
    class="tw-max-w-md tw-px-3 tw-py-1.5 tw-rounded-lg tw-bg-app-alert-bg tw-shadow-md tw-inline-flex tw-items-center"
    role="alert"
  >
    {#if type === 'wordle-win'}
      <div
        class="tw-w-6 tw-h-6 tw-inline-flex tw-justify-center tw-items-center tw-flex-shrink-0 tw-text-yellow-500"
      >
        <TrophyIcon />
      </div>
    {:else if type === 'wordle-bonus-win'}
      <div
        class="tw-w-6 tw-h-6 tw-text-2xl tw-inline-flex tw-justify-center tw-items-center tw-flex-shrink-0"
      >
        🔥
      </div>
    {:else if type === 'wordle-loss'}
      <div
        class="tw-w-6 tw-h-6 tw-inline-flex tw-justify-center tw-items-center tw-flex-shrink-0 tw-text-amber-400"
      >
        <EmojiDizzyIcon />
      </div>
    {:else if type === 'error'}
      <div
        class="tw-w-6 tw-h-6 tw-inline-flex tw-justify-center tw-items-center tw-flex-shrink-0 tw-text-orange-400"
      >
        <WarningIcon />
      </div>
    {:else if type === 'success'}
      <div
        class="tw-w-6 tw-h-6 tw-inline-flex tw-justify-center tw-items-center tw-flex-shrink-0 tw-text-emerald-500"
      >
        <SuccessIcon />
      </div>
    {/if}

    <div class="tw-ml-2.5 tw-text-sm">
      {message}
    </div>
  </div>
{/if}
