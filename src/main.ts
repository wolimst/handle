import App from './App.svelte'
import './app.css'
import { applyConfig } from './stores/app'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  async onNeedRefresh() {
    const answer = confirm('새로운 버전이 있어요. 업데이트를 적용할까요?')
    if (answer) {
      await updateSW(true)
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
