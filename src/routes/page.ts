import { BASE_URL, ROUTES } from '@/constants'
import { location } from 'svelte-spa-router'
import { get } from 'svelte/store'

export function getAbsoluteUrl(relative_url: string): URL {
  if (!relative_url.startsWith('/#')) {
    relative_url = '/#' + relative_url
  }
  return new URL(BASE_URL + relative_url, window.location.origin)
}

export function getCurrentAbsoluteUrl(): URL {
  const path = get(location)
  return getAbsoluteUrl(path)
}

export function isInGamePage(): boolean {
  const path = get(location)
  return ROUTES.game.some((route) => route === path)
}

export function refreshIfAlreadyInPage(path: string) {
  if (path === get(location)) {
    window.location.reload()
  }
}
