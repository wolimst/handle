import { plaintext, type Encoder } from './encoder'
import { writable } from 'svelte/store'

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
  encoder: Encoder = plaintext
) {
  const raw = localStorage.getItem(key)
  let parsedData: T | undefined = undefined
  if (raw) {
    try {
      parsedData = JSON.parse(encoder.decode(raw)) as T
    } catch (_error) {
      alert(
        'The saved data is corrupt. The data will be reset.\n저장된 데이터가 올바르지 않습니다. 데이터를 초기화 합니다.'
      )
      parsedData = undefined
    }
  }

  const data: T = structuredClone(Object.assign({}, initial, parsedData))
  localStorage.setItem(key, encoder.encode(JSON.stringify(data, null, 0)))

  const { subscribe, set } = writable(data)

  const persistentSet = (value: T) => {
    localStorage.setItem(key, encoder.encode(JSON.stringify(value, null, 0)))
    set(value)
  }

  type Updater = (value: T) => T
  const persistentUpdate = (updateFn: Updater) => {
    persistentSet(updateFn(data))
  }

  const exportData = (): string | undefined => {
    return localStorage.getItem(key) || undefined
  }

  const importData = (encodedString: string) => {
    let parsedData: T | undefined = undefined
    try {
      parsedData = JSON.parse(encoder.decode(encodedString)) as T
      if (!parsedData) {
        throw new Error('invalid import data')
      }
    } catch (_error) {
      alert(`앗, 데이터가 올바르지 않아요. (${key})`)
      return
    }

    localStorage.setItem(key, encodedString)
    set(parsedData)
  }

  const resetData = () => {
    localStorage.setItem(key, encoder.encode(JSON.stringify(initial, null, 0)))
    set(initial)
  }

  return {
    subscribe,
    set: persistentSet,
    update: persistentUpdate,
    export: exportData,
    import: importData,
    reset: resetData,
  }
}
