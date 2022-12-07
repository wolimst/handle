export interface Data {
  config: Config
}

export interface Config {
  showHelpOnLaunch: boolean
  darkTheme: boolean
  showInputForm: boolean
  switchEnterAndBackspacePosition: boolean
}

export interface Notification {
  type?: 'error' | 'success' | 'wordle-win' | 'wordle-loss'
  message: string
}
