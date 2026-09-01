function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

export const quickOperations = {
  base64: [{ label: 'Encode', value: 'encode' }, { label: 'Decode', value: 'decode' }],
  url: [{ label: 'Encode', value: 'encode' }, { label: 'Decode', value: 'decode' }],
  html: [{ label: 'Encode', value: 'encode' }, { label: 'Decode', value: 'decode' }],
  timestamp: [{ label: 'Timestamp → Date', value: 'to-date' }, { label: 'Date → Timestamp', value: 'to-timestamp' }],
} as const

export function convertBase64(input: string, operation: string): string {
  try {
    return operation === 'decode'
      ? new TextDecoder().decode(base64ToBytes(input))
      : bytesToBase64(new TextEncoder().encode(input))
  } catch {
    return 'Invalid Base64 input.'
  }
}

export function convertUrl(input: string, operation: string): string {
  try {
    return operation === 'decode' ? decodeURIComponent(input) : encodeURIComponent(input)
  } catch {
    return 'Invalid URL-encoded input.'
  }
}

export function convertHtml(input: string, operation: string): string {
  const element = document.createElement('textarea')
  if (operation === 'decode') {
    element.innerHTML = input
    return element.value
  }
  element.textContent = input
  return element.innerHTML
}

export function convertTimestamp(input: string, operation: string): string {
  const date = operation === 'to-date' ? new Date(Number(input) * 1000) : new Date(input)
  if (Number.isNaN(date.getTime())) return 'Enter a valid timestamp or date.'
  return operation === 'to-date' ? date.toISOString() : String(Math.floor(date.getTime() / 1000))
}
