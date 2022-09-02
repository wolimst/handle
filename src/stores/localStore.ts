import { writable } from 'svelte/store'

/**
 * Get a persistent store using local storage
 *
 * @param key key of a local storage item to persist the data
 * @param initial initial data to use when the key is missing from the local storage
 */
export function persistentStore<T>(key: string, initial: T) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, JSON.stringify(initial, null, 2))
  }

  const raw = localStorage.getItem(key)
  const data = raw ? (JSON.parse(raw) as T) : initial

  const { subscribe, set } = writable(data)

  const persistentSet = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value, null, 2))
    set(value)
  }

  type Updater = (value: T) => T
  const persistentUpdate = (updateFn: Updater) => {
    persistentSet(updateFn(data))
  }

  return {
    subscribe,
    set: persistentSet,
    update: persistentUpdate,
  }
}
