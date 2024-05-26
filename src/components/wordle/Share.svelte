<script context="module" lang="ts">
  import { writable } from 'svelte/store'

  const open = writable(false)

  export function openShareModal() {
    open.set(true)
  }

  export function closeShareModal() {
    open.set(false)
  }
</script>

<script lang="ts">
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import Modal from '@/components/ui/core/Modal.svelte'
  import ClipboardIcon from '@/components/ui/icons/Clipboard.svelte'
  import ShareIcon from '@/components/ui/icons/Share.svelte'
  import Spinner from '@/components/ui/icons/Spinner.svelte'
  import { DOM_ID_GAME_CONTAINER } from '@/constants'
  import { browser, share } from '@/lib/utils'
  import { getGameDescription, getGameShareString } from '@/lib/wordle/share'
  import {
    getBackgroundColor,
    getCurrentAbsoluteUrl,
    isInGamePage,
  } from '@/routes/page'
  import html2canvas from 'html2canvas'
  import { get } from 'svelte/store'
  import { game } from './store'

  interface Loading {
    imageShare: boolean
    imageCopy: boolean
  }

  let loading: Loading = {
    imageShare: false,
    imageCopy: false,
  }

  function toggleModal() {
    $open = !$open
  }

  function getDescription(): string {
    if (isInGamePage()) {
      return getGameDescription(get(game).data)
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
    return share.share(data).then(() => ($open = false))
  }

  function copyCurrentPage() {
    const description = getDescription()
    const url = getCurrentAbsoluteUrl()
    const text = `${description} ${url.href}`.trim()
    return share.copy(text).then(() => ($open = false))
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
    const text = getGameShareString(get(game).data)
    return share.share({ text }).then(() => ($open = false))
  }

  function copyGameAsEmoji() {
    const text = getGameShareString(get(game).data)
    return share.copy(text).then(() => ($open = false))
  }

  function shareGameAsImage() {
    return getGameAsBlob().then((blob) => {
      const url = getCurrentAbsoluteUrl()
      const data: ShareData = {
        title: getDescription(),
        url: url.href,
        files: [new File([blob], 'handle.png', { type: blob.type })],
      }
      return share.share(data).then(() => ($open = false))
    })
  }

  function copyGameAsImage() {
    return getGameAsBlob().then((blob) => {
      const clipboardItem = new ClipboardItem({
        [blob.type]: blob,
      })
      return share.copy([clipboardItem]).then(() => ($open = false))
    })
  }

  function withLoading(property: keyof Loading, func: () => Promise<unknown>) {
    loading[property] = true
    void new Promise((r) => setTimeout(r, 50))
      .then(() => func())
      .finally(() => (loading[property] = false))
  }
</script>

<ClickButton on:click={toggleModal}>
  <ShareIcon width={20} />
</ClickButton>

<Modal bind:open={$open} title="공유하기" widthCss="20rem">
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
              {#if loading.imageShare}
                <Spinner />
              {:else}
                <ClickButton
                  on:click={() => withLoading('imageShare', shareGameAsImage)}
                >
                  <ShareIcon width={22} />
                </ClickButton>
              {/if}
            {/if}
            {#if loading.imageCopy}
              <Spinner />
            {:else}
              <ClickButton
                on:click={() => withLoading('imageCopy', copyGameAsImage)}
              >
                <ClipboardIcon width={22} />
              </ClickButton>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</Modal>
