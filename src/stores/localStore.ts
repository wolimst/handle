import type { Encoder } from './encoder'
import { writable } from 'svelte/store'

const defaultEncoder: Encoder = {
  decode: (data) => data,
  encode: (data) => data,
}

/**
 * Get a persistent store using local storage
 *
 * @param key key of a local storage item to persist the data
 * @param initial initial data to use when the data doesn't exist in local storage
 * @param encoder encoding and decoding functions to be used on reading and writing local storage
 */
export function persistentStore<T>(
  key: string,
  initial: T,
  encoder: Encoder = defaultEncoder
) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, encoder.encode(JSON.stringify(initial, null, 2)))
  }

  const raw = localStorage.getItem(key)
  const data = raw ? (JSON.parse(encoder.decode(raw)) as T) : initial

  const { subscribe, set } = writable(data)

  const persistentSet = (value: T) => {
    localStorage.setItem(key, encoder.encode(JSON.stringify(value, null, 2)))
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
