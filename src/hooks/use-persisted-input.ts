import { useEffect, useState } from 'react'

function readStoredValue(storageKey: string): string {
  try {
    return localStorage.getItem(storageKey) ?? ''
  } catch {
    return ''
  }
}

export function usePersistedInput(key: string) {
  const storageKey = `mindskit:input:${key}`
  const [value, setValue] = useState(() => readStoredValue(storageKey))

  useEffect(() => {
    try {
      if (value) {
        localStorage.setItem(storageKey, value)
      } else {
        localStorage.removeItem(storageKey)
      }
    } catch {
      // localStorage unavailable (private mode, quota, etc.) — ignore
    }
  }, [storageKey, value])

  return [value, setValue] as const
}
