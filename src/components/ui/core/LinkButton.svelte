<script lang="ts">
  export let link: string = ''
  export let underline = true
  export let disabled = false

  $: underlineClass = underline ? 'hover:tw-underline' : 'hover:tw-no-underline'
</script>

<a class={`btn ${underlineClass}`} href={link} {disabled}>
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
</style>
