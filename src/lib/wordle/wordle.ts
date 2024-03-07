import type {
  GuessResult,
  JamoResult,
  KeyHints,
  Status,
  SyllableResult,
  WordleData,
} from './types'
import * as Hangul from '@/lib/hangul'

export class _Wordle {
  readonly #nGuesses: number
  readonly #answer: Hangul.Word
  #status: Status
  readonly #guessResults: GuessResult[]
  readonly #keyHints: KeyHints

  /**
   * Initialize a Hangul wordle game
   *
   * @param nGuesses number of guesses that the player has. It should be a positive integer.
   * @param answer answer of the wordle
   * @throws an error if the answer is not in the word list
   */
  constructor(nGuesses: number, answer: Hangul.Word) {
    this.#answer = answer
    this.#nGuesses = nGuesses
    this.#status = 'playing'
    this.#guessResults = []
    this.#keyHints = {}
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

  /**
   * Return the answer if the game is finished, otherwise undefined
   */
  get answer(): string | undefined {
    if (this.#status === 'playing') {
      return undefined
    }
    return this.#answer.value
  }

  get guessResults(): readonly GuessResult[] {
    return structuredClone(this.#guessResults)
  }

  get keyHints(): KeyHints {
    return structuredClone(this.#keyHints)
  }

  get data(): WordleData {
    return {
      guessResults: this.guessResults,
      keyHints: this.keyHints,
      status: this.status,
    }
  }

  /**
   * Compare the guess against the answer, update the game states accordingly,
   * and return the comparison result.
   *
   * @throws if the status is not 'playing'
   * @throws if the word length of the guess is not equal to that of the answer
   */
  submitGuess(guess: Hangul.Word): GuessResult {
    if (this.status !== 'playing') {
      throw new Error('invalid wordle status')
    } else if (guess.length !== this.#answer.length) {
      throw new Error('wrong guess length')
    }

    const guessResult = doGuess(guess, this.#answer)
    this.#guessResults.push(guessResult)

    // Update key hints if the new JamoResult is superior
    for (let i = 0; i < guessResult.guess.length; i++) {
      const syllable = guessResult.guess.syllables[i]
      const jamo = [
        syllable.leadingConsonant,
        ...syllable.vowels,
        ...syllable.trailingConsonants,
      ]
      const results = [
        guessResult.result[i].leadingConsonant,
        ...guessResult.result[i].vowels,
        ...guessResult.result[i].trailingConsonants,
      ]

      for (let j = 0; j < jamo.length; j++) {
        if (compareJamoResult(this.#keyHints[jamo[j]], results[j]) > 0) {
          this.#keyHints[jamo[j]] = results[j]
        }
      }
    }

    if (guess.value === this.#answer.value) {
      this.#status = 'win'
    } else if (this.#guessResults.length >= this.#nGuesses) {
      this.#status = 'lose'
    }

    return structuredClone(guessResult)
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

  const answerJamoCount: { [key in Hangul.DubeolsikJamo]?: number } = {}
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

  const decreaseJamoCount = (key: Hangul.DubeolsikJamo) => {
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

const jamoResultOrder: readonly (JamoResult | undefined)[] = [
  undefined,
  'absent',
  'present',
  'correct',
] as const

function compareJamoResult(r1?: JamoResult, r2?: JamoResult): number {
  return jamoResultOrder.indexOf(r2) - jamoResultOrder.indexOf(r1)
}
