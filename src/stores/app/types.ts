export interface Data {
  config: Config
}

export interface Config {
  showHelpOnLaunch: boolean
  userId: string
  userName: string
  submitResult: boolean
  darkTheme: boolean
  switchEnterAndBackspacePosition: boolean
  isBeingUpdated: boolean
  useShorterBox: boolean
}

export interface Notification {
  type?: 'error' | 'success' | 'wordle-win' | 'wordle-bonus-win' | 'wordle-loss'
  message: string
}
