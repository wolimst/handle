import type { Config } from './types'
import { persistentStore } from '@/stores/localStore'
import { get } from 'svelte/store'

const defaultConfig: Config = {
  showHelpOnLaunch: true,
  darkTheme: window.matchMedia('(prefers-color-scheme: dark)').matches,
  showInputForm: false,
  switchEnterAndBackspacePosition: false,
}

const store = persistentStore('config', defaultConfig)

export const config = {
  ...store,
  toggleTheme: () => {
    store.update(toggleTheme)
  },
}

function toggleTheme(config: Config): Config {
  config.darkTheme = !config.darkTheme
  document.documentElement.classList.toggle('dark-theme')
  return config
}

export function applyConfig() {
  if (get(config).darkTheme) {
    document.documentElement.classList.add('dark-theme')
  }
}
