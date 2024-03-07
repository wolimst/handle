<script context="module" lang="ts">
  let moduleCount = 0

  type ToggleEvent = {
    toggle: boolean
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let checked = false
  export let disabled = false

  const label = getLabel()

  function getLabel(): string {
    const label = `toggle-${moduleCount}`
    moduleCount += 1
    return label
  }

  const dispatch = createEventDispatcher<ToggleEvent>()

  $: dispatch('toggle', checked)
</script>

<div
  class="tw-w-full tw-inline-flex tw-justify-between tw-items-center tw-gap-3"
>
  <div class="tw-text-app-text tw-align-middle">
    <slot />
  </div>
  <label for={label} class="tw-cursor-pointer tw-p-1">
    <div class="tw-relative">
      <input
        id={label}
        type="checkbox"
        class="tw-sr-only"
        bind:checked
        {disabled}
      />
      <div class="tw-w-8 tw-h-3 tw-rounded-full tw-bg-app-text-secondary" />
      <div
        class="toggle-dot tw-absolute tw-w-5 tw-h-5 tw-rounded-full tw--left-1 tw--top-1 tw-transition tw-bg-app-neutral"
      />
    </div>
  </label>
</div>

<style>
  input:checked ~ .toggle-dot {
    transform: translateX(100%);
    background-color: var(--primary-color);
  }

  div:has(> input:disabled) {
    filter: brightness(0.6);
    cursor: not-allowed;
  }
</style>
