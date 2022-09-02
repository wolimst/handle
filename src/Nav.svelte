<script lang="ts">
  import Config from '@/components/nav/Config.svelte'
  import Help from '@/components/nav/Help.svelte'
  import ToggleTheme from '@/components/nav/ToggleTheme.svelte'
  import LinkButton from '@/components/ui/core/LinkButton.svelte'
  import AppIcon from '@/components/ui/icons/App.svelte'
  import FontIcon from '@/components/ui/icons/Font.svelte'
  import GitHubIcon from '@/components/ui/icons/GitHub.svelte'
  import { PRODUCTION, ROUTES } from '@/constants'
</script>

<nav
  class="tw-inline-flex tw-justify-between tw-gap-4 tw-w-full tw-px-6 tw-py-3 tw-border-b tw-border-solid tw-border-app-text-secondary"
>
  <div class="tw-inline-flex tw-gap-4">
    <LinkButton link={ROUTES.home}>
      <AppIcon />
    </LinkButton>
  </div>
  <div class="tw-inline-flex tw-gap-4">
    {#if !PRODUCTION}
      <LinkButton link={ROUTES.fontViewer}>
        <FontIcon />
      </LinkButton>
    {/if}

    <ToggleTheme />
    <Help />
    <Config />

    <LinkButton link="https://github.com/wolimst/handle">
      <GitHubIcon />
    </LinkButton>
  </div>
</nav>
