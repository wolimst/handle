<script lang="ts">
  import Config from '@/components/nav/Config.svelte'
  import Help from '@/components/nav/Help.svelte'
  import ToggleTheme from '@/components/nav/ToggleTheme.svelte'
  import LinkButton from '@/components/ui/core/LinkButton.svelte'
  import AppIcon from '@/components/ui/icons/App.svelte'
  import FontIcon from '@/components/ui/icons/Font.svelte'
  import ListIcon from '@/components/ui/icons/List.svelte'
  import Share from '@/components/wordle/Share.svelte'
  import Statistics from '@/components/wordle/Statistics.svelte'
  import { APP_NAME, PRODUCTION, ROUTES } from '@/constants'
</script>

<nav
  class="tw-inline-flex tw-justify-between tw-gap-3 md:tw-gap-4 tw-w-full tw-h-[var(--nav-height)] tw-px-3 md:tw-px-6 tw-py-2 tw-border-b tw-border-solid tw-border-app-text-secondary"
>
  <div class="tw-inline-flex tw-gap-3 md:tw-gap-4">
    <LinkButton url={ROUTES.home} useRouter underline={false}>
      <AppIcon width={32} />
      <span class="tw-ml-2 tw-font-medium">{APP_NAME}</span>
    </LinkButton>
  </div>
  <div class="tw-inline-flex tw-gap-3 md:tw-gap-4">
    {#if !PRODUCTION}
      <LinkButton url={ROUTES.fontViewer} useRouter>
        <FontIcon />
      </LinkButton>
      <LinkButton url={ROUTES.wordViewer} useRouter>
        <ListIcon />
      </LinkButton>
    {/if}

    <Share />
    <Statistics />
    <ToggleTheme />
    <Config />
    <Help />
  </div>
</nav>
