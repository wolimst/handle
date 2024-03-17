import Bowser from 'bowser'

export function isDesktop(): boolean {
  const browser = Bowser.getParser(window.navigator.userAgent)
  return browser.getPlatformType(true) === 'desktop'
}

export function isMobileChromeOrSafari(): boolean {
  const browser = Bowser.getParser(window.navigator.userAgent)
  const browserName = browser.getBrowserName()
  const names = ['Chrome', 'Chromium', 'Safari']
  return !isDesktop() && names.some((name) => name === browserName)
}
