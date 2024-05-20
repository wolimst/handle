<script lang="ts">
  import Badge from '@/components/ui/core/Badge.svelte'
</script>

<div class="tw-max-w-sm tw-text-sm">
  <div class="tw-mb-6">
    <div class="tw-flex tw-items-start tw-gap-2">
      <Badge><code>Q</code></Badge>
      <p class="tw-mt-1">iOS 어플은 없나요?</p>
    </div>

    <div class="tw-flex tw-items-start tw-gap-2">
      <Badge><code>A</code></Badge>
      <p class="tw-mt-1">
        지금은 iOS 어플 개발 예정이 없어요. 개발자가 애플 기기를 보유하고 있지
        않기 때문이죠.😅 하지만, 한들은 PWA(프로그레시브 웹 앱)으로 개발하였기
        때문에, 일반적인 어플처럼 사용할 수 있어요!
        <a
          href="https://web.dev/learn/pwa/installation?hl=ko#ios_and_ipados_installation"
          target="_blank"
          class="tw-underline tw-underline-offset-1 tw-text-app-text"
        >
          Safari에서 PWA 설치하기(홈 화면에 추가)</a
        >를 참고해주세요.
      </p>
    </div>
  </div>

  <div class="tw-mb-6">
    <div class="tw-flex tw-items-start tw-gap-2">
      <Badge><code>Q</code></Badge>
      <p class="tw-mt-1">3글자나 4글자 문제는 없나요?</p>
    </div>

    <div class="tw-flex tw-items-start tw-gap-2">
      <Badge><code>A</code></Badge>
      <p class="tw-mt-1">
        단어 사전을 준비하는데 시간이 걸려 우선순위가 낮은 상황이에요. 커스텀
        문제(사전 미사용 모드)로 3글자와 4글자 문제를 만들 수 있으니
        참고해주세요.
      </p>
    </div>
  </div>

  <div class="tw-mb-6">
    <div class="tw-flex tw-items-start tw-gap-2">
      <Badge><code>Q</code></Badge>
      <p class="tw-mt-1">
        의견이 있어요 / 문제점을 발견했어요 / 다른 것이 궁금해요.
      </p>
    </div>

    <div class="tw-flex tw-items-start tw-gap-2">
      <Badge><code>A</code></Badge>
      <p class="tw-mt-1">공헌하기 탭의 설문지를 이용해주세요!</p>
    </div>
  </div>
</div>
