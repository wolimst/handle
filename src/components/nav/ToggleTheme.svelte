<script lang="ts">
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import ThemeDarkIcon from '@/components/ui/icons/ThemeDark.svelte'
  import ThemeLightIcon from '@/components/ui/icons/ThemeLight.svelte'
  import { config } from '@/stores/app'

  function toggle() {
    config.toggleTheme()
  }
</script>

<ClickButton on:click={toggle}>
  {#if $config.darkTheme}
    <ThemeLightIcon />
  {:else}
    <ThemeDarkIcon />
  {/if}
</ClickButton>
