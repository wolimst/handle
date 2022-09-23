// Syllable representation using Jamo types
// L: leading consonant
// V: vowel
// T: trailing consonant
// Example: '환경' -> LVVT/LVT
import { DubeolsikIME } from './ime'

describe('tests for DubeolsikIME class', () => {
  test('initial state', () => {
    const ime = new DubeolsikIME()
    expect(ime.value).toStrictEqual('')
  })

  describe('get value() => string & setValue(str: string) => boolean', () => {
    it('should return true and set the string for an Hangul string or an empty string', () => {
      const ime = new DubeolsikIME()
      expect(ime.setValue('ㄱ')).toBeTruthy()
      expect(ime.value).toStrictEqual('ㄱ')
      expect(ime.setValue('ㄳ')).toBeTruthy()
      expect(ime.value).toStrictEqual('ㄳ')
      expect(ime.setValue('ㅎ')).toBeTruthy()
      expect(ime.value).toStrictEqual('ㅎ')
      expect(ime.setValue('ㅏ')).toBeTruthy()
      expect(ime.value).toStrictEqual('ㅏ')
      expect(ime.setValue('ㅘ')).toBeTruthy()
      expect(ime.value).toStrictEqual('ㅘ')
      expect(ime.setValue('ㅣ')).toBeTruthy()
      expect(ime.value).toStrictEqual('ㅣ')
      expect(ime.setValue('ㄱㅅ')).toBeTruthy()
      expect(ime.value).toStrictEqual('ㄱㅅ')
      expect(ime.setValue('ㅈㅏㅁㅗ')).toBeTruthy()
      expect(ime.value).toStrictEqual('ㅈㅏㅁㅗ')
      expect(ime.setValue('가')).toBeTruthy()
      expect(ime.value).toStrictEqual('가')
      expect(ime.setValue('꽋')).toBeTruthy()
      expect(ime.value).toStrictEqual('꽋')
      expect(ime.setValue('구름')).toBeTruthy()
      expect(ime.value).toStrictEqual('구름')
      expect(ime.setValue('긴수염고래')).toBeTruthy()
      expect(ime.value).toStrictEqual('긴수염고래')
      expect(ime.setValue('가나다ㄳㅘ꽋')).toBeTruthy()
      expect(ime.value).toStrictEqual('가나다ㄳㅘ꽋')
      expect(ime.setValue('')).toBeTruthy()
      expect(ime.value).toStrictEqual('')
    })

    it('should return false and cause no state change for an Hangul string that cannot be typed in using Dubeolsik keyboard layout', () => {
      const ime = new DubeolsikIME()
      expect(ime.setValue('ᄀ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('ᄒ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('ᅡ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('ᅵ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('ᆨ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('ᇂ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('ᄫ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('ᆋ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('ퟻ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('ㅥ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('ㆍ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('ㆎ')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
    })

    it('should return false and cause no state change for a non-Hangul string', () => {
      const ime = new DubeolsikIME()
      expect(ime.setValue('*')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('Aa')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('あ漢')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('😊')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
      expect(ime.setValue('글자ㅈㅏㅁㅗAaあ漢😊')).toBeFalsy()
      expect(ime.value).toStrictEqual('')
    })
  })

  describe('type(jamo: DubeolsikJamo)', () => {
    test('Jamo should be added to empty ime value', () => {
      const ime = new DubeolsikIME()

      ime.type('ㄱ')
      expect(ime.value).toStrictEqual('ㄱ')

      ime.setValue('')
      ime.type('ㅏ')
      expect(ime.value).toStrictEqual('ㅏ')

      ime.setValue('')
      ime.type('ㄲ')
      expect(ime.value).toStrictEqual('ㄲ')
    })

    describe('typing one syllable', () => {
      test('LVTT', () => {
        const ime = new DubeolsikIME()
        ime.type('ㄱ')
        expect(ime.value).toStrictEqual('ㄱ')
        ime.type('ㅏ')
        expect(ime.value).toStrictEqual('가')
        ime.type('ㅂ')
        expect(ime.value).toStrictEqual('갑')
        ime.type('ㅅ')
        expect(ime.value).toStrictEqual('값')
      })

      test('LVVTT', () => {
        const ime = new DubeolsikIME()
        ime.type('ㄲ')
        expect(ime.value).toStrictEqual('ㄲ')
        ime.type('ㅗ')
        expect(ime.value).toStrictEqual('꼬')
        ime.type('ㅏ')
        expect(ime.value).toStrictEqual('꽈')
        ime.type('ㄱ')
        expect(ime.value).toStrictEqual('꽉')
        ime.type('ㅅ')
        expect(ime.value).toStrictEqual('꽋')
      })
    })

    describe('typing multiple syllables', () => {
      describe('previous syllable is not affected by following L', () => {
        test('LV + L -> LV/L', () => {
          const ime = new DubeolsikIME()
          ime.type('ㅇ')
          ime.type('ㅏ')
          ime.type('ㅃ')
          expect(ime.value).toStrictEqual('아ㅃ')
          ime.type('ㅏ')
          expect(ime.value).toStrictEqual('아빠')
        })

        test('LVT + L -> LVT/L', () => {
          const ime = new DubeolsikIME()
          ime.setValue('한')
          ime.type('ㄱ')
          expect(ime.value).toStrictEqual('한ㄱ')
          ime.type('ㅡ')
          expect(ime.value).toStrictEqual('한그')
          ime.type('ㄹ')
          expect(ime.value).toStrictEqual('한글')
        })

        test('LVTT + L -> LVTT/L', () => {
          const ime = new DubeolsikIME()
          ime.setValue('앉')
          ime.type('ㄷ')
          expect(ime.value).toStrictEqual('앉ㄷ')
          ime.type('ㅏ')
          expect(ime.value).toStrictEqual('앉다')
        })
      })

      describe('following L become T of previous syllable (도깨비불 현상)', () => {
        test('LVT + V -> LV/LV', () => {
          const ime = new DubeolsikIME()
          ime.setValue('바')
          ime.type('ㄷ')
          expect(ime.value).toStrictEqual('받')
          ime.type('ㅏ')
          expect(ime.value).toStrictEqual('바다')
        })

        test('LVTT + V -> LVT/LV', () => {
          const ime = new DubeolsikIME()
          ime.setValue('은')
          ime.type('ㅎ')
          expect(ime.value).toStrictEqual('읂')
          ime.type('ㅖ')
          expect(ime.value).toStrictEqual('은혜')
        })
      })

      describe('test some words', () => {
        test('도깨비불', () => {
          const ime = new DubeolsikIME()
          ime.type('ㄷ')
          expect(ime.value).toStrictEqual('ㄷ')
          ime.type('ㅗ')
          expect(ime.value).toStrictEqual('도')
          ime.type('ㄲ')
          expect(ime.value).toStrictEqual('돆')
          ime.type('ㅐ')
          expect(ime.value).toStrictEqual('도깨')
          ime.type('ㅂ')
          expect(ime.value).toStrictEqual('도깹')
          ime.type('ㅣ')
          expect(ime.value).toStrictEqual('도깨비')
          ime.type('ㅂ')
          expect(ime.value).toStrictEqual('도깨빕')
          ime.type('ㅜ')
          expect(ime.value).toStrictEqual('도깨비부')
          ime.type('ㄹ')
          expect(ime.value).toStrictEqual('도깨비불')
        })

        test('서울특별시', () => {
          const ime = new DubeolsikIME()
          ime.type('ㅅ')
          expect(ime.value).toStrictEqual('ㅅ')
          ime.type('ㅓ')
          expect(ime.value).toStrictEqual('서')
          ime.type('ㅇ')
          expect(ime.value).toStrictEqual('성')
          ime.type('ㅜ')
          expect(ime.value).toStrictEqual('서우')
          ime.type('ㄹ')
          expect(ime.value).toStrictEqual('서울')
          ime.type('ㅌ')
          expect(ime.value).toStrictEqual('서욽')
          ime.type('ㅡ')
          expect(ime.value).toStrictEqual('서울트')
          ime.type('ㄱ')
          expect(ime.value).toStrictEqual('서울특')
          ime.type('ㅂ')
          expect(ime.value).toStrictEqual('서울특ㅂ')
          ime.type('ㅕ')
          expect(ime.value).toStrictEqual('서울특벼')
          ime.type('ㄹ')
          expect(ime.value).toStrictEqual('서울특별')
          ime.type('ㅅ')
          expect(ime.value).toStrictEqual('서울특볈')
          ime.type('ㅣ')
          expect(ime.value).toStrictEqual('서울특별시')
        })
      })
    })

    describe('test cases containing non-syllables', () => {
      const ime = new DubeolsikIME()
      test('L + L -> TT', () => {
        ime.setValue('')
        ime.type('ㄱ')
        ime.type('ㅅ')
        expect(ime.value).toStrictEqual('ㄳ')

        ime.setValue('')
        ime.type('ㄴ')
        ime.type('ㅈ')
        expect(ime.value).toStrictEqual('ㄵ')

        ime.setValue('')
        ime.type('ㄴ')
        ime.type('ㅎ')
        expect(ime.value).toStrictEqual('ㄶ')

        ime.setValue('')
        ime.type('ㄹ')
        ime.type('ㄱ')
        expect(ime.value).toStrictEqual('ㄺ')

        ime.setValue('')
        ime.type('ㄹ')
        ime.type('ㅁ')
        expect(ime.value).toStrictEqual('ㄻ')

        ime.setValue('')
        ime.type('ㄹ')
        ime.type('ㅂ')
        expect(ime.value).toStrictEqual('ㄼ')

        ime.setValue('')
        ime.type('ㄹ')
        ime.type('ㅅ')
        expect(ime.value).toStrictEqual('ㄽ')

        ime.setValue('')
        ime.type('ㄹ')
        ime.type('ㅌ')
        expect(ime.value).toStrictEqual('ㄾ')

        ime.setValue('')
        ime.type('ㄹ')
        ime.type('ㅍ')
        expect(ime.value).toStrictEqual('ㄿ')

        ime.setValue('')
        ime.type('ㄹ')
        ime.type('ㅎ')
        expect(ime.value).toStrictEqual('ㅀ')

        ime.setValue('')
        ime.type('ㅂ')
        ime.type('ㅅ')
        expect(ime.value).toStrictEqual('ㅄ')
      })

      test('L + L -> L/L', () => {
        ime.setValue('')
        ime.type('ㄱ')
        ime.type('ㄱ')
        expect(ime.value).toStrictEqual('ㄱㄱ')

        ime.setValue('')
        ime.type('ㄷ')
        ime.type('ㄷ')
        expect(ime.value).toStrictEqual('ㄷㄷ')

        ime.setValue('')
        ime.type('ㅂ')
        ime.type('ㅂ')
        expect(ime.value).toStrictEqual('ㅂㅂ')

        ime.setValue('')
        ime.type('ㅅ')
        ime.type('ㅅ')
        expect(ime.value).toStrictEqual('ㅅㅅ')

        ime.setValue('')
        ime.type('ㅈ')
        ime.type('ㅈ')
        expect(ime.value).toStrictEqual('ㅈㅈ')

        ime.setValue('')
        ime.type('ㄱ')
        ime.type('ㅇ')
        expect(ime.value).toStrictEqual('ㄱㅇ')
      })

      test('TT + L -> TT/L', () => {
        ime.setValue('')
        ime.setValue('ㄳ')
        ime.type('ㅅ')
        expect(ime.value).toStrictEqual('ㄳㅅ')

        ime.setValue('ㄼ')
        ime.type('ㅅ')
        expect(ime.value).toStrictEqual('ㄼㅅ')
      })

      test('TT + V -> L/LV', () => {
        ime.setValue('ㄳ')
        ime.type('ㅏ')
        expect(ime.value).toStrictEqual('ㄱ사')
      })

      test('V + V -> VV', () => {
        ime.setValue('')
        ime.type('ㅗ')
        ime.type('ㅏ')
        expect(ime.value).toStrictEqual('ㅘ')

        ime.setValue('')
        ime.type('ㅗ')
        ime.type('ㅐ')
        expect(ime.value).toStrictEqual('ㅙ')

        ime.setValue('')
        ime.type('ㅗ')
        ime.type('ㅣ')
        expect(ime.value).toStrictEqual('ㅚ')

        ime.setValue('')
        ime.type('ㅜ')
        ime.type('ㅓ')
        expect(ime.value).toStrictEqual('ㅝ')

        ime.setValue('')
        ime.type('ㅜ')
        ime.type('ㅔ')
        expect(ime.value).toStrictEqual('ㅞ')

        ime.setValue('')
        ime.type('ㅜ')
        ime.type('ㅣ')
        expect(ime.value).toStrictEqual('ㅟ')

        ime.setValue('')
        ime.type('ㅡ')
        ime.type('ㅣ')
        expect(ime.value).toStrictEqual('ㅢ')
      })

      test('V + V -> V/V', () => {
        ime.setValue('')
        ime.type('ㅏ')
        ime.type('ㅏ')
        expect(ime.value).toStrictEqual('ㅏㅏ')

        ime.setValue('')
        ime.type('ㅏ')
        ime.type('ㅣ')
        expect(ime.value).toStrictEqual('ㅏㅣ')

        ime.setValue('')
        ime.type('ㅡ')
        ime.type('ㅓ')
        expect(ime.value).toStrictEqual('ㅡㅓ')
      })

      test('VV + V -> VV/V', () => {
        ime.setValue('ㅘ')
        ime.type('ㅣ')
        expect(ime.value).toStrictEqual('ㅘㅣ')
      })

      test('V + T -> V/L', () => {
        ime.setValue('ㅏ')
        ime.type('ㄱ')
        expect(ime.value).toStrictEqual('ㅏㄱ')
      })

      test('VV + T -> VV/L', () => {
        ime.setValue('ㅘ')
        ime.type('ㄱ')
        expect(ime.value).toStrictEqual('ㅘㄱ')
      })
    })
  })

  test('delete()', () => {
    const ime = new DubeolsikIME()
    expect(ime.setValue('괜찮아')).toBeTruthy()
    expect(ime.value).toStrictEqual('괜찮아')

    ime.delete()
    expect(ime.value).toStrictEqual('괜찮ㅇ')
    ime.delete()
    expect(ime.value).toStrictEqual('괜찮')
    ime.delete()
    expect(ime.value).toStrictEqual('괜찬')
    ime.delete()
    expect(ime.value).toStrictEqual('괜차')
    ime.delete()
    expect(ime.value).toStrictEqual('괜ㅊ')
    ime.delete()
    expect(ime.value).toStrictEqual('괜')
    ime.delete()
    expect(ime.value).toStrictEqual('괘')
    ime.delete()
    expect(ime.value).toStrictEqual('고')
    ime.delete()
    expect(ime.value).toStrictEqual('ㄱ')
    ime.delete()
    expect(ime.value).toStrictEqual('')
    ime.delete()
    expect(ime.value).toStrictEqual('')
  })

  describe('tests typing and deletion', () => {
    const ime = new DubeolsikIME()
    test('TT.delete() -> L.type(V) -> LV', () => {
      ime.setValue('ㄳ')
      expect(ime.value).toStrictEqual('ㄳ')

      ime.delete()
      expect(ime.value).toStrictEqual('ㄱ')

      ime.type('ㅏ')
      expect(ime.value).toStrictEqual('가')
    })

    test('LV.delete() -> L.type(L) -> TT', () => {
      ime.setValue('가')
      expect(ime.value).toStrictEqual('가')

      ime.delete()
      expect(ime.value).toStrictEqual('ㄱ')

      ime.type('ㅅ')
      expect(ime.value).toStrictEqual('ㄳ')
    })

    test('TT.type(V) -> L/LV.delete() -> L/L.delete() -> L.type(V) -> LV', () => {
      ime.setValue('ㄳ')
      expect(ime.value).toStrictEqual('ㄳ')

      ime.type('ㅏ')
      expect(ime.value).toStrictEqual('ㄱ사')

      ime.delete()
      expect(ime.value).toStrictEqual('ㄱㅅ')

      ime.delete()
      expect(ime.value).toStrictEqual('ㄱ')

      ime.type('ㅏ')
      expect(ime.value).toStrictEqual('가')
    })
  })
})
