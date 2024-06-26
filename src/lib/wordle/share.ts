import type { GameData } from './types'
import { GAME_MODES, WORDLE_NAMES } from '@/constants'
import { getCurrentAbsoluteUrl } from '@/routes/page'
import { savedata } from '@/stores/wordle'

export function getGameDescription(gameData: GameData): string {
  const wordleName = WORDLE_NAMES.at(gameData.config.nWordles)
  const gameTypeString = wordleName || `워들×${gameData.config.nWordles}`

  let result: string
  if (gameData.config.mode === 'daily') {
    const dateString = gameData.config.id.split('-').at(-1)!.split('.')
    const month = dateString[1].replace(/^0/, '')
    const day = dateString[2].replace(/^0/, '')
    result = `${gameTypeString} ${month}월${day}일`
    const index = savedata
      .loadByConfigId(gameData.config.id)
      .findIndex((data) => data.id === gameData.id)
    if (index >= 1) {
      result += `+${index}`
    }
  } else if (gameData.config.mode === 'custom') {
    result = `${gameData.config.author || '익명'}님의 문제${gameData.config.useWordList ? '' : '(사전 미사용)'}`
  } else {
    const mode = GAME_MODES.find((mode) => mode.id === gameData.config.mode)!
    result = `${gameTypeString} ${mode.name.replace(/\s+/, '')}`
  }
  return result
}

export function getGameShareString(gameData: GameData): string {
  const description = getGameDescription(gameData)
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
