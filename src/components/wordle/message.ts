import { FONT } from '@/lib/path'
import type { GuessError } from '@/lib/wordle'

export function getAlertMessage(guessError: GuessError): string {
  switch (guessError) {
    case 'invalidStatus':
      return '게임이 이미 끝났어요.'
    case 'wrongLength':
      return '글자 수가 부족해요.'
    case 'notInWordList':
      return '앗, 단어 리스트에 단어가 없어요.'
    case 'undrawableSyllable':
      return `앗, 사용할 수 없는 글자가 포함되어 있어요. (${FONT.undrawableSyllables})`
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = guessError
      return _exhaustiveCheck
  }
}
