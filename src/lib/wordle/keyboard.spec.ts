import { Keyboard } from './keyboard'
import type * as Hangul from '@/lib/hangul'

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
    it('should accept empty string', () => {
      const keyboard = new Keyboard(answerLength)
      expect(keyboard.value).toStrictEqual('')
      keyboard.value = 'ㄱ'
      expect(keyboard.value).toStrictEqual('ㄱ')
      keyboard.value = ''
      expect(keyboard.value).toStrictEqual('')
    })

    it('should accept Hangul string', () => {
      const keyboard = new Keyboard(answerLength)
      expect(keyboard.value).toStrictEqual('')
      keyboard.value = 'ㄱ'
      expect(keyboard.value).toStrictEqual('ㄱ')
      keyboard.value = '구'
      expect(keyboard.value).toStrictEqual('구')
      keyboard.value = '굴'
      expect(keyboard.value).toStrictEqual('굴')
      keyboard.value = '구르'
      expect(keyboard.value).toStrictEqual('구르')
      keyboard.value = '구름'
      expect(keyboard.value).toStrictEqual('구름')
    })

    it('should ignore Hangul string longer than answerLength', () => {
      const keyboard = new Keyboard(answerLength)
      keyboard.value = '가'
      expect(keyboard.value).toStrictEqual('가')
      keyboard.value = '긴수염고래'
      expect(keyboard.value).toStrictEqual('가')
    })

    it('should ignore string that contains non-Hangul', () => {
      const keyboard = new Keyboard(answerLength)
      keyboard.value = '가'
      expect(keyboard.value).toStrictEqual('가')
      keyboard.value = 'Aa'
      expect(keyboard.value).toStrictEqual('가')
      keyboard.value = '가Aa'
      expect(keyboard.value).toStrictEqual('가')
      keyboard.value = 'あ漢'
      expect(keyboard.value).toStrictEqual('가')
      keyboard.value = '*😊'
      expect(keyboard.value).toStrictEqual('가')
    })
  })

  // Skip tests on following methods because they are just simple wrappers for
  // tested functions in Hangul library
  describe.skip('getter for guess property')
  describe.skip('codePointLength() => number')
})
