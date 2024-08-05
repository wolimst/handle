<script lang="ts">
  import Config from '@/components/nav/Config.svelte'
  import Help from '@/components/nav/Help.svelte'
  import LinkButton from '@/components/ui/core/LinkButton.svelte'
  import AppIcon from '@/components/ui/icons/App.svelte'
  import ChatIcon from '@/components/ui/icons/Chat.svelte'
  import Navigate from '@/components/wordle/Navigate.svelte'
  import Share from '@/components/wordle/Share.svelte'
  import Statistics from '@/components/wordle/Statistics.svelte'
  import { game } from '@/components/wordle/store'
  import { APP_NAME, ROUTES } from '@/constants'
  import { getGameDescription } from '@/lib/wordle'

  $: title = $game && $game.active ? getGameDescription($game.data) : APP_NAME
</script>

<nav
  class="tw-inline-flex tw-justify-between tw-gap-2 md:tw-gap-4 tw-w-full tw-h-[var(--nav-height)] tw-px-1.5 md:tw-px-6 tw-border-b tw-border-solid tw-border-app-text-secondary"
>
  <div class="tw-inline-flex tw-items-center tw-gap-2 md:tw-gap-4">
    <LinkButton url={ROUTES.home} useRouter underline={false}>
      <AppIcon width={30} />

      <span class="tw-ml-1.5 tw-font-medium tw-break-keep tw-leading-tight">
        {title}
      </span>
    </LinkButton>
  </div>
  <div class="tw-inline-flex tw-items-center tw-gap-2 md:tw-gap-4">
    {#if $game && $game.active && $game.data.config.mode === 'daily'}
      <Navigate />
    {/if}

    <Share />
    <Statistics />
    <Config />
    <Help />
    <LinkButton url={'https://forms.gle/iApSG3nJg9V17j1A7'} underline={false}>
      <ChatIcon width={21} />
    </LinkButton>
  </div>
</nav>
