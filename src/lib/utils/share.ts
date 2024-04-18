import { notification } from '@/stores/app'

export async function share(data: ShareData) {
  if (!navigator.canShare || !navigator.canShare(data)) {
    notification.set({
      type: 'error',
      message: '앗, 브라우저에서 공유 기능이 지원되지 않아요.',
    })
    throw new Error('share api not supported')
  }

  try {
    await navigator.share(data)
  } catch (e) {
    console.error(e)
    notification.set({
      type: 'error',
      message: '앗, 공유하기에 실패했어요.',
    })
    throw new Error('failed to share')
  }
}

export async function copy(data: string | ClipboardItem[]) {
  try {
    if (typeof data === 'string') {
      await navigator.clipboard.writeText(data)
    } else {
      await navigator.clipboard.write(data)
    }
    notification.set({
      type: 'success',
      message: '클립보드에 복사했어요.',
    })
  } catch (e) {
    console.error(e)
    notification.set({
      type: 'error',
      message: `앗, 클립보드에 복사하지 못했어요.`,
    })
    throw new Error('failed to copy')
  }
}
