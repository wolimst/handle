import type { GuessResult, Status, SyllableResult } from './types'
import { getRandomAnswer, getWordList } from './words'
import type * as Hangul from '@/lib/hangul'

export class Wordle {
  readonly #nGuesses: number
  readonly #answer: Hangul.Word
  #status: Status
  readonly #guessResults: GuessResult[]

  /**
   * Initialize a Hangul wordle game
   *
   * @param nGuesses number of guesses that the player has. It should be a positive integer.
   * @param answerLength number of syllables in the answer
   * @param answerSeed a random seed to randomize answer
   * @throws an error if failed to find an answer with the given answerLength
   * @see {@link getRandomAnswer}
   */
  constructor(nGuesses: number, answerLength: number, answerSeed: string) {
    this.#nGuesses = nGuesses
    this.#answer = getRandomAnswer(answerLength, answerSeed)
    this.#status = 'playing'
    this.#guessResults = []
  }

  get nGuesses(): number {
    return this.#nGuesses
  }

  get answerLength(): number {
    return this.#answer.length
  }

  get status(): Status {
    return this.#status
  }

  get guessResults(): readonly GuessResult[] {
    return structuredClone(this.#guessResults)
  }

  /**
   * Compare the guess against the answer, update the game status if necessary,
   * and return the comparison result.
   *
   * `GuessResult.result` will be undefined, if the guess is not valid,
   * e.g. the guess word length is not equal to the answer word length
   * or the guess word is not in word list
   *
   * Game object's state won't be changed, if `Game.status` is not 'playing'
   *
   * @param guess
   */
  submitGuess(guess: Hangul.Word): GuessResult {
    if (
      this.#status !== 'playing' ||
      guess.length !== this.#answer.length ||
      // TODO: improve word list check performance if it affects UX.
      //       The performance can be improved using hash set or bisect.
      //       If bisect is chosen, add word list test that checks whether
      //       the word list is sorted.
      getWordList(guess.length).every((word) => word.value !== guess.value)
    ) {
      return {
        guess,
        result: undefined,
      }
    }

    const guessResult = doGuess(guess, this.#answer)
    this.#guessResults.push(guessResult)

    if (guess.value === this.#answer.value) {
      this.#status = 'win'
    } else if (this.#guessResults.length >= this.#nGuesses) {
      this.#status = 'lose'
    }

    return guessResult
  }
}

function doGuess(guess: Hangul.Word, answer: Hangul.Word): GuessResult {
  // Initialize all results as 'absent'
  const guessResult = guess.syllables.map((syllable) => {
    return {
      exact: false,
      leadingConsonant: 'absent',
      vowels: syllable.vowels.map(() => 'absent'),
      trailingConsonants: syllable.trailingConsonants.map(() => 'absent'),
    }
  })

  const answerJamoCount: { [key in Hangul.Jamo]?: number } = {}
  for (const syllable of answer.syllables) {
    const jamoList = [
      syllable.leadingConsonant,
      ...syllable.vowels,
      ...syllable.trailingConsonants,
    ]
    jamoList.forEach((jamo) => {
      answerJamoCount[jamo] = (answerJamoCount[jamo] || 0) + 1
    })
  }

  const decreaseJamoCount = (key: Hangul.Jamo) => {
    const count = answerJamoCount[key]
    if (count) {
      answerJamoCount[key] = count - 1
    }
  }

  // Look for exact matches
  for (let i = 0; i < guess.syllables.length; i++) {
    const guessSyllable = guess.syllables[i]
    const answerSyllable = answer.syllables[i]
    const result = guessResult[i]

    if (guessSyllable.value === answerSyllable.value) {
      result.exact = true
    }

    if (guessSyllable.leadingConsonant === answerSyllable.leadingConsonant) {
      decreaseJamoCount(guessSyllable.leadingConsonant)
      result.leadingConsonant = 'correct'
    }

    for (let j = 0; j < guessSyllable.vowels.length; j++) {
      const guessVowel = guessSyllable.vowels[j]
      if (answerSyllable.vowels.includes(guessVowel)) {
        decreaseJamoCount(guessVowel)
        result.vowels[j] = 'correct'
      }
    }

    for (let j = 0; j < guessSyllable.trailingConsonants.length; j++) {
      const guessTrailingConsonant = guessSyllable.trailingConsonants[j]
      if (answerSyllable.trailingConsonants.includes(guessTrailingConsonant)) {
        decreaseJamoCount(guessTrailingConsonant)
        result.trailingConsonants[j] = 'correct'
      }
    }
  }

  // Look for non-exact (wrong position) matches
  for (let i = 0; i < guess.syllables.length; i++) {
    const guessSyllable = guess.syllables[i]
    const result = guessResult[i]

    if (
      result.leadingConsonant != 'correct' &&
      answerJamoCount[guessSyllable.leadingConsonant]
    ) {
      decreaseJamoCount(guessSyllable.leadingConsonant)
      result.leadingConsonant = 'present'
    }

    for (let j = 0; j < guessSyllable.vowels.length; j++) {
      const guessVowel = guessSyllable.vowels[j]
      if (result.vowels[j] != 'correct' && answerJamoCount[guessVowel]) {
        decreaseJamoCount(guessVowel)
        result.vowels[j] = 'present'
      }
    }

    for (let j = 0; j < guessSyllable.trailingConsonants.length; j++) {
      const guessTrailingConsonant = guessSyllable.trailingConsonants[j]
      if (
        result.trailingConsonants[j] != 'correct' &&
        answerJamoCount[guessTrailingConsonant]
      ) {
        decreaseJamoCount(guessTrailingConsonant)
        result.trailingConsonants[j] = 'present'
      }
    }
  }

  return {
    guess,
    result: guessResult as readonly SyllableResult[],
  }
}
