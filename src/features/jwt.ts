export interface DecodedJwt {
  header: string
  payload: string
  signature: string
  expiresAt?: Date
  isExpired?: boolean
}

function decodeBase64Url(value: string): string {
  if (!value) throw new Error('The token is missing a required section.')

  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(base64 + padding)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function formatJson(value: string, section: string): { formatted: string; data: unknown } {
  try {
    const data: unknown = JSON.parse(value)
    return { formatted: JSON.stringify(data, null, 2), data }
  } catch {
    throw new Error(`The JWT ${section} is not valid JSON.`)
  }
}

export function decodeJwt(token: string): DecodedJwt {
  const compactToken = token.trim().replace(/^Bearer\s+/i, '')
  const parts = compactToken.split('.')

  if (parts.length !== 3) {
    throw new Error('Enter a compact JWT with header, payload, and signature sections.')
  }

  try {
    const header = formatJson(decodeBase64Url(parts[0]), 'header')
    const payload = formatJson(decodeBase64Url(parts[1]), 'payload')
    const expiresAt = isRecord(payload.data) && typeof payload.data.exp === 'number'
      ? new Date(payload.data.exp * 1000)
      : undefined

    return {
      header: header.formatted,
      payload: payload.formatted,
      signature: parts[2],
      expiresAt,
      isExpired: expiresAt ? expiresAt.getTime() <= Date.now() : undefined,
    }
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Unable to decode this JWT.')
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
