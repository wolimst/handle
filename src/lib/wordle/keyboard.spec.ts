import { Keyboard } from './keyboard'
import type { KeyboardError } from './types'
import type * as Hangul from '@/lib/hangul'

const ERR_LENGTH: KeyboardError = 'lengthExceeded'
const ERR_HANGUL: KeyboardError = 'nonHangul'

describe('tests for keyboard class', () => {
  const answerLength = 2

  test('initial status', () => {
    const keyboard = new Keyboard(answerLength)

    expect(keyboard.value).toStrictEqual('')
    expect(keyboard.guess).toStrictEqual<Hangul.Word>({
      value: '',
      length: 0,
      syllables: [],
    })
    expect(keyboard.codePointLength()).toStrictEqual(0)
  })

  describe('getter and setter for value property', () => {
    test('setter should return `undefined` for empty string', () => {
      const keyboard = new Keyboard(answerLength)
      expect(keyboard.value).toStrictEqual('')

      const setError1 = keyboard.setValue('')
      expect(setError1).toBeUndefined()
      expect(keyboard.value).toStrictEqual('')

      const setError2 = keyboard.setValue('ㄱ')
      expect(setError2).toBeUndefined()
      expect(keyboard.value).toStrictEqual('ㄱ')

      const setError3 = keyboard.setValue('')
      expect(setError3).toBeUndefined()
      expect(keyboard.value).toStrictEqual('')
    })

    test('setter should return `undefined` for Hangul string', () => {
      const keyboard = new Keyboard(answerLength)
      expect(keyboard.value).toStrictEqual('')

      const setError1 = keyboard.setValue('ㄱ')
      expect(setError1).toBeUndefined()
      expect(keyboard.value).toStrictEqual('ㄱ')

      const setError2 = keyboard.setValue('구')
      expect(setError2).toBeUndefined()
      expect(keyboard.value).toStrictEqual('구')

      const setError3 = keyboard.setValue('굴')
      expect(setError3).toBeUndefined()
      expect(keyboard.value).toStrictEqual('굴')

      const setError4 = keyboard.setValue('구르')
      expect(setError4).toBeUndefined()
      expect(keyboard.value).toStrictEqual('구르')

      const setError5 = keyboard.setValue('구름')
      expect(setError5).toBeUndefined()
      expect(keyboard.value).toStrictEqual('구름')
    })

    test('setter should return an error for Hangul string longer than answerLength', () => {
      const keyboard = new Keyboard(answerLength)

      const setError1 = keyboard.setValue('가')
      expect(setError1).toBeUndefined()
      expect(keyboard.value).toStrictEqual('가')

      const setError2 = keyboard.setValue('긴수염고래')
      expect(setError2).toStrictEqual(ERR_LENGTH)
      expect(keyboard.value).toStrictEqual('가')
    })

    test('setter should return an error for string that contains non-Hangul', () => {
      const keyboard = new Keyboard(answerLength)

      const setError1 = keyboard.setValue('가')
      expect(setError1).toBeUndefined()
      expect(keyboard.value).toStrictEqual('가')

      const setError2 = keyboard.setValue('Aa')
      expect(setError2).toStrictEqual(ERR_HANGUL)
      expect(keyboard.value).toStrictEqual('가')

      const setError3 = keyboard.setValue('가A')
      expect(setError3).toStrictEqual(ERR_HANGUL)
      expect(keyboard.value).toStrictEqual('가')

      const setError4 = keyboard.setValue('あ漢')
      expect(setError4).toStrictEqual(ERR_HANGUL)
      expect(keyboard.value).toStrictEqual('가')

      const setError5 = keyboard.setValue('*😊')
      expect(setError5).toStrictEqual(ERR_HANGUL)
      expect(keyboard.value).toStrictEqual('가')
    })
  })

  // Skip tests on following methods because they are just simple wrappers for
  // tested functions in Hangul library
  describe.skip('getter for guess property')
  describe.skip('codePointLength() => number')
})
