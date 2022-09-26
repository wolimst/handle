<script lang="ts">
  export let rounded: 'sm' | 'md' | 'lg' = 'md'

  $: roundedClass = 'tw-rounded-' + rounded
</script>

<span
  class={`tw-text-sm tw-px-1.5 tw-py-0.5 ${roundedClass} tw-border tw-border-app-text-secondary tw-shadow-inner`}
>
  <slot />
</span>
