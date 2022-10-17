<script context="module" lang="ts">
  let moduleCount = 0

  export interface Option {
    id: string
    text: string
    disabled?: boolean
  }

  type SelectEvent = {
    select: Option
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let title: string
  export let options: Option[]
  export let selected: Option | undefined = options[0]

  const label = getLabel()

  function getLabel(): string {
    const label = `select-${moduleCount}`
    moduleCount += 1
    return label
  }

  const dispatch = createEventDispatcher<SelectEvent>()

  $: dispatch('select', selected)
</script>

<div>
  <label for={label} class="tw-block tw-mb-1 tw-text-sm tw-font-medium">
    {title}
  </label>
  <select
    bind:value={selected}
    id={label}
    class="tw-block tw-px-1 tw-py-0.5 tw-bg-app-bg tw-border tw-border-app-text-secondary tw-rounded-lg"
  >
    {#each options as option}
      <option value={option} disabled={option.disabled}>{option.text}</option>
    {/each}
  </select>
</div>
