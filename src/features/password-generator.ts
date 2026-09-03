export type PasswordMode = 'random' | 'memorable' | 'pin'

export type PasswordOptions = {
  mode: PasswordMode
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  symbolSet: string
  excludedCharacters: string
  excludeAmbiguous: boolean
}

export type PasswordResult = {
  value: string
  entropy: number
  score: 0 | 1 | 2 | 3 | 4
  label: 'Very weak' | 'Weak' | 'Fair' | 'Good' | 'Strong'
}

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const AMBIGUOUS = 'O0oIl1|`\'"'
const WORDS = ['amber', 'anchor', 'atlas', 'bamboo', 'beacon', 'birch', 'canyon', 'cedar', 'cinder', 'comet', 'coral', 'crystal', 'dawn', 'ember', 'falcon', 'fern', 'forest', 'glacier', 'harbor', 'indigo', 'jasmine', 'lagoon', 'maple', 'meadow', 'meteor', 'moon', 'moss', 'ocean', 'orbit', 'pebble', 'pine', 'quartz', 'raven', 'river', 'sage', 'solstice', 'sparrow', 'summit', 'thunder', 'topaz', 'valley', 'violet', 'willow', 'winter', 'zenith']

function randomIndex(length: number) {
  const limit = Math.floor(0x1_0000_0000 / length) * length
  const values = new Uint32Array(1)
  do crypto.getRandomValues(values)
  while (values[0] >= limit)
  return values[0] % length
}

function randomCharacter(characters: string) {
  return characters[randomIndex(characters.length)]
}

function shuffle(values: string[]) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const next = randomIndex(index + 1)
    ;[values[index], values[next]] = [values[next], values[index]]
  }
  return values.join('')
}

function filterCharacters(value: string, options: PasswordOptions) {
  const excluded = new Set(`${options.excludedCharacters}${options.excludeAmbiguous ? AMBIGUOUS : ''}`)
  return [...value].filter((character) => !excluded.has(character)).join('')
}

function getScore(entropy: number): PasswordResult['score'] {
  if (entropy < 28) return 0
  if (entropy < 40) return 1
  if (entropy < 60) return 2
  if (entropy < 80) return 3
  return 4
}

const labels: PasswordResult['label'][] = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']

function createResult(value: string, entropy: number): PasswordResult {
  const score = getScore(entropy)
  return { value, entropy, score, label: labels[score] }
}

function generateRandom(options: PasswordOptions) {
  const groups = [
    options.uppercase ? filterCharacters(UPPERCASE, options) : '',
    options.lowercase ? filterCharacters(LOWERCASE, options) : '',
    options.numbers ? filterCharacters(NUMBERS, options) : '',
    options.symbols ? filterCharacters(options.symbolSet, options) : '',
  ].filter(Boolean)
  if (!groups.length) throw new Error('Choose at least one character group.')
  if (options.length < groups.length) throw new Error(`Choose a length of at least ${groups.length} to include every selected group.`)
  const alphabet = groups.join('')
  const value = groups.map(randomCharacter)
  while (value.length < options.length) value.push(randomCharacter(alphabet))
  return createResult(shuffle(value), Math.log2(alphabet.length) * options.length)
}

function generateMemorable(options: PasswordOptions) {
  const count = Math.max(3, Math.min(6, options.length))
  const selected: string[] = []
  while (selected.length < count) {
    const word = WORDS[randomIndex(WORDS.length)]
    if (!selected.includes(word)) selected.push(word)
  }
  const words = selected.map((word) => options.uppercase ? `${word[0].toUpperCase()}${word.slice(1)}` : word)
  const suffix = options.numbers ? String(randomIndex(900) + 100) : ''
  const separator = options.symbols ? '-' : ''
  const value = `${words.join(separator)}${suffix ? `${separator}${suffix}` : ''}`
  const entropy = Math.log2(WORDS.length) * count + (options.numbers ? Math.log2(900) : 0)
  return createResult(value, entropy)
}

function generatePin(options: PasswordOptions) {
  const length = Math.max(4, Math.min(12, options.length))
  const digits = filterCharacters(NUMBERS, options)
  if (digits.length < 2) throw new Error('Keep at least two digits available for a PIN.')
  const value = Array.from({ length }, () => randomCharacter(digits)).join('')
  return createResult(value, Math.log2(digits.length) * length)
}

export function generatePassword(options: PasswordOptions): PasswordResult {
  if (options.mode === 'memorable') return generateMemorable(options)
  if (options.mode === 'pin') return generatePin(options)
  return generateRandom(options)
}
