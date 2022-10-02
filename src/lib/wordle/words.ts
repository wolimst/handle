import _answers from './words/answers.json'
import _words from './words/words.json'
import * as Hangul from '@/lib/hangul'
import { random } from '@/lib/utils'

type Words = {
  readonly [key: string]: readonly string[]
}

const words: Words = _words
const answers: Words = _answers

/**
 * Retrieve list of words that can be used as guesses in the wordle game
 *
 * @param length number of syllables in each word
 * @throws an error if there is no word whose length is equal to the given length
 */
export function getWordList(length: number): readonly string[] {
  const wordList = words[length]
  if (wordList) {
    return wordList
  }
  throw new Error(`failed to retrieve word lists for word length ${length}`)
}

/**
 * Retrieve list of answers
 *
 * @param length number of syllables in each answer
 * @throws an error if there is no answer whose length is equal to the given length
 */
export function getAnswerList(length: number): readonly string[] {
  const answerList = answers[length]
  if (answerList) {
    return answerList
  }
  throw new Error(`failed to retrieve answer lists for word length ${length}`)
}

/**
 * Retrieve a random Hangul.Word from the answer list
 *
 * @param length number of syllables in the answer
 * @param seed a random seed
 * @throws an error if there is no answer whose length is equal to the given length
 */
export function getRandomAnswer(length: number, seed: string): Hangul.Word {
  const answerList = getAnswerList(length)
  const n = random.randint(0, answerList.length, seed)
  return Hangul.toWord(answerList[n])
}

export function isInWordList(str: string): boolean {
  // TODO: improve word list check performance if it affects UX.
  //       The performance can be improved using hash set or bisect.
  //       If bisect is chosen, add word list test that checks whether
  //       the word list is sorted.
  return getWordList(Hangul.getCodePointLength(str)).some(
    (word) => word === str
  )
}
