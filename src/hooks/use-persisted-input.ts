import { useEffect, useState } from 'react'

function readStoredValue(storageKey: string): string {
  try {
    return localStorage.getItem(storageKey) ?? ''
  } catch {
    return ''
  }
}

export function usePersistedInput(key: string, enabled: boolean) {
  const storageKey = `mindskit:input:${key}`
  const [value, setValue] = useState(() => (enabled ? readStoredValue(storageKey) : ''))

  useEffect(() => {
    try {
      if (!enabled) {
        localStorage.removeItem(storageKey)
        return
      }
      if (value) {
        localStorage.setItem(storageKey, value)
      } else {
        localStorage.removeItem(storageKey)
      }
    } catch {
      // localStorage unavailable (private mode, quota, etc.) — ignore
    }
  }, [storageKey, enabled, value])

  return [value, setValue] as const
}
