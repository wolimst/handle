<script lang="ts">
  import NotFoundIcon from '@/components/ui/icons/NotFound.svelte'
</script>

<div
  class="tw-container tw-p-10 tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-6"
>
  <NotFoundIcon widthPerSyllable={128} gapRem={0.75} />

  <div class="tw-mt-4 tw-text-lg">앗, 요청하신 페이지를 찾을 수 없어요.</div>

  <div class="tw-italic tw-text-app-text-secondary">404 - Page Not Found</div>
</div>
