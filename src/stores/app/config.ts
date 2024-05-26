import { notification } from './notification'
import type { Config } from './types'
import { persistentStore } from '@/stores/localStore'
import { get } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

const defaultConfig: Config = {
  showHelpOnLaunch: true,
  submitResult: true,
  userId: uuidv4(),
  userName: '익명',
  darkTheme: window.matchMedia('(prefers-color-scheme: dark)').matches,
  switchEnterAndBackspacePosition: false,
  isBeingUpdated: false,
  useShorterBox: false,
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
  updateThemeColorMetaTag()
  return config
}

export function applyConfig() {
  if (get(config).darkTheme) {
    document.documentElement.classList.add('dark-theme')
  }
  updateThemeColorMetaTag()

  if (get(config).isBeingUpdated) {
    config.update((config) => {
      config.isBeingUpdated = false
      return config
    })
    notification.set({ type: 'success', message: '업데이트를 완료했어요!' })
  }
}

function updateThemeColorMetaTag() {
  const themeColor = getComputedStyle(document.body)
    .getPropertyValue('--background-color')
    .trim()

  let metaTag = document.head.querySelector('meta[name="theme-color"]')
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute('name', 'theme-color')
    document.head.appendChild(metaTag)
  }
  metaTag.setAttribute('content', themeColor)
}
