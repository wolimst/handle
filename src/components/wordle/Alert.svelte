<script lang="ts">
  import WarningIcon from '../ui/icons/Warning.svelte'
  import { alert } from './store'
  import { ALERT_DURATION_MS } from '@/constants'
  import { onDestroy } from 'svelte'

  let message = ''
  let prevTimeout: NodeJS.Timeout

  function onChange(..._args: any) {
    if (!$alert) {
      return
    }

    clearTimeout(prevTimeout)
    message = $alert
    $alert = ''
    prevTimeout = setTimeout(() => (message = ''), ALERT_DURATION_MS)
  }

  $: onChange($alert)

  onDestroy(() => {
    message = ''
    $alert = ''
    clearTimeout(prevTimeout)
  })
</script>

{#if message}
  <div
    class="tw-absolute tw-w-full tw-max-w-xs tw-px-3 tw-py-2 tw-rounded-lg tw-bg-app-alert-bg tw-shadow-md tw-inline-flex tw-items-center"
    role="alert"
  >
    <div
      class="tw-w-5 tw-h-5 tw-rounded-lg tw-inline-flex tw-justify-center tw-items-center tw-flex-shrink-0 tw-text-orange-400"
    >
      <WarningIcon />
    </div>

    <div class="tw-ml-3 tw-text-sm">
      {message}
    </div>
  </div>
{/if}
