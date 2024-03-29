<script lang="ts">
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import Modal from '@/components/ui/core/Modal.svelte'
  import Toggle from '@/components/ui/core/Toggle.svelte'
  import ClipboardIcon from '@/components/ui/icons/Clipboard.svelte'
  import ShareIcon from '@/components/ui/icons/Share.svelte'
  import { DOM_ID_GAME_CONTAINER } from '@/constants'
  import { browser } from '@/lib/utils'
  import {
    copyResult,
    getGameDescription,
    getGameShareString,
    shareResult,
  } from '@/lib/wordle/share'
  import {
    getBackgroundColor,
    getCurrentAbsoluteUrl,
    isInGamePage,
  } from '@/routes/page'
  import html2canvas from 'html2canvas'
  import { get } from 'svelte/store'
  import { game } from './store'

  let open = false
  let hideJamo = false

  function toggleModal() {
    open = !open
  }

  function getDescription(): string {
    if (isInGamePage()) {
      return getGameDescription(get(game).config)
    }
    return '모아쓰는 한글 워들'
  }

  function shareCurrentPage() {
    const description = getDescription()
    const url = getCurrentAbsoluteUrl()
    const data = {
      title: description,
      url: url.href,
    }
    void shareResult(data).then(() => (open = false))
  }

  function copyCurrentPage() {
    const description = getDescription()
    const url = getCurrentAbsoluteUrl()
    const text = `${description} ${url.href}`.trim()
    void copyResult(text).then(() => (open = false))
  }

  async function getGameAsBlob() {
    const gameContainer = document.querySelector(
      `div#${DOM_ID_GAME_CONTAINER}`
    ) as HTMLDivElement
    if (!gameContainer) {
      throw new Error('failed to retrieve the game container')
    }
    const canvas = await html2canvas(gameContainer, {
      backgroundColor: getBackgroundColor(),
    })
    const blob = await new Promise((resolve: BlobCallback) =>
      canvas.toBlob(resolve)
    ).then((blob) => {
      if (!blob) {
        throw new Error('invalid blob')
      }
      return blob
    })
    return blob
  }

  function shareGameAsEmoji() {
    const text = getGameShareString(get(game))
    void shareResult({ text }).then(() => (open = false))
  }

  function copyGameAsEmoji() {
    const text = getGameShareString(get(game))
    void copyResult(text).then(() => (open = false))
  }

  function shareGameAsImage() {
    void getGameAsBlob().then((blob) => {
      const url = getCurrentAbsoluteUrl()
      const data: ShareData = {
        title: getDescription(),
        url: url.href,
        files: [new File([blob], 'handle.png', { type: blob.type })],
      }
      void shareResult(data).then(() => (open = false))
    })
  }

  function copyGameAsImage() {
    void getGameAsBlob().then((blob) => {
      const clipboardItem = new ClipboardItem({
        [blob.type]: blob,
      })
      void copyResult([clipboardItem]).then(() => (open = false))
    })
  }
</script>

<ClickButton on:click={toggleModal}>
  <ShareIcon width={22} />
</ClickButton>

<Modal bind:open title="공유하기 (Beta)" widthCss="20rem">
  <div class="tw-w-full tw-h-full tw-inline-flex tw-flex-col tw-gap-8 tw-py-4">
    <div class="tw-inline-flex tw-justify-between tw-items-center">
      <span>이 페이지를 공유하기</span>
      <div class="tw-inline-flex tw-gap-5">
        {#if !browser.isDesktop()}
          <ClickButton on:click={shareCurrentPage}>
            <ShareIcon width={22}></ShareIcon>
          </ClickButton>
        {/if}
        <ClickButton on:click={copyCurrentPage}>
          <ClipboardIcon width={22}></ClipboardIcon>
        </ClickButton>
      </div>
    </div>

    {#if isInGamePage()}
      <div class="tw-w-full tw-inline-flex tw-justify-between tw-items-center">
        <span>텍스트로 결과 공유하기</span>
        <div class="tw-inline-flex tw-gap-5">
          {#if browser.isMobileChromeOrSafari()}
            <ClickButton on:click={shareGameAsEmoji}>
              <ShareIcon width={22} />
            </ClickButton>
          {/if}
          <ClickButton on:click={copyGameAsEmoji}>
            <ClipboardIcon width={22} />
          </ClickButton>
        </div>
      </div>

      <div class="tw-inline-flex tw-flex-col tw-gap-3">
        <div
          class="tw-w-full tw-inline-flex tw-justify-between tw-items-center"
        >
          <span>이미지로 결과 공유하기</span>
          <div class="tw-inline-flex tw-gap-5">
            {#if browser.isMobileChromeOrSafari()}
              <ClickButton on:click={shareGameAsImage}>
                <ShareIcon width={22} />
              </ClickButton>
            {/if}
            <ClickButton on:click={copyGameAsImage}>
              <ClipboardIcon width={22} />
            </ClickButton>
          </div>
        </div>

        <Toggle bind:checked={hideJamo} disabled>글자 숨기기 (지원예정)</Toggle>
      </div>
    {/if}
  </div>
</Modal>
