import App from './App.svelte'
import './app.css'
import { applyConfig } from './stores/app'

function initApp() {
  applyConfig()
}

initApp()

const app = new App({
  target: document.body,
})

export default app
