import { GameConfig } from './game'
import { getSupportedLengths } from './words'
import * as Hangul from '@/lib/hangul'
import * as Wordle from '@/lib/wordle'

export const [MIN_AUTHOR_LEN, MAX_AUTHOR_LEN] = [0, 10]
export const [MIN_N_WORDLES, MAX_N_WORDLES] = [1, 10]
export const [MIN_WORD_LIST_ANSWER_LEN, MAX_WORD_LIST_ANSWER_LEN] = [
  Math.min(...getSupportedLengths()),
  Math.max(...getSupportedLengths()),
]
export const [MIN_N_GUESSES, MAX_N_GUESSES] = [1, 50]

function validate(
  author: string,
  nWordles: number,
  answerLength: number,
  nGuesses: number,
  useWordList: boolean,
  answers: readonly Hangul.Word[]
): boolean {
  const assertInteger = (n: number, min: number, max: number) => {
    return Number.isInteger(n) && min <= n && n <= max
  }

  const assertAnswerLength = (answerLength: number, useWordList: boolean) => {
    if (useWordList) {
      return assertInteger(
        answerLength,
        MIN_WORD_LIST_ANSWER_LEN,
        MAX_WORD_LIST_ANSWER_LEN
      )
    }
    return true
  }

  const assertAnswersInWordList = (
    answers: readonly Hangul.Word[],
    useWordList: boolean
  ) => {
    if (useWordList) {
      return answers.every((answer) => Wordle.isInWordList(answer.value))
    }
    return true
  }

  return (
    MIN_AUTHOR_LEN <= author.length &&
    author.length <= MAX_AUTHOR_LEN &&
    assertInteger(nWordles, MIN_N_WORDLES, MAX_N_WORDLES) &&
    assertAnswerLength(answerLength, useWordList) &&
    assertInteger(nGuesses, MIN_N_GUESSES, MAX_N_GUESSES) &&
    nWordles <= nGuesses &&
    answers.length === nWordles &&
    answers.every((ans) => ans.length === answerLength) &&
    assertAnswersInWordList(answers, useWordList)
  )
}

interface Token<T> {
  value: T
  encoder: Encoder<T>
}

export function generateCode(
  author: string,
  nWordles: number,
  answerLength: number,
  nGuesses: number,
  useWordList: boolean,
  answers: readonly Hangul.Word[]
): string | undefined {
  if (
    !validate(author, nWordles, answerLength, nGuesses, useWordList, answers)
  ) {
    return undefined
  }

  const authorToken: Token<string> = {
    value: author,
    encoder: unicodeStringEncoder,
  }
  const nWordlesToken: Token<number> = {
    value: nWordles,
    encoder: nonNegativeIntegerEncoder,
  }
  const nGuessesToken: Token<number> = {
    value: nGuesses,
    encoder: nonNegativeIntegerEncoder,
  }
  const useWordListToken: Token<boolean> = {
    value: useWordList,
    encoder: booleanEncoder,
  }
  const answerSyllableTokens: Token<Hangul.DubeolsikSyllable[]> = {
    value: answers.flatMap((answer) => answer.syllables),
    encoder: syllablesEncoder,
  }

  try {
    return [
      authorToken,
      nWordlesToken,
      nGuessesToken,
      useWordListToken,
      answerSyllableTokens,
    ]
      .map((token: Token<unknown>) => token.encoder.encode(token.value))
      .join('')
  } catch {
    return undefined
  }
}

interface CodeParseResult {
  readonly config: GameConfig
  readonly answers: readonly Hangul.Word[]
}

export function parseCode(code: string): CodeParseResult | undefined {
  let unconsumedCode = code

  const author: Token<string> = {
    value: '',
    encoder: unicodeStringEncoder,
  }
  const nWordles: Token<number> = {
    value: NaN,
    encoder: nonNegativeIntegerEncoder,
  }
  const nGuesses: Token<number> = {
    value: NaN,
    encoder: nonNegativeIntegerEncoder,
  }
  const useWordList: Token<boolean> = {
    value: true,
    encoder: booleanEncoder,
  }
  const answerSyllables: Token<Hangul.DubeolsikSyllable[]> = {
    value: [],
    encoder: syllablesEncoder,
  }
  const tokens = [author, nWordles, nGuesses, useWordList, answerSyllables]

  try {
    tokens.forEach((token) => {
      const decoded = token.encoder.decode(unconsumedCode)
      token.value = decoded.value
      unconsumedCode = decoded.unconsumedCode
    })
  } catch {
    return undefined
  }

  const answerLength = Math.floor(answerSyllables.value.length / nWordles.value)
  const answers = []
  for (let i = 0; i < nWordles.value; i++) {
    const answer = answerSyllables.value
      .slice(i * answerLength, (i + 1) * answerLength)
      .map((syllable) => syllable.value)
      .join('')
    answers.push(Hangul.toWord(answer))
  }

  const config = GameConfig.getCustomGameConfig(
    code,
    author.value,
    nWordles.value,
    answerLength,
    nGuesses.value,
    useWordList.value
  )

  return validate(
    config.author,
    config.nWordles,
    config.answerLength,
    config.nGuesses,
    config.useWordList,
    answers
  )
    ? { config, answers }
    : undefined
}

const URL_LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

interface Encoder<T> {
  encode(value: T, ...options: unknown[]): string
  decode(code: string, ...options: unknown[]): DecodeResult<T>
}

interface DecodeResult<T> {
  value: T
  unconsumedCode: string
}

const nonNegativeIntegerEncoder: Encoder<number> = {
  encode(n: number, singleLetter = false): string {
    assert(Number.isInteger(n) && n >= 0, 'invalid number')
    if (singleLetter) {
      assert(n < URL_LETTERS.length, 'number out of range')
    }

    const radix = URL_LETTERS.length
    let str = ''
    do {
      str = URL_LETTERS[n % radix] + str
      n = Math.floor(n / radix)
    } while (n > 0)

    if (singleLetter) {
      return str
    } else {
      return URL_LETTERS[str.length] + str
    }
  },
  decode(code: string, singleLetter = false): DecodeResult<number> {
    const length = singleLetter ? 1 : URL_LETTERS.indexOf(code[0]) + 1
    assert(0 < length && length <= code.length, 'invalid code')

    const start = singleLetter ? 0 : 1
    const value = Array.from(code.slice(start, length))
      .map((ch) => URL_LETTERS.indexOf(ch))
      .reduce((prev, curr) => prev * URL_LETTERS.length + curr)
    return { value, unconsumedCode: code.slice(length) }
  },
}

const booleanEncoder: Encoder<boolean> = {
  encode(value: boolean): string {
    return nonNegativeIntegerEncoder.encode(Number(value))
  },
  decode(str: string): DecodeResult<boolean> {
    const result = nonNegativeIntegerEncoder.decode(str)
    return {
      value: Boolean(result.value),
      unconsumedCode: result.unconsumedCode,
    }
  },
}

const unicodeStringEncoder: Encoder<string> = {
  encode(str: string): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const codePoints = Array.from(str).map((ch) => ch.codePointAt(0)!)

    const lengthCode = nonNegativeIntegerEncoder.encode(codePoints.length, true)
    const codePointsCode = codePoints
      .map((codePoint) => nonNegativeIntegerEncoder.encode(codePoint))
      .join('')
    return lengthCode + codePointsCode
  },
  decode(code: string): DecodeResult<string> {
    const nCodePoints = URL_LETTERS.indexOf(code[0])
    assert(nCodePoints >= 0, 'invalid code')
    code = code.slice(1)

    let result = ''
    for (let i = 0; i < nCodePoints; i++) {
      const decoded = nonNegativeIntegerEncoder.decode(code)
      result += String.fromCodePoint(decoded.value)
      code = decoded.unconsumedCode
    }
    return {
      value: result,
      unconsumedCode: code,
    }
  },
}

const syllablesEncoder: Encoder<Hangul.DubeolsikSyllable[]> = {
  encode(syllables: readonly Hangul.DubeolsikSyllable[]): string {
    const shiftedCodePoints = syllables
      .map(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (syllable) => syllable.value.codePointAt(0)!
      )
      .map((codePoint) => codePoint - Hangul.FIRST_SYLLABLE_CODEPOINT)
    return unicodeStringEncoder.encode(
      String.fromCodePoint(...shiftedCodePoints)
    )
  },
  decode(str: string): DecodeResult<Hangul.DubeolsikSyllable[]> {
    const decoded = unicodeStringEncoder.decode(str)
    const syllables = Array.from(decoded.value)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((ch) => ch.codePointAt(0)!)
      .map(
        (shiftedCodePoint) => shiftedCodePoint + Hangul.FIRST_SYLLABLE_CODEPOINT
      )
      .map((codePoint) => String.fromCodePoint(codePoint))
      .flatMap((syllable) => Hangul.toWord(syllable).syllables)
    return {
      value: syllables,
      unconsumedCode: decoded.unconsumedCode,
    }
  },
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}
