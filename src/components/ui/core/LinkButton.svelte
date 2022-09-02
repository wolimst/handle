<script lang="ts">
  export let link: string = ''
</script>

<a class="btn" href={link}>
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
