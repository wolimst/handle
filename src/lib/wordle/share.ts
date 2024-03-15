import type { GameConfig } from './game'
import { GAME_MODES, WORDLE_NAMES } from '@/constants'

export function getGameDescription(config: GameConfig): string {
  const mode = GAME_MODES.find((mode) => mode.id === config.mode)!

  const gameModeString =
    config.mode === 'custom' ? `${config.author || '익명'}님의 문제` : mode.name

  const wordleName = WORDLE_NAMES.at(config.nWordles)
  const gameTypeString = wordleName
    ? `${wordleName} (${config.answerLength}글자)`
    : `${config.nWordles}워들 ${config.answerLength}글자`

  return `${gameModeString} - ${gameTypeString}`
}
