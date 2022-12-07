import type { Notification } from './types'
import { writable } from 'svelte/store'

export const notification = writable<Notification>({ message: '' })
