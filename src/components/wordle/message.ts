import { FONT } from '@/lib/path'
import type { GuessError, KeyboardError } from '@/lib/wordle'

const dailyBonusWinMessages = [
  '우와, 놀랍네요! 정말 대단해요!!',
  '와우, 믿기지 않네요! 굉장해요!!',
  '와, 정말 놀랍고 훌륭해요!!',
  '우와, 감탄했어요! 진짜 최고에요!',
  '우와, 정답! 엄청난 감각이네요!!',
  '이렇게 잘 맞추다니! 기가 막혀요!',
  '정말 대단해요! 박사님이라고 불러도 될까요?',
  '한들 마스터! 정말 눈부셔요!',
  '이런, 여기 한들 고수가 있었군요!',
  '멋져요! 한들 마스터로 임명합니다!',
  '눈부셔요! 어쩜 이렇게 잘 맞추죠?',
  '어쩜 이렇게 잘 맞추죠? 초능력자인가요?',
]

const winMessages = [
  '정답! 대단해요!',
  '정답! 굉장해요!',
  '정답! 잘했어요!',
  '정답! 멋져요!',
  '정답! 훌륭해요!',
  '정답! 감탄했어요!',
  '맞췄어요! 대단해요!',
  '정확해요! 굉장해요!',
  '대단해요! 정답이에요!',
  '굉장해요! 바로 그거에요!',
  '바로 그거에요! 훌륭해요!',
  '바로 그거에요! 정말 남달라요!',
]

export function getDailyBonusWinMessage(): string {
  return dailyBonusWinMessages[
    Math.floor(Math.random() * dailyBonusWinMessages.length)
  ]
}

export function getWinMessage(): string {
  return winMessages[Math.floor(Math.random() * winMessages.length)]
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
