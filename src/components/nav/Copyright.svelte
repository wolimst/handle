<script lang="ts">
  import GitHubIcon from '@/components/ui/icons/GitHub.svelte'
</script>

<div class="tw-text-xs tw-text-app-text-secondary">
  <p>
    단어 리스트는
    <a
      href="https://www.korean.go.kr/front/etcData/etcDataView.do?mn_id=208&etc_seq=71"
      target="_blank"
      class="tw-underline tw-underline-offset-1 tw-text-app-text-secondary"
    >
      한국어 학습용 어휘 목록</a
    >,
    <a
      href="https://kbig.kr/portal/kbig/datacube/niadict.page"
      target="_blank"
      class="tw-underline tw-underline-offset-1 tw-text-app-text-secondary"
    >
      한글 형태소 사전</a
    >,
    <a
      href="https://krdict.korean.go.kr/kor/mainAction"
      target="_blank"
      class="tw-underline tw-underline-offset-1 tw-text-app-text-secondary"
    >
      한국어기초사전</a
    >,

    <a
      href="https://stdict.korean.go.kr/main/main.do"
      target="_blank"
      class="tw-underline tw-underline-offset-1 tw-text-app-text-secondary"
    >
      표준국어대사전</a
    >,
    <a
      href="https://opendict.korean.go.kr/main"
      target="_blank"
      class="tw-underline tw-underline-offset-1 tw-text-app-text-secondary"
    >
      우리말샘</a
    >의 단어를 편집하여 제작하였습니다.
  </p>

  <p
    class="tw-mt-2 tw-flex tw-flex-wrap tw-justify-between tw-items-center tw-gap-2"
  >
    <a
      href="https://github.com/wolimst/handle"
      target="_blank"
      class="tw-underline tw-underline-offset-1 tw-text-app-text-secondary tw-flex tw-gap-1"
    >
      <GitHubIcon width={16} /> GitHub
    </a>

    <span> © 2022-present wolimst & 한들 Contributors </span>
  </p>
</div>
