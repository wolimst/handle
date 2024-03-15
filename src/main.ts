import App from './App.svelte'
import './app.css'
import { getCurrentAbsoluteUrl } from './routes/page'
import { applyConfig, config, notification } from './stores/app'
import { registerSW } from 'virtual:pwa-register'

function initApp() {
  skipInAppBrowser()
  applyConfig()
}

initApp()

function skipInAppBrowser() {
  const url = getCurrentAbsoluteUrl()
  const userAgent = navigator.userAgent.toLowerCase()
  if (/kakaotalk/.test(userAgent)) {
    window.location.href =
      'kakaotalk://web/openExternal?url=' + encodeURIComponent(url.href)
    window.setTimeout(() => {
      if (/ipad|iphone|ipod/.test(userAgent)) {
        location.href = 'kakaoweb://closeBrowser'
      } else {
        location.href = 'kakaotalk://inappbrowser/close'
      }
    })
  } else if (userAgent.match(/line/i)) {
    url.searchParams.append('openExternalBrowser', '1')
    window.location.href = url.href
  }
}

const updateSW = registerSW({
  onNeedRefresh() {
    const answer = confirm('새로운 버전이 있어요. 업데이트를 적용할까요?')
    if (answer) {
      updateSW(true)
        .then(() => {
          config.update((config) => {
            config.isBeingUpdated = true
            return config
          })
        })
        .catch((e) => {
          notification.set({
            type: 'error',
            message: '앗, 업데이트에 실패했어요.',
          })
          console.error(e)
        })
    }
  },
})

const app = new App({
  target: document.body,
})

export default app
