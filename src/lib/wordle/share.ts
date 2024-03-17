import type { GameConfig } from './game'
import type { GameData } from './types'
import { GAME_MODES, WORDLE_NAMES } from '@/constants'
import { getCurrentAbsoluteUrl } from '@/routes/page'

export function getGameDescription(config: GameConfig): string {
  const wordleName = WORDLE_NAMES.at(config.nWordles)
  const gameTypeString = wordleName || `워들×${config.nWordles}`

  let result: string
  if (config.mode === 'daily') {
    const dateString = config.id.split('-').at(-1)!.split('.')
    const month = dateString[1].replace(/^0/, '')
    const day = dateString[2].replace(/^0/, '')
    result = `${gameTypeString} ${month}월${day}일`
  } else if (config.mode === 'custom') {
    result = `${config.author || '익명'}님의 ${gameTypeString}`
  } else {
    const mode = GAME_MODES.find((mode) => mode.id === config.mode)!
    result = `${gameTypeString} ${mode.name.replace(/\s+/, '')}`
  }
  return result
}

export function getGameShareString(gameData: GameData): string {
  const description = getGameDescription(gameData.config)
  const guess = `${gameData.status === 'win' ? gameData.guesses.length : 'X'}/${gameData.config.nGuesses}`
  const result = getGameResultInEmoji(gameData)
  const url = getCurrentAbsoluteUrl().href.replace(/^(http(s?):\/\/)/, '')
  return `${description} ${guess}\n${url}\n${result}`
}

function getGameResultInEmoji(gameData: GameData): string {
  const lines = []

  for (let n = 0; n < gameData.config.nGuesses; n++) {
    const nthGuessResults = gameData.wordleData.map((data) =>
      data.guessResults.at(n)
    )
    if (nthGuessResults.every((guessResult) => guessResult === undefined)) {
      break
    }

    const guessResultsInEmoji = nthGuessResults.map((guessResult) => {
      if (!guessResult) {
        return '⬛'.repeat(gameData.config.answerLength)
      }
      const syllableResultsInEmoji = guessResult.result.map(
        (syllableResult) => {
          if (syllableResult.exact) {
            return '✅'
          }
          const jamoResults = [
            syllableResult.leadingConsonant,
            ...syllableResult.vowels,
            ...syllableResult.trailingConsonants,
          ]
          if (jamoResults.some((jamoResult) => jamoResult === 'correct')) {
            return '🟩'
          } else if (
            jamoResults.some((jamoResult) => jamoResult === 'present')
          ) {
            return '🟨'
          } else {
            return '⬜'
          }
        }
      )
      return syllableResultsInEmoji.join('')
    })
    lines.push(guessResultsInEmoji.join(' '))
  }
  return lines.join('\n')
}
