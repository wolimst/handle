<script lang="ts">
  export let disabled = false
</script>

<button class="btn" on:click {disabled}>
  <slot />
</button>

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
