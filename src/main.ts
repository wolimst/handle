import App from './App.svelte'
import './app.css'
import { applyConfig, config, notification } from './stores/app'
import { registerSW } from 'virtual:pwa-register'

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

function initApp() {
  applyConfig()
}

initApp()

const app = new App({
  target: document.body,
})

export default app
