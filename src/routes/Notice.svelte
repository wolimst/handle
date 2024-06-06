<script context="module" lang="ts">
  import { writable } from 'svelte/store'

  type Menu = '공지사항' | '자주 묻는 질문' | '공헌하기'

  const selected = writable<Menu>('공지사항')
</script>

<script lang="ts">
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import Announcement from '@/routes/notice/Announcement.svelte'
  import Faqs from '@/routes/notice/Faqs.svelte'
  import Contributing from '@/routes/notice/Contributing.svelte'

  const menus: Menu[] = ['공지사항', '자주 묻는 질문', '공헌하기']
</script>

<div
  class="tw-max-w-sm tw-min-h-full tw-mx-auto tw-p-3 tw-flex tw-flex-col tw-flex-nowrap tw-items-center"
>
  <div
    class="tw-w-full tw-mb-6 tw-inline-flex tw-justify-evenly tw-gap-2 tw-border-b tw-border-app-text-secondary md:tw-text-lg tw-font-medium"
  >
    {#each menus as menu}
      <ClickButton on:click={() => ($selected = menu)}>
        <div class="tab-button" class:selected={$selected === menu}>
          {menu}
        </div>
      </ClickButton>
    {/each}
  </div>

  {#if $selected === '공지사항'}
    <Announcement />
  {:else if $selected === '자주 묻는 질문'}
    <Faqs />
  {:else if $selected === '공헌하기'}
    <Contributing />
  {/if}
</div>

<style>
  .tab-button {
    padding: 0.5rem 0;
    border-bottom: 2px solid;
    border-color: transparent;
  }

  .tab-button:not(:disabled):not(.selected):hover {
    border-color: var(--neutral-color);
  }

  .tab-button.selected {
    border-color: var(--primary-color);
  }
</style>
