<script lang="ts">
  import { link } from 'svelte-spa-router'

  export let url: string = ''
  export let useRouter = false
  export let underline = true
  export let disabled = false

  function router(node: HTMLElement) {
    if (useRouter) {
      link(node)
    }

    return {
      update: () => {
        if (useRouter) {
          link(node)
        }
      },
    }
  }
</script>

<a
  class="btn"
  class:no-hover-underline={!underline}
  class:disabled
  target={useRouter ? '_self' : '_blank'}
  href={url}
  use:router
  on:click
>
  <slot />
</a>

<style>
  .btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;

    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .no-hover-underline:hover {
    text-decoration: none;
  }

  .disabled {
    pointer-events: none;
    cursor: default;
  }
</style>
