import type { DProperty, DrawableString, DrawableSyllable, Font } from './types'
import type * as Hangul from '@/lib/hangul'
import * as opentype from 'opentype.js'

export const FONT: Font = {
  // Binggrae font is chosen because Jamo in most glyphs are not connected
  // with each other
  name: 'Binggrae',
  urls: [
    // TODO: Add default CDN
    'resources/fonts/Binggrae.otf',
    'https://fonts.cdnfonts.com/s/18622/Binggrae.woff',
  ],
  fontSize: 72,
  vboxSize: 86,
  undrawableSyllables: '쓚졀졁졂졃졄졅졆졇졏졑졓',
  jamoClosedPathCount: {
    ㄱ: 1,
    ㄲ: 2,
    ㄴ: 1,
    ㄷ: 1,
    ㄸ: 1,
    ㄹ: 1,
    ㅁ: 2,
    ㅂ: 2,
    ㅃ: 4,
    ㅅ: 1,
    ㅆ: 1,
    ㅇ: 2,
    ㅈ: 1,
    ㅉ: 1,
    ㅊ: 1,
    ㅋ: 1,
    ㅌ: 1,
    ㅍ: 2,
    ㅎ: 3,
    ㅏ: 1,
    ㅐ: 1,
    ㅑ: 1,
    ㅒ: 2,
    ㅓ: 1,
    ㅔ: 2,
    ㅕ: 1,
    ㅖ: 2,
    ㅗ: 1,
    ㅛ: 1,
    ㅜ: 1,
    ㅠ: 1,
    ㅡ: 1,
    ㅣ: 1,
  },
} as const

export function getUndrawableSyllablesInWord(word: Hangul.Word): string {
  return Array.from(FONT.undrawableSyllables).reduce((result, syllable) => {
    if (word.value.includes(syllable) && !result.includes(syllable)) {
      return result + syllable
    } else {
      return result
    }
  }, '')
}

let fontInstance: opentype.Font | undefined
let loading = false

async function loadFont() {
  if (loading) {
    while (loading) {
      await new Promise((r) => setTimeout(r, 100))
    }
  }

  if (fontInstance) {
    return
  }

  loading = true
  for (const url of FONT.urls) {
    // TODO use cache when available?
    fontInstance = await opentype.load(url).catch(() => undefined)
    if (fontInstance) {
      break
    }
  }
  loading = false
}

async function getPath(str: string): Promise<opentype.Path> {
  await loadFont()
  if (!fontInstance) {
    throw new Error('failed to load font')
  }
  return fontInstance.charToGlyph(str).getPath(0, FONT.fontSize, FONT.fontSize)
}

export async function getDrawableString(str: string): Promise<DrawableString> {
  const path = await getPath(str)
  return {
    value: str,
    path: getDPropertyFromPathCommands(path.commands),
    boundingBox: path.getBoundingBox(),
  }
}

export async function getDrawableSyllable(
  syllable: Hangul.Syllable
): Promise<DrawableSyllable> {
  const path = await getPath(syllable.value)
  const closedPaths: ClosedPath[] = getClosedPaths(path)
  const drawableSyllable: DrawableSyllable = {
    ...syllable,
    ...getJamoPaths(syllable, closedPaths),
    boundingBox: path.getBoundingBox(),
  }
  return drawableSyllable
}

interface ClosedPath {
  readonly commands: readonly opentype.PathCommand[]
  readonly center: {
    readonly x: number
    readonly y: number
  }
}

function getClosedPaths(glyphPath: opentype.Path): ClosedPath[] {
  const closedPaths: ClosedPath[] = []

  let paths: opentype.PathCommand[] = []
  let center_x = 0
  let center_y = 0
  glyphPath.commands.forEach((command) => {
    paths.push(command)
    if (command.type !== 'Z') {
      center_x += command.x
      center_y += command.y
    } else {
      closedPaths.push({
        commands: [...paths],
        center: {
          x: center_x / paths.length,
          y: center_y / paths.length,
        },
      })
      paths = []
      center_x = 0
      center_y = 0
    }
  })

  return closedPaths
}

interface JamoPaths {
  readonly leadingConsonantPath: DProperty
  readonly vowelPaths: readonly DProperty[]
  readonly trailingConsonantPaths: readonly DProperty[]
}

// Comparison functions to sort ClosedPath[] by their center points
const compareByXDesc = (a: ClosedPath, b: ClosedPath) => b.center.x - a.center.x
const compareByYAsc = (a: ClosedPath, b: ClosedPath) => a.center.y - b.center.y
const compareByXYDesc = (a: ClosedPath, b: ClosedPath) =>
  b.center.x - a.center.x + b.center.y - a.center.y

function getJamoPaths(
  syllable: Hangul.Syllable,
  closedPaths: ClosedPath[]
): JamoPaths {
  const paths = [...closedPaths]
  const pathCounts = {
    leadingConsonant: FONT.jamoClosedPathCount[syllable.leadingConsonant],
    vowels: syllable.vowels.map((vowel) => FONT.jamoClosedPathCount[vowel]),
    trailingConsonants: syllable.trailingConsonants.map(
      (consonant) => FONT.jamoClosedPathCount[consonant]
    ),
  }

  // l paths placed at top left are for leading consonant
  const l = pathCounts.leadingConsonant
  const lPaths = sortAndSplice(paths, compareByXYDesc, l)

  // t paths placed at bottom are for trailing consonant
  const t = pathCounts.trailingConsonants.reduce((a, b) => a + b, 0)
  const tPaths = sortAndSplice(paths, compareByYAsc, t)
  const trailingConsonantPath = pathCounts.trailingConsonants.map(
    // Decompose paths for each trailing consonant
    (n) => sortAndSplice(tPaths, compareByXDesc, n)
  )

  // Remaining paths are for vowels
  const vPaths = [...paths]
  const vowelPaths = pathCounts.vowels.map(
    // Decompose paths for each vowels
    (n) => sortAndSplice(vPaths, compareByXDesc, n)
  )

  return {
    leadingConsonantPath: getDProperty(lPaths),
    vowelPaths: vowelPaths.map(getDProperty),
    trailingConsonantPaths: trailingConsonantPath.map(getDProperty),
  }
}

/**
 * Sort given array and splice last n elements.
 *
 * This function will modify the array.
 *
 * @param array array to apply sort and splice
 * @param compareFn comparison function to sort the array
 * @param lastN number of elements to splice
 * @return spliced elements
 * @see {@link Array.sort} and {@link Array.splice}
 */
function sortAndSplice<T>(
  array: T[],
  compareFn: (a: T, b: T) => number,
  lastN: number
): T[] {
  if (array.length != lastN) {
    array.sort(compareFn)
  }
  return array.splice(-lastN, lastN)
}

function getDProperty(
  paths: readonly ClosedPath[],
  fractionDigits = 2
): DProperty {
  const commands = paths.flatMap((path) => path.commands)
  return getDPropertyFromPathCommands(commands, fractionDigits)
}

function getDPropertyFromPathCommands(
  commands: readonly opentype.PathCommand[],
  fractionDigits = 2
): DProperty {
  let d = ''
  commands.forEach((command) => {
    d += command.type
    let coords: number[] = []
    if (command.type === 'M' || command.type === 'L') {
      coords = [command.x, command.y]
    } else if (command.type === 'C') {
      coords = [
        command.x1,
        command.y1,
        command.x2,
        command.y2,
        command.x,
        command.y,
      ]
    } else if (command.type === 'Q') {
      coords = [command.x1, command.y1, command.x, command.y]
    }
    d += coords.map((n) => n.toFixed(fractionDigits)).join(' ')
  })
  return d
}
