import { ROUTES } from '@/constants'
import { location } from 'svelte-spa-router'
import { get } from 'svelte/store'

export function isInGamePage(): boolean {
  const path = get(location)
  return ROUTES.game.some((route) => route === path)
}
