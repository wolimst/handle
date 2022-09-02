<script lang="ts">
  export let checked = false
</script>

<div class="tw-inline-flex tw-items-center tw-content-center tw-gap-3">
  <label for="toggle" class="tw-cursor-pointer">
    <div class="tw-relative">
      <input id="toggle" type="checkbox" class="tw-sr-only" bind:checked />
      <div class="tw-w-8 tw-h-3 tw-rounded-full tw-bg-app-text-secondary" />
      <div
        class="toggle-dot tw-absolute tw-w-5 tw-h-5 tw-rounded-full tw--left-1 tw--top-1 tw-transition tw-bg-app-neutral"
      />
    </div>
  </label>
  <slot />
</div>

<style>
  input:checked ~ .toggle-dot {
    transform: translateX(100%);
    background-color: var(--primary-color);
  }
</style>
