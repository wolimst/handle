import {
  FIRST_SYLLABLE,
  LAST_SYLLABLE,
  isHangul,
  getCodePointLength,
  toWord,
} from '.'
import type { Word } from './types'

describe('isHangul(str: string) => boolean', () => {
  it('should return true for empty string', () => {
    expect(isHangul('')).toBeTruthy()
  })

  it('should return true for Hangul string', () => {
    expect(isHangul('ㄱ')).toBeTruthy()
    expect(isHangul('ㄳ')).toBeTruthy()
    expect(isHangul('ㅎ')).toBeTruthy()
    expect(isHangul('ㅏ')).toBeTruthy()
    expect(isHangul('ㅘ')).toBeTruthy()
    expect(isHangul('ㅣ')).toBeTruthy()

    expect(isHangul(String.fromCodePoint(FIRST_SYLLABLE))).toBeTruthy()
    expect(isHangul('꽋')).toBeTruthy()
    expect(isHangul(String.fromCodePoint(LAST_SYLLABLE))).toBeTruthy()

    expect(isHangul('ㄱㅏ')).toBeTruthy()
    expect(isHangul('ㄱㄱ')).toBeTruthy()
    expect(isHangul('ㄱㅏㅇ')).toBeTruthy()

    expect(isHangul('가ㄱ')).toBeTruthy()
    expect(isHangul('ㄱ가')).toBeTruthy()

    expect(isHangul('구름')).toBeTruthy()
    expect(isHangul('긴수염고래')).toBeTruthy()
  })

  it('should return false for string that contains non-Hangul string', () => {
    expect(isHangul('*')).toBeFalsy()
    expect(isHangul('Aa')).toBeFalsy()
    expect(isHangul('あ漢')).toBeFalsy()
    expect(isHangul('😊')).toBeFalsy()
    expect(isHangul('한글Aaあ漢😊')).toBeFalsy()
  })

  it('should return false for Hangul characters that cannot be input in Dubeolsik keyboard layout', () => {
    // Some of Hangul Jamo *clusters*
    // They are different characters from Jamo of Duboelsik keyboard input
    expect(isHangul('ᄀ')).toBeFalsy()
    expect(isHangul('ᄒ')).toBeFalsy()
    expect(isHangul('ᅡ')).toBeFalsy()
    expect(isHangul('ᅵ')).toBeFalsy()
    expect(isHangul('ᆨ')).toBeFalsy()
    expect(isHangul('ᇂ')).toBeFalsy()
    expect(isHangul('ᄫ')).toBeFalsy()
    expect(isHangul('ᆋ')).toBeFalsy()

    // Some of Hangul Jamo Extended-A unicode characters
    expect(isHangul('ꥠ')).toBeFalsy()
    expect(isHangul('ꥪ')).toBeFalsy()
    expect(isHangul('ꥼ')).toBeFalsy()

    // Some of Hangul Jamo Extended-B unicode characters
    expect(isHangul('ힰ')).toBeFalsy()
    expect(isHangul('ퟆ')).toBeFalsy()
    expect(isHangul('ퟻ')).toBeFalsy()

    // Some of Obsolete Hangul characters
    expect(isHangul('ㅥ')).toBeFalsy()
    expect(isHangul('ㆅ')).toBeFalsy()
    expect(isHangul('ㆋ')).toBeFalsy()
    expect(isHangul('ㆍ')).toBeFalsy()
    expect(isHangul('ㆎ')).toBeFalsy()
  })
})

describe('getCodePointLength(str: string) => number', () => {
  it('should return 0 for empty string', () => {
    expect(getCodePointLength('')).toBe(0)
  })

  it('should return correct code point length for Hangul', () => {
    // Syllable
    expect(getCodePointLength('가')).toBe(1)
    expect(getCodePointLength('각')).toBe(1)
    expect(getCodePointLength('갃')).toBe(1)
    expect(getCodePointLength('곿')).toBe(1)
    expect(getCodePointLength('꽋')).toBe(1)
    expect(getCodePointLength('한글')).toBe(2)
    expect(getCodePointLength('시나브로')).toBe(4)

    // Jamo
    expect(getCodePointLength('ㄱ')).toBe(1)
    expect(getCodePointLength('ㄲ')).toBe(1)
    expect(getCodePointLength('ㄳ')).toBe(1)
    expect(getCodePointLength('ㅏ')).toBe(1)
    expect(getCodePointLength('ㅘ')).toBe(1)
    expect(getCodePointLength('ㄱㅏ')).toBe(2)
    expect(getCodePointLength('ㄱㄱ')).toBe(2)
    expect(getCodePointLength('ㄱㅏㅇ')).toBe(3)

    // Syllable and Jamo
    expect(getCodePointLength('가ㄱ')).toBe(2)
    expect(getCodePointLength('ㄱ가')).toBe(2)
  })

  // Tests for non-Hangul string are skipped
})

describe('toWord(str: string) -> Word', () => {
  it('should return empty array for empty input', () => {
    expect(toWord('')).toStrictEqual<Word>({
      value: '',
      length: 0,
      syllables: [],
    })
  })

  it('should decompose syllables that contain 0 trailing consonant', () => {
    expect(toWord('가')).toStrictEqual<Word>({
      value: '가',
      length: 1,
      syllables: [
        {
          value: '가',
          leadingConsonant: 'ㄱ',
          vowels: ['ㅏ'],
          trailingConsonants: [],
        },
      ],
    })
    expect(toWord('우리')).toStrictEqual<Word>({
      value: '우리',
      length: 2,
      syllables: [
        {
          value: '우',
          leadingConsonant: 'ㅇ',
          vowels: ['ㅜ'],
          trailingConsonants: [],
        },
        {
          value: '리',
          leadingConsonant: 'ㄹ',
          vowels: ['ㅣ'],
          trailingConsonants: [],
        },
      ],
    })
  })

  it('should decompose syllables that contain 2 vowels', () => {
    expect(toWord('의외')).toStrictEqual<Word>({
      value: '의외',
      length: 2,
      syllables: [
        {
          value: '의',
          leadingConsonant: 'ㅇ',
          vowels: ['ㅡ', 'ㅣ'],
          trailingConsonants: [],
        },
        {
          value: '외',
          leadingConsonant: 'ㅇ',
          vowels: ['ㅗ', 'ㅣ'],
          trailingConsonants: [],
        },
      ],
    })
  })

  it('should decompose syllables that contain 1 trailing consonant', () => {
    expect(toWord('군밤')).toStrictEqual<Word>({
      value: '군밤',
      length: 2,
      syllables: [
        {
          value: '군',
          leadingConsonant: 'ㄱ',
          vowels: ['ㅜ'],
          trailingConsonants: ['ㄴ'],
        },
        {
          value: '밤',
          leadingConsonant: 'ㅂ',
          vowels: ['ㅏ'],
          trailingConsonants: ['ㅁ'],
        },
      ],
    })
  })

  it('should decompose syllables that contain 2 trailing consonants', () => {
    expect(toWord('삶')).toStrictEqual<Word>({
      value: '삶',
      length: 1,
      syllables: [
        {
          value: '삶',
          leadingConsonant: 'ㅅ',
          vowels: ['ㅏ'],
          trailingConsonants: ['ㄹ', 'ㅁ'],
        },
      ],
    })
  })

  it('should decompose syllables that contain double consonants, 1 vowel and 1 trailing consonant', () => {
    expect(toWord('껫빴')).toStrictEqual<Word>({
      value: '껫빴',
      length: 2,
      syllables: [
        {
          value: '껫',
          leadingConsonant: 'ㄲ',
          vowels: ['ㅔ'],
          trailingConsonants: ['ㅅ'],
        },
        {
          value: '빴',
          leadingConsonant: 'ㅃ',
          vowels: ['ㅏ'],
          trailingConsonants: ['ㅆ'],
        },
      ],
    })
  })

  it('should decompose syllables that contain 2 vowels and 2 trailing consonants', () => {
    expect(toWord('뷁')).toStrictEqual<Word>({
      value: '뷁',
      length: 1,
      syllables: [
        {
          value: '뷁',
          leadingConsonant: 'ㅂ',
          vowels: ['ㅜ', 'ㅔ'],
          trailingConsonants: ['ㄹ', 'ㄱ'],
        },
      ],
    })
  })

  it('should ignore characters that are not Hangul syllables', () => {
    expect(toWord(' ')).toStrictEqual<Word>({
      value: '',
      length: 0,
      syllables: [],
    })
    expect(toWord('A')).toStrictEqual<Word>({
      value: '',
      length: 0,
      syllables: [],
    })
    expect(toWord('Aa')).toStrictEqual<Word>({
      value: '',
      length: 0,
      syllables: [],
    })
    expect(toWord('*ㄱㅏ가あ漢😊')).toStrictEqual<Word>({
      value: '가',
      length: 1,
      syllables: [
        {
          value: '가',
          leadingConsonant: 'ㄱ',
          vowels: ['ㅏ'],
          trailingConsonants: [],
        },
      ],
    })
  })
})
