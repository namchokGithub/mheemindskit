export function convertNumberBase(input: string, sourceBase: number, targetBase: number): string {
  const value = input.trim().replace(/^[-+]?0[xX]/, '').replace(/^[-+]?0[oO]/, '').replace(/^[-+]?0[bB]/, '')
  const sign = input.trim().startsWith('-') ? -1n : 1n
  const digits = '0123456789abcdef'.slice(0, sourceBase)
  if (!value || [...value.toLowerCase()].some((character) => !digits.includes(character))) throw new Error(`Enter a valid base-${sourceBase} number.`)
  const number = [...value.toLowerCase()].reduce((total, character) => total * BigInt(sourceBase) + BigInt(digits.indexOf(character)), 0n) * sign
  return number.toString(targetBase).toUpperCase()
}

type Rgba = { red: number; green: number; blue: number; alpha: number }

function validChannel(value: number) {
  return Number.isFinite(value) && value >= 0 && value <= 255
}

function fromHex(input: string): Rgba | null {
  const value = input.trim().replace(/^#/, '')
  if (!/^[0-9a-f]{3,4}$|^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(value)) return null
  const expanded = value.length < 5 ? [...value].map((character) => character.repeat(2)).join('') : value
  return { red: Number.parseInt(expanded.slice(0, 2), 16), green: Number.parseInt(expanded.slice(2, 4), 16), blue: Number.parseInt(expanded.slice(4, 6), 16), alpha: expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1 }
}

function fromRgb(input: string): Rgba | null {
  const match = input.trim().match(/^rgba?\(\s*([\d.]+)[,\s]+\s*([\d.]+)[,\s]+\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i)
  if (!match) return null
  const [red, green, blue, alpha = 1] = match.slice(1).map(Number)
  return validChannel(red) && validChannel(green) && validChannel(blue) && alpha >= 0 && alpha <= 1 ? { red, green, blue, alpha } : null
}

function hueToRgb(first: number, second: number, hue: number) {
  const normalized = (hue + 1) % 1
  if (normalized * 6 < 1) return first + (second - first) * 6 * normalized
  if (normalized * 2 < 1) return second
  if (normalized * 3 < 2) return first + (second - first) * (2 / 3 - normalized) * 6
  return first
}

function fromHsl(input: string): Rgba | null {
  const match = input.trim().match(/^hsla?\(\s*([\d.]+)(?:deg)?[,\s]+\s*([\d.]+)%[,\s]+\s*([\d.]+)%(?:\s*[,/]\s*([\d.]+))?\s*\)$/i)
  if (!match) return null
  const [rawHue, rawSaturation, rawLightness, rawAlpha = 1] = match.slice(1).map(Number)
  if (rawSaturation > 100 || rawLightness > 100 || rawAlpha < 0 || rawAlpha > 1) return null
  const hue = ((rawHue % 360) + 360) % 360 / 360
  const saturation = rawSaturation / 100
  const lightness = rawLightness / 100
  const second = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation
  const first = 2 * lightness - second
  return { red: Math.round(hueToRgb(first, second, hue + 1 / 3) * 255), green: Math.round(hueToRgb(first, second, hue) * 255), blue: Math.round(hueToRgb(first, second, hue - 1 / 3) * 255), alpha: rawAlpha }
}

function toHsl({ red, green, blue, alpha }: Rgba): string {
  const [r, g, b] = [red / 255, green / 255, blue / 255]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2
  const delta = max - min
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
  const hue = delta === 0 ? 0 : ((max === r ? (g - b) / delta : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4) * 60 + 360) % 360
  const label = alpha === 1 ? 'hsl' : 'hsla'
  return `${label}(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%${alpha === 1 ? '' : `, ${Number(alpha.toFixed(2))}`})`
}

export function convertColor(input: string): { output: string; cssValue: string } {
  const color = fromHex(input) ?? fromRgb(input) ?? fromHsl(input)
  if (!color) throw new Error('Enter a valid HEX, RGB(A), or HSL(A) color.')
  const hex = `#${[color.red, color.green, color.blue].map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}${color.alpha === 1 ? '' : Math.round(color.alpha * 255).toString(16).padStart(2, '0')}`.toUpperCase()
  const rgb = `${color.alpha === 1 ? 'rgb' : 'rgba'}(${Math.round(color.red)}, ${Math.round(color.green)}, ${Math.round(color.blue)}${color.alpha === 1 ? '' : `, ${Number(color.alpha.toFixed(2))}`})`
  return { output: `HEX: ${hex}\nRGB: ${rgb}\nHSL: ${toHsl(color)}`, cssValue: hex }
}

export function formatDate(input: string, timeZone: string): string {
  const trimmed = input.trim()
  const timestamp = /^\d{10}$/.test(trimmed) ? Number(trimmed) * 1000 : /^\d{13}$/.test(trimmed) ? Number(trimmed) : Date.parse(trimmed)
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) throw new Error('Enter a valid date, ISO date-time, or Unix timestamp.')
  const options = { timeZone: timeZone === 'browser' ? undefined : timeZone }
  const formatted = (settings: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { ...options, ...settings }).format(date)
  return [`ISO 8601 (UTC): ${date.toISOString()}`, `Date: ${formatted({ year: 'numeric', month: '2-digit', day: '2-digit' })}`, `Long date: ${formatted({ year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}`, `Time: ${formatted({ hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZoneName: 'short' })}`, `Unix seconds: ${Math.floor(date.getTime() / 1000)}`, `Unix milliseconds: ${date.getTime()}`].join('\n')
}
