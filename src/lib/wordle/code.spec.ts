/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  generateCode,
  MAX_WORD_LIST_ANSWER_LEN,
  MAX_AUTHOR_LEN,
  MAX_N_GUESSES,
  MAX_N_WORDLES,
  MIN_WORD_LIST_ANSWER_LEN,
  MIN_N_GUESSES,
  MIN_N_WORDLES,
  parseCode,
} from './code'
import { getRandomAnswer } from './words'
import * as Hangul from '@/lib/hangul'

// TODO: make code length shorter
const MAX_CODE_LENGTH = 300

describe('generate code and parse code for valid config', () => {
  test('lower boundary', () => {
    const config = {
      author: '',
      nWordles: MIN_N_WORDLES,
      answerLength: MIN_WORD_LIST_ANSWER_LEN,
      nGuesses: MIN_N_GUESSES,
      useSave: true,
      useWordList: true,
    } as const
    const answers = Array(config.nWordles).fill(
      getRandomAnswer(config.answerLength, 'seed')
    ) as Hangul.Word[]
    const guesses: Hangul.Word[] = []
    const code = generateCode(
      config.author,
      config.nWordles,
      config.answerLength,
      config.nGuesses,
      config.useSave,
      config.useWordList,
      answers,
      guesses
    )
    expect(code).not.toBeUndefined()
    expect(code!.length).toBeLessThanOrEqual(MAX_CODE_LENGTH)
    const parsed = parseCode(code!)
    expect(parsed).not.toBeUndefined()
    expect(parsed!.config).toMatchObject(config)
    expect(parsed!.config.id).toStrictEqual(code)
    expect(parsed!.config.mode).toStrictEqual('custom')
    expect(parsed!.answers).toStrictEqual(answers)
  })

  test('in boundary', () => {
    const config = {
      author: '출제자',
      nWordles: 2,
      answerLength: 2,
      nGuesses: 8,
      useSave: false,
      useWordList: true,
    } as const
    const answers = Array(config.nWordles).fill(
      getRandomAnswer(config.answerLength, 'seed')
    ) as Hangul.Word[]
    const guesses = [Hangul.toWord('한들')]
    const code = generateCode(
      config.author,
      config.nWordles,
      config.answerLength,
      config.nGuesses,
      config.useSave,
      config.useWordList,
      answers,
      guesses
    )
    expect(code).not.toBeUndefined()
    expect(code!.length).toBeLessThanOrEqual(MAX_CODE_LENGTH)
    const parsed = parseCode(code!)
    expect(parsed).not.toBeUndefined()
    expect(parsed!.config).toMatchObject(config)
    expect(parsed!.config.id).toStrictEqual(code)
    expect(parsed!.config.mode).toStrictEqual('custom')
    expect(parsed!.answers).toStrictEqual(answers)
  })

  test('upper boundary', () => {
    const config = {
      author: 'A한あ漢😊',
      nWordles: MAX_N_WORDLES,
      answerLength: MAX_WORD_LIST_ANSWER_LEN,
      nGuesses: MAX_N_GUESSES,
      useSave: false,
      useWordList: true,
    } as const
    const answers = Array(config.nWordles).fill(
      getRandomAnswer(config.answerLength, 'seed')
    ) as Hangul.Word[]
    const guesses = [Hangul.toWord('하늘'), Hangul.toWord('우주'), ...answers]
    const code = generateCode(
      config.author,
      config.nWordles,
      config.answerLength,
      config.nGuesses,
      config.useSave,
      config.useWordList,
      answers,
      guesses
    )
    expect(code).not.toBeUndefined()
    expect(code!.length).toBeLessThanOrEqual(MAX_CODE_LENGTH)
    const parsed = parseCode(code!)
    expect(parsed).not.toBeUndefined()
    expect(parsed!.config).toMatchObject(config)
    expect(parsed!.config.id).toStrictEqual(code)
    expect(parsed!.config.mode).toStrictEqual('custom')
    expect(parsed!.answers).toStrictEqual(answers)
  })

  test('answerLength check should be lifted when not using word list', () => {
    const values = [MIN_WORD_LIST_ANSWER_LEN - 1, MAX_WORD_LIST_ANSWER_LEN + 1]
    values.forEach((answerLength) => {
      const config = {
        author: 'author',
        nWordles: MIN_N_WORDLES,
        answerLength: answerLength,
        nGuesses: MIN_N_GUESSES,
        useSave: true,
        useWordList: false,
      }
      const answers = Array(config.nWordles)
        .fill(Array(answerLength).fill('가').join(''))
        .map(Hangul.toWord)
      const guesses: Hangul.Word[] = []
      const code = generateCode(
        config.author,
        config.nWordles,
        config.answerLength,
        config.nGuesses,
        config.useSave,
        config.useWordList,
        answers,
        guesses
      )
      expect(code).not.toBeUndefined()
      expect(code!.length).toBeLessThanOrEqual(MAX_CODE_LENGTH)
      const parsed = parseCode(code!)
      expect(parsed).not.toBeUndefined()
      expect(parsed!.config).toMatchObject(config)
      expect(parsed!.config.id).toStrictEqual(code)
      expect(parsed!.config.mode).toStrictEqual('custom')
      expect(parsed!.answers).toStrictEqual(answers)
    })
  })
})

describe('generate code for invalid config', () => {
  test('author too long', () => {
    const config = {
      author: Array(MAX_AUTHOR_LEN + 1)
        .fill('0')
        .join(''),
      nWordles: MIN_N_WORDLES,
      answerLength: MIN_WORD_LIST_ANSWER_LEN,
      nGuesses: MIN_N_GUESSES,
      useSave: false,
      useWordList: true,
    }
    const answers = Array(config.nWordles).fill(
      getRandomAnswer(config.answerLength, 'seed')
    ) as Hangul.Word[]
    const guesses: Hangul.Word[] = []
    const code = generateCode(
      config.author,
      config.nWordles,
      config.answerLength,
      config.nGuesses,
      config.useSave,
      config.useWordList,
      answers,
      guesses
    )
    expect(code).toBeUndefined()
  })

  test('nWordles out of range', () => {
    const values = [MIN_N_WORDLES - 1, MAX_N_WORDLES + 1]
    values.forEach((nWordles) => {
      const config = {
        author: 'author',
        nWordles: nWordles,
        answerLength: MIN_WORD_LIST_ANSWER_LEN,
        nGuesses: MIN_N_GUESSES,
        useSave: true,
        useWordList: true,
      }
      const answers = Array(config.nWordles).fill(
        getRandomAnswer(config.answerLength, 'seed')
      ) as Hangul.Word[]
      const guesses: Hangul.Word[] = []
      const code = generateCode(
        config.author,
        config.nWordles,
        config.answerLength,
        config.nGuesses,
        config.useSave,
        config.useWordList,
        answers,
        guesses
      )
      expect(code).toBeUndefined()
    })
  })

  test('answerLength out of range', () => {
    const values = [MIN_WORD_LIST_ANSWER_LEN - 1, MAX_WORD_LIST_ANSWER_LEN + 1]
    values.forEach((answerLength) => {
      const config = {
        author: 'author',
        nWordles: MIN_N_WORDLES,
        answerLength: answerLength,
        nGuesses: MIN_N_GUESSES,
        useSave: true,
        useWordList: true,
      }
      const answers = Array(config.nWordles)
        .fill(Array(answerLength).fill('가').join(''))
        .map(Hangul.toWord)
      const guesses: Hangul.Word[] = []
      const code = generateCode(
        config.author,
        config.nWordles,
        config.answerLength,
        config.nGuesses,
        config.useSave,
        config.useWordList,
        answers,
        guesses
      )
      expect(code).toBeUndefined()
    })
  })

  test('nGuesses out of range', () => {
    const values = [MIN_N_GUESSES - 1, MAX_N_GUESSES + 1]
    values.forEach((nGuesses) => {
      const config = {
        author: 'author',
        nWordles: MIN_N_WORDLES,
        answerLength: MIN_WORD_LIST_ANSWER_LEN,
        nGuesses: nGuesses,
        useSave: true,
        useWordList: true,
      }
      const answers = Array(config.nWordles).fill(
        getRandomAnswer(config.answerLength, 'seed')
      ) as Hangul.Word[]
      const guesses: Hangul.Word[] = []
      const code = generateCode(
        config.author,
        config.nWordles,
        config.answerLength,
        config.nGuesses,
        config.useSave,
        config.useWordList,
        answers,
        guesses
      )
      expect(code).toBeUndefined()
    })
  })

  test('number of answers out of range', () => {
    const values = [MIN_N_WORDLES - 1, MIN_N_WORDLES + 1]
    values.forEach((nAnswers) => {
      const config = {
        author: 'author',
        nWordles: MIN_N_WORDLES,
        answerLength: MIN_WORD_LIST_ANSWER_LEN,
        nGuesses: MIN_N_GUESSES,
        useSave: true,
        useWordList: true,
      }
      const answers = Array(nAnswers).fill(
        getRandomAnswer(config.answerLength, 'seed')
      ) as Hangul.Word[]
      const guesses: Hangul.Word[] = []
      const code = generateCode(
        config.author,
        config.nWordles,
        config.answerLength,
        config.nGuesses,
        config.useSave,
        config.useWordList,
        answers,
        guesses
      )
      expect(code).toBeUndefined()
    })
  })

  test('answer length out of range', () => {
    const values = [MIN_WORD_LIST_ANSWER_LEN - 1, MIN_WORD_LIST_ANSWER_LEN + 1]
    values.forEach((answerLength) => {
      const config = {
        author: 'author',
        nWordles: MIN_N_WORDLES,
        answerLength: MIN_WORD_LIST_ANSWER_LEN,
        nGuesses: MIN_N_GUESSES,
        useSave: true,
        useWordList: true,
      }
      const answers = Array(config.nWordles)
        .fill(Array(answerLength).fill('가').join(''))
        .map(Hangul.toWord)
      const guesses: Hangul.Word[] = []
      const code = generateCode(
        config.author,
        config.nWordles,
        config.answerLength,
        config.nGuesses,
        config.useSave,
        config.useWordList,
        answers,
        guesses
      )
      expect(code).toBeUndefined()
    })
  })
})

test('parse invalid code', () => {
  expect(parseCode('')).toBeUndefined()
  expect(parseCode('0')).toBeUndefined()
  expect(parseCode('a')).toBeUndefined()
  expect(parseCode('a0')).toBeUndefined()
  expect(parseCode('abbbbcdcxGcK')).toBeUndefined()
  expect(parseCode('abbcZZcdcxGcKp')).toBeUndefined()
})
