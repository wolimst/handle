import { FONT } from '@/lib/path'
import type { GuessError, KeyboardError } from '@/lib/wordle'

export function getWinMessage(): string {
  return '정답! 대단해요!'
}

export function getLossMessage(answers: readonly string[]): string {
  return `아쉬워요. 정답은 [${answers.join(', ')}] 이에요.`
}

export function getGuessErrorMessage(error: GuessError): string {
  switch (error) {
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
      const _exhaustiveCheck: never = error
      return _exhaustiveCheck
  }
}

export function getKeyboardErrorMessage(error: KeyboardError): string {
  switch (error) {
    case 'lengthExceeded':
      return '글자가 꽉 찼어요.'
    case 'nonHangul':
      return '한글을 입력해 주세요.'
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = error
      return _exhaustiveCheck
  }
}
